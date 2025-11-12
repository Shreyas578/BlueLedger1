import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
// import { mockRoutes } from './routes/mockRoutes';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes - Simple mock endpoint for now
app.get('/api/mock', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Mock API is working',
    endpoints: [
      'GET /api/mock/projects',
      'GET /api/mock/ndvi/:projectId',
      'GET /api/mock/satellite/:coordinates'
    ]
  });
});

app.get('/api/mock/projects', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        id: 'proj-001',
        name: 'Sundarbans Mangrove Restoration',
        location: 'West Bengal, India',
        areaHectares: 250,
        status: 'active',
        totalCarbonCredits: 1250
      }
    ]
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Blue Reef Backend'
  });
});

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Blue Reef Backend running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🧪 Mock API: http://localhost:${PORT}/api/mock`);
});

export default app;