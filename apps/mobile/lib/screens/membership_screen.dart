import 'package:flutter/material.dart';

class MembershipScreen extends StatelessWidget {
  const MembershipScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('NFT Membership'),
        backgroundColor: Colors.indigo.shade600,
        foregroundColor: Colors.white,
      ),
      body: const Center(
        child: Text(
          'Membership Screen - Under Development',
          style: TextStyle(fontSize: 24),
        ),
      ),
    );
  }
}
