import { useEffect, useState } from 'react';
import { shipmentService } from '../services/api';
import { getUser } from '../services/auth';

function Shipments() {
  const user = getUser();
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadShipments();
  }, []);

  const loadShipments = async () => {
    try {
      const response = await shipmentService.getAll();
      setShipments(response.data);
    } catch (error) {
      console.error('Error loading shipments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await shipmentService.updateStatus(id, status);
      loadShipments();
    } catch (error) {
      alert('Error updating status');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-warning',
      loading: 'bg-info',
      in_transit: 'bg-primary',
      completed: 'bg-success',
    };
    return <span className={`badge ${badges[status] || 'bg-secondary'}`}>{status}</span>;
  };

  if (loading) return <div className="container mt-5"><div className="text-center">Loading...</div></div>;

  return (
    <div className="container mt-4">
      <h1>{user.role === 'driver' ? 'My Shipments' : 'Shipments'}</h1>

      {shipments.length === 0 ? (
        <div className="alert alert-info">No shipments found.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Driver</th>
                <th>Vehicle</th>
                <th>Warehouse</th>
                <th>Total Weight</th>
                <th>Total Volume</th>
                <th>Parcels</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {shipments.map((shipment) => (
                <tr key={shipment.id}>
                  <td>{shipment.id}</td>
                  <td>{shipment.driver?.name}</td>
                  <td>{shipment.vehicle?.vehicle_number}</td>
                  <td>{shipment.warehouse?.name}</td>
                  <td>{shipment.total_weight} kg</td>
                  <td>{shipment.total_volume} m³</td>
                  <td>{shipment.parcels?.length || 0}</td>
                  <td>{getStatusBadge(shipment.status)}</td>
                  <td>
                    {shipment.status === 'pending' && (
                      <button onClick={() => handleStatusUpdate(shipment.id, 'loading')} className="btn btn-sm btn-info">Start Loading</button>
                    )}
                    {shipment.status === 'loading' && (
                      <button onClick={() => handleStatusUpdate(shipment.id, 'in_transit')} className="btn btn-sm btn-primary">Start Transit</button>
                    )}
                    {shipment.status === 'in_transit' && (
                      <button onClick={() => handleStatusUpdate(shipment.id, 'completed')} className="btn btn-sm btn-success">Complete</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Shipments;
