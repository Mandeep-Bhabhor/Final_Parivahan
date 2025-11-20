<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Shipment extends Model
{
    protected $fillable = [
        'company_id',
        'driver_id',
        'vehicle_id',
        'warehouse_id',
        'total_weight',
        'total_volume',
        'status',
    ];

    protected $casts = [
        'total_weight' => 'decimal:2',
        'total_volume' => 'decimal:2',
    ];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function driver()
    {
        return $this->belongsTo(User::class, 'driver_id');
    }

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class);
    }

    public function warehouse()
    {
        return $this->belongsTo(Warehouse::class);
    }

    public function parcels()
    {
        return $this->belongsToMany(Parcel::class, 'shipment_parcels');
    }
}
