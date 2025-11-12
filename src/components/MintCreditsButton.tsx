import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Coins, TrendingUp, Leaf, AlertCircle, CheckCircle2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { contractService } from "@/services/contractService";
import { useWeb3 } from "@/hooks/useWeb3";

interface Project {
  id: string;
  projectName: string;
  location: string;
  area: number;
  ndviGrowth?: number;
  ndviCurrent?: number;
  ndviBaseline?: number;
  status: string;
  carbonCredits?: number;
}

interface MintCreditsButtonProps {
  project: Project;
  onSuccess?: () => void;
}

export const MintCreditsButton = ({ project, onSuccess }: MintCreditsButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [mintResult, setMintResult] = useState<{ txHash: string; amount: number } | null>(null);
  
  const { account, isConnected, isCorrectNetwork } = useWeb3();

  // Calculate NDVI growth and credits
  const ndviGrowth = project.ndviGrowth || 0;
  const meetsThreshold = ndviGrowth >= 10; // 10% minimum growth
  
  // Calculate carbon credits based on area and NDVI growth
  // Formula: Area (hectares) × NDVI Growth (%) × 5 (conversion factor)
  const calculatedCredits = Math.round(project.area * (ndviGrowth / 100) * 5);

  const handleMintCredits = async () => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!isCorrectNetwork) {
      toast.error("Please switch to Sepolia testnet");
      return;
    }

    if (!meetsThreshold) {
      toast.error("NDVI growth does not meet minimum threshold (10%)");
      return;
    }

    setIsMinting(true);

    try {
      // Mint carbon credits to government wallet
      const result = await contractService.mintCarbonCredits(
        account || "0x0000000000000000000000000000000000000000", // Project contract (using govt wallet for now)
        account!, // Recipient (government wallet)
        calculatedCredits,
        project.projectName,
        project.location,
        Date.now() // NDVI reading ID (timestamp for now)
      );

      setMintResult({
        txHash: result.txHash,
        amount: calculatedCredits
      });

      // Update local storage with timestamp
      const allProjects = JSON.parse(localStorage.getItem("ngo-projects") || "[]");
      const updatedProjects = allProjects.map((p: any) => 
        p.id === project.id 
          ? { 
              ...p, 
              carbonCredits: (p.carbonCredits || 0) + calculatedCredits,
              lastUpdated: new Date().toISOString(),
              lastMintAmount: calculatedCredits,
              lastMintDate: new Date().toISOString()
            }
          : p
      );
      localStorage.setItem("ngo-projects", JSON.stringify(updatedProjects));

      if (onSuccess) {
        onSuccess();
      }

      // Trigger a custom event for live updates
      window.dispatchEvent(new CustomEvent('creditsUpdated', { 
        detail: { projectId: project.id, amount: calculatedCredits } 
      }));

      toast.success(`Successfully minted ${calculatedCredits} carbon credits!`);
    } catch (error: any) {
      console.error("Minting error:", error);
      toast.error(`Failed to mint credits: ${error.message}`);
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        disabled={!meetsThreshold || !isConnected || !isCorrectNetwork}
        className="bg-gradient-ocean hover:glow-primary"
        size="sm"
      >
        <Coins className="w-4 h-4 mr-2" />
        Generate Credits
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Coins className="w-5 h-5 text-primary" />
              Generate Carbon Credits
            </DialogTitle>
            <DialogDescription>
              Review vegetation growth and mint carbon credits to government wallet
            </DialogDescription>
          </DialogHeader>

          {!mintResult ? (
            <div className="space-y-6">
              {/* Project Info */}
              <Card className="bg-gradient-card border-border/50">
                <CardContent className="pt-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Project Name</label>
                      <p className="text-sm font-semibold">{project.projectName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Location</label>
                      <p className="text-sm font-semibold">{project.location}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Area</label>
                      <p className="text-sm font-semibold">{project.area} hectares</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Status</label>
                      <Badge className="bg-success text-success-foreground">{project.status}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* NDVI Analysis */}
              <Card className="bg-gradient-card border-border/50">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Leaf className="w-5 h-5 text-success" />
                    <h3 className="font-semibold">Vegetation Growth Analysis</h3>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <div className="text-xs text-muted-foreground mb-1">Baseline NDVI</div>
                      <div className="text-lg font-bold">{(project.ndviBaseline || 0.34).toFixed(2)}</div>
                    </div>
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <div className="text-xs text-muted-foreground mb-1">Current NDVI</div>
                      <div className="text-lg font-bold text-success">{(project.ndviCurrent || 0.41).toFixed(2)}</div>
                    </div>
                    <div className="text-center p-3 bg-primary/10 rounded-lg">
                      <div className="text-xs text-muted-foreground mb-1">Growth</div>
                      <div className="text-lg font-bold text-primary flex items-center justify-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        {ndviGrowth.toFixed(1)}%
                      </div>
                    </div>
                  </div>

                  {meetsThreshold ? (
                    <div className="flex items-start gap-2 p-3 bg-success/10 border border-success/20 rounded-lg">
                      <CheckCircle2 className="w-5 h-5 text-success mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-success">Eligible for Carbon Credits</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          NDVI growth exceeds minimum threshold of 10%
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-2 p-3 bg-warning/10 border border-warning/20 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-warning mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-warning">Below Threshold</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          NDVI growth must be at least 10% to generate credits
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Credits Calculation */}
              <Card className="bg-gradient-card border-border/50">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Coins className="w-5 h-5 text-accent" />
                    <h3 className="font-semibold">Carbon Credits Calculation</h3>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Area (hectares)</span>
                      <span className="font-medium">{project.area}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">NDVI Growth (%)</span>
                      <span className="font-medium">{ndviGrowth.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Conversion Factor</span>
                      <span className="font-medium">5x</span>
                    </div>
                    <div className="border-t border-border pt-3 flex justify-between">
                      <span className="font-semibold">Total Credits to Mint</span>
                      <span className="text-2xl font-bold text-primary">{calculatedCredits} BCC</span>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-muted/30 rounded-lg">
                    <p className="text-xs text-muted-foreground">
                      <strong>Recipient:</strong> Government Wallet ({account?.slice(0, 6)}...{account?.slice(-4)})
                    </p>
                  </div>
                </CardContent>
              </Card>

              {!isConnected && (
                <div className="flex items-start gap-2 p-3 bg-warning/10 border border-warning/20 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-warning mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-warning">Wallet Not Connected</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Please connect your wallet to mint carbon credits
                    </p>
                  </div>
                </div>
              )}

              {isConnected && !isCorrectNetwork && (
                <div className="flex items-start gap-2 p-3 bg-warning/10 border border-warning/20 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-warning mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-warning">Wrong Network</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Please switch to Sepolia testnet in MetaMask
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-success" />
                </div>
                <h3 className="text-xl font-bold mb-2">Credits Minted Successfully!</h3>
                <p className="text-muted-foreground mb-4">
                  {mintResult.amount} carbon credits have been minted to your wallet
                </p>
                
                <Card className="bg-gradient-card border-border/50 max-w-md mx-auto">
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Amount Minted</span>
                        <span className="font-bold text-primary">{mintResult.amount} BCC</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Transaction</span>
                        <Button
                          variant="link"
                          size="sm"
                          className="h-auto p-0"
                          onClick={() => window.open(`https://sepolia.etherscan.io/tx/${mintResult.txHash}`, '_blank')}
                        >
                          <span className="font-mono text-xs">
                            {mintResult.txHash.slice(0, 6)}...{mintResult.txHash.slice(-4)}
                          </span>
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          <DialogFooter>
            {!mintResult ? (
              <>
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleMintCredits}
                  disabled={!meetsThreshold || isMinting || !isConnected || !isCorrectNetwork}
                  className="bg-gradient-ocean hover:glow-primary"
                >
                  {isMinting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Minting...
                    </>
                  ) : (
                    <>
                      <Coins className="w-4 h-4 mr-2" />
                      Mint {calculatedCredits} Credits
                    </>
                  )}
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsOpen(false)} className="w-full">
                Close
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
