import 'package:flutter/material.dart';
import 'app_constant.dart';

class ModerationPage extends StatefulWidget {
  const ModerationPage({super.key});

  @override
  State<ModerationPage> createState() => _ModerationPageState();
}

class _ModerationPageState extends State<ModerationPage> with TickerProviderStateMixin {
  late TabController _tabController;
  final TextEditingController _searchController = TextEditingController();
  String _searchQuery = '';

  final List<Map<String, dynamic>> _reports = [
    {
      'id': 'REP-001',
      'type': 'Post',
      'title': 'Inappropriate content in community post',
      'description': 'Post contains offensive language and violates community guidelines.',
      'reportedBy': 'Alice Johnson',
      'reportedUser': 'Bob Smith',
      'status': 'Pending',
      'priority': 'High',
      'category': 'Harassment',
      'createdAt': DateTime.now().subtract(const Duration(hours: 2)),
      'content': 'This is the reported post content...',
    },
    {
      'id': 'REP-002',
      'type': 'Comment',
      'title': 'Spam comment on proposal',
      'description': 'Multiple identical comments promoting external service.',
      'reportedBy': 'Carol Davis',
      'reportedUser': 'David Wilson',
      'status': 'Under Review',
      'priority': 'Medium',
      'category': 'Spam',
      'createdAt': DateTime.now().subtract(const Duration(hours: 5)),
      'content': 'Check out my amazing service at...',
    },
    {
      'id': 'REP-003',
      'type': 'User',
      'title': 'Suspicious account activity',
      'description': 'User creating multiple accounts to manipulate voting.',
      'reportedBy': 'Eve Martinez',
      'reportedUser': 'Frank Garcia',
      'status': 'Resolved',
      'priority': 'High',
      'category': 'Voting Manipulation',
      'createdAt': DateTime.now().subtract(const Duration(days: 1)),
      'content': null,
    },
  ];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    _searchController.dispose();
    super.dispose();
  }

  List<Map<String, dynamic>> _getFilteredReports() {
    var reports = _reports;

    // Filter by search query
    if (_searchQuery.isNotEmpty) {
      reports = reports.where((report) {
        final title = report['title'].toString().toLowerCase();
        final description = report['description'].toString().toLowerCase();
        final reportedUser = report['reportedUser'].toString().toLowerCase();
        final query = _searchQuery.toLowerCase();

        return title.contains(query) || description.contains(query) || reportedUser.contains(query);
      }).toList();
    }

    // Filter by tab
    switch (_tabController.index) {
      case 0: // All Reports
        break;
      case 1: // Pending
<<<<<<< HEAD
        reports = reports.where((report) => report['status'] == 'Pending').toList();
        break;
      case 2: // Under Review
        reports = reports.where((report) => report['status'] == 'Under Review').toList();
        break;
=======
        reports = reports
            .where((Map<String, dynamic> report) => report['status'] == 'Pending')
            .toList();
      case 2: // Under Review
        reports = reports
            .where((Map<String, dynamic> report) => report['status'] == 'Under Review')
            .toList();
>>>>>>> 9823c84 (chore: sync and clean repo)
    }

    return reports;
  }

  Color _getStatusColor(String status) {
    switch (status.toLowerCase()) {
      case 'pending':
        return Colors.orange;
      case 'under review':
        return Colors.blue;
      case 'resolved':
        return Colors.green;
      case 'dismissed':
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
        title: const Text('Moderation'),
        backgroundColor: AppConstants.primaryColor,
        foregroundColor: Colors.white,
        elevation: 0,
        bottom: TabBar(
          controller: _tabController,
          tabs: const [
            Tab(text: 'All'),
            Tab(text: 'Pending'),
            Tab(text: 'Under Review'),
          ],
          onTap: (int index) {
            setState(() {});
          },
        ),
      ),
      body: Column(
        children: [
          // Search Section
          Container(
            padding: const EdgeInsets.all(16),
            color: Colors.grey[50],
            child: TextField(
              controller: _searchController,
              decoration: InputDecoration(
                hintText: 'Search reports...',
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
              onChanged: (String value) {
                setState(() {
                  _searchQuery = value;
                });
              },
            ),
          ),

          // Reports List
          Expanded(
            child: TabBarView(
              controller: _tabController,
<<<<<<< HEAD
              children: [
                _buildReportsList(),
                _buildReportsList(),
                _buildReportsList(),
              ],
=======
              children: <dynamic>[_buildReportsList(), _buildReportsList(), _buildReportsList()],
>>>>>>> 9823c84 (chore: sync and clean repo)
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildReportsList() {
    final reports = _getFilteredReports();

    if (reports.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
<<<<<<< HEAD
          children: [
            Icon(
              Icons.report_problem,
              size: 64,
              color: Colors.grey[400],
            ),
=======
          children: <dynamic>[
            Icon(Icons.report_problem, size: 64, color: Colors.grey[400]),
>>>>>>> 9823c84 (chore: sync and clean repo)
            const SizedBox(height: 16),
            Text('No reports found', style: TextStyle(fontSize: 18, color: Colors.grey[600])),
            const SizedBox(height: 8),
            Text(
              'All reports have been handled',
              style: TextStyle(fontSize: 14, color: Colors.grey[500]),
            ),
          ],
        ),
      );
    }

    return RefreshIndicator(
      onRefresh: () async {
        // Refresh reports data
        await Future.delayed(const Duration(seconds: 1));
      },
      child: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: reports.length,
<<<<<<< HEAD
        itemBuilder: (context, index) {
          final report = reports[index];
=======
        itemBuilder: (BuildContext context, int index) {
          final Map<String, dynamic> report = reports[index];
>>>>>>> 9823c84 (chore: sync and clean repo)
          return _buildReportCard(report);
        },
      ),
    );
  }

  Widget _buildReportCard(Map<String, dynamic> report) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: InkWell(
        onTap: () {
          _showReportDetailDialog(context, report);
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
                      report['title'],
                      style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: _getStatusColor(report['status']).withOpacity(0.1),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: _getStatusColor(report['status'])),
                    ),
                    child: Text(
                      report['status'],
                      style: TextStyle(
                        color: _getStatusColor(report['status']),
                        fontWeight: FontWeight.bold,
                        fontSize: 12,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Text(
                report['description'],
                style: TextStyle(color: Colors.grey[600], height: 1.4),
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  _buildPriorityChip(report['priority']),
                  const SizedBox(width: 8),
                  Text(report['category'], style: TextStyle(color: Colors.grey[600], fontSize: 14)),
                  const SizedBox(width: 8),
                  Text(
                    report['type'],
                    style: const TextStyle(
                      color: AppConstants.primaryColor,
                      fontWeight: FontWeight.bold,
                      fontSize: 14,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Row(
                children: [
                  Icon(Icons.person, size: 16, color: Colors.grey[600]),
                  const SizedBox(width: 4),
                  Text(
                    'Reported: ${report['reportedUser']}',
                    style: TextStyle(color: Colors.grey[600], fontSize: 14),
                  ),
                  const SizedBox(width: 16),
                  Icon(Icons.access_time, size: 16, color: Colors.grey[600]),
                  const SizedBox(width: 4),
                  Text(
                    _formatDate(report['createdAt']),
                    style: TextStyle(color: Colors.grey[600], fontSize: 14),
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
        border: Border.all(color: _getPriorityColor(priority)),
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

  void _showReportDetailDialog(BuildContext context, Map<String, dynamic> report) {
    showDialog(
      context: context,
      builder: (BuildContext context) => AlertDialog(
        title: Text('Report ${report['id']}'),
        content: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              Text('Type: ${report['type']}'),
              Text('Category: ${report['category']}'),
              Text('Priority: ${report['priority']}'),
              Text('Reported by: ${report['reportedBy']}'),
              Text('Reported user: ${report['reportedUser']}'),
              const SizedBox(height: 16),
              const Text('Description:', style: TextStyle(fontWeight: FontWeight.bold)),
              Text(report['description']),
              if (report['content'] != null) ...[
                const SizedBox(height: 16),
                const Text('Reported Content:', style: TextStyle(fontWeight: FontWeight.bold)),
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: Colors.grey[100],
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(report['content']),
                ),
              ],
            ],
          ),
        ),
<<<<<<< HEAD
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Dismiss'),
          ),
=======
        actions: <dynamic>[
          TextButton(onPressed: () => Navigator.of(context).pop(), child: const Text('Dismiss')),
>>>>>>> 9823c84 (chore: sync and clean repo)
          ElevatedButton(
            onPressed: () {
              // Handle take action
              Navigator.of(context).pop();
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.red,
              foregroundColor: Colors.white,
            ),
            child: const Text('Take Action'),
          ),
        ],
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
