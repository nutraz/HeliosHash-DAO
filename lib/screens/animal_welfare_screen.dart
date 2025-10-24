import 'package:flutter/material.dart';

class AnimalWelfareScreen extends StatelessWidget {
  const AnimalWelfareScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Animal Welfare'),
        backgroundColor: Colors.orange.shade600,
        foregroundColor: Colors.white,
      ),
      body: const Center(
        child: Text(
          'Animal Welfare Screen - Under Development',
          style: TextStyle(fontSize: 24),
        ),
      ),
    );
  }
}
