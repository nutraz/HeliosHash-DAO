import 'package:flutter/material.dart';

class GovernanceScreen extends StatefulWidget {
  const GovernanceScreen({super.key});

  @override
  State<GovernanceScreen> createState() => _GovernanceScreenState();
}

class _GovernanceScreenState extends State<GovernanceScreen> {
  final TextEditingController _tokensController = TextEditingController();
  final TextEditingController _tokensConvictionController = TextEditingController();
  final TextEditingController _timeHeldController = TextEditingController();
  final TextEditingController _delegateeController = TextEditingController();

  void _voteQuadratic() {
    // placeholder - implement actual voting logic later
    debugPrint('voteQuadratic: ${_tokensController.text}');
  }

  void _voteConviction() {
    debugPrint('voteConviction: ${_tokensConvictionController.text}, time: ${_timeHeldController.text}');
  }

  void _delegateVote() {
    debugPrint('delegateVote to ${_delegateeController.text}');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('DAO Governance'),
        backgroundColor: Colors.purple.shade600,
        foregroundColor: Colors.white,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Text(
              'Governance Screen - Under Development',
              style: TextStyle(fontSize: 24),
            ),
            const SizedBox(height: 32),
            const Text('Quadratic Voting'),
            TextField(
              controller: _tokensController,
              decoration: const InputDecoration(labelText: 'Tokens to stake'),
              keyboardType: TextInputType.number,
            ),
            ElevatedButton(
              onPressed: _voteQuadratic,
              child: const Text('Vote Quadratic'),
            ),
            const Divider(),
            const Text('Conviction Voting'),
            TextField(
              controller: _tokensConvictionController,
              decoration: const InputDecoration(labelText: 'Tokens to stake'),
              keyboardType: TextInputType.number,
            ),
            TextField(
              controller: _timeHeldController,
              decoration: const InputDecoration(labelText: 'Time held (days)'),
              keyboardType: TextInputType.number,
            ),
            ElevatedButton(
              onPressed: _voteConviction,
              child: const Text('Vote Conviction'),
            ),
            const Divider(),
            const Text('Delegate Vote'),
            TextField(
              controller: _delegateeController,
              decoration: const InputDecoration(labelText: 'Delegatee Principal'),
            ),
            ElevatedButton(
              onPressed: _delegateVote,
              child: const Text('Delegate'),
            ),
          ],
        ),
      ),
    );
  }
}
