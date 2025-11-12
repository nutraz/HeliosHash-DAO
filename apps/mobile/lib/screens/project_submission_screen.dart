import 'package:flutter/material.dart';

class ProjectSubmissionScreen extends StatefulWidget {
  const ProjectSubmissionScreen({super.key});

  @override
  _ProjectSubmissionScreenState createState() => _ProjectSubmissionScreenState();
}

class _ProjectSubmissionScreenState extends State<ProjectSubmissionScreen> {
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();
  final TextEditingController _titleController = TextEditingController();
  final TextEditingController _descriptionController = TextEditingController();
  final TextEditingController _budgetController = TextEditingController();
  final TextEditingController _locationController = TextEditingController();
  String _selectedCategory = 'Solar Farm';
<<<<<<< HEAD
  List<String> _categories = ['Solar Farm', 'Microgrid', 'School Electrification', 'Community Center'];
=======
  final List<String> _categories = <String>[
    'Solar Farm',
    'Microgrid',
    'School Electrification',
    'Community Center',
  ];
>>>>>>> 9823c84 (chore: sync and clean repo)

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Submit New Project'),
        backgroundColor: Colors.green.shade600,
        foregroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
<<<<<<< HEAD
            children: [
              Text('Project Details', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
              SizedBox(height: 20),
=======
            children: <dynamic>[
              const Text(
                'Project Details',
                style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 20),
>>>>>>> 9823c84 (chore: sync and clean repo)
              TextFormField(
                controller: _titleController,
                decoration: const InputDecoration(
                  labelText: 'Project Title',
                  border: OutlineInputBorder(),
                ),
                validator: (String? value) =>
                    value == null || value.isEmpty ? 'Please enter a project title' : null,
              ),
              const SizedBox(height: 16),
              DropdownButtonFormField<String>(
                value: _selectedCategory,
<<<<<<< HEAD
                decoration: InputDecoration(labelText: 'Project Category', border: OutlineInputBorder()),
                items: _categories.map((c) => DropdownMenuItem(value: c, child: Text(c))).toList(),
                onChanged: (v) => setState(() => _selectedCategory = v!),
=======
                decoration: const InputDecoration(
                  labelText: 'Project Category',
                  border: OutlineInputBorder(),
                ),
                items: _categories
                    .map((String c) => DropdownMenuItem(value: c, child: Text(c)))
                    .toList(),
                onChanged: (String? v) => setState(() => _selectedCategory = v!),
>>>>>>> 9823c84 (chore: sync and clean repo)
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _descriptionController,
                decoration: const InputDecoration(
                  labelText: 'Project Description',
                  border: OutlineInputBorder(),
                ),
                maxLines: 4,
                validator: (String? value) =>
                    value == null || value.isEmpty ? 'Please enter a project description' : null,
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _budgetController,
                decoration: const InputDecoration(
                  labelText: 'Budget Required (₹)',
                  border: OutlineInputBorder(),
                  prefixText: '₹',
                ),
                keyboardType: TextInputType.number,
                validator: (String? value) =>
                    value == null || value.isEmpty ? 'Please enter a budget amount' : null,
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _locationController,
                decoration: const InputDecoration(
                  labelText: 'Project Location',
                  border: OutlineInputBorder(),
                ),
                validator: (String? value) =>
                    value == null || value.isEmpty ? 'Please enter a project location' : null,
              ),
              const SizedBox(height: 24),
              const Text(
                'Project Documents',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 12),
              const Card(
                child: ListTile(
                  leading: Icon(Icons.upload_file),
                  title: Text('Upload Project Proposal'),
                  subtitle: Text('PDF, DOC, DOCX (Max 10MB)'),
                  trailing: Icon(Icons.cloud_upload),
                ),
              ),
              const SizedBox(height: 12),
              const Card(
                child: ListTile(
                  leading: Icon(Icons.map),
                  title: Text('Location Map'),
                  subtitle: Text('Upload site map or coordinates'),
                  trailing: Icon(Icons.add_photo_alternate),
                ),
              ),
              const SizedBox(height: 12),
              const Card(
                child: ListTile(
                  leading: Icon(Icons.calculate),
                  title: Text('Budget Breakdown'),
                  subtitle: Text('Detailed cost estimation'),
                  trailing: Icon(Icons.add_photo_alternate),
                ),
              ),
              const SizedBox(height: 32),
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () => Navigator.pop(context),
                      style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 16),
                      ),
                      child: const Text('Cancel'),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () {
                        if (_formKey.currentState!.validate()) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(content: Text('Project submitted for review!')),
                          );
                          Navigator.pop(context);
                        }
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.green.shade600,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 16),
                      ),
                      child: const Text('Submit Project'),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
