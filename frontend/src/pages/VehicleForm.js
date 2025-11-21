import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { vehicleService, warehouseService } from '../services/api';

function VehicleForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  // Standard vehicle capacities
  const vehicleCapacities = {
    'Truck': { max_weight: 10000, max_volume: 50 },
    'Van': { max_weight: 1500, max_volume: 15 },
    'Pickup': { max_weight: 1000, max_volume: 5 },
    'Trailer': { max_weight: 25000, max_volume: 100 },
    'Box Truck': { max_weight: 5000, max_volume: 30 },
  };

  const [formData, setFormData] = useState({
    vehicle_number: '',
    type: '',
    warehouse_id: '',
    max_weight: '',
    max_volume: '',
  });
  const [warehouses, setWarehouses] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadWarehouses();
    if (isEdit) loadVehicle();
  }, [id]);

  const loadWarehouses = async () => {
    try {
      const response = await warehouseService.getAll();
      setWarehouses(response.data);
    } catch (error) {
      console.error('Error loading warehouses');
    }
  };

  const loadVehicle = async () => {
    try {
      const response = await vehicleService.getOne(id);
      setFormData(response.data);
    } catch (error) {
      setError('Error loading vehicle');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // When vehicle type changes, auto-set the capacities
    if (name === 'type' && value && vehicleCapacities[value]) {
      setFormData({
        ...formData,
        type: value,
        max_weight: vehicleCapacities[value].max_weight,
        max_volume: vehicleCapacities[value].max_volume,
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isEdit) {
        await vehicleService.update(id, formData);
      } else {
        await vehicleService.create(formData);
      }
      navigate('/vehicles');
    } catch (err) {
      setError(err.response?.data?.errors ? Object.values(err.response.data.errors).flat().join(', ') : 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h1>{isEdit ? 'Edit Vehicle' : 'Create Vehicle'}</h1>
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Vehicle Number</label>
          <input type="text" className="form-control" name="vehicle_number" value={formData.vehicle_number} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Vehicle Type *</label>
          <select className="form-select" name="type" value={formData.type} onChange={handleChange} required>
            <option value="">Select vehicle type...</option>
            <option value="Truck">Truck</option>
            <option value="Van">Van</option>
            <option value="Pickup">Pickup</option>
            <option value="Trailer">Trailer</option>
            <option value="Box Truck">Box Truck</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Warehouse</label>
          <select className="form-select" name="warehouse_id" value={formData.warehouse_id} onChange={handleChange}>
            <option value="">Select Warehouse</option>
            {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
          </select>
        </div>

        {formData.type && (
          <div className="alert alert-success">
            <strong>Standard Capacity for {formData.type}:</strong> Weight: {formData.max_weight.toLocaleString()} kg | Volume: {formData.max_volume} m³
          </div>
        )}

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Max Weight (kg) *</label>
            <input 
              type="number" 
              className="form-control" 
              name="max_weight" 
              value={formData.max_weight} 
              readOnly
              disabled
              required 
            />
            <small className="text-muted">Auto-set based on vehicle type</small>
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Max Volume (m³) *</label>
            <input 
              type="number" 
              className="form-control" 
              name="max_volume" 
              value={formData.max_volume} 
              readOnly
              disabled
              required 
            />
            <small className="text-muted">Auto-set based on vehicle type</small>
          </div>
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
        <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate('/vehicles')}>Cancel</button>
      </form>
    </div>
  );
}

export default VehicleForm;
