# Street Names Archive System

A full-stack application for searching and managing street names in Beer Sheva using Elasticsearch and React.

## Project Structure

```
street-names-archive/
├── backend/                    # TypeScript Express API server
│   ├── src/
│   │   ├── __tests__/         # Integration tests
│   │   ├── config/            # Configuration files
│   │   ├── routes/            # API routes
│   │   ├── types/             # TypeScript type definitions
│   │   └── utils/             # Utility functions
│   ├── .env.example           # Environment variables template
│   └── package.json
├── frontend/                   # TypeScript React application
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── services/           # API service layer
│   │   └── types/              # TypeScript type definitions
│   ├── .env.example           # Environment variables template
│   └── package.json
├── scripts/                    # CSV loader script
├── mappings/                   # Elasticsearch mapping configuration
├── docker-compose.yml          # Docker configuration for Elasticsearch
└── README.md                   # This file
```

## Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose
- npm or yarn

## Setup Instructions

### 1. Start Elasticsearch

```bash
docker-compose up -d
```

Wait for Elasticsearch to be ready (usually takes 30-60 seconds).

### 2. Load Data into Elasticsearch

```bash
cd scripts
npm install
npm run load
```

This will:
- Create the `street-names` index with the proper mapping
- Load all records from the CSV file
- Set `deleted: false` for all records

### 3. Start Backend Server

```bash
cd backend
npm install
npm run dev
```

The backend will run on `http://localhost:3001`

### 4. Start Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on `http://localhost:5173` (or another port if 5173 is busy)

### 5. Verify Setup

Check that everything is working:

1. **Backend Health Check:**
   ```bash
   curl http://localhost:3001/health
   ```

2. **Frontend:** Open `http://localhost:5173` in your browser

## Features

### Search Modes

1. **Free Search** (default): Searches only in the "שם ראשי" (Main name) field
2. **Exact Search**: Matches at least one word across all fields
3. **Full Phrase Search**: Matches the entire phrase across all fields

### Soft Delete

- Records are not physically deleted
- The `deleted` field is set to `true`
- Deleted records are automatically excluded from search results

## API Endpoints

### GET /health

Health check endpoint to verify server and Elasticsearch connection status.

**Response:**
```json
{
  "status": "ok",
  "message": "Server is running",
  "elasticsearch": "connected",
  "timestamp": "2026-02-08T..."
}
```

### GET /api/search

Search for street names.

**Query Parameters:**
- `q` (required): Search query
- `mode` (optional): Search mode (`free`, `exact`, `full`). Default: `free`

**Response:**
```json
{
  "hits": [
    {
      "_id": "document_id",
      "_source": {
        "שם ראשי": "...",
        "תואר": "...",
        "שם מישני": "...",
        "סוג": "...",
        "קוד": "...",
        "שכונה": "..."
      }
    }
  ],
  "total": 10,
  "mode": "free"
}
```

**Error Responses:**
- `400 Bad Request`: Invalid or missing query parameter
- `500 Internal Server Error`: Server or Elasticsearch error

### POST /api/delete/:id

Soft delete a record by ID (sets `deleted: true`).

**Path Parameters:**
- `id` (required): Document ID to delete

**Response:**
```json
{
  "success": true,
  "message": "Document marked as deleted",
  "id": "document_id"
}
```

**Error Responses:**
- `400 Bad Request`: Invalid document ID format
- `404 Not Found`: Document not found
- `500 Internal Server Error`: Server or Elasticsearch error

## Environment Variables

### Backend

1. Copy `.env.example` to `.env` in the `backend` directory:
   ```bash
   cd backend
   cp .env.example .env
   ```

2. Update the `.env` file with your configuration:
   ```env
   PORT=3001
   NODE_ENV=development
   ELASTICSEARCH_URL=http://localhost:9200
   INDEX_NAME=street-names
   FRONTEND_URL=http://localhost:5173
   ```

### Frontend

1. Copy `.env.example` to `.env` in the `frontend` directory:
   ```bash
   cd frontend
   cp .env.example .env
   ```

2. Update the `.env` file if your backend runs on a different port:
   ```env
   VITE_API_URL=http://localhost:3001
   ```

**Note:** The `.env` files are already created automatically. You can modify them if needed.

## Testing

### Running Integration Tests

The project includes comprehensive integration tests that make actual HTTP requests to the server.

**Prerequisites:**
- Elasticsearch must be running
- Backend dependencies installed

**Run tests:**
```bash
cd backend
npm test
```

**Run tests in watch mode:**
```bash
npm run test:watch
```

**Run tests with coverage:**
```bash
npm run test:coverage
```

**Test Coverage:**
- Health check endpoint
- Search endpoint (all three modes)
- Delete endpoint
- Input validation
- Error handling
- CORS headers

For more details, see `backend/src/__tests__/README.md`.

## Development

### Backend Scripts

```bash
cd backend

# Development mode (with hot reload)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run tests
npm test
```

### Frontend Scripts

```bash
cd frontend

# Development mode
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Technologies Used

- **Backend**: 
  - Node.js, Express
  - TypeScript
  - Elasticsearch 8.x
  - Jest (testing)
  - Axios (testing)
- **Frontend**: 
  - React 18+
  - TypeScript
  - Vite
  - Axios
- **Database**: Elasticsearch 8.x
- **Containerization**: Docker, Docker Compose
- **Development Tools**: 
  - TypeScript
  - ESLint
  - Jest

## Code Quality

The project follows senior developer best practices:

- ✅ Comprehensive input validation and sanitization
- ✅ Custom error handling with proper HTTP status codes
- ✅ Type-safe codebase with TypeScript
- ✅ Integration tests with HTTP requests
- ✅ Security best practices (CORS, input validation)
- ✅ Clean code organization and separation of concerns
- ✅ JSDoc documentation
- ✅ Environment-based configuration

See `CODE_REVIEW.md` for detailed information about best practices implementation.

## Troubleshooting

### Elasticsearch Connection Issues

If you get connection errors:
1. Verify Elasticsearch is running: `docker ps`
2. Check Elasticsearch health: `curl http://localhost:9200`
3. Verify environment variables in `backend/.env`

### Port Already in Use

If ports 3001 or 5173 are already in use:
1. Update `PORT` in `backend/.env`
2. Update `VITE_API_URL` in `frontend/.env` to match
3. Update `FRONTEND_URL` in `backend/.env` to match frontend port

### Test Failures

If tests fail:
1. Ensure Elasticsearch is running
2. Check that test index can be created
3. Verify environment variables are set correctly

## License

This project is created for educational purposes.

