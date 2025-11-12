import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { toast } from 'sonner';

interface Web3State {
  isConnected: boolean;
  account: string | null;
  chainId: number | null;
  balance: string | null;
  isCorrectNetwork: boolean;
}

const SEPOLIA_CHAIN_ID = 11155111;
const SEPOLIA_CONFIG = {
  chainId: `0x${SEPOLIA_CHAIN_ID.toString(16)}`,
  chainName: 'Sepolia',
  nativeCurrency: {
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: ['https://rpc.sepolia.org'],
  blockExplorerUrls: ['https://sepolia.etherscan.io'],
};

export const useWeb3 = () => {
  const [web3State, setWeb3State] = useState<Web3State>({
    isConnected: false,
    account: null,
    chainId: null,
    balance: null,
    isCorrectNetwork: false,
  });

  const [isConnecting, setIsConnecting] = useState(false);

  // Check if MetaMask is installed
  const isMetaMaskInstalled = useCallback(() => {
    return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
  }, []);

  // Get current account and network info
  const updateWeb3State = useCallback(async () => {
    if (!isMetaMaskInstalled()) return;

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.listAccounts();
      
      if (accounts.length > 0) {
        const account = accounts[0].address;
        const network = await provider.getNetwork();
        const balance = await provider.getBalance(account);
        
        setWeb3State({
          isConnected: true,
          account,
          chainId: Number(network.chainId),
          balance: ethers.formatEther(balance),
          isCorrectNetwork: Number(network.chainId) === SEPOLIA_CHAIN_ID,
        });
      } else {
        setWeb3State({
          isConnected: false,
          account: null,
          chainId: null,
          balance: null,
          isCorrectNetwork: false,
        });
      }
    } catch (error) {
      console.error('Error updating Web3 state:', error);
    }
  }, [isMetaMaskInstalled]);

  // Connect wallet
  const connectWallet = useCallback(async () => {
    if (!isMetaMaskInstalled()) {
      toast.error('MetaMask is not installed. Please install MetaMask to continue.');
      window.open('https://metamask.io/download/', '_blank');
      return;
    }

    setIsConnecting(true);
    
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      await updateWeb3State();
      toast.success('Wallet connected successfully!');
    } catch (error: any) {
      console.error('Error connecting wallet:', error);
      if (error.code === 4001) {
        toast.error('Connection rejected by user');
      } else {
        toast.error('Failed to connect wallet');
      }
    } finally {
      setIsConnecting(false);
    }
  }, [isMetaMaskInstalled, updateWeb3State]);

  // Disconnect wallet
  const disconnectWallet = useCallback(() => {
    setWeb3State({
      isConnected: false,
      account: null,
      chainId: null,
      balance: null,
      isCorrectNetwork: false,
    });
    toast.success('Wallet disconnected');
  }, []);

  // Switch to Sepolia network
  const switchToSepolia = useCallback(async () => {
    if (!isMetaMaskInstalled()) return;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: SEPOLIA_CONFIG.chainId }],
      });
    } catch (error: any) {
      // If network doesn't exist, add it
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [SEPOLIA_CONFIG],
          });
        } catch (addError) {
          console.error('Error adding Sepolia network:', addError);
          toast.error('Failed to add Sepolia network');
        }
      } else {
        console.error('Error switching to Sepolia:', error);
        toast.error('Failed to switch to Sepolia network');
      }
    }
  }, [isMetaMaskInstalled]);

  // Listen for account and network changes
  useEffect(() => {
    if (!isMetaMaskInstalled()) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else {
        updateWeb3State();
      }
    };

    const handleChainChanged = () => {
      updateWeb3State();
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    // Initial state update
    updateWeb3State();

    return () => {
      if (window.ethereum.removeListener) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, [isMetaMaskInstalled, updateWeb3State, disconnectWallet]);

  return {
    ...web3State,
    isConnecting,
    isMetaMaskInstalled: isMetaMaskInstalled(),
    connectWallet,
    disconnectWallet,
    switchToSepolia,
  };
};