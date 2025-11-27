export class HeliosHash {
  static generateHash(input: string): string {
    return `helios_hash_${input}`;
  }
  
  static verifyHash(hash: string): boolean {
    return hash.startsWith("helios_hash_");
  }
}
