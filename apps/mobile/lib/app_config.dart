import 'package:flutter/foundation.dart' show kReleaseMode;

class AppConfig {
  // Backend Configuration
  static String get backendUrl => const String.fromEnvironment(
    'BACKEND_URL',
    defaultValue: kReleaseMode ? 'https://api.helioshash-dao.com' : 'http://localhost:3000'
  );

  // Canister Configuration
  static String get canisterId => const String.fromEnvironment(
    'CANISTER_ID',
    defaultValue: 'rrkah-fqaaa-aaaaa-aaaaq-cai'
  );

  // ICP Network Configuration
  static String get icpNetwork => const String.fromEnvironment(
    'ICP_NETWORK',
    defaultValue: kReleaseMode ? 'https://ic0.app' : 'http://127.0.0.1:4943'
  );

  // Certificate Pinning (for production)
  static List<String> get certificatePins {
    if (kReleaseMode) {
      return <String>[
        // Add actual certificate pins for production
        // 'sha256/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA='
      ];
    }
    return <String>[];
  }

  // Security Configuration
  static bool get enableCertificatePinning => kReleaseMode;
  static const int connectionTimeoutSeconds = 30;
  static const int maxRetries = 3;

  // Feature Flags
  static const bool enableBiometricAuth = true;
  static const bool enableOfflineMode = true;
  static const bool enablePushNotifications = true;

  // Validation
  static bool get isValidConfiguration {
    return backendUrl.isNotEmpty &&
           canisterId.isNotEmpty &&
           icpNetwork.isNotEmpty;
  }
}