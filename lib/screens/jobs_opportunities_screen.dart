import 'package:flutter/material.dart';

class JobsOpportunitiesScreen extends StatefulWidget {
  @override
  _JobsOpportunitiesScreenState createState() => _JobsOpportunitiesScreenState();
}

class _JobsOpportunitiesScreenState extends State<JobsOpportunitiesScreen> {
  List<Map<String, dynamic>> _jobs = [
    {
      'title': 'Solar Engineer',
      'company': 'HeliosHash Energy',
      'location': 'Urgam Valley, Uttarakhand',
      'type': 'Full-time',
      'salary': '₹8-12 LPA',
      'posted': '2 days ago',
      'skills': ['Solar Design', 'Project Management', 'AutoCAD'],
    },
    {
      'title': 'Community Outreach Coordinator',
      'company': 'Solar Community Initiative',
      'location': 'Dharampur, Gujarat',
      'type': 'Part-time',
      'salary': '₹4-6 LPA',
      'posted': '1 week ago',
      'skills': ['Community Engagement', 'Event Planning', 'Public Speaking'],
    },
    {
      'title': 'Solar Technician',
      'company': 'GreenTech Solutions',
      'location': 'Multiple Locations',
      'type': 'Contract',
      'salary': '₹3-5 LPA',
      'posted': '3 days ago',
      'skills': ['Installation', 'Maintenance', 'Troubleshooting'],
    },
    {
      'title': 'Project Manager',
      'company': 'Solar Infrastructure Co.',
      'location': 'Mumbai, Maharashtra',
      'type': 'Full-time',
      'salary': '₹15-20 LPA',
      'posted': '5 days ago',
      'skills': ['PMP Certified', 'Team Leadership', 'Budget Management'],
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Jobs & Opportunities'),
        backgroundColor: Colors.blue.shade600,
        foregroundColor: Colors.white,
        actions: [
          IconButton(icon: Icon(Icons.filter_list), onPressed: () => _showFilterDialog()),
          IconButton(icon: Icon(Icons.add), onPressed: () => _showPostJobDialog()),
        ],
      ),
      body: Column(
        children: [
          _buildSearchBar(),
          _buildStatsRow(),
          Expanded(
            child: ListView.builder(
              padding: EdgeInsets.all(8),
              itemCount: _jobs.length,
              itemBuilder: (context, index) {
                return _buildJobCard(_jobs[index]);
              },
            ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => _showPostJobDialog(),
        backgroundColor: Colors.blue.shade600,
        child: Icon(Icons.add),
      ),
    );
  }

  Widget _buildSearchBar() {
    return Padding(
      padding: EdgeInsets.all(16),
      child: TextField(
        decoration: InputDecoration(
          hintText: 'Search jobs by title, company, or location...',
          prefixIcon: Icon(Icons.search),
          border: OutlineInputBorder(borderRadius: BorderRadius.circular(30)),
          contentPadding: EdgeInsets.symmetric(vertical: 0),
        ),
      ),
    );
  }

  Widget _buildStatsRow() {
    return Padding(
      padding: EdgeInsets.symmetric(horizontal: 16),
      child: Row(
        children: [
          Expanded(
            child: Card(
              child: Padding(
                padding: EdgeInsets.all(12),
                child: Column(
                  children: [
                    Text('24', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
                    Text('Active Jobs', style: TextStyle(color: Colors.grey)),
                  ],
                ),
              ),
            ),
          ),
          SizedBox(width: 8),
          Expanded(
            child: Card(
              child: Padding(
                padding: EdgeInsets.all(12),
                child: Column(
                  children: [
                    Text('156', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
                    Text('Applications', style: TextStyle(color: Colors.grey)),
                  ],
                ),
              ),
            ),
          ),
          SizedBox(width: 8),
          Expanded(
            child: Card(
              child: Padding(
                padding: EdgeInsets.all(12),
                child: Column(
                  children: [
                    Text('8', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
                    Text('New This Week', style: TextStyle(color: Colors.grey)),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildJobCard(Map<String, dynamic> job) {
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
                  child: Text(job['title'], style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                ),
                Container(
                  padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(color: Colors.blue.shade100, borderRadius: BorderRadius.circular(12)),
                  child: Text(job['type'], style: TextStyle(color: Colors.blue.shade800, fontWeight: FontWeight.bold)),
                ),
              ],
            ),
            SizedBox(height: 8),
            Text(job['company'], style: TextStyle(fontSize: 16, color: Colors.grey.shade700)),
            SizedBox(height: 8),
            Row(
              children: [
                Icon(Icons.location_on, size: 16, color: Colors.grey),
                SizedBox(width: 4),
                Text(job['location'], style: TextStyle(color: Colors.grey)),
                SizedBox(width: 16),
                Icon(Icons.attach_money, size: 16, color: Colors.grey),
                SizedBox(width: 4),
                Text(job['salary'], style: TextStyle(color: Colors.grey)),
              ],
            ),
            SizedBox(height: 12),
            Wrap(
              spacing: 6,
              children: job['skills'].map<Widget>((skill) {
                return Chip(label: Text(skill), backgroundColor: Colors.grey.shade200);
              }).toList(),
            ),
            SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: OutlinedButton(
                    onPressed: () => _showJobDetails(job),
                    child: Text('View Details'),
                  ),
                ),
                SizedBox(width: 8),
                Expanded(
                  child: ElevatedButton(
                    onPressed: () => _showApplyDialog(job),
                    child: Text('Apply Now'),
                    style: ElevatedButton.styleFrom(backgroundColor: Colors.blue.shade600, foregroundColor: Colors.white),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  void _showFilterDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Filter Jobs'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            DropdownButtonFormField<String>(
              decoration: InputDecoration(labelText: 'Job Type'),
              items: ['All', 'Full-time', 'Part-time', 'Contract', 'Internship'].map((type) => DropdownMenuItem(value: type, child: Text(type))).toList(),
              onChanged: (value) {},
            ),
            SizedBox(height: 16),
            DropdownButtonFormField<String>(
              decoration: InputDecoration(labelText: 'Location'),
              items: ['All', 'Urgam Valley', 'Dharampur', 'Mumbai', 'Remote'].map((loc) => DropdownMenuItem(value: loc, child: Text(loc))).toList(),
              onChanged: (value) {},
            ),
            SizedBox(height: 16),
            DropdownButtonFormField<String>(
              decoration: InputDecoration(labelText: 'Experience Level'),
              items: ['All', 'Entry Level', 'Mid Level', 'Senior', 'Executive'].map((level) => DropdownMenuItem(value: level, child: Text(level))).toList(),
              onChanged: (value) {},
            ),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: Text('Cancel')),
          ElevatedButton(onPressed: () => Navigator.pop(context), child: Text('Apply Filters')),
        ],
      ),
    );
  }

  void _showPostJobDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Post New Job'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(decoration: InputDecoration(labelText: 'Job Title')),
            SizedBox(height: 12),
            TextField(decoration: InputDecoration(labelText: 'Company')),
            SizedBox(height: 12),
            TextField(decoration: InputDecoration(labelText: 'Location')),
            SizedBox(height: 12),
            TextField(decoration: InputDecoration(labelText: 'Job Type')),
            SizedBox(height: 12),
            TextField(decoration: InputDecoration(labelText: 'Salary Range')),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: Text('Cancel')),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Job posted successfully!')));
            },
            child: Text('Post Job'),
          ),
        ],
      ),
    );
  }

  void _showJobDetails(Map<String, dynamic> job) {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => JobDetailScreen(job: job)),
    );
  }

  void _showApplyDialog(Map<String, dynamic> job) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Apply for ${job['title']}'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(decoration: InputDecoration(labelText: 'Full Name')),
            SizedBox(height: 12),
            TextField(decoration: InputDecoration(labelText: 'Email')),
            SizedBox(height: 12),
            TextField(decoration: InputDecoration(labelText: 'Phone Number')),
            SizedBox(height: 12),
            TextField(decoration: InputDecoration(labelText: 'Cover Letter'), maxLines: 3),
            SizedBox(height: 12),
            Row(children: [Icon(Icons.attach_file), SizedBox(width: 8), Text('Upload Resume')]),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: Text('Cancel')),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Application submitted!')));
            },
            child: Text('Submit Application'),
          ),
        ],
      ),
    );
  }
}

class JobDetailScreen extends StatelessWidget {
  final Map<String, dynamic> job;
  JobDetailScreen({required this.job});
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(job['title']),
        backgroundColor: Colors.blue.shade600,
        foregroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        padding: EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(job['title'], style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
            SizedBox(height: 8),
            Text(job['company'], style: TextStyle(fontSize: 18, color: Colors.grey.shade700)),
            SizedBox(height: 16),
            Row(
              children: [
                Icon(Icons.location_on, size: 16, color: Colors.grey),
                SizedBox(width: 4),
                Text(job['location'], style: TextStyle(color: Colors.grey)),
                SizedBox(width: 16),
                Icon(Icons.work, size: 16, color: Colors.grey),
                SizedBox(width: 4),
                Text(job['type'], style: TextStyle(color: Colors.grey)),
                SizedBox(width: 16),
                Icon(Icons.attach_money, size: 16, color: Colors.grey),
                SizedBox(width: 4),
                Text(job['salary'], style: TextStyle(color: Colors.grey)),
              ],
            ),
            SizedBox(height: 16),
            Text('Job Description', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            SizedBox(height: 8),
            Text('We are looking for a passionate individual to join our team and contribute to our solar energy projects. The ideal candidate will have experience in renewable energy and a commitment to sustainable development.'),
            SizedBox(height: 16),
            Text('Required Skills', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            SizedBox(height: 8),
            Wrap(
              spacing: 6,
              children: job['skills'].map<Widget>((skill) {
                return Chip(label: Text(skill), backgroundColor: Colors.grey.shade200);
              }).toList(),
            ),
            SizedBox(height: 24),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () { Navigator.pop(context); },
                child: Text('Apply Now'),
                style: ElevatedButton.styleFrom(backgroundColor: Colors.blue.shade600, foregroundColor: Colors.white, padding: EdgeInsets.symmetric(vertical: 16)),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
