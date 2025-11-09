import 'package:ic_dart/ic_dart.dart';

// Governance Canister
class GovernanceCanister {
  GovernanceCanister(this.actor);
  final CanisterActor actor;

  Future<List<dynamic>> getProposals() async {
    return await actor.query('getProposals', <dynamic>[]);
  }

  Future<int> createProposal(String title, String description) async {
    return await actor.call('createProposal', <String>[title, description]);
  }
}

// Project Funding Canister
class ProjectFundingCanister {
  ProjectFundingCanister(this.actor);
  final CanisterActor actor;

  Future<List<dynamic>> getProjects() async {
    return await actor.query('getProjects', <dynamic>[]);
  }

  Future<int> createProject(String name, int fundingGoal) async {
    return await actor.call('createProject', <Object>[name, fundingGoal]);
  }
}

// NFT Membership Canister
class NFTMembershipCanister {
  NFTMembershipCanister(this.actor);
  final CanisterActor actor;

  Future<List<dynamic>> getNFTs() async {
    return await actor.query('getNFTs', <dynamic>[]);
  }

  Future<int> mintNFT(Principal owner, String metadata) async {
    return await actor.call('mintNFT', <dynamic>[owner, metadata]);
  }
}

// Token Rewards Canister
class TokenRewardsCanister {
  TokenRewardsCanister(this.actor);
  final CanisterActor actor;

  Future<List<dynamic>> getRewards() async {
    return await actor.query('getRewards', <dynamic>[]);
  }

  Future<int> grantReward(Principal recipient, int amount, String reason) async {
    return await actor.call('grantReward', <dynamic>[recipient, amount, reason]);
  }
}

// Example: How to instantiate actors (replace canisterId with actual IDs)
// final agent = AgentOptions(host: 'http://localhost:4943');
// final governance = GovernanceCanister(CanisterActor(canisterId: 'governance-canister-id', agent: agent));
