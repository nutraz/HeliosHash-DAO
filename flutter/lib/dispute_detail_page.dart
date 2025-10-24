import 'package:flutter/material.dart';
import 'package:helios_hash_dao/app_constant.dart';

class DisputeDetailPage extends StatefulWidget {
  final String disputeId;

  const DisputeDetailPage({super.key, required this.disputeId});

  @override
  State<DisputeDetailPage> createState() => _DisputeDetailPageState();
}

class _DisputeDetailPageState extends State<DisputeDetailPage> {
  final TextEditingController _commentController = TextEditingController();

  // Mock dispute data
  final Map<String, dynamic> _dispute = {
    'id': 'DIS-001',
    'title': 'Project Milestone Payment Dispute',
    'description': 'The contractor claims the milestone was completed but the client disagrees with the quality of work delivered.',
    'status': 'Open',
    'priority': 'High',
    'category': 'Project Payment',
    'createdAt': DateTime.now().subtract(const Duration(days: 3)),
    'updatedAt': DateTime.now().subtract(const Duration(hours: 2)),
    'initiator': {
      'name': 'Alice Johnson',
      'role': 'Project Manager',
      'avatar': 'A',
    },
    'respondent': {
      'name': 'Bob Smith',
      'role': 'Contractor',
      'avatar': 'B',
    },
    'mediator': {
      'name': 'Carol Davis',
      'role': 'Community Mediator',
      'avatar': 'C',
    },
    'amount': 2500.0,
    'evidence': [
      'Contract signed on 2024-01-15',
      'Milestone requirements document',
      'Delivered work screenshots',
      'Client feedback notes',
    ],
    'comments': [
      {
        'id': '1',
        'author': 'Alice Johnson',
        'message': 'The delivered code has multiple bugs and doesn\'t meet the specifications outlined in the contract.',
        'timestamp': DateTime.now().subtract(const Duration(days: 2)),
        'isMediator': false,
      },
      {
        'id': '2',
        'author': 'Bob Smith',
        'message': 'I have fixed all the issues mentioned in the requirements. The code is fully functional and tested.',
        'timestamp': DateTime.now().subtract(const Duration(days: 1)),
        'isMediator': false,
      },
      {
        'id': '3',
        'author': 'Carol Davis',
        'message': 'I\'ve reviewed both sides. Let\'s schedule a mediation call to discuss the specific issues.',
        'timestamp': DateTime.now().subtract(const Duration(hours: 5)),
        'isMediator': true,
      },
    ],
  };

  @override
  void dispose() {
    _commentController.dispose();
    super.dispose();
  }

  void _addComment() {
    if (_commentController.text.trim().isEmpty) return;

    setState(() {
      _dispute['comments'].add({
        'id': DateTime.now().millisecondsSinceEpoch.toString(),
        'author': 'Current User', // In real app, get from auth
        'message': _commentController.text.trim(),
        'timestamp': DateTime.now(),
        'isMediator': false,
      });
    });

    _commentController.clear();
  }

  Color _getStatusColor(String status) {
    switch (status.toLowerCase()) {
      case 'open':
        return Colors.orange;
      case 'in progress':
        return Colors.blue;
      case 'resolved':
        return Colors.green;
      case 'closed':
        return Colors.grey;
      default:
        return Colors.grey;
    }
  }

  Color _getPriorityColor(String priority) {
    switch (priority.toLowerCase()) {
      case 'high':
        return Colors.red;
      case 'medium':
        return Colors.orange;
      case 'low':
        return Colors.green;
      default:
        return Colors.grey;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Dispute ${_dispute['id']}'),
        backgroundColor: AppConstants.primaryColor,
        foregroundColor: Colors.white,
        actions: [
          PopupMenuButton<String>(
            onSelected: (value) {
              // Handle menu actions
            },
            itemBuilder: (context) => [
              const PopupMenuItem(
                value: 'escalate',
                child: Text('Escalate Dispute'),
              ),
              const PopupMenuItem(
                value: 'close',
                child: Text('Close Dispute'),
              ),
              const PopupMenuItem(
                value: 'report',
                child: Text('Report Issue'),
              ),
            ],
          ),
        ],
      ),
      body: Column(
        children: [
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Dispute Header
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Expanded(
                                child: Text(
                                  _dispute['title'],
                                  style: const TextStyle(
                                    fontSize: 20,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                decoration: BoxDecoration(
                                  color: _getStatusColor(_dispute['status']).withOpacity(0.1),
                                  borderRadius: BorderRadius.circular(12),
                                  border: Border.all(
                                    color: _getStatusColor(_dispute['status']),
                                  ),
                                ),
                                child: Text(
                                  _dispute['status'],
                                  style: TextStyle(
                                    color: _getStatusColor(_dispute['status']),
                                    fontWeight: FontWeight.bold,
                                    fontSize: 12,
                                  ),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 8),
                          Text(
                            _dispute['description'],
                            style: TextStyle(
                              color: Colors.grey[600],
                              height: 1.4,
                            ),
                          ),
                          const SizedBox(height: 16),
                          Row(
                            children: [
                              _buildPriorityChip(_dispute['priority']),
                              const SizedBox(width: 8),
                              Text(
                                _dispute['category'],
                                style: TextStyle(
                                  color: Colors.grey[600],
                                  fontSize: 14,
                                ),
                              ),
                            ],
                          ),
                          if (_dispute['amount'] != null) ...[
                            const SizedBox(height: 8),
                            Text(
                              'Amount: \$${_dispute['amount']}',
                              style: const TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 16,
                              ),
                            ),
                          ],
                        ],
                      ),
                    ),
                  ),

                  const SizedBox(height: 24),

                  // Parties Involved
                  const Text(
                    'Parties Involved',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      Expanded(
                        child: _buildPartyCard(
                          'Initiator',
                          _dispute['initiator'],
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: _buildPartyCard(
                          'Respondent',
                          _dispute['respondent'],
                        ),
                      ),
                    ],
                  ),

                  if (_dispute['mediator'] != null) ...[
                    const SizedBox(height: 16),
                    _buildPartyCard(
                      'Mediator',
                      _dispute['mediator'],
                      isMediator: true,
                    ),
                  ],

                  const SizedBox(height: 24),

                  // Evidence
                  const Text(
                    'Evidence',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 16),
                  ...(_dispute['evidence'] as List<String>).map((evidence) => Card(
                        child: ListTile(
                          leading: const Icon(Icons.attach_file),
                          title: Text(evidence),
                          trailing: IconButton(
                            icon: const Icon(Icons.download),
                            onPressed: () {
                              // Download evidence
                            },
                          ),
                        ),
                      )),

                  const SizedBox(height: 24),

                  // Comments/Updates
                  const Text(
                    'Discussion',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 16),
                  ...(_dispute['comments'] as List<Map<String, dynamic>>).map(
                    (comment) => _buildCommentCard(comment),
                  ),
                ],
              ),
            ),
          ),

          // Add Comment Section
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              border: Border(
                top: BorderSide(color: Colors.grey[200]!),
              ),
            ),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _commentController,
                    decoration: InputDecoration(
                      hintText: 'Add a comment...',
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(24),
                        borderSide: BorderSide.none,
                      ),
                      filled: true,
                      fillColor: Colors.grey[100],
                      contentPadding: const EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 12,
                      ),
                    ),
                    maxLines: null,
                    textInputAction: TextInputAction.send,
                    onSubmitted: (_) => _addComment(),
                  ),
                ),
                const SizedBox(width: 8),
                CircleAvatar(
                  backgroundColor: AppConstants.primaryColor,
                  child: IconButton(
                    icon: const Icon(Icons.send, color: Colors.white),
                    onPressed: _addComment,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPriorityChip(String priority) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: _getPriorityColor(priority).withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: _getPriorityColor(priority),
        ),
      ),
      child: Text(
        priority,
        style: TextStyle(
          color: _getPriorityColor(priority),
          fontWeight: FontWeight.bold,
          fontSize: 12,
        ),
      ),
    );
  }

  Widget _buildPartyCard(String role, Map<String, dynamic> party, {bool isMediator = false}) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          children: [
            CircleAvatar(
              backgroundColor: isMediator
                  ? Colors.purple.withOpacity(0.2)
                  : AppConstants.primaryColor.withOpacity(0.2),
              child: Text(
                party['avatar'],
                style: TextStyle(
                  color: isMediator ? Colors.purple : AppConstants.primaryColor,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
            const SizedBox(height: 8),
            Text(
              party['name'],
              style: const TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 14,
              ),
              textAlign: TextAlign.center,
            ),
            Text(
              party['role'],
              style: TextStyle(
                color: Colors.grey[600],
                fontSize: 12,
              ),
              textAlign: TextAlign.center,
            ),
            Container(
              margin: const EdgeInsets.only(top: 4),
              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
              decoration: BoxDecoration(
                color: isMediator ? Colors.purple : AppConstants.primaryColor,
                borderRadius: BorderRadius.circular(8),
              ),
              child: Text(
                role,
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 10,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCommentCard(Map<String, dynamic> comment) {
    final isMediator = comment['isMediator'] as bool;

    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                CircleAvatar(
                  radius: 16,
                  backgroundColor: isMediator
                      ? Colors.purple.withOpacity(0.2)
                      : AppConstants.primaryColor.withOpacity(0.2),
                  child: Text(
                    comment['author'][0],
                    style: TextStyle(
                      color: isMediator ? Colors.purple : AppConstants.primaryColor,
                      fontWeight: FontWeight.bold,
                      fontSize: 12,
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Text(
                            comment['author'],
                            style: const TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 14,
                            ),
                          ),
                          if (isMediator) ...[
                            const SizedBox(width: 4),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 1),
                              decoration: BoxDecoration(
                                color: Colors.purple,
                                borderRadius: BorderRadius.circular(6),
                              ),
                              child: const Text(
                                'Mediator',
                                style: TextStyle(
                                  color: Colors.white,
                                  fontSize: 8,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                          ],
                        ],
                      ),
                      Text(
                        _formatDateTime(comment['timestamp']),
                        style: TextStyle(
                          color: Colors.grey[600],
                          fontSize: 12,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Text(
              comment['message'],
              style: const TextStyle(height: 1.4),
            ),
          ],
        ),
      ),
    );
  }

  String _formatDateTime(DateTime dateTime) {
    final now = DateTime.now();
    final difference = now.difference(dateTime);

    if (difference.inDays > 0) {
      return '${dateTime.day}/${dateTime.month}/${dateTime.year}';
    } else if (difference.inHours > 0) {
      return '${difference.inHours}h ago';
    } else if (difference.inMinutes > 0) {
      return '${difference.inMinutes}m ago';
    } else {
      return 'Just now';
    }
  }
}
