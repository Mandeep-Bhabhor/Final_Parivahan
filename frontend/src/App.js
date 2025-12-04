import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { isAuthenticated } from './services/auth';
import Navbar from './components/Navbar';

// Import custom theme
import './styles/theme.css';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Warehouses from './pages/Warehouses';
import WarehouseForm from './pages/WarehouseForm';
import Vehicles from './pages/Vehicles';
import VehicleForm from './pages/VehicleForm';
import Parcels from './pages/Parcels';
import ParcelForm from './pages/ParcelForm';
import ParcelDetail from './pages/ParcelDetail';
import Shipments from './pages/Shipments';
import Users from './pages/Users';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import CompanyManagement from './pages/CompanyManagement';
import CompanyForm from './pages/CompanyForm';
import CompanyDetail from './pages/CompanyDetail';
import SuperAdminUsers from './pages/SuperAdminUsers';
import SuperAdminParcels from './pages/SuperAdminParcels';
import SuperAdminShipments from './pages/SuperAdminShipments';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={isAuthenticated() ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          
          {/* Super Admin Routes */}
          <Route path="/super-admin/dashboard" element={<ProtectedRoute allowedRoles={['super_admin']}><SuperAdminDashboard /></ProtectedRoute>} />
          <Route path="/super-admin/companies" element={<ProtectedRoute allowedRoles={['super_admin']}><CompanyManagement /></ProtectedRoute>} />
          <Route path="/super-admin/companies/create" element={<ProtectedRoute allowedRoles={['super_admin']}><CompanyForm /></ProtectedRoute>} />
          <Route path="/super-admin/companies/:id" element={<ProtectedRoute allowedRoles={['super_admin']}><CompanyDetail /></ProtectedRoute>} />
          <Route path="/super-admin/companies/:id/edit" element={<ProtectedRoute allowedRoles={['super_admin']}><CompanyForm /></ProtectedRoute>} />
          <Route path="/super-admin/users" element={<ProtectedRoute allowedRoles={['super_admin']}><SuperAdminUsers /></ProtectedRoute>} />
          <Route path="/super-admin/parcels" element={<ProtectedRoute allowedRoles={['super_admin']}><SuperAdminParcels /></ProtectedRoute>} />
          <Route path="/super-admin/shipments" element={<ProtectedRoute allowedRoles={['super_admin']}><SuperAdminShipments /></ProtectedRoute>} />
          
          <Route path="/warehouses" element={<ProtectedRoute allowedRoles={['company_admin', 'staff']}><Warehouses /></ProtectedRoute>} />
          <Route path="/warehouses/create" element={<ProtectedRoute allowedRoles={['company_admin', 'staff']}><WarehouseForm /></ProtectedRoute>} />
          <Route path="/warehouses/edit/:id" element={<ProtectedRoute allowedRoles={['company_admin', 'staff']}><WarehouseForm /></ProtectedRoute>} />
          
          <Route path="/vehicles" element={<ProtectedRoute allowedRoles={['company_admin', 'staff']}><Vehicles /></ProtectedRoute>} />
          <Route path="/vehicles/create" element={<ProtectedRoute allowedRoles={['company_admin', 'staff']}><VehicleForm /></ProtectedRoute>} />
          <Route path="/vehicles/edit/:id" element={<ProtectedRoute allowedRoles={['company_admin', 'staff']}><VehicleForm /></ProtectedRoute>} />
          
          <Route path="/parcels" element={<ProtectedRoute><Parcels /></ProtectedRoute>} />
          <Route path="/parcels/create" element={<ProtectedRoute allowedRoles={['customer']}><ParcelForm /></ProtectedRoute>} />
          <Route path="/parcels/:id" element={<ProtectedRoute><ParcelDetail /></ProtectedRoute>} />
          
          <Route path="/shipments" element={<ProtectedRoute allowedRoles={['company_admin', 'staff', 'driver']}><Shipments /></ProtectedRoute>} />
          <Route path="/my-shipments" element={<ProtectedRoute allowedRoles={['driver']}><Shipments /></ProtectedRoute>} />
          
          <Route path="/users" element={<ProtectedRoute allowedRoles={['company_admin']}><Users /></ProtectedRoute>} />
          
          <Route path="/unauthorized" element={<div className="container mt-5"><div className="alert alert-danger">Unauthorized Access</div></div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
