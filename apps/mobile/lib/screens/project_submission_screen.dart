import 'package:flutter/material.dart';

class ProjectSubmissionScreen extends StatefulWidget {
  @override
  _ProjectSubmissionScreenState createState() => _ProjectSubmissionScreenState();
}

class _ProjectSubmissionScreenState extends State<ProjectSubmissionScreen> {
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  final _descriptionController = TextEditingController();
  final _budgetController = TextEditingController();
  final _locationController = TextEditingController();
  String _selectedCategory = 'Solar Farm';
  List<String> _categories = ['Solar Farm', 'Microgrid', 'School Electrification', 'Community Center'];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Submit New Project'),
        backgroundColor: Colors.green.shade600,
        foregroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        padding: EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Project Details', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
              SizedBox(height: 20),
              TextFormField(
                controller: _titleController,
                decoration: InputDecoration(labelText: 'Project Title', border: OutlineInputBorder()),
                validator: (value) => value == null || value.isEmpty ? 'Please enter a project title' : null,
              ),
              SizedBox(height: 16),
              DropdownButtonFormField<String>(
                value: _selectedCategory,
                decoration: InputDecoration(labelText: 'Project Category', border: OutlineInputBorder()),
                items: _categories.map((c) => DropdownMenuItem(value: c, child: Text(c))).toList(),
                onChanged: (v) => setState(() => _selectedCategory = v!),
              ),
              SizedBox(height: 16),
              TextFormField(
                controller: _descriptionController,
                decoration: InputDecoration(labelText: 'Project Description', border: OutlineInputBorder()),
                maxLines: 4,
                validator: (value) => value == null || value.isEmpty ? 'Please enter a project description' : null,
              ),
              SizedBox(height: 16),
              TextFormField(
                controller: _budgetController,
                decoration: InputDecoration(labelText: 'Budget Required (₹)', border: OutlineInputBorder(), prefixText: '₹'),
                keyboardType: TextInputType.number,
                validator: (value) => value == null || value.isEmpty ? 'Please enter a budget amount' : null,
              ),
              SizedBox(height: 16),
              TextFormField(
                controller: _locationController,
                decoration: InputDecoration(labelText: 'Project Location', border: OutlineInputBorder()),
                validator: (value) => value == null || value.isEmpty ? 'Please enter a project location' : null,
              ),
              SizedBox(height: 24),
              Text('Project Documents', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
              SizedBox(height: 12),
              Card(child: ListTile(leading: Icon(Icons.upload_file), title: Text('Upload Project Proposal'), subtitle: Text('PDF, DOC, DOCX (Max 10MB)'), trailing: Icon(Icons.cloud_upload))),
              SizedBox(height: 12),
              Card(child: ListTile(leading: Icon(Icons.map), title: Text('Location Map'), subtitle: Text('Upload site map or coordinates'), trailing: Icon(Icons.add_photo_alternate))),
              SizedBox(height: 12),
              Card(child: ListTile(leading: Icon(Icons.calculate), title: Text('Budget Breakdown'), subtitle: Text('Detailed cost estimation'), trailing: Icon(Icons.add_photo_alternate))),
              SizedBox(height: 32),
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () => Navigator.pop(context),
                      child: Text('Cancel'),
                      style: OutlinedButton.styleFrom(padding: EdgeInsets.symmetric(vertical: 16)),
                    ),
                  ),
                  SizedBox(width: 16),
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () {
                        if (_formKey.currentState!.validate()) {
                          ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Project submitted for review!')));
                          Navigator.pop(context);
                        }
                      },
                      child: Text('Submit Project'),
                      style: ElevatedButton.styleFrom(backgroundColor: Colors.green.shade600, foregroundColor: Colors.white, padding: EdgeInsets.symmetric(vertical: 16)),
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
