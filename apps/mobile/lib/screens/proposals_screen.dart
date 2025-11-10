import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/dao/proposal.dart';
import '../providers/governance_provider.dart';

class ProposalsScreen extends StatelessWidget {
  const ProposalsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final GovernanceProvider governanceProvider = Provider.of<GovernanceProvider>(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Governance Proposals'),
        actions: <dynamic>[
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: governanceProvider.isLoading
                ? null
                : () => governanceProvider.fetchProposals(),
          ),
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () {
              governanceProvider.setAuthToken(null);
            },
          ),
        ],
      ),
      body: governanceProvider.isLoading
          ? const Center(child: CircularProgressIndicator())
          : governanceProvider.error != null
          ? Center(child: Text('Error: ${governanceProvider.error}'))
          : ListView.builder(
              itemCount: governanceProvider.proposals.length,
              itemBuilder: (BuildContext context, int idx) {
                final Proposal proposal = governanceProvider.proposals[idx];
                return ListTile(
                  title: Text(proposal['title'] ?? ''),
                  subtitle: Text(proposal['description'] ?? ''),
                  trailing: Text('Deadline: ${proposal['deadline'] ?? ''}'),
                );
              },
            ),
    );
  }
}
