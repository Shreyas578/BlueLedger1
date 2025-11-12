import { Router } from 'express';
import { mockProjectsController } from '../controllers/mockProjectsController';
import { mockNDVIController } from '../controllers/mockNDVIController';
import { mockSatelliteController } from '../controllers/mockSatelliteController';

const router = Router();

// Project routes
router.get('/projects', mockProjectsController.getAllProjects);
router.get('/projects/:id', mockProjectsController.getProjectById);
router.post('/projects', mockProjectsController.createProject);

// NDVI routes
router.get('/ndvi/:projectId', mockNDVIController.getNDVIData);
router.post('/ndvi/:projectId', mockNDVIController.addNDVIReading);
router.get('/ndvi/:projectId/latest', mockNDVIController.getLatestNDVI);

// Satellite routes
router.get('/satellite/:coordinates', mockSatelliteController.getSatelliteData);
router.get('/satellite/image/:projectId', mockSatelliteController.getSatelliteImage);

// Carbon credit calculation
router.post('/calculate-credits', mockProjectsController.calculateCarbonCredits);

// Health check for mock services
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'Mock API',
    endpoints: [
      'GET /projects',
      'GET /projects/:id',
      'GET /ndvi/:projectId',
      'POST /ndvi/:projectId',
      'GET /satellite/:coordinates'
    ]
  });
});

export { router as mockRoutes };