import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { isAuthenticated } from './services/auth';
import Navbar from './components/Navbar';
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
import Shipments from './pages/Shipments';
import Users from './pages/Users';

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
          
          <Route path="/warehouses" element={<ProtectedRoute allowedRoles={['company_admin', 'staff']}><Warehouses /></ProtectedRoute>} />
          <Route path="/warehouses/create" element={<ProtectedRoute allowedRoles={['company_admin', 'staff']}><WarehouseForm /></ProtectedRoute>} />
          <Route path="/warehouses/edit/:id" element={<ProtectedRoute allowedRoles={['company_admin', 'staff']}><WarehouseForm /></ProtectedRoute>} />
          
          <Route path="/vehicles" element={<ProtectedRoute allowedRoles={['company_admin', 'staff']}><Vehicles /></ProtectedRoute>} />
          <Route path="/vehicles/create" element={<ProtectedRoute allowedRoles={['company_admin', 'staff']}><VehicleForm /></ProtectedRoute>} />
          <Route path="/vehicles/edit/:id" element={<ProtectedRoute allowedRoles={['company_admin', 'staff']}><VehicleForm /></ProtectedRoute>} />
          
          <Route path="/parcels" element={<ProtectedRoute><Parcels /></ProtectedRoute>} />
          <Route path="/parcels/create" element={<ProtectedRoute allowedRoles={['customer']}><ParcelForm /></ProtectedRoute>} />
          
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
