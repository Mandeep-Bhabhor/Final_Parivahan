# Parcel Validation Limits

## Consistent Limits Across Backend & Frontend

### Weight
- **Minimum:** 0.1 kg
- **Maximum:** 25,000 kg (Trailer capacity)

### Dimensions (Height, Width, Length)
- **Minimum:** 0.01 m
- **Maximum:** 10 m

### Volume (Calculated: height × width × length)
- **Maximum:** 100 m³ (Trailer capacity)

### Coordinates
- **Latitude:** -90 to 90
- **Longitude:** -180 to 180

### Address
- **Maximum Length:** 500 characters

---

## Vehicle Capacities (Standard)

| Vehicle Type | Max Weight | Max Volume |
|-------------|-----------|-----------|
| Pickup      | 1,000 kg  | 5 m³      |
| Van         | 1,500 kg  | 15 m³     |
| Box Truck   | 5,000 kg  | 30 m³     |
| Truck       | 10,000 kg | 50 m³     |
| Trailer     | 25,000 kg | 100 m³    |

---

## Implementation

### Backend (ParcelController.php)
```php
'weight' => 'required|numeric|min:0.1|max:25000',
'height' => 'required|numeric|min:0.01|max:10',
'width' => 'required|numeric|min:0.01|max:10',
'length' => 'required|numeric|min:0.01|max:10',

// Volume check
if ($volume > 100) { /* reject */ }

// Weight check
if ($request->weight > 25000) { /* reject */ }
```

### Frontend (ParcelForm.js)
```javascript
// Weight validation
if (weight < 0.1 || weight > 25000) { /* reject */ }

// Dimension validation
if (height < 0.01 || height > 10) { /* reject */ }
if (width < 0.01 || width > 10) { /* reject */ }
if (length < 0.01 || length > 10) { /* reject */ }

// Volume validation
if (volume > 100) { /* reject */ }
```

---

## Notes
- Parcel limits are based on the largest vehicle type (Trailer)
- Volume is automatically calculated from dimensions
- Parcels exceeding these limits cannot be created
- Auto-assignment will fail if no vehicle has sufficient capacity at the assigned warehouse
