import { useState, useCallback, useMemo } from 'react';
import SearchForm from './components/SearchForm';
import SearchResults from './components/SearchResults';
import ErrorMessage from './components/ErrorMessage';
import LoadingSpinner from './components/LoadingSpinner';
import ConfirmDialog from './components/ConfirmDialog';
import { searchStreets, deleteStreet, ApiError } from './services/api';
import type { SearchResult, SearchMode } from './types';
import { 
  HTTP_STATUS, 
  ERROR_MESSAGES, 
  SUCCESS_MESSAGES, 
  UI_MESSAGES,
  STREET_FIELDS,
  TIMING
} from './constants';
import './App.css';

function App() {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string } | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  /**
   * Handle search request
   */
  const handleSearch = useCallback(async (query: string, mode: SearchMode) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    setResults([]);
    
    try {
      const response = await searchStreets(query, mode);
      setResults(response.hits);
      setTotal(
        typeof response.total === 'number' ? response.total : response.total.value || 0
      );
      
      // Show message if no results found
      if (response.hits.length === 0) {
        setError(ERROR_MESSAGES.NO_RESULTS);
      }
    } catch (err) {
      let errorMessage: string = ERROR_MESSAGES.SEARCH_ERROR;
      
      if (err instanceof ApiError) {
        // Handle specific error cases
        if (err.statusCode === HTTP_STATUS.BAD_REQUEST) {
          errorMessage = err.message || ERROR_MESSAGES.SEARCH_INVALID_REQUEST;
        } else if (err.statusCode === HTTP_STATUS.INTERNAL_SERVER_ERROR || err.statusCode === HTTP_STATUS.SERVICE_UNAVAILABLE) {
          errorMessage = ERROR_MESSAGES.SEARCH_SERVER_ERROR;
        } else if (err.message) {
          errorMessage = err.message;
        }
      } else if (err instanceof Error) {
        // Handle network errors
        if (err.message.includes('timeout') || err.message.includes('Network')) {
          errorMessage = ERROR_MESSAGES.SEARCH_NETWORK_ERROR;
        }
      }
      
      setError(errorMessage);
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Handle delete request initiation - shows confirmation dialog
   */
  const handleDeleteClick = useCallback((id: string) => {
    const record = results.find((r) => r._id === id);
    const recordName = record?._source[STREET_FIELDS.MAIN_NAME] || UI_MESSAGES.DEFAULT_RECORD_NAME;
    setDeleteConfirm({ id, name: recordName });
  }, [results]);

  /**
   * Handle confirmed delete request
   */
  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteConfirm) return;

    const { id } = deleteConfirm;
    setDeleteConfirm(null);
    setIsDeleting(id);
    setError(null);
    setSuccessMessage(null);
    
    try {
      await deleteStreet(id);
      // Remove the deleted item from results
      setResults((prev) => prev.filter((result) => result._id !== id));
      setTotal((prev) => Math.max(0, prev - 1));
      setSuccessMessage(SUCCESS_MESSAGES.DELETE_SUCCESS);
      // Auto-dismiss success message after configured time
      setTimeout(() => setSuccessMessage(null), TIMING.SUCCESS_MESSAGE_AUTO_DISMISS);
    } catch (err) {
      let errorMessage: string = ERROR_MESSAGES.DELETE_ERROR;
      
      if (err instanceof ApiError) {
        errorMessage = err.message || errorMessage;
        
        // Handle specific error cases
        if (err.statusCode === HTTP_STATUS.NOT_FOUND) {
          errorMessage = ERROR_MESSAGES.DELETE_NOT_FOUND;
          // Remove from results if not found
          setResults((prev) => prev.filter((result) => result._id !== id));
          setTotal((prev) => Math.max(0, prev - 1));
        } else if (err.statusCode === HTTP_STATUS.BAD_REQUEST) {
          errorMessage = ERROR_MESSAGES.DELETE_INVALID_REQUEST;
        } else if (err.statusCode === HTTP_STATUS.INTERNAL_SERVER_ERROR || err.statusCode === HTTP_STATUS.SERVICE_UNAVAILABLE) {
          errorMessage = ERROR_MESSAGES.DELETE_SERVER_ERROR;
        }
      } else if (err instanceof Error) {
        // Handle network errors
        if (err.message.includes('timeout') || err.message.includes('Network')) {
          errorMessage = ERROR_MESSAGES.DELETE_NETWORK_ERROR;
        }
      }
      
      setError(errorMessage);
      console.error('Delete error:', err);
    } finally {
      setIsDeleting(null);
    }
  }, [deleteConfirm]);

  /**
   * Cancel delete confirmation
   */
  const handleDeleteCancel = useCallback(() => {
    setDeleteConfirm(null);
  }, []);

  // Memoize results to prevent unnecessary re-renders
  const hasResults = useMemo(() => results.length > 0, [results.length]);

  return (
    <div className="app" dir="rtl">
      <header className="app-header">
        <h1>ארכיון שמות רחובות באר שבע</h1>
      </header>
      <main className="app-main">
        <SearchForm onSearch={handleSearch} isLoading={isLoading} />
        
        {/* Error Message */}
        {error && (
          <ErrorMessage
            message={error}
            type={hasResults ? 'error' : 'warning'}
            onDismiss={() => setError(null)}
          />
        )}

        {/* Success Message */}
        {successMessage && (
          <ErrorMessage
            message={successMessage}
            type="info"
            onDismiss={() => setSuccessMessage(null)}
            autoDismiss={3000}
          />
        )}

        {/* Loading Spinner */}
        {isLoading && <LoadingSpinner message={UI_MESSAGES.SEARCHING} />}

        {/* Search Results */}
        {!isLoading && hasResults && (
          <SearchResults
            results={results}
            total={total}
            onDelete={handleDeleteClick}
            isDeleting={isDeleting}
          />
        )}

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          isOpen={!!deleteConfirm}
          title={UI_MESSAGES.DELETE_CONFIRM_TITLE}
          message={deleteConfirm ? UI_MESSAGES.DELETE_CONFIRM_MESSAGE(deleteConfirm.name) : ''}
          confirmText={UI_MESSAGES.DELETE_CONFIRM_BUTTON}
          cancelText={UI_MESSAGES.DELETE_CANCEL_BUTTON}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
          type="danger"
        />
      </main>
    </div>
  );
}

export default App;
