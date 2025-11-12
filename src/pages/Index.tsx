import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Leaf, Shield, BarChart3, Users, Building, Eye, Wallet } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { WalletConnect } from "@/components/Web3/WalletConnect";
import heroImage from "@/assets/hero-bg.jpg";

const Index = () => {
  const [selectedPortal, setSelectedPortal] = useState<string | null>(null);
  const navigate = useNavigate();

  const portals = [
    {
      id: "ngo",
      title: "NGO & Panchayat Portal",
      description: "Submit applications, monitor projects, and track restoration progress",
      icon: Users,
      route: "/ngo-dashboard",
      features: ["Project Applications", "Land Annotation", "MRV Monitoring", "Carbon Credits Tracking"]
    },
    {
      id: "government",
      title: "Government & NCCR Portal", 
      description: "Verify applications, manage projects, and mint carbon credits",
      icon: Building,
      route: "/government-dashboard",
      features: ["Application Review", "Project Verification", "Credit Minting", "National Overview"]
    },

    {
      id: "public",
      title: "Public View Portal",
      description: "Explore public registry data and project transparency",
      icon: Eye,
      route: "/public-view",
      features: ["Project Registry", "Transparency Data", "Impact Statistics", "Public Reports"]
    }
  ];

  const handlePortalSelect = (portal: any) => {
    setSelectedPortal(portal.id);
    setTimeout(() => {
      navigate(portal.route);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div 
        className="relative h-screen flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-background/40" />
        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <Badge variant="outline" className="mb-6 text-accent border-accent glow-accent">
            Blockchain-Powered Blue Carbon Registry
          </Badge>
          <h1 className="text-6xl font-heading font-bold mb-6 text-foreground">
            Blue Carbon
            <span className="block text-transparent bg-gradient-ocean bg-clip-text">
              MRV System
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Advanced monitoring, reporting, and verification system for coastal ecosystem restoration 
            using blockchain technology and satellite data analysis.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Badge variant="secondary" className="px-4 py-2">
              <Leaf className="w-4 h-4 mr-2" />
              Ecosystem Restoration
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              <Shield className="w-4 h-4 mr-2" />
              Blockchain Verified
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              <BarChart3 className="w-4 h-4 mr-2" />
              Real-time Monitoring
            </Badge>
          </div>
        </div>
        
        {/* Floating elements */}
        <div className="absolute inset-0 particle-effect opacity-30" />
      </div>

      {/* Wallet Connection Section */}
      <div className="py-12 px-6 bg-muted/20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-heading font-bold mb-4">
              Connect to Blockchain
            </h2>
            <p className="text-lg text-muted-foreground">
              Connect your MetaMask wallet to access blockchain features and interact with smart contracts
            </p>
          </div>
          <div className="max-w-md mx-auto">
            <WalletConnect />
          </div>
        </div>
      </div>

      {/* Portal Selection */}
      <div className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold mb-4">
              Choose Your Portal
            </h2>
            <p className="text-xl text-muted-foreground">
              Access the blue carbon registry through your designated portal
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {portals.map((portal) => {
              const Icon = portal.icon;
              const isSelected = selectedPortal === portal.id;
              
              return (
                <Card 
                  key={portal.id}
                  className={`group cursor-pointer transition-all duration-500 hover-scale bg-gradient-card border-border/50
                    ${isSelected ? 'glow-primary scale-105' : 'hover:glow-primary hover:border-primary/50'}
                  `}
                  onClick={() => handlePortalSelect(portal)}
                >
                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto mb-4 p-4 bg-primary/10 rounded-full w-fit group-hover:bg-primary/20 transition-colors">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="text-xl font-heading">{portal.title}</CardTitle>
                    <CardDescription className="text-base">{portal.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {portal.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm text-muted-foreground">
                          <div className="w-2 h-2 bg-accent rounded-full mr-3" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className="w-full bg-gradient-ocean hover:glow-primary transition-all duration-300"
                      disabled={isSelected}
                    >
                      {isSelected ? "Loading..." : "Enter Portal"}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Features Overview */}
      <div className="py-20 px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-heading font-bold mb-8">
            Powered by Advanced Technology
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-gradient-ocean rounded-full flex items-center justify-center mx-auto">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold">Blockchain Security</h3>
              <p className="text-muted-foreground">
                Immutable records on Sepolia testnet ensure data integrity and transparency
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-gradient-forest rounded-full flex items-center justify-center mx-auto">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold">Satellite Monitoring</h3>
              <p className="text-muted-foreground">
                NDVI analysis and satellite imagery for accurate vegetation tracking
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-gradient-electric rounded-full flex items-center justify-center mx-auto">
                <Leaf className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold">Carbon Credits</h3>
              <p className="text-muted-foreground">
                Automated carbon credit generation based on verified restoration progress
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;