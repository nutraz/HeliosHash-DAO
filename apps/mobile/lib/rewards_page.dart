import 'package:flutter/material.dart';
import 'app_constant.dart';

class RewardsPage extends StatelessWidget {
  const RewardsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Rewards'), backgroundColor: AppConstants.primaryColor),
      body: const Center(child: Text('Rewards Page - Coming Soon')),
    );
  }
}
