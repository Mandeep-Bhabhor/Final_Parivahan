import { useEffect, useState } from 'react';
import { superAdminService } from '../services/superAdminApi';

function SuperAdminShipments() {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadShipments();
  }, []);

  const loadShipments = async () => {
    try {
      const response = await superAdminService.getAllShipments();
      setShipments(response.data.data || response.data); // Handle pagination
    } catch (error) {
      console.error('Error loading shipments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-warning',
      loading: 'bg-info',
      in_transit: 'bg-primary',
      completed: 'bg-success',
    };
    return badges[status] || 'bg-secondary';
  };

  if (loading) {
    return <div className="container mt-5"><div className="text-center">Loading...</div></div>;
  }

  return (
    <div className="container mt-4">
      <h1 className="mb-4">All Shipments (Read-Only)</h1>
      <p className="text-muted">View all shipments across all companies</p>

      {shipments.length === 0 ? (
        <div className="alert alert-info">No shipments found.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Company</th>
                <th>Driver</th>
                <th>Vehicle</th>
                <th>Warehouse</th>
                <th>Weight</th>
                <th>Volume</th>
                <th>Parcels</th>
                <th>Status</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {shipments.map((shipment) => (
                <tr key={shipment.id}>
                  <td>#{shipment.id}</td>
                  <td>
                    {shipment.company ? (
                      <small>{shipment.company.name}</small>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td>
                    {shipment.driver ? (
                      <small>{shipment.driver.name}</small>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td>
                    {shipment.vehicle ? (
                      <code>{shipment.vehicle.vehicle_number}</code>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td>
                    {shipment.warehouse ? (
                      <small>{shipment.warehouse.name}</small>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td>{shipment.total_weight} kg</td>
                  <td>{shipment.total_volume} m³</td>
                  <td>
                    <span className="badge bg-secondary">
                      {shipment.parcels?.length || 0}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${getStatusBadge(shipment.status)}`}>
                      {shipment.status}
                    </span>
                  </td>
                  <td>
                    <small>{new Date(shipment.created_at).toLocaleDateString()}</small>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="alert alert-warning mt-3">
        <strong>Note:</strong> This is a read-only view. You cannot edit or delete shipments.
      </div>
    </div>
  );
}

export default SuperAdminShipments;
