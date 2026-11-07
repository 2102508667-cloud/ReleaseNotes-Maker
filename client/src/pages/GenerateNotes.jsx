import { useState } from 'react';
import ReleaseNoteGenerator from '../components/ReleaseNoteGenerator';
import ReleaseNotePreview from '../components/ReleaseNotePreview';
import './GenerateNotes.css';

function GenerateNotes() {
  const [releaseData, setReleaseData] = useState(null);

  const handleGenerated = (data) => {
    setReleaseData(data);
  };

  return (
    <div className="generate-page">
      <div className="page-header-simple">
        <h1 className="page-title">Generate Release Notes</h1>
        <p className="page-subtitle">
          Select a version and completed changes to generate formatted release notes
        </p>
      </div>

      <ReleaseNoteGenerator onGenerated={handleGenerated} />

      {releaseData && (
        <div className="preview-section">
          <div className="preview-divider">
            <span className="divider-label">Preview</span>
          </div>
          <ReleaseNotePreview data={releaseData} />
        </div>
      )}
    </div>
  );
}

export default GenerateNotes;

