# Integration Tests

This directory contains integration tests for the API endpoints. These tests make actual HTTP requests to a running Express server.

## Test Structure

- `setup.ts` - Jest configuration and test environment setup
- `helpers/testServer.ts` - Helper functions to start/stop test server
- `helpers/testData.ts` - Helper functions to setup/cleanup test data in Elasticsearch
- `api.integration.test.ts` - Main integration test suite

## Running Tests

### Prerequisites

1. Elasticsearch must be running (via Docker Compose)
2. The test index will be created automatically and cleaned up after tests

### Run all tests

```bash
npm test
```

### Run tests in watch mode

```bash
npm run test:watch
```

### Run tests with coverage

```bash
npm run test:coverage
```

## Test Coverage

The integration tests cover:

1. **Health Check Endpoint**
   - Server health status
   - Elasticsearch connection status

2. **Search Endpoint (GET /api/search)**
   - Free search mode (default)
   - Exact search mode
   - Full phrase search mode
   - Input validation
   - Response structure
   - Deleted records filtering

3. **Delete Endpoint (POST /api/delete/:id)**
   - Soft delete functionality
   - Deleted records exclusion from search
   - Error handling (404, invalid ID)

4. **Error Handling**
   - Invalid input validation
   - Error response formats
   - CORS headers

## Test Environment

- Test server runs on port **3002** (different from production port 3001)
- Uses separate test index: **street-names-test**
- Test data is automatically created before tests and cleaned up after

## How It Works

1. **Before all tests**: 
   - Starts Express server on test port
   - Creates test Elasticsearch index with sample data

2. **During tests**:
   - Makes actual HTTP requests using axios
   - Verifies responses and data

3. **After all tests**:
   - Cleans up test Elasticsearch index
   - Stops test server

## Adding New Tests

To add new integration tests:

1. Add test cases to `api.integration.test.ts`
2. Use `apiClient` to make HTTP requests
3. Follow the existing test structure and naming conventions

Example:

```typescript
it('should do something', async () => {
  const response = await apiClient.get('/api/endpoint');
  expect(response.status).toBe(200);
  expect(response.data).toHaveProperty('expectedProperty');
});
```

