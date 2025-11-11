import 'package:flutter/material.dart';
import 'package:helios_hash_dao/app_constant.dart';

class WalletPage extends StatelessWidget {
  const WalletPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Wallet'),
        backgroundColor: AppConstants.primaryColor,
      ),
      body: const Center(
        child: Text('Wallet Page - Coming Soon'),
      ),
    );
  }
}
