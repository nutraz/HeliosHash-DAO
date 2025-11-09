import 'package:flutter/material.dart';
import 'package:helios_hash_dao/app_constant.dart';
import 'package:helios_hash_dao/mock_data.dart';
import 'package:helios_hash_dao/project_card.dart';
import 'package:helios_hash_dao/proposal_card.dart';
import 'package:helios_hash_dao/stat_card.dart';

class DashboardPage extends StatefulWidget {
  const DashboardPage({super.key});

  @override
  State<DashboardPage> createState() => _DashboardPageState();
}

class _DashboardPageState extends State<DashboardPage> {
  final List<Map<String, dynamic>> _stats = <Map<String, dynamic>>[
    <String, dynamic>{
      'title': 'Total Members',
      'value': '15,420',
      'icon': Icons.people,
      'color': Colors.blue,
      'change': 12.5,
    },
    <String, dynamic>{
      'title': 'Active Projects',
      'value': '23',
      'icon': Icons.work,
      'color': Colors.green,
      'change': 8.2,
    },
    <String, dynamic>{
      'title': 'Treasury Balance',
      'value': r'$2.5M',
      'icon': Icons.account_balance_wallet,
      'color': Colors.purple,
      'change': 15.3,
    },
    <String, dynamic>{
      'title': 'Active Proposals',
      'value': '8',
      'icon': Icons.gavel,
      'color': Colors.orange,
      'change': -2.1,
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Dashboard'),
        backgroundColor: AppConstants.primaryColor,
        foregroundColor: Colors.white,
        elevation: 0,
        actions: <dynamic>[
          IconButton(
            icon: const Icon(Icons.notifications),
            onPressed: () {
              // Handle notifications
            },
          ),
          IconButton(
            icon: const Icon(Icons.account_circle),
            onPressed: () {
              // Handle profile
            },
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: () async {
          // Refresh dashboard data
          await Future.delayed(const Duration(seconds: 1));
        },
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <dynamic>[
              // Welcome Section
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: AppConstants.primaryColor,
                  borderRadius: const BorderRadius.only(
                    bottomLeft: Radius.circular(30),
                    bottomRight: Radius.circular(30),
                  ),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <dynamic>[
                    const Text(
                      'Welcome back!',
                      style: TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      "Here's what's happening in your DAO today",
                      style: TextStyle(
                        fontSize: 16,
                        color: Colors.white.withOpacity(0.8),
                      ),
                    ),
                  ],
                ),
              ),

              // Stats Grid
              Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <dynamic>[
                    const Text(
                      'DAO Statistics',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 16),
                    GridView.builder(
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                        crossAxisCount: 2,
                        crossAxisSpacing: 16,
                        mainAxisSpacing: 16,
                        childAspectRatio: 1.2,
                      ),
                      itemCount: _stats.length,
                      itemBuilder: (context, index) {
                        final Map<String, dynamic> stat = _stats[index];
                        return StatCard(
                          title: stat['title'],
                          value: stat['value'],
                          icon: stat['icon'],
                          color: stat['color'],
                          change: stat['change'],
                          changeLabel: '%',
                        );
                      },
                    ),

                    const SizedBox(height: 24),

                    // Recent Projects Section
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: <dynamic>[
                        const Text(
                          'Recent Projects',
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        TextButton(
                          onPressed: () {
                            // Navigate to projects page
                          },
                          child: const Text('View All'),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    SizedBox(
                      height: 280,
                      child: ListView.builder(
                        scrollDirection: Axis.horizontal,
                        itemCount: MockData.getMockProjects().length,
                        itemBuilder: (context, index) {
                          final project = MockData.getMockProjects()[index];
                          return Container(
                            width: 300,
                            margin: const EdgeInsets.only(right: 16),
                            child: ProjectCard(
                              project: project,
                              onTap: () {
                                // Navigate to project detail
                              },
                            ),
                          );
                        },
                      ),
                    ),

                    const SizedBox(height: 24),

                    // Active Proposals Section
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: <dynamic>[
                        const Text(
                          'Active Proposals',
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        TextButton(
                          onPressed: () {
                            // Navigate to governance page
                          },
                          child: const Text('View All'),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    ...MockData.getMockProposals()
                        .where((proposal) => proposal.isActive)
                        .take(2)
                        .map((proposal) => ProposalCard(
                              proposal: proposal,
                              onTap: () {
                                // Navigate to proposal detail
                              },
                            )),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
