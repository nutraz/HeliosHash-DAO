import 'package:flutter/material.dart';
import '../models/dao/proposal.dart';

class GovernanceProvider with ChangeNotifier {
  List<Proposal> _proposals = [];
  bool _isLoading = false;
  String? _error;

  List<Proposal> get proposals => _proposals;
  bool get isLoading => _isLoading;
  String? get error => _error;

  GovernanceProvider() {
    _loadMockProposals();
  }

  void _loadMockProposals() {
    _proposals = [
      Proposal(
        id: '1',
        title: 'Increase Solar Panel Efficiency Standards',
        description: 'Proposal to raise the minimum efficiency requirements for new solar installations to 25% to ensure higher quality and better returns.',
        creator: 'Alice Johnson',
        createdAt: DateTime.now().subtract(const Duration(days: 2)),
        endDate: DateTime.now().add(const Duration(days: 5)),
        votesFor: 45,
        votesAgainst: 12,
        totalVotes: 57,
        status: 'active',
      ),
      Proposal(
        id: '2',
        title: 'Community Fund Allocation for Education',
        description: 'Allocate 10% of quarterly profits to fund solar education programs in underserved communities.',
        creator: 'Bob Smith',
        createdAt: DateTime.now().subtract(const Duration(days: 1)),
        endDate: DateTime.now().add(const Duration(days: 7)),
        votesFor: 32,
        votesAgainst: 8,
        totalVotes: 40,
        status: 'active',
      ),
      Proposal(
        id: '3',
        title: 'New Project Approval: Desert Valley Solar Farm',
        description: 'Approve funding and development of a 500MW solar farm in the Desert Valley region.',
        creator: 'Carol Williams',
        createdAt: DateTime.now().subtract(const Duration(days: 3)),
        endDate: DateTime.now().add(const Duration(days: 3)),
        votesFor: 67,
        votesAgainst: 15,
        totalVotes: 82,
        status: 'active',
      ),
    ];
    notifyListeners();
  }

  Future<void> fetchProposals() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      // Simulate API call
      await Future.delayed(const Duration(seconds: 1));
      // In a real app, this would fetch from the canister
      _loadMockProposals();
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
    required DateTime endDate,
  }) async {
    _isLoading = true;
    notifyListeners();

    try {
      // Simulate API call
      await Future.delayed(const Duration(seconds: 2));

      final newProposal = Proposal(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        title: title,
        description: description,
        creator: 'Current User', // In real app, get from auth
        createdAt: DateTime.now(),
        endDate: endDate,
        votesFor: 0,
        votesAgainst: 0,
        totalVotes: 0,
        status: 'active',
      );

      _proposals.add(newProposal);
      notifyListeners();
      return true;
    } catch (e) {
      _error = e.toString();
      return false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> vote(String proposalId, bool voteYes) async {
    _isLoading = true;
    notifyListeners();

    try {
      // Simulate API call
      await Future.delayed(const Duration(seconds: 1));

      final proposalIndex = _proposals.indexWhere((p) => p.id == proposalId);
      if (proposalIndex != -1) {
        final proposal = _proposals[proposalIndex];
        if (voteYes) {
          proposal.votesFor += 1;
        } else {
          proposal.votesAgainst += 1;
        }
        proposal.totalVotes += 1;
        _proposals[proposalIndex] = proposal;
        notifyListeners();
      }
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
