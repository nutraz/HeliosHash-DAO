import 'package:flutter/material.dart';
import 'app_constant.dart';
import 'chat_page.dart';

class ConversationsListPage extends StatefulWidget {
  const ConversationsListPage({super.key});

  @override
  State<ConversationsListPage> createState() => _ConversationsListPageState();
}

class _ConversationsListPageState extends State<ConversationsListPage> {
  final TextEditingController _searchController = TextEditingController();
  String _searchQuery = '';

  final List<Map<String, dynamic>> _conversations = <Map<String, dynamic>>[
    <String, dynamic>{
      'id': '1',
      'name': 'Alice Johnson',
      'lastMessage': 'Thanks for the update!',
      'timestamp': DateTime.now().subtract(const Duration(minutes: 5)),
      'unreadCount': 2,
      'avatar': 'A',
    },
    <String, dynamic>{
      'id': '2',
      'name': 'Bob Smith',
      'lastMessage': 'When is the next meeting?',
      'timestamp': DateTime.now().subtract(const Duration(hours: 2)),
      'unreadCount': 0,
      'avatar': 'B',
    },
    <String, dynamic>{
      'id': '3',
      'name': 'Carol Davis',
      'lastMessage': 'I agree with the proposal',
      'timestamp': DateTime.now().subtract(const Duration(hours: 5)),
      'unreadCount': 1,
      'avatar': 'C',
    },
    <String, dynamic>{
      'id': '4',
      'name': 'David Wilson',
      'lastMessage': 'Let me check the documentation',
      'timestamp': DateTime.now().subtract(const Duration(days: 1)),
      'unreadCount': 0,
      'avatar': 'D',
    },
  ];

  List<Map<String, dynamic>> get _filteredConversations {
    if (_searchQuery.isEmpty) return _conversations;

    return _conversations.where((Map<String, dynamic> conversation) {
      final String name = conversation['name'].toString().toLowerCase();
      final String lastMessage = conversation['lastMessage'].toString().toLowerCase();
      final String query = _searchQuery.toLowerCase();

      return name.contains(query) || lastMessage.contains(query);
    }).toList();
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Messages'),
        backgroundColor: AppConstants.primaryColor,
        foregroundColor: Colors.white,
        actions: <dynamic>[
          IconButton(
            icon: const Icon(Icons.search),
            onPressed: () {
              // Toggle search
            },
          ),
        ],
      ),
      body: Column(
        children: <dynamic>[
          // Search Bar
          Padding(
            padding: const EdgeInsets.all(16),
            child: TextField(
              controller: _searchController,
              decoration: InputDecoration(
                hintText: 'Search conversations...',
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
                fillColor: Colors.grey[100],
              ),
              onChanged: (String value) {
                setState(() {
                  _searchQuery = value;
                });
              },
            ),
          ),

          // Conversations List
          Expanded(
            child: _filteredConversations.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: <dynamic>[
                        Icon(Icons.chat_bubble_outline, size: 64, color: Colors.grey[400]),
                        const SizedBox(height: 16),
                        Text(
                          'No conversations found',
                          style: TextStyle(fontSize: 18, color: Colors.grey[600]),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          'Start a new conversation to get connected',
                          style: TextStyle(fontSize: 14, color: Colors.grey[500]),
                        ),
                      ],
                    ),
                  )
                : ListView.builder(
                    itemCount: _filteredConversations.length,
                    itemBuilder: (BuildContext context, int index) {
                      final Map<String, dynamic> conversation = _filteredConversations[index];
                      return _buildConversationTile(conversation);
                    },
                  ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          // Navigate to new conversation page
        },
        backgroundColor: AppConstants.primaryColor,
        child: const Icon(Icons.message),
      ),
    );
  }

  Widget _buildConversationTile(Map<String, dynamic> conversation) {
    final String name = conversation['name'] as String;
    final String lastMessage = conversation['lastMessage'] as String;
    final DateTime timestamp = conversation['timestamp'] as DateTime;
    final int unreadCount = conversation['unreadCount'] as int;
    final String avatar = conversation['avatar'] as String;

    return ListTile(
      leading: CircleAvatar(
        backgroundColor: AppConstants.primaryColor.withOpacity(0.2),
        child: Text(
          avatar,
          style: const TextStyle(color: AppConstants.primaryColor, fontWeight: FontWeight.bold),
        ),
      ),
      title: Row(
        children: <dynamic>[
          Expanded(
            child: Text(name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
          ),
          Text(_formatTime(timestamp), style: TextStyle(fontSize: 12, color: Colors.grey[600])),
        ],
      ),
      subtitle: Text(
        lastMessage,
        maxLines: 1,
        overflow: TextOverflow.ellipsis,
        style: TextStyle(color: unreadCount > 0 ? Colors.black : Colors.grey[600]),
      ),
      trailing: unreadCount > 0
          ? Container(
              padding: const EdgeInsets.all(6),
              decoration: const BoxDecoration(
                color: AppConstants.primaryColor,
                shape: BoxShape.circle,
              ),
              child: Text(
                unreadCount.toString(),
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                ),
              ),
            )
          : null,
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (BuildContext context) =>
                ChatPage(conversationId: conversation['id'], otherUserName: name),
          ),
        );
      },
    );
  }

  String _formatTime(DateTime time) {
    final DateTime now = DateTime.now();
    final Duration difference = now.difference(time);

    if (difference.inDays > 0) {
      return '${time.day}/${time.month}';
    } else if (difference.inHours > 0) {
      return '${time.hour}:${time.minute.toString().padLeft(2, '0')}';
    } else if (difference.inMinutes > 0) {
      return '${difference.inMinutes}m';
    } else {
      return 'now';
    }
  }
}
