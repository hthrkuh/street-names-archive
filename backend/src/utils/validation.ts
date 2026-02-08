/**
 * Input validation utilities
 */
import { ValidationError } from './errors';
import { VALIDATION, ERROR_MESSAGES, SearchMode } from '../constants';

/**
 * Validates and sanitizes search query
 * @param query - The search query
 * @returns Sanitized query or throws error if invalid
 */
export function validateSearchQuery(query: string | undefined): string {
  if (!query || typeof query !== 'string') {
    throw new ValidationError(ERROR_MESSAGES.SEARCH_QUERY_REQUIRED);
  }

  const trimmed = query.trim();
  
  if (trimmed.length === 0) {
    throw new ValidationError(ERROR_MESSAGES.SEARCH_QUERY_EMPTY);
  }

  if (trimmed.length > VALIDATION.MAX_QUERY_LENGTH) {
    throw new ValidationError(ERROR_MESSAGES.SEARCH_QUERY_TOO_LONG(VALIDATION.MAX_QUERY_LENGTH));
  }

  // Basic sanitization - remove potentially dangerous characters
  // Allow Hebrew, English, numbers, spaces, and common punctuation
  const sanitized = trimmed.replace(/[<>{}[\]\\]/g, '');
  
  return sanitized;
}

/**
 * Validates document ID
 * @param id - The document ID to validate
 * @returns Validated ID or throws error if invalid
 */
export function validateDocumentId(id: string | undefined): string {
  if (!id || typeof id !== 'string') {
    throw new ValidationError(ERROR_MESSAGES.DOCUMENT_ID_REQUIRED);
  }

  const trimmed = id.trim();
  
  if (trimmed.length === 0) {
    throw new ValidationError(ERROR_MESSAGES.DOCUMENT_ID_EMPTY);
  }

  if (trimmed.length > VALIDATION.MAX_ID_LENGTH) {
    throw new ValidationError(ERROR_MESSAGES.DOCUMENT_ID_TOO_LONG(VALIDATION.MAX_ID_LENGTH));
  }

  // Validate ID format (Elasticsearch IDs are alphanumeric with some special chars)
  if (!/^[a-zA-Z0-9_-]+$/.test(trimmed)) {
    throw new ValidationError(ERROR_MESSAGES.DOCUMENT_ID_INVALID_FORMAT);
  }

  return trimmed;
}

/**
 * Validates search mode
 * @param mode - The search mode to validate
 * @returns Validated mode or default FREE
 */
export function validateSearchMode(mode: string | undefined): SearchMode {
  if (!mode) {
    return SearchMode.FREE;
  }

  const validModes = Object.values(SearchMode);
  
  if (validModes.includes(mode as SearchMode)) {
    return mode as SearchMode;
  }

  return SearchMode.FREE;
}

