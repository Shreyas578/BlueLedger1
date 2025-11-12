import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  ShoppingCart, 
  Coins, 
  TrendingUp, 
  MapPin, 
  Calendar, 
  Leaf,
  ExternalLink,
  Filter,
  Search,
  Star
} from "lucide-react";
import { toast } from "sonner";
import { WalletConnect } from "@/components/Web3/WalletConnect";
import { useWeb3 } from "@/hooks/useWeb3";
import { contractService } from "@/services/contractService";

interface CreditListing {
  id: string;
  projectName: string;
  location: string;
  plantSpecies: string;
  creditsAvailable: number;
  pricePerCredit: number;
  vintage: string;
  verificationStandard: string;
  projectImage: string;
  rating: number;
  totalCredits: number;
  contractAddress: string;
}

const CarbonMarketplace = () => {
  const [listings, setListings] = useState<CreditListing[]>([]);
  const [selectedListing, setSelectedListing] = useState<CreditListing | null>(null);
  const [purchaseAmount, setPurchaseAmount] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterLocation, setFilterLocation] = useState<string>('all');
  
  const { isConnected, account, isCorrectNetwork } = useWeb3();

  useEffect(() => {
    loadMarketplaceData();
  }, []);

  const loadMarketplaceData = () => {
    // Mock marketplace data
    const mockListings: CreditListing[] = [
      {
        id: 'listing-001',
        projectName: 'Sundarbans Mangrove Restoration',
        location: 'West Bengal, India',
        plantSpecies: 'Sundari, Gewa, Keora',
        creditsAvailable: 500,
        pricePerCredit: 25,
        vintage: '2024',
        verificationStandard: 'VCS + CCB',
        projectImage: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400',
        rating: 4.8,
        totalCredits: 1250,
        contractAddress: '0x742d35Cc6639C0532fAa56eb6d4c9F6789012345'
      },
      {
        id: 'listing-002',
        projectName: 'Kerala Backwater Blue Carbon Project',
        location: 'Kerala, India',
        plantSpecies: 'Rhizophora, Avicennia',
        creditsAvailable: 320,
        pricePerCredit: 28,
        vintage: '2024',
        verificationStandard: 'Gold Standard',
        projectImage: 'https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=400',
        rating: 4.9,
        totalCredits: 890,
        contractAddress: '0x8f3e2B1a9C4d5E6f7890A1B2C3D4E5F6789abcde'
      },
      {
        id: 'listing-003',
        projectName: 'Odisha Coastal Restoration',
        location: 'Odisha, India',
        plantSpecies: 'Mangrove Mixed Species',
        creditsAvailable: 750,
        pricePerCredit: 22,
        vintage: '2023',
        verificationStandard: 'VCS',
        projectImage: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400',
        rating: 4.7,
        totalCredits: 2100,
        contractAddress: '0x3456789012345678901234567890123456789012'
      },
      {
        id: 'listing-004',
        projectName: 'Gujarat Salt Marsh Restoration',
        location: 'Gujarat, India',
        plantSpecies: 'Salicornia, Suaeda',
        creditsAvailable: 200,
        pricePerCredit: 20,
        vintage: '2024',
        verificationStandard: 'CDM',
        projectImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
        rating: 4.5,
        totalCredits: 450,
        contractAddress: '0x9876543210987654321098765432109876543210'
      }
    ];
    
    setListings(mockListings);
  };

  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         listing.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = filterLocation === 'all' || listing.location.includes(filterLocation);
    return matchesSearch && matchesLocation;
  });

  const handlePurchase = async () => {
    if (!isConnected || !account) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!selectedListing) return;

    try {
      const totalCost = purchaseAmount * selectedListing.pricePerCredit;
      
      // Simulate purchase transaction
      toast.success(`Purchase initiated! ${purchaseAmount} credits for $${totalCost}`);
      
      // Update available credits
      const updatedListings = listings.map(listing => 
        listing.id === selectedListing.id 
          ? { ...listing, creditsAvailable: listing.creditsAvailable - purchaseAmount }
          : listing
      );
      setListings(updatedListings);
      setSelectedListing(null);
      setPurchaseAmount(1);
      
    } catch (error) {
      console.error('Purchase error:', error);
      toast.error('Purchase failed. Please try again.');
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold mb-2">Carbon Credit Marketplace</h1>
          <p className="text-muted-foreground">Trade verified blue carbon credits from restoration projects</p>
        </div>

        {/* Wallet Connection */}
        {!isConnected && (
          <Card className="mb-8 bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle>Connect Your Wallet</CardTitle>
              <CardDescription>Connect to purchase carbon credits</CardDescription>
            </CardHeader>
            <CardContent>
              <WalletConnect />
            </CardContent>
          </Card>
        )}

        {/* Market Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-card border-border/50 hover:glow-primary transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Credits Available</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {listings.reduce((sum, listing) => sum + listing.creditsAvailable, 0).toLocaleString()}
              </div>
              <div className="text-xs text-success">+5% this week</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50 hover:glow-primary transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Average Price</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">
                ${(listings.reduce((sum, listing) => sum + listing.pricePerCredit, 0) / listings.length).toFixed(0)}
              </div>
              <div className="text-xs text-success">per credit</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50 hover:glow-primary transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">{listings.length}</div>
              <div className="text-xs text-success">All verified</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50 hover:glow-primary transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Market Volume</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-highlight">$2.4M</div>
              <div className="text-xs text-success">+12% this month</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6 bg-gradient-card border-border/50">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex-1 min-w-64">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search projects or locations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <select
                  value={filterLocation}
                  onChange={(e) => setFilterLocation(e.target.value)}
                  className="px-3 py-2 bg-background border border-border rounded-md text-sm"
                >
                  <option value="all">All Locations</option>
                  <option value="West Bengal">West Bengal</option>
                  <option value="Kerala">Kerala</option>
                  <option value="Odisha">Odisha</option>
                  <option value="Gujarat">Gujarat</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Marketplace Listings */}
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredListings.map((listing) => (
            <Card key={listing.id} className="bg-gradient-card border-border/50 hover:glow-primary transition-all duration-300 overflow-hidden">
              <div className="aspect-video relative overflow-hidden">
                <img
                  src={listing.projectImage}
                  alt={listing.projectName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  <Badge className="bg-success text-success-foreground">
                    {listing.verificationStandard}
                  </Badge>
                </div>
              </div>
              
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-lg line-clamp-2">{listing.projectName}</CardTitle>
                  <div className="flex items-center gap-1">
                    {renderStars(listing.rating)}
                    <span className="text-sm text-muted-foreground ml-1">{listing.rating}</span>
                  </div>
                </div>
                <CardDescription className="flex items-center text-muted-foreground">
                  <MapPin className="w-4 h-4 mr-1" />
                  {listing.location}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Species:</span>
                    <p className="font-medium line-clamp-2">{listing.plantSpecies}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Vintage:</span>
                    <p className="font-medium">{listing.vintage}</p>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-2xl font-bold text-primary">${listing.pricePerCredit}</div>
                    <div className="text-xs text-muted-foreground">per credit</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-accent">{listing.creditsAvailable}</div>
                    <div className="text-xs text-muted-foreground">available</div>
                  </div>
                </div>

                <Button
                  onClick={() => setSelectedListing(listing)}
                  disabled={!isConnected || listing.creditsAvailable === 0}
                  className="w-full bg-gradient-ocean hover:glow-primary"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {listing.creditsAvailable === 0 ? 'Sold Out' : 'Purchase Credits'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Purchase Modal */}
        <Dialog open={!!selectedListing} onOpenChange={() => setSelectedListing(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Purchase Carbon Credits</DialogTitle>
              <DialogDescription>
                {selectedListing?.projectName}
              </DialogDescription>
            </DialogHeader>
            
            {selectedListing && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label>Location</Label>
                    <p className="text-muted-foreground">{selectedListing.location}</p>
                  </div>
                  <div>
                    <Label>Price per Credit</Label>
                    <p className="text-primary font-bold">${selectedListing.pricePerCredit}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Number of Credits</Label>
                  <Input
                    id="amount"
                    type="number"
                    min="1"
                    max={selectedListing.creditsAvailable}
                    value={purchaseAmount}
                    onChange={(e) => setPurchaseAmount(Number(e.target.value))}
                  />
                  <p className="text-xs text-muted-foreground">
                    Available: {selectedListing.creditsAvailable} credits
                  </p>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span>Subtotal:</span>
                    <span>${(purchaseAmount * selectedListing.pricePerCredit).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span>Platform Fee (2%):</span>
                    <span>${(purchaseAmount * selectedListing.pricePerCredit * 0.02).toFixed(2)}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between items-center font-bold">
                    <span>Total:</span>
                    <span>${(purchaseAmount * selectedListing.pricePerCredit * 1.02).toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedListing(null)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handlePurchase}
                    disabled={!isConnected || purchaseAmount > selectedListing.creditsAvailable}
                    className="flex-1 bg-gradient-forest hover:glow-accent"
                  >
                    <Coins className="w-4 h-4 mr-2" />
                    Purchase
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

export default CarbonMarketplace;