import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService, setAuth } from '../services/auth';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'customer',
    company_name: '',
    subdomain: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.register(formData);
      setAuth(response.data.user, response.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.errors ? 
        Object.values(err.response.data.errors).flat().join(', ') : 
        'Registration failed'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Register</h2>
              
              {error && (
                <div className="alert alert-danger">{error}</div>
              )}

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
                  <label className="form-label">Email</label>
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
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Confirm Password</label>
                  <input
                    type="password"
                    className="form-control"
                    name="password_confirmation"
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Register As</label>
                  <select
                    className="form-select"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <option value="customer">Customer</option>
                    <option value="company_admin">Company Admin</option>
                  </select>
                </div>

                {formData.role === 'company_admin' && (
                  <>
                    <div className="mb-3">
                      <label className="form-label">Company Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="company_name"
                        value={formData.company_name}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Subdomain</label>
                      <input
                        type="text"
                        className="form-control"
                        name="subdomain"
                        value={formData.subdomain}
                        onChange={handleChange}
                        required
                      />
                      <small className="form-text text-muted">
                        Your company will be accessible at: {formData.subdomain}.site.test
                      </small>
                    </div>
                  </>
                )}

                <button 
                  type="submit" 
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? 'Registering...' : 'Register'}
                </button>
              </form>

              <div className="text-center mt-3">
                <Link to="/login">Already have an account? Login</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
