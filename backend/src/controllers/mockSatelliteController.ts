import { Request, Response } from 'express';
import { mockSatelliteData } from '../data/mockData';
import { createError } from '../middleware/errorHandler';

export const mockSatelliteController = {
  // Get satellite data for coordinates
  getSatelliteData: async (req: Request, res: Response) => {
    try {
      const { coordinates } = req.params;
      
      // Find existing data or generate new
      let satelliteData = mockSatelliteData.find(data => data.coordinates === coordinates);
      
      if (!satelliteData) {
        // Generate new satellite data
        satelliteData = {
          coordinates,
          imageUrl: `https://example.com/satellite/${coordinates.replace(',', '_')}-${Date.now()}.jpg`,
          captureDate: new Date().toISOString(),
          cloudCover: Math.floor(Math.random() * 30), // 0-30% cloud cover
          resolution: '10m',
          ndviCalculated: 0.6 + Math.random() * 0.3 // NDVI between 0.6-0.9
        };
        
        mockSatelliteData.push(satelliteData);
      }

      res.json({
        success: true,
        data: satelliteData
      });
    } catch (error) {
      throw createError('Failed to fetch satellite data', 500);
    }
  },

  // Get satellite image for project
  getSatelliteImage: async (req: Request, res: Response) => {
    try {
      const { projectId } = req.params;
      const { date } = req.query;
      
      // Generate mock satellite image data
      const imageData = {
        projectId,
        imageUrl: `https://example.com/satellite/project-${projectId}-${date || Date.now()}.jpg`,
        thumbnailUrl: `https://example.com/satellite/thumb-${projectId}-${date || Date.now()}.jpg`,
        captureDate: date ? new Date(date as string).toISOString() : new Date().toISOString(),
        metadata: {
          resolution: '10m',
          cloudCover: Math.floor(Math.random() * 20),
          sensor: 'Sentinel-2',
          bands: ['B2', 'B3', 'B4', 'B8'], // Blue, Green, Red, NIR
          ndviCalculated: 0.6 + Math.random() * 0.3,
          quality: Math.random() > 0.2 ? 'excellent' : 'good'
        },
        analysis: {
          vegetationHealth: Math.random() > 0.3 ? 'healthy' : 'moderate',
          changeDetection: Math.random() > 0.5 ? 'positive_growth' : 'stable',
          anomalies: Math.random() > 0.8 ? ['cloud_shadow'] : []
        }
      };

      res.json({
        success: true,
        data: imageData
      });
    } catch (error) {
      throw createError('Failed to fetch satellite image', 500);
    }
  }
};