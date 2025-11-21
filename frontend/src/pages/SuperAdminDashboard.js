import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { superAdminService } from '../services/superAdminApi';

function SuperAdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await superAdminService.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Super Admin Dashboard</h1>
      <p className="lead">Platform Overview & Management</p>

      {/* Companies Stats */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card text-white bg-primary mb-3">
            <div className="card-body">
              <h5 className="card-title">Total Companies</h5>
              <p className="card-text display-4">{stats?.total_companies || 0}</p>
              <Link to="/super-admin/companies" className="btn btn-light btn-sm">
                Manage Companies
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card text-white bg-success mb-3">
            <div className="card-body">
              <h5 className="card-title">Active Companies</h5>
              <p className="card-text display-4">{stats?.active_companies || 0}</p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card text-white bg-warning mb-3">
            <div className="card-body">
              <h5 className="card-title">Inactive Companies</h5>
              <p className="card-text display-4">{stats?.inactive_companies || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Users Stats */}
      <h3 className="mb-3">Users Overview</h3>
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card bg-light mb-3">
            <div className="card-body text-center">
              <h6 className="card-title">Total Users</h6>
              <p className="display-6">{stats?.total_users || 0}</p>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card bg-light mb-3">
            <div className="card-body text-center">
              <h6 className="card-title">Company Admins</h6>
              <p className="display-6">{stats?.company_admins || 0}</p>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card bg-light mb-3">
            <div className="card-body text-center">
              <h6 className="card-title">Drivers</h6>
              <p className="display-6">{stats?.drivers || 0}</p>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card bg-light mb-3">
            <div className="card-body text-center">
              <h6 className="card-title">Customers</h6>
              <p className="display-6">{stats?.customers || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Operations Stats */}
      <h3 className="mb-3">Operations Overview</h3>
      <div className="row">
        <div className="col-md-6">
          <div className="card text-white bg-info mb-3">
            <div className="card-body">
              <h5 className="card-title">Total Parcels</h5>
              <p className="card-text display-4">{stats?.total_parcels || 0}</p>
              <Link to="/super-admin/parcels" className="btn btn-light btn-sm">
                View All Parcels
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card text-white bg-secondary mb-3">
            <div className="card-body">
              <h5 className="card-title">Total Shipments</h5>
              <p className="card-text display-4">{stats?.total_shipments || 0}</p>
              <Link to="/super-admin/shipments" className="btn btn-light btn-sm">
                View All Shipments
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card mt-4">
        <div className="card-header">
          <h5 className="mb-0">Quick Actions</h5>
        </div>
        <div className="card-body">
          <div className="d-grid gap-2 d-md-flex">
            <Link to="/super-admin/companies/create" className="btn btn-primary">
              + Create New Company
            </Link>
            <Link to="/super-admin/companies" className="btn btn-outline-primary">
              Manage Companies
            </Link>
            <Link to="/super-admin/users" className="btn btn-outline-secondary">
              View All Users
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SuperAdminDashboard;
