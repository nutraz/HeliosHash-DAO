import 'package:flutter/material.dart';

class DisputeResolutionScreen extends StatefulWidget {
  const DisputeResolutionScreen({super.key});

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
        title: const Text('Dispute Resolution'),
        backgroundColor: Colors.orange.shade600,
        foregroundColor: Colors.white,
<<<<<<< HEAD
        actions: [
          IconButton(icon: Icon(Icons.add), onPressed: () => _showNewDisputeDialog()),
=======
        actions: <dynamic>[
          IconButton(icon: const Icon(Icons.add), onPressed: () => _showNewDisputeDialog()),
>>>>>>> 9823c84 (chore: sync and clean repo)
        ],
      ),
      body: Column(
        children: [
          _buildHeader(),
          _buildCategoryFilter(),
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(8),
              itemCount: _disputes.length,
              itemBuilder: (BuildContext context, int index) {
                return _buildDisputeCard(_disputes[index]);
              },
            ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => _showNewDisputeDialog(),
        backgroundColor: Colors.orange.shade600,
        child: const Icon(Icons.add),
      ),
    );
  }

  Widget _buildHeader() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Colors.orange.shade600, Colors.orange.shade800],
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
<<<<<<< HEAD
        children: [
          Text('Dispute Resolution Center', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Colors.white)),
          SizedBox(height: 8),
          Text('Resolve conflicts through transparent community governance', style: TextStyle(fontSize: 16, color: Colors.orange.shade100)),
          SizedBox(height: 16),
=======
        children: <dynamic>[
          const Text(
            'Dispute Resolution Center',
            style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Colors.white),
          ),
          const SizedBox(height: 8),
          Text(
            'Resolve conflicts through transparent community governance',
            style: TextStyle(fontSize: 16, color: Colors.orange.shade100),
          ),
          const SizedBox(height: 16),
>>>>>>> 9823c84 (chore: sync and clean repo)
          Row(
            children: [
              _buildStat('3', 'Active Disputes'),
              const SizedBox(width: 32),
              _buildStat('1', 'Under Voting'),
              const SizedBox(width: 32),
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
<<<<<<< HEAD
      children: [
        Text(value, style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Colors.white)),
=======
      children: <dynamic>[
        Text(
          value,
          style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Colors.white),
        ),
>>>>>>> 9823c84 (chore: sync and clean repo)
        Text(label, style: TextStyle(fontSize: 14, color: Colors.orange.shade100)),
      ],
    );
  }

  Widget _buildCategoryFilter() {
    final categories = ['All', 'Land', 'Financial', 'Contract', 'Technical'];
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      child: SingleChildScrollView(
        scrollDirection: Axis.horizontal,
        child: Row(
          children: categories.map((category) {
            return Padding(
              padding: const EdgeInsets.only(right: 8),
              child: FilterChip(
                label: Text(category),
                selected: category == 'All',
                onSelected: (bool selected) {},
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
    final MaterialColor statusColor = dispute['status'] == 'Resolved'
        ? Colors.green
        : dispute['status'] == 'Voting'
        ? Colors.blue
        : Colors.orange;
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Expanded(
                  child: Text(
                    dispute['title'],
                    style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: statusColor.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    dispute['status'],
                    style: TextStyle(color: statusColor, fontWeight: FontWeight.bold),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Text(dispute['description'], style: TextStyle(color: Colors.grey.shade700)),
            const SizedBox(height: 12),
            Row(
<<<<<<< HEAD
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
=======
              children: <dynamic>[
                const Icon(Icons.group, size: 16, color: Colors.grey),
                const SizedBox(width: 4),
                Text(dispute['parties'].join(' vs '), style: const TextStyle(color: Colors.grey)),
                const SizedBox(width: 16),
                const Icon(Icons.category, size: 16, color: Colors.grey),
                const SizedBox(width: 4),
                Text(dispute['category'], style: const TextStyle(color: Colors.grey)),
              ],
            ),
            const SizedBox(height: 12),
            if (dispute['status'] != 'Resolved') ...<dynamic>[
              Row(
                children: <dynamic>[
                  const Icon(Icons.how_to_vote, size: 16, color: Colors.grey),
                  const SizedBox(width: 4),
                  Text(
                    '${dispute['votes']} / ${dispute['totalVotes']} votes',
                    style: const TextStyle(color: Colors.grey),
                  ),
>>>>>>> 9823c84 (chore: sync and clean repo)
                ],
              ),
              const SizedBox(height: 8),
              LinearProgressIndicator(
                value: dispute['votes'] / dispute['totalVotes'],
                backgroundColor: Colors.grey.shade200,
                valueColor: AlwaysStoppedAnimation<Color>(statusColor),
              ),
            ],
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: OutlinedButton(
                    onPressed: () => _showDisputeDetails(dispute),
                    child: const Text('View Details'),
                  ),
                ),
<<<<<<< HEAD
                SizedBox(width: 8),
                if (dispute['status'] == 'Voting') ...[
=======
                const SizedBox(width: 8),
                if (dispute['status'] == 'Voting') ...<dynamic>[
>>>>>>> 9823c84 (chore: sync and clean repo)
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () => _showVotingDialog(dispute),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.orange.shade600,
                        foregroundColor: Colors.white,
                      ),
                      child: const Text('Vote Now'),
                    ),
                  ),
                ] else if (dispute['status'] == 'Under Review') ...[
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () => _showCommentDialog(dispute),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.blue.shade600,
                        foregroundColor: Colors.white,
                      ),
                      child: const Text('Add Comment'),
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
      builder: (BuildContext context) => AlertDialog(
        title: const Text('Raise New Dispute'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
<<<<<<< HEAD
          children: [
            TextField(decoration: InputDecoration(labelText: 'Dispute Title', border: OutlineInputBorder())),
            SizedBox(height: 16),
            DropdownButtonFormField<String>(
              decoration: InputDecoration(labelText: 'Category', border: OutlineInputBorder()),
              items: ['Land', 'Financial', 'Contract', 'Technical'].map((cat) => DropdownMenuItem(value: cat, child: Text(cat))).toList(),
              onChanged: (value) {},
=======
          children: <dynamic>[
            const TextField(
              decoration: InputDecoration(labelText: 'Dispute Title', border: OutlineInputBorder()),
>>>>>>> 9823c84 (chore: sync and clean repo)
            ),
            const SizedBox(height: 16),
            DropdownButtonFormField<String>(
              decoration: const InputDecoration(
                labelText: 'Category',
                border: OutlineInputBorder(),
              ),
              items: <String>[
                'Land',
                'Financial',
                'Contract',
                'Technical',
              ].map((String cat) => DropdownMenuItem(value: cat, child: Text(cat))).toList(),
              onChanged: (String? value) {},
            ),
            const SizedBox(height: 16),
            const TextField(
              decoration: InputDecoration(
                labelText: 'Involved Parties',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 16),
            const TextField(
              decoration: InputDecoration(labelText: 'Description', border: OutlineInputBorder()),
              maxLines: 3,
            ),
          ],
        ),
<<<<<<< HEAD
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: Text('Cancel')),
=======
        actions: <dynamic>[
          TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancel')),
>>>>>>> 9823c84 (chore: sync and clean repo)
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              ScaffoldMessenger.of(
                context,
              ).showSnackBar(const SnackBar(content: Text('Dispute submitted for review!')));
            },
            child: const Text('Submit Dispute'),
          ),
        ],
      ),
    );
  }

  void _showDisputeDetails(Map<String, dynamic> dispute) {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (BuildContext context) => DisputeDetailScreen(dispute: dispute)),
    );
  }

  void _showVotingDialog(Map<String, dynamic> dispute) {
    showDialog(
      context: context,
      builder: (BuildContext context) => AlertDialog(
        title: const Text('Vote on Dispute'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(dispute['title']),
            const SizedBox(height: 16),
            const Text('How do you vote on this dispute?'),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: ElevatedButton(
                    onPressed: () {
                      Navigator.pop(context);
                      ScaffoldMessenger.of(
                        context,
                      ).showSnackBar(const SnackBar(content: Text('Vote recorded!')));
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.green.shade600,
                      foregroundColor: Colors.white,
                    ),
                    child: const Text('For Resolution'),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: ElevatedButton(
                    onPressed: () {
                      Navigator.pop(context);
                      ScaffoldMessenger.of(
                        context,
                      ).showSnackBar(const SnackBar(content: Text('Vote recorded!')));
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.red.shade600,
                      foregroundColor: Colors.white,
                    ),
                    child: const Text('Against Resolution'),
                  ),
                ),
              ],
            ),
          ],
        ),
<<<<<<< HEAD
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: Text('Cancel')),
=======
        actions: <dynamic>[
          TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancel')),
>>>>>>> 9823c84 (chore: sync and clean repo)
        ],
      ),
    );
  }

  void _showCommentDialog(Map<String, dynamic> dispute) {
    showDialog(
      context: context,
      builder: (BuildContext context) => AlertDialog(
        title: const Text('Add Comment'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(dispute['title']),
            const SizedBox(height: 16),
            const TextField(
              decoration: InputDecoration(labelText: 'Your Comment', border: OutlineInputBorder()),
              maxLines: 3,
            ),
          ],
        ),
<<<<<<< HEAD
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: Text('Cancel')),
=======
        actions: <dynamic>[
          TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancel')),
>>>>>>> 9823c84 (chore: sync and clean repo)
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              ScaffoldMessenger.of(
                context,
              ).showSnackBar(const SnackBar(content: Text('Comment added!')));
            },
            child: const Text('Submit Comment'),
          ),
        ],
      ),
    );
  }
}

class DisputeDetailScreen extends StatelessWidget {
<<<<<<< HEAD
=======
  const DisputeDetailScreen({super.key, required this.dispute});
>>>>>>> 9823c84 (chore: sync and clean repo)
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
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
<<<<<<< HEAD
                  children: [
                    Text('Dispute Information', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                    SizedBox(height: 16),
=======
                  children: <dynamic>[
                    const Text(
                      'Dispute Information',
                      style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 16),
>>>>>>> 9823c84 (chore: sync and clean repo)
                    _buildInfoRow('ID', dispute['id']),
                    _buildInfoRow('Status', dispute['status']),
                    _buildInfoRow('Category', dispute['category']),
                    _buildInfoRow('Date', dispute['date']),
                    _buildInfoRow('Parties', dispute['parties'].join(' vs ')),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
<<<<<<< HEAD
                  children: [
                    Text('Description', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                    SizedBox(height: 8),
=======
                  children: <dynamic>[
                    const Text(
                      'Description',
                      style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 8),
>>>>>>> 9823c84 (chore: sync and clean repo)
                    Text(dispute['description']),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
<<<<<<< HEAD
                  children: [
                    Text('Voting Progress', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                    SizedBox(height: 16),
=======
                  children: <dynamic>[
                    const Text(
                      'Voting Progress',
                      style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 16),
>>>>>>> 9823c84 (chore: sync and clean repo)
                    LinearProgressIndicator(
                      value: dispute['votes'] / dispute['totalVotes'],
                      backgroundColor: Colors.grey.shade200,
                      valueColor: AlwaysStoppedAnimation<Color>(Colors.orange.shade600),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      '${dispute['votes']} / ${dispute['totalVotes']} votes (${(dispute['votes'] / dispute['totalVotes'] * 100).toStringAsFixed(1)}%)',
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
<<<<<<< HEAD
                  children: [
                    Text('Comments', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                    SizedBox(height: 8),
                    _buildCommentCard('Community Member', 'We need more transparency in this process.', '2 hours ago'),
                    _buildCommentCard('Project Manager', 'The timeline is being reviewed by all parties.', '1 day ago'),
=======
                  children: <dynamic>[
                    const Text(
                      'Comments',
                      style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 8),
                    _buildCommentCard(
                      'Community Member',
                      'We need more transparency in this process.',
                      '2 hours ago',
                    ),
                    _buildCommentCard(
                      'Project Manager',
                      'The timeline is being reviewed by all parties.',
                      '1 day ago',
                    ),
>>>>>>> 9823c84 (chore: sync and clean repo)
                  ],
                ),
              ),
            ),
            const SizedBox(height: 24),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () {
                  Navigator.pop(context);
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.orange.shade600,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                ),
                child: Text(dispute['status'] == 'Voting' ? 'Vote Now' : 'Add Comment'),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
<<<<<<< HEAD
        children: [
          SizedBox(width: 100, child: Text('$label:', style: TextStyle(fontWeight: FontWeight.bold))),
=======
        children: <dynamic>[
          SizedBox(
            width: 100,
            child: Text('$label:', style: const TextStyle(fontWeight: FontWeight.bold)),
          ),
>>>>>>> 9823c84 (chore: sync and clean repo)
          Expanded(child: Text(value)),
        ],
      ),
    );
  }

  Widget _buildCommentCard(String author, String comment, String time) {
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
<<<<<<< HEAD
              children: [
                CircleAvatar(backgroundColor: Colors.orange.shade100, child: Icon(Icons.person, color: Colors.orange.shade600)),
                SizedBox(width: 12),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(author, style: TextStyle(fontWeight: FontWeight.bold)),
                    Text(time, style: TextStyle(color: Colors.grey, fontSize: 12)),
=======
              children: <dynamic>[
                CircleAvatar(
                  backgroundColor: Colors.orange.shade100,
                  child: Icon(Icons.person, color: Colors.orange.shade600),
                ),
                const SizedBox(width: 12),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <dynamic>[
                    Text(author, style: const TextStyle(fontWeight: FontWeight.bold)),
                    Text(time, style: const TextStyle(color: Colors.grey, fontSize: 12)),
>>>>>>> 9823c84 (chore: sync and clean repo)
                  ],
                ),
              ],
            ),
            const SizedBox(height: 8),
            Text(comment),
          ],
        ),
      ),
    );
  }
}
