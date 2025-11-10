import 'package:flutter/material.dart';
import 'app_constant.dart';

class ProfilePage extends StatefulWidget {
  const ProfilePage({super.key});

  @override
  State<ProfilePage> createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage> with TickerProviderStateMixin {
  late TabController _tabController;

  // Mock user data
  final Map<String, dynamic> _user = <String, dynamic>{
    'name': 'Alice Johnson',
    'email': 'alice.johnson@example.com',
    'avatar': 'A',
    'bio':
        'Passionate about blockchain technology and decentralized governance. Community member since 2023.',
    'joinDate': DateTime(2023, 6, 15),
    'location': 'San Francisco, CA',
    'website': 'https://alicejohnson.dev',
    'skills': <String>['Solidity', 'React', 'Web3', 'DAO Governance', 'Smart Contracts'],
    'stats': <String, num>{
      'projectsContributed': 12,
      'proposalsCreated': 8,
      'votesCast': 156,
      'reputation': 4.8,
    },
    'achievements': <Map<String, dynamic>>[
      <String, dynamic>{
        'name': 'Top Contributor',
        'description': 'Contributed to 10+ projects',
        'icon': Icons.star,
      },
      <String, dynamic>{
        'name': 'Proposal Master',
        'description': 'Created 5+ successful proposals',
        'icon': Icons.gavel,
      },
      <String, dynamic>{
        'name': 'Active Voter',
        'description': 'Voted in 100+ governance decisions',
        'icon': Icons.how_to_vote,
      },
    ],
    'recentActivity': <Map<String, Object>>[
      <String, Object>{
        'type': 'project',
        'title': 'Contributed to Decentralized Identity System',
        'timestamp': DateTime.now().subtract(const Duration(days: 2)),
      },
      <String, Object>{
        'type': 'proposal',
        'title': 'Created proposal: Community Treasury Allocation',
        'timestamp': DateTime.now().subtract(const Duration(days: 5)),
      },
      <String, Object>{
        'type': 'vote',
        'title': 'Voted on Governance Parameter Change',
        'timestamp': DateTime.now().subtract(const Duration(days: 7)),
      },
    ],
  };

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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Profile'),
        backgroundColor: AppConstants.primaryColor,
        foregroundColor: Colors.white,
        actions: <dynamic>[
          IconButton(
            icon: const Icon(Icons.edit),
            onPressed: () {
              // Navigate to edit profile
            },
          ),
          IconButton(
            icon: const Icon(Icons.settings),
            onPressed: () {
              // Navigate to settings
            },
          ),
        ],
      ),
      body: NestedScrollView(
        headerSliverBuilder: (BuildContext context, bool innerBoxIsScrolled) {
          return <dynamic>[
            SliverToBoxAdapter(child: _buildProfileHeader()),
            SliverPersistentHeader(
              pinned: true,
              delegate: _SliverAppBarDelegate(
                TabBar(
                  controller: _tabController,
                  tabs: const <dynamic>[
                    Tab(text: 'Overview'),
                    Tab(text: 'Activity'),
                    Tab(text: 'Achievements'),
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
          children: <dynamic>[_buildOverviewTab(), _buildActivityTab(), _buildAchievementsTab()],
        ),
      ),
    );
  }

  Widget _buildProfileHeader() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: const BoxDecoration(
        color: AppConstants.primaryColor,
        borderRadius: BorderRadius.only(
          bottomLeft: Radius.circular(30),
          bottomRight: Radius.circular(30),
        ),
      ),
      child: Column(
        children: <dynamic>[
          // Avatar
          CircleAvatar(
            radius: 50,
            backgroundColor: Colors.white,
            child: Text(
              _user['avatar'],
              style: const TextStyle(
                fontSize: 36,
                fontWeight: FontWeight.bold,
                color: AppConstants.primaryColor,
              ),
            ),
          ),

          const SizedBox(height: 16),

          // Name and Email
          Text(
            _user['name'],
            style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Colors.white),
          ),

          const SizedBox(height: 4),

          Text(
            _user['email'],
            style: TextStyle(fontSize: 16, color: Colors.white.withOpacity(0.8)),
          ),

          const SizedBox(height: 12),

          // Bio
          Text(
            _user['bio'],
            style: TextStyle(fontSize: 14, color: Colors.white.withOpacity(0.9), height: 1.4),
            textAlign: TextAlign.center,
          ),

          const SizedBox(height: 16),

          // Location and Join Date
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: <dynamic>[
              Icon(Icons.location_on, size: 16, color: Colors.white.withOpacity(0.8)),
              const SizedBox(width: 4),
              Text(
                _user['location'],
                style: TextStyle(fontSize: 14, color: Colors.white.withOpacity(0.8)),
              ),
              const SizedBox(width: 16),
              Icon(Icons.calendar_today, size: 16, color: Colors.white.withOpacity(0.8)),
              const SizedBox(width: 4),
              Text(
                'Joined ${_formatDate(_user['joinDate'])}',
                style: TextStyle(fontSize: 14, color: Colors.white.withOpacity(0.8)),
              ),
            ],
          ),

          if (_user['website'] != null) ...<dynamic>[
            const SizedBox(height: 8),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: <dynamic>[
                Icon(Icons.link, size: 16, color: Colors.white.withOpacity(0.8)),
                const SizedBox(width: 4),
                Text(
                  _user['website'],
                  style: TextStyle(
                    fontSize: 14,
                    color: Colors.white.withOpacity(0.8),
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
        children: <dynamic>[
          // Stats Grid
          const Text('Statistics', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
          const SizedBox(height: 16),
          GridView.count(
            crossAxisCount: 2,
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            crossAxisSpacing: 16,
            mainAxisSpacing: 16,
            children: <dynamic>[
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
            style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 16),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: (_user['skills'] as List<String>).map((String skill) {
              return Chip(
                label: Text(skill),
                backgroundColor: AppConstants.primaryColor.withOpacity(0.1),
                labelStyle: const TextStyle(color: AppConstants.primaryColor),
              );
            }).toList(),
          ),
        ],
      ),
    );
  }

  Widget _buildActivityTab() {
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: _user['recentActivity'].length,
      itemBuilder: (BuildContext context, int index) {
        final activity = _user['recentActivity'][index];
        return Card(
          margin: const EdgeInsets.only(bottom: 8),
          child: ListTile(
            leading: Icon(_getActivityIcon(activity['type']), color: AppConstants.primaryColor),
            title: Text(activity['title']),
            subtitle: Text(_formatDate(activity['timestamp'])),
            trailing: const Icon(Icons.arrow_forward_ios, size: 16),
            onTap: () {
              // Navigate to activity detail
            },
          ),
        );
      },
    );
  }

  Widget _buildAchievementsTab() {
    return GridView.builder(
      padding: const EdgeInsets.all(16),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        crossAxisSpacing: 16,
        mainAxisSpacing: 16,
        childAspectRatio: 1.2,
      ),
      itemCount: _user['achievements'].length,
      itemBuilder: (BuildContext context, int index) {
        final achievement = _user['achievements'][index];
        return Card(
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: <dynamic>[
                Icon(achievement['icon'], size: 32, color: AppConstants.primaryColor),
                const SizedBox(height: 8),
                Text(
                  achievement['name'],
                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 4),
                Text(
                  achievement['description'],
                  style: TextStyle(fontSize: 12, color: Colors.grey[600]),
                  textAlign: TextAlign.center,
                ),
              ],
            ),
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
          children: <dynamic>[
            Icon(icon, size: 32, color: color),
            const SizedBox(height: 8),
            Text(value, style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
            const SizedBox(height: 4),
            Text(title, style: TextStyle(fontSize: 14, color: Colors.grey[600])),
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
      default:
        return Icons.info;
    }
  }

  String _formatDate(DateTime date) {
    final DateTime now = DateTime.now();
    final Duration difference = now.difference(date);

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
  _SliverAppBarDelegate(this.tabBar);
  final TabBar tabBar;

  @override
  double get minExtent => tabBar.preferredSize.height;

  @override
  double get maxExtent => tabBar.preferredSize.height;

  @override
  Widget build(BuildContext context, double shrinkOffset, bool overlapsContent) {
    return ColoredBox(color: Colors.white, child: tabBar);
  }

  @override
  bool shouldRebuild(_SliverAppBarDelegate oldDelegate) {
    return false;
  }
}
