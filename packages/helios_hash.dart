class HeliosHash {
  static String generateHash(String input) {
    return "helios_hash_$input";
  }
  
  static bool verifyHash(String hash) {
    return hash.startsWith("helios_hash_");
  }
}
