import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../providers/dao_provider.dart';
import '../providers/wallet_provider.dart';
import '../models/project/solar_project.dart';
import '../widgets/project_card.dart';

class ProjectsScreen extends StatefulWidget {
  const ProjectsScreen({super.key});

  @override
  State<ProjectsScreen> createState() => _ProjectsScreenState();
}

class _ProjectsScreenState extends State<ProjectsScreen> {
  String _filter = 'all';

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    final DAOProvider daoProvider = context.watch<DAOProvider>();

<<<<<<< HEAD
		List<SolarProject> filteredProjects = _filter == 'all'
				? daoProvider.projects
				: daoProvider.projects.where((p) => p.status.name == _filter).toList();

		return Scaffold(
			appBar: AppBar(
				title: const Text('Solar Projects'),
				actions: [
					PopupMenuButton<String>(
						icon: const Icon(Icons.filter_list),
						onSelected: (value) {
							setState(() {
								_filter = value;
							});
						},
						itemBuilder: (context) => [
							const PopupMenuItem(value: 'all', child: Text('All Projects')),
							const PopupMenuItem(value: 'active', child: Text('Active')),
							const PopupMenuItem(value: 'pending', child: Text('Pending')),
							const PopupMenuItem(value: 'completed', child: Text('Completed')),
						],
					),
				],
			),
			body: RefreshIndicator(
				onRefresh: () => daoProvider.refreshProjects(),
				child: filteredProjects.isEmpty
						? Center(
								child: Column(
									mainAxisAlignment: MainAxisAlignment.center,
									children: [
										Icon(Icons.wb_sunny_outlined, size: 64, color: Colors.grey[400]),
										const SizedBox(height: 16),
										Text(
											'No projects found',
											style: TextStyle(color: Colors.grey[600], fontSize: 16),
										),
									],
								),
							)
						: GridView.builder(
								padding: const EdgeInsets.all(16),
								gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
									crossAxisCount: 2,
									childAspectRatio: 0.8,
									crossAxisSpacing: 16,
									mainAxisSpacing: 16,
								),
								itemCount: filteredProjects.length,
								itemBuilder: (context, index) {
									return ProjectCard(
										project: filteredProjects[index],
										onTap: () => _showProjectDetails(context, filteredProjects[index]),
									);
								},
							),
			),
		);
	}
=======
    final List<SolarProject> filteredProjects = _filter == 'all'
        ? daoProvider.projects
        : daoProvider.projects.where((Map<String, dynamic> p) => p.status.name == _filter).toList();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Solar Projects'),
        actions: <dynamic>[
          PopupMenuButton<String>(
            icon: const Icon(Icons.filter_list),
            onSelected: (String value) {
              setState(() {
                _filter = value;
              });
            },
            itemBuilder: (BuildContext context) => <dynamic>[
              const PopupMenuItem(value: 'all', child: Text('All Projects')),
              const PopupMenuItem(value: 'active', child: Text('Active')),
              const PopupMenuItem(value: 'pending', child: Text('Pending')),
              const PopupMenuItem(value: 'completed', child: Text('Completed')),
            ],
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: () => daoProvider.refreshProjects(),
        child: filteredProjects.isEmpty
            ? Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: <dynamic>[
                    Icon(Icons.wb_sunny_outlined, size: 64, color: Colors.grey[400]),
                    const SizedBox(height: 16),
                    Text(
                      'No projects found',
                      style: TextStyle(color: Colors.grey[600], fontSize: 16),
                    ),
                  ],
                ),
              )
            : GridView.builder(
                padding: const EdgeInsets.all(16),
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                  childAspectRatio: 0.8,
                  crossAxisSpacing: 16,
                  mainAxisSpacing: 16,
                ),
                itemCount: filteredProjects.length,
                itemBuilder: (BuildContext context, int index) {
                  return ProjectCard(
                    project: filteredProjects[index],
                    onTap: () => _showProjectDetails(context, filteredProjects[index]),
                  );
                },
              ),
      ),
    );
  }
>>>>>>> 9823c84 (chore: sync and clean repo)

  void _showProjectDetails(BuildContext context, SolarProject project) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (BuildContext context) => ProjectDetailsSheet(project: project),
    );
  }
}

class ProjectDetailsSheet extends StatefulWidget {
<<<<<<< HEAD
	final SolarProject project;

	const ProjectDetailsSheet({Key? key, required this.project}) : super(key: key);

	@override
	State<ProjectDetailsSheet> createState() => _ProjectDetailsSheetState();
=======
  const ProjectDetailsSheet({super.key, required this.project});
  final SolarProject project;

  @override
  State<ProjectDetailsSheet> createState() => _ProjectDetailsSheetState();
>>>>>>> 9823c84 (chore: sync and clean repo)
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
    final ThemeData theme = Theme.of(context);
    final WalletProvider walletProvider = context.watch<WalletProvider>();
    final NumberFormat numberFormat = NumberFormat('#,##0.##');

<<<<<<< HEAD
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
						children: [
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
										colors: [Color(0xFFFFA726), Color(0xFFFF7043)],
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
=======
    return DraggableScrollableSheet(
      initialChildSize: 0.9,
      minChildSize: 0.5,
      maxChildSize: 0.95,
      expand: false,
      builder: (BuildContext context, ScrollController scrollController) {
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
                  child: Icon(Icons.wb_sunny, size: 80, color: Colors.white.withOpacity(0.8)),
                ),
              ),
              const SizedBox(height: 24),
>>>>>>> 9823c84 (chore: sync and clean repo)

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
                style: theme.textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 8),

<<<<<<< HEAD
							// Location
							Row(
								children: [
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
=======
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
>>>>>>> 9823c84 (chore: sync and clean repo)

              // Stats grid
              _buildStatsGrid(widget.project, theme, numberFormat),
              const SizedBox(height: 24),

<<<<<<< HEAD
							// Performance metrics
							if (widget.project.status == ProjectStatus.active) ...[
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
							if (walletProvider.isConnected) ...[
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
							] else ...[
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
				children: [
					Row(
						children: [
							Expanded(child: _buildStatItem('Capacity', '${format.format(project.capacity)} MW', theme)),
							Expanded(child: _buildStatItem('Generation', '${format.format(project.currentGeneration)} MW', theme)),
						],
					),
					const SizedBox(height: 16),
					Row(
						children: [
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
			children: [
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
				children: [
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
=======
              // Performance metrics
              if (widget.project.status == ProjectStatus.active) ...<dynamic>[
                Text(
                  'Performance Metrics',
                  style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
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
                  style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: _amountController,
                  keyboardType: TextInputType.number,
                  decoration: InputDecoration(
                    labelText: 'Investment Amount (ETH)',
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                    suffixIcon: const Icon(Icons.account_balance_wallet),
                  ),
                ),
                const SizedBox(height: 16),
                FilledButton(
                  onPressed: () => _invest(context),
                  style: FilledButton.styleFrom(minimumSize: const Size(double.infinity, 48)),
                  child: const Text('Invest Now'),
                ),
              ] else ...<dynamic>[
                FilledButton(
                  onPressed: () {
                    Navigator.pop(context);
                    // Show connect wallet dialog
                  },
                  style: FilledButton.styleFrom(minimumSize: const Size(double.infinity, 48)),
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
              Expanded(
                child: _buildStatItem('Capacity', '${format.format(project.capacity)} MW', theme),
              ),
              Expanded(
                child: _buildStatItem(
                  'Generation',
                  '${format.format(project.currentGeneration)} MW',
                  theme,
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Row(
            children: <dynamic>[
              Expanded(
                child: _buildStatItem('Total Investment', '${project.investment} ETH', theme),
              ),
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
        Text(value, style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold)),
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
>>>>>>> 9823c84 (chore: sync and clean repo)

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

<<<<<<< HEAD
	Future<void> _invest(BuildContext context) async {
		final amount = double.tryParse(_amountController.text);
		if (amount == null || amount <= 0) {
			ScaffoldMessenger.of(context).showSnackBar(
				const SnackBar(content: Text('Please enter a valid amount')),
			);
			return;
		}
=======
  Future<void> _invest(BuildContext context) async {
    final double? amount = double.tryParse(_amountController.text);
    if (amount == null || amount <= 0) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text('Please enter a valid amount')));
      return;
    }
>>>>>>> 9823c84 (chore: sync and clean repo)

    final DAOProvider daoProvider = context.read<DAOProvider>();

    // Show loading
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (BuildContext context) => const Center(child: CircularProgressIndicator()),
    );

    // Invest
    final bool success = await daoProvider.investInProject(
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

// ...full ProjectsScreen code from your previous message...
