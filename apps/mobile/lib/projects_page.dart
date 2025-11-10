import 'package:flutter/material.dart';
import 'app_constant.dart';
import 'mock_data.dart';
import 'project_card.dart';
import 'project_model.dart';

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

  final List<String> _categories = <String>[
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
        projects = projects.where((Project project) => project.status == 'active').toList();
      case 2: // Draft Projects
        projects = projects.where((Project project) => project.status == 'draft').toList();
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
          tabs: const <dynamic>[
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

          // Projects List
          Expanded(
            child: TabBarView(
              controller: _tabController,
              children: <dynamic>[_buildProjectsList(), _buildProjectsList(), _buildProjectsList()],
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
    final List<dynamic> projects = _getFilteredProjects();

    if (projects.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <dynamic>[
            Icon(Icons.work_off, size: 64, color: Colors.grey[400]),
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
            children: <dynamic>[
              Text(project.description),
              const SizedBox(height: 16),
              Text('Budget: \$${project.budget.toStringAsFixed(0)}'),
              Text('Team Members: ${project.teamMembers.length}'),
              Text('Upvotes: ${project.upvotes}'),
              if (project.githubUrl != null) ...<dynamic>[
                const SizedBox(height: 8),
                Text('GitHub: ${project.githubUrl}'),
              ],
            ],
          ),
        ),
        actions: <dynamic>[
          TextButton(onPressed: () => Navigator.of(context).pop(), child: const Text('Close')),
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
