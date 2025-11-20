import { useEffect, useState } from 'react';
import { vehicleService } from '../services/api';
import { Link } from 'react-router-dom';

function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    try {
      const response = await vehicleService.getAll();
      setVehicles(response.data);
    } catch (error) {
      console.error('Error loading vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await vehicleService.delete(id);
        loadVehicles();
      } catch (error) {
        alert('Error deleting vehicle');
      }
    }
  };

  if (loading) return <div className="container mt-5"><div className="text-center">Loading...</div></div>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Vehicles</h1>
        <Link to="/vehicles/create" className="btn btn-primary">Add Vehicle</Link>
      </div>

      {vehicles.length === 0 ? (
        <div className="alert alert-info">No vehicles found.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Vehicle Number</th>
                <th>Type</th>
                <th>Max Weight</th>
                <th>Max Volume</th>
                <th>Current Load</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((vehicle) => (
                <tr key={vehicle.id}>
                  <td>{vehicle.vehicle_number}</td>
                  <td>{vehicle.type}</td>
                  <td>{vehicle.max_weight} kg</td>
                  <td>{vehicle.max_volume} m³</td>
                  <td>{vehicle.current_weight} kg / {vehicle.current_volume} m³</td>
                  <td>
                    <Link to={`/vehicles/edit/${vehicle.id}`} className="btn btn-sm btn-warning me-2">Edit</Link>
                    <button onClick={() => handleDelete(vehicle.id)} className="btn btn-sm btn-danger">Delete</button>
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

export default Vehicles;
