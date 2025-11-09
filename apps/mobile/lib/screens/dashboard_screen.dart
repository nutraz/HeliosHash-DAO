import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:helioshash_dao/l10n/app_localizations.dart';
import 'package:helioshash_dao/models/project/solar_project.dart';
import 'package:helioshash_dao/providers/dao_provider.dart';
import 'package:helioshash_dao/providers/governance_provider.dart';
import 'package:helioshash_dao/providers/wallet_provider.dart';
import 'package:helioshash_dao/widgets/create_proposal_dialog.dart';
import 'package:helioshash_dao/widgets/energy_chart.dart';
import 'package:helioshash_dao/widgets/project_card.dart';
import 'package:helioshash_dao/widgets/proposal_card.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({Key? key}) : super(key: key);

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> with TickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 4, vsync: this);
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
  title: const Text('HeliosHash DAO Dashboard'),
        backgroundColor: Colors.green.shade700,
        actions: <dynamic>[
              Padding(
                padding: const EdgeInsets.all(8.0),
                child: SvgPicture.asset(
                  'assets/icons/hhdaologo.svg',
                  height: 32,
                  width: 32,
                  fit: BoxFit.contain,
                  placeholderBuilder: (context) => const Icon(Icons.broken_image, color: Colors.white),
                ),
              ),
          IconButton(
            icon: const Icon(Icons.settings),
            onPressed: () {
              Navigator.pushNamed(context, '/settings');
            },
          ),
        ],
        bottom: TabBar(
          controller: _tabController,
          tabs: const <dynamic>[
            Tab(icon: Icon(Icons.dashboard), text: 'Overview'),
            Tab(icon: Icon(Icons.business), text: 'Projects'),
            Tab(icon: Icon(Icons.gavel), text: 'Governance'),
            Tab(icon: Icon(Icons.account_balance_wallet), text: 'Wallet'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: <dynamic>[
          _buildOverviewTab(),
          _buildProjectsTab(),
          _buildGovernanceTab(),
          _buildWalletTab(),
        ],
      ),
      drawer: _buildDrawer(),
    );
  }

  Widget _buildOverviewTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <dynamic>[
          const Text(
            'DAO Overview',
            style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 20),
          Row(
            children: <dynamic>[
              Expanded(
                child: Card(
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      children: <dynamic>[
                        const Icon(Icons.people, size: 48, color: Colors.green),
                        const SizedBox(height: 8),
                        const Text('Total Members'),
                        Text(
                          '1,247',
                          style: Theme.of(context).textTheme.headlineSmall,
                        ),
                      ],
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Card(
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      children: <dynamic>[
                        const Icon(Icons.business, size: 48, color: Colors.blue),
                        const SizedBox(height: 8),
                        const Text('Active Projects'),
                        Text(
                          '23',
                          style: Theme.of(context).textTheme.headlineSmall,
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),
          const Text(
            'Energy Generation',
            style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 10),
          const EnergyChart(),
          const SizedBox(height: 20),
          const Text(
            'Recent Activity',
            style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 10),
          Card(
            child: ListTile(
              leading: const Icon(Icons.check_circle, color: Colors.green),
              title: const Text('Solar Farm Project Approved'),
              subtitle: const Text('2 hours ago'),
            ),
          ),
          Card(
            child: ListTile(
              leading: const Icon(Icons.thumb_up, color: Colors.blue),
              title: const Text('New Proposal Submitted'),
              subtitle: const Text('5 hours ago'),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildProjectsTab() {
    return GridView.builder(
      padding: const EdgeInsets.all(16.0),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        crossAxisSpacing: 16.0,
        mainAxisSpacing: 16.0,
        childAspectRatio: 0.75,
      ),
      itemCount: 6,
      itemBuilder: (context, index) {
        // Mock project data for dashboard
        final mockProject = SolarProject(
          id: 'mock_${index + 1}',
          name: 'Solar Project ${index + 1}',
          location: 'Location ${index + 1}',
          status: index % 3 == 0 ? ProjectStatus.active : index % 3 == 1 ? ProjectStatus.pending : ProjectStatus.completed,
          capacity: (index + 1) * 50.0,
          currentGeneration: (index + 1) * 25.0,
          totalGeneration: (index + 1) * 100.0,
          efficiency: 85 + (index % 5),
          installDate: DateTime.now().subtract(Duration(days: 365 * (index + 1))),
          investment: BigInt.from((index + 1) * 100),
          returns: BigInt.from((index + 1) * 20),
          investors: (index + 1) * 10,
          imageUrl: '',
        );
        return ProjectCard(
          project: mockProject,
          onTap: () => _showProjectDetails(context, mockProject),
        );
      },
    );
  }

  Widget _buildGovernanceTab() {
    return Consumer<GovernanceProvider>(
      builder: (context, governanceProvider, child) {
        return ListView(
          padding: const EdgeInsets.all(16.0),
          children: <dynamic>[
            const Text(
              'Active Proposals',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 10),
            ...governanceProvider.proposals.map((proposal) => ProposalCard(
              proposal: proposal,
              onVote: (choice) => governanceProvider.vote(proposal.id, choice),
            )),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: () => _showCreateProposalDialog(context),
              child: const Text('Create New Proposal'),
            ),
          ],
        );
      },
    );
  }

  Widget _buildWalletTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <dynamic>[
          const Text(
            'Wallet Balance',
            style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 20),
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                children: <dynamic>[
                  const Text('Total Balance'),
                  Text(
                    '1,250.75 HHDAO',
                    style: Theme.of(context).textTheme.headlineMedium,
                  ),
                  const SizedBox(height: 10),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: <dynamic>[
                      ElevatedButton(
                        onPressed: () {},
                        child: const Text('Send'),
                      ),
                      ElevatedButton(
                        onPressed: () {},
                        child: const Text('Receive'),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 20),
          const Text(
            'Recent Transactions',
            style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 10),
          Card(
            child: ListTile(
              leading: const Icon(Icons.arrow_upward, color: Colors.red),
              title: const Text('Sent to Project Investment'),
              subtitle: const Text('2 days ago'),
              trailing: const Text('-50.00 HHDAO'),
            ),
          ),
          Card(
            child: ListTile(
              leading: const Icon(Icons.arrow_downward, color: Colors.green),
              title: const Text('Received Rewards'),
              subtitle: const Text('1 week ago'),
              trailing: const Text('+25.50 HHDAO'),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDrawer() {
    final l10n = AppLocalizations.of(context);
    return Drawer(
      child: ListView(
        padding: EdgeInsets.zero,
        children: <dynamic>[
          DrawerHeader(
            decoration: const BoxDecoration(
              color: Colors.green,
            ),
            child: Text(
              l10n?.appTitle ?? 'HeliosHash DAO',
              style: const TextStyle(
                color: Colors.white,
                fontSize: 24,
              ),
            ),
          ),
          ListTile(
            leading: const Icon(Icons.dashboard),
            title: const Text('Dashboard'),
            onTap: () {
              Navigator.pop(context);
              _tabController.animateTo(0);
            },
          ),
          ListTile(
            leading: const Icon(Icons.business),
            title: const Text('Projects'),
            onTap: () {
              Navigator.pop(context);
              _tabController.animateTo(1);
            },
          ),
          ListTile(
            leading: const Icon(Icons.add_circle),
            title: const Text('Create Project'),
            onTap: () {
              Navigator.pop(context);
              Navigator.pushNamed(context, '/create-project');
            },
          ),
          ListTile(
            leading: const Icon(Icons.gavel),
            title: const Text('Governance'),
            onTap: () {
              Navigator.pop(context);
              _tabController.animateTo(2);
            },
          ),
          ListTile(
            leading: const Icon(Icons.account_balance_wallet),
            title: const Text('Wallet'),
            onTap: () {
              Navigator.pop(context);
              _tabController.animateTo(3);
            },
          ),
          ListTile(
            leading: const Icon(Icons.card_giftcard),
            title: const Text('Rewards Exchange'),
            onTap: () {
              Navigator.pop(context);
              Navigator.pushNamed(context, '/rewards-exchange');
            },
          ),
          const Divider(),
          ListTile(
            leading: const Icon(Icons.person),
            title: const Text('Profile'),
            onTap: () {
              Navigator.pushNamed(context, '/profile');
            },
          ),
          ListTile(
            leading: const Icon(Icons.settings),
            title: Text(l10n?.settings ?? 'Settings'),
            onTap: () {
              Navigator.pop(context);
              Navigator.pushNamed(context, '/settings');
            },
          ),
          ListTile(
            leading: const Icon(Icons.logout),
            title: const Text('Logout'),
            onTap: () {
              // Handle logout
            },
          ),
        ],
      ),
    );
  }

  void _showCreateProposalDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return const CreateProposalDialog();
      },
    );
  }

  void _showProjectDetails(BuildContext context, SolarProject project) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) => ProjectDetailsSheet(project: project),
    );
  }
}

class ProjectDetailsSheet extends StatefulWidget {

  const ProjectDetailsSheet({Key? key, required this.project}) : super(key: key);
  final SolarProject project;

  @override
  State<ProjectDetailsSheet> createState() => _ProjectDetailsSheetState();
}

class _ProjectDetailsSheetState extends State<ProjectDetailsSheet> {
  final TextEditingController _amountController = TextEditingController();

  @override
  void dispose() {
    _amountController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final walletProvider = context.watch<WalletProvider>();
    final numberFormat = NumberFormat('#,##0.##');

    return DraggableScrollableSheet(
      initialChildSize: 0.9,
      minChildSize: 0.5,
      maxChildSize: 0.95,
      expand: false,
      builder: (context, scrollController) {
        return SingleChildScrollView(
          controller: scrollController,
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <dynamic>[
              // Handle
              Center(
                child: Container(
                  width: 40,
                  height: 4,
                  decoration: BoxDecoration(
                    color: Colors.grey[300],
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),
              const SizedBox(height: 24),

              // Project image placeholder
              Container(
                height: 200,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(16),
                  gradient: const LinearGradient(
                    colors: <dynamic>[Color(0xFFFFA726), Color(0xFFFF7043)],
                  ),
                ),
                child: Center(
                  child: Icon(
                    Icons.wb_sunny,
                    size: 80,
                    color: Colors.white.withOpacity(0.8),
                  ),
                ),
              ),
              const SizedBox(height: 24),

              // Status badge
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: _getStatusColor(widget.project.status).withOpacity(0.1),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(
                  widget.project.status.name.toUpperCase(),
                  style: TextStyle(
                    color: _getStatusColor(widget.project.status),
                    fontWeight: FontWeight.w600,
                    fontSize: 12,
                  ),
                ),
              ),
              const SizedBox(height: 16),

              // Title
              Text(
                widget.project.name,
                style: theme.textTheme.headlineSmall?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 8),

              // Location
              Row(
                children: <dynamic>[
                  Icon(Icons.location_on, size: 16, color: Colors.grey[600]),
                  const SizedBox(width: 4),
                  Text(
                    widget.project.location,
                    style: theme.textTheme.bodyMedium?.copyWith(
                      color: theme.colorScheme.onSurface.withOpacity(0.6),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 24),

              // Stats grid
              _buildStatsGrid(widget.project, theme, numberFormat),
              const SizedBox(height: 24),

              // Performance metrics
              if (widget.project.status == ProjectStatus.active) ...<dynamic>[
                Text(
                  'Performance Metrics',
                  style: theme.textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 12),
                _buildMetricRow('Efficiency', '${widget.project.efficiency}%', theme),
                _buildMetricRow(
                  'Utilization',
                  '${widget.project.utilizationRate.toStringAsFixed(1)}%',
                  theme,
                ),
                _buildMetricRow('ROI', '${widget.project.roi.toStringAsFixed(1)}%', theme),
                const SizedBox(height: 24),
              ],

              // Investment section
              if (walletProvider.isConnected) ...<dynamic>[
                Text(
                  'Invest in Project',
                  style: theme.textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: _amountController,
                  keyboardType: TextInputType.number,
                  decoration: InputDecoration(
                    labelText: 'Investment Amount (ETH)',
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                    suffixIcon: const Icon(Icons.account_balance_wallet),
                  ),
                ),
                const SizedBox(height: 16),
                FilledButton(
                  onPressed: () => _invest(context),
                  style: FilledButton.styleFrom(
                    minimumSize: const Size(double.infinity, 48),
                  ),
                  child: const Text('Invest Now'),
                ),
              ] else ...<dynamic>[
                FilledButton(
                  onPressed: () {
                    Navigator.pop(context);
                    // Show connect wallet dialog
                  },
                  style: FilledButton.styleFrom(
                    minimumSize: const Size(double.infinity, 48),
                  ),
                  child: const Text('Connect Wallet to Invest'),
                ),
              ],
            ],
          ),
        );
      },
    );
  }

  Widget _buildStatsGrid(SolarProject project, ThemeData theme, NumberFormat format) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: theme.colorScheme.surfaceVariant,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        children: <dynamic>[
          Row(
            children: <dynamic>[
              Expanded(child: _buildStatItem('Capacity', '${format.format(project.capacity)} MW', theme)),
              Expanded(child: _buildStatItem('Generation', '${format.format(project.currentGeneration)} MW', theme)),
            ],
          ),
          const SizedBox(height: 16),
          Row(
            children: <dynamic>[
              Expanded(child: _buildStatItem('Total Investment', '${project.investment} ETH', theme)),
              Expanded(child: _buildStatItem('Investors', '${project.investors}', theme)),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildStatItem(String label, String value, ThemeData theme) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <dynamic>[
        Text(
          label,
          style: theme.textTheme.bodySmall?.copyWith(
            color: theme.colorScheme.onSurface.withOpacity(0.6),
          ),
        ),
        const SizedBox(height: 4),
        Text(
          value,
          style: theme.textTheme.titleMedium?.copyWith(
            fontWeight: FontWeight.bold,
          ),
        ),
      ],
    );
  }

  Widget _buildMetricRow(String label, String value, ThemeData theme) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: <dynamic>[
          Text(label, style: theme.textTheme.bodyMedium),
          Text(
            value,
            style: theme.textTheme.bodyMedium?.copyWith(
              fontWeight: FontWeight.w600,
              color: theme.colorScheme.primary,
            ),
          ),
        ],
      ),
    );
  }

  Color _getStatusColor(ProjectStatus status) {
    switch (status) {
      case ProjectStatus.active:
        return const Color(0xFF66BB6A);
      case ProjectStatus.pending:
        return const Color(0xFF42A5F5);
      case ProjectStatus.completed:
        return const Color(0xFF26A69A);
      case ProjectStatus.maintenance:
        return const Color(0xFFFFA726);
    }
  }

  Future<void> _invest(BuildContext context) async {
    final double? amount = double.tryParse(_amountController.text);
    if (amount == null || amount <= 0) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter a valid amount')),
      );
      return;
    }

    final daoProvider = context.read<DAOProvider>();

    // Show loading
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => const Center(child: CircularProgressIndicator()),
    );

    // Invest
    final success = await daoProvider.investInProject(
      projectId: widget.project.id,
      amount: BigInt.from((amount * 1e18).toInt()),
    );

    // Close loading
    Navigator.pop(context);

    // Close details
    Navigator.pop(context);

    // Show result
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(success ? 'Investment successful!' : 'Investment failed'),
        backgroundColor: success ? Colors.green : Colors.red,
      ),
    );
  }
}
