import 'package:flutter/material.dart';
<<<<<<< HEAD
import 'package:helios_hash_dao/app_constant.dart';
import 'package:helios_hash_dao/stat_card.dart';
import 'package:helios_hash_dao/project_card.dart';
import 'package:helios_hash_dao/proposal_card.dart';
import 'package:helios_hash_dao/mock_data.dart';
=======
import 'app_constant.dart';
import 'mock_data.dart';
import 'project_card.dart';
import 'proposal_card.dart';
import 'stat_card.dart';

import 'project_model.dart';

import 'proposal_model.dart';
>>>>>>> 9823c84 (chore: sync and clean repo)

class DashboardPage extends StatefulWidget {
  const DashboardPage({super.key});

  @override
  State<DashboardPage> createState() => _DashboardPageState();
}

class _DashboardPageState extends State<DashboardPage> {
  final List<Map<String, dynamic>> _stats = [
    {
      'title': 'Total Members',
      'value': '15,420',
      'icon': Icons.people,
      'color': Colors.blue,
      'change': 12.5,
    },
    {
      'title': 'Active Projects',
      'value': '23',
      'icon': Icons.work,
      'color': Colors.green,
      'change': 8.2,
    },
    {
      'title': 'Treasury Balance',
      'value': '\$2.5M',
      'icon': Icons.account_balance_wallet,
      'color': Colors.purple,
      'change': 15.3,
    },
    {
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
        actions: [
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
            children: [
              // Welcome Section
              Container(
                padding: const EdgeInsets.all(20),
                decoration: const BoxDecoration(
                  color: AppConstants.primaryColor,
                  borderRadius: BorderRadius.only(
                    bottomLeft: Radius.circular(30),
                    bottomRight: Radius.circular(30),
                  ),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
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
<<<<<<< HEAD
                      'Here\'s what\'s happening in your DAO today',
                      style: TextStyle(
                        fontSize: 16,
                        color: Colors.white.withOpacity(0.8),
                      ),
=======
                      "Here's what's happening in your DAO today",
                      style: TextStyle(fontSize: 16, color: Colors.white.withOpacity(0.8)),
>>>>>>> 9823c84 (chore: sync and clean repo)
                    ),
                  ],
                ),
              ),

              // Stats Grid
              Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'DAO Statistics',
                      style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
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
<<<<<<< HEAD
                      itemBuilder: (context, index) {
                        final stat = _stats[index];
=======
                      itemBuilder: (BuildContext context, int index) {
                        final Map<String, dynamic> stat = _stats[index];
>>>>>>> 9823c84 (chore: sync and clean repo)
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
                      children: [
                        const Text(
                          'Recent Projects',
                          style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
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
                        itemBuilder: (BuildContext context, int index) {
                          final Project project = MockData.getMockProjects()[index];
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
                      children: [
                        const Text(
                          'Active Proposals',
                          style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
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
                        .where((Proposal proposal) => proposal.isActive)
                        .take(2)
                        .map(
                          (Proposal proposal) => ProposalCard(
                            proposal: proposal,
                            onTap: () {
                              // Navigate to proposal detail
                            },
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
}
