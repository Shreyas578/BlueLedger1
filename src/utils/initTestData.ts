/**
 * Initialize test data for development
 * This creates sample projects with NDVI data for testing the minting feature
 */

export const initializeTestProjects = () => {
  const testProjects = [
    {
      id: "test-proj-1",
      projectName: "Sundarbans Mangrove Restoration",
      ngoName: "Coastal Conservation Foundation",
      location: "West Bengal, India",
      area: 120,
      status: "active",
      progress: 75,
      carbonCredits: 0,
      ndviBaseline: 0.34,
      ndviCurrent: 0.41,
      ndviGrowth: 20.6,
      lastUpdated: new Date().toISOString(),
      submittedDate: "2024-01-15",
      userId: "ngo-user-1"
    },
    {
      id: "test-proj-2",
      projectName: "Chilika Lake Blue Carbon Initiative",
      ngoName: "Marine Biodiversity Trust",
      location: "Odisha, India",
      area: 85,
      status: "active",
      progress: 60,
      carbonCredits: 0,
      ndviBaseline: 0.28,
      ndviCurrent: 0.35,
      ndviGrowth: 25.0,
      lastUpdated: new Date().toISOString(),
      submittedDate: "2024-02-10",
      userId: "ngo-user-2"
    },
    {
      id: "test-proj-3",
      projectName: "Godavari Delta Restoration",
      ngoName: "Mangrove Mission Society",
      location: "Andhra Pradesh, India",
      area: 200,
      status: "active",
      progress: 45,
      carbonCredits: 0,
      ndviBaseline: 0.30,
      ndviCurrent: 0.34,
      ndviGrowth: 13.3,
      lastUpdated: new Date().toISOString(),
      submittedDate: "2024-03-05",
      userId: "ngo-user-3"
    },
    {
      id: "test-proj-4",
      projectName: "Pulicat Lake Mangrove Expansion",
      ngoName: "Coastal Ecosystem Foundation",
      location: "Tamil Nadu, India",
      area: 95,
      status: "active",
      progress: 30,
      carbonCredits: 0,
      ndviBaseline: 0.32,
      ndviCurrent: 0.35,
      ndviGrowth: 9.4,
      lastUpdated: new Date().toISOString(),
      submittedDate: "2024-04-20",
      userId: "ngo-user-4"
    },
    {
      id: "test-proj-5",
      projectName: "Bhitarkanika Mangrove Conservation",
      ngoName: "Green Coast Initiative",
      location: "Odisha, India",
      area: 150,
      status: "verified",
      progress: 85,
      carbonCredits: 0,
      ndviBaseline: 0.36,
      ndviCurrent: 0.48,
      ndviGrowth: 33.3,
      lastUpdated: new Date().toISOString(),
      submittedDate: "2023-12-01",
      userId: "ngo-user-5"
    }
  ];

  // Save to localStorage
  const existingProjects = JSON.parse(localStorage.getItem("ngo-projects") || "[]");
  
  // Only add test projects if they don't exist
  const projectIds = existingProjects.map((p: any) => p.id);
  const newProjects = testProjects.filter(p => !projectIds.includes(p.id));
  
  if (newProjects.length > 0) {
    const updatedProjects = [...existingProjects, ...newProjects];
    localStorage.setItem("ngo-projects", JSON.stringify(updatedProjects));
    console.log(`✅ Initialized ${newProjects.length} test projects with NDVI data`);
    return newProjects.length;
  }
  
  console.log("ℹ️ Test projects already exist");
  return 0;
};

/**
 * Clear all test data
 */
export const clearTestData = () => {
  localStorage.removeItem("ngo-projects");
  localStorage.removeItem("pending-applications");
  console.log("✅ Test data cleared");
};

/**
 * Update NDVI data for a project (simulate satellite data update)
 */
export const updateProjectNDVI = (projectId: string, newNDVI: number) => {
  const projects = JSON.parse(localStorage.getItem("ngo-projects") || "[]");
  const updatedProjects = projects.map((p: any) => {
    if (p.id === projectId) {
      const baseline = p.ndviBaseline || 0.34;
      const growth = ((newNDVI - baseline) / baseline) * 100;
      return {
        ...p,
        ndviCurrent: newNDVI,
        ndviGrowth: growth,
        lastUpdated: new Date().toISOString()
      };
    }
    return p;
  });
  
  localStorage.setItem("ngo-projects", JSON.stringify(updatedProjects));
  console.log(`✅ Updated NDVI for project ${projectId}: ${newNDVI}`);
};

/**
 * Simulate NDVI growth over time
 */
export const simulateNDVIGrowth = (projectId: string, growthRate: number = 0.01) => {
  const projects = JSON.parse(localStorage.getItem("ngo-projects") || "[]");
  const project = projects.find((p: any) => p.id === projectId);
  
  if (project) {
    const newNDVI = Math.min(0.8, (project.ndviCurrent || 0.34) + growthRate);
    updateProjectNDVI(projectId, newNDVI);
    return newNDVI;
  }
  
  return null;
};

/**
 * Get project statistics
 */
export const getProjectStats = () => {
  const projects = JSON.parse(localStorage.getItem("ngo-projects") || "[]");
  const activeProjects = projects.filter((p: any) => p.status === "active" || p.status === "verified");
  
  const stats = {
    total: projects.length,
    active: activeProjects.length,
    eligibleForMinting: activeProjects.filter((p: any) => (p.ndviGrowth || 0) >= 10).length,
    totalArea: projects.reduce((sum: number, p: any) => sum + (p.area || 0), 0),
    totalCredits: projects.reduce((sum: number, p: any) => sum + (p.carbonCredits || 0), 0),
    averageNDVIGrowth: activeProjects.length > 0 
      ? activeProjects.reduce((sum: number, p: any) => sum + (p.ndviGrowth || 0), 0) / activeProjects.length 
      : 0
  };
  
  return stats;
};

// Export for console access
if (typeof window !== 'undefined') {
  (window as any).testData = {
    init: initializeTestProjects,
    clear: clearTestData,
    updateNDVI: updateProjectNDVI,
    simulate: simulateNDVIGrowth,
    stats: getProjectStats
  };
  
  console.log("🧪 Test data utilities available:");
  console.log("  - testData.init() - Initialize test projects");
  console.log("  - testData.clear() - Clear all data");
  console.log("  - testData.updateNDVI(projectId, ndvi) - Update NDVI");
  console.log("  - testData.simulate(projectId, rate) - Simulate growth");
  console.log("  - testData.stats() - Get statistics");
}
