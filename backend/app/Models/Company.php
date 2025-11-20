<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    protected $fillable = [
        'name',
        'subdomain',
        'email',
        'phone',
        'address',
    ];

    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function warehouses()
    {
        return $this->hasMany(Warehouse::class);
    }

    public function vehicles()
    {
        return $this->hasMany(Vehicle::class);
    }

    public function parcels()
    {
        return $this->hasMany(Parcel::class);
    }

    public function shipments()
    {
        return $this->hasMany(Shipment::class);
    }
}
