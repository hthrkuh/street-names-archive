import { Client } from '@elastic/elasticsearch';
import dotenv from 'dotenv';

dotenv.config();

const ELASTICSEARCH_URL = process.env.ELASTICSEARCH_URL || 'http://localhost:9200';
// Use test index when running tests
const INDEX_NAME = process.env.NODE_ENV === 'test' 
  ? (process.env.INDEX_NAME || 'street-names-test')
  : (process.env.INDEX_NAME || 'street-names');

export const esClient = new Client({ node: ELASTICSEARCH_URL });
export const indexName = INDEX_NAME;

