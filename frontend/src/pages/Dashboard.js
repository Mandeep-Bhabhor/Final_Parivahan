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
    return <div className="container mt-5"><div className="text-center">Loading...</div></div>;
  }

  return (
    <div className="container mt-4">
      <h1>Dashboard</h1>
      <p className="lead">Welcome, {user.name}!</p>

      <div className="row mt-4">
        {user.role === 'customer' && (
          <div className="col-md-4">
            <div className="card text-white bg-primary mb-3">
              <div className="card-body">
                <h5 className="card-title">My Parcels</h5>
                <p className="card-text display-4">{stats.parcels}</p>
              </div>
            </div>
          </div>
        )}

        {user.role === 'driver' && (
          <div className="col-md-4">
            <div className="card text-white bg-success mb-3">
              <div className="card-body">
                <h5 className="card-title">My Shipments</h5>
                <p className="card-text display-4">{stats.shipments}</p>
              </div>
            </div>
          </div>
        )}

        {(user.role === 'company_admin' || user.role === 'staff') && (
          <>
            <div className="col-md-3">
              <div className="card text-white bg-primary mb-3">
                <div className="card-body">
                  <h5 className="card-title">Warehouses</h5>
                  <p className="card-text display-4">{stats.warehouses}</p>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card text-white bg-success mb-3">
                <div className="card-body">
                  <h5 className="card-title">Vehicles</h5>
                  <p className="card-text display-4">{stats.vehicles}</p>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card text-white bg-warning mb-3">
                <div className="card-body">
                  <h5 className="card-title">Parcels</h5>
                  <p className="card-text display-4">{stats.parcels}</p>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card text-white bg-info mb-3">
                <div className="card-body">
                  <h5 className="card-title">Shipments</h5>
                  <p className="card-text display-4">{stats.shipments}</p>
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
