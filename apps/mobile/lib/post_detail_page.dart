import 'package:flutter/material.dart';
import 'app_constant.dart';

class PostDetailPage extends StatefulWidget {
  const PostDetailPage({super.key, required this.postId});
  final String postId;

  @override
  State<PostDetailPage> createState() => _PostDetailPageState();
}

class _PostDetailPageState extends State<PostDetailPage> {
  final TextEditingController _commentController = TextEditingController();

  // Mock post data
  final Map<String, dynamic> _post = <String, dynamic>{
    'id': 'POST-001',
    'title': 'Proposal for Community Treasury Allocation',
    'content': '''
I believe we should allocate 25% of our treasury to fund environmental projects. Here's why:

1. **Environmental Impact**: Our DAO has grown significantly, and with that growth comes responsibility to give back to the community and planet.

2. **Long-term Sustainability**: Investing in environmental projects now will ensure the longevity and health of our ecosystem.

3. **Community Alignment**: Many members joined our DAO because of our commitment to positive change.

The proposed allocation would be:
- 10% to reforestation projects
- 10% to clean energy initiatives
- 5% to environmental education programs

I welcome your thoughts and feedback on this proposal.''',
    'author': <String, Object>{
      'name': 'Alice Johnson',
      'avatar': 'A',
      'role': 'Community Member',
      'joinDate': DateTime(2023, 6, 15),
    },
    'category': 'Governance',
    'createdAt': DateTime.now().subtract(const Duration(days: 2)),
    'updatedAt': DateTime.now().subtract(const Duration(hours: 5)),
    'tags': <String>['Treasury', 'Environment', 'Sustainability'],
    'upvotes': 42,
    'downvotes': 3,
    'comments': <Map<String, Object>>[
      <String, Object>{
        'id': '1',
        'author': 'Bob Smith',
        'content':
            "I fully support this initiative. The environmental focus aligns perfectly with our DAO's values.",
        'createdAt': DateTime.now().subtract(const Duration(days: 1)),
        'upvotes': 12,
        'replies': <Map<String, Object>>[
          <String, Object>{
            'id': '1-1',
            'author': 'Alice Johnson',
            'content':
                "Thank you for your support! I'm glad you see the alignment with our values.",
            'createdAt': DateTime.now().subtract(const Duration(hours: 20)),
            'upvotes': 3,
          },
        ],
      },
      <String, Object>{
        'id': '2',
        'author': 'Carol Davis',
        'content': 'What specific projects do you have in mind for the reforestation allocation?',
        'createdAt': DateTime.now().subtract(const Duration(hours: 18)),
        'upvotes': 8,
        'replies': <dynamic>[],
      },
      <String, Object>{
        'id': '3',
        'author': 'David Wilson',
        'content':
            "While I support environmental causes, I'm concerned about the 25% allocation. Could we start with a smaller percentage to test the waters?",
        'createdAt': DateTime.now().subtract(const Duration(hours: 12)),
        'upvotes': 15,
        'replies': <Map<String, Object>>[
          <String, Object>{
            'id': '3-1',
            'author': 'Alice Johnson',
            'content':
                "That's a valid concern. We could certainly start with a pilot program and scale up based on results.",
            'createdAt': DateTime.now().subtract(const Duration(hours: 10)),
            'upvotes': 7,
          },
        ],
      },
    ],
  };

  bool _isUpvoted = false;
  bool _isDownvoted = false;

  @override
  void dispose() {
    _commentController.dispose();
    super.dispose();
  }

  void _addComment() {
    if (_commentController.text.trim().isEmpty) return;

    setState(() {
      _post['comments'].add(<String, dynamic>{
        'id': DateTime.now().millisecondsSinceEpoch.toString(),
        'author': 'Current User', // In real app, get from auth
        'content': _commentController.text.trim(),
        'createdAt': DateTime.now(),
        'upvotes': 0,
        'replies': <dynamic>[],
      });
    });

    _commentController.clear();
  }

  void _toggleUpvote() {
    setState(() {
      if (_isUpvoted) {
        _isUpvoted = false;
        _post['upvotes'] = _post['upvotes'] - 1;
      } else {
        _isUpvoted = true;
        _post['upvotes'] = _post['upvotes'] + 1;
        if (_isDownvoted) {
          _isDownvoted = false;
          _post['downvotes'] = _post['downvotes'] - 1;
        }
      }
    });
  }

  void _toggleDownvote() {
    setState(() {
      if (_isDownvoted) {
        _isDownvoted = false;
        _post['downvotes'] = _post['downvotes'] - 1;
      } else {
        _isDownvoted = true;
        _post['downvotes'] = _post['downvotes'] + 1;
        if (_isUpvoted) {
          _isUpvoted = false;
          _post['upvotes'] = _post['upvotes'] - 1;
        }
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Post'),
        backgroundColor: AppConstants.primaryColor,
        foregroundColor: Colors.white,
        actions: <dynamic>[
          PopupMenuButton<String>(
            onSelected: (String value) {
              // Handle menu actions
            },
            itemBuilder: (BuildContext context) => <dynamic>[
              const PopupMenuItem(value: 'share', child: Text('Share')),
              const PopupMenuItem(value: 'report', child: Text('Report')),
              const PopupMenuItem(value: 'save', child: Text('Save')),
            ],
          ),
        ],
      ),
      body: Column(
        children: <dynamic>[
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: <dynamic>[
                  // Post Header
                  Row(
                    children: <dynamic>[
                      CircleAvatar(
                        backgroundColor: AppConstants.primaryColor.withOpacity(0.2),
                        child: Text(
                          _post['author']['avatar'],
                          style: const TextStyle(
                            color: AppConstants.primaryColor,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: <dynamic>[
                            Text(
                              _post['author']['name'],
                              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                            ),
                            Text(
                              '${_post['author']['role']} • ${_formatDate(_post['createdAt'])}',
                              style: TextStyle(color: Colors.grey[600], fontSize: 14),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 16),

                  // Post Title
                  Text(
                    _post['title'],
                    style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                  ),

                  const SizedBox(height: 12),

                  // Post Category and Tags
                  Row(
                    children: <dynamic>[
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: AppConstants.primaryColor.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Text(
                          _post['category'],
                          style: const TextStyle(
                            color: AppConstants.primaryColor,
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),
                      ...(_post['tags'] as List<String>).map(
                        (String tag) => Container(
                          margin: const EdgeInsets.only(right: 4),
                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                          decoration: BoxDecoration(
                            color: Colors.grey[200],
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Text(tag, style: TextStyle(color: Colors.grey[700], fontSize: 10)),
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 16),

                  // Post Content
                  Text(_post['content'], style: const TextStyle(fontSize: 16, height: 1.6)),

                  const SizedBox(height: 20),

                  // Voting Actions
                  Row(
                    children: <dynamic>[
                      IconButton(
                        onPressed: _toggleUpvote,
                        icon: Icon(
                          _isUpvoted ? Icons.thumb_up : Icons.thumb_up_outlined,
                          color: _isUpvoted ? AppConstants.primaryColor : Colors.grey,
                        ),
                      ),
                      Text(
                        _post['upvotes'].toString(),
                        style: TextStyle(
                          color: _isUpvoted ? AppConstants.primaryColor : Colors.grey,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(width: 16),
                      IconButton(
                        onPressed: _toggleDownvote,
                        icon: Icon(
                          _isDownvoted ? Icons.thumb_down : Icons.thumb_down_outlined,
                          color: _isDownvoted ? Colors.red : Colors.grey,
                        ),
                      ),
                      Text(
                        _post['downvotes'].toString(),
                        style: TextStyle(
                          color: _isDownvoted ? Colors.red : Colors.grey,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const Spacer(),
                      IconButton(
                        onPressed: () {
                          // Share post
                        },
                        icon: const Icon(Icons.share),
                      ),
                    ],
                  ),

                  const Divider(height: 32),

                  // Comments Section
                  const Text(
                    'Comments',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),

                  const SizedBox(height: 16),

                  ...(_post['comments'] as List<Map<String, dynamic>>).map(
                    (Map<String, dynamic> comment) => _buildCommentCard(comment),
                  ),
                ],
              ),
            ),
          ),

          // Add Comment Section
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              border: Border(top: BorderSide(color: Colors.grey[200]!)),
            ),
            child: Row(
              children: <dynamic>[
                Expanded(
                  child: TextField(
                    controller: _commentController,
                    decoration: InputDecoration(
                      hintText: 'Write a comment...',
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(24),
                        borderSide: BorderSide.none,
                      ),
                      filled: true,
                      fillColor: Colors.grey[100],
                      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                    ),
                    maxLines: null,
                    textInputAction: TextInputAction.send,
                    onSubmitted: (_) => _addComment(),
                  ),
                ),
                const SizedBox(width: 8),
                CircleAvatar(
                  backgroundColor: AppConstants.primaryColor,
                  child: IconButton(
                    icon: const Icon(Icons.send, color: Colors.white),
                    onPressed: _addComment,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCommentCard(Map<String, dynamic> comment) {
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <dynamic>[
            Row(
              children: <dynamic>[
                CircleAvatar(
                  radius: 16,
                  backgroundColor: AppConstants.primaryColor.withOpacity(0.2),
                  child: Text(
                    comment['author'][0],
                    style: const TextStyle(
                      color: AppConstants.primaryColor,
                      fontWeight: FontWeight.bold,
                      fontSize: 12,
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: <dynamic>[
                      Text(
                        comment['author'],
                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                      ),
                      Text(
                        _formatDate(comment['createdAt']),
                        style: TextStyle(color: Colors.grey[600], fontSize: 12),
                      ),
                    ],
                  ),
                ),
                Row(
                  children: <dynamic>[
                    IconButton(
                      onPressed: () {
                        // Upvote comment
                      },
                      icon: const Icon(Icons.thumb_up, size: 16),
                      color: Colors.grey,
                    ),
                    Text(
                      comment['upvotes'].toString(),
                      style: const TextStyle(fontSize: 12, color: Colors.grey),
                    ),
                  ],
                ),
              ],
            ),
            const SizedBox(height: 8),
            Text(comment['content'], style: const TextStyle(height: 1.4)),
            if ((comment['replies'] as List).isNotEmpty) ...<dynamic>[
              const SizedBox(height: 12),
              ...comment['replies'].map<Widget>(
                (reply) => Container(
                  margin: const EdgeInsets.only(left: 24, top: 8),
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: Colors.grey[50],
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: <dynamic>[
                      Row(
                        children: <dynamic>[
                          Text(
                            reply['author'],
                            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12),
                          ),
                          const SizedBox(width: 8),
                          Text(
                            _formatDate(reply['createdAt']),
                            style: TextStyle(color: Colors.grey[600], fontSize: 10),
                          ),
                        ],
                      ),
                      const SizedBox(height: 4),
                      Text(reply['content'], style: const TextStyle(fontSize: 14, height: 1.3)),
                    ],
                  ),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }

  String _formatDate(DateTime date) {
    final DateTime now = DateTime.now();
    final Duration difference = now.difference(date);

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
