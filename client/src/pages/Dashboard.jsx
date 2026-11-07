import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchChanges, deleteChange } from '../api/changeApi';
import FilterBar from '../components/FilterBar';
import ChangeList from '../components/ChangeList';
import ConfirmModal from '../components/ConfirmModal';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const [changes, setChanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ type: '', version: '', status: '', search: '' });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  const loadChanges = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchChanges(filters);
      setChanges(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadChanges();
  }, [loadChanges]);

  const handleEdit = (id) => {
    navigate(`/edit/${id}`);
  };

  const handleDeleteClick = (id) => {
    setDeleteTarget(id);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteChange(deleteTarget);
      setDeleteTarget(null);
      loadChanges();
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteTarget(null);
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">
            {loading ? 'Loading...' : `${changes.length} change${changes.length !== 1 ? 's' : ''} found`}
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/add')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add Change
        </button>
      </div>

      <FilterBar filters={filters} onFilterChange={setFilters} />

      {error && (
        <div className="dashboard-error">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
          {error}
        </div>
      )}

      <ChangeList
        changes={changes}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        loading={loading}
      />

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Change"
        message="Are you sure you want to delete this change? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        loading={deleting}
      />
    </div>
  );
}

export default Dashboard;

