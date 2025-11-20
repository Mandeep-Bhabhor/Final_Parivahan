import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { parcelService } from '../services/api';
import { getUser } from '../services/auth';
import ParcelProgressBar from '../components/ParcelProgressBar';

function ParcelDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = getUser();
  const [parcel, setParcel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadParcel();
  }, [id]);

  const loadParcel = async () => {
    try {
      const response = await parcelService.getOne(id);
      setParcel(response.data);
    } catch (error) {
      console.error('Error loading parcel:', error);
      setError('Failed to load parcel details');
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

  if (error || !parcel) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">{error || 'Parcel not found'}</div>
        <button className="btn btn-secondary" onClick={() => navigate('/parcels')}>
          Back to Parcels
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Parcel Details</h1>
        <button className="btn btn-secondary" onClick={() => navigate('/parcels')}>
          Back to Parcels
        </button>
      </div>

      {/* Progress Bar */}
      <ParcelProgressBar status={parcel.status} />

      {/* Parcel Information */}
      <div className="row mt-4">
        <div className="col-md-6">
          <div className="card mb-3">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Parcel Information</h5>
            </div>
            <div className="card-body">
              <table className="table table-borderless mb-0">
                <tbody>
                  <tr>
                    <th width="40%">Parcel ID:</th>
                    <td>#{parcel.id}</td>
                  </tr>
                  <tr>
                    <th>Status:</th>
                    <td>
                      <span className={`badge ${getStatusBadgeClass(parcel.status)}`}>
                        {parcel.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <th>Weight:</th>
                    <td>{parcel.weight} kg</td>
                  </tr>
                  <tr>
                    <th>Dimensions:</th>
                    <td>{parcel.height} × {parcel.width} × {parcel.length} m</td>
                  </tr>
                  <tr>
                    <th>Volume:</th>
                    <td>{parcel.volume} m³</td>
                  </tr>
                  <tr>
                    <th>Quoted Price:</th>
                    <td className="fw-bold text-success">${parcel.quoted_price}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card mb-3">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">Pickup & Delivery</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <h6 className="text-primary">📍 Pickup Address</h6>
                <p className="mb-1">{parcel.pickup_address}</p>
                <small className="text-muted">
                  Coordinates: {parcel.pickup_latitude}, {parcel.pickup_longitude}
                </small>
              </div>
              <hr />
              <div>
                <h6 className="text-success">📍 Delivery Address</h6>
                <p className="mb-1">{parcel.delivery_address}</p>
                <small className="text-muted">
                  Coordinates: {parcel.delivery_latitude}, {parcel.delivery_longitude}
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Warehouse & Shipment Info */}
      {(parcel.warehouse || parcel.shipment) && (
        <div className="row">
          {parcel.warehouse && (
            <div className="col-md-6">
              <div className="card mb-3">
                <div className="card-header bg-info text-white">
                  <h5 className="mb-0">Warehouse</h5>
                </div>
                <div className="card-body">
                  <h6>{parcel.warehouse.name}</h6>
                  <p className="mb-0 text-muted">{parcel.warehouse.address}</p>
                </div>
              </div>
            </div>
          )}

          {parcel.shipment && (
            <div className="col-md-6">
              <div className="card mb-3">
                <div className="card-header bg-warning">
                  <h5 className="mb-0">Shipment</h5>
                </div>
                <div className="card-body">
                  <table className="table table-borderless table-sm mb-0">
                    <tbody>
                      <tr>
                        <th>Shipment ID:</th>
                        <td>#{parcel.shipment.id}</td>
                      </tr>
                      <tr>
                        <th>Status:</th>
                        <td>
                          <span className={`badge ${getShipmentStatusBadge(parcel.shipment.status)}`}>
                            {parcel.shipment.status}
                          </span>
                        </td>
                      </tr>
                      {parcel.shipment.driver && (
                        <tr>
                          <th>Driver:</th>
                          <td>{parcel.shipment.driver.name}</td>
                        </tr>
                      )}
                      {parcel.shipment.vehicle && (
                        <tr>
                          <th>Vehicle:</th>
                          <td>{parcel.shipment.vehicle.vehicle_number}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Timeline */}
      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">Timeline</h5>
        </div>
        <div className="card-body">
          <div className="timeline">
            <div className="timeline-item">
              <div className="timeline-marker bg-primary"></div>
              <div className="timeline-content">
                <h6>Parcel Created</h6>
                <p className="text-muted mb-0">
                  {new Date(parcel.created_at).toLocaleString()}
                </p>
              </div>
            </div>
            {parcel.status !== 'pending' && (
              <div className="timeline-item">
                <div className="timeline-marker bg-success"></div>
                <div className="timeline-content">
                  <h6>Status: {parcel.status}</h6>
                  <p className="text-muted mb-0">
                    {new Date(parcel.updated_at).toLocaleString()}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function getStatusBadgeClass(status) {
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
}

function getShipmentStatusBadge(status) {
  const badges = {
    pending: 'bg-warning',
    loading: 'bg-info',
    in_transit: 'bg-primary',
    completed: 'bg-success',
  };
  return badges[status] || 'bg-secondary';
}

export default ParcelDetail;
