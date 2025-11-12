import 'package:flutter/material.dart';

class ProjectFormStepOne extends StatelessWidget {
<<<<<<< HEAD
  final TextEditingController nameController;
  final TextEditingController descriptionController;
  final TextEditingController locationController;

=======
>>>>>>> 9823c84 (chore: sync and clean repo)
  const ProjectFormStepOne({
    super.key,
    required this.nameController,
    required this.descriptionController,
    required this.locationController,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Basic Project Information',
          style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.green),
        ),
        const SizedBox(height: 16),
        TextFormField(
          controller: nameController,
          decoration: const InputDecoration(
            labelText: 'Project Name *',
            hintText: 'e.g., Urgam Valley Solar Farm Expansion',
            border: OutlineInputBorder(),
            prefixIcon: Icon(Icons.wb_sunny),
          ),
          validator: (String? value) {
            if (value == null || value.isEmpty) {
              return 'Project name is required';
            }
            return null;
          },
        ),
        const SizedBox(height: 16),
        TextFormField(
          controller: descriptionController,
          decoration: const InputDecoration(
            labelText: 'Project Description *',
            hintText: 'Describe the solar project, its benefits, and impact on the community',
            border: OutlineInputBorder(),
            prefixIcon: Icon(Icons.description),
          ),
          maxLines: 4,
          validator: (String? value) {
            if (value == null || value.isEmpty) {
              return 'Project description is required';
            }
            return null;
          },
        ),
        const SizedBox(height: 16),
        TextFormField(
          controller: locationController,
          decoration: const InputDecoration(
            labelText: 'Location *',
            hintText: 'e.g., Urgam Valley, Uttarakhand',
            border: OutlineInputBorder(),
            prefixIcon: Icon(Icons.location_on),
          ),
          validator: (String? value) {
            if (value == null || value.isEmpty) {
              return 'Location is required';
            }
            return null;
          },
        ),
        const SizedBox(height: 16),
        Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: Colors.blue.shade50,
            borderRadius: BorderRadius.circular(8),
            border: Border.all(color: Colors.blue.shade200),
          ),
          child: const Row(
            children: [
              Icon(Icons.info, color: Colors.blue),
              SizedBox(width: 8),
              Expanded(
                child: Text(
                  'This proposal will be submitted to the DAO governance system for community voting before the project can be funded.',
                  style: TextStyle(color: Colors.blue, fontSize: 12),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
