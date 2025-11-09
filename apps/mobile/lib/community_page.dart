import 'package:flutter/material.dart';
import 'package:helios_hash_dao/app_constant.dart';
import 'package:helios_hash_dao/mock_data.dart';

class CommunityPage extends StatefulWidget {
  const CommunityPage({super.key});

  @override
  State<CommunityPage> createState() => _CommunityPageState();
}

class _CommunityPageState extends State<CommunityPage> with TickerProviderStateMixin {
  late TabController _tabController;

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
        title: const Text('Community'),
        backgroundColor: AppConstants.primaryColor,
        foregroundColor: Colors.white,
        elevation: 0,
        bottom: TabBar(
          controller: _tabController,
          indicatorColor: Colors.white,
          labelColor: Colors.white,
          unselectedLabelColor: Colors.white70,
          tabs: const <dynamic>[
            Tab(text: 'Posts'),
            Tab(text: 'Discussions'),
            Tab(text: 'Events'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: <dynamic>[
          _buildPostsTab(),
          _buildDiscussionsTab(),
          _buildEventsTab(),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          // Navigate to create post page
        },
        backgroundColor: AppConstants.primaryColor,
        child: const Icon(Icons.add),
      ),
    );
  }

  Widget _buildPostsTab() {
    final posts = MockData.getMockPosts();

    return RefreshIndicator(
      onRefresh: () async {
        // Refresh posts
        await Future.delayed(const Duration(seconds: 1));
      },
      child: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: posts.length,
        itemBuilder: (context, index) {
          final post = posts[index];
          return Card(
            margin: const EdgeInsets.only(bottom: 16),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: <dynamic>[
                  Row(
                    children: <dynamic>[
                      CircleAvatar(
                        backgroundColor: AppConstants.primaryColor,
                        child: Text(
                          post.author[0].toUpperCase(),
                          style: const TextStyle(color: Colors.white),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: <dynamic>[
                            Text(
                              post.author,
                              style: const TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 16,
                              ),
                            ),
                            Text(
                              _formatTimeAgo(post.createdAt),
                              style: TextStyle(
                                color: Colors.grey[600],
                                fontSize: 12,
                              ),
                            ),
                          ],
                        ),
                      ),
                      PopupMenuButton<String>(
                        onSelected: (value) {
                          // Handle menu actions
                        },
                        itemBuilder: (context) => <dynamic>[
                          const PopupMenuItem(
                            value: 'report',
                            child: Text('Report'),
                          ),
                          const PopupMenuItem(
                            value: 'hide',
                            child: Text('Hide'),
                          ),
                        ],
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Text(
                    post.title,
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  if (post.content.isNotEmpty) ...<dynamic>[
                    const SizedBox(height: 8),
                    Text(
                      post.content,
                      style: TextStyle(
                        color: Colors.grey[700],
                        height: 1.5,
                      ),
                    ),
                  ],
                  const SizedBox(height: 12),
                  Row(
                    children: <dynamic>[
                      IconButton(
                        onPressed: () {
                          // Handle like
                        },
                        icon: Icon(
                          post.isLiked ? Icons.favorite : Icons.favorite_border,
                          color: post.isLiked ? Colors.red : Colors.grey,
                        ),
                      ),
                      Text('${post.likes}'),
                      const SizedBox(width: 16),
                      IconButton(
                        onPressed: () {
                          // Handle comment
                        },
                        icon: const Icon(Icons.comment_outlined),
                      ),
                      Text('${post.comments}'),
                      const SizedBox(width: 16),
                      IconButton(
                        onPressed: () {
                          // Handle share
                        },
                        icon: const Icon(Icons.share_outlined),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildDiscussionsTab() {
    return const Center(
      child: Text('Discussions - Coming Soon'),
    );
  }

  Widget _buildEventsTab() {
    return const Center(
      child: Text('Events - Coming Soon'),
    );
  }

  String _formatTimeAgo(DateTime dateTime) {
    final DateTime now = DateTime.now();
    final Duration difference = now.difference(dateTime);

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
}
