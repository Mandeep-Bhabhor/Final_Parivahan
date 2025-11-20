<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Warehouse extends Model
{
    protected $fillable = [
        'company_id',
        'name',
        'address',
        'latitude',
        'longitude',
        'capacity_weight',
        'capacity_volume',
    ];

    protected $casts = [
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'capacity_weight' => 'decimal:2',
        'capacity_volume' => 'decimal:2',
    ];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function vehicles()
    {
        return $this->hasMany(Vehicle::class);
    }

    public function parcels()
    {
        return $this->hasMany(Parcel::class, 'assigned_warehouse_id');
    }

    public function shipments()
    {
        return $this->hasMany(Shipment::class);
    }
}
