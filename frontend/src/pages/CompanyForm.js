import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { superAdminService } from '../services/superAdminApi';

function CompanyForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    name: '',
    subdomain: '',
    email: '',
    phone: '',
    address: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      loadCompany();
    }
  }, [id]);

  const loadCompany = async () => {
    try {
      const response = await superAdminService.getCompany(id);
      setFormData({
        name: response.data.name,
        subdomain: response.data.subdomain,
        email: response.data.email,
        phone: response.data.phone || '',
        address: response.data.address || '',
      });
    } catch (error) {
      setError('Error loading company');
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
        await superAdminService.updateCompany(id, formData);
      } else {
        await superAdminService.createCompany(formData);
      }
      navigate('/super-admin/companies');
    } catch (err) {
      setError(
        err.response?.data?.errors
          ? Object.values(err.response.data.errors).flat().join(', ')
          : 'Operation failed'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h1>{isEdit ? 'Edit Company' : 'Create New Company'}</h1>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Company Name *</label>
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
          <label className="form-label">Subdomain *</label>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              name="subdomain"
              value={formData.subdomain}
              onChange={handleChange}
              required
              pattern="[a-z0-9-]+"
              title="Only lowercase letters, numbers, and hyphens"
            />
            <span className="input-group-text">.site.test</span>
          </div>
          <small className="form-text text-muted">
            Only lowercase letters, numbers, and hyphens. Example: mycompany
          </small>
        </div>

        <div className="mb-3">
          <label className="form-label">Email *</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Phone</label>
          <input
            type="tel"
            className="form-control"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Address</label>
          <textarea
            className="form-control"
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows="3"
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Saving...' : isEdit ? 'Update Company' : 'Create Company'}
        </button>
        <button
          type="button"
          className="btn btn-secondary ms-2"
          onClick={() => navigate('/super-admin/companies')}
        >
          Cancel
        </button>
      </form>

      {!isEdit && (
        <div className="alert alert-info mt-4">
          <strong>Note:</strong> After creating the company, you'll need to create a Company Admin for it.
        </div>
      )}
    </div>
  );
}

export default CompanyForm;
