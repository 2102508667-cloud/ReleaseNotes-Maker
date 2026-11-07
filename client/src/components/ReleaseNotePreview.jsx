import { useState } from 'react';
import './ReleaseNotePreview.css';

function ReleaseNotePreview({ data }) {
  const [copied, setCopied] = useState(false);

  if (!data) return null;

  const markdown = data.markdownContent || '';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = markdown;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `release-notes-v${data.version || 'unknown'}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderMarkdown = (md) => {
    const lines = md.split('\n');
    const elements = [];
    let inList = false;
    let listItems = [];

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`list-${elements.length}`} className="md-list">
            {listItems.map((item, i) => (
              <li key={i} className="md-list-item">{renderInline(item)}</li>
            ))}
          </ul>
        );
        listItems = [];
        inList = false;
      }
    };

    const renderInline = (text) => {
      const parts = [];
      let remaining = text;
      let key = 0;

      while (remaining.length > 0) {
        const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
        const codeMatch = remaining.match(/`([^`]+)`/);

        let firstMatch = null;
        let firstIndex = remaining.length;

        if (boldMatch && boldMatch.index < firstIndex) {
          firstMatch = { type: 'bold', match: boldMatch };
          firstIndex = boldMatch.index;
        }
        if (codeMatch && codeMatch.index < firstIndex) {
          firstMatch = { type: 'code', match: codeMatch };
          firstIndex = codeMatch.index;
        }

        if (!firstMatch) {
          parts.push(remaining);
          break;
        }

        if (firstIndex > 0) {
          parts.push(remaining.substring(0, firstIndex));
        }

        if (firstMatch.type === 'bold') {
          parts.push(<strong key={key++}>{firstMatch.match[1]}</strong>);
          remaining = remaining.substring(firstIndex + firstMatch.match[0].length);
        } else if (firstMatch.type === 'code') {
          parts.push(<code key={key++} className="md-inline-code">{firstMatch.match[1]}</code>);
          remaining = remaining.substring(firstIndex + firstMatch.match[0].length);
        }
      }
      return parts;
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.match(/^#{1}\s/)) {
        flushList();
        elements.push(<h1 key={i} className="md-h1">{renderInline(line.replace(/^#\s+/, ''))}</h1>);
      } else if (line.match(/^#{2}\s/)) {
        flushList();
        elements.push(<h2 key={i} className="md-h2">{renderInline(line.replace(/^##\s+/, ''))}</h2>);
      } else if (line.match(/^#{3}\s/)) {
        flushList();
        elements.push(<h3 key={i} className="md-h3">{renderInline(line.replace(/^###\s+/, ''))}</h3>);
      } else if (line.match(/^[-*]\s/)) {
        inList = true;
        listItems.push(line.replace(/^[-*]\s+/, ''));
      } else if (line.match(/^---+$/)) {
        flushList();
        elements.push(<hr key={i} className="md-hr" />);
      } else if (line.trim() === '') {
        flushList();
      } else {
        flushList();
        elements.push(<p key={i} className="md-p">{renderInline(line)}</p>);
      }
    }
    flushList();

    return elements;
  };

  return (
    <div className="release-preview">
      <div className="preview-toolbar">
        <div className="preview-meta">
          <span className="preview-version">v{data.version}</span>
          {data.generatedAt && (
            <span className="preview-date">
              Generated {new Date(data.generatedAt).toLocaleString()}
            </span>
          )}
        </div>
        <div className="preview-actions">
          <button className="btn btn-secondary" onClick={handleCopy}>
            {copied ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                  <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
                </svg>
                Copy to Clipboard
              </>
            )}
          </button>
          <button className="btn btn-secondary" onClick={handleDownload}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Download .md
          </button>
        </div>
      </div>

      <div className="preview-content">
        {renderMarkdown(markdown)}
      </div>
    </div>
  );
}

export default ReleaseNotePreview;

