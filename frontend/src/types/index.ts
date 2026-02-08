import { SearchMode as SearchModeEnum } from '../constants';

export type SearchMode = SearchModeEnum;

export interface StreetRecord {
  'שם ראשי': string;
  'תואר': string;
  'שם מישני': string;
  'סוג': string;
  'קוד': string;
  'שכונה': string;
}

export interface SearchResult {
  _id: string;
  _source: StreetRecord;
}

export interface SearchResponse {
  hits: SearchResult[];
  total: number | { value: number };
}

