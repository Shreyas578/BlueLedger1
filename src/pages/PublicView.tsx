import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { MapPin, Activity, Leaf, Coins, ExternalLink, TrendingUp, Users, Globe } from "lucide-react";
import beforeImage from "@/assets/before-restoration.jpg";
import afterImage from "@/assets/after-restoration.jpg";

const PublicView = () => {
  const publicProjects = [
    {
      id: "1",
      name: "Sundarbans Mangrove Restoration",
      organization: "Coastal Conservation Foundation",
      location: "West Bengal, India",
      area: 150,
      progress: 70,
      carbonCredits: 750,
      status: "Active",
      startDate: "2024-01-15"
    },
    {
      id: "2",
      name: "Konkan Coast Blue Carbon Project", 
      organization: "Marine Biodiversity Trust",
      location: "Maharashtra, India",
      area: 95,
      progress: 45,
      carbonCredits: 420,
      status: "Active",
      startDate: "2024-02-20"
    },
    {
      id: "3",
      name: "Chilika Lake Mangrove Restoration",
      organization: "Coastal Conservation Foundation", 
      location: "Odisha, India",
      area: 120,
      progress: 25,
      carbonCredits: 180,
      status: "Active",
      startDate: "2024-03-10"
    }
  ];

  const nationalStats = {
    totalProjects: 2145,
    totalArea: 890000,
    totalCredits: 1568000,
    restoredArea: 623000
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-hero text-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-6 text-accent border-accent bg-accent/10">
              <Globe className="w-4 h-4 mr-2" />
              Public Registry
            </Badge>
            <h1 className="text-5xl font-heading font-bold mb-6">
              Blue Carbon Registry
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Transparent tracking of coastal ecosystem restoration projects across India. 
              All data is verified on blockchain and publicly accessible.
            </p>
          </div>

          {/* National Stats */}
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-white/10 rounded-lg backdrop-blur">
              <div className="text-3xl font-bold mb-2">{nationalStats.totalProjects.toLocaleString()}</div>
              <div className="text-blue-100">Total Projects</div>
            </div>
            <div className="text-center p-6 bg-white/10 rounded-lg backdrop-blur">
              <div className="text-3xl font-bold mb-2">{(nationalStats.totalArea / 1000).toFixed(0)}K</div>
              <div className="text-blue-100">Hectares Registered</div>
            </div>
            <div className="text-center p-6 bg-white/10 rounded-lg backdrop-blur">
              <div className="text-3xl font-bold mb-2">{(nationalStats.totalCredits / 1000).toFixed(0)}K</div>
              <div className="text-blue-100">Carbon Credits</div>
            </div>
            <div className="text-center p-6 bg-white/10 rounded-lg backdrop-blur">
              <div className="text-3xl font-bold mb-2">{(nationalStats.restoredArea / 1000).toFixed(0)}K</div>
              <div className="text-blue-100">Hectares Restored</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Restoration Impact Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold mb-4">Restoration Impact</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              See the real environmental impact of our blue carbon restoration projects
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle>Before Restoration</CardTitle>
                <CardDescription>Degraded coastal ecosystem with sparse vegetation</CardDescription>
              </CardHeader>
              <CardContent>
                <img 
                  src={beforeImage} 
                  alt="Before restoration satellite imagery"
                  className="w-full h-64 object-cover rounded-lg mb-4"
                />
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">NDVI Value</div>
                    <div className="font-semibold text-destructive">0.1 - 0.2</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Vegetation Cover</div>
                    <div className="font-semibold text-destructive">15%</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle>After Restoration</CardTitle>
                <CardDescription>Thriving mangrove ecosystem with dense vegetation</CardDescription>
              </CardHeader>
              <CardContent>
                <img 
                  src={afterImage} 
                  alt="After restoration satellite imagery"
                  className="w-full h-64 object-cover rounded-lg mb-4"
                />
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">NDVI Value</div>
                    <div className="font-semibold text-success">0.6 - 0.8</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Vegetation Cover</div>
                    <div className="font-semibold text-success">85%</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Active Projects */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold mb-4">Active Projects</h2>
            <p className="text-muted-foreground">
              Explore verified blue carbon restoration projects across India
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {publicProjects.map((project) => (
              <Card key={project.id} className="bg-gradient-card border-border/50 hover:glow-primary transition-all duration-300">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                    <Badge className="bg-success text-success-foreground">
                      <Activity className="w-3 h-3 mr-1" />
                      {project.status}
                    </Badge>
                  </div>
                  <CardDescription className="flex items-center text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-1" />
                    {project.location}
                  </CardDescription>
                  <div className="text-sm text-muted-foreground">
                    by {project.organization}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Area</div>
                      <div className="font-semibold">{project.area} ha</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Started</div>
                      <div className="font-semibold">{new Date(project.startDate).toLocaleDateString()}</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Restoration Progress</span>
                      <span className="text-success font-medium">{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-success/10 rounded-lg">
                      <div className="text-lg font-bold text-success">{project.carbonCredits}</div>
                      <div className="text-xs text-muted-foreground">Carbon Credits</div>
                    </div>
                    <div className="text-center p-3 bg-primary/10 rounded-lg">
                      <div className="text-lg font-bold text-primary">{project.area}</div>
                      <div className="text-xs text-muted-foreground">Hectares</div>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View on Blockchain
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Technology Section */}
        <div className="text-center">
          <h2 className="text-3xl font-heading font-bold mb-8">Built on Blockchain</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-gradient-ocean rounded-full flex items-center justify-center mx-auto">
                <Activity className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold">Transparent Monitoring</h3>
              <p className="text-muted-foreground">
                All project data is recorded on blockchain for complete transparency and immutability
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-gradient-forest rounded-full flex items-center justify-center mx-auto">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold">Verified Progress</h3>
              <p className="text-muted-foreground">
                Satellite data and NDVI analysis provide accurate vegetation growth tracking
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-gradient-electric rounded-full flex items-center justify-center mx-auto">
                <Coins className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold">Carbon Credits</h3>
              <p className="text-muted-foreground">
                Automated carbon credit generation based on verified restoration milestones
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicView;