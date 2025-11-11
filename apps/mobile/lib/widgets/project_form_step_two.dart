import 'package:flutter/material.dart';

class ProjectFormStepTwo extends StatelessWidget {
  final TextEditingController fundingGoalController;
  final TextEditingController tokenAllocationController;
  final TextEditingController capacityController;

  const ProjectFormStepTwo({
    super.key,
    required this.fundingGoalController,
    required this.tokenAllocationController,
    required this.capacityController,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Funding & Technical Details',
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.bold,
            color: Colors.green,
          ),
        ),
        const SizedBox(height: 16),
        TextFormField(
          controller: capacityController,
          decoration: const InputDecoration(
            labelText: 'Solar Capacity (MW) *',
            hintText: 'e.g., 100',
            border: OutlineInputBorder(),
            prefixIcon: Icon(Icons.bolt),
            suffixText: 'MW',
          ),
          keyboardType: TextInputType.number,
          validator: (value) {
            if (value == null || value.isEmpty) {
              return 'Capacity is required';
            }
            final capacity = double.tryParse(value);
            if (capacity == null || capacity <= 0) {
              return 'Please enter a valid capacity';
            }
            return null;
          },
        ),
        const SizedBox(height: 16),
        TextFormField(
          controller: fundingGoalController,
          decoration: const InputDecoration(
            labelText: 'Funding Goal (ETH) *',
            hintText: 'e.g., 1000000',
            border: OutlineInputBorder(),
            prefixIcon: Icon(Icons.account_balance_wallet),
            suffixText: 'ETH',
          ),
          keyboardType: TextInputType.number,
          validator: (value) {
            if (value == null || value.isEmpty) {
              return 'Funding goal is required';
            }
            final goal = double.tryParse(value);
            if (goal == null || goal <= 0) {
              return 'Please enter a valid funding goal';
            }
            return null;
          },
        ),
        const SizedBox(height: 16),
        TextFormField(
          controller: tokenAllocationController,
          decoration: const InputDecoration(
            labelText: 'Reward Tokens *',
            hintText: 'e.g., 10000',
            border: OutlineInputBorder(),
            prefixIcon: Icon(Icons.stars),
            suffixText: 'HHDAO',
            helperText: 'Tokens to be distributed to investors and contributors',
          ),
          keyboardType: TextInputType.number,
          validator: (value) {
            if (value == null || value.isEmpty) {
              return 'Token allocation is required';
            }
            final tokens = double.tryParse(value);
            if (tokens == null || tokens <= 0) {
              return 'Please enter a valid token amount';
            }
            return null;
          },
        ),
        const SizedBox(height: 24),
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.green.shade50,
            borderRadius: BorderRadius.circular(8),
            border: Border.all(color: Colors.green.shade200),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Row(
                children: [
                  Icon(Icons.lightbulb, color: Colors.green),
                  SizedBox(width: 8),
                  Text(
                    'Funding Structure',
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      color: Colors.green,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              const Text(
                '• 70% of funds will be used for solar panel installation and infrastructure\n'
                '• 20% allocated for maintenance and monitoring systems\n'
                '• 10% reserved for community education and training programs\n\n'
                'Investors will receive HHDAO tokens proportional to their contribution, providing ongoing rewards from project energy generation.',
                style: TextStyle(fontSize: 12, color: Colors.green),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
