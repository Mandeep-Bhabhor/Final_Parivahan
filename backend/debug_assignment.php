<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== DEBUGGING PARCEL AUTO-ASSIGNMENT ===\n\n";

// Get the company
$company = DB::table('companies')->where('name', 'LIKE', '%Test Logistics%')->first();
if (!$company) {
    echo "❌ Company not found!\n";
    exit;
}

echo "Company: {$company->name} (ID: {$company->id})\n\n";

// Get warehouses for this company
$warehouses = DB::table('warehouses')->where('company_id', $company->id)->get();
echo "WAREHOUSES:\n";
foreach ($warehouses as $wh) {
    echo sprintf("  ID: %d | Name: %s | Location: %.6f, %.6f\n", 
        $wh->id, $wh->name, $wh->latitude, $wh->longitude
    );
}
echo "\n";

// Get vehicles for this company
$vehicles = DB::table('vehicles')->where('company_id', $company->id)->get();
echo "VEHICLES:\n";
foreach ($vehicles as $v) {
    $whName = $v->warehouse_id ? DB::table('warehouses')->find($v->warehouse_id)->name : 'None';
    echo sprintf("  ID: %d | %s (%s) | Warehouse: %s (ID: %s) | Available: %.0f kg / %.0f m³\n",
        $v->id,
        $v->vehicle_number,
        $v->type,
        $whName,
        $v->warehouse_id ?? 'NULL',
        $v->max_weight - $v->current_weight,
        $v->max_volume - $v->current_volume
    );
}
echo "\n";

// Get drivers
$drivers = DB::table('users')
    ->where('company_id', $company->id)
    ->where('is_driver', true)
    ->get();
echo "DRIVERS:\n";
foreach ($drivers as $d) {
    // Check if driver has active shipments
    $activeShipments = DB::table('shipments')
        ->where('driver_id', $d->id)
        ->whereIn('status', ['pending', 'loading', 'in_transit'])
        ->count();
    
    $status = $activeShipments > 0 ? "BUSY ({$activeShipments} active)" : "AVAILABLE";
    echo sprintf("  ID: %d | Name: %s | Status: %s\n", $d->id, $d->name, $status);
}
echo "\n";

// Get pending parcels
$parcels = DB::table('parcels')
    ->where('company_id', $company->id)
    ->where('status', 'accepted')
    ->get();

echo "ACCEPTED PARCELS (not assigned):\n";
if ($parcels->isEmpty()) {
    echo "  No accepted parcels waiting for assignment\n";
} else {
    foreach ($parcels as $p) {
        $whName = $p->assigned_warehouse_id ? DB::table('warehouses')->find($p->assigned_warehouse_id)->name : 'None';
        echo sprintf("  ID: %d | Weight: %.0f kg | Volume: %.2f m³ | Assigned Warehouse: %s (ID: %s)\n",
            $p->id,
            $p->weight,
            $p->volume,
            $whName,
            $p->assigned_warehouse_id ?? 'NULL'
        );
        
        // Check which vehicles at this warehouse could handle it
        if ($p->assigned_warehouse_id) {
            $suitableVehicles = DB::table('vehicles')
                ->where('company_id', $company->id)
                ->where('warehouse_id', $p->assigned_warehouse_id)
                ->whereRaw('(max_weight - current_weight) >= ?', [$p->weight])
                ->whereRaw('(max_volume - current_volume) >= ?', [$p->volume])
                ->get();
            
            if ($suitableVehicles->isEmpty()) {
                echo "    ❌ No suitable vehicles at warehouse {$p->assigned_warehouse_id}\n";
                
                // Show why each vehicle at this warehouse was rejected
                $vehiclesAtWarehouse = DB::table('vehicles')
                    ->where('company_id', $company->id)
                    ->where('warehouse_id', $p->assigned_warehouse_id)
                    ->get();
                
                foreach ($vehiclesAtWarehouse as $v) {
                    $availWeight = $v->max_weight - $v->current_weight;
                    $availVolume = $v->max_volume - $v->current_volume;
                    $weightOk = $availWeight >= $p->weight ? '✓' : '✗';
                    $volumeOk = $availVolume >= $p->volume ? '✓' : '✗';
                    
                    echo sprintf("      %s %s: Weight %s (%.0f/%.0f) | Volume %s (%.2f/%.2f)\n",
                        $v->vehicle_number,
                        $v->type,
                        $weightOk,
                        $availWeight,
                        $p->weight,
                        $volumeOk,
                        $availVolume,
                        $p->volume
                    );
                }
            } else {
                echo "    ✓ Found {$suitableVehicles->count()} suitable vehicle(s)\n";
            }
        }
        echo "\n";
    }
}

echo "\n=== DIAGNOSIS ===\n";

// Check for common issues
$issues = [];

if ($drivers->isEmpty()) {
    $issues[] = "No drivers available";
}

if ($vehicles->isEmpty()) {
    $issues[] = "No vehicles available";
}

if ($warehouses->isEmpty()) {
    $issues[] = "No warehouses configured";
}

// Check for vehicles without warehouse assignment
$vehiclesWithoutWarehouse = DB::table('vehicles')
    ->where('company_id', $company->id)
    ->whereNull('warehouse_id')
    ->count();

if ($vehiclesWithoutWarehouse > 0) {
    $issues[] = "{$vehiclesWithoutWarehouse} vehicle(s) not assigned to any warehouse";
}

if (empty($issues)) {
    echo "✅ All resources properly configured\n";
} else {
    echo "⚠️  Issues found:\n";
    foreach ($issues as $issue) {
        echo "  - {$issue}\n";
    }
}
