import { Link, useNavigate } from 'react-router-dom';
import { getUser, clearAuth } from '../services/auth';
import { authService } from '../services/auth';

function Navbar() {
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearAuth();
      navigate('/login');
    }
  };

  if (!user) return null;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">Logistics Platform</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/dashboard">Dashboard</Link>
            </li>
            
            {user.role === 'super_admin' && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/super-admin/companies">Companies</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/super-admin/users">Users</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/super-admin/parcels">Parcels</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/super-admin/shipments">Shipments</Link>
                </li>
              </>
            )}

            {user.role === 'customer' && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/parcels">My Parcels</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/parcels/create">Create Parcel</Link>
                </li>
              </>
            )}

            {(user.role === 'company_admin' || user.role === 'staff') && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/warehouses">Warehouses</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/vehicles">Vehicles</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/parcels">Parcels</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/shipments">Shipments</Link>
                </li>
              </>
            )}

            {user.role === 'company_admin' && (
              <li className="nav-item">
                <Link className="nav-link" to="/users">Users</Link>
              </li>
            )}

            {user.role === 'driver' && (
              <li className="nav-item">
                <Link className="nav-link" to="/my-shipments">My Shipments</Link>
              </li>
            )}
          </ul>          <div className="d-flex align-items-center">
            <span className="text-white me-3">
              {user.name} ({user.role})
              {user.company && user.role !== 'super_admin' && (
                <span className="text-light"> - {user.company.name}</span>
              )}
            </span>
            <button className="btn btn-outline-light" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
