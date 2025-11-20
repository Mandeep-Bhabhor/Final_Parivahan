<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Vehicle extends Model
{
    protected $fillable = [
        'company_id',
        'warehouse_id',
        'vehicle_number',
        'type',
        'max_weight',
        'max_volume',
        'current_weight',
        'current_volume',
    ];

    protected $casts = [
        'max_weight' => 'decimal:2',
        'max_volume' => 'decimal:2',
        'current_weight' => 'decimal:2',
        'current_volume' => 'decimal:2',
    ];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function warehouse()
    {
        return $this->belongsTo(Warehouse::class);
    }

    public function shipments()
    {
        return $this->hasMany(Shipment::class);
    }
}
