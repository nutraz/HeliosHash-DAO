import 'package:flutter/material.dart';
import 'package:helios_hash_dao/app_constant.dart';

class UserProfilePage extends StatefulWidget {
  final String userId;

  const UserProfilePage({super.key, required this.userId});

  @override
  State<UserProfilePage> createState() => _UserProfilePageState();
}

class _UserProfilePageState extends State<UserProfilePage> with TickerProviderStateMixin {
  late TabController _tabController;

  // Mock user data - in real app, fetch based on userId
  final Map<String, dynamic> _user = {
    'id': 'user-123',
    'name': 'Bob Smith',
    'email': 'bob.smith@example.com',
    'avatar': 'B',
    'bio': 'Full-stack developer passionate about Web3 and decentralized technologies. Love building tools that empower communities.',
    'joinDate': DateTime(2023, 3, 10),
    'location': 'New York, NY',
    'website': 'https://bobsmith.dev',
    'skills': ['React', 'Node.js', 'Solidity', 'TypeScript', 'Web3', 'Smart Contracts', 'DeFi'],
    'stats': {
      'projectsContributed': 8,
      'proposalsCreated': 5,
      'votesCast': 89,
      'reputation': 4.6,
    },
    'achievements': [
      {'name': 'Code Contributor', 'description': 'Contributed to 5+ projects', 'icon': Icons.code},
      {'name': 'Proposal Creator', 'description': 'Created 3+ proposals', 'icon': Icons.lightbulb},
      {'name': 'Active Member', 'description': 'Voted in 50+ decisions', 'icon': Icons.verified},
    ],
    'recentActivity': [
      {
        'type': 'project',
        'title': 'Contributed to Community Governance Platform',
        'timestamp': DateTime.now().subtract(const Duration(days: 1)),
      },
      {
        'type': 'proposal',
        'title': 'Created proposal: Developer Incentive Program',
        'timestamp': DateTime.now().subtract(const Duration(days: 3)),
      },
      {
        'type': 'vote',
        'title': 'Voted on Treasury Allocation Proposal',
        'timestamp': DateTime.now().subtract(const Duration(days: 5)),
      },
      {
        'type': 'comment',
        'title': 'Commented on Sustainable Finance Protocol',
        'timestamp': DateTime.now().subtract(const Duration(days: 7)),
      },
    ],
    'projects': [
      {
        'id': '1',
        'title': 'Decentralized Identity System',
        'role': 'Frontend Developer',
        'status': 'Active',
      },
      {
        'id': '2',
        'title': 'Community Governance Platform',
        'role': 'Full Stack Developer',
        'status': 'Completed',
      },
    ],
  };

  bool _isFollowing = false;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  void _toggleFollow() {
    setState(() {
      _isFollowing = !_isFollowing;
    });

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(_isFollowing ? 'Following ${_user['name']}' : 'Unfollowed ${_user['name']}'),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(_user['name']),
        backgroundColor: AppConstants.primaryColor,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.more_vert),
            onPressed: () {
              // Show options menu
            },
          ),
        ],
      ),
      body: NestedScrollView(
        headerSliverBuilder: (context, innerBoxIsScrolled) {
          return [
            SliverToBoxAdapter(
              child: _buildProfileHeader(),
            ),
            SliverPersistentHeader(
              pinned: true,
              delegate: _SliverAppBarDelegate(
                TabBar(
                  controller: _tabController,
                  tabs: const [
                    Tab(text: 'Overview'),
                    Tab(text: 'Activity'),
                    Tab(text: 'Projects'),
                  ],
                  labelColor: AppConstants.primaryColor,
                  unselectedLabelColor: Colors.grey,
                  indicatorColor: AppConstants.primaryColor,
                ),
              ),
            ),
          ];
        },
        body: TabBarView(
          controller: _tabController,
          children: [
            _buildOverviewTab(),
            _buildActivityTab(),
            _buildProjectsTab(),
          ],
        ),
      ),
    );
  }

  Widget _buildProfileHeader() {
    return Container(
      padding: const EdgeInsets.all(20),
      color: Colors.white,
      child: Column(
        children: [
          // Avatar
          CircleAvatar(
            radius: 50,
            backgroundColor: AppConstants.primaryColor.withOpacity(0.2),
            child: Text(
              _user['avatar'],
              style: TextStyle(
                fontSize: 36,
                fontWeight: FontWeight.bold,
                color: AppConstants.primaryColor,
              ),
            ),
          ),

          const SizedBox(height: 16),

          // Name and Follow Button
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                _user['name'],
                style: const TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(width: 16),
              ElevatedButton(
                onPressed: _toggleFollow,
                style: ElevatedButton.styleFrom(
                  backgroundColor: _isFollowing ? Colors.grey : AppConstants.primaryColor,
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(20),
                  ),
                ),
                child: Text(_isFollowing ? 'Following' : 'Follow'),
              ),
            ],
          ),

          const SizedBox(height: 8),

          // Bio
          Text(
            _user['bio'],
            style: TextStyle(
              fontSize: 14,
              color: Colors.grey[600],
              height: 1.4,
            ),
            textAlign: TextAlign.center,
          ),

          const SizedBox(height: 16),

          // Location and Join Date
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.location_on, size: 16, color: Colors.grey[600]),
              const SizedBox(width: 4),
              Text(
                _user['location'],
                style: TextStyle(
                  fontSize: 14,
                  color: Colors.grey[600],
                ),
              ),
              const SizedBox(width: 16),
              Icon(Icons.calendar_today, size: 16, color: Colors.grey[600]),
              const SizedBox(width: 4),
              Text(
                'Joined ${_formatDate(_user['joinDate'])}',
                style: TextStyle(
                  fontSize: 14,
                  color: Colors.grey[600],
                ),
              ),
            ],
          ),

          if (_user['website'] != null) ...[
            const SizedBox(height: 8),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(Icons.link, size: 16, color: Colors.grey[600]),
                const SizedBox(width: 4),
                Text(
                  _user['website'],
                  style: TextStyle(
                    fontSize: 14,
                    color: Colors.grey[600],
                    decoration: TextDecoration.underline,
                  ),
                ),
              ],
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildOverviewTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Stats Grid
          const Text(
            'Statistics',
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 16),
          GridView.count(
            crossAxisCount: 2,
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            crossAxisSpacing: 16,
            mainAxisSpacing: 16,
            children: [
              _buildStatCard(
                'Projects',
                _user['stats']['projectsContributed'].toString(),
                Icons.work,
                Colors.blue,
              ),
              _buildStatCard(
                'Proposals',
                _user['stats']['proposalsCreated'].toString(),
                Icons.gavel,
                Colors.green,
              ),
              _buildStatCard(
                'Votes',
                _user['stats']['votesCast'].toString(),
                Icons.how_to_vote,
                Colors.orange,
              ),
              _buildStatCard(
                'Reputation',
                _user['stats']['reputation'].toString(),
                Icons.star,
                Colors.purple,
              ),
            ],
          ),

          const SizedBox(height: 24),

          // Skills
          const Text(
            'Skills & Expertise',
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 16),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: (_user['skills'] as List<String>).map((skill) {
              return Chip(
                label: Text(skill),
                backgroundColor: AppConstants.primaryColor.withOpacity(0.1),
                labelStyle: TextStyle(color: AppConstants.primaryColor),
              );
            }).toList(),
          ),

          const SizedBox(height: 24),

          // Achievements
          const Text(
            'Achievements',
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 16),
          ...(_user['achievements'] as List<Map<String, dynamic>>).map((achievement) {
            return Card(
              margin: const EdgeInsets.only(bottom: 8),
              child: ListTile(
                leading: Icon(
                  achievement['icon'],
                  color: AppConstants.primaryColor,
                ),
                title: Text(achievement['name']),
                subtitle: Text(achievement['description']),
              ),
            );
          }),
        ],
      ),
    );
  }

  Widget _buildActivityTab() {
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: _user['recentActivity'].length,
      itemBuilder: (context, index) {
        final activity = _user['recentActivity'][index];
        return Card(
          margin: const EdgeInsets.only(bottom: 8),
          child: ListTile(
            leading: Icon(
              _getActivityIcon(activity['type']),
              color: AppConstants.primaryColor,
            ),
            title: Text(activity['title']),
            subtitle: Text(_formatDate(activity['timestamp'])),
            trailing: Icon(Icons.arrow_forward_ios, size: 16),
            onTap: () {
              // Navigate to activity detail
            },
          ),
        );
      },
    );
  }

  Widget _buildProjectsTab() {
    final projects = _user['projects'] as List<Map<String, dynamic>>;

    if (projects.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.work_off,
              size: 64,
              color: Colors.grey[400],
            ),
            const SizedBox(height: 16),
            Text(
              'No projects yet',
              style: TextStyle(
                fontSize: 18,
                color: Colors.grey[600],
              ),
            ),
          ],
        ),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: projects.length,
      itemBuilder: (context, index) {
        final project = projects[index];
        return Card(
          margin: const EdgeInsets.only(bottom: 8),
          child: ListTile(
            title: Text(project['title']),
            subtitle: Text('Role: ${project['role']}'),
            trailing: Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(
                color: project['status'] == 'Active' ? Colors.green.withOpacity(0.1) : Colors.grey.withOpacity(0.1),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: project['status'] == 'Active' ? Colors.green : Colors.grey,
                ),
              ),
              child: Text(
                project['status'],
                style: TextStyle(
                  color: project['status'] == 'Active' ? Colors.green : Colors.grey,
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
            onTap: () {
              // Navigate to project detail
            },
          ),
        );
      },
    );
  }

  Widget _buildStatCard(String title, String value, IconData icon, Color color) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, size: 32, color: color),
            const SizedBox(height: 8),
            Text(
              value,
              style: const TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              title,
              style: TextStyle(
                fontSize: 14,
                color: Colors.grey[600],
              ),
            ),
          ],
        ),
      ),
    );
  }

  IconData _getActivityIcon(String type) {
    switch (type) {
      case 'project':
        return Icons.work;
      case 'proposal':
        return Icons.gavel;
      case 'vote':
        return Icons.how_to_vote;
      case 'comment':
        return Icons.comment;
      default:
        return Icons.info;
    }
  }

  String _formatDate(DateTime date) {
    final now = DateTime.now();
    final difference = now.difference(date);

    if (difference.inDays > 0) {
      return '${difference.inDays} days ago';
    } else if (difference.inHours > 0) {
      return '${difference.inHours} hours ago';
    } else if (difference.inMinutes > 0) {
      return '${difference.inMinutes} minutes ago';
    } else {
      return 'Just now';
    }
  }
}

class _SliverAppBarDelegate extends SliverPersistentHeaderDelegate {
  final TabBar tabBar;

  _SliverAppBarDelegate(this.tabBar);

  @override
  double get minExtent => tabBar.preferredSize.height;

  @override
  double get maxExtent => tabBar.preferredSize.height;

  @override
  Widget build(BuildContext context, double shrinkOffset, bool overlapsContent) {
    return Container(
      color: Colors.white,
      child: tabBar,
    );
  }

  @override
  bool shouldRebuild(_SliverAppBarDelegate oldDelegate) {
    return false;
  }
}
