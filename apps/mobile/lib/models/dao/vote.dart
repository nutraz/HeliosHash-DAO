class Vote {
  final String proposalId;
  final String voter;
  final bool support;
  final BigInt votingPower;
  final DateTime timestamp;

  Vote({
    required this.proposalId,
    required this.voter,
    required this.support,
    required this.votingPower,
    required this.timestamp,
  });
}
