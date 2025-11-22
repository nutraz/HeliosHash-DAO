import { ethers } from 'ethers';
import HHUTokenABI from '../abi/HHUToken.json'; // Place ABI JSON here

const CONTRACT_ADDRESS = process.env.HHU_TOKEN_ADDRESS || '0xYourContractAddress';
const PROVIDER_URL = process.env.RPC_URL || 'https://rpc-mumbai.maticvigil.com';
const ADMIN_PRIVATE_KEY = process.env.ADMIN_PRIVATE_KEY || '';

const provider = new ethers.JsonRpcProvider(PROVIDER_URL);
const adminWallet = new ethers.Wallet(ADMIN_PRIVATE_KEY, provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS, HHUTokenABI, adminWallet);

export class HHUTokenService {
  // Mint HHU tokens to user
  async mint(to: string, amount: number) {
    return await contract.mint(to, amount);
  }

  // Burn HHU tokens from user
  async burn(from: string, amount: number) {
    return await contract.burn(from, amount);
  }

  // Request UPI withdrawal (user calls this)
  async requestWithdrawal(amount: number, upiId: string) {
    return await contract.requestWithdrawal(amount, upiId);
  }

  // Process withdrawal (admin calls this)
  async processWithdrawal(user: string) {
    return await contract.processWithdrawal(user);
  }

  // Get withdrawal request info
  async getWithdrawalRequest(user: string) {
    return await contract.withdrawalRequests(user);
  }

  // Get HHU balance
  async getBalance(address: string) {
    return await contract.balanceOf(address);
  }
}
