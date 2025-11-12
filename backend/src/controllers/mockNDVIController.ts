import { Request, Response } from 'express';
import { mockNDVIReadings, generateMockNDVIReading } from '../data/mockData';
import { createError } from '../middleware/errorHandler';

export const mockNDVIController = {
  // Get NDVI data for a project
  getNDVIData: async (req: Request, res: Response) => {
    try {
      const { projectId } = req.params;
      const { limit = 10, offset = 0 } = req.query;
      
      const projectReadings = mockNDVIReadings
        .filter(reading => reading.projectId === projectId)
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(Number(offset), Number(offset) + Number(limit));

      res.json({
        success: true,
        data: projectReadings,
        total: projectReadings.length,
        pagination: {
          limit: Number(limit),
          offset: Number(offset),
          hasMore: projectReadings.length === Number(limit)
        }
      });
    } catch (error) {
      throw createError('Failed to fetch NDVI data', 500);
    }
  },

  // Add new NDVI reading
  addNDVIReading: async (req: Request, res: Response) => {
    try {
      const { projectId } = req.params;
      const { ndviValue, vegetationCoverage, satelliteImageUrl, weatherData } = req.body;

      if (!ndviValue || !vegetationCoverage) {
        throw createError('NDVI value and vegetation coverage are required', 400);
      }

      const newReading = {
        ...generateMockNDVIReading(projectId),
        ndviValue: Number(ndviValue),
        vegetationCoverage: Number(vegetationCoverage),
        satelliteImageUrl: satelliteImageUrl || `https://example.com/satellite/${projectId}-${Date.now()}.jpg`,
        weatherData: weatherData || {
          temperature: 25 + Math.random() * 10,
          rainfall: Math.random() * 100,
          humidity: 60 + Math.random() * 30,
          soilMoisture: 50 + Math.random() * 40
        }
      };

      mockNDVIReadings.push(newReading);

      res.status(201).json({
        success: true,
        data: newReading,
        message: 'NDVI reading added successfully'
      });
    } catch (error) {
      throw error;
    }
  },

  // Get latest NDVI reading
  getLatestNDVI: async (req: Request, res: Response) => {
    try {
      const { projectId } = req.params;
      
      const latestReading = mockNDVIReadings
        .filter(reading => reading.projectId === projectId)
        .sort((a, b) => b.timestamp - a.timestamp)[0];

      if (!latestReading) {
        throw createError('No NDVI readings found for this project', 404);
      }

      res.json({
        success: true,
        data: latestReading
      });
    } catch (error) {
      throw error;
    }
  }
};