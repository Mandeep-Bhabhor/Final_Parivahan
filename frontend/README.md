# Frontend - React Logistics Platform

## Setup

1. **Install Dependencies**
```bash
npm install
```

2. **Configure API URL**
Edit `src/services/axios.js` and update the `baseURL` if your backend is not running on `http://localhost:8000`

3. **Start Development Server**
```bash
npm start
```

The app will open at `http://localhost:3000`

## Features

### Customer Role
- Register as customer
- Create parcels with pickup/delivery addresses
- View parcel status
- Track shipments

### Company Admin Role
- Register company with subdomain
- Manage warehouses (CRUD)
- Manage vehicles (CRUD)
- Manage users (add staff/drivers)
- Accept/reject parcels
- View all shipments

### Staff Role
- Manage warehouses
- Manage vehicles
- Accept/reject parcels
- View shipments

### Driver Role
- View assigned shipments
- Update shipment status (loading, in_transit, completed)

## Pages

- `/login` - Login page
- `/register` - Registration page
- `/dashboard` - Dashboard with stats
- `/warehouses` - Warehouse list
- `/warehouses/create` - Create warehouse
- `/warehouses/edit/:id` - Edit warehouse
- `/vehicles` - Vehicle list
- `/vehicles/create` - Create vehicle
- `/vehicles/edit/:id` - Edit vehicle
- `/parcels` - Parcel list
- `/parcels/create` - Create parcel (customer only)
- `/shipments` - Shipment list
- `/my-shipments` - Driver's shipments

## Tech Stack

- React 18
- React Router DOM
- Axios
- Bootstrap 5
- JavaScript (no TypeScript)

## Notes

- All API calls use Bearer token authentication
- Token is stored in localStorage
- Protected routes check user role
- Bootstrap CSS for styling
