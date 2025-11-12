import '../models/dao/proposal.dart';
import 'package:flutter/material.dart';

class ProposalCard extends StatelessWidget {
<<<<<<< HEAD
  final Proposal proposal;
  final Function(bool)? onVote;
  final VoidCallback? onTap;

  const ProposalCard({
    Key? key,
    required this.proposal,
    this.onVote,
    this.onTap,
  }) : super(key: key);
=======
  const ProposalCard({super.key, required this.proposal, this.onVote, this.onTap});
  final Proposal proposal;
  final Function(bool)? onVote;
  final VoidCallback? onTap;
>>>>>>> 9823c84 (chore: sync and clean repo)

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    return Card(
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: _getStatusColor(proposal.status).withOpacity(0.1),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      proposal.status.toUpperCase(),
                      style: TextStyle(
                        color: _getStatusColor(proposal.status),
                        fontSize: 10,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                  if (proposal.isActive)
                    Text(
                      '${proposal.daysRemaining}d left',
                      style: theme.textTheme.bodySmall?.copyWith(
                        color: theme.colorScheme.onSurface.withOpacity(0.6),
                      ),
                    ),
                ],
              ),
              const SizedBox(height: 12),
              Text(
                proposal.title,
                style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
              const SizedBox(height: 8),
              Text(
                proposal.description,
                style: theme.textTheme.bodyMedium?.copyWith(
                  color: theme.colorScheme.onSurface.withOpacity(0.7),
                ),
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'For: ${(proposal.votesFor / proposal.totalVotes * 100).toStringAsFixed(1)}%',
                          style: theme.textTheme.bodySmall,
                        ),
                        const SizedBox(height: 4),
                        ClipRRect(
                          borderRadius: BorderRadius.circular(4),
                          child: LinearProgressIndicator(
                            value: proposal.totalVotes > 0
                                ? proposal.votesFor / proposal.totalVotes
                                : 0,
                            minHeight: 6,
                            backgroundColor: const Color(0xFFEF5350).withOpacity(0.2),
                            valueColor: const AlwaysStoppedAnimation(Color(0xFF66BB6A)),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  Expanded(
                    child: ElevatedButton(
                      onPressed: onVote != null ? () => onVote!(true) : null,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.green,
                        foregroundColor: Colors.white,
                      ),
                      child: const Text('Vote For'),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: ElevatedButton(
                      onPressed: onVote != null ? () => onVote!(false) : null,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.red,
                        foregroundColor: Colors.white,
                      ),
                      child: const Text('Vote Against'),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Color _getStatusColor(String status) {
    switch (status.toLowerCase()) {
      case 'active':
        return const Color(0xFF42A5F5);
      case 'passed':
        return const Color(0xFF66BB6A);
      case 'rejected':
        return const Color(0xFFEF5350);
      case 'executed':
        return const Color(0xFF26A69A);
      default:
        return const Color(0xFF9E9E9E);
    }
  }
}
