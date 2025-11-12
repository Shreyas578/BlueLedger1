import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, MapPin, TrendingUp, Leaf, Coins, Calendar, Activity } from "lucide-react";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MintCreditsButton } from "@/components/MintCreditsButton";
import { useWeb3 } from "@/hooks/useWeb3";

// Fix Leaflet default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface Project {
  id: string;
  projectName: string;
  ngoName: string;
  location: string;
  area: number;
  status: string;
  progress: number;
  carbonCredits: number;
  ndviBaseline: number;
  ndviCurrent: number;
  ndviGrowth: number;
  lastUpdated: string;
  coordinates?: { lat: number; lng: number };
}

const ProjectDetails = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const { isConnected, account, isCorrectNetwork } = useWeb3();

  // Generate realistic NDVI data with non-linear, organic growth
  const generateNDVIHistory = (baseline: number, current: number) => {
    const months = 12;
    const data = [];
    const totalGrowth = current - baseline;
    
    // Seed for consistent randomness per project
    const seed = project?.id ? parseInt(project.id.slice(-4), 16) : 1000;
    
    for (let i = 0; i <= months; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() - (months - i));
      
      // Organic growth: slow start, variable middle with plateaus, gradual increase
      const progress = i / months;
      
      // Combine multiple growth patterns for realism
      const logisticGrowth = 1 / (1 + Math.exp(-8 * (progress - 0.5))); // S-curve
      const seasonalVariation = Math.sin(progress * Math.PI * 2) * 0.08; // Seasonal ups/downs
      const randomWalk = Math.sin((seed + i) * 0.5) * 0.05; // Pseudo-random variation
      
      // Growth plateaus at certain stages (simulating establishment periods)
      let plateauFactor = 1;
      if (progress > 0.3 && progress < 0.4) plateauFactor = 0.7; // Early plateau
      if (progress > 0.6 && progress < 0.7) plateauFactor = 0.85; // Mid plateau
      
      const combinedGrowth = logisticGrowth * plateauFactor + seasonalVariation + randomWalk;
      const ndviValue = baseline + (totalGrowth * Math.max(0, Math.min(1, combinedGrowth)));
      
      data.push({
        month: date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        ndvi: parseFloat(Math.max(baseline, Math.min(current + 0.02, ndviValue)).toFixed(3)),
        target: 0.45
      });
    }
    return data;
  };

  // Generate multiple NDVI comparison lines for historical analysis
  const generateNDVIComparison = (baseline: number, current: number) => {
    const months = 12;
    const data = [];
    const seed = project?.id ? parseInt(project.id.slice(-4), 16) : 1000;
    
    for (let i = 0; i <= months; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() - (months - i));
      const progress = i / months;
      
      // Current Year NDVI (main line)
      const logisticGrowth = 1 / (1 + Math.exp(-8 * (progress - 0.5)));
      const seasonalVariation = Math.sin(progress * Math.PI * 2) * 0.08;
      const randomWalk = Math.sin((seed + i) * 0.5) * 0.05;
      let plateauFactor = 1;
      if (progress > 0.3 && progress < 0.4) plateauFactor = 0.7;
      if (progress > 0.6 && progress < 0.7) plateauFactor = 0.85;
      const combinedGrowth = logisticGrowth * plateauFactor + seasonalVariation + randomWalk;
      const currentNDVI = baseline + ((current - baseline) * Math.max(0, Math.min(1, combinedGrowth)));
      
      // Previous Year NDVI (comparison line 1) - slower growth
      const prevYearGrowth = logisticGrowth * 0.7 + seasonalVariation * 0.8 + Math.sin((seed + i + 100) * 0.4) * 0.04;
      const prevYearNDVI = baseline + ((current - baseline) * 0.6 * Math.max(0, Math.min(1, prevYearGrowth)));
      
      // Baseline/Expected NDVI (comparison line 2) - steady growth
      const expectedGrowth = progress * 0.8 + seasonalVariation * 0.5;
      const expectedNDVI = baseline + ((current - baseline) * 0.8 * Math.max(0, Math.min(1, expectedGrowth)));
      
      data.push({
        month: date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        currentYear: parseFloat(Math.max(baseline, Math.min(current + 0.02, currentNDVI)).toFixed(3)),
        previousYear: parseFloat(Math.max(baseline - 0.05, Math.min(current - 0.1, prevYearNDVI)).toFixed(3)),
        expected: parseFloat(Math.max(baseline, Math.min(current - 0.05, expectedNDVI)).toFixed(3)),
        target: 0.45
      });
    }
    return data;
  };

  // Generate realistic carbon credits history with stepped, non-linear growth
  const generateCreditsHistory = (totalCredits: number) => {
    const months = 6;
    const data = [];
    
    // Credits are minted in irregular batches based on verification milestones
    // Not linear - reflects real-world verification and minting events
    const mintingEvents = [0, 0, 0.12, 0.18, 0.42, 0.65, 1.0]; // Cumulative percentages
    
    for (let i = 0; i <= months; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() - (months - i));
      
      const cumulativeCredits = Math.round(totalCredits * mintingEvents[i]);
      const minted = Math.round(cumulativeCredits * 0.88);
      const pending = cumulativeCredits - minted;
      
      data.push({
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        credits: cumulativeCredits,
        minted: minted,
        pending: pending
      });
    }
    return data;
  };

  // Generate realistic monthly growth with seasonal variations and irregularities
  const generateMonthlyGrowth = (area: number, growth: number) => {
    // Growth varies by season - faster in monsoon, slower in dry season
    // Not uniform - reflects real ecological patterns
    const seasonalFactors = [0.5, 0.7, 1.3, 1.6, 1.2, 0.9]; // Seasonal multipliers with variation
    const baseGrowthRate = growth / 6;
    
    return seasonalFactors.map((factor, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (5 - i));
      const monthGrowth = baseGrowthRate * factor;
      const areaGrowth = (area * monthGrowth) / 100;
      
      return {
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        growth: parseFloat(monthGrowth.toFixed(1)),
        area: Math.round(areaGrowth)
      };
    });
  };

  const [creditsPulse, setCreditsPulse] = useState(false);

  useEffect(() => {
    loadProjectData();

    // Listen for live credit updates
    const handleCreditsUpdate = (event: any) => {
      if (event.detail.projectId === projectId) {
        console.log('Credits updated, refreshing data...');
        // Trigger pulse animation
        setCreditsPulse(true);
        setTimeout(() => {
          loadProjectData();
          setTimeout(() => setCreditsPulse(false), 2000); // Reset after animation
        }, 500); // Small delay for storage update
      }
    };

    window.addEventListener('creditsUpdated', handleCreditsUpdate);
    
    return () => {
      window.removeEventListener('creditsUpdated', handleCreditsUpdate);
    };
  }, [projectId]);

  const loadProjectData = () => {
    const allProjects = JSON.parse(localStorage.getItem("ngo-projects") || "[]");
    const foundProject = allProjects.find((p: any) => p.id === projectId);
    
    if (foundProject) {
      // Add coordinates based on location
      const coordinates = getCoordinatesForLocation(foundProject.location);
      
      // Map the project data to match the expected interface
      const mappedProject = {
        id: foundProject.id,
        projectName: foundProject.projectName || foundProject.name || "Unknown Project",
        ngoName: foundProject.ngoName || "Unknown NGO",
        location: foundProject.location || "Unknown Location",
        area: foundProject.area || 100,
        status: foundProject.status || "active",
        progress: foundProject.progress || 50,
        carbonCredits: foundProject.carbonCredits || 0,
        ndviBaseline: foundProject.ndviBaseline || 0.34,
        ndviCurrent: foundProject.ndviCurrent || 0.41,
        ndviGrowth: foundProject.ndviGrowth || 20.6,
        lastUpdated: foundProject.lastUpdated || new Date().toISOString(),
        coordinates
      };
      
      console.log('Project data loaded:', mappedProject);
      setProject(mappedProject);
    } else {
      console.log('Project not found, using fallback data');
      // Fallback project data if not found
      const fallbackProject = {
        id: projectId || '1',
        projectName: 'Sample Mangrove Project',
        ngoName: 'Conservation Foundation',
        location: 'West Bengal, India',
        area: 120,
        status: 'active',
        progress: 75,
        carbonCredits: 372,
        ndviBaseline: 0.34,
        ndviCurrent: 0.41,
        ndviGrowth: 20.6,
        lastUpdated: new Date().toISOString(),
        coordinates: { lat: 22.5726, lng: 88.3639 }
      };
      setProject(fallbackProject);
    }
  };

  const getCoordinatesForLocation = (location: string): { lat: number; lng: number } => {
    const locationMap: { [key: string]: { lat: number; lng: number } } = {
      "West Bengal": { lat: 22.5726, lng: 88.3639 },
      "Odisha": { lat: 20.9517, lng: 85.0985 },
      "Andhra Pradesh": { lat: 15.9129, lng: 79.7400 },
      "Tamil Nadu": { lat: 11.1271, lng: 78.6569 },
      "Gujarat": { lat: 22.2587, lng: 71.1924 }
    };

    for (const [key, coords] of Object.entries(locationMap)) {
      if (location.includes(key)) {
        return coords;
      }
    }
    return { lat: 20.5937, lng: 78.9629 }; // Default India center
  };

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Project not found</h2>
          <Button onClick={() => navigate("/government-dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const ndviHistory = generateNDVIHistory(project.ndviBaseline, project.ndviCurrent);
  const ndviComparison = generateNDVIComparison(project.ndviBaseline, project.ndviCurrent);
  const creditsHistory = generateCreditsHistory(project.carbonCredits || 0);
  const monthlyGrowth = generateMonthlyGrowth(project.area, project.ndviGrowth);

  // Debug logging
  console.log('NDVI History Data:', ndviHistory);
  console.log('Project NDVI values:', { baseline: project.ndviBaseline, current: project.ndviCurrent });

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/government-dashboard")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-heading font-bold mb-2">{project.projectName}</h1>
              <div className="flex items-center gap-4 text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {project.location}
                </span>
                <span>•</span>
                <span>{project.area} hectares</span>
                <span>•</span>
                <Badge className="bg-success text-success-foreground">{project.status}</Badge>
              </div>
            </div>
            
            <MintCreditsButton 
              project={project}
              onSuccess={loadProjectData}
            />
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-6 mb-6">
          <Card className="bg-gradient-card border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">NDVI Growth</CardTitle>
                <TrendingUp className="w-4 h-4 text-success" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{project.ndviGrowth.toFixed(1)}%</div>
              <div className="text-xs text-muted-foreground">From {project.ndviBaseline.toFixed(2)} to {project.ndviCurrent.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card className={`bg-gradient-card border-border/50 transition-all duration-500 ${creditsPulse ? 'ring-2 ring-accent shadow-lg shadow-accent/50 scale-105' : ''}`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Carbon Credits</CardTitle>
                <Coins className={`w-4 h-4 text-accent ${creditsPulse ? 'animate-bounce' : ''}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold text-accent transition-all duration-500 ${creditsPulse ? 'scale-110' : ''}`}>
                {project.carbonCredits} BCC
              </div>
              <div className="text-xs text-muted-foreground">Total minted</div>
              {creditsPulse && (
                <div className="text-xs text-success font-semibold mt-1 animate-pulse">
                  ✓ Credits Updated!
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Vegetation Health</CardTitle>
                <Leaf className="w-4 h-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{project.ndviCurrent.toFixed(2)}</div>
              <div className="text-xs text-muted-foreground">Current NDVI</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Project Progress</CardTitle>
                <Activity className="w-4 h-4 text-highlight" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-highlight">{project.progress}%</div>
              <div className="text-xs text-muted-foreground">Completion</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="ndvi">NDVI Trends</TabsTrigger>
            <TabsTrigger value="credits">Carbon Credits</TabsTrigger>
            <TabsTrigger value="location">Location</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-gradient-card border-border/50">
                <CardHeader>
                  <CardTitle>NDVI Growth Trend</CardTitle>
                  <CardDescription>12-month vegetation index progression</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={ndviHistory} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                      <defs>
                        <linearGradient id="colorNdviOverview" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0.2}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                      <XAxis dataKey="month" stroke="#888" />
                      <YAxis stroke="#888" domain={[0.25, 0.5]} />
                      <Tooltip />
                      <Legend />
                      <Area 
                        type="monotone" 
                        dataKey="ndvi" 
                        stroke="#10b981" 
                        strokeWidth={2}
                        fill="url(#colorNdviOverview)"
                        name="Actual NDVI"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="target" 
                        stroke="#f59e0b" 
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        name="Target NDVI"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card border-border/50">
                <CardHeader>
                  <CardTitle>Monthly Growth Rate</CardTitle>
                  <CardDescription>Vegetation coverage expansion</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={monthlyGrowth} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.3} />
                      <XAxis 
                        dataKey="month" 
                        stroke="#888"
                        style={{ fontSize: '12px' }}
                        tick={{ fill: '#888' }}
                      />
                      <YAxis 
                        stroke="#888"
                        style={{ fontSize: '12px' }}
                        tick={{ fill: '#888' }}
                        label={{ value: 'Growth Rate (%)', angle: -90, position: 'insideLeft', fill: '#888' }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1a1a1a', 
                          border: '1px solid #3b82f6',
                          borderRadius: '8px',
                          padding: '10px'
                        }}
                        labelStyle={{ color: '#fff', fontWeight: 'bold' }}
                        formatter={(value: any, name: string) => {
                          if (name === 'Growth %') return [`${value}%`, 'Growth Rate'];
                          if (name === 'Area (ha)') return [`${value} ha`, 'Area Expanded'];
                          return [value, name];
                        }}
                      />
                      <Legend 
                        wrapperStyle={{ paddingTop: '10px' }}
                      />
                      <Bar 
                        dataKey="growth" 
                        fill="#3b82f6" 
                        name="Growth %"
                        radius={[8, 8, 0, 0]}
                      />
                      <Bar 
                        dataKey="area" 
                        fill="#8b5cf6" 
                        name="Area (ha)"
                        radius={[8, 8, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Project Info */}
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle>Project Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Organization</label>
                    <p className="text-lg font-semibold mt-1">{project.ngoName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Total Area</label>
                    <p className="text-lg font-semibold mt-1">{project.area} hectares</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                    <p className="text-lg font-semibold mt-1">
                      {new Date(project.lastUpdated).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* NDVI Trends Tab */}
          <TabsContent value="ndvi" className="space-y-6">
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle>NDVI Historical Data</CardTitle>
                <CardDescription>Normalized Difference Vegetation Index over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={ndviComparison} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.3} />
                    <XAxis 
                      dataKey="month" 
                      stroke="#888"
                      style={{ fontSize: '13px' }}
                      tick={{ fill: '#888' }}
                      label={{ value: 'Time Period', position: 'insideBottom', offset: -5, fill: '#888' }}
                    />
                    <YAxis 
                      stroke="#888" 
                      domain={[0.2, 0.5]}
                      style={{ fontSize: '13px' }}
                      tick={{ fill: '#888' }}
                      label={{ value: 'NDVI Value', angle: -90, position: 'insideLeft', fill: '#888' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1a1a1a', 
                        border: '2px solid #10b981',
                        borderRadius: '8px',
                        padding: '12px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
                      }}
                      labelStyle={{ color: '#fff', fontWeight: 'bold', marginBottom: '8px' }}
                      formatter={(value: any, name: string) => {
                        const percentage = ((value - 0.2) / (0.8 - 0.2) * 100).toFixed(1);
                        const colors = {
                          'Current Year': '#10b981',
                          'Previous Year': '#3b82f6', 
                          'Expected': '#8b5cf6',
                          'Target': '#f59e0b'
                        };
                        const color = colors[name as keyof typeof colors] || '#fff';
                        return [
                          <span style={{ color, fontWeight: 'bold' }}>
                            {value.toFixed(3)} ({percentage}% of max)
                          </span>, 
                          name
                        ];
                      }}
                    />
                    <Legend 
                      wrapperStyle={{ paddingTop: '20px' }}
                      iconType="line"
                    />
                    <Line 
                      type="natural" 
                      dataKey="currentYear" 
                      stroke="#10b981" 
                      strokeWidth={4}
                      name="Current Year"
                      dot={{ fill: '#10b981', r: 4, strokeWidth: 2, stroke: '#fff' }}
                      activeDot={{ r: 7, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }}
                      animationDuration={1500}
                    />
                    <Line 
                      type="natural" 
                      dataKey="previousYear" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      name="Previous Year"
                      dot={{ fill: '#3b82f6', r: 3 }}
                      activeDot={{ r: 6, fill: '#3b82f6' }}
                      animationDuration={1200}
                    />
                    <Line 
                      type="natural" 
                      dataKey="expected" 
                      stroke="#8b5cf6" 
                      strokeWidth={3}
                      name="Expected"
                      dot={{ fill: '#8b5cf6', r: 3 }}
                      activeDot={{ r: 6, fill: '#8b5cf6' }}
                      animationDuration={1000}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="target" 
                      stroke="#f59e0b" 
                      strokeWidth={2}
                      strokeDasharray="8 4"
                      name="Target"
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-gradient-card border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">Baseline NDVI</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-muted-foreground">{project.ndviBaseline.toFixed(3)}</div>
                  <p className="text-sm text-muted-foreground mt-2">Initial measurement</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">Current NDVI</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-success">{project.ndviCurrent.toFixed(3)}</div>
                  <p className="text-sm text-muted-foreground mt-2">Latest measurement</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">Growth Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">+{project.ndviGrowth.toFixed(1)}%</div>
                  <p className="text-sm text-muted-foreground mt-2">Total improvement</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Carbon Credits Tab */}
          <TabsContent value="credits" className="space-y-6">
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle>Carbon Credits Generation</CardTitle>
                <CardDescription>Historical minting and accumulation</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={creditsHistory}>
                    <defs>
                      <linearGradient id="colorCredits" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorMinted" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.6}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="month" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                      formatter={(value: any) => [`${value} BCC`, '']}
                    />
                    <Legend />
                    <Area 
                      type="step" 
                      dataKey="credits" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorCredits)"
                      name="Total Credits"
                    />
                    <Area 
                      type="step" 
                      dataKey="minted" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      fill="url(#colorMinted)"
                      name="Minted"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-gradient-card border-border/50">
                <CardHeader>
                  <CardTitle>Credit Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total Minted</span>
                    <span className="text-xl font-bold text-accent">{project.carbonCredits} BCC</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Potential Credits</span>
                    <span className="text-xl font-bold text-primary">
                      {Math.round(project.area * (project.ndviGrowth / 100) * 5)} BCC
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Credits per Hectare</span>
                    <span className="text-xl font-bold">
                      {(project.carbonCredits / project.area).toFixed(2)} BCC/ha
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card border-border/50">
                <CardHeader>
                  <CardTitle>Environmental Impact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">CO₂ Sequestered</span>
                    <span className="text-xl font-bold text-success">~{project.carbonCredits} tons</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Trees Equivalent</span>
                    <span className="text-xl font-bold">~{Math.round(project.carbonCredits * 50)} trees</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Area Restored</span>
                    <span className="text-xl font-bold text-primary">{project.area} ha</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Location Tab */}
          <TabsContent value="location" className="space-y-6">
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle>Project Location</CardTitle>
                <CardDescription>{project.location}</CardDescription>
              </CardHeader>
              <CardContent>
                <div style={{ height: "500px", borderRadius: "8px", overflow: "hidden" }}>
                  <MapContainer
                    center={[project.coordinates!.lat, project.coordinates!.lng]}
                    zoom={10}
                    style={{ height: "100%", width: "100%" }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[project.coordinates!.lat, project.coordinates!.lng]}>
                      <Popup>
                        <div className="p-2">
                          <h3 className="font-bold">{project.projectName}</h3>
                          <p className="text-sm">{project.location}</p>
                          <p className="text-sm">Area: {project.area} hectares</p>
                        </div>
                      </Popup>
                    </Marker>
                    <Circle
                      center={[project.coordinates!.lat, project.coordinates!.lng]}
                      radius={project.area * 100}
                      pathOptions={{ color: '#10b981', fillColor: '#10b981', fillOpacity: 0.2 }}
                    />
                  </MapContainer>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-gradient-card border-border/50">
                <CardHeader>
                  <CardTitle>Geographic Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Coordinates</label>
                    <p className="text-lg font-semibold mt-1">
                      {project.coordinates!.lat.toFixed(4)}°N, {project.coordinates!.lng.toFixed(4)}°E
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Region</label>
                    <p className="text-lg font-semibold mt-1">{project.location}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Coverage Area</label>
                    <p className="text-lg font-semibold mt-1">{project.area} hectares</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card border-border/50">
                <CardHeader>
                  <CardTitle>Ecosystem Type</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Habitat</label>
                    <p className="text-lg font-semibold mt-1">Coastal Mangrove</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Climate Zone</label>
                    <p className="text-lg font-semibold mt-1">Tropical</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Biodiversity</label>
                    <p className="text-lg font-semibold mt-1">High</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProjectDetails;
