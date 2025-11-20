import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { vehicleService, warehouseService } from '../services/api';

function VehicleForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

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
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
          <label className="form-label">Type</label>
          <input type="text" className="form-control" name="type" value={formData.type} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Warehouse</label>
          <select className="form-select" name="warehouse_id" value={formData.warehouse_id} onChange={handleChange}>
            <option value="">Select Warehouse</option>
            {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
          </select>
        </div>

        <div className="alert alert-info">
          <strong>Recommended Ranges:</strong> Weight: 50-50,000 kg | Volume: 10-10,000 m³
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Max Weight (kg) *</label>
            <input 
              type="number" 
              step="0.01" 
              min="50" 
              max="50000" 
              className="form-control" 
              name="max_weight" 
              value={formData.max_weight} 
              onChange={handleChange} 
              required 
              placeholder="50 - 50,000"
            />
            <small className="text-muted">Minimum: 50 kg, Maximum: 50,000 kg</small>
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Max Volume (m³) *</label>
            <input 
              type="number" 
              step="0.01" 
              min="10" 
              max="10000" 
              className="form-control" 
              name="max_volume" 
              value={formData.max_volume} 
              onChange={handleChange} 
              required 
              placeholder="10 - 10,000"
            />
            <small className="text-muted">Minimum: 10 m³, Maximum: 10,000 m³</small>
          </div>
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
        <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate('/vehicles')}>Cancel</button>
      </form>
    </div>
  );
}

export default VehicleForm;
