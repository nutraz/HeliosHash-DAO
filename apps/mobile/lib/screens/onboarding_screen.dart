import 'package:flutter/material.dart';

class OnboardingScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.flash_on, size: 80, color: Colors.amber),
            SizedBox(height: 24),
            Text('Start earning HHU — simple tasks, local projects, real INR payouts.', style: TextStyle(fontSize: 20, color: Colors.white)),
            SizedBox(height: 32),
            ElevatedButton(
              onPressed: () {},
              child: Text('Start Earning'),
            ),
            SizedBox(height: 16),
            TextButton(
              onPressed: () {},
              child: Text('हिंदी / Hindi'),
            ),
            TextButton(
              onPressed: () {},
              child: Text('Accessibility'),
            ),
          ],
        ),
      ),
    );
  }
}
