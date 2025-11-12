import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Wallet, ExternalLink, Copy, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import { useWeb3 } from '@/hooks/useWeb3';
import { toast } from 'sonner';

interface WalletConnectProps {
  className?: string;
}

export const WalletConnect = ({ className }: WalletConnectProps) => {
  const {
    isConnected,
    account,
    balance,
    chainId,
    isCorrectNetwork,
    isConnecting,
    isMetaMaskInstalled,
    connectWallet,
    disconnectWallet,
    switchToSepolia,
  } = useWeb3();

  const [showDetails, setShowDetails] = useState(false);

  const copyAddress = () => {
    if (account) {
      navigator.clipboard.writeText(account);
      toast.success('Address copied to clipboard!');
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const openEtherscan = () => {
    if (account) {
      window.open(`https://sepolia.etherscan.io/address/${account}`, '_blank');
    }
  };

  if (!isMetaMaskInstalled) {
    return (
      <Card className={`bg-gradient-card border-border/50 ${className}`}>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-4 bg-warning/10 rounded-full w-fit">
            <AlertTriangle className="w-8 h-8 text-warning" />
          </div>
          <CardTitle>MetaMask Required</CardTitle>
          <CardDescription>
            You need MetaMask to interact with the blockchain
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button
            onClick={() => window.open('https://metamask.io/download/', '_blank')}
            className="bg-gradient-ocean hover:glow-primary"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Install MetaMask
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!isConnected) {
    return (
      <Card className={`bg-gradient-card border-border/50 hover:glow-primary transition-all duration-300 ${className}`}>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-4 bg-primary/10 rounded-full w-fit">
            <Wallet className="w-8 h-8 text-primary" />
          </div>
          <CardTitle>Connect Your Wallet</CardTitle>
          <CardDescription>
            Connect to MetaMask to access blockchain features
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button
            onClick={connectWallet}
            disabled={isConnecting}
            className="bg-gradient-ocean hover:glow-primary"
          >
            {isConnecting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Wallet className="w-4 h-4 mr-2" />
                Connect Wallet
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className={`bg-gradient-card border-border/50 hover:glow-primary transition-all duration-300 ${className}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-success/10 rounded-full">
                <CheckCircle className="w-5 h-5 text-success" />
              </div>
              <div>
                <CardTitle className="text-lg">Wallet Connected</CardTitle>
                <CardDescription className="text-sm">
                  {formatAddress(account!)}
                </CardDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDetails(true)}
            >
              Details
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isCorrectNetwork && (
            <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-warning" />
                <span className="text-sm font-medium text-warning">Wrong Network</span>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                Please switch to Sepolia testnet to use blockchain features
              </p>
              <Button
                size="sm"
                onClick={switchToSepolia}
                className="bg-gradient-forest hover:glow-accent"
              >
                Switch to Sepolia
              </Button>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Balance</span>
            <div className="text-right">
              <div className="font-medium">{parseFloat(balance!).toFixed(4)} ETH</div>
              <div className="text-xs text-muted-foreground">
                {isCorrectNetwork ? 'Sepolia Testnet' : `Chain ID: ${chainId}`}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={copyAddress}
              className="flex-1"
            >
              <Copy className="w-4 h-4 mr-1" />
              Copy
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={openEtherscan}
              className="flex-1"
            >
              <ExternalLink className="w-4 h-4 mr-1" />
              Explorer
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Wallet Details Modal */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-primary" />
              Wallet Details
            </DialogTitle>
            <DialogDescription>
              Your connected wallet information
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">Wallet Address</label>
                <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-md mt-1">
                  <code className="text-sm text-accent flex-1 break-all">
                    {account}
                  </code>
                  <Button variant="ghost" size="sm" onClick={copyAddress}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Balance</label>
                  <div className="text-lg font-bold text-primary mt-1">
                    {parseFloat(balance!).toFixed(4)} ETH
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Network</label>
                  <div className="mt-1">
                    <Badge className={isCorrectNetwork ? 'bg-success text-success-foreground' : 'bg-warning text-warning-foreground'}>
                      {isCorrectNetwork ? 'Sepolia' : `Chain ${chainId}`}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={openEtherscan}
                className="flex-1"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View on Explorer
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  disconnectWallet();
                  setShowDetails(false);
                }}
                className="flex-1"
              >
                Disconnect
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};