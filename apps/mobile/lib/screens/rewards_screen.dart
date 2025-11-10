import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/dao_provider.dart';

class RewardsScreen extends StatefulWidget {
  const RewardsScreen({super.key});

  @override
  State<RewardsScreen> createState() => _RewardsScreenState();
}

class _RewardsScreenState extends State<RewardsScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Rewards & Exchange'), backgroundColor: Colors.amber),
      body: Consumer<DAOProvider>(
        builder: (BuildContext context, DAOProvider daoProvider, Widget? child) {
          return SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <dynamic>[
                // Current Balance Card
                Card(
                  elevation: 4,
                  child: Padding(
                    padding: const EdgeInsets.all(20),
                    child: Column(
                      children: <dynamic>[
                        const Icon(Icons.account_balance_wallet, size: 48, color: Colors.amber),
                        const SizedBox(height: 16),
                        const Text(
                          'Current Balance',
                          style: TextStyle(fontSize: 18, fontWeight: FontWeight.w500),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          '${daoProvider.tokenBalance.toStringAsFixed(2)} HHDAO',
                          style: const TextStyle(
                            fontSize: 32,
                            fontWeight: FontWeight.bold,
                            color: Colors.amber,
                          ),
                        ),
                        const SizedBox(height: 16),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                          children: <dynamic>[
                            ElevatedButton.icon(
                              onPressed: daoProvider.isLoading
                                  ? null
                                  : () => _claimRewards(context),
                              icon: const Icon(Icons.download),
                              label: const Text('Claim Rewards'),
                              style: ElevatedButton.styleFrom(backgroundColor: Colors.green),
                            ),
                            ElevatedButton.icon(
                              onPressed: () => _showExchangeDialog(context),
                              icon: const Icon(Icons.swap_horiz),
                              label: const Text('Exchange'),
                              style: ElevatedButton.styleFrom(backgroundColor: Colors.blue),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),

                const SizedBox(height: 24),

                // Available Rewards Section
                const Text(
                  'Available Rewards',
                  style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 16),

                _buildRewardCard(
                  'Project Investment',
                  'Earn tokens by investing in solar projects',
                  '25.50 HHDAO',
                  Colors.green,
                  Icons.business,
                ),

                _buildRewardCard(
                  'Community Participation',
                  'Vote on proposals and participate in governance',
                  '10.00 HHDAO',
                  Colors.blue,
                  Icons.gavel,
                ),

                _buildRewardCard(
                  'Animal Care Reporting',
                  'Report wildlife issues in project areas',
                  '5.00 HHDAO',
                  Colors.orange,
                  Icons.pets,
                ),

                _buildRewardCard(
                  'Energy Generation',
                  'Rewards from solar projects you invested in',
                  '15.75 HHDAO',
                  Colors.yellow,
                  Icons.wb_sunny,
                ),

                const SizedBox(height: 24),

                // Token Exchange Section
                const Text(
                  'Token Exchange',
                  style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 16),

                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: <dynamic>[
                        const Text(
                          'Exchange Rate',
                          style: TextStyle(fontSize: 16, fontWeight: FontWeight.w500),
                        ),
                        const SizedBox(height: 8),
                        const Text(
                          '1 HHDAO = 0.05 ETH',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                            color: Colors.blue,
                          ),
                        ),
                        const SizedBox(height: 16),
                        const Text(
                          'Exchange your HHDAO tokens for ETH or other cryptocurrencies.',
                          style: TextStyle(color: Colors.grey),
                        ),
                        const SizedBox(height: 16),
                        SizedBox(
                          width: double.infinity,
                          child: ElevatedButton(
                            onPressed: () => _showExchangeDialog(context),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.amber,
                              padding: const EdgeInsets.symmetric(vertical: 12),
                            ),
                            child: const Text(
                              'Exchange Tokens',
                              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),

                const SizedBox(height: 24),

                // Transaction History
                const Text(
                  'Recent Transactions',
                  style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 16),

                _buildTransactionItem(
                  'Reward Claimed',
                  '+25.50 HHDAO',
                  'Project Investment',
                  '2 days ago',
                  Colors.green,
                ),

                _buildTransactionItem(
                  'Token Exchange',
                  '-50.00 HHDAO',
                  'Exchanged to ETH',
                  '1 week ago',
                  Colors.red,
                ),

                _buildTransactionItem(
                  'Governance Vote',
                  '+10.00 HHDAO',
                  'Proposal participation',
                  '1 week ago',
                  Colors.blue,
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildRewardCard(
    String title,
    String description,
    String amount,
    Color color,
    IconData icon,
  ) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          children: <dynamic>[
            CircleAvatar(
              backgroundColor: color.withOpacity(0.1),
              child: Icon(icon, color: color),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: <dynamic>[
                  Text(title, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w500)),
                  const SizedBox(height: 4),
                  Text(description, style: TextStyle(color: Colors.grey[600], fontSize: 14)),
                ],
              ),
            ),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              decoration: BoxDecoration(
                color: color.withOpacity(0.1),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Text(
                amount,
                style: TextStyle(color: color, fontWeight: FontWeight.bold),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTransactionItem(
    String title,
    String amount,
    String subtitle,
    String time,
    Color amountColor,
  ) {
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: ListTile(
        leading: CircleAvatar(
          backgroundColor: amountColor.withOpacity(0.1),
          child: Icon(amount.startsWith('+') ? Icons.add : Icons.remove, color: amountColor),
        ),
        title: Text(title),
        subtitle: Text('$subtitle • $time'),
        trailing: Text(
          amount,
          style: TextStyle(color: amountColor, fontWeight: FontWeight.bold, fontSize: 16),
        ),
      ),
    );
  }

  Future<void> _claimRewards(BuildContext context) async {
    final DAOProvider daoProvider = Provider.of<DAOProvider>(context, listen: false);
    await daoProvider.claimRewards();

    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Rewards claimed successfully!'),
          backgroundColor: Colors.green,
        ),
      );
    }
  }

  void _showExchangeDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        final TextEditingController amountController = TextEditingController();

        return AlertDialog(
          title: const Text('Exchange Tokens'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: <dynamic>[
              const Text(
                'Exchange your HHDAO tokens for ETH.\n\nRate: 1 HHDAO = 0.05 ETH',
                style: TextStyle(fontSize: 14),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: amountController,
                decoration: const InputDecoration(
                  labelText: 'Amount (HHDAO)',
                  border: OutlineInputBorder(),
                ),
                keyboardType: TextInputType.number,
              ),
              const SizedBox(height: 8),
              Text(
                'You will receive: ${amountController.text.isEmpty ? '0.00' : (double.tryParse(amountController.text) ?? 0 * 0.05).toStringAsFixed(2)} ETH',
                style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.blue),
              ),
            ],
          ),
          actions: <dynamic>[
            TextButton(onPressed: () => Navigator.of(context).pop(), child: const Text('Cancel')),
            ElevatedButton(
              onPressed: () {
                // TODO: Implement actual exchange logic
                Navigator.of(context).pop();
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Exchange feature coming soon!'),
                    backgroundColor: Colors.orange,
                  ),
                );
              },
              child: const Text('Exchange'),
            ),
          ],
        );
      },
    );
  }
}
