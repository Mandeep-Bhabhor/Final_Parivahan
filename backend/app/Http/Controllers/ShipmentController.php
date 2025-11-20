<?php

namespace App\Http\Controllers;

use App\Models\Shipment;
use App\Models\Parcel;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class ShipmentController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->role === 'driver') {
            $shipments = Shipment::where('driver_id', $user->id)
                ->with(['driver', 'vehicle', 'warehouse', 'parcels'])
                ->get();
        } else if (in_array($user->role, ['company_admin', 'staff'])) {
            $shipments = Shipment::where('company_id', $user->company_id)
                ->with(['driver', 'vehicle', 'warehouse', 'parcels'])
                ->get();
        } else {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        return response()->json($shipments);
    }

    public function store(Request $request)
    {
        $user = $request->user();

        if (!in_array($user->role, ['company_admin', 'staff'])) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'driver_id' => 'required|exists:users,id',
            'vehicle_id' => 'required|exists:vehicles,id',
            'warehouse_id' => 'required|exists:warehouses,id',
            'parcel_ids' => 'required|array',
            'parcel_ids.*' => 'exists:parcels,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        DB::beginTransaction();

        try {
            // Verify driver is available
            $driver = \App\Models\User::where('id', $request->driver_id)
                ->where('company_id', $user->company_id)
                ->where('is_driver', true)
                ->first();

            if (!$driver) {
                DB::rollBack();
                return response()->json(['error' => 'Driver not found'], 404);
            }

            // Check if driver has active shipment
            $activeShipment = Shipment::where('driver_id', $driver->id)
                ->whereIn('status', ['pending', 'loading', 'in_transit'])
                ->exists();

            if ($activeShipment) {
                DB::rollBack();
                return response()->json(['error' => 'Driver already has an active shipment'], 400);
            }

            // Get parcels
            $parcels = Parcel::whereIn('id', $request->parcel_ids)
                ->where('company_id', $user->company_id)
                ->where('status', 'accepted')
                ->get();

            if ($parcels->count() !== count($request->parcel_ids)) {
                DB::rollBack();
                return response()->json(['error' => 'Some parcels are not available'], 400);
            }

            // Calculate totals
            $totalWeight = $parcels->sum('weight');
            $totalVolume = $parcels->sum('volume');

            // Check vehicle capacity
            $vehicle = Vehicle::find($request->vehicle_id);
            if ($vehicle->max_weight < $totalWeight || $vehicle->max_volume < $totalVolume) {
                DB::rollBack();
                return response()->json(['error' => 'Vehicle capacity exceeded'], 400);
            }

            // Create shipment
            $shipment = Shipment::create([
                'company_id' => $user->company_id,
                'driver_id' => $request->driver_id,
                'vehicle_id' => $request->vehicle_id,
                'warehouse_id' => $request->warehouse_id,
                'total_weight' => $totalWeight,
                'total_volume' => $totalVolume,
                'status' => 'pending',
            ]);

            // Attach parcels
            $shipment->parcels()->attach($request->parcel_ids);

            // Update parcels
            Parcel::whereIn('id', $request->parcel_ids)->update([
                'assigned_shipment_id' => $shipment->id,
                'status' => 'stored',
            ]);

            // Update vehicle capacity
            $vehicle->increment('current_weight', $totalWeight);
            $vehicle->increment('current_volume', $totalVolume);

            DB::commit();

            return response()->json($shipment->load(['driver', 'vehicle', 'warehouse', 'parcels']), 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Failed to create shipment: ' . $e->getMessage()], 500);
        }
    }

    public function show(Request $request, $id)
    {
        $user = $request->user();

        $query = Shipment::where('id', $id);

        if ($user->role === 'driver') {
            $query->where('driver_id', $user->id);
        } else {
            $query->where('company_id', $user->company_id);
        }

        $shipment = $query->with(['driver', 'vehicle', 'warehouse', 'parcels'])->first();

        if (!$shipment) {
            return response()->json(['error' => 'Shipment not found'], 404);
        }

        return response()->json($shipment);
    }

    public function updateStatus(Request $request, $id)
    {
        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'status' => 'required|in:loading,in_transit,completed',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $query = Shipment::where('id', $id);

        if ($user->role === 'driver') {
            $query->where('driver_id', $user->id);
        } else {
            $query->where('company_id', $user->company_id);
        }

        $shipment = $query->first();

        if (!$shipment) {
            return response()->json(['error' => 'Shipment not found'], 404);
        }

        DB::beginTransaction();

        try {
            $shipment->update(['status' => $request->status]);

            // Update parcel statuses based on shipment status
            if ($request->status === 'loading') {
                $shipment->parcels()->update(['status' => 'loaded']);
            } else if ($request->status === 'in_transit') {
                $shipment->parcels()->update(['status' => 'dispatched']);
            } else if ($request->status === 'completed') {
                $shipment->parcels()->update(['status' => 'delivered']);
                
                // Free up vehicle capacity
                $vehicle = $shipment->vehicle;
                $vehicle->decrement('current_weight', $shipment->total_weight);
                $vehicle->decrement('current_volume', $shipment->total_volume);
            }

            DB::commit();

            return response()->json($shipment->load(['parcels']));
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Failed to update status: ' . $e->getMessage()], 500);
        }
    }
}
