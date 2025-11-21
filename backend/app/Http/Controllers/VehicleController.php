<?php

namespace App\Http\Controllers;

use App\Models\Vehicle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class VehicleController extends Controller
{
    // Standard vehicle capacities
    protected $vehicleCapacities = [
        'Truck' => ['max_weight' => 10000, 'max_volume' => 50],
        'Van' => ['max_weight' => 1500, 'max_volume' => 15],
        'Pickup' => ['max_weight' => 1000, 'max_volume' => 5],
        'Trailer' => ['max_weight' => 25000, 'max_volume' => 100],
        'Box Truck' => ['max_weight' => 5000, 'max_volume' => 30],
    ];

    public function index(Request $request)
    {
        $user = $request->user();

        if (!in_array($user->role, ['company_admin', 'staff'])) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $vehicles = Vehicle::where('company_id', $user->company_id)
            ->with('warehouse')
            ->get();

        return response()->json($vehicles);
    }

    public function getCapacities()
    {
        return response()->json($this->vehicleCapacities);
    }

    public function store(Request $request)
    {
        $user = $request->user();

        if (!in_array($user->role, ['company_admin', 'staff'])) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'vehicle_number' => 'required|string|max:50|unique:vehicles,vehicle_number',
            'type' => 'required|string|in:Truck,Van,Pickup,Trailer,Box Truck',
            'warehouse_id' => 'nullable|exists:warehouses,id',
            'max_weight' => 'required|numeric',
            'max_volume' => 'required|numeric',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Validate capacities match the standard for the vehicle type
        $expectedCapacity = $this->vehicleCapacities[$request->type];
        if ($request->max_weight != $expectedCapacity['max_weight'] || 
            $request->max_volume != $expectedCapacity['max_volume']) {
            return response()->json([
                'error' => 'Invalid capacity for vehicle type',
                'expected' => $expectedCapacity,
                'received' => [
                    'max_weight' => $request->max_weight,
                    'max_volume' => $request->max_volume
                ]
            ], 422);
        }

        $vehicle = Vehicle::create([
            'company_id' => $user->company_id,
            'warehouse_id' => $request->warehouse_id,
            'vehicle_number' => $request->vehicle_number,
            'type' => $request->type,
            'max_weight' => $request->max_weight,
            'max_volume' => $request->max_volume,
            'current_weight' => 0,
            'current_volume' => 0,
        ]);

        return response()->json($vehicle->load('warehouse'), 201);
    }

    public function show(Request $request, $id)
    {
        $user = $request->user();

        $vehicle = Vehicle::where('company_id', $user->company_id)
            ->where('id', $id)
            ->with('warehouse')
            ->first();

        if (!$vehicle) {
            return response()->json(['error' => 'Vehicle not found'], 404);
        }

        return response()->json($vehicle);
    }

    public function update(Request $request, $id)
    {
        $user = $request->user();

        if (!in_array($user->role, ['company_admin', 'staff'])) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $vehicle = Vehicle::where('company_id', $user->company_id)
            ->where('id', $id)
            ->first();

        if (!$vehicle) {
            return response()->json(['error' => 'Vehicle not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'vehicle_number' => 'sometimes|string|max:50|unique:vehicles,vehicle_number,' . $id,
            'type' => 'sometimes|string|in:Truck,Van,Pickup,Trailer,Box Truck',
            'warehouse_id' => 'nullable|exists:warehouses,id',
            'max_weight' => 'sometimes|numeric',
            'max_volume' => 'sometimes|numeric',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // If type is being updated, validate capacities match the standard
        if ($request->has('type')) {
            $expectedCapacity = $this->vehicleCapacities[$request->type];
            if ($request->max_weight != $expectedCapacity['max_weight'] || 
                $request->max_volume != $expectedCapacity['max_volume']) {
                return response()->json([
                    'error' => 'Invalid capacity for vehicle type',
                    'expected' => $expectedCapacity,
                    'received' => [
                        'max_weight' => $request->max_weight,
                        'max_volume' => $request->max_volume
                    ]
                ], 422);
            }
        }

        $vehicle->update($request->only([
            'vehicle_number', 'type', 'warehouse_id', 'max_weight', 'max_volume'
        ]));

        return response()->json($vehicle->load('warehouse'));
    }

    public function destroy(Request $request, $id)
    {
        $user = $request->user();

        if ($user->role !== 'company_admin') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $vehicle = Vehicle::where('company_id', $user->company_id)
            ->where('id', $id)
            ->first();

        if (!$vehicle) {
            return response()->json(['error' => 'Vehicle not found'], 404);
        }

        $vehicle->delete();

        return response()->json(['message' => 'Vehicle deleted successfully']);
    }
}
