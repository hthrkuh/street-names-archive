import { useState, useCallback, useEffect, useRef } from 'react';
import type { FormEvent, KeyboardEvent } from 'react';
import type { SearchMode } from '../types';
import { SearchMode as SearchModeEnum, SEARCH_MODE_LABELS, VALIDATION } from '../constants';

interface SearchFormProps {
  onSearch: (query: string, mode: SearchMode) => void;
  isLoading: boolean;
}

export default function SearchForm({ onSearch, isLoading }: SearchFormProps) {
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<SearchMode>(SearchModeEnum.FREE);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on mount for better UX
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    // Escape to clear
    if (e.key === 'Escape') {
      setQuery('');
      inputRef.current?.focus();
    }
    // Enter to search (handled by form submit)
  }, []);

  const handleSubmit = useCallback((e: FormEvent) => {
    e.preventDefault();
    const trimmedQuery = query.trim();
    if (trimmedQuery && !isLoading) {
      onSearch(trimmedQuery, mode);
    }
  }, [query, mode, isLoading, onSearch]);

  const handleModeChange = useCallback((newMode: SearchMode) => {
    setMode(newMode);
    // Auto-search when mode changes if there's a query
    if (query.trim() && !isLoading) {
      onSearch(query.trim(), newMode);
    }
  }, [query, isLoading, onSearch]);

  return (
    <form onSubmit={handleSubmit} className="search-form" role="search" aria-label="חיפוש שמות רחובות">
      <div className="search-input-group">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="הזן מילת חיפוש..."
          className="search-input"
          dir="rtl"
          aria-label="שדה חיפוש"
          aria-describedby="search-hint"
          disabled={isLoading}
          autoComplete="off"
        />
        <button 
          type="submit" 
          disabled={isLoading || !query.trim()} 
          className="search-button"
          aria-label="בצע חיפוש"
        >
          {isLoading ? 'מחפש...' : 'חפש'}
        </button>
      </div>
      {query.length > 0 && query.length < VALIDATION.MIN_QUERY_HINT_THRESHOLD && (
        <p id="search-hint" className="search-hint" dir="rtl">
          נסה להזין לפחות {VALIDATION.MIN_QUERY_HINT_THRESHOLD} תווים לחיפוש טוב יותר
        </p>
      )}

      <fieldset className="radio-group" dir="rtl">
        <legend className="radio-legend">סוג חיפוש:</legend>
        <label className="radio-label">
          <input
            type="radio"
            name="searchMode"
            value={SearchModeEnum.FREE}
            checked={mode === SearchModeEnum.FREE}
            onChange={(e) => handleModeChange(e.target.value as SearchMode)}
            disabled={isLoading}
            aria-describedby="mode-free-desc"
          />
          <span>
            <strong>{SEARCH_MODE_LABELS[SearchModeEnum.FREE].title}</strong>
            <span id="mode-free-desc" className="radio-description">{SEARCH_MODE_LABELS[SearchModeEnum.FREE].description}</span>
          </span>
        </label>

        <label className="radio-label">
          <input
            type="radio"
            name="searchMode"
            value={SearchModeEnum.EXACT}
            checked={mode === SearchModeEnum.EXACT}
            onChange={(e) => handleModeChange(e.target.value as SearchMode)}
            disabled={isLoading}
            aria-describedby="mode-exact-desc"
          />
          <span>
            <strong>{SEARCH_MODE_LABELS[SearchModeEnum.EXACT].title}</strong>
            <span id="mode-exact-desc" className="radio-description">{SEARCH_MODE_LABELS[SearchModeEnum.EXACT].description}</span>
          </span>
        </label>

        <label className="radio-label">
          <input
            type="radio"
            name="searchMode"
            value={SearchModeEnum.FULL}
            checked={mode === SearchModeEnum.FULL}
            onChange={(e) => handleModeChange(e.target.value as SearchMode)}
            disabled={isLoading}
            aria-describedby="mode-full-desc"
          />
          <span>
            <strong>{SEARCH_MODE_LABELS[SearchModeEnum.FULL].title}</strong>
            <span id="mode-full-desc" className="radio-description">{SEARCH_MODE_LABELS[SearchModeEnum.FULL].description}</span>
          </span>
        </label>
      </fieldset>
    </form>
  );
}

