/**
 * Frontend application constants
 */

// Search modes
export enum SearchMode {
  FREE = 'free',
  EXACT = 'exact',
  FULL = 'full',
}

// API Endpoints
export const API_ENDPOINTS = {
  SEARCH: '/api/search',
  DELETE: '/api/delete',
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

// Error Codes
export const ERROR_CODES = {
  TIMEOUT: 'ECONNABORTED',
  NETWORK: 'ERR_NETWORK',
} as const;

// Field names (matching backend)
export const STREET_FIELDS = {
  MAIN_NAME: 'שם ראשי',
  TITLE: 'תואר',
  SECONDARY_NAME: 'שם מישני',
  TYPE: 'סוג',
  CODE: 'קוד',
  NEIGHBORHOOD: 'שכונה',
} as const;

// Error Messages (Hebrew)
export const ERROR_MESSAGES = {
  SEARCH_ERROR: 'שגיאה בחיפוש. נסה שוב.',
  SEARCH_QUERY_EMPTY: 'Search query cannot be empty',
  SEARCH_QUERY_TOO_LONG: 'Search query is too long (max 200 characters)',
  DELETE_ERROR: 'שגיאה במחיקה. נסה שוב.',
  DELETE_NOT_FOUND: 'הרשומה לא נמצאה. יתכן שכבר נמחקה.',
  DELETE_INVALID_REQUEST: 'בקשה לא תקינה. אנא נסה שוב.',
  DELETE_SERVER_ERROR: 'שרת לא זמין כרגע. נסה שוב מאוחר יותר.',
  DELETE_NETWORK_ERROR: 'חיבור איטי או לא זמין. נסה שוב.',
  SEARCH_INVALID_REQUEST: 'בקשה לא תקינה. אנא בדוק את החיפוש שלך.',
  SEARCH_SERVER_ERROR: 'שרת לא זמין כרגע. נסה שוב מאוחר יותר.',
  SEARCH_NETWORK_ERROR: 'חיבור איטי או לא זמין. נסה שוב.',
  NO_RESULTS: 'לא נמצאו תוצאות. נסה חיפוש אחר.',
  UNKNOWN_ERROR: 'An unknown error occurred',
  TIMEOUT_ERROR: 'הבקשה ארכה זמן רב מדי. נסה שוב.',
  NETWORK_ERROR: 'בעיית חיבור. בדוק את החיבור לאינטרנט.',
  DOCUMENT_ID_REQUIRED: 'Document ID is required',
} as const;

// Success Messages (Hebrew)
export const SUCCESS_MESSAGES = {
  DELETE_SUCCESS: 'הרשומה נמחקה בהצלחה',
} as const;

// UI Messages (Hebrew)
export const UI_MESSAGES = {
  SEARCHING: 'מחפש תוצאות...',
  DELETING: 'מוחק...',
  DELETE: 'מחק',
  SEARCH: 'חפש',
  DELETE_CONFIRM_TITLE: 'מחיקת רשומה',
  DELETE_CONFIRM_MESSAGE: (name: string) => `האם אתה בטוח שברצונך למחוק את הרשומה "${name}"? פעולה זו לא ניתנת לביטול.`,
  DELETE_CONFIRM_BUTTON: 'מחק',
  DELETE_CANCEL_BUTTON: 'ביטול',
  DEFAULT_RECORD_NAME: 'רשומה זו',
  NO_RESULTS_HINT: 'נסה לשנות את מילת החיפוש או את סוג החיפוש',
} as const;

// Validation Constants
export const VALIDATION = {
  MAX_QUERY_LENGTH: 200,
  MIN_QUERY_LENGTH: 3,
  MIN_QUERY_HINT_THRESHOLD: 3,
} as const;

// Timing Constants
export const TIMING = {
  SUCCESS_MESSAGE_AUTO_DISMISS: 3000, // 3 seconds
  API_TIMEOUT: 10000, // 10 seconds
} as const;

// Search Mode Labels (Hebrew)
export const SEARCH_MODE_LABELS = {
  [SearchMode.FREE]: {
    title: 'חיפוש חופשי',
    description: ' - חיפוש בשדה שם ראשי בלבד',
  },
  [SearchMode.EXACT]: {
    title: 'חיפוש מדויק',
    description: ' - חיפוש לפחות מילה אחת בכל השדות',
  },
  [SearchMode.FULL]: {
    title: 'חיפוש ביטוי מלא',
    description: ' - חיפוש הביטוי המלא בכל השדות',
  },
} as const;

