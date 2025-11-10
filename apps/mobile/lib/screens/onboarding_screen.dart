import 'package:flutter/material.dart';

class OnboardingScreen extends StatelessWidget {
  const OnboardingScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <dynamic>[
            const Icon(Icons.flash_on, size: 80, color: Colors.amber),
            const SizedBox(height: 24),
            const Text(
              'Start earning HHU — simple tasks, local projects, real INR payouts.',
              style: TextStyle(fontSize: 20, color: Colors.white),
            ),
            const SizedBox(height: 32),
            ElevatedButton(onPressed: () {}, child: const Text('Start Earning')),
            const SizedBox(height: 16),
            TextButton(onPressed: () {}, child: const Text('हिंदी / Hindi')),
            TextButton(onPressed: () {}, child: const Text('Accessibility')),
          ],
        ),
      ),
    );
  }
}
