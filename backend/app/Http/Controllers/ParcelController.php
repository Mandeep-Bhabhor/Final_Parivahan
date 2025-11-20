<?php

namespace App\Http\Controllers;

use App\Models\Parcel;
use App\Models\Shipment;
use App\Models\Vehicle;
use App\Services\DistanceService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ParcelController extends Controller
{
    protected $distanceService;

    public function __construct(DistanceService $distanceService)
    {
        $this->distanceService = $distanceService;
    }

    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->role === 'customer') {
            $parcels = Parcel::where('customer_id', $user->id)
                ->with(['company', 'warehouse', 'shipment'])
                ->get();
        } else {
            $parcels = Parcel::where('company_id', $user->company_id)
                ->with(['customer', 'warehouse', 'shipment'])
                ->get();
        }

        return response()->json($parcels);
    }

    public function store(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'customer') {
            return response()->json(['error' => 'Only customers can create parcels'], 403);
        }

        $validator = Validator::make($request->all(), [
            'company_id' => 'required|exists:companies,id',
            'pickup_address' => 'required|string|max:500',
            'delivery_address' => 'required|string|max:500',
            'pickup_latitude' => 'required|numeric|between:-90,90',
            'pickup_longitude' => 'required|numeric|between:-180,180',
            'delivery_latitude' => 'required|numeric|between:-90,90',
            'delivery_longitude' => 'required|numeric|between:-180,180',
            'weight' => 'required|numeric|min:0.1|max:1000',
            'height' => 'required|numeric|min:0.01|max:10',
            'width' => 'required|numeric|min:0.01|max:10',
            'length' => 'required|numeric|min:0.01|max:10',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Auto-calculate volume
        $volume = $request->height * $request->width * $request->length;

        // Validate volume doesn't exceed maximum vehicle capacity
        if ($volume > 500) {
            return response()->json([
                'error' => 'Calculated volume exceeds maximum vehicle capacity',
                'calculated_volume' => round($volume, 2),
                'max_volume' => 500
            ], 422);
        }

        // Calculate quoted price (simple formula: base on weight and volume)
        $quotedPrice = ($request->weight * 10) + ($volume * 5);

        $parcel = Parcel::create([
            'customer_id' => $user->id,
            'company_id' => $request->company_id,
            'pickup_address' => $request->pickup_address,
            'delivery_address' => $request->delivery_address,
            'pickup_latitude' => $request->pickup_latitude,
            'pickup_longitude' => $request->pickup_longitude,
            'delivery_latitude' => $request->delivery_latitude,
            'delivery_longitude' => $request->delivery_longitude,
            'weight' => $request->weight,
            'height' => $request->height,
            'width' => $request->width,
            'length' => $request->length,
            'volume' => $volume,
            'quoted_price' => $quotedPrice,
            'status' => 'pending',
        ]);

        return response()->json($parcel, 201);
    }

    public function show(Request $request, $id)
    {
        $user = $request->user();

        $query = Parcel::where('id', $id);

        if ($user->role === 'customer') {
            $query->where('customer_id', $user->id);
        } else {
            $query->where('company_id', $user->company_id);
        }

        $parcel = $query->with(['customer', 'warehouse', 'shipment'])->first();

        if (!$parcel) {
            return response()->json(['error' => 'Parcel not found'], 404);
        }

        return response()->json($parcel);
    }

    public function accept(Request $request, $id)
    {
        $user = $request->user();

        if (!in_array($user->role, ['company_admin', 'staff'])) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $parcel = Parcel::where('company_id', $user->company_id)
            ->where('id', $id)
            ->where('status', 'pending')
            ->first();

        if (!$parcel) {
            return response()->json(['error' => 'Parcel not found or already processed'], 404);
        }

        DB::beginTransaction();

        try {
            // Find nearest warehouse
            $warehouse = $this->distanceService->findNearestWarehouse(
                $parcel->pickup_latitude,
                $parcel->pickup_longitude,
                $user->company_id
            );

            if (!$warehouse) {
                DB::rollBack();
                return response()->json(['error' => 'No warehouse available'], 400);
            }

            // Update parcel status and assign warehouse
            $parcel->update([
                'status' => 'accepted',
                'assigned_warehouse_id' => $warehouse->id,
            ]);

            // Auto-create shipment
            $assignmentResult = $this->autoAssignToShipment($parcel);

            DB::commit();

            // Reload parcel to get updated status and relationships
            $parcel->refresh();

            return response()->json([
                'parcel' => $parcel->load(['warehouse', 'shipment']),
                'auto_assigned' => $parcel->status === 'stored',
                'message' => $parcel->status === 'stored' 
                    ? 'Parcel accepted and assigned to shipment' 
                    : 'Parcel accepted but waiting for driver/vehicle availability'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Failed to accept parcel: ' . $e->getMessage()], 500);
        }
    }

    public function reject(Request $request, $id)
    {
        $user = $request->user();

        if (!in_array($user->role, ['company_admin', 'staff'])) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $parcel = Parcel::where('company_id', $user->company_id)
            ->where('id', $id)
            ->where('status', 'pending')
            ->first();

        if (!$parcel) {
            return response()->json(['error' => 'Parcel not found or already processed'], 404);
        }

        $parcel->update(['status' => 'rejected']);

        return response()->json($parcel);
    }

    protected function autoAssignToShipment($parcel)
    {
        \Log::info("Auto-assigning parcel {$parcel->id} to shipment");

        // First, try to find an existing pending shipment at the same warehouse with capacity
        $existingShipment = Shipment::where('company_id', $parcel->company_id)
            ->where('warehouse_id', $parcel->assigned_warehouse_id)
            ->where('status', 'pending')
            ->whereHas('vehicle', function ($query) use ($parcel) {
                $query->whereRaw('(max_weight - current_weight) >= ?', [$parcel->weight])
                      ->whereRaw('(max_volume - current_volume) >= ?', [$parcel->volume]);
            })
            ->with('vehicle')
            ->first();

        if ($existingShipment) {
            \Log::info("Found existing shipment {$existingShipment->id}, adding parcel");
            
            // Add parcel to existing shipment
            $existingShipment->parcels()->attach($parcel->id);

            // Update shipment totals
            $existingShipment->increment('total_weight', $parcel->weight);
            $existingShipment->increment('total_volume', $parcel->volume);

            // Update parcel
            $parcel->update([
                'assigned_shipment_id' => $existingShipment->id,
                'status' => 'stored',
            ]);

            // Update vehicle capacity
            $existingShipment->vehicle->increment('current_weight', $parcel->weight);
            $existingShipment->vehicle->increment('current_volume', $parcel->volume);

            return true;
        }

        \Log::info("No existing shipment found, creating new one");

        // No existing shipment found, create a new one
        // Find available driver (not currently assigned to active shipment)
        $driver = \App\Models\User::where('company_id', $parcel->company_id)
            ->where('is_driver', true)
            ->whereDoesntHave('shipments', function ($query) {
                $query->whereIn('status', ['pending', 'loading', 'in_transit']);
            })
            ->first();

        if (!$driver) {
            \Log::warning("No available driver found for parcel {$parcel->id}");
            return false; // No available driver
        }

        \Log::info("Found available driver: {$driver->id}");

        // Find suitable vehicle with enough capacity
        $vehicle = Vehicle::where('company_id', $parcel->company_id)
            ->where('warehouse_id', $parcel->assigned_warehouse_id)
            ->whereRaw('(max_weight - current_weight) >= ?', [$parcel->weight])
            ->whereRaw('(max_volume - current_volume) >= ?', [$parcel->volume])
            ->first();

        if (!$vehicle) {
            \Log::warning("No suitable vehicle found for parcel {$parcel->id} at warehouse {$parcel->assigned_warehouse_id}");
            return false; // No suitable vehicle
        }

        \Log::info("Found suitable vehicle: {$vehicle->id}");

        // Create new shipment
        $shipment = Shipment::create([
            'company_id' => $parcel->company_id,
            'driver_id' => $driver->id,
            'vehicle_id' => $vehicle->id,
            'warehouse_id' => $parcel->assigned_warehouse_id,
            'total_weight' => $parcel->weight,
            'total_volume' => $parcel->volume,
            'status' => 'pending',
        ]);

        \Log::info("Created new shipment: {$shipment->id}");

        // Attach parcel to shipment
        $shipment->parcels()->attach($parcel->id);

        // Update parcel
        $parcel->update([
            'assigned_shipment_id' => $shipment->id,
            'status' => 'stored',
        ]);

        // Update vehicle capacity
        $vehicle->increment('current_weight', $parcel->weight);
        $vehicle->increment('current_volume', $parcel->volume);

        \Log::info("Successfully assigned parcel {$parcel->id} to shipment {$shipment->id}");
        
        return true;
    }
}
