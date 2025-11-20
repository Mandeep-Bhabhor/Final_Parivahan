<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Parcel extends Model
{
    protected $fillable = [
        'customer_id',
        'company_id',
        'pickup_address',
        'delivery_address',
        'pickup_latitude',
        'pickup_longitude',
        'delivery_latitude',
        'delivery_longitude',
        'weight',
        'height',
        'width',
        'length',
        'volume',
        'quoted_price',
        'assigned_warehouse_id',
        'assigned_shipment_id',
        'status',
    ];

    protected $casts = [
        'pickup_latitude' => 'decimal:8',
        'pickup_longitude' => 'decimal:8',
        'delivery_latitude' => 'decimal:8',
        'delivery_longitude' => 'decimal:8',
        'weight' => 'decimal:2',
        'height' => 'decimal:2',
        'width' => 'decimal:2',
        'length' => 'decimal:2',
        'volume' => 'decimal:2',
        'quoted_price' => 'decimal:2',
    ];

    public function customer()
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function warehouse()
    {
        return $this->belongsTo(Warehouse::class, 'assigned_warehouse_id');
    }

    public function shipment()
    {
        return $this->belongsTo(Shipment::class, 'assigned_shipment_id');
    }
}
