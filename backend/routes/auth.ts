import express from 'express';
import { KYCStatus } from '../../shared/types';
import { generateAuthToken } from '../services/authService';
import { generateOTP, verifyOTP } from '../services/otpService';
import { createUser, getUserByPhone, sanitizeUser } from '../services/userService';

const router = express.Router();

router.post('/send-otp', async (req, res) => {
  try {
    const { phone } = req.body;
    // Validate phone format
    if (!phone.match(/^[6-9]\d{9}$/)) {
      return res.status(400).json({ error: 'Invalid phone number format' });
    }
    const otp = await generateOTP(phone);
    // In production, integrate with SMS service like MSG91, Twilio
    console.log(`OTP for ${phone}: ${otp}`); // Remove in production
    res.json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

router.post('/verify-otp', async (req, res) => {
  try {
    const { phone, otp } = req.body;
    const isValid = await verifyOTP(phone, otp);
    if (!isValid) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }
    // Create or get user
    let user = await getUserByPhone(phone);
    if (!user) {
      user = await createUser({
        phone,
        roles: [], // To be set in next step
        kycStatus: KYCStatus.PENDING
      });
    }
    // Generate session token
    const token = generateAuthToken(user.id);
    res.json({
      success: true,
      user: sanitizeUser(user),
      token
    });
  } catch (error) {
    res.status(500).json({ error: 'Verification failed' });
  }
});

export default router;
