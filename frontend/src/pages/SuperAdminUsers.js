import { useEffect, useState } from 'react';
import { superAdminService } from '../services/superAdminApi';

function SuperAdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await superAdminService.getAllUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = filter === 'all' 
    ? users 
    : users.filter(u => u.role === filter);

  const getRoleBadge = (role) => {
    const badges = {
      company_admin: 'bg-primary',
      staff: 'bg-info',
      driver: 'bg-success',
      customer: 'bg-secondary',
    };
    return badges[role] || 'bg-secondary';
  };

  if (loading) {
    return <div className="container mt-5"><div className="text-center">Loading...</div></div>;
  }

  return (
    <div className="container mt-4">
      <h1 className="mb-4">All Users</h1>

      {/* Filter Buttons */}
      <div className="btn-group mb-3" role="group">
        <button
          className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => setFilter('all')}
        >
          All ({users.length})
        </button>
        <button
          className={`btn ${filter === 'company_admin' ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => setFilter('company_admin')}
        >
          Company Admins ({users.filter(u => u.role === 'company_admin').length})
        </button>
        <button
          className={`btn ${filter === 'staff' ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => setFilter('staff')}
        >
          Staff ({users.filter(u => u.role === 'staff').length})
        </button>
        <button
          className={`btn ${filter === 'driver' ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => setFilter('driver')}
        >
          Drivers ({users.filter(u => u.role === 'driver').length})
        </button>
        <button
          className={`btn ${filter === 'customer' ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => setFilter('customer')}
        >
          Customers ({users.filter(u => u.role === 'customer').length})
        </button>
      </div>

      {/* Users Table */}
      {filteredUsers.length === 0 ? (
        <div className="alert alert-info">No users found.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Company</th>
                <th>Is Driver</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`badge ${getRoleBadge(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    {user.company ? (
                      <span>{user.company.name}</span>
                    ) : (
                      <span className="text-muted">-</span>
                    )}
                  </td>
                  <td>
                    {user.is_driver ? (
                      <span className="badge bg-success">Yes</span>
                    ) : (
                      <span className="text-muted">-</span>
                    )}
                  </td>
                  <td>{new Date(user.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default SuperAdminUsers;
