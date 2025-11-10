import 'package:flutter/material.dart';
import 'app_constant.dart';
import 'mock_data.dart';
import 'proposal_card.dart';
import 'proposal_model.dart';

class GovernancePage extends StatefulWidget {
  const GovernancePage({super.key});

  @override
  State<GovernancePage> createState() => _GovernancePageState();
}

class _GovernancePageState extends State<GovernancePage> with TickerProviderStateMixin {
  late TabController _tabController;
  final TextEditingController _searchController = TextEditingController();
  String _searchQuery = '';
  String _selectedCategory = 'All';

  final List<String> _categories = <String>[
    'All',
    'Finance',
    'Governance',
    'Projects',
    'Membership',
    'Other',
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

  List<Proposal> _getFilteredProposals() {
    List<Proposal> proposals = MockData.getMockProposals();

    // Filter by search query
    if (_searchQuery.isNotEmpty) {
      proposals = proposals
          .where(
            (Proposal proposal) =>
                proposal.title.toLowerCase().contains(_searchQuery.toLowerCase()) ||
                proposal.description.toLowerCase().contains(_searchQuery.toLowerCase()) ||
                proposal.tags.any(
                  (String tag) => tag.toLowerCase().contains(_searchQuery.toLowerCase()),
                ),
          )
          .toList();
    }

    // Filter by category
    if (_selectedCategory != 'All') {
      proposals = proposals
          .where((Proposal proposal) => proposal.category == _selectedCategory)
          .toList();
    }

    // Filter by tab
    switch (_tabController.index) {
      case 0: // All Proposals
        break;
      case 1: // Active Proposals
        proposals = proposals.where((Proposal proposal) => proposal.isActive).toList();
      case 2: // Passed Proposals
        proposals = proposals
            .where((Proposal proposal) => proposal.status == ProposalStatus.passed)
            .toList();
      case 3: // Rejected Proposals
        proposals = proposals
            .where((Proposal proposal) => proposal.status == ProposalStatus.rejected)
            .toList();
    }

    return proposals;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Governance'),
        backgroundColor: AppConstants.primaryColor,
        foregroundColor: Colors.white,
        elevation: 0,
        bottom: TabBar(
          controller: _tabController,
          isScrollable: true,
          tabs: const <dynamic>[
            Tab(text: 'All'),
            Tab(text: 'Active'),
            Tab(text: 'Passed'),
            Tab(text: 'Rejected'),
          ],
          onTap: (int index) {
            setState(() {});
          },
        ),
      ),
      body: Column(
        children: <dynamic>[
          // Search and Filter Section
          Container(
            padding: const EdgeInsets.all(16),
            color: Colors.grey[50],
            child: Column(
              children: <dynamic>[
                // Search Bar
                TextField(
                  controller: _searchController,
                  decoration: InputDecoration(
                    hintText: 'Search proposals...',
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

                const SizedBox(height: 12),

                // Category Filter
                SizedBox(
                  height: 40,
                  child: ListView.builder(
                    scrollDirection: Axis.horizontal,
                    itemCount: _categories.length,
                    itemBuilder: (BuildContext context, int index) {
                      final String category = _categories[index];
                      final bool isSelected = category == _selectedCategory;

                      return Container(
                        margin: const EdgeInsets.only(right: 8),
                        child: FilterChip(
                          label: Text(category),
                          selected: isSelected,
                          onSelected: (bool selected) {
                            setState(() {
                              _selectedCategory = selected ? category : 'All';
                            });
                          },
                          backgroundColor: Colors.white,
                          selectedColor: AppConstants.primaryColor.withOpacity(0.2),
                          checkmarkColor: AppConstants.primaryColor,
                        ),
                      );
                    },
                  ),
                ),
              ],
            ),
          ),

          // Proposals List
          Expanded(
            child: TabBarView(
              controller: _tabController,
              children: <dynamic>[
                _buildProposalsList(),
                _buildProposalsList(),
                _buildProposalsList(),
                _buildProposalsList(),
              ],
            ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          // Navigate to create proposal page
        },
        backgroundColor: AppConstants.primaryColor,
        child: const Icon(Icons.add),
      ),
    );
  }

  Widget _buildProposalsList() {
    final List<dynamic> proposals = _getFilteredProposals();

    if (proposals.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <dynamic>[
            Icon(Icons.gavel, size: 64, color: Colors.grey[400]),
            const SizedBox(height: 16),
            Text('No proposals found', style: TextStyle(fontSize: 18, color: Colors.grey[600])),
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
        // Refresh proposals data
        await Future.delayed(const Duration(seconds: 1));
      },
      child: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: proposals.length,
        itemBuilder: (BuildContext context, int index) {
          final proposal = proposals[index];
          return ProposalCard(
            proposal: proposal,
            onTap: () {
              // Navigate to proposal detail page
              _showProposalDetailDialog(context, proposal);
            },
          );
        },
      ),
    );
  }

  void _showProposalDetailDialog(BuildContext context, Proposal proposal) {
    showDialog(
      context: context,
      builder: (BuildContext context) => AlertDialog(
        title: Text(proposal.title),
        content: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: <dynamic>[
              Text(proposal.description),
              const SizedBox(height: 16),
              Text('Type: ${_getProposalTypeText(proposal.type)}'),
              Text('Status: ${proposal.status.toString().split('.').last}'),
              Text('Proposer: ${proposal.proposerId}'),
              Text('Created: ${_formatDate(proposal.createdAt)}'),
              if (proposal.isActive) ...<dynamic>[
                const SizedBox(height: 8),
                Text('Voting ends: ${_formatDate(proposal.votingEndDate)}'),
                Text('Yes votes: ${proposal.yesVotes}'),
                Text('No votes: ${proposal.noVotes}'),
                Text('Abstain votes: ${proposal.abstainVotes}'),
              ],
              if (proposal.parameters != null && proposal.parameters!.isNotEmpty) ...<dynamic>[
                const SizedBox(height: 8),
                const Text('Parameters:', style: TextStyle(fontWeight: FontWeight.bold)),
                ...proposal.parameters!.entries.map(
                  (MapEntry<String, dynamic> entry) => Text('${entry.key}: ${entry.value}'),
                ),
              ],
            ],
          ),
        ),
        actions: <dynamic>[
          TextButton(onPressed: () => Navigator.of(context).pop(), child: const Text('Close')),
          if (proposal.canVote)
            ElevatedButton(
              onPressed: () {
                // Handle voting
                Navigator.of(context).pop();
              },
              child: const Text('Vote'),
            ),
        ],
      ),
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
    return '${date.day}/${date.month}/${date.year}';
  }
}
