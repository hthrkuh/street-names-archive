export interface StreetRecord {
  'שם ראשי': string;
  'תואר': string;
  'שם מישני': string;
  'קבוצה': string;
  'קבוצה נוספת': string;
  'סוג': string;
  'קוד': string;
  'שכונה': string;
  deleted?: boolean;
}

export interface SearchResult {
  _id: string;
  _source: {
    'שם ראשי': string;
    'תואר': string;
    'שם מישני': string;
    'סוג': string;
    'קוד': string;
    'שכונה': string;
  };
}

export interface SearchResponse {
  hits: SearchResult[];
  total: number;
}

import { SearchMode as SearchModeEnum } from '../constants';

export type SearchMode = SearchModeEnum;

export interface SearchQueryParams {
  q: string;
  mode?: SearchMode;
}

