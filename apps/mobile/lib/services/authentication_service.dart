// import 'package:flutter_secure_storage/flutter_secure_storage.dart'; // TODO: Re-enable for mobile only
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

// Conditional import: mobile implementation uses native WebView, web uses a stub.
// The mobile file imports `webview_flutter`, so keep that plugin out of web builds.
import 'webview_auth_mobile.dart' if (dart.library.html) 'webview_auth_web.dart';

class AuthenticationService {
  static const String _iiUrl = 'https://identity.ic0.app';

  /// Starts an Internet Identity authentication flow.
  ///
  /// On web this returns a mock token (WebView isn't available on Flutter web).
  /// On mobile it pushes `WebViewAuthScreen` (defined in the conditional import)
  /// and returns the delegation token when the flow completes.
  Future<String?> authenticateWithII(BuildContext context) async {
    if (kIsWeb) {
      await showDialog<void>(
        context: context,
        builder: (BuildContext context) => AlertDialog(
          title: const Text('Web Login'),
          content: const Text(
            'WebView-based login is not supported on web. Returning a mock token for development.',
          ),
          actions: <dynamic>[
            TextButton(onPressed: () => Navigator.of(context).pop(), child: const Text('OK')),
          ],
        ),
      );

      const String mockToken = 'mock_web_token';
      final SharedPreferences prefs = await SharedPreferences.getInstance();
      await prefs.setString('auth_token', mockToken);
      return mockToken;
    }

    try {
      final result = await Navigator.push<dynamic>(
        context,
        MaterialPageRoute(builder: (_) => const WebViewAuthScreen()),
      );

      if (result != null && result is String) {
        // Use secure storage for mobile, SharedPreferences for web
        if (kIsWeb) {
          final SharedPreferences prefs = await SharedPreferences.getInstance();
          await prefs.setString('auth_token', result);
          // } else {
          //   const storage = FlutterSecureStorage();
          //   await storage.write(key: 'auth_token', value: result);
          // }
          return result;
        }
      }
      return null;
    } catch (e) {
      debugPrint('Authentication error: $e');
      return null;
    }
  }

  Future<String?> getAuthToken() async {
    if (kIsWeb) {
      final SharedPreferences prefs = await SharedPreferences.getInstance();
      return prefs.getString('auth_token');
    } else {
      // const storage = FlutterSecureStorage();
      // return await storage.read(key: 'auth_token');
      return null; // Stub for web build
    }
  }

  Future<void> logout() async {
    if (kIsWeb) {
      final SharedPreferences prefs = await SharedPreferences.getInstance();
      await prefs.remove('auth_token');
    } else {
      // const storage = FlutterSecureStorage();
      // await storage.delete(key: 'auth_token');
      return; // Stub for web build
    }
  }
}
