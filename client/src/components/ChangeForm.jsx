import { useState, useEffect } from 'react';
import './ChangeForm.css';

const TYPES = ['feature', 'bugfix', 'improvement', 'breaking', 'deprecation', 'security'];
const STATUSES = ['planned', 'in-progress', 'completed', 'released'];
const SEMVER_REGEX = /^\d+\.\d+\.\d+$/;

function ChangeForm({ initialData, onSubmit, submitLabel = 'Save', loading = false }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'feature',
    version: '',
    status: 'planned',
    author: '',
    tags: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        type: initialData.type || 'feature',
        version: initialData.version || '',
        status: initialData.status || 'planned',
        author: initialData.author || '',
        tags: Array.isArray(initialData.tags) ? initialData.tags.join(', ') : (initialData.tags || ''),
      });
    }
  }, [initialData]);

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.version.trim()) {
      newErrors.version = 'Version is required';
    } else if (!SEMVER_REGEX.test(formData.version.trim())) {
      newErrors.version = 'Version must be in semver format (e.g. 1.0.0)';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      ...formData,
      title: formData.title.trim(),
      description: formData.description.trim(),
      version: formData.version.trim(),
      author: formData.author.trim(),
      tags: formData.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    };
    onSubmit(payload);
  };

  return (
    <form className="change-form" onSubmit={handleSubmit} noValidate>
      <div className="form-group">
        <label htmlFor="title" className="form-label">
          Title <span className="required">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          className={`form-input ${errors.title ? 'input-error' : ''}`}
          value={formData.title}
          onChange={handleChange}
          placeholder="Short description of the change"
        />
        {errors.title && <span className="error-text">{errors.title}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="description" className="form-label">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          className="form-textarea"
          value={formData.description}
          onChange={handleChange}
          placeholder="Detailed description of the change..."
          rows={4}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="type" className="form-label">Type</label>
          <select
            id="type"
            name="type"
            className="form-select"
            value={formData.type}
            onChange={handleChange}
          >
            {TYPES.map((t) => (
              <option key={t} value={t}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="version" className="form-label">
            Version <span className="required">*</span>
          </label>
          <input
            type="text"
            id="version"
            name="version"
            className={`form-input ${errors.version ? 'input-error' : ''}`}
            value={formData.version}
            onChange={handleChange}
            placeholder="e.g. 1.0.0"
          />
          {errors.version && <span className="error-text">{errors.version}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="status" className="form-label">Status</label>
          <select
            id="status"
            name="status"
            className="form-select"
            value={formData.status}
            onChange={handleChange}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1).replace('-', ' ')}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="author" className="form-label">Author</label>
          <input
            type="text"
            id="author"
            name="author"
            className="form-input"
            value={formData.author}
            onChange={handleChange}
            placeholder="Author name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="tags" className="form-label">Tags</label>
          <input
            type="text"
            id="tags"
            name="tags"
            className="form-input"
            value={formData.tags}
            onChange={handleChange}
            placeholder="Comma-separated tags (e.g. api, ui, auth)"
          />
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? (
            <>
              <span className="spinner"></span>
              Saving...
            </>
          ) : (
            submitLabel
          )}
        </button>
      </div>
    </form>
  );
}

export default ChangeForm;

