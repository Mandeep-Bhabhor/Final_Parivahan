import { useEffect, useState } from 'react';
import { warehouseService } from '../services/api';
import { Link } from 'react-router-dom';

function Warehouses() {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWarehouses();
  }, []);

  const loadWarehouses = async () => {
    try {
      const response = await warehouseService.getAll();
      setWarehouses(response.data);
    } catch (error) {
      console.error('Error loading warehouses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this warehouse?')) {
      try {
        await warehouseService.delete(id);
        loadWarehouses();
      } catch (error) {
        alert('Error deleting warehouse');
      }
    }
  };

  if (loading) {
    return <div className="container mt-5"><div className="text-center">Loading...</div></div>;
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Warehouses</h1>
        <Link to="/warehouses/create" className="btn btn-primary">Add Warehouse</Link>
      </div>

      {warehouses.length === 0 ? (
        <div className="alert alert-info">No warehouses found. Create one to get started.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Name</th>
                <th>Address</th>
                <th>Capacity (Weight)</th>
                <th>Capacity (Volume)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {warehouses.map((warehouse) => (
                <tr key={warehouse.id}>
                  <td>{warehouse.name}</td>
                  <td>{warehouse.address}</td>
                  <td>{warehouse.capacity_weight} kg</td>
                  <td>{warehouse.capacity_volume} m³</td>
                  <td>
                    <Link to={`/warehouses/edit/${warehouse.id}`} className="btn btn-sm btn-warning me-2">
                      Edit
                    </Link>
                    <button onClick={() => handleDelete(warehouse.id)} className="btn btn-sm btn-danger">
                      Delete
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

export default Warehouses;
