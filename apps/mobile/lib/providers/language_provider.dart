import 'package:flutter/material.dart';

class LanguageProvider with ChangeNotifier {
  Locale _currentLocale = const Locale('en', '');

  Locale get currentLocale => _currentLocale;

  void setLocale(Locale newLocale) {
    if (_currentLocale != newLocale) {
      _currentLocale = newLocale;
      notifyListeners();
    }
  }
}
