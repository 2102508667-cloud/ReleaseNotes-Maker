import { useState, useEffect } from 'react';
import { fetchVersions, fetchChanges, generateReleaseNotes } from '../api/changeApi';
import './ReleaseNoteGenerator.css';

const TYPE_COLORS = {
  feature: '#3b82f6',
  bugfix: '#ef4444',
  improvement: '#22c55e',
  breaking: '#f59e0b',
  deprecation: '#f97316',
  security: '#a855f7',
};

function ReleaseNoteGenerator({ onGenerated }) {
  const [versions, setVersions] = useState([]);
  const [selectedVersion, setSelectedVersion] = useState('');
  const [changes, setChanges] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [loadingChanges, setLoadingChanges] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchVersions()
      .then((data) => setVersions(Array.isArray(data) ? data : []))
      .catch(() => setVersions([]));
  }, []);

  useEffect(() => {
    if (!selectedVersion) {
      setChanges([]);
      setSelectedIds(new Set());
      return;
    }

    setLoadingChanges(true);
    setError('');
    fetchChanges({ version: selectedVersion, status: 'completed' })
      .then((data) => {
        const items = Array.isArray(data) ? data : [];
        setChanges(items);
        setSelectedIds(new Set(items.map((c) => c._id)));
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoadingChanges(false));
  }, [selectedVersion]);

  const toggleItem = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedIds.size === changes.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(changes.map((c) => c._id)));
    }
  };

  const handleGenerate = async () => {
    if (selectedIds.size === 0) {
      setError('Please select at least one change item.');
      return;
    }

    setGenerating(true);
    setError('');
    try {
      const result = await generateReleaseNotes(selectedVersion, [...selectedIds]);
      onGenerated(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="release-generator">
      <div className="gen-step">
        <div className="step-number">1</div>
        <div className="step-content">
          <h3 className="step-title">Select Version</h3>
          <select
            className="gen-select"
            value={selectedVersion}
            onChange={(e) => setSelectedVersion(e.target.value)}
          >
            <option value="">Choose a version...</option>
            {versions.map((v) => (
              <option key={v} value={v}>v{v}</option>
            ))}
          </select>
        </div>
      </div>

      {selectedVersion && (
        <div className="gen-step">
          <div className="step-number">2</div>
          <div className="step-content">
            <div className="step-header">
              <h3 className="step-title">Select Completed Changes</h3>
              {changes.length > 0 && (
                <button className="btn-toggle-all" onClick={toggleAll}>
                  {selectedIds.size === changes.length ? 'Deselect All' : 'Select All'}
                </button>
              )}
            </div>

            {loadingChanges ? (
              <div className="gen-loading">
                <div className="loader-sm"></div>
                <span>Loading changes...</span>
              </div>
            ) : changes.length === 0 ? (
              <div className="gen-empty">
                <p>No completed changes found for v{selectedVersion}.</p>
              </div>
            ) : (
              <div className="gen-checklist">
                {changes.map((change) => (
                  <label key={change._id} className={`check-item ${selectedIds.has(change._id) ? 'checked' : ''}`}>
                    <input
                      type="checkbox"
                      checked={selectedIds.has(change._id)}
                      onChange={() => toggleItem(change._id)}
                      className="check-input"
                    />
                    <span className="check-mark">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </span>
                    <span className="check-type" style={{ backgroundColor: TYPE_COLORS[change.type] || '#64748b' }}>
                      {change.type}
                    </span>
                    <span className="check-title">{change.title}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {selectedVersion && changes.length > 0 && (
        <div className="gen-step">
          <div className="step-number">3</div>
          <div className="step-content">
            <h3 className="step-title">Generate Release Notes</h3>
            <p className="step-desc">
              {selectedIds.size} of {changes.length} items selected
            </p>
            <button
              className="btn btn-primary btn-generate"
              onClick={handleGenerate}
              disabled={generating || selectedIds.size === 0}
            >
              {generating ? (
                <>
                  <span className="spinner"></span>
                  Generating...
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <polyline points="10 9 9 9 8 9"/>
                  </svg>
                  Generate Release Notes
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="gen-error">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
          {error}
        </div>
      )}
    </div>
  );
}

export default ReleaseNoteGenerator;

