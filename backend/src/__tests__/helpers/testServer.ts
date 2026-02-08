/**
 * Test server helper - starts and stops the Express server for testing
 */
import express, { Express } from 'express';
import { Server } from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import searchRoutes from '../../routes/search';
import { esClient } from '../../config/elasticsearch';

dotenv.config();

let server: Server | null = null;

/**
 * Start test server
 * @param port - Port to run server on (default: 3002)
 * @returns Promise that resolves when server is ready
 */
export async function startTestServer(port: number = 3002): Promise<void> {
  return new Promise((resolve, reject) => {
    const app = express();

    // Middleware
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Routes
    app.use('/api', searchRoutes);

    // Health check
    app.get('/health', async (req, res) => {
      try {
        await esClient.ping();
        res.json({ status: 'ok', elasticsearch: 'connected' });
      } catch (error) {
        res.status(503).json({ status: 'error', elasticsearch: 'disconnected' });
      }
    });

    // Start server
    server = app.listen(port, () => {
      console.log(`Test server started on port ${port}`);
      resolve();
    });

    server.on('error', (error: Error) => {
      reject(error);
    });
  });
}

/**
 * Stop test server
 * @returns Promise that resolves when server is stopped
 */
export async function stopTestServer(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (server) {
      server.close((err) => {
        if (err) {
          reject(err);
        } else {
          console.log('Test server stopped');
          server = null;
          resolve();
        }
      });
    } else {
      resolve();
    }
  });
}

/**
 * Get base URL for test requests
 * @param port - Server port (default: 3002)
 * @returns Base URL string
 */
export function getBaseUrl(port: number = 3002): string {
  return `http://localhost:${port}`;
}

