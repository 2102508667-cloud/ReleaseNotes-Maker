import './ChangeCard.css';

const TYPE_COLORS = {
  feature: '#3b82f6',
  bugfix: '#ef4444',
  improvement: '#22c55e',
  breaking: '#f59e0b',
  deprecation: '#f97316',
  security: '#a855f7',
};

const STATUS_COLORS = {
  planned: '#64748b',
  'in-progress': '#f59e0b',
  completed: '#22c55e',
  released: '#3b82f6',
};

function ChangeCard({ change, onEdit, onDelete }) {
  const typeColor = TYPE_COLORS[change.type] || '#64748b';
  const statusColor = STATUS_COLORS[change.status] || '#64748b';
  const createdDate = change.createdAt
    ? new Date(change.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : '';

  return (
    <div className="change-card">
      <div className="card-header">
        <span className="type-badge" style={{ backgroundColor: typeColor }}>
          {change.type}
        </span>
        <span className="status-pill" style={{ borderColor: statusColor, color: statusColor }}>
          {change.status}
        </span>
      </div>

      <h3 className="card-title">{change.title}</h3>

      {change.description && (
        <p className="card-description">{change.description}</p>
      )}

      <div className="card-meta">
        {change.version && (
          <span className="meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/>
              <line x1="7" y1="7" x2="7.01" y2="7"/>
            </svg>
            v{change.version}
          </span>
        )}
        {change.author && (
          <span className="meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            {change.author}
          </span>
        )}
        {createdDate && (
          <span className="meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            {createdDate}
          </span>
        )}
      </div>

      {change.tags && change.tags.length > 0 && (
        <div className="card-tags">
          {change.tags.map((tag, i) => (
            <span key={i} className="tag">{tag}</span>
          ))}
        </div>
      )}

      <div className="card-actions">
        <button className="btn-icon btn-edit" onClick={() => onEdit(change._id)} title="Edit">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </button>
        <button className="btn-icon btn-delete" onClick={() => onDelete(change._id)} title="Delete">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
            <line x1="10" y1="11" x2="10" y2="17"/>
            <line x1="14" y1="11" x2="14" y2="17"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

export default ChangeCard;

