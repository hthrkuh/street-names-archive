import { memo } from 'react';
import type { SearchResult } from '../types';
import { STREET_FIELDS, UI_MESSAGES } from '../constants';

interface SearchResultsProps {
  results: SearchResult[];
  total: number;
  onDelete: (id: string) => void;
  isDeleting: string | null;
}

/**
 * SearchResults component - displays search results
 * Memoized to prevent unnecessary re-renders
 */
const SearchResults = memo(function SearchResults({
  results,
  total,
  onDelete,
  isDeleting,
}: SearchResultsProps) {
  if (results.length === 0) {
    return (
      <div className="no-results" dir="rtl" role="status" aria-live="polite">
        <div className="no-results-icon">🔍</div>
        <p>לא נמצאו תוצאות</p>
        <p className="no-results-hint">{UI_MESSAGES.NO_RESULTS_HINT}</p>
      </div>
    );
  }

  return (
    <div className="results-container" dir="rtl" role="region" aria-label="תוצאות חיפוש">
      <div className="results-header">
        <h2>
          תוצאות חיפוש 
          <span className="results-count" aria-label={`${total} תוצאות`}> ({total})</span>
        </h2>
      </div>
      <div className="results-list" role="list">
        {results.map((result) => (
          <article 
            key={result._id} 
            className="result-card"
            role="listitem"
            aria-label={`רשומה: ${result._source[STREET_FIELDS.MAIN_NAME]}`}
          >
            <div className="result-fields">
              <div className="field">
                <span className="field-label">{STREET_FIELDS.MAIN_NAME}:</span>
                <span className="field-value">{result._source[STREET_FIELDS.MAIN_NAME] || '-'}</span>
              </div>
              <div className="field">
                <span className="field-label">{STREET_FIELDS.TITLE}:</span>
                <span className="field-value">{result._source[STREET_FIELDS.TITLE] || '-'}</span>
              </div>
              <div className="field">
                <span className="field-label">{STREET_FIELDS.SECONDARY_NAME}:</span>
                <span className="field-value">{result._source[STREET_FIELDS.SECONDARY_NAME] || '-'}</span>
              </div>
              <div className="field">
                <span className="field-label">{STREET_FIELDS.TYPE}:</span>
                <span className="field-value">{result._source[STREET_FIELDS.TYPE] || '-'}</span>
              </div>
              <div className="field">
                <span className="field-label">{STREET_FIELDS.CODE}:</span>
                <span className="field-value">{result._source[STREET_FIELDS.CODE] || '-'}</span>
              </div>
              <div className="field">
                <span className="field-label">{STREET_FIELDS.NEIGHBORHOOD}:</span>
                <span className="field-value">{result._source[STREET_FIELDS.NEIGHBORHOOD] || '-'}</span>
              </div>
            </div>
            <button
              onClick={() => onDelete(result._id)}
              disabled={isDeleting === result._id || !!isDeleting}
              className="delete-button"
              aria-label={`מחק את הרשומה ${result._source[STREET_FIELDS.MAIN_NAME]}`}
              title="מחק רשומה זו"
            >
              {isDeleting === result._id ? UI_MESSAGES.DELETING : UI_MESSAGES.DELETE}
            </button>
          </article>
        ))}
      </div>
    </div>
  );
});

export default SearchResults;

