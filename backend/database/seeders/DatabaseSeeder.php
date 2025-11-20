<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create test company
        $company = \App\Models\Company::create([
            'name' => 'Test Logistics Company',
            'subdomain' => 'testcompany',
            'email' => 'admin@testcompany.com',
            'phone' => '1234567890',
            'address' => '123 Test Street, Test City',
        ]);

        // Create company admin
        $admin = \App\Models\User::create([
            'name' => 'Admin User',
            'email' => 'admin@testcompany.com',
            'password' => bcrypt('password'),
            'company_id' => $company->id,
            'role' => 'company_admin',
            'is_driver' => false,
        ]);

        // Create staff user
        $staff = \App\Models\User::create([
            'name' => 'Staff User',
            'email' => 'staff@testcompany.com',
            'password' => bcrypt('password'),
            'company_id' => $company->id,
            'role' => 'staff',
            'is_driver' => false,
        ]);

        // Create driver
        $driver = \App\Models\User::create([
            'name' => 'Driver User',
            'email' => 'driver@testcompany.com',
            'password' => bcrypt('password'),
            'company_id' => $company->id,
            'role' => 'driver',
            'is_driver' => true,
        ]);

        // Create customer
        $customer = \App\Models\User::create([
            'name' => 'Customer User',
            'email' => 'customer@example.com',
            'password' => bcrypt('password'),
            'company_id' => null,
            'role' => 'customer',
            'is_driver' => false,
        ]);

        // Create warehouses
        $warehouse1 = \App\Models\Warehouse::create([
            'company_id' => $company->id,
            'name' => 'Main Warehouse',
            'address' => '100 Warehouse Ave, City A',
            'latitude' => 40.7128,
            'longitude' => -74.0060,
            'capacity_weight' => 10000,
            'capacity_volume' => 5000,
        ]);

        $warehouse2 = \App\Models\Warehouse::create([
            'company_id' => $company->id,
            'name' => 'Secondary Warehouse',
            'address' => '200 Storage Blvd, City B',
            'latitude' => 34.0522,
            'longitude' => -118.2437,
            'capacity_weight' => 8000,
            'capacity_volume' => 4000,
        ]);

        // Create vehicles
        \App\Models\Vehicle::create([
            'company_id' => $company->id,
            'warehouse_id' => $warehouse1->id,
            'vehicle_number' => 'VEH-001',
            'type' => 'Truck',
            'max_weight' => 1000,
            'max_volume' => 500,
            'current_weight' => 0,
            'current_volume' => 0,
        ]);

        \App\Models\Vehicle::create([
            'company_id' => $company->id,
            'warehouse_id' => $warehouse2->id,
            'vehicle_number' => 'VEH-002',
            'type' => 'Van',
            'max_weight' => 500,
            'max_volume' => 250,
            'current_weight' => 0,
            'current_volume' => 0,
        ]);
    }
}
