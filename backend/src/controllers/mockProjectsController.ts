import { Request, Response } from 'express';
import { mockProjects, generateMockNDVIReading, calculateCarbonCredits } from '../data/mockData';
import { createError } from '../middleware/errorHandler';

export const mockProjectsController = {
  // Get all projects
  getAllProjects: async (req: Request, res: Response) => {
    try {
      res.json({
        success: true,
        data: mockProjects,
        total: mockProjects.length
      });
    } catch (error) {
      throw createError('Failed to fetch projects', 500);
    }
  },

  // Get project by ID
  getProjectById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const project = mockProjects.find(p => p.id === id);
      
      if (!project) {
        throw createError('Project not found', 404);
      }
      
      res.json({
        success: true,
        data: project
      });
    } catch (error) {
      throw error;
    }
  },

  // Create new project
  createProject: async (req: Request, res: Response) => {
    try {
      const {
        name,
        location,
        coordinates,
        plantSpecies,
        areaHectares,
        ngoName,
        contractAddress
      } = req.body;

      const newProject = {
        id: `proj-${Date.now()}`,
        name,
        location,
        coordinates,
        plantSpecies,
        areaHectares,
        startDate: new Date().toISOString().split('T')[0],
        ngoName,
        status: 'active' as const,
        totalCarbonCredits: 0,
        contractAddress
      };

      mockProjects.push(newProject);

      res.status(201).json({
        success: true,
        data: newProject,
        message: 'Project created successfully'
      });
    } catch (error) {
      throw createError('Failed to create project', 500);
    }
  },

  // Calculate carbon credits
  calculateCarbonCredits: async (req: Request, res: Response) => {
    try {
      const { ndviValue, areaHectares, plantSpecies } = req.body;

      if (!ndviValue || !areaHectares || !plantSpecies) {
        throw createError('Missing required parameters', 400);
      }

      const credits = calculateCarbonCredits(ndviValue, areaHectares, plantSpecies);
      
      res.json({
        success: true,
        data: {
          ndviValue,
          areaHectares,
          plantSpecies,
          carbonCredits: credits,
          calculatedAt: new Date().toISOString()
        }
      });
    } catch (error) {
      throw error;
    }
  }
};