import type { SearchMode } from '../types';
import { 
  SearchMode as SearchModeEnum,
  STREET_FIELDS, 
  SEARCHABLE_FIELDS, 
  ES_QUERY_TYPES, 
  ES_OPERATORS 
} from '../constants';

/**
 * Builds an Elasticsearch query based on search mode
 * All queries automatically exclude deleted records (deleted: true)
 * 
 * @param query - The search query string
 * @param mode - The search mode (FREE, EXACT, or FULL)
 * @returns Elasticsearch query object
 */
export function buildSearchQuery(query: string, mode: SearchMode) {
  const deletedFilter = {
    [ES_QUERY_TYPES.TERM]: { [STREET_FIELDS.DELETED]: true }
  };

  switch (mode) {
    case SearchModeEnum.FREE:
      return {
        bool: {
          must: [
            {
              [ES_QUERY_TYPES.MATCH]: {
                [STREET_FIELDS.MAIN_NAME]: query
              }
            }
          ],
          must_not: [deletedFilter]
        }
      };

    case SearchModeEnum.EXACT:
      return {
        bool: {
          must: [
            {
              [ES_QUERY_TYPES.MULTI_MATCH]: {
                query: query,
                fields: SEARCHABLE_FIELDS,
                operator: ES_OPERATORS.OR,
                type: ES_QUERY_TYPES.BEST_FIELDS
              }
            }
          ],
          must_not: [deletedFilter]
        }
      };

    case SearchModeEnum.FULL:
      return {
        bool: {
          must: [
            {
              [ES_QUERY_TYPES.MULTI_MATCH]: {
                query: query,
                fields: SEARCHABLE_FIELDS,
                type: ES_QUERY_TYPES.PHRASE
              }
            }
          ],
          must_not: [deletedFilter]
        }
      };

    default:
      return {
        bool: {
          must: [
            {
              [ES_QUERY_TYPES.MATCH]: {
                [STREET_FIELDS.MAIN_NAME]: query
              }
            }
          ],
          must_not: [deletedFilter]
        }
      };
  }
}

