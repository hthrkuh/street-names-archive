/**
 * Jest setup file for integration tests
 * This file runs before all tests
 */

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.PORT = '3002'; // Use different port for tests
process.env.ELASTICSEARCH_URL = process.env.ELASTICSEARCH_URL || 'http://localhost:9200';
process.env.INDEX_NAME = 'street-names-test'; // Use test index

// Increase timeout for integration tests
jest.setTimeout(30000);

