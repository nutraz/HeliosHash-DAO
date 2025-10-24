import 'package:flutter/material.dart';
import 'package:helios_hash_dao/app_constant.dart';
import 'package:helios_hash_dao/dispute_detail_page.dart';

class DisputeResolutionPage extends StatefulWidget {
  const DisputeResolutionPage({super.key});

  @override
  State<DisputeResolutionPage> createState() => _DisputeResolutionPageState();
}

class _DisputeResolutionPageState extends State<DisputeResolutionPage> with TickerProviderStateMixin {
  late TabController _tabController;
  final TextEditingController _searchController = TextEditingController();
  String _searchQuery = '';

  final List<Map<String, dynamic>> _disputes = [
    {
      'id': 'DIS-001',
      'title': 'Project Milestone Payment Dispute',
      'description': 'Contractor claims milestone completion but client disputes quality.',
      'status': 'Open',
      'priority': 'High',
      'category': 'Project Payment',
      'amount': 2500.0,
      'createdAt': DateTime.now().subtract(const Duration(days: 3)),
      'initiator': 'Alice Johnson',
      'respondent': 'Bob Smith',
      'mediator': 'Carol Davis',
    },
    {
      'id': 'DIS-002',
      'title': 'Governance Proposal Rejection',
      'description': 'Community member disputes the rejection of their proposal.',
      'status': 'In Progress',
      'priority': 'Medium',
      'category': 'Governance',
      'amount': null,
      'createdAt': DateTime.now().subtract(const Duration(days: 5)),
      'initiator': 'David Wilson',
      'respondent': 'DAO Council',
      'mediator': 'Eve Martinez',
    },
    {
      'id': 'DIS-003',
      'title': 'Reward Distribution Error',
      'description': 'Incorrect reward calculation for community contribution.',
      'status': 'Resolved',
      'priority': 'Low',
      'category': 'Rewards',
      'amount': 150.0,
      'createdAt': DateTime.now().subtract(const Duration(days: 7)),
      'initiator': 'Frank Garcia',
      'respondent': 'Reward System',
      'mediator': 'Grace Lee',
    },
    {
      'id': 'DIS-004',
      'title': 'Membership Fee Refund',
      'description': 'Member requests refund for unused membership period.',
      'status': 'Closed',
      'priority': 'Low',
      'category': 'Membership',
      'amount': 50.0,
      'createdAt': DateTime.now().subtract(const Duration(days: 10)),
      'initiator': 'Henry Taylor',
      'respondent': 'Membership Committee',
      'mediator': 'Ivy Chen',
    },
  ];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 4, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    _searchController.dispose();
    super.dispose();
  }

  List<Map<String, dynamic>> _getFilteredDisputes() {
    var disputes = _disputes;

    // Filter by search query
    if (_searchQuery.isNotEmpty) {
      disputes = disputes.where((dispute) {
        final title = dispute['title'].toString().toLowerCase();
        final description = dispute['description'].toString().toLowerCase();
        final query = _searchQuery.toLowerCase();

        return title.contains(query) || description.contains(query);
      }).toList();
    }

    // Filter by tab
    switch (_tabController.index) {
      case 0: // All Disputes
        break;
      case 1: // Open
        disputes = disputes.where((dispute) => dispute['status'] == 'Open').toList();
        break;
      case 2: // In Progress
        disputes = disputes.where((dispute) => dispute['status'] == 'In Progress').toList();
        break;
      case 3: // Resolved/Closed
        disputes = disputes.where((dispute) =>
            dispute['status'] == 'Resolved' || dispute['status'] == 'Closed').toList();
        break;
    }

    return disputes;
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
        title: const Text('Dispute Resolution'),
        backgroundColor: AppConstants.primaryColor,
        foregroundColor: Colors.white,
        elevation: 0,
        bottom: TabBar(
          controller: _tabController,
          isScrollable: true,
          tabs: const [
            Tab(text: 'All'),
            Tab(text: 'Open'),
            Tab(text: 'In Progress'),
            Tab(text: 'Resolved'),
          ],
          onTap: (index) {
            setState(() {});
          },
        ),
      ),
      body: Column(
        children: [
          // Search and Filter Section
          Container(
            padding: const EdgeInsets.all(16),
            color: Colors.grey[50],
            child: TextField(
              controller: _searchController,
              decoration: InputDecoration(
                hintText: 'Search disputes...',
                prefixIcon: const Icon(Icons.search),
                suffixIcon: _searchQuery.isNotEmpty
                    ? IconButton(
                        icon: const Icon(Icons.clear),
                        onPressed: () {
                          setState(() {
                            _searchController.clear();
                            _searchQuery = '';
                          });
                        },
                      )
                    : null,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide.none,
                ),
                filled: true,
                fillColor: Colors.white,
              ),
              onChanged: (value) {
                setState(() {
                  _searchQuery = value;
                });
              },
            ),
          ),

          // Disputes List
          Expanded(
            child: TabBarView(
              controller: _tabController,
              children: [
                _buildDisputesList(),
                _buildDisputesList(),
                _buildDisputesList(),
                _buildDisputesList(),
              ],
            ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          // Navigate to create dispute page
        },
        backgroundColor: AppConstants.primaryColor,
        child: const Icon(Icons.add),
        tooltip: 'File New Dispute',
      ),
    );
  }

  Widget _buildDisputesList() {
    final disputes = _getFilteredDisputes();

    if (disputes.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.gavel,
              size: 64,
              color: Colors.grey[400],
            ),
            const SizedBox(height: 16),
            Text(
              'No disputes found',
              style: TextStyle(
                fontSize: 18,
                color: Colors.grey[600],
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Try adjusting your search or filters',
              style: TextStyle(
                fontSize: 14,
                color: Colors.grey[500],
              ),
            ),
          ],
        ),
      );
    }

    return RefreshIndicator(
      onRefresh: () async {
        // Refresh disputes data
        await Future.delayed(const Duration(seconds: 1));
      },
      child: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: disputes.length,
        itemBuilder: (context, index) {
          final dispute = disputes[index];
          return _buildDisputeCard(dispute);
        },
      ),
    );
  }

  Widget _buildDisputeCard(Map<String, dynamic> dispute) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: InkWell(
        onTap: () {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => DisputeDetailPage(disputeId: dispute['id']),
            ),
          );
        },
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Expanded(
                    child: Text(
                      dispute['title'],
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: _getStatusColor(dispute['status']).withOpacity(0.1),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(
                        color: _getStatusColor(dispute['status']),
                      ),
                    ),
                    child: Text(
                      dispute['status'],
                      style: TextStyle(
                        color: _getStatusColor(dispute['status']),
                        fontWeight: FontWeight.bold,
                        fontSize: 12,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Text(
                dispute['description'],
                style: TextStyle(
                  color: Colors.grey[600],
                  height: 1.4,
                ),
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  _buildPriorityChip(dispute['priority']),
                  const SizedBox(width: 8),
                  Text(
                    dispute['category'],
                    style: TextStyle(
                      color: Colors.grey[600],
                      fontSize: 14,
                    ),
                  ),
                  if (dispute['amount'] != null) ...[
                    const SizedBox(width: 8),
                    Text(
                      '\$${dispute['amount']}',
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        color: Colors.green,
                      ),
                    ),
                  ],
                ],
              ),
              const SizedBox(height: 8),
              Row(
                children: [
                  Icon(Icons.person, size: 16, color: Colors.grey[600]),
                  const SizedBox(width: 4),
                  Text(
                    'Initiator: ${dispute['initiator']}',
                    style: TextStyle(
                      color: Colors.grey[600],
                      fontSize: 14,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 4),
              Row(
                children: [
                  Icon(Icons.access_time, size: 16, color: Colors.grey[600]),
                  const SizedBox(width: 4),
                  Text(
                    _formatDate(dispute['createdAt']),
                    style: TextStyle(
                      color: Colors.grey[600],
                      fontSize: 14,
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

  Widget _buildPriorityChip(String priority) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
      decoration: BoxDecoration(
        color: _getPriorityColor(priority).withOpacity(0.1),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(
          color: _getPriorityColor(priority),
        ),
      ),
      child: Text(
        priority,
        style: TextStyle(
          color: _getPriorityColor(priority),
          fontWeight: FontWeight.bold,
          fontSize: 10,
        ),
      ),
    );
  }

  String _formatDate(DateTime date) {
    final now = DateTime.now();
    final difference = now.difference(date);

    if (difference.inDays > 0) {
      return '${difference.inDays}d ago';
    } else if (difference.inHours > 0) {
      return '${difference.inHours}h ago';
    } else if (difference.inMinutes > 0) {
      return '${difference.inMinutes}m ago';
    } else {
      return 'Just now';
    }
  }
}
