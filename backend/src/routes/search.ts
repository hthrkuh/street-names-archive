import { Router, Request, Response, NextFunction } from 'express';
import { esClient, indexName } from '../config/elasticsearch';
import { buildSearchQuery } from '../utils/searchHelpers';
import { validateSearchQuery, validateDocumentId, validateSearchMode } from '../utils/validation';
import { ValidationError, NotFoundError, ElasticsearchError } from '../utils/errors';
import { SearchQueryParams } from '../types';
import { 
  API_ROUTES, 
  SEARCH_RESULT_FIELDS, 
  SEARCH,
  HTTP_STATUS,
  ERROR_MESSAGES,
  STREET_FIELDS
} from '../constants';

const router = Router();

/**
 * Error handler middleware for routes
 */
const handleError = (error: Error, res: Response) => {
  if (error instanceof ValidationError) {
    return res.status(error.statusCode).json({ 
      error: error.message 
    });
  }
  
  if (error instanceof NotFoundError) {
    return res.status(error.statusCode).json({ 
      error: error.message 
    });
  }
  
  if (error instanceof ElasticsearchError) {
    console.error('Elasticsearch error:', error.originalError || error);
    return res.status(error.statusCode).json({ 
      error: ERROR_MESSAGES.SEARCH_SERVICE_ERROR,
      message: error.message 
    });
  }
  
  console.error('Unexpected error:', error);
  return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ 
    error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR
  });
};

/**
 * GET /api/search
 * Search for street names with different search modes
 * 
 * Query parameters:
 * - q (required): Search query string
 * - mode (optional): Search mode - 'free', 'exact', or 'full' (default: 'free')
 */
router.get(API_ROUTES.SEARCH, async (req: Request<{}, {}, {}, SearchQueryParams>, res: Response, next: NextFunction) => {
  try {
    // Validate and sanitize input
    const query = validateSearchQuery(req.query.q);
    const mode = validateSearchMode(req.query.mode);
    
    // Build Elasticsearch query
    const searchQuery = buildSearchQuery(query, mode);

    // Execute search
    const response = await esClient.search({
      index: indexName,
      body: {
        query: searchQuery as any,
        _source: [...SEARCH_RESULT_FIELDS], // Convert readonly array to mutable
        size: SEARCH.MAX_RESULTS
      }
    });

    // Transform results
    const results = response.hits.hits.map((hit: any) => ({
      _id: hit._id,
      _source: hit._source
    }));

    // Handle total count (can be number or object)
    const total = typeof response.hits.total === 'number' 
      ? response.hits.total 
      : response.hits.total?.value || 0;

    res.json({
      hits: results,
      total,
      mode
    });
  } catch (error: any) {
    if (error instanceof ValidationError) {
      return handleError(error, res);
    }
    
    // Handle Elasticsearch errors
    if (error.meta?.statusCode) {
      return handleError(
        new ElasticsearchError(ERROR_MESSAGES.FAILED_TO_EXECUTE_SEARCH, error), 
        res
      );
    }
    
    return handleError(error, res);
  }
});

/**
 * POST /api/delete/:id
 * Soft delete a street name record by setting deleted flag to true
 * 
 * Path parameters:
 * - id (required): Document ID to delete
 */
router.post(API_ROUTES.DELETE, async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate document ID
    const id = validateDocumentId(req.params.id);

    // Update document to mark as deleted
    await esClient.update({
      index: indexName,
      id: id,
      refresh: true, // Force immediate refresh so deleted records are excluded right away
      body: {
        doc: {
          [STREET_FIELDS.DELETED]: true
        }
      }
    });

    res.json({ 
      success: true, 
      message: ERROR_MESSAGES.DOCUMENT_MARKED_AS_DELETED,
      id 
    });
  } catch (error: any) {
    // Handle Elasticsearch 404
    if (error.meta?.statusCode === HTTP_STATUS.NOT_FOUND) {
      return handleError(
        new NotFoundError(ERROR_MESSAGES.DOCUMENT_NOT_FOUND), 
        res
      );
    }
    
    if (error instanceof ValidationError) {
      return handleError(error, res);
    }
    
    return handleError(
      new ElasticsearchError(ERROR_MESSAGES.FAILED_TO_DELETE_DOCUMENT, error), 
      res
    );
  }
});

export default router;

