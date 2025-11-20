<?php

namespace App\Services;

class DistanceService
{
    /**
     * Calculate distance between two coordinates using Haversine formula
     * Returns distance in kilometers
     */
    public function calculateDistance($lat1, $lon1, $lat2, $lon2)
    {
        $earthRadius = 6371; // Earth's radius in kilometers

        $latFrom = deg2rad($lat1);
        $lonFrom = deg2rad($lon1);
        $latTo = deg2rad($lat2);
        $lonTo = deg2rad($lon2);

        $latDelta = $latTo - $latFrom;
        $lonDelta = $lonTo - $lonFrom;

        $a = sin($latDelta / 2) * sin($latDelta / 2) +
             cos($latFrom) * cos($latTo) *
             sin($lonDelta / 2) * sin($lonDelta / 2);
        
        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        return $earthRadius * $c;
    }

    /**
     * Find nearest warehouse to given coordinates
     */
    public function findNearestWarehouse($latitude, $longitude, $companyId)
    {
        $warehouses = \App\Models\Warehouse::where('company_id', $companyId)->get();

        if ($warehouses->isEmpty()) {
            return null;
        }

        $nearestWarehouse = null;
        $shortestDistance = PHP_FLOAT_MAX;

        foreach ($warehouses as $warehouse) {
            $distance = $this->calculateDistance(
                $latitude,
                $longitude,
                $warehouse->latitude,
                $warehouse->longitude
            );

            if ($distance < $shortestDistance) {
                $shortestDistance = $distance;
                $nearestWarehouse = $warehouse;
            }
        }

        return $nearestWarehouse;
    }
}
