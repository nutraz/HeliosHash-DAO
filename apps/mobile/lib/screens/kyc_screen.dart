import 'package:flutter/material.dart';

class KycScreen extends StatelessWidget {
  const KycScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text('Aadhaar Consent & KYC Choice',
                style: TextStyle(fontSize: 22, color: Colors.white)),
            SizedBox(height: 24),
            ElevatedButton(
              onPressed: () {},
              child: Text('Continue with Aadhaar e-KYC'),
            ),
            ElevatedButton(
              onPressed: () {},
              child: Text('Continue with PAN'),
            ),
            SizedBox(height: 16),
            Text(
                'We store only a hashed token and your consent. Full Aadhaar data stays with UIDAI.',
                style: TextStyle(color: Colors.white70)),
          ],
        ),
      ),
    );
  }
}
