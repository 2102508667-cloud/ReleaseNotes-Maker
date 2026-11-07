import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createChange } from '../api/changeApi';
import ChangeForm from '../components/ChangeForm';
import './AddChange.css';

function AddChange() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (data) => {
    setLoading(true);
    setError('');
    try {
      await createChange(data);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-change-page">
      <div className="page-header">
        <button className="btn-back" onClick={() => navigate('/')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"/>
            <polyline points="12 19 5 12 12 5"/>
          </svg>
        </button>
        <div>
          <h1 className="page-title">Add New Change</h1>
          <p className="page-subtitle">Record a new feature, bugfix, or change item</p>
        </div>
      </div>

      {error && (
        <div className="form-error-banner">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
          {error}
        </div>
      )}

      <div className="form-card">
        <ChangeForm onSubmit={handleSubmit} submitLabel="Create Change" loading={loading} />
      </div>
    </div>
  );
}

export default AddChange;

