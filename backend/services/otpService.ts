// Simple in-memory OTP store for demo purposes
const otpStore: Record<string, string> = {};

export async function generateOTP(phone: string): Promise<string> {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[phone] = otp;
  // TODO: Integrate with SMS provider in production
  return otp;
}

export async function verifyOTP(phone: string, otp: string): Promise<boolean> {
  return otpStore[phone] === otp;
}
