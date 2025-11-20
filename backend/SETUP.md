# Backend Setup Instructions

## Prerequisites
- PHP 8.2+
- Composer
- MySQL/PostgreSQL

## Installation Steps

1. **Install Dependencies**
```bash
composer install
```

2. **Environment Configuration**
```bash
cp .env.example .env
```

Edit `.env` file:
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=logistics_platform
DB_USERNAME=root
DB_PASSWORD=your_password
```

3. **Generate Application Key**
```bash
php artisan key:generate
```

4. **Run Migrations**
```bash
php artisan migrate
```

5. **Seed Database (Optional)**
```bash
php artisan db:seed
```

This creates test data:
- Company: testcompany.site.test
- Admin: admin@testcompany.com / password
- Staff: staff@testcompany.com / password
- Driver: driver@testcompany.com / password
- Customer: customer@example.com / password

6. **Start Development Server**
```bash
php artisan serve
```

## Subdomain Configuration (Local Development)

For subdomain-based multi-tenancy, you need to configure your local environment:

### Option 1: Laravel Valet (Mac)
```bash
valet link logistics
valet domain test
```
Access: http://testcompany.logistics.test

### Option 2: Manual Hosts File
Edit your hosts file:
- Windows: `C:\Windows\System32\drivers\etc\hosts`
- Mac/Linux: `/etc/hosts`

Add:
```
127.0.0.1 testcompany.site.test
127.0.0.1 site.test
```

Then use a local server that supports virtual hosts.

## API Endpoints

### Authentication
- POST `/api/register` - Register new user/company
- POST `/api/login` - Login
- POST `/api/logout` - Logout (auth required)
- GET `/api/me` - Get current user (auth required)

### Company Management
- GET `/api/company` - Get company details
- POST `/api/company/users` - Add user to company
- GET `/api/company/users` - List company users

### Warehouses
- GET `/api/warehouses` - List warehouses
- POST `/api/warehouses` - Create warehouse
- GET `/api/warehouses/{id}` - Get warehouse
- PUT `/api/warehouses/{id}` - Update warehouse
- DELETE `/api/warehouses/{id}` - Delete warehouse

### Vehicles
- GET `/api/vehicles` - List vehicles
- POST `/api/vehicles` - Create vehicle
- GET `/api/vehicles/{id}` - Get vehicle
- PUT `/api/vehicles/{id}` - Update vehicle
- DELETE `/api/vehicles/{id}` - Delete vehicle

### Parcels
- GET `/api/parcels` - List parcels
- POST `/api/parcels` - Create parcel (customer only)
- GET `/api/parcels/{id}` - Get parcel
- POST `/api/parcels/{id}/accept` - Accept parcel (admin/staff)
- POST `/api/parcels/{id}/reject` - Reject parcel (admin/staff)

### Shipments
- GET `/api/shipments` - List shipments
- POST `/api/shipments` - Create shipment (admin/staff)
- GET `/api/shipments/{id}` - Get shipment
- PATCH `/api/shipments/{id}/status` - Update shipment status

## Authentication
All protected routes require Bearer token in Authorization header:
```
Authorization: Bearer {token}
```

## Geocoding Integration
The `GeocodingService` has placeholder code. Integrate your preferred provider:
- Google Maps Geocoding API
- OpenCage
- Nominatim

Edit: `app/Services/GeocodingService.php`
