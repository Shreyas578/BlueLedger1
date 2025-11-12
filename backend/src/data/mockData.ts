import { v4 as uuidv4 } from 'uuid';

export interface MockProject {
  id: string;
  name: string;
  location: string;
  coordinates: string;
  plantSpecies: string;
  areaHectares: number;
  startDate: string;
  ngoName: string;
  status: 'active' | 'completed' | 'pending' | 'monitoring';
  totalCarbonCredits: number;
  contractAddress?: string;
  applicationId?: number;
}

export interface MockNDVIReading {
  id: string;
  projectId: string;
  timestamp: number;
  ndviValue: number;
  vegetationCoverage: number;
  satelliteImageUrl: string;
  weatherData: {
    temperature: number;
    rainfall: number;
    humidity: number;
    soilMoisture: number;
  };
  carbonCreditsEarned: number;
}

export interface MockSatelliteData {
  coordinates: string;
  imageUrl: string;
  captureDate: string;
  cloudCover: number;
  resolution: string;
  ndviCalculated: number;
}

// Mock Projects Data
export const mockProjects: MockProject[] = [
  {
    id: 'proj-001',
    name: 'Sundarbans Mangrove Restoration',
    location: 'West Bengal, India',
    coordinates: '{"type":"Polygon","coordinates":[[[88.0428,21.9497],[88.1428,21.9497],[88.1428,22.0497],[88.0428,22.0497],[88.0428,21.9497]]]}',
    plantSpecies: 'Sundari, Gewa, Keora',
    areaHectares: 250,
    startDate: '2024-01-15',
    ngoName: 'Mangrove Conservation Society',
    status: 'active',
    totalCarbonCredits: 1250,
    contractAddress: '0x1234567890123456789012345678901234567890'
  },
  {
    id: 'proj-002', 
    name: 'Kerala Backwater Blue Carbon Project',
    location: 'Kerala, India',
    coordinates: '{"type":"Polygon","coordinates":[[[76.2673,9.9312],[76.3673,9.9312],[76.3673,10.0312],[76.2673,10.0312],[76.2673,9.9312]]]}',
    plantSpecies: 'Rhizophora, Avicennia',
    areaHectares: 180,
    startDate: '2024-02-01',
    ngoName: 'Kerala Marine Foundation',
    status: 'monitoring',
    totalCarbonCredits: 890,
    contractAddress: '0x2345678901234567890123456789012345678901'
  },
  {
    id: 'proj-003',
    name: 'Odisha Coastal Restoration',
    location: 'Odisha, India', 
    coordinates: '{"type":"Polygon","coordinates":[[[85.0985,20.2961],[85.1985,20.2961],[85.1985,20.3961],[85.0985,20.3961],[85.0985,20.2961]]]}',
    plantSpecies: 'Mangrove Mixed Species',
    areaHectares: 320,
    startDate: '2023-11-10',
    ngoName: 'Coastal Conservation Trust',
    status: 'completed',
    totalCarbonCredits: 2100,
    contractAddress: '0x3456789012345678901234567890123456789012'
  },
  {
    id: 'proj-004',
    name: 'Gujarat Salt Marsh Restoration',
    location: 'Gujarat, India',
    coordinates: '{"type":"Polygon","coordinates":[[[68.7717,23.0225],[68.8717,23.0225],[68.8717,23.1225],[68.7717,23.1225],[68.7717,23.0225]]]}',
    plantSpecies: 'Salicornia, Suaeda',
    areaHectares: 150,
    startDate: '2024-03-20',
    ngoName: 'Gujarat Wetland Society',
    status: 'pending',
    totalCarbonCredits: 0
  }
];

// Mock NDVI Readings
export const mockNDVIReadings: MockNDVIReading[] = [
  {
    id: 'ndvi-001',
    projectId: 'proj-001',
    timestamp: Date.now() - 86400000 * 30, // 30 days ago
    ndviValue: 0.65,
    vegetationCoverage: 72,
    satelliteImageUrl: 'https://example.com/satellite/proj-001-30days.jpg',
    weatherData: {
      temperature: 28.5,
      rainfall: 45.2,
      humidity: 78,
      soilMoisture: 65
    },
    carbonCreditsEarned: 125
  },
  {
    id: 'ndvi-002',
    projectId: 'proj-001',
    timestamp: Date.now() - 86400000 * 15, // 15 days ago
    ndviValue: 0.72,
    vegetationCoverage: 78,
    satelliteImageUrl: 'https://example.com/satellite/proj-001-15days.jpg',
    weatherData: {
      temperature: 29.1,
      rainfall: 38.7,
      humidity: 75,
      soilMoisture: 68
    },
    carbonCreditsEarned: 145
  },
  {
    id: 'ndvi-003',
    projectId: 'proj-001',
    timestamp: Date.now() - 86400000 * 7, // 7 days ago
    ndviValue: 0.78,
    vegetationCoverage: 82,
    satelliteImageUrl: 'https://example.com/satellite/proj-001-7days.jpg',
    weatherData: {
      temperature: 27.8,
      rainfall: 52.1,
      humidity: 80,
      soilMoisture: 71
    },
    carbonCreditsEarned: 165
  },
  {
    id: 'ndvi-004',
    projectId: 'proj-002',
    timestamp: Date.now() - 86400000 * 20,
    ndviValue: 0.68,
    vegetationCoverage: 75,
    satelliteImageUrl: 'https://example.com/satellite/proj-002-20days.jpg',
    weatherData: {
      temperature: 30.2,
      rainfall: 42.3,
      humidity: 82,
      soilMoisture: 63
    },
    carbonCreditsEarned: 135
  }
];

// Mock Satellite Data
export const mockSatelliteData: MockSatelliteData[] = [
  {
    coordinates: '88.0928,21.9997',
    imageUrl: 'https://example.com/satellite/sundarbans-latest.jpg',
    captureDate: new Date().toISOString(),
    cloudCover: 15,
    resolution: '10m',
    ndviCalculated: 0.78
  },
  {
    coordinates: '76.3173,9.9812',
    imageUrl: 'https://example.com/satellite/kerala-latest.jpg', 
    captureDate: new Date().toISOString(),
    cloudCover: 25,
    resolution: '10m',
    ndviCalculated: 0.72
  }
];

// Helper functions for data generation
export const generateMockNDVIReading = (projectId: string): MockNDVIReading => {
  const baseNDVI = 0.6 + Math.random() * 0.3; // NDVI between 0.6-0.9
  const coverage = Math.floor(baseNDVI * 100 + Math.random() * 10);
  
  return {
    id: uuidv4(),
    projectId,
    timestamp: Date.now(),
    ndviValue: Math.round(baseNDVI * 100) / 100,
    vegetationCoverage: coverage,
    satelliteImageUrl: `https://example.com/satellite/${projectId}-${Date.now()}.jpg`,
    weatherData: {
      temperature: 25 + Math.random() * 10, // 25-35°C
      rainfall: Math.random() * 100, // 0-100mm
      humidity: 60 + Math.random() * 30, // 60-90%
      soilMoisture: 50 + Math.random() * 40 // 50-90%
    },
    carbonCreditsEarned: Math.floor(baseNDVI * 200) // Credits based on NDVI
  };
};

export const calculateCarbonCredits = (
  ndviValue: number, 
  areaHectares: number, 
  plantSpecies: string
): number => {
  // Base calculation: NDVI * area * species multiplier
  const speciesMultiplier = getSpeciesMultiplier(plantSpecies);
  const baseCredits = ndviValue * areaHectares * speciesMultiplier;
  
  // Add some randomness for realism
  const variation = 0.9 + Math.random() * 0.2; // ±10% variation
  
  return Math.floor(baseCredits * variation);
};

const getSpeciesMultiplier = (species: string): number => {
  const multipliers: { [key: string]: number } = {
    'Sundari': 1.2,
    'Gewa': 1.1,
    'Keora': 1.0,
    'Rhizophora': 1.3,
    'Avicennia': 1.15,
    'Mangrove Mixed Species': 1.1,
    'Salicornia': 0.8,
    'Suaeda': 0.7
  };
  
  // Check if species contains any known species
  for (const [key, value] of Object.entries(multipliers)) {
    if (species.includes(key)) {
      return value;
    }
  }
  
  return 1.0; // Default multiplier
};