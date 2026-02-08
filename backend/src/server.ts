import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import searchRoutes from './routes/search';
import { esClient } from './config/elasticsearch';
import { API_ROUTES, HTTP_STATUS, RESPONSE_MESSAGES } from './constants';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3001;

// CORS configuration - in production, specify allowed origins
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api', searchRoutes);

/**
 * Health check endpoint
 * GET /health
 */
app.get(API_ROUTES.HEALTH, async (req: Request, res: Response) => {
  try {
    // Check Elasticsearch connection
    await esClient.ping();
    res.json({ 
      status: RESPONSE_MESSAGES.SUCCESS, 
      message: RESPONSE_MESSAGES.SERVER_RUNNING,
      elasticsearch: RESPONSE_MESSAGES.ELASTICSEARCH_CONNECTED,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(HTTP_STATUS.SERVICE_UNAVAILABLE).json({ 
      status: 'error', 
      message: RESPONSE_MESSAGES.SERVER_UNAVAILABLE,
      elasticsearch: RESPONSE_MESSAGES.ELASTICSEARCH_DISCONNECTED,
      timestamp: new Date().toISOString()
    });
  }
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(HTTP_STATUS.NOT_FOUND).json({ 
    error: 'Not found',
    message: RESPONSE_MESSAGES.ROUTE_NOT_FOUND(req.method, req.path)
  });
});

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

