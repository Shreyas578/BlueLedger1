import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Copy, ExternalLink, TrendingUp, Leaf, Activity, Coins, Calendar, Hash } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import CarbonCreditsCalculator from "@/components/CarbonCreditsCalculator";

interface NDVIData {
  date: string;
  ndvi: number;
  formatted: string;
}

interface Transaction {
  id: string;
  date: string;
  type: string;
  description: string;
  hash: string;
  amount?: number;
}

interface ProjectData {
  id: string;
  name: string;
  contractAddress: string;
  location: string;
  area: number;
  progress: number;
  carbonCredits: number;
  status: string;
}

const ProjectMonitoring = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<ProjectData | null>(null);
  const [ndviData, setNdviData] = useState<NDVIData[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    // Load project data
    const savedProjects = localStorage.getItem("ngo-projects");
    if (savedProjects) {
      const projects = JSON.parse(savedProjects);
      const currentProject = projects.find((p: any) => p.id === projectId);
      if (currentProject) {
        setProject({
          id: currentProject.id,
          name: currentProject.name,
          contractAddress: currentProject.contractAddress || "0x742d35Cc6639C0532fAa56eb6d4c9F6",
          location: currentProject.location,
          area: currentProject.area || 150,
          progress: currentProject.progress || 70,
          carbonCredits: currentProject.carbonCredits || 750,
          status: currentProject.status
        });
      }
    }

    // Mock NDVI data
    const mockNdviData: NDVIData[] = [
      { date: '2024-01-01', ndvi: 0.1, formatted: 'Jan 2024' },
      { date: '2024-02-01', ndvi: 0.15, formatted: 'Feb 2024' },
      { date: '2024-03-01', ndvi: 0.22, formatted: 'Mar 2024' },
      { date: '2024-04-01', ndvi: 0.31, formatted: 'Apr 2024' },
      { date: '2024-05-01', ndvi: 0.42, formatted: 'May 2024' },
      { date: '2024-06-01', ndvi: 0.55, formatted: 'Jun 2024' },
      { date: '2024-07-01', ndvi: 0.63, formatted: 'Jul 2024' },
      { date: '2024-08-01', ndvi: 0.68, formatted: 'Aug 2024' },
      { date: '2024-09-01', ndvi: 0.72, formatted: 'Sep 2024' }
    ];
    setNdviData(mockNdviData);

    // Mock transaction data
    const mockTransactions: Transaction[] = [
      {
        id: "1",
        date: "2024-09-20",
        type: "Application",
        description: "Application Submitted",
        hash: "0x8a7b9c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7890",
        amount: 0
      },
      {
        id: "2", 
        date: "2024-09-22",
        type: "Verification",
        description: "Project Verified by Government",
        hash: "0x1a2b3c4d5e6f7890a1b2c3d4e5f67890a1b2c3d4",
        amount: 0
      },
      {
        id: "3",
        date: "2024-09-23",
        type: "Contract",
        description: "Smart Contract Deployed",
        hash: "0x2b3c4d5e6f7890a1b2c3d4e5f67890a1b2c3d4e5",
        amount: 0
      },
      {
        id: "4",
        date: "2024-09-25",
        type: "Credits",
        description: "Carbon Credits Minted",
        hash: "0x3c4d5e6f7890a1b2c3d4e5f67890a1b2c3d4e5f6",
        amount: 750
      }
    ];
    setTransactions(mockTransactions);
  }, [projectId]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const openEtherscan = (hash: string) => {
    window.open(`https://sepolia.etherscan.io/tx/${hash}`, '_blank');
  };

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Project Not Found</h2>
          <Button onClick={() => navigate("/ngo-dashboard")}>
            Return to Dashboard
          </Button>
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
            variant="outline" 
            onClick={() => navigate("/ngo-dashboard")}
            className="hover:glow-primary"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-heading font-bold">{project.name}</h1>
            <p className="text-muted-foreground">{project.location}</p>
          </div>
          <Badge className="bg-success text-success-foreground">
            <Activity className="w-4 h-4 mr-1" />
            Active Project
          </Badge>
        </div>

        {/* Project ID Card */}
        <Card className="mb-8 bg-gradient-card border-border/50 hover:glow-primary transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hash className="w-5 h-5 text-primary" />
              Project Contract Address
            </CardTitle>
            <CardDescription>Smart contract deployed on Sepolia testnet</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
              <code className="text-accent font-mono flex-1 text-sm">
                {project.contractAddress}
              </code>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => copyToClipboard(project.contractAddress)}
                className="hover:glow-accent"
              >
                <Copy className="w-4 h-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => openEtherscan(project.contractAddress)}
                className="hover:glow-accent"
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* NDVI Chart */}
          <Card className="lg:col-span-2 bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-success" />
                Vegetation Growth (NDVI Analysis)
              </CardTitle>
              <CardDescription>Satellite-based vegetation monitoring over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={ndviData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="formatted" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      domain={[0, 1]}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--popover))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        color: 'hsl(var(--popover-foreground))'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="ndvi" 
                      stroke="hsl(var(--success))" 
                      strokeWidth={3}
                      dot={{ fill: 'hsl(var(--success))', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: 'hsl(var(--success))', strokeWidth: 2 }}
                      className="chart-line"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="space-y-6">
            <Card className="bg-gradient-card border-border/50 hover:glow-primary transition-all duration-300">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-muted-foreground">Restoration Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-success">{project.progress}%</span>
                    <Leaf className="w-6 h-6 text-success" />
                  </div>
                  <Progress value={project.progress} className="h-3" />
                  <div className="text-xs text-muted-foreground">
                    Target: 100% by Dec 2024
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border/50 hover:glow-primary transition-all duration-300 particle-effect">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-muted-foreground">Carbon Credits Generated</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-highlight">{project.carbonCredits}</span>
                    <Coins className="w-6 h-6 text-highlight" />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    +{Math.round(project.area * 0.8)} CC this month
                  </div>
                  <div className="text-xs text-success">
                    ↗ +{Math.round(((project.carbonCredits || 0) / (project.area * 12)) * 100)}% of potential
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border/50 hover:glow-primary transition-all duration-300">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-muted-foreground">Project Area</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-primary">{project.area}</span>
                    <span className="text-sm text-muted-foreground">hectares</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Coastal mangrove ecosystem
                  </div>
                  <div className="text-xs text-accent mt-1">
                    ~{Math.round(project.area * 12)} tons CO₂/year potential
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Carbon Credits Calculator */}
        <CarbonCreditsCalculator
          area={project.area}
          progress={project.progress}
          currentCredits={project.carbonCredits}
          vegetation="mangrove"
        />

        {/* Project Ledger */}
        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-accent" />
              Project Ledger
            </CardTitle>
            <CardDescription>All blockchain transactions for this project</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="space-y-2">
              {transactions.map((transaction, index) => (
                <AccordionItem 
                  key={transaction.id} 
                  value={transaction.id}
                  className="border border-border/50 rounded-lg px-4"
                >
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center justify-between w-full mr-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-primary">{index + 1}</span>
                        </div>
                        <div className="text-left">
                          <div className="font-medium">{transaction.description}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-2">
                            <Calendar className="w-3 h-3" />
                            {new Date(transaction.date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {transaction.type}
                        </Badge>
                        {transaction.amount && transaction.amount > 0 && (
                          <Badge className="bg-highlight text-highlight-foreground text-xs">
                            +{transaction.amount} CC
                          </Badge>
                        )}
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4">
                    <Separator className="mb-4" />
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Transaction Hash</label>
                        <div className="flex items-center gap-2 mt-1">
                          <code className="text-xs text-accent bg-muted/50 p-2 rounded flex-1">
                            {transaction.hash}
                          </code>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => copyToClipboard(transaction.hash)}
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => openEtherscan(transaction.hash)}
                          >
                            <ExternalLink className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      {transaction.amount && transaction.amount > 0 && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Amount</label>
                          <div className="text-lg font-bold text-highlight mt-1">
                            {transaction.amount} Carbon Credits
                          </div>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProjectMonitoring;