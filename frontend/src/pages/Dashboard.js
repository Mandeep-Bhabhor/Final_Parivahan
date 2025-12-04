import { useEffect, useState } from 'react';
import { getUser } from '../services/auth';
import { companyService, warehouseService, vehicleService, parcelService, shipmentService } from '../services/api';

function Dashboard() {
  const user = getUser();
  const [stats, setStats] = useState({
    warehouses: 0,
    vehicles: 0,
    parcels: 0,
    shipments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      if (user.role === 'customer') {
        const parcelsRes = await parcelService.getAll();
        setStats({ parcels: parcelsRes.data.length });
      } else if (user.role === 'driver') {
        const shipmentsRes = await shipmentService.getAll();
        setStats({ shipments: shipmentsRes.data.length });
      } else {
        const [warehousesRes, vehiclesRes, parcelsRes, shipmentsRes] = await Promise.all([
          warehouseService.getAll(),
          vehicleService.getAll(),
          parcelService.getAll(),
          shipmentService.getAll(),
        ]);
        setStats({
          warehouses: warehousesRes.data.length,
          vehicles: vehiclesRes.data.length,
          parcels: parcelsRes.data.length,
          shipments: shipmentsRes.data.length,
        });
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 text-center">
            <div className="card">
              <div className="card-body py-5">
                <div className="spinner-border text-black mb-3" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="text-muted">Loading dashboard...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <h1 className="mb-2">Dashboard</h1>
          <p className="text-muted mb-4">Welcome back, {user.name}</p>
        </div>
      </div>

      <div className="row g-4">
        {user.role === 'customer' && (
          <div className="col-md-6 col-lg-4">
            <div className="card dashboard-card h-100">
              <div className="card-body text-center">
                <div className="display-4 fw-bold text-black mb-2">{stats.parcels}</div>
                <h5 className="card-title mb-0">My Parcels</h5>
                <p className="text-muted small">Total parcels created</p>
              </div>
            </div>
          </div>
        )}

        {user.role === 'driver' && (
          <div className="col-md-6 col-lg-4">
            <div className="card dashboard-card h-100">
              <div className="card-body text-center">
                <div className="display-4 fw-bold text-black mb-2">{stats.shipments}</div>
                <h5 className="card-title mb-0">My Shipments</h5>
                <p className="text-muted small">Assigned deliveries</p>
              </div>
            </div>
          </div>
        )}

        {(user.role === 'company_admin' || user.role === 'staff') && (
          <>
            <div className="col-md-6 col-lg-3">
              <div className="card dashboard-card h-100">
                <div className="card-body text-center">
                  <div className="display-4 fw-bold text-black mb-2">{stats.warehouses}</div>
                  <h5 className="card-title mb-0">Warehouses</h5>
                  <p className="text-muted small">Storage facilities</p>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <div className="card dashboard-card h-100">
                <div className="card-body text-center">
                  <div className="display-4 fw-bold text-black mb-2">{stats.vehicles}</div>
                  <h5 className="card-title mb-0">Vehicles</h5>
                  <p className="text-muted small">Fleet vehicles</p>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <div className="card dashboard-card h-100">
                <div className="card-body text-center">
                  <div className="display-4 fw-bold text-black mb-2">{stats.parcels}</div>
                  <h5 className="card-title mb-0">Parcels</h5>
                  <p className="text-muted small">Total packages</p>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <div className="card dashboard-card h-100">
                <div className="card-body text-center">
                  <div className="display-4 fw-bold text-black mb-2">{stats.shipments}</div>
                  <h5 className="card-title mb-0">Shipments</h5>
                  <p className="text-muted small">Active deliveries</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Quick Actions Section */}
      <div className="row mt-5">
        <div className="col-12">
          <h3 className="mb-4">Quick Actions</h3>
        </div>
        
        {user.role === 'customer' && (
          <div className="col-md-6 col-lg-4">
            <div className="card dashboard-card">
              <div className="card-body">
                <h5 className="card-title">Create New Parcel</h5>
                <p className="card-text text-muted">Send a new package for delivery</p>
                <a href="/parcels/create" className="btn btn-primary">Create Parcel</a>
              </div>
            </div>
          </div>
        )}

        {(user.role === 'company_admin' || user.role === 'staff') && (
          <>
            <div className="col-md-6 col-lg-4 mb-4">
              <div className="card dashboard-card">
                <div className="card-body">
                  <h5 className="card-title">Manage Warehouses</h5>
                  <p className="card-text text-muted">Add or edit storage facilities</p>
                  <a href="/warehouses" className="btn btn-primary">View Warehouses</a>
                </div>
              </div>
            </div>
            
            <div className="col-md-6 col-lg-4 mb-4">
              <div className="card dashboard-card">
                <div className="card-body">
                  <h5 className="card-title">Fleet Management</h5>
                  <p className="card-text text-muted">Manage your delivery vehicles</p>
                  <a href="/vehicles" className="btn btn-primary">View Vehicles</a>
                </div>
              </div>
            </div>
            
            <div className="col-md-6 col-lg-4 mb-4">
              <div className="card dashboard-card">
                <div className="card-body">
                  <h5 className="card-title">Parcel Management</h5>
                  <p className="card-text text-muted">Process incoming parcels</p>
                  <a href="/parcels" className="btn btn-primary">View Parcels</a>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
