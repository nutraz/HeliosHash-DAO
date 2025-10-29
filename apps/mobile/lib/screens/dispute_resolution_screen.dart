import 'package:flutter/material.dart';

class DisputeResolutionScreen extends StatefulWidget {
  @override
  _DisputeResolutionScreenState createState() => _DisputeResolutionScreenState();
}

class _DisputeResolutionScreenState extends State<DisputeResolutionScreen> {
  List<Map<String, dynamic>> _disputes = [
    {
      'id': 'DSP-001',
      'title': 'Land Ownership Dispute',
      'parties': ['Community Group A', 'Community Group B'],
      'status': 'Under Review',
      'category': 'Land',
      'date': '2024-01-15',
      'description': 'Dispute over land ownership for proposed solar farm project',
      'votes': 45,
      'totalVotes': 100,
    },
    {
      'id': 'DSP-002',
      'title': 'Budget Allocation',
      'parties': ['Project Team', 'Finance Committee'],
      'status': 'Voting',
      'category': 'Financial',
      'date': '2024-01-20',
      'description': 'Disagreement over budget allocation for microgrid project',
      'votes': 78,
      'totalVotes': 100,
    },
    {
      'id': 'DSP-003',
      'title': 'Contract Violation',
      'parties': ['Contractor', 'Project Manager'],
      'status': 'Resolved',
      'category': 'Contract',
      'date': '2024-01-10',
      'description': 'Contractor failed to meet project timeline requirements',
      'votes': 92,
      'totalVotes': 100,
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Dispute Resolution'),
        backgroundColor: Colors.orange.shade600,
        foregroundColor: Colors.white,
        actions: [
          IconButton(icon: Icon(Icons.add), onPressed: () => _showNewDisputeDialog()),
        ],
      ),
      body: Column(
        children: [
          _buildHeader(),
          _buildCategoryFilter(),
          Expanded(
            child: ListView.builder(
              padding: EdgeInsets.all(8),
              itemCount: _disputes.length,
              itemBuilder: (context, index) {
                return _buildDisputeCard(_disputes[index]);
              },
            ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => _showNewDisputeDialog(),
        backgroundColor: Colors.orange.shade600,
        child: Icon(Icons.add),
      ),
    );
  }

  Widget _buildHeader() {
    return Container(
      padding: EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Colors.orange.shade600, Colors.orange.shade800],
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Dispute Resolution Center', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Colors.white)),
          SizedBox(height: 8),
          Text('Resolve conflicts through transparent community governance', style: TextStyle(fontSize: 16, color: Colors.orange.shade100)),
          SizedBox(height: 16),
          Row(
            children: [
              _buildStat('3', 'Active Disputes'),
              SizedBox(width: 32),
              _buildStat('1', 'Under Voting'),
              SizedBox(width: 32),
              _buildStat('89%', 'Resolution Rate'),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildStat(String value, String label) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(value, style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Colors.white)),
        Text(label, style: TextStyle(fontSize: 14, color: Colors.orange.shade100)),
      ],
    );
  }

  Widget _buildCategoryFilter() {
    final categories = ['All', 'Land', 'Financial', 'Contract', 'Technical'];
    return Container(
      padding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      child: SingleChildScrollView(
        scrollDirection: Axis.horizontal,
        child: Row(
          children: categories.map((category) {
            return Padding(
              padding: EdgeInsets.only(right: 8),
              child: FilterChip(
                label: Text(category),
                selected: category == 'All',
                onSelected: (selected) {},
                backgroundColor: Colors.grey.shade200,
                selectedColor: Colors.orange.shade100,
                checkmarkColor: Colors.orange.shade600,
              ),
            );
          }).toList(),
        ),
      ),
    );
  }

  Widget _buildDisputeCard(Map<String, dynamic> dispute) {
    final statusColor = dispute['status'] == 'Resolved' ? Colors.green : dispute['status'] == 'Voting' ? Colors.blue : Colors.orange;
    return Card(
      margin: EdgeInsets.only(bottom: 12),
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Expanded(
                  child: Text(dispute['title'], style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                ),
                Container(
                  padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(color: statusColor.withOpacity(0.2), borderRadius: BorderRadius.circular(12)),
                  child: Text(dispute['status'], style: TextStyle(color: statusColor, fontWeight: FontWeight.bold)),
                ),
              ],
            ),
            SizedBox(height: 8),
            Text(dispute['description'], style: TextStyle(color: Colors.grey.shade700)),
            SizedBox(height: 12),
            Row(
              children: [
                Icon(Icons.group, size: 16, color: Colors.grey),
                SizedBox(width: 4),
                Text(dispute['parties'].join(' vs '), style: TextStyle(color: Colors.grey)),
                SizedBox(width: 16),
                Icon(Icons.category, size: 16, color: Colors.grey),
                SizedBox(width: 4),
                Text(dispute['category'], style: TextStyle(color: Colors.grey)),
              ],
            ),
            SizedBox(height: 12),
            if (dispute['status'] != 'Resolved') ...[
              Row(
                children: [
                  Icon(Icons.how_to_vote, size: 16, color: Colors.grey),
                  SizedBox(width: 4),
                  Text('${dispute['votes']} / ${dispute['totalVotes']} votes', style: TextStyle(color: Colors.grey)),
                ],
              ),
              SizedBox(height: 8),
              LinearProgressIndicator(
                value: dispute['votes'] / dispute['totalVotes'],
                backgroundColor: Colors.grey.shade200,
                valueColor: AlwaysStoppedAnimation<Color>(statusColor),
              ),
            ],
            SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: OutlinedButton(
                    onPressed: () => _showDisputeDetails(dispute),
                    child: Text('View Details'),
                  ),
                ),
                SizedBox(width: 8),
                if (dispute['status'] == 'Voting') ...[
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () => _showVotingDialog(dispute),
                      child: Text('Vote Now'),
                      style: ElevatedButton.styleFrom(backgroundColor: Colors.orange.shade600, foregroundColor: Colors.white),
                    ),
                  ),
                ] else if (dispute['status'] == 'Under Review') ...[
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () => _showCommentDialog(dispute),
                      child: Text('Add Comment'),
                      style: ElevatedButton.styleFrom(backgroundColor: Colors.blue.shade600, foregroundColor: Colors.white),
                    ),
                  ),
                ],
              ],
            ),
          ],
        ),
      ),
    );
  }

  void _showNewDisputeDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Raise New Dispute'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(decoration: InputDecoration(labelText: 'Dispute Title', border: OutlineInputBorder())),
            SizedBox(height: 16),
            DropdownButtonFormField<String>(
              decoration: InputDecoration(labelText: 'Category', border: OutlineInputBorder()),
              items: ['Land', 'Financial', 'Contract', 'Technical'].map((cat) => DropdownMenuItem(value: cat, child: Text(cat))).toList(),
              onChanged: (value) {},
            ),
            SizedBox(height: 16),
            TextField(decoration: InputDecoration(labelText: 'Involved Parties', border: OutlineInputBorder())),
            SizedBox(height: 16),
            TextField(
              decoration: InputDecoration(labelText: 'Description', border: OutlineInputBorder()),
              maxLines: 3,
            ),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: Text('Cancel')),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Dispute submitted for review!')));
            },
            child: Text('Submit Dispute'),
          ),
        ],
      ),
    );
  }

  void _showDisputeDetails(Map<String, dynamic> dispute) {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => DisputeDetailScreen(dispute: dispute)),
    );
  }

  void _showVotingDialog(Map<String, dynamic> dispute) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Vote on Dispute'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(dispute['title']),
            SizedBox(height: 16),
            Text('How do you vote on this dispute?'),
            SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: ElevatedButton(
                    onPressed: () {
                      Navigator.pop(context);
                      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Vote recorded!')));
                    },
                    child: Text('For Resolution'),
                    style: ElevatedButton.styleFrom(backgroundColor: Colors.green.shade600, foregroundColor: Colors.white),
                  ),
                ),
                SizedBox(width: 16),
                Expanded(
                  child: ElevatedButton(
                    onPressed: () {
                      Navigator.pop(context);
                      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Vote recorded!')));
                    },
                    child: Text('Against Resolution'),
                    style: ElevatedButton.styleFrom(backgroundColor: Colors.red.shade600, foregroundColor: Colors.white),
                  ),
                ),
              ],
            ),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: Text('Cancel')),
        ],
      ),
    );
  }

  void _showCommentDialog(Map<String, dynamic> dispute) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Add Comment'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(dispute['title']),
            SizedBox(height: 16),
            TextField(
              decoration: InputDecoration(labelText: 'Your Comment', border: OutlineInputBorder()),
              maxLines: 3,
            ),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: Text('Cancel')),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Comment added!')));
            },
            child: Text('Submit Comment'),
          ),
        ],
      ),
    );
  }
}

class DisputeDetailScreen extends StatelessWidget {
  final Map<String, dynamic> dispute;
  DisputeDetailScreen({required this.dispute});
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(dispute['title']),
        backgroundColor: Colors.orange.shade600,
        foregroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        padding: EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Card(
              child: Padding(
                padding: EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Dispute Information', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                    SizedBox(height: 16),
                    _buildInfoRow('ID', dispute['id']),
                    _buildInfoRow('Status', dispute['status']),
                    _buildInfoRow('Category', dispute['category']),
                    _buildInfoRow('Date', dispute['date']),
                    _buildInfoRow('Parties', dispute['parties'].join(' vs ')),
                  ],
                ),
              ),
            ),
            SizedBox(height: 16),
            Card(
              child: Padding(
                padding: EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Description', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                    SizedBox(height: 8),
                    Text(dispute['description']),
                  ],
                ),
              ),
            ),
            SizedBox(height: 16),
            Card(
              child: Padding(
                padding: EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Voting Progress', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                    SizedBox(height: 16),
                    LinearProgressIndicator(
                      value: dispute['votes'] / dispute['totalVotes'],
                      backgroundColor: Colors.grey.shade200,
                      valueColor: AlwaysStoppedAnimation<Color>(Colors.orange.shade600),
                    ),
                    SizedBox(height: 8),
                    Text('${dispute['votes']} / ${dispute['totalVotes']} votes (${(dispute['votes'] / dispute['totalVotes'] * 100).toStringAsFixed(1)}%)'),
                  ],
                ),
              ),
            ),
            SizedBox(height: 16),
            Card(
              child: Padding(
                padding: EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Comments', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                    SizedBox(height: 8),
                    _buildCommentCard('Community Member', 'We need more transparency in this process.', '2 hours ago'),
                    _buildCommentCard('Project Manager', 'The timeline is being reviewed by all parties.', '1 day ago'),
                  ],
                ),
              ),
            ),
            SizedBox(height: 24),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () { Navigator.pop(context); },
                child: Text(dispute['status'] == 'Voting' ? 'Vote Now' : 'Add Comment'),
                style: ElevatedButton.styleFrom(backgroundColor: Colors.orange.shade600, foregroundColor: Colors.white, padding: EdgeInsets.symmetric(vertical: 16)),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoRow(String label, String value) {
    return Padding(
      padding: EdgeInsets.only(bottom: 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(width: 100, child: Text('$label:', style: TextStyle(fontWeight: FontWeight.bold))),
          Expanded(child: Text(value)),
        ],
      ),
    );
  }

  Widget _buildCommentCard(String author, String comment, String time) {
    return Card(
      margin: EdgeInsets.only(bottom: 8),
      child: Padding(
        padding: EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                CircleAvatar(backgroundColor: Colors.orange.shade100, child: Icon(Icons.person, color: Colors.orange.shade600)),
                SizedBox(width: 12),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(author, style: TextStyle(fontWeight: FontWeight.bold)),
                    Text(time, style: TextStyle(color: Colors.grey, fontSize: 12)),
                  ],
                ),
              ],
            ),
            SizedBox(height: 8),
            Text(comment),
          ],
        ),
      ),
    );
  }
}
