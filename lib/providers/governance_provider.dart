import 'package:flutter/material.dart';
import '../services/canister_service.dart';

class GovernanceProvider with ChangeNotifier {
  final CanisterService _service = CanisterService();
  List<Map<String, dynamic>> _proposals = [];
  bool _isLoading = false;
  String? _error;
  String? _authToken;
  
  List<Map<String, dynamic>> get proposals => _proposals;
  bool get isLoading => _isLoading;
  String? get error => _error;
  
  void setAuthToken(String? token) {
    _authToken = token;
    notifyListeners();
  }
  
  Future<void> fetchProposals() async {
    _isLoading = true;
    _error = null;
    notifyListeners();
    
    try {
      _proposals = await _service.getProposals();
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
  
  Future<bool> createProposal({
    required String title,
    required String description,
    required int deadline,
  }) async {
    if (_authToken == null) {
      _error = "Not authenticated";
      notifyListeners();
      return false;
    }
    
    _isLoading = true;
    notifyListeners();
    
    try {
      await _service.createProposal(
        title: title,
        description: description,
        deadline: deadline,
        authToken: _authToken!,
      );
      
      await fetchProposals(); // Refresh the list
      return true;
    } catch (e) {
      _error = e.toString();
      return false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
  
  Future<bool> voteProposal({
    required String proposalId,
    required bool voteYes,
  }) async {
    if (_authToken == null) {
      _error = "Not authenticated";
      notifyListeners();
      return false;
    }
    
    _isLoading = true;
    notifyListeners();
    
    try {
      await _service.voteProposal(
        proposalId: proposalId,
        voteYes: voteYes,
        authToken: _authToken!,
      );
      
      await fetchProposals(); // Refresh the list
      return true;
    } catch (e) {
      _error = e.toString();
      return false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
}
