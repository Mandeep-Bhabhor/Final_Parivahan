<?php

namespace App\Http\Controllers;

use App\Models\Vehicle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class VehicleController extends Controller
{
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

    public function store(Request $request)
    {
        $user = $request->user();

        if (!in_array($user->role, ['company_admin', 'staff'])) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'vehicle_number' => 'required|string|max:50|unique:vehicles,vehicle_number',
            'type' => 'required|string|max:50',
            'warehouse_id' => 'nullable|exists:warehouses,id',
            'max_weight' => 'required|numeric|min:50|max:50000',
            'max_volume' => 'required|numeric|min:10|max:10000',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
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
            'type' => 'sometimes|string|max:50',
            'warehouse_id' => 'nullable|exists:warehouses,id',
            'max_weight' => 'sometimes|numeric|min:50|max:50000',
            'max_volume' => 'sometimes|numeric|min:10|max:10000',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
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
