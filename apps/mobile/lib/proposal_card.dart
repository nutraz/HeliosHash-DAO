import 'package:flutter/material.dart';
import 'proposal_model.dart';

class ProposalCard extends StatelessWidget {
  const ProposalCard({super.key, required this.proposal, this.onTap, this.showVoteButtons = true});
  final Proposal proposal;
  final VoidCallback? onTap;
  final bool showVoteButtons;

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 4,
      margin: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <dynamic>[
              // Title and Status
              Row(
                children: <dynamic>[
                  Expanded(
                    child: Text(
                      proposal.title,
                      style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                    ),
                  ),
                  _buildStatusChip(),
                ],
              ),

              const SizedBox(height: 8),

              // Description
              Text(
                proposal.description,
                style: TextStyle(fontSize: 14, color: Colors.grey[600]),
                maxLines: 3,
                overflow: TextOverflow.ellipsis,
              ),

              const SizedBox(height: 12),

              // Type and Category
              Row(
                children: <dynamic>[
                  Chip(
                    label: Text(
                      _getProposalTypeText(proposal.type),
                      style: const TextStyle(fontSize: 12),
                    ),
                    backgroundColor: Colors.purple[50],
                    labelStyle: TextStyle(color: Colors.purple[700]),
                  ),
                  if (proposal.category != null) ...<dynamic>[
                    const SizedBox(width: 8),
                    Chip(
                      label: Text(proposal.category!, style: const TextStyle(fontSize: 12)),
                      backgroundColor: Colors.blue[50],
                      labelStyle: TextStyle(color: Colors.blue[700]),
                    ),
                  ],
                ],
              ),

              const SizedBox(height: 8),

              // Tags
              if (proposal.tags.isNotEmpty)
                Wrap(
                  spacing: 4,
                  runSpacing: 4,
                  children: proposal.tags
                      .take(3)
                      .map(
                        (String tag) => Chip(
                          label: Text(tag, style: const TextStyle(fontSize: 10)),
                          backgroundColor: Colors.grey[200],
                          materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
                          padding: EdgeInsets.zero,
                        ),
                      )
                      .toList(),
                ),

              const SizedBox(height: 12),

              // Voting Progress
              if (proposal.isActive)
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <dynamic>[
                    const Text(
                      'Voting Progress',
                      style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 8),
                    LinearProgressIndicator(
                      value: proposal.yesVotePercentage / 100,
                      backgroundColor: Colors.grey[300],
                      valueColor: const AlwaysStoppedAnimation<Color>(Colors.green),
                    ),
                    const SizedBox(height: 4),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: <dynamic>[
                        Text(
                          'Yes: ${proposal.yesVotePercentage.toStringAsFixed(1)}%',
                          style: const TextStyle(fontSize: 12, color: Colors.green),
                        ),
                        Text(
                          'No: ${proposal.noVotePercentage.toStringAsFixed(1)}%',
                          style: const TextStyle(fontSize: 12, color: Colors.red),
                        ),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'Total Votes: ${proposal.totalVotes}',
                      style: TextStyle(fontSize: 12, color: Colors.grey[600]),
                    ),
                  ],
                ),

              const SizedBox(height: 12),

              // Vote buttons (only for active proposals)
              if (showVoteButtons && proposal.canVote)
                Row(
                  children: <dynamic>[
                    Expanded(
                      child: ElevatedButton.icon(
                        onPressed: () {
                          // Handle yes vote
                        },
                        icon: const Icon(Icons.thumb_up, size: 16),
                        label: const Text('Yes'),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.green,
                          foregroundColor: Colors.white,
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: ElevatedButton.icon(
                        onPressed: () {
                          // Handle no vote
                        },
                        icon: const Icon(Icons.thumb_down, size: 16),
                        label: const Text('No'),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.red,
                          foregroundColor: Colors.white,
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: OutlinedButton.icon(
                        onPressed: () {
                          // Handle abstain vote
                        },
                        icon: const Icon(Icons.pause, size: 16),
                        label: const Text('Abstain'),
                      ),
                    ),
                  ],
                ),

              // Voting deadline
              if (proposal.isActive)
                Padding(
                  padding: const EdgeInsets.only(top: 8),
                  child: Row(
                    children: <dynamic>[
                      const Icon(Icons.schedule, size: 16, color: Colors.grey),
                      const SizedBox(width: 4),
                      Text(
                        'Voting ends: ${_formatDate(proposal.votingEndDate)}',
                        style: TextStyle(fontSize: 12, color: Colors.grey[600]),
                      ),
                    ],
                  ),
                ),

              // Result for completed proposals
              if (!proposal.isActive)
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: proposal.isPassed ? Colors.green[50] : Colors.red[50],
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Row(
                    children: <dynamic>[
                      Icon(
                        proposal.isPassed ? Icons.check_circle : Icons.cancel,
                        size: 16,
                        color: proposal.isPassed ? Colors.green : Colors.red,
                      ),
                      const SizedBox(width: 4),
                      Text(
                        proposal.isPassed ? 'Passed' : 'Rejected',
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                          color: proposal.isPassed ? Colors.green : Colors.red,
                        ),
                      ),
                    ],
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStatusChip() {
    Color chipColor;
    String statusText;

    switch (proposal.status) {
      case ProposalStatus.active:
        chipColor = Colors.green;
        statusText = 'Active';
      case ProposalStatus.passed:
        chipColor = Colors.blue;
        statusText = 'Passed';
      case ProposalStatus.rejected:
        chipColor = Colors.red;
        statusText = 'Rejected';
      case ProposalStatus.executed:
        chipColor = Colors.purple;
        statusText = 'Executed';
      case ProposalStatus.cancelled:
        chipColor = Colors.grey;
        statusText = 'Cancelled';
      case ProposalStatus.draft:
        chipColor = Colors.orange;
        statusText = 'Draft';
    }

    return Chip(
      label: Text(statusText, style: const TextStyle(fontSize: 10, color: Colors.white)),
      backgroundColor: chipColor,
      materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
      padding: EdgeInsets.zero,
    );
  }

  String _getProposalTypeText(ProposalType type) {
    switch (type) {
      case ProposalType.funding:
        return 'Funding';
      case ProposalType.governance:
        return 'Governance';
      case ProposalType.projectApproval:
        return 'Project Approval';
      case ProposalType.parameterChange:
        return 'Parameter Change';
      case ProposalType.membership:
        return 'Membership';
      case ProposalType.other:
        return 'Other';
    }
  }

  String _formatDate(DateTime date) {
    final DateTime now = DateTime.now();
    final Duration difference = date.difference(now);

    if (difference.isNegative) {
      return 'Ended';
    } else if (difference.inDays > 0) {
      return '${difference.inDays} days left';
    } else if (difference.inHours > 0) {
      return '${difference.inHours} hours left';
    } else {
      return '${difference.inMinutes} minutes left';
    }
  }
}
