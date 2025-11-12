import 'package:flutter/material.dart';
<<<<<<< HEAD
import 'package:helios_hash_dao/app_constant.dart';
import 'package:helios_hash_dao/project_model.dart';
import 'package:helios_hash_dao/mock_data.dart';
=======
import 'app_constant.dart';
>>>>>>> 9823c84 (chore: sync and clean repo)

class MyApplicationsPage extends StatefulWidget {
  const MyApplicationsPage({super.key});

  @override
  State<MyApplicationsPage> createState() => _MyApplicationsPageState();
}

class _MyApplicationsPageState extends State<MyApplicationsPage> with TickerProviderStateMixin {
  late TabController _tabController;
  final TextEditingController _searchController = TextEditingController();
  String _searchQuery = '';

  // Mock applications data
  final List<Map<String, dynamic>> _applications = [
    {
      'id': 'APP-001',
      'projectId': '1',
      'projectTitle': 'Decentralized Identity System',
      'status': 'Pending',
      'appliedAt': DateTime.now().subtract(const Duration(days: 2)),
      'role': 'Smart Contract Developer',
      'coverLetter': 'I am excited to contribute to this project...',
      'skills': ['Solidity', 'Web3', 'React'],
      'expectedHours': 20,
      'proposedRate': 50.0,
    },
    {
      'id': 'APP-002',
      'projectId': '2',
      'projectTitle': 'Community Governance Platform',
      'status': 'Under Review',
      'appliedAt': DateTime.now().subtract(const Duration(days: 5)),
      'role': 'UI/UX Designer',
      'coverLetter': 'With my experience in DAO interfaces...',
      'skills': ['Figma', 'User Research', 'Prototyping'],
      'expectedHours': 15,
      'proposedRate': 45.0,
    },
    {
      'id': 'APP-003',
      'projectId': '3',
      'projectTitle': 'Sustainable Finance Protocol',
      'status': 'Accepted',
      'appliedAt': DateTime.now().subtract(const Duration(days: 7)),
      'role': 'Blockchain Analyst',
      'coverLetter': 'My background in DeFi analysis...',
      'skills': ['DeFi', 'Data Analysis', 'Research'],
      'expectedHours': 25,
      'proposedRate': 55.0,
    },
    {
      'id': 'APP-004',
      'projectId': '4',
      'projectTitle': 'Environmental Impact Tracker',
      'status': 'Rejected',
      'appliedAt': DateTime.now().subtract(const Duration(days: 10)),
      'role': 'Full Stack Developer',
      'coverLetter': 'I have extensive experience...',
      'skills': ['React', 'Node.js', 'PostgreSQL'],
      'expectedHours': 30,
      'proposedRate': 60.0,
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

  List<Map<String, dynamic>> _getFilteredApplications() {
    var applications = _applications;

    // Filter by search query
    if (_searchQuery.isNotEmpty) {
      applications = applications.where((application) {
        final projectTitle = application['projectTitle'].toString().toLowerCase();
        final role = application['role'].toString().toLowerCase();
        final query = _searchQuery.toLowerCase();

        return projectTitle.contains(query) || role.contains(query);
      }).toList();
    }

    // Filter by tab
    switch (_tabController.index) {
      case 0: // All Applications
        break;
      case 1: // Pending
<<<<<<< HEAD
        applications = applications.where((app) => app['status'] == 'Pending').toList();
        break;
      case 2: // Under Review
        applications = applications.where((app) => app['status'] == 'Under Review').toList();
        break;
      case 3: // Accepted/Rejected
        applications = applications.where((app) =>
            app['status'] == 'Accepted' || app['status'] == 'Rejected').toList();
        break;
=======
        applications = applications
            .where((Map<String, dynamic> app) => app['status'] == 'Pending')
            .toList();
      case 2: // Under Review
        applications = applications
            .where((Map<String, dynamic> app) => app['status'] == 'Under Review')
            .toList();
      case 3: // Accepted/Rejected
        applications = applications
            .where(
              (Map<String, dynamic> app) =>
                  app['status'] == 'Accepted' || app['status'] == 'Rejected',
            )
            .toList();
>>>>>>> 9823c84 (chore: sync and clean repo)
    }

    return applications;
  }

  Color _getStatusColor(String status) {
    switch (status.toLowerCase()) {
      case 'pending':
        return Colors.orange;
      case 'under review':
        return Colors.blue;
      case 'accepted':
        return Colors.green;
      case 'rejected':
        return Colors.red;
      default:
        return Colors.grey;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('My Applications'),
        backgroundColor: AppConstants.primaryColor,
        foregroundColor: Colors.white,
        elevation: 0,
        bottom: TabBar(
          controller: _tabController,
          isScrollable: true,
          tabs: const [
            Tab(text: 'All'),
            Tab(text: 'Pending'),
            Tab(text: 'Under Review'),
            Tab(text: 'Results'),
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
                hintText: 'Search applications...',
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

          // Applications List
          Expanded(
            child: TabBarView(
              controller: _tabController,
              children: [
                _buildApplicationsList(),
                _buildApplicationsList(),
                _buildApplicationsList(),
                _buildApplicationsList(),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildApplicationsList() {
    final applications = _getFilteredApplications();

    if (applications.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
<<<<<<< HEAD
          children: [
            Icon(
              Icons.work_off,
              size: 64,
              color: Colors.grey[400],
            ),
=======
          children: <dynamic>[
            Icon(Icons.work_off, size: 64, color: Colors.grey[400]),
>>>>>>> 9823c84 (chore: sync and clean repo)
            const SizedBox(height: 16),
            Text('No applications found', style: TextStyle(fontSize: 18, color: Colors.grey[600])),
            const SizedBox(height: 8),
            Text(
              'Try adjusting your search or filters',
              style: TextStyle(fontSize: 14, color: Colors.grey[500]),
            ),
          ],
        ),
      );
    }

    return RefreshIndicator(
      onRefresh: () async {
        // Refresh applications data
        await Future.delayed(const Duration(seconds: 1));
      },
      child: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: applications.length,
<<<<<<< HEAD
        itemBuilder: (context, index) {
          final application = applications[index];
=======
        itemBuilder: (BuildContext context, int index) {
          final Map<String, dynamic> application = applications[index];
>>>>>>> 9823c84 (chore: sync and clean repo)
          return _buildApplicationCard(application);
        },
      ),
    );
  }

  Widget _buildApplicationCard(Map<String, dynamic> application) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: InkWell(
        onTap: () {
          _showApplicationDetailDialog(context, application);
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
                      application['projectTitle'],
                      style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: _getStatusColor(application['status']).withOpacity(0.1),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: _getStatusColor(application['status'])),
                    ),
                    child: Text(
                      application['status'],
                      style: TextStyle(
                        color: _getStatusColor(application['status']),
                        fontWeight: FontWeight.bold,
                        fontSize: 12,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Text(
                'Role: ${application['role']}',
                style: TextStyle(color: Colors.grey[700], fontWeight: FontWeight.w500),
              ),
              const SizedBox(height: 4),
              Row(
                children: [
                  Icon(Icons.access_time, size: 16, color: Colors.grey[600]),
                  const SizedBox(width: 4),
                  Text(
                    '${application['expectedHours']}h/week',
                    style: TextStyle(color: Colors.grey[600], fontSize: 14),
                  ),
                  const SizedBox(width: 16),
                  Icon(Icons.attach_money, size: 16, color: Colors.grey[600]),
                  const SizedBox(width: 4),
                  Text(
                    '\$${application['proposedRate']}/hour',
                    style: TextStyle(color: Colors.grey[600], fontSize: 14),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Text(
                'Applied ${_formatDate(application['appliedAt'])}',
                style: TextStyle(color: Colors.grey[600], fontSize: 14),
              ),
              const SizedBox(height: 8),
              Wrap(
                spacing: 4,
                runSpacing: 4,
                children: (application['skills'] as List<String>).map((skill) {
                  return Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: AppConstants.primaryColor.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      skill,
                      style: const TextStyle(
                        color: AppConstants.primaryColor,
                        fontSize: 12,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  );
                }).toList(),
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _showApplicationDetailDialog(BuildContext context, Map<String, dynamic> application) {
    showDialog(
      context: context,
      builder: (BuildContext context) => AlertDialog(
        title: Text('Application ${application['id']}'),
        content: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              Text('Project: ${application['projectTitle']}'),
              Text('Role: ${application['role']}'),
              Text('Status: ${application['status']}'),
              Text('Applied: ${_formatDateTime(application['appliedAt'])}'),
              Text('Expected Hours: ${application['expectedHours']}h/week'),
              Text('Proposed Rate: \$${application['proposedRate']}/hour'),
              const SizedBox(height: 16),
              const Text('Skills:', style: TextStyle(fontWeight: FontWeight.bold)),
              Text((application['skills'] as List<String>).join(', ')),
              const SizedBox(height: 16),
              const Text('Cover Letter:', style: TextStyle(fontWeight: FontWeight.bold)),
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: Colors.grey[100],
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(application['coverLetter']),
              ),
            ],
          ),
        ),
<<<<<<< HEAD
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Close'),
          ),
=======
        actions: <dynamic>[
          TextButton(onPressed: () => Navigator.of(context).pop(), child: const Text('Close')),
>>>>>>> 9823c84 (chore: sync and clean repo)
          if (application['status'] == 'Pending' || application['status'] == 'Under Review')
            ElevatedButton(
              onPressed: () {
                // Handle withdraw application
                Navigator.of(context).pop();
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.red,
                foregroundColor: Colors.white,
              ),
              child: const Text('Withdraw'),
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

  String _formatDateTime(DateTime dateTime) {
    return '${dateTime.day}/${dateTime.month}/${dateTime.year} at ${dateTime.hour}:${dateTime.minute.toString().padLeft(2, '0')}';
  }
}
