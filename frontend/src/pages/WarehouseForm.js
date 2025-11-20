import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { warehouseService } from '../services/api';

function WarehouseForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    latitude: '',
    longitude: '',
    capacity_weight: '',
    capacity_volume: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      loadWarehouse();
    }
  }, [id]);

  const loadWarehouse = async () => {
    try {
      const response = await warehouseService.getOne(id);
      setFormData(response.data);
    } catch (error) {
      setError('Error loading warehouse');
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
        await warehouseService.update(id, formData);
      } else {
        await warehouseService.create(formData);
      }
      navigate('/warehouses');
    } catch (err) {
      setError(err.response?.data?.errors ? 
        Object.values(err.response.data.errors).flat().join(', ') : 
        'Operation failed'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h1>{isEdit ? 'Edit Warehouse' : 'Create Warehouse'}</h1>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Address</label>
          <textarea
            className="form-control"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Latitude *</label>
            <input
              type="number"
              step="0.000001"
              min="-90"
              max="90"
              className="form-control"
              name="latitude"
              value={formData.latitude}
              onChange={handleChange}
              required
              placeholder="-90 to 90"
            />
            <small className="text-muted">Range: -90 to 90</small>
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Longitude *</label>
            <input
              type="number"
              step="0.000001"
              min="-180"
              max="180"
              className="form-control"
              name="longitude"
              value={formData.longitude}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="alert alert-info">
          <strong>Recommended Ranges:</strong> Weight: 1,000-1,000,000 kg | Volume: 500-500,000 m³
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Capacity Weight (kg) *</label>
            <input
              type="number"
              step="0.01"
              min="1000"
              max="1000000"
              className="form-control"
              name="capacity_weight"
              value={formData.capacity_weight}
              onChange={handleChange}
              required
              placeholder="1,000 - 1,000,000"
            />
            <small className="text-muted">Minimum: 1,000 kg, Maximum: 1,000,000 kg</small>
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Capacity Volume (m³) *</label>
            <input
              type="number"
              step="0.01"
              min="500"
              max="500000"
              className="form-control"
              name="capacity_volume"
              value={formData.capacity_volume}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Saving...' : 'Save'}
        </button>
        <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate('/warehouses')}>
          Cancel
        </button>
      </form>
    </div>
  );
}

export default WarehouseForm;
