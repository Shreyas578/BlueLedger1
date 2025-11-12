// Environment configuration
export const ENV = {
  // Backend API
  BACKEND_URL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001',
  
  // Web3 Configuration
  WALLETCONNECT_PROJECT_ID: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || '',
  
  // Contract Addresses
  REGISTRY_CONTRACT_ADDRESS: import.meta.env.VITE_REGISTRY_CONTRACT_ADDRESS || '',
  CARBON_TOKEN_ADDRESS: import.meta.env.VITE_CARBON_TOKEN_ADDRESS || '',
  
  // Network Configuration
  CHAIN_ID: parseInt(import.meta.env.VITE_CHAIN_ID || '11155111'), // Sepolia by default
  
  // Development flags
  IS_DEVELOPMENT: import.meta.env.DEV,
  IS_PRODUCTION: import.meta.env.PROD,
} as const