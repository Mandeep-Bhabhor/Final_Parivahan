<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\User;
use App\Models\Parcel;
use App\Models\Shipment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class SuperAdminController extends Controller
{
    // Dashboard statistics
    public function stats(Request $request)
    {
        $stats = [
            'total_companies' => Company::count(),
            'active_companies' => Company::where('is_active', true)->count(),
            'inactive_companies' => Company::where('is_active', false)->count(),
            'total_users' => User::where('role', '!=', 'super_admin')->count(),
            'company_admins' => User::where('role', 'company_admin')->count(),
            'staff' => User::where('role', 'staff')->count(),
            'drivers' => User::where('role', 'driver')->count(),
            'customers' => User::where('role', 'customer')->count(),
            'total_parcels' => Parcel::count(),
            'total_shipments' => Shipment::count(),
        ];

        return response()->json($stats);
    }

    // List all companies
    public function listCompanies(Request $request)
    {
        $companies = Company::withCount(['users', 'parcels', 'shipments'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($companies);
    }

    // Create new company
    public function createCompany(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'subdomain' => 'required|string|max:255|unique:companies,subdomain|alpha_dash',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $company = Company::create([
            'name' => $request->name,
            'subdomain' => $request->subdomain,
            'email' => $request->email,
            'phone' => $request->phone,
            'address' => $request->address,
            'is_active' => true,
        ]);

        return response()->json($company, 201);
    }

    // Get company details
    public function getCompany(Request $request, $id)
    {
        $company = Company::withCount(['users', 'warehouses', 'vehicles', 'parcels', 'shipments'])
            ->with(['users' => function($query) {
                $query->select('id', 'name', 'email', 'role', 'is_driver', 'company_id');
            }])
            ->findOrFail($id);

        return response()->json($company);
    }

    // Update company
    public function updateCompany(Request $request, $id)
    {
        $company = Company::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'subdomain' => 'sometimes|string|max:255|alpha_dash|unique:companies,subdomain,' . $id,
            'email' => 'sometimes|email|max:255',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:500',
            'is_active' => 'sometimes|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $company->update($request->only(['name', 'subdomain', 'email', 'phone', 'address', 'is_active']));

        return response()->json($company);
    }

    // Toggle company active status
    public function toggleCompanyStatus(Request $request, $id)
    {
        $company = Company::findOrFail($id);
        $company->is_active = !$company->is_active;
        $company->save();

        return response()->json([
            'message' => $company->is_active ? 'Company activated' : 'Company deactivated',
            'company' => $company
        ]);
    }

    // Create company admin
    public function createCompanyAdmin(Request $request, $companyId)
    {
        $company = Company::findOrFail($companyId);

        // Check if company already has an admin
        $existingAdmin = User::where('company_id', $companyId)
            ->where('role', 'company_admin')
            ->first();

        if ($existingAdmin) {
            return response()->json(['error' => 'This company already has an admin'], 422);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => 'required|string|min:8',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $admin = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'company_id' => $companyId,
            'role' => 'company_admin',
            'is_driver' => false,
        ]);

        return response()->json($admin, 201);
    }

    // List all users (across all companies)
    public function listAllUsers(Request $request)
    {
        $users = User::with('company')
            ->where('role', '!=', 'super_admin')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($users);
    }

    // View all parcels (read-only)
    public function listAllParcels(Request $request)
    {
        $parcels = Parcel::with(['customer', 'company', 'warehouse', 'shipment'])
            ->orderBy('created_at', 'desc')
            ->paginate(50);

        return response()->json($parcels);
    }

    // View all shipments (read-only)
    public function listAllShipments(Request $request)
    {
        $shipments = Shipment::with(['company', 'driver', 'vehicle', 'warehouse', 'parcels'])
            ->orderBy('created_at', 'desc')
            ->paginate(50);

        return response()->json($shipments);
    }
}
