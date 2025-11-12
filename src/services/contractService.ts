import { ethers } from 'ethers';
import { toast } from 'sonner';

// Contract addresses from deployment
const CONTRACT_ADDRESSES = {
  REGISTRY: '0x046BD349B6F8aC89a49176f1eaa85bc2eF1B6043',
  CARBON_TOKEN: '0xED7a9D61091CBFB927aAe5B897d7aebb81E633D7',
};

// Simplified ABIs for the contracts
const REGISTRY_ABI = [
  'function registerUser(uint8 userType, string memory organizationName) external',
  'function submitApplication(string memory organizationName, string memory documentHash, string memory landCoordinates, uint256 areaHectares, string memory plantSpecies) external',
  'function updateApplicationStatus(uint256 applicationId, uint8 newStatus, string memory comments) external',
  'function getApplication(uint256 applicationId) external view returns (tuple(uint256 id, address applicant, uint8 userType, string organizationName, string documentHash, string landCoordinates, uint256 areaHectares, string plantSpecies, uint8 status, uint256 submissionTimestamp, uint256 reviewTimestamp, address reviewer, string reviewComments, address projectContractAddress))',
  'function getUserApplications(address user) external view returns (uint256[] memory)',
  'function getTotalApplications() external view returns (uint256)',
  'function isUserRegistered(address user) external view returns (bool)',
  'event ApplicationSubmitted(uint256 indexed applicationId, address indexed applicant, uint8 userType, string organizationName)',
  'event ApplicationStatusUpdated(uint256 indexed applicationId, uint8 oldStatus, uint8 newStatus, address indexed reviewer)'
];

const TOKEN_ABI = [
  'function name() external view returns (string)',
  'function symbol() external view returns (string)',
  'function balanceOf(address account) external view returns (uint256)',
  'function totalSupply() external view returns (uint256)',
  'function mintCredits(address projectContract, address recipient, uint256 amount, string memory projectName, string memory landCoordinates, uint256 ndviReadingId) external',
  'function retireCredits(uint256 batchId, uint256 amount, string memory reason) external',
  'function getUserBatches(address user) external view returns (uint256[] memory)',
  'function getCreditBatch(uint256 batchId) external view returns (tuple(uint256 batchId, address projectContract, uint256 amount, uint256 mintTimestamp, string projectName, string landCoordinates, uint256 ndviReadingId, bool retired))',
  'event CreditsMinted(uint256 indexed batchId, address indexed projectContract, address indexed recipient, uint256 amount, string projectName)'
];

export interface Application {
  id: number;
  applicant: string;
  userType: number;
  organizationName: string;
  documentHash: string;
  landCoordinates: string;
  areaHectares: number;
  plantSpecies: string;
  status: number;
  submissionTimestamp: number;
  reviewTimestamp: number;
  reviewer: string;
  reviewComments: string;
  projectContractAddress: string;
}

export interface CreditBatch {
  batchId: number;
  projectContract: string;
  amount: number;
  mintTimestamp: number;
  projectName: string;
  landCoordinates: string;
  ndviReadingId: number;
  retired: boolean;
}

class ContractService {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.Signer | null = null;
  private registryContract: ethers.Contract | null = null;
  private tokenContract: ethers.Contract | null = null;

  async initialize() {
    try {
      if (typeof window.ethereum === 'undefined') {
        throw new Error('MetaMask not found. Please install MetaMask to continue.');
      }

      console.log('Initializing contract service...');
      
      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.signer = await this.provider.getSigner();
      
      console.log('Signer address:', await this.signer.getAddress());
      
      this.registryContract = new ethers.Contract(
        CONTRACT_ADDRESSES.REGISTRY,
        REGISTRY_ABI,
        this.signer
      );
      
      this.tokenContract = new ethers.Contract(
        CONTRACT_ADDRESSES.CARBON_TOKEN,
        TOKEN_ABI,
        this.signer
      );
      
      console.log('Contracts initialized successfully');
      console.log('Registry:', CONTRACT_ADDRESSES.REGISTRY);
      console.log('Token:', CONTRACT_ADDRESSES.CARBON_TOKEN);
    } catch (error: any) {
      console.error('Initialization error:', error);
      throw new Error(`Failed to initialize contracts: ${error.message}`);
    }
  }

  // Registry Contract Methods
  async registerUser(userType: number, organizationName: string) {
    if (!this.registryContract) await this.initialize();
    
    try {
      const tx = await this.registryContract!.registerUser(userType, organizationName);
      toast.success('Registration transaction sent! Waiting for confirmation...');
      
      const receipt = await tx.wait();
      toast.success('User registered successfully on blockchain!');
      return receipt;
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(`Registration failed: ${error.message}`);
      throw error;
    }
  }

  async submitApplication(
    organizationName: string,
    documentHash: string,
    landCoordinates: string,
    areaHectares: number,
    plantSpecies: string
  ) {
    if (!this.registryContract) await this.initialize();
    
    try {
      const tx = await this.registryContract!.submitApplication(
        organizationName,
        documentHash,
        landCoordinates,
        areaHectares,
        plantSpecies
      );
      
      toast.success('Application submitted to blockchain! Waiting for confirmation...');
      
      const receipt = await tx.wait();
      
      // Extract application ID from events
      const event = receipt.logs.find((log: any) => {
        try {
          const parsed = this.registryContract!.interface.parseLog(log);
          return parsed?.name === 'ApplicationSubmitted';
        } catch {
          return false;
        }
      });
      
      let applicationId = null;
      if (event) {
        const parsed = this.registryContract!.interface.parseLog(event);
        applicationId = parsed?.args[0];
      }
      
      toast.success('Application submitted successfully to blockchain!');
      return { receipt, applicationId };
    } catch (error: any) {
      console.error('Application submission error:', error);
      toast.error(`Application submission failed: ${error.message}`);
      throw error;
    }
  }

  async updateApplicationStatus(applicationId: number, newStatus: number, comments: string) {
    if (!this.registryContract) await this.initialize();
    
    try {
      const tx = await this.registryContract!.updateApplicationStatus(
        applicationId,
        newStatus,
        comments
      );
      
      toast.success('Status update sent to blockchain! Waiting for confirmation...');
      
      const receipt = await tx.wait();
      toast.success('Application status updated on blockchain!');
      return receipt;
    } catch (error: any) {
      console.error('Status update error:', error);
      toast.error(`Status update failed: ${error.message}`);
      throw error;
    }
  }

  async getApplication(applicationId: number): Promise<Application> {
    if (!this.registryContract) await this.initialize();
    
    try {
      const result = await this.registryContract!.getApplication(applicationId);
      return {
        id: Number(result[0]),
        applicant: result[1],
        userType: Number(result[2]),
        organizationName: result[3],
        documentHash: result[4],
        landCoordinates: result[5],
        areaHectares: Number(result[6]),
        plantSpecies: result[7],
        status: Number(result[8]),
        submissionTimestamp: Number(result[9]),
        reviewTimestamp: Number(result[10]),
        reviewer: result[11],
        reviewComments: result[12],
        projectContractAddress: result[13],
      };
    } catch (error: any) {
      console.error('Get application error:', error);
      throw error;
    }
  }

  async getUserApplications(userAddress: string): Promise<number[]> {
    if (!this.registryContract) await this.initialize();
    
    try {
      const result = await this.registryContract!.getUserApplications(userAddress);
      return result.map((id: any) => Number(id));
    } catch (error: any) {
      console.error('Get user applications error:', error);
      throw error;
    }
  }

  async isUserRegistered(userAddress: string): Promise<boolean> {
    if (!this.registryContract) await this.initialize();
    
    try {
      return await this.registryContract!.isUserRegistered(userAddress);
    } catch (error: any) {
      console.error('Check registration error:', error);
      return false;
    }
  }

  async getTotalApplications(): Promise<number> {
    if (!this.registryContract) await this.initialize();
    
    try {
      const result = await this.registryContract!.getTotalApplications();
      return Number(result);
    } catch (error: any) {
      console.error('Get total applications error:', error);
      return 0;
    }
  }

  // Token Contract Methods
  async getTokenInfo() {
    if (!this.tokenContract) await this.initialize();
    
    try {
      const [name, symbol, totalSupply] = await Promise.all([
        this.tokenContract!.name(),
        this.tokenContract!.symbol(),
        this.tokenContract!.totalSupply(),
      ]);
      
      return {
        name,
        symbol,
        totalSupply: ethers.formatEther(totalSupply),
      };
    } catch (error: any) {
      console.error('Get token info error:', error);
      throw error;
    }
  }

  async getTokenBalance(userAddress: string): Promise<string> {
    if (!this.tokenContract) await this.initialize();
    
    try {
      const balance = await this.tokenContract!.balanceOf(userAddress);
      return ethers.formatEther(balance);
    } catch (error: any) {
      console.error('Get token balance error:', error);
      return '0';
    }
  }

  async getUserCreditBatches(userAddress: string): Promise<number[]> {
    if (!this.tokenContract) await this.initialize();
    
    try {
      const result = await this.tokenContract!.getUserBatches(userAddress);
      return result.map((id: any) => Number(id));
    } catch (error: any) {
      console.error('Get user batches error:', error);
      return [];
    }
  }

  async getCreditBatch(batchId: number): Promise<CreditBatch> {
    if (!this.tokenContract) await this.initialize();
    
    try {
      const result = await this.tokenContract!.getCreditBatch(batchId);
      return {
        batchId: Number(result[0]),
        projectContract: result[1],
        amount: Number(ethers.formatEther(result[2])),
        mintTimestamp: Number(result[3]),
        projectName: result[4],
        landCoordinates: result[5],
        ndviReadingId: Number(result[6]),
        retired: result[7],
      };
    } catch (error: any) {
      console.error('Get credit batch error:', error);
      throw error;
    }
  }

  async mintCarbonCredits(
    projectContract: string,
    recipient: string,
    amount: number,
    projectName: string,
    landCoordinates: string,
    ndviReadingId: number
  ) {
    try {
      // Ensure initialization
      if (!this.tokenContract) {
        await this.initialize();
      }
      
      // Double check after initialization
      if (!this.tokenContract) {
        throw new Error('Failed to initialize token contract');
      }
      
      // Convert amount to wei (18 decimals)
      const amountInWei = ethers.parseEther(amount.toString());
      
      console.log('Minting credits with params:', {
        projectContract,
        recipient,
        amount: amountInWei.toString(),
        projectName,
        landCoordinates,
        ndviReadingId
      });
      
      const tx = await this.tokenContract.mintCredits(
        projectContract,
        recipient,
        amountInWei,
        projectName,
        landCoordinates,
        ndviReadingId
      );
      
      toast.success('Minting carbon credits... Waiting for blockchain confirmation...');
      
      const receipt = await tx.wait();
      
      // Extract batch ID from events
      const event = receipt.logs.find((log: any) => {
        try {
          const parsed = this.tokenContract!.interface.parseLog(log);
          return parsed?.name === 'CreditsMinted';
        } catch {
          return false;
        }
      });
      
      let batchId = null;
      if (event) {
        const parsed = this.tokenContract!.interface.parseLog(event);
        batchId = parsed?.args[0];
      }
      
      toast.success(`✅ ${amount} carbon credits minted successfully!`);
      return { receipt, batchId, txHash: receipt.hash };
    } catch (error: any) {
      console.error('Mint credits error:', error);
      toast.error(`Minting failed: ${error.message || error.reason || 'Unknown error'}`);
      throw error;
    }
  }

  async retireCarbonCredits(batchId: number, amount: number, reason: string) {
    try {
      if (!this.tokenContract) {
        await this.initialize();
      }
      
      if (!this.tokenContract) {
        throw new Error('Failed to initialize token contract');
      }
      
      const amountInWei = ethers.parseEther(amount.toString());
      
      const tx = await this.tokenContract.retireCredits(batchId, amountInWei, reason);
      
      toast.success('Retiring carbon credits... Waiting for confirmation...');
      
      const receipt = await tx.wait();
      toast.success(`✅ ${amount} carbon credits retired successfully!`);
      return receipt;
    } catch (error: any) {
      console.error('Retire credits error:', error);
      toast.error(`Retirement failed: ${error.message || error.reason || 'Unknown error'}`);
      throw error;
    }
  }

  // Utility Methods
  getExplorerUrl(txHash: string): string {
    return `https://sepolia.etherscan.io/tx/${txHash}`;
  }

  getAddressUrl(address: string): string {
    return `https://sepolia.etherscan.io/address/${address}`;
  }
}

export const contractService = new ContractService();