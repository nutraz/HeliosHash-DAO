enum ProposalCategory {
  funding,
  policy,
  event,
  other,
}

class Proposal {

  Proposal({
    required this.id,
    required this.title,
    required this.description,
    required this.creator,
    required this.createdAt,
    required this.endDate,
    required this.votesFor,
    required this.votesAgainst,
    required this.totalVotes,
    required this.status,
  });
  final String id;
  final String title;
  final String description;
  final String creator;
  final DateTime createdAt;
  final DateTime endDate;
  int votesFor;
  int votesAgainst;
  int totalVotes;
  String status;

  double get votePercentage {
    if (totalVotes == 0) return 0;
    return (votesFor / totalVotes) * 100;
  }

  int get daysRemaining {
    return endDate.difference(DateTime.now()).inDays;
  }

  bool get isActive => status == 'active' && DateTime.now().isBefore(endDate);
}
