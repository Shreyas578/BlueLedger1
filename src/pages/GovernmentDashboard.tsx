import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, XCircle, Eye, FileText, MapPin, TrendingUp, Users, Activity, Coins, Wallet, ExternalLink, Leaf } from "lucide-react";
import { toast } from "sonner";
import { WalletConnect } from "@/components/Web3/WalletConnect";
import { useWeb3 } from "@/hooks/useWeb3";
import { contractService } from "@/services/contractService";
import { MintCreditsButton } from "@/components/MintCreditsButton";
import { initializeTestProjects } from "@/utils/initTestData";

interface Application {
  id: string;
  ngoName: string;
  projectName: string;
  location: string;
  area: number;
  submittedDate: string;
  status: "pending" | "approved" | "rejected";
  documents: string[];
  userId: string;
}

interface ProjectStats {
  totalProjects: number;
  totalArea: number;
  totalCredits: number;
  activeProjects: number;
}

interface ActiveProject {
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
}

const GovernmentDashboard = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [activeProjects, setActiveProjects] = useState<ActiveProject[]>([]);
  const [stats, setStats] = useState<ProjectStats>({
    totalProjects: 2145,
    totalArea: 890000,
    totalCredits: 1568000,
    activeProjects: 1876
  });
  const [blockchainStats, setBlockchainStats] = useState({
    totalApplicationsOnChain: 0,
    tokenInfo: { name: '', symbol: '', totalSupply: '0' },
    governmentBalance: '0'
  });
  
  const { isConnected, account, isCorrectNetwork } = useWeb3();

  const stateData = [
    { name: "Maharashtra", projects: 425, color: "text-primary" },
    { name: "West Bengal", projects: 380, color: "text-accent" },
    { name: "Odisha", projects: 320, color: "text-success" },
    { name: "Gujarat", projects: 290, color: "text-warning" },
    { name: "Tamil Nadu", projects: 250, color: "text-highlight" },
  ];

  useEffect(() => {
    // Initialize test data on first load
    initializeTestProjects();
    
    loadLocalData();

    // Load blockchain data if connected
    if (isConnected && account && isCorrectNetwork) {
      loadBlockchainData();
    }
  }, [isConnected, account, isCorrectNetwork]);

  const loadLocalData = () => {
    // Load real applications from localStorage
    const pendingApplications = localStorage.getItem("pending-applications");
    if (pendingApplications) {
      const applications = JSON.parse(pendingApplications);
      setApplications(applications);
    } else {
      // Mock applications data for demonstration
      const mockApplications: Application[] = [
        {
          id: "1",
          ngoName: "Coastal Conservation Foundation",
          projectName: "Chilika Lake Mangrove Restoration", 
          location: "Odisha, India",
          area: 120,
          submittedDate: "2024-09-20",
          status: "pending",
          documents: ["NGO Certificate", "Land Documents", "Environmental Clearance"],
          userId: "user2"
        },
        {
          id: "2",
          ngoName: "Marine Biodiversity Trust",
          projectName: "Pulicat Lake Blue Carbon Initiative",
          location: "Tamil Nadu, India", 
          area: 85,
          submittedDate: "2024-09-18",
          status: "pending",
          documents: ["Registration Certificate", "Land Lease Agreement", "Impact Assessment"],
          userId: "user3"
        },
        {
          id: "3",
          ngoName: "Mangrove Mission Society",
          projectName: "Godavari Delta Restoration",
          location: "Andhra Pradesh, India",
          area: 200,
          submittedDate: "2024-09-15",
          status: "pending", 
          documents: ["Trust Deed", "Land Rights", "Project Proposal"],
          userId: "user4"
        }
      ];
      setApplications(mockApplications);
      localStorage.setItem("pending-applications", JSON.stringify(mockApplications));
    }

    // Load active projects with NDVI data
    const allProjects = JSON.parse(localStorage.getItem("ngo-projects") || "[]");
    const active = allProjects.filter((p: any) => p.status === "active" || p.status === "verified");
    
    // Filter out unwanted test projects and keep only the good ones
    const goodProjects = active.filter((p: any) => {
      const validNames = [
        "Sundarbans Mangrove Restoration",
        "Chilika Lake Blue Carbon Initiative", 
        "Godavari Delta Restoration",
        "Pulicat Lake Mangrove Expansion",
        "Bhitarkanika Mangrove Conservation"
      ];
      return validNames.includes(p.projectName) || validNames.includes(p.name);
    });
    
    // Add NDVI data to projects - ensure all fields are preserved
    const projectsWithNDVI: ActiveProject[] = goodProjects.map((p: any) => ({
      id: p.id,
      projectName: p.projectName || p.name || "Unnamed Project",
      ngoName: p.ngoName || "Unknown NGO",
      location: p.location || "Unknown Location",
      area: p.area || 0,
      status: p.status,
      progress: p.progress || 0,
      carbonCredits: p.carbonCredits || 0,
      ndviBaseline: p.ndviBaseline || 0.34,
      ndviCurrent: p.ndviCurrent || (0.34 + Math.random() * 0.15),
      ndviGrowth: p.ndviGrowth || (Math.random() * 30),
      lastUpdated: p.lastUpdated || new Date().toISOString()
    }));
    
    setActiveProjects(projectsWithNDVI);
    
    setStats({
      totalProjects: allProjects.length + 2000,
      totalArea: allProjects.reduce((sum: number, p: any) => sum + p.area, 0) + 850000,
      totalCredits: allProjects.reduce((sum: number, p: any) => sum + (p.carbonCredits || 0), 0) + 1500000,
      activeProjects: active.length + 1800
    });
  };

  const loadBlockchainData = async () => {
    try {
      const totalApps = await contractService.getTotalApplications();
      const tokenInfo = await contractService.getTokenInfo();
      const balance = account ? await contractService.getTokenBalance(account) : '0';
      
      setBlockchainStats({
        totalApplicationsOnChain: totalApps,
        tokenInfo,
        governmentBalance: balance
      });
    } catch (error) {
      console.error('Error loading blockchain data:', error);
    }
  };

  const handleApproveApplication = (applicationId: string) => {
    const updatedApplications = applications.map(app => 
      app.id === applicationId ? { ...app, status: "approved" as const } : app
    );
    setApplications(updatedApplications);
    localStorage.setItem("pending-applications", JSON.stringify(updatedApplications));
    
    setSelectedApplication(null);
    
    // Also update the NGO's project status
    const allProjects = JSON.parse(localStorage.getItem("ngo-projects") || "[]");
    const updatedProjects = allProjects.map((project: any) => 
      project.id === applicationId ? { ...project, status: "verified" } : project
    );
    localStorage.setItem("ngo-projects", JSON.stringify(updatedProjects));
    
    toast.success("Application approved! NGO will be notified and can now accept the project.");
  };

  const handleRejectApplication = (applicationId: string) => {
    const updatedApplications = applications.map(app =>
      app.id === applicationId ? { ...app, status: "rejected" as const } : app  
    );
    setApplications(updatedApplications);
    localStorage.setItem("pending-applications", JSON.stringify(updatedApplications));
    
    // Also update the NGO's project status
    const allProjects = JSON.parse(localStorage.getItem("ngo-projects") || "[]");
    const updatedProjects = allProjects.map((project: any) => 
      project.id === applicationId ? { ...project, status: "rejected" } : project
    );
    localStorage.setItem("ngo-projects", JSON.stringify(updatedProjects));
    
    setSelectedApplication(null);
    toast.error("Application rejected. NGO will be notified.");
  };

  const handleMintCredits = () => {
    // Simulate minting credits for active projects
    const allProjects = JSON.parse(localStorage.getItem("ngo-projects") || "[]");
    const activeProjects = allProjects.filter((p: any) => p.status === "active");
    
    const updatedProjects = allProjects.map((project: any) => {
      if (project.status === "active" && project.progress >= 50) {
        const additionalCredits = Math.round(project.area * 2); // Bonus credits for good progress
        return {
          ...project,
          carbonCredits: (project.carbonCredits || 0) + additionalCredits
        };
      }
      return project;
    });
    
    localStorage.setItem("ngo-projects", JSON.stringify(updatedProjects));
    
    const totalMinted = activeProjects.reduce((sum: number, p: any) => 
      p.progress >= 50 ? sum + Math.round(p.area * 2) : sum, 0
    );
    
    setStats(prev => ({
      ...prev,
      totalCredits: prev.totalCredits + totalMinted
    }));
    
    toast.success(`${totalMinted} carbon credits minted successfully for qualified projects!`);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold mb-2">Government Dashboard</h1>
          <p className="text-muted-foreground">National Blue Carbon Registry Management</p>
        </div>

        {/* Blockchain Integration Section */}
        {isConnected && isCorrectNetwork && (
          <Card className="mb-8 bg-gradient-card border-border/50 hover:glow-primary transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-primary" />
                Blockchain Registry Status
              </CardTitle>
              <CardDescription>Smart contract interactions and on-chain data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-5 gap-4">
                <div className="text-center p-4 bg-primary/10 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{blockchainStats.totalApplicationsOnChain}</div>
                  <div className="text-xs text-muted-foreground">On-Chain Applications</div>
                </div>
                <div className="text-center p-4 bg-accent/10 rounded-lg">
                  <div className="text-2xl font-bold text-accent">{blockchainStats.tokenInfo.symbol}</div>
                  <div className="text-xs text-muted-foreground">Token Symbol</div>
                </div>
                <div className="text-center p-4 bg-success/10 rounded-lg">
                  <div className="text-2xl font-bold text-success">{parseFloat(blockchainStats.tokenInfo.totalSupply).toFixed(0)}</div>
                  <div className="text-xs text-muted-foreground">Total Supply</div>
                </div>
                <div className="text-center p-4 bg-highlight/10 rounded-lg">
                  <div className="text-2xl font-bold text-highlight">{parseFloat(blockchainStats.governmentBalance).toFixed(0)}</div>
                  <div className="text-xs text-muted-foreground">Your Balance</div>
                </div>
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open('https://sepolia.etherscan.io/address/0x046BD349B6F8aC89a49176f1eaa85bc2eF1B6043', '_blank')}
                    className="w-full"
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    View Registry
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {!isConnected && (
          <Card className="mb-8 bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle>Connect to Blockchain</CardTitle>
              <CardDescription>Connect your wallet to access blockchain features</CardDescription>
            </CardHeader>
            <CardContent>
              <WalletConnect />
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-card border-border/50 hover:glow-primary transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Projects</CardTitle>
                <Users className="w-4 h-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.totalProjects.toLocaleString()}</div>
              <div className="text-xs text-success">+12% from last month</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50 hover:glow-primary transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Area</CardTitle>
                <MapPin className="w-4 h-4 text-success" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{stats.totalArea.toLocaleString()} ha</div>
              <div className="text-xs text-success">+8% from last month</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50 hover:glow-primary transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Carbon Credits</CardTitle>
                <Coins className="w-4 h-4 text-accent" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">{stats.totalCredits.toLocaleString()} CC</div>
              <div className="text-xs text-success">+15% from last month</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50 hover:glow-primary transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Projects</CardTitle>
                <Activity className="w-4 h-4 text-highlight" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-highlight">{stats.activeProjects.toLocaleString()}</div>
              <div className="text-xs text-success">+5% from last month</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* India Heatmap */}
          <Card className="lg:col-span-2 bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Project Distribution by State
              </CardTitle>
              <CardDescription>Active blue carbon projects across India</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stateData.map((state, index) => (
                  <div key={state.name} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full bg-current ${state.color}`} />
                      <span className="font-medium">{state.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">{state.projects} projects</span>
                      <Progress 
                        value={(state.projects / 500) * 100} 
                        className="w-20 h-2"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common administrative tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full bg-gradient-ocean hover:glow-primary justify-start"
                onClick={handleMintCredits}
              >
                <Coins className="w-4 h-4 mr-2" />
                Mint Carbon Credits
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileText className="w-4 h-4 mr-2" />
                Generate Reports
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate('/audit-projects')}
              >
                <Eye className="w-4 h-4 mr-2" />
                Audit Projects
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Active Projects with NDVI Monitoring */}
        <Card className="mt-6 bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="w-5 h-5 text-success" />
              Active Projects - Vegetation Monitoring
            </CardTitle>
            <CardDescription>Monitor NDVI growth and generate carbon credits</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Project Name</TableHead>
                    <TableHead className="w-[200px]">NGO</TableHead>
                    <TableHead className="w-[100px]">Area (ha)</TableHead>
                    <TableHead className="w-[120px]">NDVI Growth</TableHead>
                    <TableHead className="w-[130px]">Current Credits</TableHead>
                    <TableHead className="w-[120px]">Last Updated</TableHead>
                    <TableHead className="w-[150px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeProjects.length > 0 ? (
                    activeProjects.map((project) => (
                      <TableRow key={project.id} className="hover:bg-muted/50 cursor-pointer">
                        <TableCell 
                          className="font-medium text-primary hover:underline"
                          onClick={() => window.location.href = `/project-details/${project.id}`}
                        >
                          {project.projectName}
                        </TableCell>
                        <TableCell>{project.ngoName}</TableCell>
                        <TableCell>{project.area}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <TrendingUp className={`w-4 h-4 ${project.ndviGrowth >= 10 ? 'text-success' : 'text-warning'}`} />
                            <span className={`font-semibold ${project.ndviGrowth >= 10 ? 'text-success' : 'text-warning'}`}>
                              {project.ndviGrowth.toFixed(1)}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-accent text-accent-foreground">
                            {project.carbonCredits || 0} BCC
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(project.lastUpdated).toLocaleDateString()}
                        </TableCell>
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <MintCreditsButton 
                            project={project} 
                            onSuccess={() => {
                              loadLocalData();
                              if (isConnected && account && isCorrectNetwork) {
                                loadBlockchainData();
                              }
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground py-4">
                        No active projects found. Approve applications to see projects here.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Applications Table */}
        <Card className="mt-6 bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle>Pending Applications</CardTitle>
            <CardDescription>Review and manage project applications</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>NGO/Organization</TableHead>
                  <TableHead>Project Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Area (ha)</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((application) => (
                  <TableRow key={application.id}>
                    <TableCell className="font-medium">{application.ngoName}</TableCell>
                    <TableCell>{application.projectName}</TableCell>
                    <TableCell>{application.location}</TableCell>
                    <TableCell>{application.area}</TableCell>
                    <TableCell>{new Date(application.submittedDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge 
                        className={
                          application.status === "pending" ? "bg-warning text-warning-foreground" :
                          application.status === "approved" ? "bg-success text-success-foreground" :
                          "bg-destructive text-destructive-foreground"
                        }
                      >
                        {application.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedApplication(application)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Review
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Application Review Modal */}
        <Dialog open={!!selectedApplication} onOpenChange={() => setSelectedApplication(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Review Application</DialogTitle>
              <DialogDescription>
                {selectedApplication?.projectName} by {selectedApplication?.ngoName}
              </DialogDescription>
            </DialogHeader>
            
            {selectedApplication && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Organization</label>
                    <p className="text-sm text-muted-foreground">{selectedApplication.ngoName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Location</label>
                    <p className="text-sm text-muted-foreground">{selectedApplication.location}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Area</label>
                    <p className="text-sm text-muted-foreground">{selectedApplication.area} hectares</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Submitted</label>
                    <p className="text-sm text-muted-foreground">
                      {new Date(selectedApplication.submittedDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Submitted Documents</label>
                  <div className="space-y-2">
                    {selectedApplication.documents.map((doc, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                        <FileText className="w-4 h-4 text-primary" />
                        <span className="text-sm">{doc}</span>
                        <Badge variant="outline" className="ml-auto text-xs">
                          Verified ✓
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button 
                    onClick={() => handleApproveApplication(selectedApplication.id)}
                    className="flex-1 bg-gradient-forest hover:glow-accent"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve Application
                  </Button>
                  <Button 
                    onClick={() => handleRejectApplication(selectedApplication.id)}
                    variant="destructive"
                    className="flex-1"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject Application
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default GovernmentDashboard;