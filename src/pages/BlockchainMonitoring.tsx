import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Activity, 
  Coins, 
  MapPin, 
  Calendar, 
  TrendingUp, 
  ExternalLink,
  Copy,
  Satellite,
  Leaf,
  BarChart3
} from "lucide-react";
import { toast } from "sonner";
import { WalletConnect } from "@/components/Web3/WalletConnect";
import { useWeb3 } from "@/hooks/useWeb3";
import { contractService } from "@/services/contractService";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface NDVIReading {
  id: string;
  timestamp: number;
  ndviValue: number;
  vegetationCoverage: number;
  carbonCreditsEarned: number;
  satelliteImageUrl: string;
  verified: boolean;
}

interface ProjectData {
  id: string;
  name: string;
  location: string;
  coordinates: string;
  plantSpecies: string;
  areaHectares: number;
  contractAddress: string;
  totalCarbonCredits: number;
  progress: number;
  ndviReadings: NDVIReading[];
}

const BlockchainMonitoring = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { isConnected, account, isCorrectNetwork } = useWeb3();
  
  const [project, setProject] = useState<ProjectData | null>(null);
  const [tokenBalance, setTokenBalance] = useState<string>('0');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjectData();
    if (isConnected && account && isCorrectNetwork) {
      loadBlockchainData();
    }
  }, [projectId, isConnected, account, isCorrectNetwork]);

  const loadProjectData = () => {
    // Load project from localStorage
    const allProjects = JSON.parse(localStorage.getItem("ngo-projects") || "[]");
    const foundProject = allProjects.find((p: any) => p.id === projectId);
    
    if (foundProject) {
      // Get coordinates based on location
      const coords = getCoordinatesForLocation(foundProject.location);
      
      const mockProject: ProjectData = {
        id: foundProject.id,
        name: foundProject.projectName || foundProject.name,
        location: foundProject.location,
        coordinates: `${coords.lng},${coords.lat}`,
        plantSpecies: 'Sundari, Gewa, Keora',
        areaHectares: foundProject.area,
        contractAddress: foundProject.contractAddress || '0x742d35Cc6639C0532fAa56eb6d4c9F6789012345',
        totalCarbonCredits: foundProject.carbonCredits || 1250,
        progress: foundProject.progress || 75,
        ndviReadings: [
          {
            id: 'ndvi-001',
            timestamp: Date.now() - 86400000 * 30,
            ndviValue: 0.65,
            vegetationCoverage: 72,
            carbonCreditsEarned: 125,
            satelliteImageUrl: 'https://example.com/satellite1.jpg',
            verified: true
          },
          {
            id: 'ndvi-002',
            timestamp: Date.now() - 86400000 * 15,
            ndviValue: 0.72,
            vegetationCoverage: 78,
            carbonCreditsEarned: 145,
            satelliteImageUrl: 'https://example.com/satellite2.jpg',
            verified: true
          },
          {
            id: 'ndvi-003',
            timestamp: Date.now() - 86400000 * 7,
            ndviValue: 0.78,
            vegetationCoverage: 82,
            carbonCreditsEarned: 165,
            satelliteImageUrl: 'https://example.com/satellite3.jpg',
            verified: false
          }
        ]
      };
      
      setProject(mockProject);
    }
    setLoading(false);
  };

  const getCoordinatesForLocation = (location: string): { lat: number; lng: number } => {
    const locationMap: { [key: string]: { lat: number; lng: number } } = {
      "West Bengal": { lat: 21.9497, lng: 88.1808 },
      "Odisha": { lat: 20.9517, lng: 85.0985 },
      "Andhra Pradesh": { lat: 15.9129, lng: 79.7400 },
      "Tamil Nadu": { lat: 11.1271, lng: 78.6569 },
      "Gujarat": { lat: 22.2587, lng: 71.1924 },
      "Maharashtra": { lat: 19.7515, lng: 75.7139 }
    };

    for (const [key, coords] of Object.entries(locationMap)) {
      if (location.includes(key)) {
        return coords;
      }
    }
    return { lat: 20.5937, lng: 78.9629 }; // Default India center
  };

  const loadBlockchainData = async () => {
    if (!account) return;
    
    try {
      const balance = await contractService.getTokenBalance(account);
      setTokenBalance(balance);
    } catch (error) {
      console.error('Error loading blockchain data:', error);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const openEtherscan = (address: string) => {
    window.open(`https://sepolia.etherscan.io/address/${address}`, '_blank');
  };

  if (loading || !project) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-ocean rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Activity className="w-8 h-8 text-white" />
          </div>
          <p className="text-muted-foreground">Loading project data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/ngo-dashboard')}
            className="hover:glow-primary"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-heading font-bold">{project.name}</h1>
            <p className="text-muted-foreground flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              {project.location} • {project.areaHectares} hectares
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Project Overview */}
          <Card className="lg:col-span-2 bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Leaf className="w-5 h-5 text-success" />
                Project Overview
              </CardTitle>
              <CardDescription>Real-time restoration progress and metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Plant Species</label>
                  <p className="text-sm text-muted-foreground">{project.plantSpecies}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Project Contract</label>
                  <div className="flex items-center gap-2">
                    <code className="text-xs text-accent bg-muted/50 px-2 py-1 rounded">
                      {project.contractAddress.slice(0, 10)}...{project.contractAddress.slice(-6)}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(project.contractAddress)}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEtherscan(project.contractAddress)}
                    >
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Restoration Progress</span>
                  <span className="text-sm text-primary font-bold">{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-3" />
                <div className="text-xs text-muted-foreground">
                  Based on NDVI analysis and vegetation coverage data
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-success/10 rounded-lg">
                  <div className="text-2xl font-bold text-success">{project.totalCarbonCredits}</div>
                  <div className="text-xs text-muted-foreground">Total Credits Earned</div>
                </div>
                <div className="text-center p-4 bg-primary/10 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{project.ndviReadings.length}</div>
                  <div className="text-xs text-muted-foreground">NDVI Readings</div>
                </div>
                <div className="text-center p-4 bg-accent/10 rounded-lg">
                  <div className="text-2xl font-bold text-accent">
                    {project.ndviReadings[project.ndviReadings.length - 1]?.ndviValue.toFixed(2) || '0.00'}
                  </div>
                  <div className="text-xs text-muted-foreground">Latest NDVI</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Blockchain Status */}
          <div className="space-y-6">
            <WalletConnect />
            
            {isConnected && isCorrectNetwork && (
              <Card className="bg-gradient-card border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Coins className="w-5 h-5 text-accent" />
                    Your Carbon Credits
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center p-4 bg-accent/10 rounded-lg">
                    <div className="text-3xl font-bold text-accent">{parseFloat(tokenBalance).toFixed(2)}</div>
                    <div className="text-sm text-muted-foreground">BCC Tokens</div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Detailed Monitoring */}
        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Monitoring & Verification
            </CardTitle>
            <CardDescription>Satellite data and NDVI analysis timeline</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="timeline" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="timeline">NDVI Timeline</TabsTrigger>
                <TabsTrigger value="satellite">Satellite Data</TabsTrigger>
              </TabsList>
              
              <TabsContent value="timeline" className="space-y-4">
                {project.ndviReadings.map((reading, index) => (
                  <Card key={reading.id} className="bg-muted/30 border-border/30">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-full">
                            <Satellite className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">
                              Reading #{project.ndviReadings.length - index}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(reading.timestamp).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <Badge className={reading.verified ? 'bg-success text-success-foreground' : 'bg-warning text-warning-foreground'}>
                          {reading.verified ? 'Verified' : 'Pending'}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-4 text-center">
                        <div>
                          <div className="text-lg font-bold text-primary">{reading.ndviValue.toFixed(2)}</div>
                          <div className="text-xs text-muted-foreground">NDVI Value</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-success">{reading.vegetationCoverage}%</div>
                          <div className="text-xs text-muted-foreground">Coverage</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-accent">{reading.carbonCreditsEarned}</div>
                          <div className="text-xs text-muted-foreground">Credits Earned</div>
                        </div>
                        <div>
                          <Button variant="outline" size="sm">
                            <ExternalLink className="w-3 h-3 mr-1" />
                            View Image
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
              
              <TabsContent value="satellite" className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <Card className="bg-muted/30 border-border/30">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Satellite className="w-5 h-5 text-primary" />
                        Satellite Imagery - Standard View
                      </CardTitle>
                      <CardDescription>OpenStreetMap satellite view of project area</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div style={{ height: "300px", borderRadius: "8px", overflow: "hidden" }}>
                        <MapContainer
                          center={[
                            parseFloat(project.coordinates.split(',')[1]),
                            parseFloat(project.coordinates.split(',')[0])
                          ]}
                          zoom={13}
                          style={{ height: "100%", width: "100%" }}
                        >
                          <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          />
                          <Marker position={[
                            parseFloat(project.coordinates.split(',')[1]),
                            parseFloat(project.coordinates.split(',')[0])
                          ]}>
                            <Popup>
                              <div className="p-2">
                                <h3 className="font-bold">{project.name}</h3>
                                <p className="text-sm">{project.location}</p>
                                <p className="text-sm">Area: {project.areaHectares} hectares</p>
                              </div>
                            </Popup>
                          </Marker>
                          <Circle
                            center={[
                              parseFloat(project.coordinates.split(',')[1]),
                              parseFloat(project.coordinates.split(',')[0])
                            ]}
                            radius={project.areaHectares * 100}
                            pathOptions={{ color: '#10b981', fillColor: '#10b981', fillOpacity: 0.2 }}
                          />
                        </MapContainer>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Resolution:</span>
                          <span className="ml-2 font-medium">10m</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Cloud Cover:</span>
                          <span className="ml-2 font-medium">15%</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Data Source:</span>
                          <span className="ml-2 font-medium">OpenStreetMap</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Quality:</span>
                          <span className="ml-2 font-medium text-success">Excellent</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-muted/30 border-border/30">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Satellite className="w-5 h-5 text-accent" />
                        Satellite Imagery - Terrain View
                      </CardTitle>
                      <CardDescription>Topographic view with terrain details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div style={{ height: "300px", borderRadius: "8px", overflow: "hidden" }}>
                        <MapContainer
                          center={[
                            parseFloat(project.coordinates.split(',')[1]),
                            parseFloat(project.coordinates.split(',')[0])
                          ]}
                          zoom={13}
                          style={{ height: "100%", width: "100%" }}
                        >
                          <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
                          />
                          <Marker position={[
                            parseFloat(project.coordinates.split(',')[1]),
                            parseFloat(project.coordinates.split(',')[0])
                          ]}>
                            <Popup>
                              <div className="p-2">
                                <h3 className="font-bold">{project.name}</h3>
                                <p className="text-sm">Terrain Analysis</p>
                                <p className="text-sm">NDVI: {project.ndviReadings[project.ndviReadings.length - 1]?.ndviValue.toFixed(2)}</p>
                              </div>
                            </Popup>
                          </Marker>
                          <Circle
                            center={[
                              parseFloat(project.coordinates.split(',')[1]),
                              parseFloat(project.coordinates.split(',')[0])
                            ]}
                            radius={project.areaHectares * 100}
                            pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.2 }}
                          />
                        </MapContainer>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Avg NDVI:</span>
                          <span className="ml-2 font-medium">0.72</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Growth Rate:</span>
                          <span className="ml-2 font-medium text-success">+12%</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Health Score:</span>
                          <span className="ml-2 font-medium text-success">Excellent</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Next Reading:</span>
                          <span className="ml-2 font-medium">7 days</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* NDVI Visualization */}
                <Card className="bg-muted/30 border-border/30">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Leaf className="w-5 h-5 text-success" />
                      NDVI Vegetation Analysis
                    </CardTitle>
                    <CardDescription>Normalized Difference Vegetation Index visualization</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="h-48 bg-gradient-to-r from-red-500/20 via-yellow-500/20 via-green-500/20 to-emerald-500/30 rounded-lg flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
                        <div className="text-center relative z-10">
                          <TrendingUp className="w-12 h-12 text-success mx-auto mb-3" />
                          <p className="text-lg font-bold">Positive Growth Trend</p>
                          <p className="text-sm text-muted-foreground">+12% improvement over 30 days</p>
                          <div className="mt-4 flex items-center justify-center gap-4">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-red-400">0.2</div>
                              <div className="text-xs">Bare Soil</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-yellow-400">0.4</div>
                              <div className="text-xs">Sparse</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-green-400">0.6</div>
                              <div className="text-xs">Moderate</div>
                            </div>
                            <div className="text-2xl font-bold text-emerald-400 ring-2 ring-emerald-400 px-3 py-1 rounded-lg">
                              {project.ndviReadings[project.ndviReadings.length - 1]?.ndviValue.toFixed(2)}
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-emerald-500">0.8+</div>
                              <div className="text-xs">Dense</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BlockchainMonitoring;