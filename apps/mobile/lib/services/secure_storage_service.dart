import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class SecureStorageService {
  static const String _authTokenKey = 'auth_token';
  static final _storage = FlutterSecureStorage();

  static Future<void> setAuthToken(String token) async {
    await _storage.write(key: _authTokenKey, value: token);
  }

  static Future<String?> getAuthToken() async {
    return await _storage.read(key: _authTokenKey);
  }

  static Future<void> removeAuthToken() async {
    await _storage.delete(key: _authTokenKey);
  }
}
