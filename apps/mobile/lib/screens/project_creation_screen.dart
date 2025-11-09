import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/dao_provider.dart';
import '../widgets/project_form_step_one.dart';
import '../widgets/project_form_step_two.dart';

class ProjectCreationScreen extends StatefulWidget {
  const ProjectCreationScreen({super.key});

  @override
  State<ProjectCreationScreen> createState() => _ProjectCreationScreenState();
}

class _ProjectCreationScreenState extends State<ProjectCreationScreen> {
  int _currentStep = 0;
  final Map<String, dynamic> _projectData = <String, dynamic>{};

  // Controllers for Step 1
  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _descriptionController = TextEditingController();
  final TextEditingController _locationController = TextEditingController();

  // Controllers for Step 2
  final TextEditingController _fundingGoalController = TextEditingController();
  final TextEditingController _tokenAllocationController = TextEditingController();
  final TextEditingController _capacityController = TextEditingController();

  void _nextStep() {
    if (_currentStep == 0) {
      if (_nameController.text.isEmpty || _descriptionController.text.isEmpty || _locationController.text.isEmpty) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Please fill in all required fields')),
        );
        return;
      }
      _projectData['name'] = _nameController.text;
      _projectData['description'] = _descriptionController.text;
      _projectData['location'] = _locationController.text;
    }

    if (_currentStep < 1) {
      setState(() {
        _currentStep++;
      });
    }
  }

  void _submitProjectProposal() {
    if (_fundingGoalController.text.isEmpty || _tokenAllocationController.text.isEmpty || _capacityController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please fill in all required fields')),
      );
      return;
    }

    _projectData['fundingGoal'] = double.tryParse(_fundingGoalController.text) ?? 0.0;
    _projectData['tokenAllocation'] = double.tryParse(_tokenAllocationController.text) ?? 0.0;
    _projectData['capacity'] = double.tryParse(_capacityController.text) ?? 0.0;

    final daoProvider = Provider.of<DAOProvider>(context, listen: false);

    // Submit as a proposal that needs governance approval
    daoProvider.proposeSolarProject(_projectData);

    Navigator.of(context).pop();
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Project proposal submitted for governance vote!')),
    );
  }

  @override
  Widget build(BuildContext context) {
    final List<Step> steps = <dynamic>[
      Step(
        title: const Text('Project Details'),
        content: ProjectFormStepOne(
          nameController: _nameController,
          descriptionController: _descriptionController,
          locationController: _locationController,
        ),
        isActive: _currentStep >= 0,
      ),
      Step(
        title: const Text('Funding & Capacity'),
        content: ProjectFormStepTwo(
          fundingGoalController: _fundingGoalController,
          tokenAllocationController: _tokenAllocationController,
          capacityController: _capacityController,
        ),
        isActive: _currentStep >= 1,
      ),
    ];

    return Scaffold(
      appBar: AppBar(
        title: const Text('New Solar Project Proposal'),
        backgroundColor: Colors.green,
      ),
      body: Stepper(
        type: StepperType.vertical,
        currentStep: _currentStep,
        onStepContinue: () {
          if (_currentStep == steps.length - 1) {
            _submitProjectProposal();
          } else {
            _nextStep();
          }
        },
        onStepCancel: () {
          if (_currentStep > 0) {
            setState(() {
              _currentStep--;
            });
          } else {
            Navigator.of(context).pop();
          }
        },
        steps: steps,
        controlsBuilder: (context, details) {
          return Padding(
            padding: const EdgeInsets.only(top: 16.0),
            child: Row(
              children: <Widget>[
                ElevatedButton(
                  onPressed: details.onStepContinue,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.green,
                    padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                  ),
                  child: Text(
                    _currentStep == steps.length - 1 ? 'SUBMIT PROPOSAL' : 'NEXT',
                    style: const TextStyle(fontWeight: FontWeight.bold),
                  ),
                ),
                const SizedBox(width: 12),
                TextButton(
                  onPressed: details.onStepCancel,
                  child: Text(
                    _currentStep == 0 ? 'CANCEL' : 'BACK',
                    style: const TextStyle(color: Colors.grey),
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}
