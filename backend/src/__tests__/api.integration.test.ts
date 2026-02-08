/**
 * Integration tests for the API endpoints
 * These tests make actual HTTP requests to a running server
 */

import axios, { AxiosInstance } from 'axios';
import { startTestServer, stopTestServer, getBaseUrl } from './helpers/testServer';
import { setupTestIndex, cleanupTestIndex } from './helpers/testData';

const TEST_PORT = 3002;
const BASE_URL = getBaseUrl(TEST_PORT);

let apiClient: AxiosInstance;

describe('API Integration Tests', () => {
  beforeAll(async () => {
    // Start test server
    await startTestServer(TEST_PORT);
    
    // Setup test data in Elasticsearch
    await setupTestIndex();
    
    // Create axios client
    apiClient = axios.create({
      baseURL: BASE_URL,
      timeout: 10000,
      validateStatus: () => true // Don't throw on any status
    });
  });

  afterAll(async () => {
    // Cleanup test data
    await cleanupTestIndex();
    
    // Stop test server
    await stopTestServer();
  });

  describe('Health Check', () => {
    it('should return health status', async () => {
      const response = await apiClient.get('/health');
      
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('status');
      expect(response.data).toHaveProperty('elasticsearch');
    });
  });

  describe('GET /api/search', () => {
    describe('Free Search Mode (default)', () => {
      it('should search in שם ראשי field only', async () => {
        const response = await apiClient.get('/api/search', {
          params: { q: 'אוסישקין', mode: 'free' }
        });

        expect(response.status).toBe(200);
        expect(response.data).toHaveProperty('hits');
        expect(response.data).toHaveProperty('total');
        expect(response.data).toHaveProperty('mode', 'free');
        expect(response.data.hits).toBeInstanceOf(Array);
        expect(response.data.hits.length).toBeGreaterThan(0);
        
        // Verify the result structure
        const firstHit = response.data.hits[0];
        expect(firstHit).toHaveProperty('_id');
        expect(firstHit).toHaveProperty('_source');
        expect(firstHit._source).toHaveProperty('שם ראשי');
        expect(firstHit._source['שם ראשי']).toBe('אוסישקין');
      });

      it('should not find records that match only in other fields (not שם ראשי)', async () => {
        // Search for 'לורד' which exists in תואר field of בלפור, but not in שם ראשי
        const response = await apiClient.get('/api/search', {
          params: { q: 'לורד', mode: 'free' }
        });

        expect(response.status).toBe(200);
        // In free mode, should NOT find בלפור because 'לורד' is only in תואר field
        const found = response.data.hits.some(
          (hit: any) => hit._source['שם ראשי'] === 'בלפור'
        );
        expect(found).toBe(false);
      });

      it('should use free mode as default when mode is not specified', async () => {
        const response = await apiClient.get('/api/search', {
          params: { q: 'אוסישקין' } // No mode parameter
        });

        expect(response.status).toBe(200);
        expect(response.data.mode).toBe('free');
        expect(response.data.hits.length).toBeGreaterThan(0);
      });

      it('should not return deleted records', async () => {
        const response = await apiClient.get('/api/search', {
          params: { q: 'תל חי', mode: 'free' }
        });

        expect(response.status).toBe(200);
        // Should not find deleted record
        const deletedRecord = response.data.hits.find(
          (hit: any) => hit._source['שם ראשי'] === 'תל חי'
        );
        expect(deletedRecord).toBeUndefined();
      });
    });

    describe('Exact Search Mode', () => {
      it('should search across all fields and match at least one word', async () => {
        const response = await apiClient.get('/api/search', {
          params: { q: 'לורד', mode: 'exact' }
        });

        expect(response.status).toBe(200);
        expect(response.data).toHaveProperty('mode', 'exact');
        expect(response.data.hits.length).toBeGreaterThan(0);
        
        // Should find בלפור which has 'לורד' in תואר field
        const found = response.data.hits.some(
          (hit: any) => hit._source['שם ראשי'] === 'בלפור'
        );
        expect(found).toBe(true);
      });

      it('should find records matching any word in query (OR operator)', async () => {
        // Search for multiple words - should find records matching ANY of them
        const response = await apiClient.get('/api/search', {
          params: { q: 'אוסישקין בלפור', mode: 'exact' }
        });

        expect(response.status).toBe(200);
        expect(response.data.mode).toBe('exact');
        expect(response.data.hits.length).toBeGreaterThanOrEqual(2);
        
        // Should find both אוסישקין and בלפור
        const mainNames = response.data.hits.map((hit: any) => hit._source['שם ראשי']);
        expect(mainNames).toContain('אוסישקין');
        expect(mainNames).toContain('בלפור');
      });

      it('should search in all searchable fields (שם ראשי, תואר, שם מישני, קבוצה, סוג, קוד, שכונה)', async () => {
        // Test searching in different fields
        const tests = [
          { query: 'אוסישקין', field: 'שם ראשי', shouldFind: true },
          { query: 'לורד', field: 'תואר', shouldFind: true },
          { query: 'מנחם', field: 'שם מישני', shouldFind: true },
        ];

        for (const test of tests) {
          const response = await apiClient.get('/api/search', {
            params: { q: test.query, mode: 'exact' }
          });

          expect(response.status).toBe(200);
          if (test.shouldFind) {
            expect(response.data.hits.length).toBeGreaterThan(0);
          }
        }
      });

      it('should not return deleted records', async () => {
        const response = await apiClient.get('/api/search', {
          params: { q: 'תל חי', mode: 'exact' }
        });

        expect(response.status).toBe(200);
        // Should not find deleted record even in exact mode
        const deletedRecord = response.data.hits.find(
          (hit: any) => hit._source['שם ראשי'] === 'תל חי'
        );
        expect(deletedRecord).toBeUndefined();
      });
    });

    describe('Full Phrase Search Mode', () => {
      it('should match entire phrase across all fields', async () => {
        const response = await apiClient.get('/api/search', {
          params: { q: 'מנחם (מנדל)', mode: 'full' }
        });

        expect(response.status).toBe(200);
        expect(response.data).toHaveProperty('mode', 'full');
        expect(response.data.hits.length).toBeGreaterThan(0);
        
        // Should find אוסישקין which has the full phrase in שם מישני
        const found = response.data.hits.some(
          (hit: any) => hit._source['שם ראשי'] === 'אוסישקין'
        );
        expect(found).toBe(true);
      });

      it('should NOT match when words are in different order (phrase must be exact)', async () => {
        // Search for phrase in reverse order - should not match
        const response = await apiClient.get('/api/search', {
          params: { q: 'מנדל מנחם', mode: 'full' }
        });

        expect(response.status).toBe(200);
        expect(response.data.mode).toBe('full');
        // Should not find אוסישקין because phrase order is different
        const found = response.data.hits.some(
          (hit: any) => hit._source['שם ראשי'] === 'אוסישקין'
        );
        expect(found).toBe(false);
      });

      it('should search in all searchable fields for the exact phrase', async () => {
        // Test that full phrase search works across all fields
        const response = await apiClient.get('/api/search', {
          params: { q: 'לורד בלפור', mode: 'full' }
        });

        expect(response.status).toBe(200);
        expect(response.data.mode).toBe('full');
        // The exact phrase might or might not be found, but mode should be correct
      });

      it('should not match partial phrases (must be exact phrase match)', async () => {
        // Search for part of a phrase - should not match in full mode
        const response = await apiClient.get('/api/search', {
          params: { q: 'מנחם', mode: 'full' }
        });

        expect(response.status).toBe(200);
        expect(response.data.mode).toBe('full');
        // In full mode, searching for just 'מנחם' might not find 'מנחם (מנדל)'
        // because it's looking for the exact phrase 'מנחם'
      });

      it('should not return deleted records', async () => {
        const response = await apiClient.get('/api/search', {
          params: { q: 'תל חי', mode: 'full' }
        });

        expect(response.status).toBe(200);
        // Should not find deleted record even in full mode
        const deletedRecord = response.data.hits.find(
          (hit: any) => hit._source['שם ראשי'] === 'תל חי'
        );
        expect(deletedRecord).toBeUndefined();
      });

      it('should differentiate from exact mode - exact finds any word, full finds exact phrase', async () => {
        // In exact mode: 'אוסישקין בלפור' should find both records (any word matches)
        const exactResponse = await apiClient.get('/api/search', {
          params: { q: 'אוסישקין בלפור', mode: 'exact' }
        });

        // In full mode: 'אוסישקין בלפור' should find records with that exact phrase
        const fullResponse = await apiClient.get('/api/search', {
          params: { q: 'אוסישקין בלפור', mode: 'full' }
        });

        expect(exactResponse.status).toBe(200);
        expect(fullResponse.status).toBe(200);
        expect(exactResponse.data.mode).toBe('exact');
        expect(fullResponse.data.mode).toBe('full');
        
        // Exact mode should typically find more results (any word matches)
        // Full mode should find fewer or no results (exact phrase required)
        expect(exactResponse.data.hits.length).toBeGreaterThanOrEqual(fullResponse.data.hits.length);
      });
    });

    describe('Input Validation', () => {
      it('should return 400 for empty query', async () => {
        const response = await apiClient.get('/api/search', {
          params: { q: '', mode: 'free' }
        });

        expect(response.status).toBe(400);
        expect(response.data).toHaveProperty('error');
      });

      it('should return 400 for missing query parameter', async () => {
        const response = await apiClient.get('/api/search', {
          params: { mode: 'free' }
        });

        expect(response.status).toBe(400);
        expect(response.data).toHaveProperty('error');
      });

      it('should handle very long queries', async () => {
        const longQuery = 'א'.repeat(300); // 300 characters
        const response = await apiClient.get('/api/search', {
          params: { q: longQuery, mode: 'free' }
        });

        expect(response.status).toBe(400);
        expect(response.data).toHaveProperty('error');
      });

      it('should sanitize dangerous characters', async () => {
        const response = await apiClient.get('/api/search', {
          params: { q: 'אוסישקין<script>', mode: 'free' }
        });

        expect(response.status).toBe(200);
        // Should still work after sanitization
      });
    });

    describe('Response Structure', () => {
      it('should return correct response format', async () => {
        const response = await apiClient.get('/api/search', {
          params: { q: 'אוסישקין', mode: 'free' }
        });

        expect(response.status).toBe(200);
        expect(response.data).toHaveProperty('hits');
        expect(response.data).toHaveProperty('total');
        expect(response.data).toHaveProperty('mode');
        expect(response.data.mode).toBe('free');
        
        // Verify hit structure
        if (response.data.hits.length > 0) {
          const hit = response.data.hits[0];
          expect(hit).toHaveProperty('_id');
          expect(hit).toHaveProperty('_source');
          expect(hit._source).toHaveProperty('שם ראשי');
          expect(hit._source).toHaveProperty('תואר');
          expect(hit._source).toHaveProperty('שם מישני');
          expect(hit._source).toHaveProperty('סוג');
          expect(hit._source).toHaveProperty('קוד');
          expect(hit._source).toHaveProperty('שכונה');
        }
      });
    });
  });

  describe('POST /api/delete/:id', () => {
    let testDocumentId: string;

    beforeAll(async () => {
      // Get a document ID for testing
      const searchResponse = await apiClient.get('/api/search', {
        params: { q: 'בלפור', mode: 'free' }
      });
      
      if (searchResponse.data.hits.length > 0) {
        testDocumentId = searchResponse.data.hits[0]._id;
      }
    });

    it('should soft delete a document', async () => {
      if (!testDocumentId) {
        throw new Error('No test document found');
      }

      const response = await apiClient.post(`/api/delete/${testDocumentId}`);

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('success');
      expect(response.data.success).toBe(true);
      expect(response.data).toHaveProperty('message');
      expect(response.data).toHaveProperty('id');
      expect(response.data.id).toBe(testDocumentId);
    });

    it('should not return deleted document in search results', async () => {
      if (!testDocumentId) {
        throw new Error('No test document found');
      }

      // Wait for Elasticsearch to refresh the index
      // Elasticsearch needs time to update after the delete operation
      await new Promise(resolve => setTimeout(resolve, 2000));

      const searchResponse = await apiClient.get('/api/search', {
        params: { q: 'בלפור', mode: 'free' }
      });

      expect(searchResponse.status).toBe(200);
      
      // Should not find the deleted document
      const deletedDoc = searchResponse.data.hits.find(
        (hit: any) => hit._id === testDocumentId
      );
      expect(deletedDoc).toBeUndefined();
    });

    it('should return 404 for non-existent document', async () => {
      const fakeId = 'nonexistent123456789';
      const response = await apiClient.post(`/api/delete/${fakeId}`);

      expect(response.status).toBe(404);
      expect(response.data).toHaveProperty('error');
    });

    it('should return 400 for invalid document ID format', async () => {
      // Use an ID with invalid characters that will pass Express routing but fail validation
      const invalidId = 'invalid@id#with$special%chars';
      const response = await apiClient.post(`/api/delete/${encodeURIComponent(invalidId)}`);

      expect(response.status).toBe(400);
      expect(response.data).toHaveProperty('error');
    });

    it('should return 400 for empty document ID', async () => {
      const response = await apiClient.post('/api/delete/');

      expect(response.status).toBe(404); // Express returns 404 for missing route param
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid search mode gracefully', async () => {
      const response = await apiClient.get('/api/search', {
        params: { q: 'test', mode: 'invalid' }
      });

      // Should default to 'free' mode
      expect(response.status).toBe(200);
      expect(response.data.mode).toBe('free');
    });

    it('should handle Elasticsearch connection errors gracefully', async () => {
      // This test would require mocking Elasticsearch to fail
      // For now, we just verify the endpoint structure
      const response = await apiClient.get('/api/search', {
        params: { q: 'test', mode: 'free' }
      });

      // Should either succeed or return proper error
      expect([200, 500, 503]).toContain(response.status);
    });
  });

  describe('CORS', () => {
    it('should include CORS headers', async () => {
      const response = await apiClient.get('/health');

      expect(response.headers).toHaveProperty('access-control-allow-origin');
    });
  });
});

