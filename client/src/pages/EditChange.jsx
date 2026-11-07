import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchChangeById, updateChange } from '../api/changeApi';
import ChangeForm from '../components/ChangeForm';
import './EditChange.css';

function EditChange() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);
  const [loadingData, setLoadingData] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoadingData(true);
    fetchChangeById(id)
      .then((data) => setInitialData(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoadingData(false));
  }, [id]);

  const handleSubmit = async (data) => {
    setSaving(true);
    setError('');
    try {
      await updateChange(id, data);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loadingData) {
    return (
      <div className="edit-change-page">
        <div className="edit-loading">
          <div className="loader"></div>
          <p>Loading change data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-change-page">
      <div className="page-header">
        <button className="btn-back" onClick={() => navigate('/')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"/>
            <polyline points="12 19 5 12 12 5"/>
          </svg>
        </button>
        <div>
          <h1 className="page-title">Edit Change</h1>
          <p className="page-subtitle">Update the details of this change item</p>
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
        <ChangeForm
          initialData={initialData}
          onSubmit={handleSubmit}
          submitLabel="Update Change"
          loading={saving}
        />
      </div>
    </div>
  );
}

export default EditChange;

