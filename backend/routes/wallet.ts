import express from 'express';
import { HHUTokenService } from '../services/hhuTokenService';
import { walletService } from '../services/walletService';

const hhuTokenService = new HHUTokenService();
const router = express.Router();

// Create custodial wallet for user
router.post('/create', async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: 'Missing userId' });
    const wallet = await walletService.createCustodialWallet(userId);
    await hhuTokenService.mint(wallet.address, 1000);
    res.json({ success: true, wallet });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// Setup social recovery
router.post('/social-recovery', async (req, res) => {
  try {
    const { walletId, confidants } = req.body;
    if (!walletId || !Array.isArray(confidants)) return res.status(400).json({ error: 'Missing walletId or confidants' });
    await walletService.setupSocialRecovery(walletId, confidants);
    res.json({ success: true });
  } catch (err) {
  res.status(500).json({ error: (err as Error).message });
  }
});

// Process UPI withdrawal
router.post('/withdraw', async (req, res) => {
  try {
    const { walletId, amount, upiId } = req.body;
    if (!walletId || !amount || !upiId) return res.status(400).json({ error: 'Missing walletId, amount, or upiId' });
    const wallet = await walletService.getWalletById(walletId);
    if (!wallet) return res.status(404).json({ error: 'Wallet not found' });
    await hhuTokenService.requestWithdrawal(amount, upiId);
    const tx = await walletService.processWithdrawal(walletId, amount, upiId);
    res.json({ success: true, transaction: tx });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router;
