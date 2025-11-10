import 'package:flutter/material.dart';
import 'package:helioshash_dao/l10n/app_localizations.dart';
import 'package:provider/provider.dart';

import '../providers/language_provider.dart';
import '../providers/theme_provider.dart';

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final LanguageProvider langProvider = Provider.of<LanguageProvider>(context);
    final ThemeProvider themeProvider = Provider.of<ThemeProvider>(context);
    final l10n = AppLocalizations.of(context);

    return Scaffold(
      appBar: AppBar(title: Text(l10n.settings)),
      body: ListView(
        children: <dynamic>[
          // --- Theme Selection Tile (NEW SECTION) ---
          ListTile(
            title: const Text('Dark Mode'),
            trailing: DropdownButton<ThemeMode>(
              value: themeProvider.themeMode,
              onChanged: (ThemeMode? newValue) {
                if (newValue != null) {
                  themeProvider.setThemeMode(newValue);
                }
              },
              items: const <dynamic>[
                DropdownMenuItem(value: ThemeMode.system, child: Text('System Default')),
                DropdownMenuItem(value: ThemeMode.light, child: Text('Light')),
                DropdownMenuItem(value: ThemeMode.dark, child: Text('Dark')),
              ],
            ),
          ),
          // --- Language Selection Tile (EXISTING) ---
          ListTile(
            title: Text(l10n.language),
            trailing: DropdownButton<String>(
              value: langProvider.currentLocale.languageCode,
              onChanged: (String? newValue) {
                if (newValue != null) {
                  langProvider.setLocale(Locale(newValue, ''));
                }
              },
              items: const <dynamic>[
                DropdownMenuItem(value: 'en', child: Text('English')),
                DropdownMenuItem(value: 'hi', child: Text('हिन्दी')),
              ],
            ),
          ),
          const ListTile(title: Text('Notification Preferences'), subtitle: Text('Coming Soon')),
          const ListTile(title: Text('About'), subtitle: Text('Version 1.0.0')),
        ],
      ),
    );
  }
}
