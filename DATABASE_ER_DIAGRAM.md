# Database Entity-Relationship Diagram

## Visual ER Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         LOGISTICS MANAGEMENT SYSTEM                          │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────┐
│     COMPANIES        │
├──────────────────────┤
│ PK id                │
│    name              │
│    subdomain (UQ)    │
│    email             │
│    phone             │
│    address           │
│    is_active         │
│    timestamps        │
└──────────────────────┘
         │
         │ 1:N
         ├─────────────────────────────────────────────────────────┐
         │                                                           │
         ▼                                                           ▼
┌──────────────────────┐                                  ┌──────────────────────┐
│       USERS          │                                  │     WAREHOUSES       │
├──────────────────────┤                                  ├──────────────────────┤
│ PK id                │                                  │ PK id                │
│ FK company_id        │◄─────────────────┐               │ FK company_id        │
│    name              │                  │               │    name              │
│    email (UQ)        │                  │               │    address           │
│    password          │                  │               │    latitude          │
│    role              │                  │               │    longitude         │
│    is_driver         │                  │               │    capacity_weight   │
│    timestamps        │                  │               │    capacity_volume   │
└──────────────────────┘                  │               │    timestamps        │
         │                                │               └──────────────────────┘
         │ 1:N (as customer)              │                        │
         │                                │                        │ 1:N
         ▼                                │                        ▼
┌──────────────────────┐                  │               ┌──────────────────────┐
│      PARCELS         │                  │               │      VEHICLES        │
├──────────────────────┤                  │               ├──────────────────────┤
│ PK id                │                  │               │ PK id                │
│ FK customer_id       │──────────────────┘               │ FK company_id        │
│ FK company_id        │                                  │ FK warehouse_id      │
│ FK assigned_warehouse│──────────────────┐               │    vehicle_number(UQ)│
│ FK assigned_shipment │─────┐            │               │    type              │
│    pickup_address    │     │            │               │    max_weight        │
│    delivery_address  │     │            │               │    max_volume        │
│    pickup_latitude   │     │            │               │    current_weight    │
│    pickup_longitude  │     │            │               │    current_volume    │
│    delivery_latitude │     │            │               │    timestamps        │
│    delivery_longitude│     │            │               └──────────────────────┘
│    weight            │     │            │                        │
│    height            │     │            │                        │ 1:N
│    width             │     │            │                        ▼
│    length            │     │            └───────────────►┌──────────────────────┐
│    volume            │     │                             │     SHIPMENTS        │
│    quoted_price      │     │                             ├──────────────────────┤
│    status            │     │                             │ PK id                │
│    timestamps        │     │                             │ FK company_id        │
└──────────────────────┘     │                             │ FK driver_id (users) │
         │                   │                             │ FK vehicle_id        │
         │                   │                             │ FK warehouse_id      │
         │ N:M               │                             │    total_weight      │
         │                   │                             │    total_volume      │
         ▼                   │                             │    status            │
┌──────────────────────┐     │                             │    timestamps        │
│  SHIPMENT_PARCELS    │     │                             └──────────────────────┘
├──────────────────────┤     │                                      ▲
│ PK id                │     │                                      │
│ FK shipment_id       │◄────┘                                      │
│ FK parcel_id         │                                            │
│    timestamps        │                                            │
└──────────────────────┘                                            │
                                                                    │
                                                                    │
                                    ┌───────────────────────────────┘
                                    │ 1:N (as driver)
                                    │
                              ┌─────┴──────┐
                              │   USERS    │
                              │ (is_driver)│
                              └────────────┘
```

## Detailed Entity Descriptions

### 1. COMPANIES
**Purpose:** Represents logistics companies in the system

**Attributes:**
- `id` (PK): Unique identifier
- `name`: Company name
- `subdomain` (UNIQUE): Unique subdomain for company
- `email`: Company contact email
- `phone`: Company contact phone
- `address`: Company physical address
- `is_active`: Whether company is active (added later)
- `timestamps`: created_at, updated_at

**Relationships:**
- Has many Users (1:N)
- Has many Warehouses (1:N)
- Has many Vehicles (1:N)
- Has many Parcels (1:N)
- Has many Shipments (1:N)

---

### 2. USERS
**Purpose:** Represents all users in the system (customers, staff, drivers, admins)

**Attributes:**
- `id` (PK): Unique identifier
- `company_id` (FK): Reference to company (nullable for customers initially)
- `name`: User's full name
- `email` (UNIQUE): User's email address
- `password`: Hashed password
- `role`: ENUM('company_admin', 'staff', 'driver', 'customer')
- `is_driver`: Boolean flag for driver status
- `timestamps`: created_at, updated_at

**Relationships:**
- Belongs to Company (N:1)
- Has many Parcels as customer (1:N)
- Has many Shipments as driver (1:N)

**Special Roles:**
- `super_admin`: Not stored in DB, identified by email in config
- `company_admin`: Manages company operations
- `staff`: Company employee
- `driver`: Delivers shipments (is_driver = true)
- `customer`: Creates parcels

---

### 3. WAREHOUSES
**Purpose:** Storage facilities for parcels before shipment

**Attributes:**
- `id` (PK): Unique identifier
- `company_id` (FK): Reference to owning company
- `name`: Warehouse name
- `address`: Physical address
- `latitude`: Geographic latitude
- `longitude`: Geographic longitude
- `capacity_weight`: Maximum weight capacity
- `capacity_volume`: Maximum volume capacity
- `timestamps`: created_at, updated_at

**Relationships:**
- Belongs to Company (N:1)
- Has many Vehicles (1:N)
- Has many Parcels (1:N)
- Has many Shipments (1:N)

---

### 4. VEHICLES
**Purpose:** Transportation vehicles for delivering parcels

**Attributes:**
- `id` (PK): Unique identifier
- `company_id` (FK): Reference to owning company
- `warehouse_id` (FK): Current warehouse location (nullable)
- `vehicle_number` (UNIQUE): Vehicle registration/identification
- `type`: ENUM('Truck', 'Van', 'Pickup', 'Trailer', 'Box Truck')
- `max_weight`: Maximum weight capacity (kg)
- `max_volume`: Maximum volume capacity (m³)
- `current_weight`: Current loaded weight
- `current_volume`: Current loaded volume
- `timestamps`: created_at, updated_at

**Standard Capacities:**
- Pickup: 1,000 kg / 5 m³
- Van: 1,500 kg / 15 m³
- Box Truck: 5,000 kg / 30 m³
- Truck: 10,000 kg / 50 m³
- Trailer: 25,000 kg / 100 m³

**Relationships:**
- Belongs to Company (N:1)
- Belongs to Warehouse (N:1, nullable)
- Has many Shipments (1:N)

---

### 5. PARCELS
**Purpose:** Individual packages to be delivered

**Attributes:**
- `id` (PK): Unique identifier
- `customer_id` (FK): Reference to customer who created it
- `company_id` (FK): Reference to logistics company
- `assigned_warehouse_id` (FK): Warehouse handling the parcel (nullable)
- `assigned_shipment_id` (FK): Shipment carrying the parcel (nullable)
- `pickup_address`: Pickup location address
- `delivery_address`: Delivery destination address
- `pickup_latitude`: Pickup location latitude
- `pickup_longitude`: Pickup location longitude
- `delivery_latitude`: Delivery location latitude
- `delivery_longitude`: Delivery location longitude
- `weight`: Parcel weight (kg)
- `height`: Parcel height (m)
- `width`: Parcel width (m)
- `length`: Parcel length (m)
- `volume`: Calculated volume (m³)
- `quoted_price`: Price quote for delivery
- `status`: ENUM('pending', 'accepted', 'rejected', 'stored', 'loaded', 'dispatched', 'delivered')
- `timestamps`: created_at, updated_at

**Status Flow:**
1. `pending` → Customer creates parcel
2. `accepted` → Company accepts parcel
3. `rejected` → Company rejects parcel
4. `stored` → Parcel assigned to warehouse/shipment
5. `loaded` → Parcel loaded onto vehicle
6. `dispatched` → Shipment departed
7. `delivered` → Parcel delivered to customer

**Relationships:**
- Belongs to Customer/User (N:1)
- Belongs to Company (N:1)
- Belongs to Warehouse (N:1, nullable)
- Belongs to Shipment (N:1, nullable)
- Belongs to many Shipments through shipment_parcels (N:M)

---

### 6. SHIPMENTS
**Purpose:** Delivery trips made by drivers with vehicles

**Attributes:**
- `id` (PK): Unique identifier
- `company_id` (FK): Reference to company
- `driver_id` (FK): Reference to driver (users table)
- `vehicle_id` (FK): Reference to vehicle
- `warehouse_id` (FK): Origin warehouse
- `total_weight`: Total weight of all parcels
- `total_volume`: Total volume of all parcels
- `status`: ENUM('pending', 'loading', 'in_transit', 'completed')
- `timestamps`: created_at, updated_at

**Status Flow:**
1. `pending` → Shipment created, waiting to load
2. `loading` → Driver loading parcels
3. `in_transit` → Driver on delivery route
4. `completed` → All deliveries completed

**Relationships:**
- Belongs to Company (N:1)
- Belongs to Driver/User (N:1)
- Belongs to Vehicle (N:1)
- Belongs to Warehouse (N:1)
- Has many Parcels through shipment_parcels (N:M)

---

### 7. SHIPMENT_PARCELS (Junction Table)
**Purpose:** Many-to-many relationship between shipments and parcels

**Attributes:**
- `id` (PK): Unique identifier
- `shipment_id` (FK): Reference to shipment
- `parcel_id` (FK): Reference to parcel
- `timestamps`: created_at, updated_at

**Relationships:**
- Belongs to Shipment (N:1)
- Belongs to Parcel (N:1)

---

## Key Relationships Summary

### One-to-Many (1:N)
- Company → Users
- Company → Warehouses
- Company → Vehicles
- Company → Parcels
- Company → Shipments
- User (customer) → Parcels
- User (driver) → Shipments
- Warehouse → Vehicles
- Warehouse → Parcels
- Warehouse → Shipments
- Vehicle → Shipments

### Many-to-Many (N:M)
- Shipments ↔ Parcels (through shipment_parcels)

---

## Business Rules

1. **Company Isolation**: Each company operates independently with its own users, warehouses, vehicles, and parcels
2. **Customer Assignment**: Customers must be assigned to a company to create parcels
3. **Parcel Workflow**: Parcels go through acceptance → warehouse assignment → shipment assignment → delivery
4. **Auto-Assignment**: System automatically assigns parcels to shipments when:
   - Driver is available
   - Vehicle has sufficient capacity
   - Vehicle is at the assigned warehouse
5. **Capacity Management**: Vehicles track current vs. max capacity to prevent overloading
6. **Role-Based Access**: Different user roles have different permissions
7. **Super Admin**: Special role (not in DB) that can manage all companies

---

## Indexes & Constraints

### Unique Constraints
- `companies.subdomain`
- `users.email`
- `vehicles.vehicle_number`

### Foreign Key Constraints
- All FK relationships have `onDelete` actions:
  - `cascade`: Delete related records
  - `set null`: Set FK to null when parent deleted

### Enum Constraints
- `users.role`: company_admin, staff, driver, customer, super_admin
- `parcels.status`: pending, accepted, rejected, stored, loaded, dispatched, delivered
- `shipments.status`: pending, loading, in_transit, completed
- `vehicles.type`: Truck, Van, Pickup, Trailer, Box Truck

---

## Database Statistics (Current System)

Based on the implementation:
- **Total Tables**: 11 (including Laravel system tables)
- **Core Business Tables**: 7
- **Junction Tables**: 1
- **System Tables**: 3 (cache, jobs, sessions)
