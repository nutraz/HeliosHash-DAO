import 'package:flutter/material.dart';
import 'package:helios_hash_dao/app_constant.dart';
import 'package:helios_hash_dao/mock_data.dart';
import 'package:helios_hash_dao/project_model.dart';

class ProjectApplicationPage extends StatefulWidget {

  const ProjectApplicationPage({super.key, required this.project});
  final Project project;

  @override
  State<ProjectApplicationPage> createState() => _ProjectApplicationPageState();
}

class _ProjectApplicationPageState extends State<ProjectApplicationPage> {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _roleController = TextEditingController();
  final TextEditingController _coverLetterController = TextEditingController();
  final TextEditingController _experienceController = TextEditingController();
  final TextEditingController _availabilityController = TextEditingController();
  final TextEditingController _proposedRateController = TextEditingController();
  final TextEditingController _expectedHoursController = TextEditingController();

  String _selectedRole = '';
  bool _isLoading = false;

  final List<String> _availableRoles = <String>[
    'Smart Contract Developer',
    'Frontend Developer',
    'Backend Developer',
    'UI/UX Designer',
    'Project Manager',
    'Blockchain Analyst',
    'Community Manager',
    'Marketing Specialist',
    'Legal Advisor',
    'Other',
  ];

  @override
  void initState() {
    super.initState();
    _selectedRole = _availableRoles.first;
  }

  @override
  void dispose() {
    _roleController.dispose();
    _coverLetterController.dispose();
    _experienceController.dispose();
    _availabilityController.dispose();
    _proposedRateController.dispose();
    _expectedHoursController.dispose();
    super.dispose();
  }

  Future<void> _submitApplication() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isLoading = true);

    // Simulate API call
    await Future.delayed(const Duration(seconds: 2));

    setState(() => _isLoading = false);

    // Show success message and navigate back
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Application submitted successfully!')),
      );
      Navigator.of(context).pop();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Apply to Project'),
        backgroundColor: AppConstants.primaryColor,
        foregroundColor: Colors.white,
      ),
      body: Form(
        key: _formKey,
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <dynamic>[
              // Project Info Card
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: <dynamic>[
                      Text(
                        widget.project.title,
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        widget.project.description,
                        style: TextStyle(
                          color: Colors.grey[600],
                          height: 1.4,
                        ),
                      ),
                      const SizedBox(height: 12),
                      Row(
                        children: <dynamic>[
                          Icon(Icons.attach_money, size: 16, color: Colors.green),
                          const SizedBox(width: 4),
                          Text(
                            'Budget: \$${widget.project.budget.toStringAsFixed(0)}',
                            style: const TextStyle(
                              fontWeight: FontWeight.bold,
                              color: Colors.green,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),

              const SizedBox(height: 24),

              // Role Selection
              const Text(
                "Role You're Applying For",
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 8),
              DropdownButtonFormField<String>(
                value: _selectedRole,
                decoration: const InputDecoration(
                  border: OutlineInputBorder(),
                  contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                ),
                items: _availableRoles.map((String role) {
                  return DropdownMenuItem(
                    value: role,
                    child: Text(role),
                  );
                }).toList(),
                onChanged: (value) {
                  setState(() {
                    _selectedRole = value!;
                  });
                },
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please select a role';
                  }
                  return null;
                },
              ),

              const SizedBox(height: 24),

              // Cover Letter
              const Text(
                'Cover Letter',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 8),
              TextFormField(
                controller: _coverLetterController,
                decoration: const InputDecoration(
                  hintText: "Tell us why you're interested in this project and what you can contribute...",
                  border: OutlineInputBorder(),
                  contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                ),
                maxLines: 6,
                maxLength: 1000,
                validator: (value) {
                  if (value == null || value.trim().isEmpty) {
                    return 'Please write a cover letter';
                  }
                  if (value.length < 50) {
                    return 'Cover letter must be at least 50 characters';
                  }
                  return null;
                },
              ),

              const SizedBox(height: 24),

              // Experience
              const Text(
                'Relevant Experience',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 8),
              TextFormField(
                controller: _experienceController,
                decoration: const InputDecoration(
                  hintText: 'Describe your relevant experience and skills...',
                  border: OutlineInputBorder(),
                  contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                ),
                maxLines: 4,
                maxLength: 500,
                validator: (value) {
                  if (value == null || value.trim().isEmpty) {
                    return 'Please describe your experience';
                  }
                  return null;
                },
              ),

              const SizedBox(height: 24),

              // Availability
              const Text(
                'Availability',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 8),
              TextFormField(
                controller: _availabilityController,
                decoration: const InputDecoration(
                  hintText: 'How many hours per week can you commit?',
                  border: OutlineInputBorder(),
                  contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                ),
                keyboardType: TextInputType.number,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please specify your availability';
                  }
                  final int? hours = int.tryParse(value);
                  if (hours == null || hours <= 0) {
                    return 'Please enter a valid number of hours';
                  }
                  return null;
                },
              ),

              const SizedBox(height: 24),

              // Proposed Rate (Optional)
              const Text(
                'Proposed Rate (Optional)',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 8),
              TextFormField(
                controller: _proposedRateController,
                decoration: const InputDecoration(
                  hintText: 'Rate per hour in USD (optional)',
                  prefixText: r'$',
                  border: OutlineInputBorder(),
                  contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                ),
                keyboardType: TextInputType.number,
              ),

              const SizedBox(height: 24),

              // Terms and Conditions
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.blue[50],
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: Colors.blue[200]!),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <dynamic>[
                    Row(
                      children: <dynamic>[
                        Icon(Icons.info_outline, color: Colors.blue[700]),
                        const SizedBox(width: 8),
                        Text(
                          'Application Terms',
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            color: Colors.blue[700],
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Text(
                      '• All applications are subject to review by project maintainers\n'
                      "• You agree to follow the project's code of conduct\n"
                      '• Payment terms will be discussed separately if accepted\n'
                      '• You can withdraw your application at any time',
                      style: TextStyle(
                        fontSize: 14,
                        color: Colors.blue[700],
                        height: 1.4,
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 32),

              // Submit Button
              SizedBox(
                width: double.infinity,
                height: 50,
                child: ElevatedButton(
                  onPressed: _isLoading ? null : _submitApplication,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppConstants.primaryColor,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  child: _isLoading
                      ? const CircularProgressIndicator(color: Colors.white)
                      : const Text(
                          'Submit Application',
                          style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                        ),
                ),
              ),

              const SizedBox(height: 16),

              // Cancel Button
              SizedBox(
                width: double.infinity,
                height: 50,
                child: OutlinedButton(
                  onPressed: () {
                    Navigator.of(context).pop();
                  },
                  style: OutlinedButton.styleFrom(
                    side: BorderSide(color: AppConstants.primaryColor),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  child: Text(
                    'Cancel',
                    style: TextStyle(
                      color: AppConstants.primaryColor,
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
