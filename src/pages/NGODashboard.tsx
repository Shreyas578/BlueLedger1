import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Plus, FileText, MapPin, Activity, ExternalLink, Copy, CheckCircle, Clock, AlertCircle, Coins, Wallet } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { WalletConnect } from "@/components/Web3/WalletConnect";
import { useWeb3 } from "@/hooks/useWeb3";
import { contractService } from "@/services/contractService";

interface Project {
  id: string;
  name: string;
  status: "pending" | "verified" | "active";
  location: string;
  area: number;
  submittedDate: string;
  contractAddress?: string;
  progress?: number;
  carbonCredits?: number;
  userId?: string;
}

const NGODashboard = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tokenBalance, setTokenBalance] = useState<string>('0');
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const navigate = useNavigate();
  const { isConnected, account, isCorrectNetwork } = useWeb3();

  useEffect(() => {
    // Get current user (simulate user login)
    const currentUser = localStorage.getItem("currentUser") || "user1";
    localStorage.setItem("currentUser", currentUser);
    
    // Load projects from localStorage (user-specific)
    const savedProjects = localStorage.getItem("ngo-projects");
    if (savedProjects) {
      const allProjects = JSON.parse(savedProjects);
      // Filter projects for current user
      const userProjects = allProjects.filter((project: any) => project.userId === currentUser);
      setProjects(userProjects);
    } else {
      // Mock initial projects for demonstration
      const mockProjects: Project[] = [
        {
          id: "1",
          name: "Sundarbans Mangrove Restoration",
          status: "active",
          location: "West Bengal, India",
          area: 150,
          submittedDate: "2024-01-15",
          contractAddress: "0x742d35Cc6639C0532fAa56eb6d4c9F6",
          progress: 70,
          carbonCredits: 750,
          userId: "user1"
        },
        {
          id: "2", 
          name: "Konkan Coast Blue Carbon Project",
          status: "verified",
          location: "Maharashtra, India",
          area: 95,
          submittedDate: "2024-02-20",
          contractAddress: "0x8f3e2B1a9C4d5E6f7890A1B2C3D4E5F6",
          userId: "user1"
        }
      ];
      const userProjects = mockProjects.filter(project => project.userId === currentUser);
      setProjects(userProjects);
      localStorage.setItem("ngo-projects", JSON.stringify(mockProjects));
    }

    // Check for newly verified projects
    const pendingApplications = localStorage.getItem("pending-applications");
    if (pendingApplications) {
      const applications = JSON.parse(pendingApplications);
      const verifiedApplications = applications.filter((app: any) => 
        app.status === "approved" && app.userId === currentUser && !app.converted
      );
      
      if (verifiedApplications.length > 0) {
        const allProjects = JSON.parse(localStorage.getItem("ngo-projects") || "[]");
        verifiedApplications.forEach((app: any) => {
          const verifiedProject = {
            id: app.id,
            name: app.projectName,
            status: "verified" as const,
            location: app.location,
            area: app.area,
            submittedDate: app.submittedDate,
            contractAddress: `0x${Math.random().toString(16).substr(2, 40)}`,
            userId: app.userId
          };
          
          const existingProject = allProjects.find((p: any) => p.id === app.id);
          if (!existingProject) {
            allProjects.push(verifiedProject);
          }
          
          // Mark as converted
          app.converted = true;
        });
        
        localStorage.setItem("ngo-projects", JSON.stringify(allProjects));
        localStorage.setItem("pending-applications", JSON.stringify(applications));
        
        // Refresh user projects
        const userProjects = allProjects.filter((project: any) => project.userId === currentUser);
        setProjects(userProjects);
      }
    }

    // Load blockchain data if wallet is connected
    if (isConnected && account && isCorrectNetwork) {
      loadBlockchainData();
    }
  }, [isConnected, account, isCorrectNetwork]);

  const loadBlockchainData = async () => {
    if (!account) return;
    
    try {
      // Check if user is registered on blockchain
      const registered = await contractService.isUserRegistered(account);
      setIsRegistered(registered);
      
      // Get token balance
      const balance = await contractService.getTokenBalance(account);
      setTokenBalance(balance);
      
    } catch (error) {
      console.error('Error loading blockchain data:', error);
    }
  };

  const handleRegisterOnBlockchain = async () => {
    if (!account) {
      toast.error('Please connect your wallet first');
      return;
    }
    
    try {
      await contractService.registerUser(0, 'NGO Organization'); // 0 = NGO type
      setIsRegistered(true);
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-warning text-warning-foreground";
      case "verified": return "bg-accent text-accent-foreground";
      case "active": return "bg-success text-success-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <Clock className="w-4 h-4" />;
      case "verified": return <CheckCircle className="w-4 h-4" />;
      case "active": return <Activity className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const handleAcceptProject = (projectId: string) => {
    const currentUser = localStorage.getItem("currentUser") || "user1";
    const allProjects = JSON.parse(localStorage.getItem("ngo-projects") || "[]");
    
    const updatedProjects = allProjects.map((project: any) => {
      if (project.id === projectId && project.userId === currentUser) {
        // Calculate estimated carbon credits based on area
        const estimatedCredits = Math.round(project.area * 5); // 5 credits per hectare as base rate
        return { 
          ...project, 
          status: "active" as const, 
          progress: 0, 
          carbonCredits: estimatedCredits,
          estimatedTotalCredits: Math.round(project.area * 15) // Total potential credits
        };
      }
      return project;
    });
    
    localStorage.setItem("ngo-projects", JSON.stringify(updatedProjects));
    
    // Update local state
    const userProjects = updatedProjects.filter((project: any) => project.userId === currentUser);
    setProjects(userProjects);
    
    toast.success("Project accepted! Smart contract deployed and carbon credits estimated.");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Contract address copied to clipboard!");
  };

  if (projects.length === 0) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gradient-ocean rounded-full flex items-center justify-center mx-auto mb-6">
              <Plus className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-heading font-bold mb-4">Welcome to NGO Portal</h1>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Start your blue carbon journey by submitting your first project application.
            </p>
            <Button 
              onClick={() => navigate("/project-form")}
              className="bg-gradient-ocean hover:glow-primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Apply for a Project
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-heading font-bold">NGO Dashboard</h1>
            <p className="text-muted-foreground">Manage your blue carbon restoration projects</p>
          </div>
          <Button 
            onClick={() => navigate("/project-form")}
            className="bg-gradient-ocean hover:glow-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Apply for New Project
          </Button>
        </div>

        {/* Blockchain Integration Section */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <WalletConnect />
          </div>
          
          {isConnected && isCorrectNetwork && (
            <Card className="bg-gradient-card border-border/50 hover:glow-primary transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Coins className="w-5 h-5 text-accent" />
                  Carbon Credits
                </CardTitle>
                <CardDescription>Your blockchain assets</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 bg-accent/10 rounded-lg">
                  <div className="text-3xl font-bold text-accent">{parseFloat(tokenBalance).toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground">BCC Tokens</div>
                </div>
                
                {!isRegistered && (
                  <Button 
                    onClick={handleRegisterOnBlockchain}
                    className="w-full bg-gradient-forest hover:glow-accent"
                  >
                    <Wallet className="w-4 h-4 mr-2" />
                    Register on Blockchain
                  </Button>
                )}
                
                {isRegistered && (
                  <Badge className="w-full justify-center bg-success text-success-foreground">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Registered on Blockchain
                  </Badge>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Projects Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="bg-gradient-card border-border/50 hover:glow-primary transition-all duration-300">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-xl">{project.name}</CardTitle>
                  <Badge className={getStatusColor(project.status)}>
                    {getStatusIcon(project.status)}
                    <span className="ml-1 capitalize">{project.status}</span>
                  </Badge>
                </div>
                <CardDescription className="flex items-center text-muted-foreground">
                  <MapPin className="w-4 h-4 mr-1" />
                  {project.location} • {project.area} hectares
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  Submitted: {new Date(project.submittedDate).toLocaleDateString()}
                </div>

                {project.contractAddress && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Project Contract</label>
                    <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-md">
                      <code className="text-sm text-accent flex-1">
                        {project.contractAddress}
                      </code>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => copyToClipboard(project.contractAddress!)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {project.status === "active" && (
                  <>
                    <Separator />
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Restoration Progress</span>
                          <span className="text-primary font-medium">{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-success/10 rounded-lg">
                          <div className="text-2xl font-bold text-success">{project.carbonCredits}</div>
                          <div className="text-xs text-muted-foreground">Carbon Credits Earned</div>
                          <div className="text-xs text-accent mt-1">
                            Est. Total: {Math.round(project.area * 15)} CC
                          </div>
                        </div>
                        <div className="text-center p-3 bg-primary/10 rounded-lg">
                          <div className="text-2xl font-bold text-primary">{project.area}</div>
                          <div className="text-xs text-muted-foreground">Hectares</div>
                          <div className="text-xs text-success mt-1">
                            Rate: ~{Math.round((project.carbonCredits || 0) / project.area * 10) / 10} CC/ha
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <Separator />
                
                <div className="flex gap-2">
                  {project.status === "verified" && (
                    <Button 
                      onClick={() => handleAcceptProject(project.id)}
                      className="flex-1 bg-gradient-forest hover:glow-accent"
                    >
                      Accept Project & Deploy Contract
                    </Button>
                  )}
                  
                  {project.status === "active" && (
                    <>
                      <Button 
                        onClick={() => navigate(`/project-monitoring/${project.id}`)}
                        variant="outline"
                        className="flex-1"
                      >
                        <Activity className="w-4 h-4 mr-2" />
                        Basic Monitoring
                      </Button>
                      <Button 
                        onClick={() => navigate(`/blockchain-monitoring/${project.id}`)}
                        className="flex-1 bg-gradient-electric hover:glow-accent"
                      >
                        <Coins className="w-4 h-4 mr-2" />
                        Blockchain View
                      </Button>
                    </>
                  )}
                  
                  <Button variant="outline" size="sm">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NGODashboard;