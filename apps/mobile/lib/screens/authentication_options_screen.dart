import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:helioshash_dao/l10n/app_localizations.dart';
import 'package:helioshash_dao/providers/language_provider.dart';
import 'package:provider/provider.dart';

class AuthenticationOptionsScreen extends StatelessWidget {
  const AuthenticationOptionsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context);
    final languageProvider = Provider.of<LanguageProvider>(context);
    final String selectedLanguage = languageProvider.currentLocale.languageCode;

    return Scaffold(
      appBar: AppBar(
        // No leading logo, only on right
        title: const Text('Authentication Options'),
        centerTitle: true,
        actions: <dynamic>[
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: SvgPicture.asset(
              'assets/icons/hhdaologo.svg',
              height: 32,
              width: 32,
              fit: BoxFit.contain,
              placeholderBuilder: (context) => const Icon(Icons.broken_image, color: Colors.white),
            ),
          ),
        ],
      ),
      body: Center(
        child: SingleChildScrollView(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: <dynamic>[
              SvgPicture.asset(
                'assets/icons/hhdaologo.svg',
                height: 120,
                width: 120,
                placeholderBuilder: (context) => const Icon(Icons.broken_image, size: 80, color: Colors.teal),
              ),
              const SizedBox(height: 32),
              ElevatedButton.icon(
                icon: const Icon(Icons.login),
                onPressed: () {
                  Navigator.pushReplacementNamed(context, '/auth');
                },
                style: ElevatedButton.styleFrom(
                  minimumSize: const Size(200, 48),
                  textStyle: const TextStyle(fontSize: 18),
                ),
                label: const Text('Log In with Internet Identity'),
              ),
              const SizedBox(height: 16),
              ElevatedButton.icon(
                icon: const Icon(Icons.email),
                onPressed: () {
                  // TODO: Implement email login
                },
                style: ElevatedButton.styleFrom(
                  minimumSize: const Size(200, 48),
                  textStyle: const TextStyle(fontSize: 18),
                ),
                label: const Text('Log In with Email'),
              ),
              const SizedBox(height: 16),
              ElevatedButton.icon(
                icon: const Icon(Icons.card_giftcard),
                onPressed: () {
                  Navigator.pushNamed(context, '/rewards-exchange');
                },
                style: ElevatedButton.styleFrom(
                  minimumSize: const Size(200, 48),
                  textStyle: const TextStyle(fontSize: 18),
                ),
                label: const Text('Go to Rewards Exchange'),
              ),
              const SizedBox(height: 16),
              OutlinedButton.icon(
                icon: const Icon(Icons.person_add),
                onPressed: () {
                  // TODO: Implement sign up
                },
                style: OutlinedButton.styleFrom(
                  minimumSize: const Size(200, 48),
                  textStyle: const TextStyle(fontSize: 18),
                ),
                label: const Text('Sign Up'),
              ),
              const SizedBox(height: 32),
              // Language selection
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24.0),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: <dynamic>[
                    const Icon(Icons.language, color: Colors.teal),
                    const SizedBox(width: 8),
                    DropdownButton<String>(
                      value: selectedLanguage,
                      onChanged: (String? newValue) {
                        if (newValue != null) {
                          languageProvider.setLocale(Locale(newValue));
                        }
                      },
                      items: const <dynamic>[
                        DropdownMenuItem(
                          value: 'en',
                          child: Text('English'),
                        ),
                        DropdownMenuItem(
                          value: 'hi',
                          child: Text('हिन्दी'),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),
              // Voice interaction placeholder
              OutlinedButton.icon(
                icon: const Icon(Icons.mic),
                onPressed: () {
                  // TODO: Implement voice interaction
                },
                style: OutlinedButton.styleFrom(
                  minimumSize: const Size(200, 48),
                  textStyle: const TextStyle(fontSize: 18),
                ),
                label: const Text('Voice Interaction (Coming Soon)'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
