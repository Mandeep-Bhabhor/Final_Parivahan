import { useEffect, useState } from 'react';
import { superAdminService } from '../services/superAdminApi';
import { Link } from 'react-router-dom';

function SuperAdminParcels() {
  const [parcels, setParcels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadParcels();
  }, []);

  const loadParcels = async () => {
    try {
      const response = await superAdminService.getAllParcels();
      setParcels(response.data.data || response.data); // Handle pagination
    } catch (error) {
      console.error('Error loading parcels:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-warning',
      accepted: 'bg-success',
      rejected: 'bg-danger',
      stored: 'bg-info',
      loaded: 'bg-primary',
      dispatched: 'bg-secondary',
      delivered: 'bg-success',
    };
    return badges[status] || 'bg-secondary';
  };

  if (loading) {
    return <div className="container mt-5"><div className="text-center">Loading...</div></div>;
  }

  return (
    <div className="container mt-4">
      <h1 className="mb-4">All Parcels (Read-Only)</h1>
      <p className="text-muted">View all parcels across all companies</p>

      {parcels.length === 0 ? (
        <div className="alert alert-info">No parcels found.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>Company</th>
                <th>Customer</th>
                <th>Pickup</th>
                <th>Delivery</th>
                <th>Weight</th>
                <th>Volume</th>
                <th>Price</th>
                <th>Status</th>
                <th>Warehouse</th>
                <th>Shipment</th>
              </tr>
            </thead>
            <tbody>
              {parcels.map((parcel) => (
                <tr key={parcel.id}>
                  <td>{parcel.id}</td>
                  <td>
                    {parcel.company ? (
                      <small>{parcel.company.name}</small>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td>
                    {parcel.customer ? (
                      <small>{parcel.customer.name}</small>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td>
                    <small className="text-truncate d-inline-block" style={{maxWidth: '150px'}}>
                      {parcel.pickup_address}
                    </small>
                  </td>
                  <td>
                    <small className="text-truncate d-inline-block" style={{maxWidth: '150px'}}>
                      {parcel.delivery_address}
                    </small>
                  </td>
                  <td>{parcel.weight} kg</td>
                  <td>{parcel.volume} m³</td>
                  <td>${parcel.quoted_price}</td>
                  <td>
                    <span className={`badge ${getStatusBadge(parcel.status)}`}>
                      {parcel.status}
                    </span>
                  </td>
                  <td>
                    {parcel.warehouse ? (
                      <small>{parcel.warehouse.name}</small>
                    ) : (
                      <span className="text-muted">-</span>
                    )}
                  </td>
                  <td>
                    {parcel.shipment ? (
                      <span className="badge bg-info">#{parcel.shipment.id}</span>
                    ) : (
                      <span className="text-muted">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="alert alert-warning mt-3">
        <strong>Note:</strong> This is a read-only view. You cannot edit or delete parcels.
      </div>
    </div>
  );
}

export default SuperAdminParcels;
