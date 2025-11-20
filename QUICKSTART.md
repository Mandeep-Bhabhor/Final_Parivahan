# Quick Start Guide

## Prerequisites
- PHP 8.2+
- Composer
- Node.js 16+
- MySQL/PostgreSQL
- Git

## Step-by-Step Setup

### 1. Backend Setup (5 minutes)

```bash
# Navigate to backend
cd backend

# Install dependencies
composer install

# Setup environment
cp .env.example .env

# Edit .env file with your database credentials
# DB_DATABASE=logistics_platform
# DB_USERNAME=root
# DB_PASSWORD=your_password

# Generate application key
php artisan key:generate

# Run migrations
php artisan migrate

# Seed database with test data
php artisan db:seed

# Start server
php artisan serve
```

Backend will run at: `http://localhost:8000`

### 2. Frontend Setup (3 minutes)

```bash
# Open new terminal
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

Frontend will open at: `http://localhost:3000`

### 3. Test the Application

#### Login as Company Admin
- Email: `admin@testcompany.com`
- Password: `password`

#### Login as Customer
- Email: `customer@example.com`
- Password: `password`

#### Login as Driver
- Email: `driver@testcompany.com`
- Password: `password`

### 4. Test Workflow

1. **As Customer**:
   - Login with customer credentials
   - Go to "Create Parcel"
   - Fill in parcel details (use company_id: 1)
   - Submit parcel

2. **As Company Admin**:
   - Login with admin credentials
   - Go to "Parcels"
   - Accept the pending parcel
   - System will auto-assign to nearest warehouse
   - System will auto-create shipment if driver/vehicle available

3. **As Driver**:
   - Login with driver credentials
   - Go to "My Shipments"
   - Update shipment status through workflow

## Common Issues

### Backend Issues

**Port 8000 already in use**
```bash
php artisan serve --port=8001
```
Then update frontend `src/services/axios.js` baseURL to `http://localhost:8001/api`

**Database connection error**
- Check MySQL/PostgreSQL is running
- Verify credentials in `.env`
- Create database: `CREATE DATABASE logistics_platform;`

**Migration errors**
```bash
php artisan migrate:fresh --seed
```

### Frontend Issues

**Port 3000 already in use**
- Kill the process or use different port
- React will prompt to use another port

**API connection errors**
- Ensure backend is running
- Check `src/services/axios.js` baseURL matches backend URL

**Module not found errors**
```bash
rm -rf node_modules package-lock.json
npm install
```

## Next Steps

1. **Configure Geocoding**: Edit `backend/app/Services/GeocodingService.php` to integrate your geocoding provider

2. **Setup Subdomain Multi-tenancy**: 
   - Edit hosts file (see README.md)
   - Configure local web server for subdomains

3. **Customize**: 
   - Adjust pricing formula in `ParcelController.php`
   - Modify UI colors/layout
   - Add additional features

## Development Tips

- Backend API docs: Check `backend/SETUP.md`
- Frontend structure: Check `frontend/README.md`
- Database schema: See main `README.md`

## Support

For issues or questions:
1. Check error logs: `backend/storage/logs/laravel.log`
2. Check browser console for frontend errors
3. Verify all services are running

Happy coding! 🚀
