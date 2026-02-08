/**
 * Application constants
 */

// Search modes
export enum SearchMode {
  FREE = 'free',
  EXACT = 'exact',
  FULL = 'full',
}

// Elasticsearch field names
export const STREET_FIELDS = {
  MAIN_NAME: 'שם ראשי',
  TITLE: 'תואר',
  SECONDARY_NAME: 'שם מישני',
  GROUP: 'קבוצה',
  ADDITIONAL_GROUP: 'קבוצה נוספת',
  TYPE: 'סוג',
  CODE: 'קוד',
  NEIGHBORHOOD: 'שכונה',
  DELETED: 'deleted',
} as const;

// Fields to return in search results
export const SEARCH_RESULT_FIELDS = [
  STREET_FIELDS.MAIN_NAME,
  STREET_FIELDS.TITLE,
  STREET_FIELDS.SECONDARY_NAME,
  STREET_FIELDS.TYPE,
  STREET_FIELDS.CODE,
  STREET_FIELDS.NEIGHBORHOOD,
] as const;

// All searchable fields
export const SEARCHABLE_FIELDS = [
  STREET_FIELDS.MAIN_NAME,
  STREET_FIELDS.TITLE,
  STREET_FIELDS.SECONDARY_NAME,
  STREET_FIELDS.GROUP,
  STREET_FIELDS.ADDITIONAL_GROUP,
  STREET_FIELDS.TYPE,
  STREET_FIELDS.CODE,
  STREET_FIELDS.NEIGHBORHOOD,
] as const;

// Elasticsearch query types
export const ES_QUERY_TYPES = {
  MATCH: 'match',
  MULTI_MATCH: 'multi_match',
  PHRASE: 'phrase',
  BEST_FIELDS: 'best_fields',
  TERM: 'term',
} as const;

// Elasticsearch operators
export const ES_OPERATORS = {
  OR: 'or',
  AND: 'and',
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

// API Routes
export const API_ROUTES = {
  SEARCH: '/search',
  DELETE: '/delete/:id',
  HEALTH: '/health',
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  SEARCH_QUERY_REQUIRED: 'Search query is required',
  SEARCH_QUERY_EMPTY: 'Search query cannot be empty',
  SEARCH_QUERY_TOO_LONG: (maxLength: number) => `Search query cannot exceed ${maxLength} characters`,
  DOCUMENT_ID_REQUIRED: 'Document ID is required',
  DOCUMENT_ID_EMPTY: 'Document ID cannot be empty',
  DOCUMENT_ID_TOO_LONG: (maxLength: number) => `Document ID cannot exceed ${maxLength} characters`,
  DOCUMENT_ID_INVALID_FORMAT: 'Invalid document ID format',
  DOCUMENT_NOT_FOUND: 'Document not found',
  SEARCH_SERVICE_ERROR: 'Search service error',
  INTERNAL_SERVER_ERROR: 'Internal server error',
  FAILED_TO_EXECUTE_SEARCH: 'Failed to execute search',
  FAILED_TO_DELETE_DOCUMENT: 'Failed to delete document',
  DOCUMENT_MARKED_AS_DELETED: 'Document marked as deleted',
} as const;

// Validation Constants
export const VALIDATION = {
  MAX_QUERY_LENGTH: 200,
  MAX_ID_LENGTH: 100,
  MIN_QUERY_LENGTH: 1,
} as const;

// Search Constants
export const SEARCH = {
  DEFAULT_MODE: SearchMode.FREE,
  MAX_RESULTS: 100,
  DEFAULT_RESULTS_SIZE: 100,
} as const;

// Response Messages
export const RESPONSE_MESSAGES = {
  SUCCESS: 'success',
  SERVER_RUNNING: 'Server is running',
  ELASTICSEARCH_CONNECTED: 'connected',
  ELASTICSEARCH_DISCONNECTED: 'disconnected',
  SERVER_UNAVAILABLE: 'Server is running but Elasticsearch is unavailable',
  ROUTE_NOT_FOUND: (method: string, path: string) => `Route ${method} ${path} not found`,
} as const;

