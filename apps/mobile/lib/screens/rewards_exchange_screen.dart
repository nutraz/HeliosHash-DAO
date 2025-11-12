// lib/screens/rewards_exchange_screen.dart

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/reward_provider.dart';
import '../models/reward_model.dart';
// import '../providers/dao_provider.dart'; // To get the user's token balance

class RewardsExchangeScreen extends StatelessWidget {
  static const routeName = '/rewards-exchange';
  const RewardsExchangeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final RewardProvider rewardProvider = Provider.of<RewardProvider>(context);
    // final daoProvider = Provider.of<DAOProvider>(context); // Fetch current token balance

    return Scaffold(
      appBar: AppBar(
        title: const Text('Rewards Exchange'),
        // actions: [
        //   Center(child: Text('Your Balance: ￿{daoProvider.tokenBalance} HHC')),
        // ],
      ),
      body: FutureBuilder(
        key: const ValueKey('rewards-future-builder'),
        future: rewardProvider.fetchRewards(),
        builder: (BuildContext context, AsyncSnapshot<void> snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator(key: ValueKey('rewards-loading')));
          }
          if (rewardProvider.availableRewards.isEmpty) {
            return const Center(
              child: Text('No rewards available right now.', key: ValueKey('rewards-empty')),
            );
          }

          return GridView.builder(
            key: const ValueKey('rewards-grid'),
            padding: const EdgeInsets.all(16),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
              crossAxisSpacing: 16,
              mainAxisSpacing: 16,
              childAspectRatio: 0.7,
            ),
            itemCount: rewardProvider.availableRewards.length,
            itemBuilder: (BuildContext context, int index) {
              final RewardModel reward = rewardProvider.availableRewards[index];
              return RewardCard(key: ValueKey('reward-card-${reward.id}'), reward: reward);
            },
          );
        },
      ),
    );
  }
}

class RewardCard extends StatelessWidget {
  final RewardModel reward;
  const RewardCard({super.key, required this.reward});

  @override
  Widget build(BuildContext context) {
    return Card(
      key: ValueKey('reward-card-main-${reward.id}'),
      elevation: 4,
      child: Padding(
        padding: const EdgeInsets.all(8.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(
<<<<<<< HEAD
              reward.category == 'travel' ? Icons.flight : 
              reward.category == 'food' ? Icons.restaurant : 
              Icons.card_giftcard,
=======
              reward.category == 'travel'
                  ? Icons.flight
                  : reward.category == 'food'
                  ? Icons.restaurant
                  : Icons.card_giftcard,
>>>>>>> 9823c84 (chore: sync and clean repo)
              size: 48,
              color: Theme.of(context).primaryColor,
              key: ValueKey('reward-icon-${reward.id}'),
            ),
            const SizedBox(height: 8),
            Text(
              reward.name,
              key: ValueKey('reward-name-${reward.id}'),
              style: const TextStyle(fontWeight: FontWeight.bold),
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
            const SizedBox(height: 4),
            Text(
              'Partner: ￿{reward.partnerName}',
              key: ValueKey('reward-partner-${reward.id}'),
              style: TextStyle(fontSize: 12, color: Colors.grey[600]),
            ),
            const Spacer(),
            Text(
              'Cost: ￿{reward.pointsCost} HHC',
              key: ValueKey('reward-cost-${reward.id}'),
              style: TextStyle(
                color: Theme.of(context).colorScheme.secondary,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                key: ValueKey('reward-redeem-btn-${reward.id}'),
                onPressed: () => _showRedeemDialog(context, reward),
                child: const Text('Redeem'),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _showRedeemDialog(BuildContext context, RewardModel reward) {
    showDialog(
      context: context,
      builder: (BuildContext ctx) => AlertDialog(
        key: ValueKey('reward-redeem-dialog-${reward.id}'),
        title: Text('Redeem ￿{reward.name}?', key: ValueKey('reward-redeem-title-${reward.id}')),
<<<<<<< HEAD
        content: Text('Confirm spending ￿{reward.pointsCost} HHC for this reward?', key: ValueKey('reward-redeem-content-${reward.id}')),
        actions: [
=======
        content: Text(
          'Confirm spending ￿{reward.pointsCost} HHC for this reward?',
          key: ValueKey('reward-redeem-content-${reward.id}'),
        ),
        actions: <dynamic>[
>>>>>>> 9823c84 (chore: sync and clean repo)
          TextButton(
            key: ValueKey('reward-redeem-cancel-btn-${reward.id}'),
            onPressed: () => Navigator.of(ctx).pop(),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            key: ValueKey('reward-redeem-confirm-btn-${reward.id}'),
            onPressed: () async {
              Navigator.of(ctx).pop(); // Close dialog
<<<<<<< HEAD
              final success = await Provider.of<RewardProvider>(context, listen: false).redeemReward(reward);
              
=======
              final bool success = await Provider.of<RewardProvider>(
                context,
                listen: false,
              ).redeemReward(reward);

>>>>>>> 9823c84 (chore: sync and clean repo)
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text(
                    success ? 'Successfully redeemed reward!' : 'Redemption failed. Check balance.',
                  ),
                  backgroundColor: success ? Colors.green : Colors.red,
                ),
              );
            },
            child: const Text('Confirm'),
          ),
        ],
      ),
    );
  }
}
