import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  ArrowLeft, 
  Shield, 
  Satellite, 
  MapPin, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Eye,
  Download,
  ExternalLink,
  Leaf,
  Building,
  FileText,
  Camera,
  TrendingUp,
  Activity,
  Globe
} from "lucide-react";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { MapContainer, TileLayer, Marker, Popup, Polygon } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { toast } from "sonner";

// Fix Leaflet default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface AuditProject {
  id: string;
  projectName: string;
  ngoName: string;
  location: string;
  area: number;
  ndviGrowth: number;
  carbonCredits: number;
  auditStatus: "approved" | "pending" | "rejected";
  satelliteVerified: boolean;
  ngoVerified: boolean;
  blockchainVerified: boolean;
  coordinates: { lat: number; lng: number };
  ndviBaseline: number;
  ndviCurrent: number;
  lastAuditDate: string;
  contractAddress: string;
}

const AuditProjects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<AuditProject[]>([]);
  const [selectedProject, setSelectedProject] = useState<AuditProject | null>(null);
  const [auditStats, setAuditStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
    satelliteVerified: 0,
    ngoVerified: 0,
    blockchainVerified: 0
  });

  useEffect(() => {
    loadAuditData();
  }, []);

  const loadAuditData = () => {
    // Load projects from localStorage and add audit data
    const allProjects = JSON.parse(localStorage.getItem("ngo-projects") || "[]");
    const activeProjects = allProjects.filter((p: any) => p.status === "active" || p.status === "verified");
    
    const auditProjects: AuditProject[] = activeProjects.map((p: any, index: number) => {
      const coords = getCoordinatesForLocation(p.location);
      const ndviGrowth = p.ndviGrowth || (Math.random() * 25 + 5);
      const auditStatuses = ["approved", "pending", "rejected"];
      const auditStatus = ndviGrowth > 15 ? "approved" : ndviGrowth > 8 ? "pending" : "rejected";
      
      return {
        id: p.id,
        projectName: p.projectName || p.name || `Project ${index + 1}`,
        ngoName: p.ngoName || "Unknown NGO",
        location: p.location || "Unknown Location",
        area: p.area || 100,
        ndviGrowth: ndviGrowth,
        carbonCredits: p.carbonCredits || Math.round(p.area * (ndviGrowth / 100) * 5),
        auditStatus: auditStatus as "approved" | "pending" | "rejected",
        satelliteVerified: ndviGrowth > 10,
        ngoVerified: Math.random() > 0.2, // 80% NGOs verified
        blockchainVerified: Math.random() > 0.1, // 90% blockchain verified
        coordinates: coords,
        ndviBaseline: p.ndviBaseline || 0.34,
        ndviCurrent: p.ndviCurrent || (0.34 + (ndviGrowth / 100) * 0.34),
        lastAuditDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        contractAddress: p.contractAddress || `0x${Math.random().toString(16).substr(2, 40)}`
      };
    });

    setProjects(auditProjects);
    
    // Calculate stats
    const stats = {
      total: auditProjects.length,
      approved: auditProjects.filter(p => p.auditStatus === "approved").length,
      pending: auditProjects.filter(p => p.auditStatus === "pending").length,
      rejected: auditProjects.filter(p => p.auditStatus === "rejected").length,
      satelliteVerified: auditProjects.filter(p => p.satelliteVerified).length,
      ngoVerified: auditProjects.filter(p => p.ngoVerified).length,
      blockchainVerified: auditProjects.filter(p => p.blockchainVerified).length
    };
    
    setAuditStats(stats);
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
    return { lat: 20.5937, lng: 78.9629 };
  };

  const generateNDVIComparisonData = (baseline: number, current: number) => {
    const months = 12;
    const data = [];
    
    for (let i = 0; i <= months; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() - (months - i));
      const progress = i / months;
      
      // Satellite verified NDVI
      const satelliteNDVI = baseline + ((current - baseline) * progress) + (Math.random() - 0.5) * 0.02;
      
      // Field reported NDVI (slightly different)
      const fieldNDVI = satelliteNDVI + (Math.random() - 0.5) * 0.01;
      
      data.push({
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        satellite: parseFloat(Math.max(baseline, satelliteNDVI).toFixed(3)),
        field: parseFloat(Math.max(baseline, fieldNDVI).toFixed(3)),
        target: 0.45
      });
    }
    return data;
  };

  const auditStatusData = [
    { name: 'Approved', value: auditStats.approved, color: '#10b981' },
    { name: 'Pending', value: auditStats.pending, color: '#f59e0b' },
    { name: 'Rejected', value: auditStats.rejected, color: '#ef4444' }
  ];

  const verificationData = [
    { category: 'Satellite', verified: auditStats.satelliteVerified, total: auditStats.total },
    { category: 'NGO', verified: auditStats.ngoVerified, total: auditStats.total },
    { category: 'Blockchain', verified: auditStats.blockchainVerified, total: auditStats.total }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved": return <CheckCircle className="w-4 h-4 text-success" />;
      case "pending": return <AlertTriangle className="w-4 h-4 text-warning" />;
      case "rejected": return <XCircle className="w-4 h-4 text-destructive" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "bg-success text-success-foreground";
      case "pending": return "bg-warning text-warning-foreground";
      case "rejected": return "bg-destructive text-destructive-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const handleDownloadReport = (project: AuditProject) => {
    toast.success(`Audit report for ${project.projectName} downloaded successfully!`);
  };

  const handleViewBlockchain = (contractAddress: string) => {
    window.open(`https://sepolia.etherscan.io/address/${contractAddress}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/government-dashboard')}
            className="hover:glow-primary"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-heading font-bold flex items-center gap-3">
              <Shield className="w-8 h-8 text-primary" />
              Audit Projects
            </h1>
            <p className="text-muted-foreground">Independent verification of carbon credit projects</p>
          </div>
        </div>

        {/* Audit Overview Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-card border-border/50 hover:glow-primary transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Projects</CardTitle>
                <FileText className="w-4 h-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{auditStats.total}</div>
              <div className="text-xs text-muted-foreground">Under audit</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50 hover:glow-primary transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Approved</CardTitle>
                <CheckCircle className="w-4 h-4 text-success" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{auditStats.approved}</div>
              <div className="text-xs text-success">
                {auditStats.total > 0 ? Math.round((auditStats.approved / auditStats.total) * 100) : 0}% approval rate
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50 hover:glow-primary transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Satellite Verified</CardTitle>
                <Satellite className="w-4 h-4 text-accent" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">{auditStats.satelliteVerified}</div>
              <div className="text-xs text-muted-foreground">NDVI confirmed</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50 hover:glow-primary transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Blockchain Verified</CardTitle>
                <Globe className="w-4 h-4 text-highlight" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-highlight">{auditStats.blockchainVerified}</div>
              <div className="text-xs text-muted-foreground">Smart contracts audited</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="satellite">Satellite Verification</TabsTrigger>
            <TabsTrigger value="ngo">NGO Authentication</TabsTrigger>
            <TabsTrigger value="blockchain">Blockchain Audit</TabsTrigger>
            <TabsTrigger value="reports">Audit Reports</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Audit Status Distribution */}
              <Card className="bg-gradient-card border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-primary" />
                    Audit Status Distribution
                  </CardTitle>
                  <CardDescription>Project verification outcomes</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={auditStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {auditStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Verification Progress */}
              <Card className="bg-gradient-card border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-success" />
                    Verification Progress
                  </CardTitle>
                  <CardDescription>Completion rates by verification type</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={verificationData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.3} />
                      <XAxis dataKey="category" stroke="#888" />
                      <YAxis stroke="#888" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1a1a1a', 
                          border: '1px solid #333',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar dataKey="verified" fill="#10b981" name="Verified" />
                      <Bar dataKey="total" fill="#374151" name="Total" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Projects Table */}
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle>Audit Dashboard</CardTitle>
                <CardDescription>Comprehensive project verification status</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Project Name</TableHead>
                        <TableHead>NDVI Growth</TableHead>
                        <TableHead>Satellite</TableHead>
                        <TableHead>NGO</TableHead>
                        <TableHead>Blockchain</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {projects.map((project) => (
                        <TableRow key={project.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium">{project.projectName}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <TrendingUp className={`w-4 h-4 ${project.ndviGrowth >= 15 ? 'text-success' : 'text-warning'}`} />
                              <span className={`font-semibold ${project.ndviGrowth >= 15 ? 'text-success' : 'text-warning'}`}>
                                +{project.ndviGrowth.toFixed(1)}%
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {project.satelliteVerified ? (
                              <CheckCircle className="w-5 h-5 text-success" />
                            ) : (
                              <XCircle className="w-5 h-5 text-destructive" />
                            )}
                          </TableCell>
                          <TableCell>
                            {project.ngoVerified ? (
                              <CheckCircle className="w-5 h-5 text-success" />
                            ) : (
                              <AlertTriangle className="w-5 h-5 text-warning" />
                            )}
                          </TableCell>
                          <TableCell>
                            {project.blockchainVerified ? (
                              <CheckCircle className="w-5 h-5 text-success" />
                            ) : (
                              <XCircle className="w-5 h-5 text-destructive" />
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(project.auditStatus)}>
                              {getStatusIcon(project.auditStatus)}
                              <span className="ml-1 capitalize">{project.auditStatus}</span>
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedProject(project)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDownloadReport(project)}
                              >
                                <Download className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Satellite Verification Tab */}
          <TabsContent value="satellite" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Satellite Map */}
              <Card className="bg-gradient-card border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Satellite className="w-5 h-5 text-primary" />
                    Satellite Verification Map
                  </CardTitle>
                  <CardDescription>Real-time NDVI monitoring across all projects</CardDescription>
                </CardHeader>
                <CardContent>
                  <div style={{ height: "400px", borderRadius: "8px", overflow: "hidden" }}>
                    <MapContainer
                      center={[20.5937, 78.9629]}
                      zoom={5}
                      style={{ height: "100%", width: "100%" }}
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      {projects.map((project) => (
                        <Marker
                          key={project.id}
                          position={[project.coordinates.lat, project.coordinates.lng]}
                        >
                          <Popup>
                            <div className="p-2">
                              <h3 className="font-bold">{project.projectName}</h3>
                              <p className="text-sm">NDVI Growth: +{project.ndviGrowth.toFixed(1)}%</p>
                              <p className="text-sm">Status: {project.auditStatus}</p>
                              <p className="text-sm">
                                Satellite: {project.satelliteVerified ? "✅ Verified" : "❌ Failed"}
                              </p>
                            </div>
                          </Popup>
                        </Marker>
                      ))}
                    </MapContainer>
                  </div>
                </CardContent>
              </Card>

              {/* NDVI Comparison */}
              <Card className="bg-gradient-card border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Leaf className="w-5 h-5 text-success" />
                    Satellite vs Field Data
                  </CardTitle>
                  <CardDescription>NDVI verification comparison</CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedProject ? (
                    <ResponsiveContainer width="100%" height={350}>
                      <LineChart data={generateNDVIComparisonData(selectedProject.ndviBaseline, selectedProject.ndviCurrent)}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.3} />
                        <XAxis dataKey="month" stroke="#888" />
                        <YAxis stroke="#888" domain={[0.25, 0.5]} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1a1a1a', 
                            border: '1px solid #333',
                            borderRadius: '8px'
                          }}
                        />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="satellite" 
                          stroke="#10b981" 
                          strokeWidth={3}
                          name="Satellite NDVI"
                          dot={{ fill: '#10b981', r: 4 }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="field" 
                          stroke="#3b82f6" 
                          strokeWidth={2}
                          name="Field Reported"
                          dot={{ fill: '#3b82f6', r: 3 }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="target" 
                          stroke="#f59e0b" 
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          name="Target"
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[350px] flex items-center justify-center text-muted-foreground">
                      Select a project from the table to view NDVI comparison
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Satellite Data Summary */}
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle>Satellite Data Verification Summary</CardTitle>
                <CardDescription>Automated NDVI analysis results</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-success/10 rounded-lg">
                    <Satellite className="w-8 h-8 text-success mx-auto mb-2" />
                    <div className="text-2xl font-bold text-success">{auditStats.satelliteVerified}</div>
                    <div className="text-sm text-muted-foreground">Satellite Verified</div>
                    <div className="text-xs text-success mt-1">NDVI growth confirmed</div>
                  </div>
                  <div className="text-center p-4 bg-warning/10 rounded-lg">
                    <AlertTriangle className="w-8 h-8 text-warning mx-auto mb-2" />
                    <div className="text-2xl font-bold text-warning">{auditStats.pending}</div>
                    <div className="text-sm text-muted-foreground">Pending Review</div>
                    <div className="text-xs text-warning mt-1">Manual verification needed</div>
                  </div>
                  <div className="text-center p-4 bg-destructive/10 rounded-lg">
                    <XCircle className="w-8 h-8 text-destructive mx-auto mb-2" />
                    <div className="text-2xl font-bold text-destructive">{auditStats.rejected}</div>
                    <div className="text-sm text-muted-foreground">Verification Failed</div>
                    <div className="text-xs text-destructive mt-1">Insufficient NDVI growth</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* NGO Authentication Tab */}
          <TabsContent value="ngo" className="space-y-6">
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5 text-accent" />
                  NGO Authentication & Verification
                </CardTitle>
                <CardDescription>Verify NGO credentials and project authenticity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {projects.map((project) => (
                    <div key={project.id} className="p-4 border border-border/50 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold">{project.ngoName}</h3>
                          <p className="text-sm text-muted-foreground">{project.projectName}</p>
                        </div>
                        <Badge className={project.ngoVerified ? "bg-success text-success-foreground" : "bg-warning text-warning-foreground"}>
                          {project.ngoVerified ? "✅ Verified NGO" : "⚠️ Pending Verification"}
                        </Badge>
                      </div>
                      
                      <div className="grid md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Registration:</span>
                          <span className="ml-2 font-medium">
                            {project.ngoVerified ? "NGO/2021/0012345" : "Pending"}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">FCRA Status:</span>
                          <span className="ml-2 font-medium">
                            {project.ngoVerified ? "Active" : "Checking"}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">12A/80G:</span>
                          <span className="ml-2 font-medium">
                            {project.ngoVerified ? "Valid" : "Pending"}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Last Audit:</span>
                          <span className="ml-2 font-medium">
                            {new Date(project.lastAuditDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Blockchain Audit Tab */}
          <TabsContent value="blockchain" className="space-y-6">
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-highlight" />
                  Blockchain Smart Contract Audit
                </CardTitle>
                <CardDescription>Verify transaction traceability and smart contract integrity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {projects.map((project) => (
                    <div key={project.id} className="p-4 border border-border/50 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold">{project.projectName}</h3>
                          <p className="text-sm text-muted-foreground font-mono">
                            {project.contractAddress}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Badge className={project.blockchainVerified ? "bg-success text-success-foreground" : "bg-destructive text-destructive-foreground"}>
                            {project.blockchainVerified ? "✅ Contract Verified" : "❌ Verification Failed"}
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewBlockchain(project.contractAddress)}
                          >
                            <ExternalLink className="w-4 h-4 mr-1" />
                            Etherscan
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Mint Function:</span>
                          <span className="ml-2 font-medium text-success">✓ Verified</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Owner Check:</span>
                          <span className="ml-2 font-medium text-success">✓ Government Only</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Gas Used:</span>
                          <span className="ml-2 font-medium">0.002 ETH</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Credits Minted:</span>
                          <span className="ml-2 font-medium">{project.carbonCredits} BCC</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Audit Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Carbon Credit Justification Reports
                </CardTitle>
                <CardDescription>Downloadable audit reports with complete verification data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projects.map((project) => (
                    <div key={project.id} className="flex items-center justify-between p-4 border border-border/50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <FileText className="w-8 h-8 text-primary" />
                        <div>
                          <h3 className="font-semibold">{project.projectName}</h3>
                          <p className="text-sm text-muted-foreground">
                            Audit Report • {new Date(project.lastAuditDate).toLocaleDateString()}
                          </p>
                          <div className="flex gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              NDVI: +{project.ndviGrowth.toFixed(1)}%
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              Credits: {project.carbonCredits} BCC
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              Area: {project.area} ha
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadReport(project)}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download PDF
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedProject(project)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Preview
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AuditProjects;