import 'package:flutter/material.dart';

class CacheService extends ChangeNotifier {
  final Map<String, dynamic> _cache = {};

  T? get<T>(String key) => _cache[key] as T?;

  void set<T>(String key, T value) {
    _cache[key] = value;
    notifyListeners();
  }

  void clear(String key) {
    _cache.remove(key);
    notifyListeners();
  }

  void clearAll() {
    _cache.clear();
    notifyListeners();
  }
}
