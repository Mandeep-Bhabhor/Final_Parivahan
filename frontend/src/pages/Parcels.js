import { useEffect, useState } from 'react';
import { parcelService } from '../services/api';
import { getUser } from '../services/auth';
import { Link } from 'react-router-dom';

function Parcels() {
  const user = getUser();
  const [parcels, setParcels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadParcels();
  }, []);

  const loadParcels = async () => {
    try {
      const response = await parcelService.getAll();
      setParcels(response.data);
    } catch (error) {
      console.error('Error loading parcels:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id) => {
    if (processing) return;
    setProcessing(true);
    try {
      const response = await parcelService.accept(id);
      console.log('Accept response:', response.data);
      
      const message = response.data.message || 'Parcel accepted successfully!';
      const autoAssigned = response.data.auto_assigned;
      
      if (autoAssigned) {
        alert(`✅ ${message}\n\nParcel has been assigned to a shipment and is ready for delivery.`);
      } else {
        alert(`⚠️ ${message}\n\nThe parcel is accepted but waiting for driver/vehicle availability. It will be assigned automatically when resources become available.`);
      }
      
      await loadParcels();
    } catch (error) {
      console.error('Error accepting parcel:', error);
      const errorMsg = error.response?.data?.error || error.response?.data?.message || 'Error accepting parcel';
      alert(`❌ ${errorMsg}`);
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async (id) => {
    if (processing) return;
    if (window.confirm('Are you sure you want to reject this parcel?')) {
      setProcessing(true);
      try {
        const response = await parcelService.reject(id);
        console.log('Reject response:', response.data);
        alert('Parcel rejected successfully!');
        await loadParcels();
      } catch (error) {
        console.error('Error rejecting parcel:', error);
        const errorMsg = error.response?.data?.error || error.response?.data?.message || 'Error rejecting parcel';
        alert(errorMsg);
      } finally {
        setProcessing(false);
      }
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
    return <span className={`badge ${badges[status] || 'bg-secondary'}`}>{status}</span>;
  };

  if (loading) return <div className="container mt-5"><div className="text-center">Loading...</div></div>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Parcels</h1>
        {user.role === 'customer' && <Link to="/parcels/create" className="btn btn-primary">Create Parcel</Link>}
      </div>

      {parcels.length === 0 ? (
        <div className="alert alert-info">No parcels found.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Pickup Address</th>
                <th>Delivery Address</th>
                <th>Weight</th>
                <th>Volume</th>
                <th>Quoted Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {parcels.map((parcel) => (
                <tr key={parcel.id}>
                  <td>{parcel.id}</td>
                  <td>{parcel.pickup_address}</td>
                  <td>{parcel.delivery_address}</td>
                  <td>{parcel.weight} kg</td>
                  <td>{parcel.volume} m³</td>
                  <td>${parcel.quoted_price}</td>
                  <td>{getStatusBadge(parcel.status)}</td>
                  <td>
                    {(user.role === 'company_admin' || user.role === 'staff') && parcel.status === 'pending' && (
                      <>
                        <button 
                          onClick={() => handleAccept(parcel.id)} 
                          className="btn btn-sm btn-success me-2"
                          disabled={processing}
                        >
                          {processing ? 'Processing...' : 'Accept'}
                        </button>
                        <button 
                          onClick={() => handleReject(parcel.id)} 
                          className="btn btn-sm btn-danger"
                          disabled={processing}
                        >
                          {processing ? 'Processing...' : 'Reject'}
                        </button>
                      </>
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

export default Parcels;
