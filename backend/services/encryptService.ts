import crypto from 'crypto';

export async function encryptPrivateKey(privateKey: string): Promise<string> {
  // Simple AES encryption for demo purposes
  const masterKey = process.env.MASTER_KEY || 'helioshash_master_key_demo';
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(masterKey, 'utf8').slice(0, 32), iv);
  let encrypted = cipher.update(privateKey, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}
