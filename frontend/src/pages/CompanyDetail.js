import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { superAdminService } from '../services/superAdminApi';

function CompanyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [adminForm, setAdminForm] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCompany();
  }, [id]);

  const loadCompany = async () => {
    try {
      const response = await superAdminService.getCompany(id);
      setCompany(response.data);
    } catch (error) {
      setError('Error loading company');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminFormChange = (e) => {
    setAdminForm({ ...adminForm, [e.target.name]: e.target.value });
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await superAdminService.createCompanyAdmin(id, adminForm);
      alert('Company Admin created successfully!');
      setShowAdminForm(false);
      setAdminForm({ name: '', email: '', password: '' });
      loadCompany();
    } catch (err) {
      setError(
        err.response?.data?.error ||
        (err.response?.data?.errors
          ? Object.values(err.response.data.errors).flat().join(', ')
          : 'Failed to create admin')
      );
    }
  };

  const hasAdmin = company?.users?.some(u => u.role === 'company_admin');

  if (loading) {
    return <div className="container mt-5"><div className="text-center">Loading...</div></div>;
  }

  if (!company) {
    return <div className="container mt-5"><div className="alert alert-danger">Company not found</div></div>;
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>{company.name}</h1>
        <div>
          <Link to={`/super-admin/companies/${id}/edit`} className="btn btn-warning me-2">
            Edit Company
          </Link>
          <button className="btn btn-secondary" onClick={() => navigate('/super-admin/companies')}>
            Back
          </button>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Company Info */}
      <div className="row">
        <div className="col-md-6">
          <div className="card mb-3">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Company Information</h5>
            </div>
            <div className="card-body">
              <table className="table table-borderless mb-0">
                <tbody>
                  <tr>
                    <th width="40%">ID:</th>
                    <td>{company.id}</td>
                  </tr>
                  <tr>
                    <th>Name:</th>
                    <td>{company.name}</td>
                  </tr>
                  <tr>
                    <th>Subdomain:</th>
                    <td><code>{company.subdomain}.site.test</code></td>
                  </tr>
                  <tr>
                    <th>Email:</th>
                    <td>{company.email}</td>
                  </tr>
                  <tr>
                    <th>Phone:</th>
                    <td>{company.phone || 'N/A'}</td>
                  </tr>
                  <tr>
                    <th>Address:</th>
                    <td>{company.address || 'N/A'}</td>
                  </tr>
                  <tr>
                    <th>Status:</th>
                    <td>
                      <span className={`badge ${company.is_active ? 'bg-success' : 'bg-danger'}`}>
                        {company.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card mb-3">
            <div className="card-header bg-info text-white">
              <h5 className="mb-0">Statistics</h5>
            </div>
            <div className="card-body">
              <table className="table table-borderless mb-0">
                <tbody>
                  <tr>
                    <th width="50%">Total Users:</th>
                    <td>{company.users_count}</td>
                  </tr>
                  <tr>
                    <th>Warehouses:</th>
                    <td>{company.warehouses_count}</td>
                  </tr>
                  <tr>
                    <th>Vehicles:</th>
                    <td>{company.vehicles_count}</td>
                  </tr>
                  <tr>
                    <th>Parcels:</th>
                    <td>{company.parcels_count}</td>
                  </tr>
                  <tr>
                    <th>Shipments:</th>
                    <td>{company.shipments_count}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Users */}
      <div className="card mb-3">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Company Users</h5>
          {!hasAdmin && (
            <button
              className="btn btn-sm btn-success"
              onClick={() => setShowAdminForm(!showAdminForm)}
            >
              {showAdminForm ? 'Cancel' : '+ Create Company Admin'}
            </button>
          )}
        </div>
        <div className="card-body">
          {showAdminForm && (
            <div className="alert alert-light border">
              <h6>Create Company Admin</h6>
              <form onSubmit={handleCreateAdmin}>
                <div className="mb-2">
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    placeholder="Admin Name"
                    value={adminForm.name}
                    onChange={handleAdminFormChange}
                    required
                  />
                </div>
                <div className="mb-2">
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    placeholder="Admin Email"
                    value={adminForm.email}
                    onChange={handleAdminFormChange}
                    required
                  />
                </div>
                <div className="mb-2">
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    placeholder="Password (min 8 characters)"
                    value={adminForm.password}
                    onChange={handleAdminFormChange}
                    required
                    minLength="8"
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-sm">
                  Create Admin
                </button>
              </form>
            </div>
          )}

          {company.users && company.users.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Driver</th>
                  </tr>
                </thead>
                <tbody>
                  {company.users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className="badge bg-primary">{user.role}</span>
                      </td>
                      <td>{user.is_driver ? '✓' : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted">No users yet. Create a company admin to get started.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default CompanyDetail;
