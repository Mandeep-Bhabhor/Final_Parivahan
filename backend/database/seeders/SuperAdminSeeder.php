<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class SuperAdminSeeder extends Seeder
{
    /**
     * Run the database seeder.
     */
    public function run(): void
    {
        // Create super admin if doesn't exist
        User::firstOrCreate(
            ['email' => 'superadmin@logistics.com'],
            [
                'name' => 'Super Admin',
                'password' => Hash::make('superadmin123'),
                'role' => 'super_admin',
                'company_id' => null,
                'is_driver' => false,
            ]
        );

        $this->command->info('Super Admin created successfully!');
        $this->command->info('Email: superadmin@logistics.com');
        $this->command->info('Password: superadmin123');
    }
}
