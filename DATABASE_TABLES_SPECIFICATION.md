# Database Tables Specification

## Table of Contents
1. [companies](#1-companies)
2. [users](#2-users)
3. [warehouses](#3-warehouses)
4. [vehicles](#4-vehicles)
5. [parcels](#5-parcels)
6. [shipments](#6-shipments)
7. [shipment_parcels](#7-shipment_parcels)

---

## 1. companies

| Field Name | Data Type | Field Length | Constraint | Description |
|------------|-----------|--------------|------------|-------------|
| id | BIGINT | 20 | Primary Key, Auto Increment | Unique company identifier |
| name | VARCHAR | 255 | Not Null | Company name |
| subdomain | VARCHAR | 255 | Not Null, Unique | Unique subdomain for company access |
| email | VARCHAR | 255 | Nullable | Company contact email address |
| phone | VARCHAR | 255 | Nullable | Company contact phone number |
| address | TEXT | 65535 | Nullable | Company physical address |
| is_active | BOOLEAN | 1 | Not Null, Default = 1 | Company active status (1=active, 0=inactive) |
| created_at | TIMESTAMP | - | Nullable | Record creation timestamp |
| updated_at | TIMESTAMP | - | Nullable | Record last update timestamp |

**Indexes:**
- PRIMARY KEY: `id`
- UNIQUE KEY: `subdomain`

---

## 2. users

| Field Name | Data Type | Field Length | Constraint | Description |
|------------|-----------|--------------|------------|-------------|
| id | BIGINT | 20 | Primary Key, Auto Increment | Unique user identifier |
| company_id | BIGINT | 20 | Foreign Key, Nullable | Reference to companies table |
| name | VARCHAR | 255 | Not Null | User's full name |
| email | VARCHAR | 255 | Not Null, Unique | User's email address for login |
| email_verified_at | TIMESTAMP | - | Nullable | Email verification timestamp |
| password | VARCHAR | 255 | Not Null | Hashed password for authentication |
| role | ENUM | - | Not Null, Default = 'customer' | User role in system |
| is_driver | BOOLEAN | 1 | Not Null, Default = 0 | Driver status flag (1=driver, 0=not driver) |
| remember_token | VARCHAR | 100 | Nullable | Token for "remember me" functionality |
| created_at | TIMESTAMP | - | Nullable | Record creation timestamp |
| updated_at | TIMESTAMP | - | Nullable | Record last update timestamp |

**Enum Values (role):**
- `super_admin` - System administrator (all companies)
- `company_admin` - Company administrator
- `staff` - Company staff member
- `driver` - Delivery driver
- `customer` - Customer creating parcels

**Indexes:**
- PRIMARY KEY: `id`
- UNIQUE KEY: `email`
- FOREIGN KEY: `company_id` REFERENCES `companies(id)` ON DELETE CASCADE

---

## 3. warehouses

| Field Name | Data Type | Field Length | Constraint | Description |
|------------|-----------|--------------|------------|-------------|
| id | BIGINT | 20 | Primary Key, Auto Increment | Unique warehouse identifier |
| company_id | BIGINT | 20 | Foreign Key, Not Null | Reference to owning company |
| name | VARCHAR | 255 | Not Null | Warehouse name |
| address | TEXT | 65535 | Not Null | Warehouse physical address |
| latitude | DECIMAL | 10,8 | Not Null | Geographic latitude coordinate |
| longitude | DECIMAL | 11,8 | Not Null | Geographic longitude coordinate |
| capacity_weight | DECIMAL | 10,2 | Not Null, Default = 0 | Maximum weight capacity in kg |
| capacity_volume | DECIMAL | 10,2 | Not Null, Default = 0 | Maximum volume capacity in m³ |
| created_at | TIMESTAMP | - | Nullable | Record creation timestamp |
| updated_at | TIMESTAMP | - | Nullable | Record last update timestamp |

**Indexes:**
- PRIMARY KEY: `id`
- FOREIGN KEY: `company_id` REFERENCES `companies(id)` ON DELETE CASCADE

---

## 4. vehicles

| Field Name | Data Type | Field Length | Constraint | Description |
|------------|-----------|--------------|------------|-------------|
| id | BIGINT | 20 | Primary Key, Auto Increment | Unique vehicle identifier |
| company_id | BIGINT | 20 | Foreign Key, Not Null | Reference to owning company |
| warehouse_id | BIGINT | 20 | Foreign Key, Nullable | Current warehouse location |
| vehicle_number | VARCHAR | 255 | Not Null, Unique | Vehicle registration/identification number |
| type | VARCHAR | 255 | Not Null | Vehicle type (Truck, Van, Pickup, Trailer, Box Truck) |
| max_weight | DECIMAL | 10,2 | Not Null | Maximum weight capacity in kg |
| max_volume | DECIMAL | 10,2 | Not Null | Maximum volume capacity in m³ |
| current_weight | DECIMAL | 10,2 | Not Null, Default = 0 | Current loaded weight in kg |
| current_volume | DECIMAL | 10,2 | Not Null, Default = 0 | Current loaded volume in m³ |
| created_at | TIMESTAMP | - | Nullable | Record creation timestamp |
| updated_at | TIMESTAMP | - | Nullable | Record last update timestamp |

**Standard Vehicle Capacities:**
- `Pickup`: 1,000 kg / 5 m³
- `Van`: 1,500 kg / 15 m³
- `Box Truck`: 5,000 kg / 30 m³
- `Truck`: 10,000 kg / 50 m³
- `Trailer`: 25,000 kg / 100 m³

**Indexes:**
- PRIMARY KEY: `id`
- UNIQUE KEY: `vehicle_number`
- FOREIGN KEY: `company_id` REFERENCES `companies(id)` ON DELETE CASCADE
- FOREIGN KEY: `warehouse_id` REFERENCES `warehouses(id)` ON DELETE SET NULL

---

## 5. parcels

| Field Name | Data Type | Field Length | Constraint | Description |
|------------|-----------|--------------|------------|-------------|
| id | BIGINT | 20 | Primary Key, Auto Increment | Unique parcel identifier |
| customer_id | BIGINT | 20 | Foreign Key, Not Null | Reference to customer (users table) |
| company_id | BIGINT | 20 | Foreign Key, Not Null | Reference to logistics company |
| assigned_warehouse_id | BIGINT | 20 | Foreign Key, Nullable | Warehouse handling the parcel |
| assigned_shipment_id | BIGINT | 20 | Foreign Key, Nullable | Shipment carrying the parcel |
| pickup_address | TEXT | 65535 | Not Null | Pickup location address |
| delivery_address | TEXT | 65535 | Not Null | Delivery destination address |
| pickup_latitude | DECIMAL | 10,8 | Not Null | Pickup location latitude |
| pickup_longitude | DECIMAL | 11,8 | Not Null | Pickup location longitude |
| delivery_latitude | DECIMAL | 10,8 | Not Null | Delivery location latitude |
| delivery_longitude | DECIMAL | 11,8 | Not Null | Delivery location longitude |
| weight | DECIMAL | 10,2 | Not Null | Parcel weight in kg (0.1 - 25,000) |
| height | DECIMAL | 10,2 | Not Null | Parcel height in meters (0.01 - 10) |
| width | DECIMAL | 10,2 | Not Null | Parcel width in meters (0.01 - 10) |
| length | DECIMAL | 10,2 | Not Null | Parcel length in meters (0.01 - 10) |
| volume | DECIMAL | 10,2 | Not Null | Calculated volume in m³ (max 100) |
| quoted_price | DECIMAL | 10,2 | Nullable | Price quote for delivery |
| status | ENUM | - | Not Null, Default = 'pending' | Current parcel status |
| created_at | TIMESTAMP | - | Nullable | Record creation timestamp |
| updated_at | TIMESTAMP | - | Nullable | Record last update timestamp |

**Enum Values (status):**
- `pending` - Parcel created, awaiting company acceptance
- `accepted` - Company accepted the parcel
- `rejected` - Company rejected the parcel
- `stored` - Parcel assigned to warehouse/shipment
- `loaded` - Parcel loaded onto vehicle
- `dispatched` - Shipment departed with parcel
- `delivered` - Parcel delivered to customer

**Indexes:**
- PRIMARY KEY: `id`
- FOREIGN KEY: `customer_id` REFERENCES `users(id)` ON DELETE CASCADE
- FOREIGN KEY: `company_id` REFERENCES `companies(id)` ON DELETE CASCADE
- FOREIGN KEY: `assigned_warehouse_id` REFERENCES `warehouses(id)` ON DELETE SET NULL
- FOREIGN KEY: `assigned_shipment_id` REFERENCES `shipments(id)` ON DELETE SET NULL

---

## 6. shipments

| Field Name | Data Type | Field Length | Constraint | Description |
|------------|-----------|--------------|------------|-------------|
| id | BIGINT | 20 | Primary Key, Auto Increment | Unique shipment identifier |
| company_id | BIGINT | 20 | Foreign Key, Not Null | Reference to company |
| driver_id | BIGINT | 20 | Foreign Key, Not Null | Reference to driver (users table) |
| vehicle_id | BIGINT | 20 | Foreign Key, Not Null | Reference to vehicle used |
| warehouse_id | BIGINT | 20 | Foreign Key, Not Null | Origin warehouse |
| total_weight | DECIMAL | 10,2 | Not Null, Default = 0 | Total weight of all parcels in kg |
| total_volume | DECIMAL | 10,2 | Not Null, Default = 0 | Total volume of all parcels in m³ |
| status | ENUM | - | Not Null, Default = 'pending' | Current shipment status |
| created_at | TIMESTAMP | - | Nullable | Record creation timestamp |
| updated_at | TIMESTAMP | - | Nullable | Record last update timestamp |

**Enum Values (status):**
- `pending` - Shipment created, waiting to load
- `loading` - Driver loading parcels onto vehicle
- `in_transit` - Driver on delivery route
- `completed` - All deliveries completed

**Indexes:**
- PRIMARY KEY: `id`
- FOREIGN KEY: `company_id` REFERENCES `companies(id)` ON DELETE CASCADE
- FOREIGN KEY: `driver_id` REFERENCES `users(id)` ON DELETE CASCADE
- FOREIGN KEY: `vehicle_id` REFERENCES `vehicles(id)` ON DELETE CASCADE
- FOREIGN KEY: `warehouse_id` REFERENCES `warehouses(id)` ON DELETE CASCADE

---

## 7. shipment_parcels

| Field Name | Data Type | Field Length | Constraint | Description |
|------------|-----------|--------------|------------|-------------|
| id | BIGINT | 20 | Primary Key, Auto Increment | Unique junction record identifier |
| shipment_id | BIGINT | 20 | Foreign Key, Not Null | Reference to shipment |
| parcel_id | BIGINT | 20 | Foreign Key, Not Null | Reference to parcel |
| created_at | TIMESTAMP | - | Nullable | Record creation timestamp |
| updated_at | TIMESTAMP | - | Nullable | Record last update timestamp |

**Purpose:** Junction table for many-to-many relationship between shipments and parcels

**Indexes:**
- PRIMARY KEY: `id`
- FOREIGN KEY: `shipment_id` REFERENCES `shipments(id)` ON DELETE CASCADE
- FOREIGN KEY: `parcel_id` REFERENCES `parcels(id)` ON DELETE CASCADE

---

## Additional System Tables

### password_reset_tokens

| Field Name | Data Type | Field Length | Constraint | Description |
|------------|-----------|--------------|------------|-------------|
| email | VARCHAR | 255 | Primary Key | User email for password reset |
| token | VARCHAR | 255 | Not Null | Password reset token |
| created_at | TIMESTAMP | - | Nullable | Token creation timestamp |

### sessions

| Field Name | Data Type | Field Length | Constraint | Description |
|------------|-----------|--------------|------------|-------------|
| id | VARCHAR | 255 | Primary Key | Session identifier |
| user_id | BIGINT | 20 | Foreign Key, Nullable | Reference to logged-in user |
| ip_address | VARCHAR | 45 | Nullable | User's IP address |
| user_agent | TEXT | 65535 | Nullable | User's browser information |
| payload | LONGTEXT | 4294967295 | Not Null | Session data |
| last_activity | INTEGER | 11 | Not Null | Last activity timestamp |

### personal_access_tokens

| Field Name | Data Type | Field Length | Constraint | Description |
|------------|-----------|--------------|------------|-------------|
| id | BIGINT | 20 | Primary Key, Auto Increment | Unique token identifier |
| tokenable_type | VARCHAR | 255 | Not Null | Model type (polymorphic) |
| tokenable_id | BIGINT | 20 | Not Null | Model ID (polymorphic) |
| name | VARCHAR | 255 | Not Null | Token name |
| token | VARCHAR | 64 | Not Null, Unique | Hashed token value |
| abilities | TEXT | 65535 | Nullable | Token permissions |
| last_used_at | TIMESTAMP | - | Nullable | Last usage timestamp |
| expires_at | TIMESTAMP | - | Nullable | Token expiration timestamp |
| created_at | TIMESTAMP | - | Nullable | Record creation timestamp |
| updated_at | TIMESTAMP | - | Nullable | Record last update timestamp |

---

## Database Constraints Summary

### Referential Integrity Rules

**ON DELETE CASCADE:**
- When a company is deleted, all related users, warehouses, vehicles, parcels, and shipments are deleted
- When a user is deleted, all their parcels and shipments are deleted
- When a shipment is deleted, all shipment_parcel records are deleted

**ON DELETE SET NULL:**
- When a warehouse is deleted, vehicles and parcels are kept but warehouse_id is set to NULL
- When a shipment is deleted, parcels are kept but assigned_shipment_id is set to NULL

### Data Validation Rules

**Parcels:**
- Weight: 0.1 kg - 25,000 kg
- Dimensions: 0.01 m - 10 m (each)
- Volume: Maximum 100 m³ (calculated)
- Coordinates: Latitude (-90 to 90), Longitude (-180 to 180)

**Vehicles:**
- Capacities are fixed based on vehicle type
- current_weight/volume cannot exceed max_weight/volume

---

## Notes

1. **Timestamps:** All tables use Laravel's standard `created_at` and `updated_at` timestamps
2. **Soft Deletes:** Not implemented - all deletes are hard deletes with cascade rules
3. **Character Set:** UTF-8 (utf8mb4) for full Unicode support
4. **Collation:** utf8mb4_unicode_ci for case-insensitive comparisons
5. **Engine:** InnoDB for transaction support and foreign key constraints
