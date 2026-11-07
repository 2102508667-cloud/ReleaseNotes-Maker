import { useState, useEffect } from 'react';
import { fetchVersions } from '../api/changeApi';
import './FilterBar.css';

const TYPES = ['', 'feature', 'bugfix', 'improvement', 'breaking', 'deprecation', 'security'];
const STATUSES = ['', 'planned', 'in-progress', 'completed', 'released'];

function FilterBar({ filters, onFilterChange }) {
  const [versions, setVersions] = useState([]);

  useEffect(() => {
    fetchVersions()
      .then((data) => setVersions(Array.isArray(data) ? data : []))
      .catch(() => setVersions([]));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value });
  };

  const handleClear = () => {
    onFilterChange({ type: '', version: '', status: '', search: '' });
  };

  const hasFilters = filters.type || filters.version || filters.status || filters.search;

  return (
    <div className="filter-bar">
      <div className="filter-controls">
        <div className="filter-group">
          <select
            name="type"
            className="filter-select"
            value={filters.type}
            onChange={handleChange}
          >
            <option value="">All Types</option>
            {TYPES.filter(Boolean).map((t) => (
              <option key={t} value={t}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <select
            name="version"
            className="filter-select"
            value={filters.version}
            onChange={handleChange}
          >
            <option value="">All Versions</option>
            {versions.map((v) => (
              <option key={v} value={v}>
                v{v}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <select
            name="status"
            className="filter-select"
            value={filters.status}
            onChange={handleChange}
          >
            <option value="">All Statuses</option>
            {STATUSES.filter(Boolean).map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1).replace('-', ' ')}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group filter-search">
          <div className="search-wrapper">
            <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              name="search"
              className="filter-input"
              value={filters.search}
              onChange={handleChange}
              placeholder="Search changes..."
            />
          </div>
        </div>

        {hasFilters && (
          <button className="btn-clear" onClick={handleClear} title="Clear filters">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
            Clear
          </button>
        )}
      </div>
    </div>
  );
}

export default FilterBar;

