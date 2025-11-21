import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { superAdminService } from '../services/superAdminApi';

function CompanyManagement() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      const response = await superAdminService.getCompanies();
      setCompanies(response.data);
    } catch (error) {
      console.error('Error loading companies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    if (window.confirm(`Are you sure you want to ${currentStatus ? 'deactivate' : 'activate'} this company?`)) {
      try {
        await superAdminService.toggleCompanyStatus(id);
        loadCompanies();
      } catch (error) {
        alert('Error toggling company status');
      }
    }
  };

  if (loading) {
    return <div className="container mt-5"><div className="text-center">Loading...</div></div>;
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Company Management</h1>
        <Link to="/super-admin/companies/create" className="btn btn-primary">
          + Create New Company
        </Link>
      </div>

      {companies.length === 0 ? (
        <div className="alert alert-info">No companies found.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Subdomain</th>
                <th>Email</th>
                <th>Users</th>
                <th>Parcels</th>
                <th>Shipments</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((company) => (
                <tr key={company.id}>
                  <td>{company.id}</td>
                  <td>{company.name}</td>
                  <td>
                    <code>{company.subdomain}.site.test</code>
                  </td>
                  <td>{company.email}</td>
                  <td>{company.users_count}</td>
                  <td>{company.parcels_count}</td>
                  <td>{company.shipments_count}</td>
                  <td>
                    <span className={`badge ${company.is_active ? 'bg-success' : 'bg-danger'}`}>
                      {company.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <Link to={`/super-admin/companies/${company.id}`} className="btn btn-sm btn-info me-2">
                      View
                    </Link>
                    <Link to={`/super-admin/companies/${company.id}/edit`} className="btn btn-sm btn-warning me-2">
                      Edit
                    </Link>
                    <button
                      onClick={() => handleToggleStatus(company.id, company.is_active)}
                      className={`btn btn-sm ${company.is_active ? 'btn-danger' : 'btn-success'}`}
                    >
                      {company.is_active ? 'Deactivate' : 'Activate'}
                    </button>
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

export default CompanyManagement;
