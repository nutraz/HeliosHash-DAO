import 'package:flutter/material.dart';
<<<<<<< HEAD
import 'package:helios_hash_dao/app_constant.dart';
import 'package:helios_hash_dao/project_card.dart';
import 'package:helios_hash_dao/mock_data.dart';
import 'package:helios_hash_dao/project_model.dart';
=======
import 'app_constant.dart';
import 'mock_data.dart';
import 'project_card.dart';
import 'project_model.dart';
>>>>>>> 9823c84 (chore: sync and clean repo)

class ProjectsPage extends StatefulWidget {
  const ProjectsPage({super.key});

  @override
  State<ProjectsPage> createState() => _ProjectsPageState();
}

class _ProjectsPageState extends State<ProjectsPage> with TickerProviderStateMixin {
  late TabController _tabController;
  final TextEditingController _searchController = TextEditingController();
  String _searchQuery = '';
  String _selectedCategory = 'All';

  final List<String> _categories = [
    'All',
    'Infrastructure',
    'Environment',
    'Governance',
    'Finance',
    'Education',
    'Healthcare',
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

  List<Project> _getFilteredProjects() {
    List<Project> projects = MockData.getMockProjects();

    // Filter by search query
    if (_searchQuery.isNotEmpty) {
      projects = projects
          .where(
            (Project project) =>
                project.title.toLowerCase().contains(_searchQuery.toLowerCase()) ||
                project.description.toLowerCase().contains(_searchQuery.toLowerCase()) ||
                project.tags.any(
                  (String tag) => tag.toLowerCase().contains(_searchQuery.toLowerCase()),
                ),
          )
          .toList();
    }

    // Filter by category
    if (_selectedCategory != 'All') {
      projects = projects
          .where((Project project) => project.category == _selectedCategory)
          .toList();
    }

    // Filter by tab
    switch (_tabController.index) {
      case 0: // All Projects
        break;
      case 1: // Active Projects
<<<<<<< HEAD
        projects = projects.where((project) => project.status == 'active').toList();
        break;
      case 2: // Draft Projects
        projects = projects.where((project) => project.status == 'draft').toList();
        break;
=======
        projects = projects.where((Project project) => project.status == 'active').toList();
      case 2: // Draft Projects
        projects = projects.where((Project project) => project.status == 'draft').toList();
>>>>>>> 9823c84 (chore: sync and clean repo)
    }

    return projects;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Projects'),
        backgroundColor: AppConstants.primaryColor,
        foregroundColor: Colors.white,
        elevation: 0,
        bottom: TabBar(
          controller: _tabController,
          tabs: const [
            Tab(text: 'All'),
            Tab(text: 'Active'),
            Tab(text: 'Draft'),
          ],
          onTap: (int index) {
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
            child: Column(
              children: [
                // Search Bar
                TextField(
                  controller: _searchController,
                  decoration: InputDecoration(
                    hintText: 'Search projects...',
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
<<<<<<< HEAD
                    itemBuilder: (context, index) {
                      final category = _categories[index];
                      final isSelected = category == _selectedCategory;
=======
                    itemBuilder: (BuildContext context, int index) {
                      final String category = _categories[index];
                      final bool isSelected = category == _selectedCategory;
>>>>>>> 9823c84 (chore: sync and clean repo)

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

          // Projects List
          Expanded(
            child: TabBarView(
              controller: _tabController,
<<<<<<< HEAD
              children: [
                _buildProjectsList(),
                _buildProjectsList(),
                _buildProjectsList(),
              ],
=======
              children: <dynamic>[_buildProjectsList(), _buildProjectsList(), _buildProjectsList()],
>>>>>>> 9823c84 (chore: sync and clean repo)
            ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          // Navigate to create project page
        },
        backgroundColor: AppConstants.primaryColor,
        child: const Icon(Icons.add),
      ),
    );
  }

  Widget _buildProjectsList() {
    final projects = _getFilteredProjects();

    if (projects.isEmpty) {
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
            Text('No projects found', style: TextStyle(fontSize: 18, color: Colors.grey[600])),
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
        // Refresh projects data
        await Future.delayed(const Duration(seconds: 1));
      },
      child: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: projects.length,
        itemBuilder: (BuildContext context, int index) {
          final project = projects[index];
          return ProjectCard(
            project: project,
            onTap: () {
              // Navigate to project detail page
              _showProjectDetailDialog(context, project);
            },
          );
        },
      ),
    );
  }

  void _showProjectDetailDialog(BuildContext context, Project project) {
    showDialog(
      context: context,
      builder: (BuildContext context) => AlertDialog(
        title: Text(project.title),
        content: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(project.description),
              const SizedBox(height: 16),
              Text('Budget: \$${project.budget.toStringAsFixed(0)}'),
              Text('Team Members: ${project.teamMembers.length}'),
              Text('Upvotes: ${project.upvotes}'),
              if (project.githubUrl != null) ...[
                const SizedBox(height: 8),
                Text('GitHub: ${project.githubUrl}'),
              ],
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
          ElevatedButton(
            onPressed: () {
              // Handle project application or contribution
              Navigator.of(context).pop();
            },
            child: const Text('Apply to Contribute'),
          ),
        ],
      ),
    );
  }
}
