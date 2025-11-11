import 'package:ic_dart/ic_dart.dart';

// Governance Canister
class GovernanceCanister {
  final CanisterActor actor;
  GovernanceCanister(this.actor);

  Future<List<dynamic>> getProposals() async {
    return await actor.query('getProposals', []);
  }

  Future<int> createProposal(String title, String description) async {
    return await actor.call('createProposal', [title, description]);
  }
}

// Project Funding Canister
class ProjectFundingCanister {
  final CanisterActor actor;
  ProjectFundingCanister(this.actor);

  Future<List<dynamic>> getProjects() async {
    return await actor.query('getProjects', []);
  }

  Future<int> createProject(String name, int fundingGoal) async {
    return await actor.call('createProject', [name, fundingGoal]);
  }
}

// NFT Membership Canister
class NFTMembershipCanister {
  final CanisterActor actor;
  NFTMembershipCanister(this.actor);

  Future<List<dynamic>> getNFTs() async {
    return await actor.query('getNFTs', []);
  }

  Future<int> mintNFT(Principal owner, String metadata) async {
    return await actor.call('mintNFT', [owner, metadata]);
  }
}

// Token Rewards Canister
class TokenRewardsCanister {
  final CanisterActor actor;
  TokenRewardsCanister(this.actor);

  Future<List<dynamic>> getRewards() async {
    return await actor.query('getRewards', []);
  }

  Future<int> grantReward(Principal recipient, int amount, String reason) async {
    return await actor.call('grantReward', [recipient, amount, reason]);
  }
}

// Example: How to instantiate actors (replace canisterId with actual IDs)
// final agent = AgentOptions(host: 'http://localhost:4943');
// final governance = GovernanceCanister(CanisterActor(canisterId: 'governance-canister-id', agent: agent));
