import { ethers } from 'ethers';
import { create } from 'zustand';
import { apiRequest } from './queryClient';

interface Web3State {
  account: string | null;
  isConnecting: boolean;
  isConnected: boolean;
  error: string | null;
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  getChainId: () => Promise<number | null>;
  getBalance: () => Promise<string | null>;
}

interface ChessGameContract {
  address: string;
  abi: any[];
}

const CHESS_GAME_CONTRACT: ChessGameContract = {
  address: '0x7C3...B2E1', // This would be the actual deployed contract address
  abi: [
    // Basic ABI for interaction with the ChessGame contract
    'function createGame(uint256 wagerAmount, uint256 timeControl) external payable returns (uint256)',
    'function joinGame(uint256 gameId) external payable',
    'function makeMove(uint256 gameId, string memory move) external',
    'function resignGame(uint256 gameId) external',
    'function offerDraw(uint256 gameId) external',
    'function acceptDraw(uint256 gameId) external',
    'function claimVictoryByTime(uint256 gameId) external',
    'function getGameState(uint256 gameId) external view returns (uint8, address, address, uint256, string memory, bool, bool)'
  ]
};

export const useWeb3Store = create<Web3State>((set, get) => ({
  account: null,
  isConnecting: false,
  isConnected: false,
  error: null,
  provider: null,
  signer: null,

  connect: async () => {
    set({ isConnecting: true, error: null });
    
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed. Please install MetaMask to use this feature.');
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      
      if (accounts.length === 0) {
        throw new Error('No accounts found. Please connect to MetaMask.');
      }

      const signer = await provider.getSigner();
      
      // Register the user in the backend
      await apiRequest('POST', '/api/users/register', {
        address: accounts[0]
      });

      set({
        account: accounts[0],
        isConnecting: false,
        isConnected: true,
        provider,
        signer
      });
    } catch (error) {
      console.error('Error connecting wallet:', error);
      set({
        isConnecting: false,
        error: error instanceof Error ? error.message : 'Failed to connect wallet',
      });
    }
  },

  disconnect: () => {
    set({
      account: null,
      isConnected: false,
      provider: null,
      signer: null,
    });
  },

  getChainId: async () => {
    const { provider } = get();
    if (!provider) return null;
    
    try {
      const network = await provider.getNetwork();
      return Number(network.chainId);
    } catch (error) {
      console.error('Error getting chain ID:', error);
      return null;
    }
  },

  getBalance: async () => {
    const { provider, account } = get();
    if (!provider || !account) return null;
    
    try {
      const balance = await provider.getBalance(account);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('Error getting balance:', error);
      return null;
    }
  }
}));

export async function createGame(wagerAmount: string, timeControl: number): Promise<number | null> {
  const { signer } = useWeb3Store.getState();
  
  if (!signer) {
    throw new Error('No wallet connected');
  }

  try {
    const contract = new ethers.Contract(CHESS_GAME_CONTRACT.address, CHESS_GAME_CONTRACT.abi, signer);
    const wagerInWei = ethers.parseEther(wagerAmount);
    
    const tx = await contract.createGame(wagerInWei, timeControl, {
      value: wagerInWei
    });
    
    const receipt = await tx.wait();
    const event = receipt.events.find((e: any) => e.event === 'GameCreated');
    
    if (event) {
      return Number(event.args.gameId);
    }
    
    return null;
  } catch (error) {
    console.error('Error creating game:', error);
    throw error;
  }
}

export async function joinGame(gameId: number, wagerAmount: string): Promise<boolean> {
  const { signer } = useWeb3Store.getState();
  
  if (!signer) {
    throw new Error('No wallet connected');
  }

  try {
    const contract = new ethers.Contract(CHESS_GAME_CONTRACT.address, CHESS_GAME_CONTRACT.abi, signer);
    const wagerInWei = ethers.parseEther(wagerAmount);
    
    const tx = await contract.joinGame(gameId, {
      value: wagerInWei
    });
    
    await tx.wait();
    return true;
  } catch (error) {
    console.error('Error joining game:', error);
    throw error;
  }
}

export async function makeMove(gameId: number, move: string): Promise<boolean> {
  const { signer } = useWeb3Store.getState();
  
  if (!signer) {
    throw new Error('No wallet connected');
  }

  try {
    const contract = new ethers.Contract(CHESS_GAME_CONTRACT.address, CHESS_GAME_CONTRACT.abi, signer);
    
    const tx = await contract.makeMove(gameId, move);
    await tx.wait();
    
    return true;
  } catch (error) {
    console.error('Error making move:', error);
    throw error;
  }
}

export async function resignGame(gameId: number): Promise<boolean> {
  const { signer } = useWeb3Store.getState();
  
  if (!signer) {
    throw new Error('No wallet connected');
  }

  try {
    const contract = new ethers.Contract(CHESS_GAME_CONTRACT.address, CHESS_GAME_CONTRACT.abi, signer);
    
    const tx = await contract.resignGame(gameId);
    await tx.wait();
    
    return true;
  } catch (error) {
    console.error('Error resigning game:', error);
    throw error;
  }
}

export async function offerDraw(gameId: number): Promise<boolean> {
  const { signer } = useWeb3Store.getState();
  
  if (!signer) {
    throw new Error('No wallet connected');
  }

  try {
    const contract = new ethers.Contract(CHESS_GAME_CONTRACT.address, CHESS_GAME_CONTRACT.abi, signer);
    
    const tx = await contract.offerDraw(gameId);
    await tx.wait();
    
    return true;
  } catch (error) {
    console.error('Error offering draw:', error);
    throw error;
  }
}

export async function acceptDraw(gameId: number): Promise<boolean> {
  const { signer } = useWeb3Store.getState();
  
  if (!signer) {
    throw new Error('No wallet connected');
  }

  try {
    const contract = new ethers.Contract(CHESS_GAME_CONTRACT.address, CHESS_GAME_CONTRACT.abi, signer);
    
    const tx = await contract.acceptDraw(gameId);
    await tx.wait();
    
    return true;
  } catch (error) {
    console.error('Error accepting draw:', error);
    throw error;
  }
}

declare global {
  interface Window {
    ethereum?: any;
  }
}
