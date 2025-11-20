import { useEffect, useState } from 'react';
import { companyService } from '../services/api';

function Users() {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'staff',
    is_driver: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await companyService.getUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await companyService.addUser(formData);
      setShowForm(false);
      setFormData({ name: '', email: '', password: '', role: 'staff', is_driver: false });
      loadUsers();
    } catch (err) {
      setError(err.response?.data?.errors ? Object.values(err.response.data.errors).flat().join(', ') : 'Failed to add user');
    }
  };

  if (loading) return <div className="container mt-5"><div className="text-center">Loading...</div></div>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Company Users</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Add User'}
        </button>
      </div>

      {showForm && (
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">Add New User</h5>
            {error && <div className="alert alert-danger">{error}</div>}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required />
              </div>

              <div className="mb-3">
                <label className="form-label">Email</label>
                <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
              </div>

              <div className="mb-3">
                <label className="form-label">Password</label>
                <input type="password" className="form-control" name="password" value={formData.password} onChange={handleChange} required />
              </div>

              <div className="mb-3">
                <label className="form-label">Role</label>
                <select className="form-select" name="role" value={formData.role} onChange={handleChange}>
                  <option value="staff">Staff</option>
                  <option value="driver">Driver</option>
                </select>
              </div>

              <div className="mb-3 form-check">
                <input type="checkbox" className="form-check-input" name="is_driver" checked={formData.is_driver} onChange={handleChange} />
                <label className="form-check-label">Is Driver</label>
              </div>

              <button type="submit" className="btn btn-primary">Add User</button>
            </form>
          </div>
        </div>
      )}

      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Is Driver</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td><span className="badge bg-primary">{user.role}</span></td>
                <td>{user.is_driver ? <span className="badge bg-success">Yes</span> : <span className="badge bg-secondary">No</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Users;
