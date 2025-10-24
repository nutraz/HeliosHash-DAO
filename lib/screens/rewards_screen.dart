import 'package:flutter/material.dart';

class RewardsScreen extends StatelessWidget {
  const RewardsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Rewards & Incentives'),
        backgroundColor: Colors.amber.shade600,
        foregroundColor: Colors.white,
      ),
      body: const Center(
        child: Text(
          'Rewards Screen - Under Development',
          style: TextStyle(fontSize: 24),
        ),
      ),
    );
  }
}
