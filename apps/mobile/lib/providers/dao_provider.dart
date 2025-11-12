import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class DAOProvider with ChangeNotifier {
<<<<<<< HEAD
=======
  DAOProvider() {
    _loadUserData();
    _fetchData();
  }

>>>>>>> 9823c84 (chore: sync and clean repo)
  /// Mock method for project investment.
  /// In a real app, this would involve a Web3 transaction.
  Future<bool> investInProject({required String projectId, required BigInt amount}) async {
    // 1. Log the action (for mock data visibility)
    print(
      'DAOProvider: Received investment request for project $projectId '
      'with amount $amount tokens.',
    );

    // 2. Mock delay to simulate network latency
    await Future.delayed(const Duration(milliseconds: 500));

    // 3. Mock logic:
    //    - If the amount is positive, assume success.
    if (amount > BigInt.zero) {
      // In a real implementation, you would update the SolarProject model
      // to reflect the new funding level here, and then call notifyListeners().
      // notifyListeners(); // Only call this if you actually update state
      return true; // Investment successful
    } else {
      return false; // Investment failed
    }
  }

  bool _isLoading = false;
  bool _isConnected = false;
  String _userAddress = '';
  double _tokenBalance = 0.0;
  List<Map<String, dynamic>> _projects = [];
  List<Map<String, dynamic>> _proposals = [];
  List<Map<String, dynamic>> _communityMembers = [];

  // Getters
  bool get isLoading => _isLoading;
  bool get isConnected => _isConnected;
  String get userAddress => _userAddress;
  double get tokenBalance => _tokenBalance;
  List<Map<String, dynamic>> get projects => _projects;
  List<Map<String, dynamic>> get proposals => _proposals;
  List<Map<String, dynamic>> get communityMembers => _communityMembers;

  DAOProvider() {
    _loadUserData();
    _fetchData();
  }

  Future<void> _loadUserData() async {
    final SharedPreferences prefs = await SharedPreferences.getInstance();
    _isConnected = prefs.getBool('isConnected') ?? false;
    _userAddress = prefs.getString('userAddress') ?? '';
    _tokenBalance = prefs.getDouble('tokenBalance') ?? 0.0;
    notifyListeners();
  }

  Future<void> _saveUserData() async {
    final SharedPreferences prefs = await SharedPreferences.getInstance();
    await prefs.setBool('isConnected', _isConnected);
    await prefs.setString('userAddress', _userAddress);
    await prefs.setDouble('tokenBalance', _tokenBalance);
  }

  Future<void> connectWallet(String walletType) async {
    _isLoading = true;
    notifyListeners();
    await Future.delayed(const Duration(seconds: 2));
    _isConnected = true;
    _userAddress = '0x${List.generate(40, (index) => '0123456789abcdef'[index % 16]).join()}';
    _tokenBalance = 1250.75;
    await _saveUserData();
    _isLoading = false;
    notifyListeners();
  }

  Future<void> disconnectWallet() async {
    _isLoading = true;
    notifyListeners();
    await Future.delayed(const Duration(seconds: 1));
    _isConnected = false;
    _userAddress = '';
    _tokenBalance = 0.0;
    await _saveUserData();
    _isLoading = false;
    notifyListeners();
  }

  Future<void> _fetchData() async {
    _isLoading = true;
    notifyListeners();
    await Future.delayed(const Duration(seconds: 1));
    _projects = [
      {
        'id': 'PRJ-001',
        'title': 'Urgam Valley Solar Farm',
        'description': 'Community-owned 100KW solar project in Urgam Valley, Uttarakhand',
        'progress': 75,
        'funded': 750000,
        'target': 1000000,
        'location': 'Urgam Valley, Uttarakhand',
        'status': 'Active',
        'image': 'assets/images/solar_farm.jpg',
        'beneficiaries': 150,
        'co2Reduced': 45.2,
<<<<<<< HEAD
        'updates': [
          {'title': 'Land Acquisition Complete', 'date': '2 days ago', 'description': 'Successfully acquired 2 acres of land'},
          {'title': 'Environmental Approval Received', 'date': '1 week ago', 'description': 'All necessary clearances obtained'},
        ]
=======
        'updates': <Map<String, String>>[
          <String, String>{
            'title': 'Land Acquisition Complete',
            'date': '2 days ago',
            'description': 'Successfully acquired 2 acres of land',
          },
          <String, String>{
            'title': 'Environmental Approval Received',
            'date': '1 week ago',
            'description': 'All necessary clearances obtained',
          },
        ],
>>>>>>> 9823c84 (chore: sync and clean repo)
      },
      {
        'id': 'PRJ-002',
        'title': 'Dharampur Microgrid',
        'description': 'Decentralized solar microgrid for 200 households',
        'progress': 45,
        'funded': 450000,
        'target': 1000000,
        'location': 'Dharampur, Gujarat',
        'status': 'Funding',
        'image': 'assets/images/microgrid.jpg',
        'beneficiaries': 200,
        'co2Reduced': 62.8,
<<<<<<< HEAD
        'updates': [
          {'title': 'Community Survey Completed', 'date': '3 days ago', 'description': 'Surveyed 200 households'},
          {'title': 'Technical Feasibility Study', 'date': '1 week ago', 'description': 'Study confirms viability'},
        ]
=======
        'updates': <Map<String, String>>[
          <String, String>{
            'title': 'Community Survey Completed',
            'date': '3 days ago',
            'description': 'Surveyed 200 households',
          },
          <String, String>{
            'title': 'Technical Feasibility Study',
            'date': '1 week ago',
            'description': 'Study confirms viability',
          },
        ],
>>>>>>> 9823c84 (chore: sync and clean repo)
      },
      {
        'id': 'PRJ-003',
        'title': 'Rural School Electrification',
        'description': 'Solar power systems for 50 rural schools',
        'progress': 90,
        'funded': 900000,
        'target': 1000000,
        'location': 'Multiple Locations',
        'status': 'Active',
        'image': 'assets/images/school.jpg',
        'beneficiaries': 5000,
        'co2Reduced': 120.5,
<<<<<<< HEAD
        'updates': [
          {'title': 'First 10 Schools Completed', 'date': '1 day ago', 'description': 'All systems operational'},
          {'title': 'Teacher Training Program', 'date': '1 week ago', 'description': 'Teachers trained on system maintenance'},
        ]
      }
=======
        'updates': <Map<String, String>>[
          <String, String>{
            'title': 'First 10 Schools Completed',
            'date': '1 day ago',
            'description': 'All systems operational',
          },
          <String, String>{
            'title': 'Teacher Training Program',
            'date': '1 week ago',
            'description': 'Teachers trained on system maintenance',
          },
        ],
      },
>>>>>>> 9823c84 (chore: sync and clean repo)
    ];
    _proposals = [
      {
        'id': 'PROP-001',
        'title': 'Expand Urgam Valley Solar Farm',
        'description': 'Proposal to increase capacity from 100KW to 200KW',
        'author': 'Community Council',
        'status': 'Active',
        'votes': 45,
        'totalVotes': 100,
        'endDate': '2024-02-15',
        'category': 'Infrastructure',
<<<<<<< HEAD
        'comments': [
          {'author': 'Rajesh Kumar', 'content': 'This expansion will benefit our community greatly', 'date': '2 hours ago'},
          {'author': 'Priya Sharma', 'content': 'We need more details about the cost breakdown', 'date': '5 hours ago'},
        ]
=======
        'comments': <Map<String, String>>[
          <String, String>{
            'author': 'Rajesh Kumar',
            'content': 'This expansion will benefit our community greatly',
            'date': '2 hours ago',
          },
          <String, String>{
            'author': 'Priya Sharma',
            'content': 'We need more details about the cost breakdown',
            'date': '5 hours ago',
          },
        ],
>>>>>>> 9823c84 (chore: sync and clean repo)
      },
      {
        'id': 'PROP-002',
        'title': 'Treasury Management Guidelines',
        'description': 'New guidelines for managing community treasury funds',
        'author': 'Finance Committee',
        'status': 'Active',
        'votes': 78,
        'totalVotes': 100,
        'endDate': '2024-02-20',
        'category': 'Governance',
<<<<<<< HEAD
        'comments': [
          {'author': 'Amit Patel', 'content': 'The guidelines look comprehensive', 'date': '1 day ago'},
          {'author': 'Sunita Devi', 'content': 'We need more transparency in fund allocation', 'date': '2 days ago'},
        ]
=======
        'comments': <Map<String, String>>[
          <String, String>{
            'author': 'Amit Patel',
            'content': 'The guidelines look comprehensive',
            'date': '1 day ago',
          },
          <String, String>{
            'author': 'Sunita Devi',
            'content': 'We need more transparency in fund allocation',
            'date': '2 days ago',
          },
        ],
>>>>>>> 9823c84 (chore: sync and clean repo)
      },
      {
        'id': 'PROP-003',
        'title': 'Community Membership Tiers',
        'description': 'Define new membership tiers and benefits',
        'author': 'Membership Committee',
        'status': 'Passed',
        'votes': 92,
        'totalVotes': 100,
        'endDate': '2024-02-10',
        'category': 'Membership',
<<<<<<< HEAD
        'comments': [
          {'author': 'Vikram Singh', 'content': 'Great initiative for community engagement', 'date': '3 days ago'},
          {'author': 'Meera Patel', 'content': 'The benefits are well structured', 'date': '4 days ago'},
        ]
      }
=======
        'comments': <Map<String, String>>[
          <String, String>{
            'author': 'Vikram Singh',
            'content': 'Great initiative for community engagement',
            'date': '3 days ago',
          },
          <String, String>{
            'author': 'Meera Patel',
            'content': 'The benefits are well structured',
            'date': '4 days ago',
          },
        ],
      },
>>>>>>> 9823c84 (chore: sync and clean repo)
    ];
    _communityMembers = [
      {
        'name': 'Rajesh Kumar',
        'role': 'Solar Engineer',
        'joined': '2023-10-15',
        'contributions': 15,
        'tokens': 250.0,
        'avatar': 'assets/images/rajesh.jpg',
<<<<<<< HEAD
        'projects': ['Urgam Valley Solar Farm', 'Dharampur Microgrid'],
        'skills': ['Solar Engineering', 'Project Management', 'Community Training']
=======
        'projects': <String>['Urgam Valley Solar Farm', 'Dharampur Microgrid'],
        'skills': <String>['Solar Engineering', 'Project Management', 'Community Training'],
>>>>>>> 9823c84 (chore: sync and clean repo)
      },
      {
        'name': 'Priya Sharma',
        'role': 'Community Leader',
        'joined': '2023-09-20',
        'contributions': 23,
        'tokens': 375.0,
        'avatar': 'assets/images/priya.jpg',
<<<<<<< HEAD
        'projects': ['Community Outreach', 'Education Programs'],
        'skills': ['Community Organization', 'Public Speaking', 'Event Planning']
=======
        'projects': <String>['Community Outreach', 'Education Programs'],
        'skills': <String>['Community Organization', 'Public Speaking', 'Event Planning'],
>>>>>>> 9823c84 (chore: sync and clean repo)
      },
      {
        'name': 'Amit Patel',
        'role': 'Farmer Representative',
        'joined': '2023-11-05',
        'contributions': 18,
        'tokens': 180.0,
        'avatar': 'assets/images/amit.jpg',
<<<<<<< HEAD
        'projects': ['Land Acquisition', 'Community Engagement'],
        'skills': ['Agriculture', 'Community Relations', 'Local Knowledge']
=======
        'projects': <String>['Land Acquisition', 'Community Engagement'],
        'skills': <String>['Agriculture', 'Community Relations', 'Local Knowledge'],
>>>>>>> 9823c84 (chore: sync and clean repo)
      },
      {
        'name': 'Sunita Devi',
        'role': 'Education Coordinator',
        'joined': '2023-08-30',
        'contributions': 31,
        'tokens': 425.0,
        'avatar': 'assets/images/sunita.jpg',
<<<<<<< HEAD
        'projects': ['School Electrification', 'Teacher Training'],
        'skills': ['Education', 'Training', 'Curriculum Development']
      }
=======
        'projects': <String>['School Electrification', 'Teacher Training'],
        'skills': <String>['Education', 'Training', 'Curriculum Development'],
      },
>>>>>>> 9823c84 (chore: sync and clean repo)
    ];
    _isLoading = false;
    notifyListeners();
  }

  Future<void> fundProject(String projectId, double amount) async {
    _isLoading = true;
    notifyListeners();
    await Future.delayed(const Duration(seconds: 2));
    final projectIndex = _projects.indexWhere((p) => p['id'] == projectId);
    if (projectIndex != -1) {
      _projects[projectIndex]['funded'] += amount;
      _projects[projectIndex]['progress'] = 
          (_projects[projectIndex]['funded'] / _projects[projectIndex]['target']) * 100;
      _tokenBalance -= amount;
      await _saveUserData();
    }
    _isLoading = false;
    notifyListeners();
  }

  Future<void> voteOnProposal(String proposalId, bool voteFor) async {
    _isLoading = true;
    notifyListeners();
    await Future.delayed(const Duration(seconds: 1));
<<<<<<< HEAD
    final proposalIndex = _proposals.indexWhere((p) => p['id'] == proposalId);
=======
    final int proposalIndex = _proposals.indexWhere(
      (Map<String, dynamic> p) => p['id'] == proposalId,
    );
>>>>>>> 9823c84 (chore: sync and clean repo)
    if (proposalIndex != -1) {
      _proposals[proposalIndex]['votes'] += voteFor ? 1 : 0;
      _tokenBalance += 10.0;
      await _saveUserData();
    }
    _isLoading = false;
    notifyListeners();
  }

  Future<void> joinCommunity(String name, String role, String expertise) async {
    _isLoading = true;
    notifyListeners();
    await Future.delayed(const Duration(seconds: 2));
    _communityMembers.add({
      'name': name,
      'role': role,
      'joined': DateTime.now().toIso8601String().split('T')[0],
      'contributions': 0,
      'tokens': 50.0,
      'avatar': 'assets/images/default_avatar.jpg',
<<<<<<< HEAD
      'projects': [],
      'skills': expertise.split(',').map((e) => e.trim()).toList()
=======
      'projects': <dynamic>[],
      'skills': expertise.split(',').map((String e) => e.trim()).toList(),
>>>>>>> 9823c84 (chore: sync and clean repo)
    });
    _tokenBalance += 50.0;
    await _saveUserData();
    _isLoading = false;
    notifyListeners();
  }

  Future<void> reportAnimalIssue(String type, String location, String description) async {
    _isLoading = true;
    notifyListeners();
    await Future.delayed(const Duration(seconds: 1));
    _tokenBalance += 5.0;
    await _saveUserData();
    _isLoading = false;
    notifyListeners();
  }

  Future<void> claimRewards() async {
    _isLoading = true;
    notifyListeners();
    await Future.delayed(const Duration(seconds: 1));
    _tokenBalance += 25.0;
    await _saveUserData();
    _isLoading = false;
    notifyListeners();
  }

  Future<void> proposeSolarProject(Map<String, dynamic> projectData) async {
    _isLoading = true;
    notifyListeners();

    await Future.delayed(const Duration(seconds: 2));

    // Create a new proposal for the solar project
    final newProposal = {
      'id': 'PROP-${DateTime.now().millisecondsSinceEpoch}',
      'title': 'New Solar Project: ${projectData['name']}',
      'description':
          'Proposal to fund and implement ${projectData['name']} - ${projectData['description']}\n\n'
          'Location: ${projectData['location']}\n'
          'Capacity: ${projectData['capacity']} MW\n'
          'Funding Goal: ${projectData['fundingGoal']} ETH\n'
          'Token Allocation: ${projectData['tokenAllocation']} HHDAO',
      'author': 'Community Member',
      'status': 'Active',
      'votes': 0,
      'totalVotes': 100,
      'endDate': DateTime.now().add(const Duration(days: 7)).toIso8601String().split('T')[0],
      'category': 'Infrastructure',
      'comments': [],
      'projectData': projectData, // Store the full project data for later use
    };

    _proposals.insert(0, newProposal); // Add to beginning of list
    _isLoading = false;
    notifyListeners();
  }
}
