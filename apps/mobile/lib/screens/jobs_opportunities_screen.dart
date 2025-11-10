import 'package:flutter/material.dart';

class JobsOpportunitiesScreen extends StatefulWidget {
  const JobsOpportunitiesScreen({super.key});

  @override
  _JobsOpportunitiesScreenState createState() => _JobsOpportunitiesScreenState();
}

class _JobsOpportunitiesScreenState extends State<JobsOpportunitiesScreen> {
  final List<Map<String, dynamic>> _jobs = <Map<String, dynamic>>[
    <String, dynamic>{
      'title': 'Solar Engineer',
      'company': 'HeliosHash Energy',
      'location': 'Urgam Valley, Uttarakhand',
      'type': 'Full-time',
      'salary': '₹8-12 LPA',
      'posted': '2 days ago',
      'skills': <String>['Solar Design', 'Project Management', 'AutoCAD'],
    },
    <String, dynamic>{
      'title': 'Community Outreach Coordinator',
      'company': 'Solar Community Initiative',
      'location': 'Dharampur, Gujarat',
      'type': 'Part-time',
      'salary': '₹4-6 LPA',
      'posted': '1 week ago',
      'skills': <String>['Community Engagement', 'Event Planning', 'Public Speaking'],
    },
    <String, dynamic>{
      'title': 'Solar Technician',
      'company': 'GreenTech Solutions',
      'location': 'Multiple Locations',
      'type': 'Contract',
      'salary': '₹3-5 LPA',
      'posted': '3 days ago',
      'skills': <String>['Installation', 'Maintenance', 'Troubleshooting'],
    },
    <String, dynamic>{
      'title': 'Project Manager',
      'company': 'Solar Infrastructure Co.',
      'location': 'Mumbai, Maharashtra',
      'type': 'Full-time',
      'salary': '₹15-20 LPA',
      'posted': '5 days ago',
      'skills': <String>['PMP Certified', 'Team Leadership', 'Budget Management'],
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Jobs & Opportunities'),
        backgroundColor: Colors.blue.shade600,
        foregroundColor: Colors.white,
        actions: <dynamic>[
          IconButton(icon: const Icon(Icons.filter_list), onPressed: () => _showFilterDialog()),
          IconButton(icon: const Icon(Icons.add), onPressed: () => _showPostJobDialog()),
        ],
      ),
      body: Column(
        children: <dynamic>[
          _buildSearchBar(),
          _buildStatsRow(),
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(8),
              itemCount: _jobs.length,
              itemBuilder: (BuildContext context, int index) {
                return _buildJobCard(_jobs[index]);
              },
            ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => _showPostJobDialog(),
        backgroundColor: Colors.blue.shade600,
        child: const Icon(Icons.add),
      ),
    );
  }

  Widget _buildSearchBar() {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: TextField(
        decoration: InputDecoration(
          hintText: 'Search jobs by title, company, or location...',
          prefixIcon: const Icon(Icons.search),
          border: OutlineInputBorder(borderRadius: BorderRadius.circular(30)),
          contentPadding: const EdgeInsets.symmetric(),
        ),
      ),
    );
  }

  Widget _buildStatsRow() {
    return const Padding(
      padding: EdgeInsets.symmetric(horizontal: 16),
      child: Row(
        children: <dynamic>[
          Expanded(
            child: Card(
              child: Padding(
                padding: EdgeInsets.all(12),
                child: Column(
                  children: <dynamic>[
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
                  children: <dynamic>[
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
                  children: <dynamic>[
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
      margin: const EdgeInsets.only(bottom: 12),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <dynamic>[
            Row(
              children: <dynamic>[
                Expanded(
                  child: Text(
                    job['title'],
                    style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: Colors.blue.shade100,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    job['type'],
                    style: TextStyle(color: Colors.blue.shade800, fontWeight: FontWeight.bold),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Text(job['company'], style: TextStyle(fontSize: 16, color: Colors.grey.shade700)),
            const SizedBox(height: 8),
            Row(
              children: <dynamic>[
                const Icon(Icons.location_on, size: 16, color: Colors.grey),
                const SizedBox(width: 4),
                Text(job['location'], style: const TextStyle(color: Colors.grey)),
                const SizedBox(width: 16),
                const Icon(Icons.attach_money, size: 16, color: Colors.grey),
                const SizedBox(width: 4),
                Text(job['salary'], style: const TextStyle(color: Colors.grey)),
              ],
            ),
            const SizedBox(height: 12),
            Wrap(
              spacing: 6,
              children: job['skills'].map<Widget>((skill) {
                return Chip(label: Text(skill), backgroundColor: Colors.grey.shade200);
              }).toList(),
            ),
            const SizedBox(height: 16),
            Row(
              children: <dynamic>[
                Expanded(
                  child: OutlinedButton(
                    onPressed: () => _showJobDetails(job),
                    child: const Text('View Details'),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: ElevatedButton(
                    onPressed: () => _showApplyDialog(job),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.blue.shade600,
                      foregroundColor: Colors.white,
                    ),
                    child: const Text('Apply Now'),
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
      builder: (BuildContext context) => AlertDialog(
        title: const Text('Filter Jobs'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: <dynamic>[
            DropdownButtonFormField<String>(
              decoration: const InputDecoration(labelText: 'Job Type'),
              items: <String>[
                'All',
                'Full-time',
                'Part-time',
                'Contract',
                'Internship',
              ].map((String type) => DropdownMenuItem(value: type, child: Text(type))).toList(),
              onChanged: (String? value) {},
            ),
            const SizedBox(height: 16),
            DropdownButtonFormField<String>(
              decoration: const InputDecoration(labelText: 'Location'),
              items: <String>[
                'All',
                'Urgam Valley',
                'Dharampur',
                'Mumbai',
                'Remote',
              ].map((String loc) => DropdownMenuItem(value: loc, child: Text(loc))).toList(),
              onChanged: (String? value) {},
            ),
            const SizedBox(height: 16),
            DropdownButtonFormField<String>(
              decoration: const InputDecoration(labelText: 'Experience Level'),
              items: <String>[
                'All',
                'Entry Level',
                'Mid Level',
                'Senior',
                'Executive',
              ].map((String level) => DropdownMenuItem(value: level, child: Text(level))).toList(),
              onChanged: (String? value) {},
            ),
          ],
        ),
        actions: <dynamic>[
          TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancel')),
          ElevatedButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Apply Filters'),
          ),
        ],
      ),
    );
  }

  void _showPostJobDialog() {
    showDialog(
      context: context,
      builder: (BuildContext context) => const AlertDialog(
        title: Text('Post New Job'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: <dynamic>[
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
        actions: <dynamic>[
          TextButton(onPressed: () => Navigator.pop(context), child: Text('Cancel')),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              ScaffoldMessenger.of(
                context,
              ).showSnackBar(const SnackBar(content: Text('Job posted successfully!')));
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
      MaterialPageRoute(builder: (BuildContext context) => JobDetailScreen(job: job)),
    );
  }

  void _showApplyDialog(Map<String, dynamic> job) {
    showDialog(
      context: context,
      builder: (BuildContext context) => AlertDialog(
        title: Text('Apply for ${job['title']}'),
        content: const Column(
          mainAxisSize: MainAxisSize.min,
          children: <dynamic>[
            TextField(decoration: InputDecoration(labelText: 'Full Name')),
            SizedBox(height: 12),
            TextField(decoration: InputDecoration(labelText: 'Email')),
            SizedBox(height: 12),
            TextField(decoration: InputDecoration(labelText: 'Phone Number')),
            SizedBox(height: 12),
            TextField(decoration: InputDecoration(labelText: 'Cover Letter'), maxLines: 3),
            SizedBox(height: 12),
            Row(
              children: <dynamic>[
                Icon(Icons.attach_file),
                SizedBox(width: 8),
                Text('Upload Resume'),
              ],
            ),
          ],
        ),
        actions: <dynamic>[
          TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancel')),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              ScaffoldMessenger.of(
                context,
              ).showSnackBar(const SnackBar(content: Text('Application submitted!')));
            },
            child: const Text('Submit Application'),
          ),
        ],
      ),
    );
  }
}

class JobDetailScreen extends StatelessWidget {
  const JobDetailScreen({super.key, required this.job});
  final Map<String, dynamic> job;
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(job['title']),
        backgroundColor: Colors.blue.shade600,
        foregroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <dynamic>[
            Text(job['title'], style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            Text(job['company'], style: TextStyle(fontSize: 18, color: Colors.grey.shade700)),
            const SizedBox(height: 16),
            Row(
              children: <dynamic>[
                const Icon(Icons.location_on, size: 16, color: Colors.grey),
                const SizedBox(width: 4),
                Text(job['location'], style: const TextStyle(color: Colors.grey)),
                const SizedBox(width: 16),
                const Icon(Icons.work, size: 16, color: Colors.grey),
                const SizedBox(width: 4),
                Text(job['type'], style: const TextStyle(color: Colors.grey)),
                const SizedBox(width: 16),
                const Icon(Icons.attach_money, size: 16, color: Colors.grey),
                const SizedBox(width: 4),
                Text(job['salary'], style: const TextStyle(color: Colors.grey)),
              ],
            ),
            const SizedBox(height: 16),
            const Text(
              'Job Description',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            const Text(
              'We are looking for a passionate individual to join our team and contribute to our solar energy projects. The ideal candidate will have experience in renewable energy and a commitment to sustainable development.',
            ),
            const SizedBox(height: 16),
            const Text(
              'Required Skills',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            Wrap(
              spacing: 6,
              children: job['skills'].map<Widget>((skill) {
                return Chip(label: Text(skill), backgroundColor: Colors.grey.shade200);
              }).toList(),
            ),
            const SizedBox(height: 24),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () {
                  Navigator.pop(context);
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.blue.shade600,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                ),
                child: const Text('Apply Now'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
