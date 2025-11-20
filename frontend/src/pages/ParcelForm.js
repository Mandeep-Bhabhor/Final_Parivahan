import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { parcelService, companyService } from '../services/api';

function ParcelForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    company_id: '',
    pickup_address: '',
    delivery_address: '',
    pickup_latitude: '',
    pickup_longitude: '',
    delivery_latitude: '',
    delivery_longitude: '',
    weight: '',
    height: '',
    width: '',
    length: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { weight, height, width, length, pickup_latitude, pickup_longitude, delivery_latitude, delivery_longitude } = formData;
    
    // Weight validation (0.1 kg to 1000 kg - max vehicle capacity)
    if (weight < 0.1 || weight > 1000) {
      setError('Weight must be between 0.1 kg and 1000 kg');
      return false;
    }

    // Dimension validation (0.01 m to 10 m)
    if (height < 0.01 || height > 10) {
      setError('Height must be between 0.01 m and 10 m');
      return false;
    }
    if (width < 0.01 || width > 10) {
      setError('Width must be between 0.01 m and 10 m');
      return false;
    }
    if (length < 0.01 || length > 10) {
      setError('Length must be between 0.01 m and 10 m');
      return false;
    }

    // Volume validation (max 500 m³ - max vehicle capacity)
    const volume = height * width * length;
    if (volume > 500) {
      setError(`Calculated volume (${volume.toFixed(2)} m³) exceeds maximum vehicle capacity (500 m³). Please reduce dimensions.`);
      return false;
    }

    // Latitude validation (-90 to 90)
    if (pickup_latitude < -90 || pickup_latitude > 90) {
      setError('Pickup latitude must be between -90 and 90');
      return false;
    }
    if (delivery_latitude < -90 || delivery_latitude > 90) {
      setError('Delivery latitude must be between -90 and 90');
      return false;
    }

    // Longitude validation (-180 to 180)
    if (pickup_longitude < -180 || pickup_longitude > 180) {
      setError('Pickup longitude must be between -180 and 180');
      return false;
    }
    if (delivery_longitude < -180 || delivery_longitude > 180) {
      setError('Delivery longitude must be between -180 and 180');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await parcelService.create(formData);
      navigate('/parcels');
    } catch (err) {
      setError(err.response?.data?.errors ? Object.values(err.response.data.errors).flat().join(', ') : 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h1>Create Parcel</h1>
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Company ID</label>
          <input type="number" className="form-control" name="company_id" value={formData.company_id} onChange={handleChange} required />
          <small className="form-text text-muted">Enter the company ID you want to ship with</small>
        </div>

        <div className="mb-3">
          <label className="form-label">Pickup Address</label>
          <textarea className="form-control" name="pickup_address" value={formData.pickup_address} onChange={handleChange} required />
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Pickup Latitude *</label>
            <input 
              type="number" 
              step="0.000001" 
              min="-90" 
              max="90" 
              className="form-control" 
              name="pickup_latitude" 
              value={formData.pickup_latitude} 
              onChange={handleChange} 
              required 
              placeholder="-90 to 90"
            />
            <small className="text-muted">Range: -90 to 90</small>
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Pickup Longitude *</label>
            <input 
              type="number" 
              step="0.000001" 
              min="-180" 
              max="180" 
              className="form-control" 
              name="pickup_longitude" 
              value={formData.pickup_longitude} 
              onChange={handleChange} 
              required 
              placeholder="-180 to 180"
            />
            <small className="text-muted">Range: -180 to 180</small>
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Delivery Address</label>
          <textarea className="form-control" name="delivery_address" value={formData.delivery_address} onChange={handleChange} required />
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Delivery Latitude *</label>
            <input 
              type="number" 
              step="0.000001" 
              min="-90" 
              max="90" 
              className="form-control" 
              name="delivery_latitude" 
              value={formData.delivery_latitude} 
              onChange={handleChange} 
              required 
              placeholder="-90 to 90"
            />
            <small className="text-muted">Range: -90 to 90</small>
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Delivery Longitude *</label>
            <input 
              type="number" 
              step="0.000001" 
              min="-180" 
              max="180" 
              className="form-control" 
              name="delivery_longitude" 
              value={formData.delivery_longitude} 
              onChange={handleChange} 
              required 
              placeholder="-180 to 180"
            />
            <small className="text-muted">Range: -180 to 180</small>
          </div>
        </div>

        <div className="alert alert-info">
          <strong>Capacity Limits:</strong> Weight: 0.1-1000 kg | Dimensions: 0.01-10 m each | Max Volume: 500 m³
        </div>

        <div className="row">
          <div className="col-md-3 mb-3">
            <label className="form-label">Weight (kg) *</label>
            <input 
              type="number" 
              step="0.01" 
              min="0.1" 
              max="1000" 
              className="form-control" 
              name="weight" 
              value={formData.weight} 
              onChange={handleChange} 
              required 
              placeholder="0.1 - 1000"
            />
            <small className="text-muted">Max: 1000 kg</small>
          </div>
          <div className="col-md-3 mb-3">
            <label className="form-label">Height (m) *</label>
            <input 
              type="number" 
              step="0.01" 
              min="0.01" 
              max="10" 
              className="form-control" 
              name="height" 
              value={formData.height} 
              onChange={handleChange} 
              required 
              placeholder="0.01 - 10"
            />
            <small className="text-muted">Max: 10 m</small>
          </div>
          <div className="col-md-3 mb-3">
            <label className="form-label">Width (m) *</label>
            <input 
              type="number" 
              step="0.01" 
              min="0.01" 
              max="10" 
              className="form-control" 
              name="width" 
              value={formData.width} 
              onChange={handleChange} 
              required 
              placeholder="0.01 - 10"
            />
            <small className="text-muted">Max: 10 m</small>
          </div>
          <div className="col-md-3 mb-3">
            <label className="form-label">Length (m) *</label>
            <input 
              type="number" 
              step="0.01" 
              min="0.01" 
              max="10" 
              className="form-control" 
              name="length" 
              value={formData.length} 
              onChange={handleChange} 
              required 
              placeholder="0.01 - 10"
            />
            <small className="text-muted">Max: 10 m</small>
          </div>
        </div>

        {formData.height && formData.width && formData.length && (
          <div className="alert alert-secondary">
            <strong>Calculated Volume:</strong> {(formData.height * formData.width * formData.length).toFixed(3)} m³
            {(formData.height * formData.width * formData.length) > 500 && (
              <span className="text-danger"> - Exceeds maximum capacity!</span>
            )}
          </div>
        )}

        <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Creating...' : 'Create Parcel'}</button>
        <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate('/parcels')}>Cancel</button>
      </form>
    </div>
  );
}

export default ParcelForm;
