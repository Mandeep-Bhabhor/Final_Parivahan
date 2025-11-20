# Multi-Company Logistics Platform

A complete logistics management platform with subdomain-based multi-tenancy, built with Laravel 12 (API) and React (Frontend).

## Project Structure

```
logistics-platform/
├── backend/          # Laravel 12 API
└── frontend/         # React Application
```

## Features

### Core Functionality
- **Multi-tenancy**: Subdomain-based company isolation
- **User Management**: Company admin, staff, driver, and customer roles
- **Warehouse Management**: CRUD operations with geolocation
- **Vehicle Management**: Track capacity and assignments
- **Parcel System**: Quote pricing, acceptance workflow
- **Shipment Management**: Auto-assignment with capacity checks
- **Distance Calculation**: Haversine formula for nearest warehouse
- **Authentication**: Laravel Sanctum with Bearer tokens

### User Roles

1. **Company Admin**
   - First user of each company
   - Full access to company resources
   - Manage warehouses, vehicles, users
   - Accept/reject parcels

2. **Staff**
   - Manage warehouses and vehicles
   - Accept/reject parcels
   - View shipments

3. **Driver**
   - View assigned shipments
   - Update shipment status

4. **Customer**
   - Create parcels
   - View parcel status
   - Track deliveries

### Workflow

1. **Customer** creates a parcel with pickup/delivery addresses
2. System calculates **quoted price** based on weight and volume
3. **Company admin/staff** accepts or rejects the parcel
4. On acceptance:
   - System finds **nearest warehouse** using Haversine formula
   - Parcel is assigned to warehouse
   - System **auto-creates shipment** if driver and vehicle available
5. **Driver** updates shipment status through lifecycle
6. Parcels move through statuses: pending → accepted → stored → loaded → dispatched → delivered

## Quick Start

### Backend Setup

```bash
cd backend
composer install
cp .env.example .env
# Configure database in .env
php artisan key:generate
php artisan migrate
php artisan db:seed
php artisan serve
```

See `backend/SETUP.md` for detailed instructions.

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

See `frontend/README.md` for detailed instructions.

## Tech Stack

### Backend
- Laravel 12
- Laravel Sanctum (Authentication)
- MySQL/PostgreSQL
- PHP 8.2+

### Frontend
- React 18
- React Router DOM
- Axios
- Bootstrap 5
- JavaScript (no TypeScript)

## API Endpoints

### Authentication
- `POST /api/register` - Register user/company
- `POST /api/login` - Login
- `POST /api/logout` - Logout
- `GET /api/me` - Get current user

### Warehouses
- `GET /api/warehouses` - List warehouses
- `POST /api/warehouses` - Create warehouse
- `GET /api/warehouses/{id}` - Get warehouse
- `PUT /api/warehouses/{id}` - Update warehouse
- `DELETE /api/warehouses/{id}` - Delete warehouse

### Vehicles
- `GET /api/vehicles` - List vehicles
- `POST /api/vehicles` - Create vehicle
- `GET /api/vehicles/{id}` - Get vehicle
- `PUT /api/vehicles/{id}` - Update vehicle
- `DELETE /api/vehicles/{id}` - Delete vehicle

### Parcels
- `GET /api/parcels` - List parcels
- `POST /api/parcels` - Create parcel
- `GET /api/parcels/{id}` - Get parcel
- `POST /api/parcels/{id}/accept` - Accept parcel
- `POST /api/parcels/{id}/reject` - Reject parcel

### Shipments
- `GET /api/shipments` - List shipments
- `POST /api/shipments` - Create shipment
- `GET /api/shipments/{id}` - Get shipment
- `PATCH /api/shipments/{id}/status` - Update status

## Database Schema

### Tables
- `companies` - Company information with subdomain
- `users` - Users with role and company association
- `warehouses` - Warehouse locations with capacity
- `vehicles` - Vehicles with capacity tracking
- `parcels` - Parcel details with status
- `shipments` - Shipment information
- `shipment_parcels` - Pivot table for shipment-parcel relationship

## Test Credentials (After Seeding)

- **Admin**: admin@testcompany.com / password
- **Staff**: staff@testcompany.com / password
- **Driver**: driver@testcompany.com / password
- **Customer**: customer@example.com / password

Company subdomain: `testcompany.site.test`

## Local Development

For subdomain-based multi-tenancy to work locally:

1. Edit your hosts file:
   - Windows: `C:\Windows\System32\drivers\etc\hosts`
   - Mac/Linux: `/etc/hosts`

2. Add:
   ```
   127.0.0.1 testcompany.site.test
   127.0.0.1 site.test
   ```

3. Access via: `http://testcompany.site.test:8000`
