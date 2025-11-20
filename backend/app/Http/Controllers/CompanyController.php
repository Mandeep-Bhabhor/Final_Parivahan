<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class CompanyController extends Controller
{
    public function index(Request $request)
    {
        // Only for super admin if needed
        $companies = Company::with('users')->get();
        return response()->json($companies);
    }

    public function show(Request $request)
    {
        $company = $request->user()->company;
        
        if (!$company) {
            return response()->json(['error' => 'No company associated'], 404);
        }

        return response()->json($company->load(['users', 'warehouses', 'vehicles']));
    }

    public function addUser(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'company_admin') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|in:staff,driver',
            'is_driver' => 'required|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $newUser = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'company_id' => $user->company_id,
            'role' => $request->role,
            'is_driver' => $request->is_driver,
        ]);

        return response()->json($newUser, 201);
    }

    public function getUsers(Request $request)
    {
        $user = $request->user();

        if (!in_array($user->role, ['company_admin', 'staff'])) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $users = User::where('company_id', $user->company_id)->get();

        return response()->json($users);
    }
}
