<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Migrate existing customers (company_id = NULL) to the first company
        $firstCompany = DB::table('companies')->orderBy('id')->first();
        
        if ($firstCompany) {
            DB::table('users')
                ->where('role', 'customer')
                ->whereNull('company_id')
                ->update(['company_id' => $firstCompany->id]);
        }
    }

    public function down(): void
    {
        // Optionally revert - not recommended in production
    }
};
