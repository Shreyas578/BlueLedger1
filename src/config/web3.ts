import { createConfig, http } from 'wagmi'
import { sepolia, mainnet } from 'wagmi/chains'
import { metaMask, walletConnect } from 'wagmi/connectors'

// Web3Modal project ID - you'll need to get this from https://cloud.walletconnect.com
const projectId = process.env.VITE_WALLETCONNECT_PROJECT_ID || 'your_project_id_here'

export const config = createConfig({
  chains: [sepolia, mainnet],
  connectors: [
    metaMask(),
    walletConnect({ projectId }),
  ],
  transports: {
    [sepolia.id]: http(),
    [mainnet.id]: http(),
  },
})

// Contract addresses (will be populated after deployment)
export const CONTRACT_ADDRESSES = {
  REGISTRY: process.env.VITE_REGISTRY_CONTRACT_ADDRESS || '',
  CARBON_TOKEN: process.env.VITE_CARBON_TOKEN_ADDRESS || '',
  // Project contracts are deployed dynamically
} as const

// Sepolia testnet configuration
export const SEPOLIA_CONFIG = {
  chainId: 11155111,
  name: 'Sepolia',
  currency: 'ETH',
  explorerUrl: 'https://sepolia.etherscan.io',
  rpcUrl: 'https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
}