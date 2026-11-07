import ChangeCard from './ChangeCard';
import './ChangeList.css';

function ChangeList({ changes, onEdit, onDelete, loading }) {
  if (loading) {
    return (
      <div className="change-list-loading">
        <div className="loader"></div>
        <p>Loading changes...</p>
      </div>
    );
  }

  if (!changes || changes.length === 0) {
    return (
      <div className="change-list-empty">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="empty-icon">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="12" y1="18" x2="12" y2="12"/>
          <line x1="9" y1="15" x2="15" y2="15"/>
        </svg>
        <h3>No changes found</h3>
        <p>Try adjusting your filters or add a new change item.</p>
      </div>
    );
  }

  return (
    <div className="change-list-grid">
      {changes.map((change) => (
        <ChangeCard
          key={change._id}
          change={change}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export default ChangeList;

