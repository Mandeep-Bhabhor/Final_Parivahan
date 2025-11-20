<?php

namespace App\Http\Controllers;

use App\Models\Warehouse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class WarehouseController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        if (!in_array($user->role, ['company_admin', 'staff'])) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $warehouses = Warehouse::where('company_id', $user->company_id)->get();

        return response()->json($warehouses);
    }

    public function store(Request $request)
    {
        $user = $request->user();

        if (!in_array($user->role, ['company_admin', 'staff'])) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'address' => 'required|string',
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'capacity_weight' => 'required|numeric|min:0',
            'capacity_volume' => 'required|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $warehouse = Warehouse::create([
            'company_id' => $user->company_id,
            'name' => $request->name,
            'address' => $request->address,
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
            'capacity_weight' => $request->capacity_weight,
            'capacity_volume' => $request->capacity_volume,
        ]);

        return response()->json($warehouse, 201);
    }

    public function show(Request $request, $id)
    {
        $user = $request->user();

        $warehouse = Warehouse::where('company_id', $user->company_id)
            ->where('id', $id)
            ->first();

        if (!$warehouse) {
            return response()->json(['error' => 'Warehouse not found'], 404);
        }

        return response()->json($warehouse);
    }

    public function update(Request $request, $id)
    {
        $user = $request->user();

        if (!in_array($user->role, ['company_admin', 'staff'])) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $warehouse = Warehouse::where('company_id', $user->company_id)
            ->where('id', $id)
            ->first();

        if (!$warehouse) {
            return response()->json(['error' => 'Warehouse not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'address' => 'sometimes|string',
            'latitude' => 'sometimes|numeric|between:-90,90',
            'longitude' => 'sometimes|numeric|between:-180,180',
            'capacity_weight' => 'sometimes|numeric|min:0',
            'capacity_volume' => 'sometimes|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $warehouse->update($request->only([
            'name', 'address', 'latitude', 'longitude', 'capacity_weight', 'capacity_volume'
        ]));

        return response()->json($warehouse);
    }

    public function destroy(Request $request, $id)
    {
        $user = $request->user();

        if ($user->role !== 'company_admin') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $warehouse = Warehouse::where('company_id', $user->company_id)
            ->where('id', $id)
            ->first();

        if (!$warehouse) {
            return response()->json(['error' => 'Warehouse not found'], 404);
        }

        $warehouse->delete();

        return response()->json(['message' => 'Warehouse deleted successfully']);
    }
}
