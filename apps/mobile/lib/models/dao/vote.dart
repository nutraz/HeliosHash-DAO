class Vote {

  Vote({
    required this.proposalId,
    required this.voter,
    required this.support,
    required this.votingPower,
    required this.timestamp,
  });
  final String proposalId;
  final String voter;
  final bool support;
  final BigInt votingPower;
  final DateTime timestamp;
}
