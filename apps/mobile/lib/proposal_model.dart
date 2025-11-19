enum ProposalStatus {
  draft,
  active,
  passed,
  rejected,
  executed,
  cancelled,
}

enum ProposalType {
  funding,
  governance,
  projectApproval,
  parameterChange,
  membership,
  other,
}

class Proposal {
  final String id;
  final String title;
  final String description;
  final String proposerId;
  final DateTime createdAt;
  final DateTime? updatedAt;
  final ProposalStatus status;
  final ProposalType type;
  final DateTime votingStartDate;
  final DateTime votingEndDate;
  final int yesVotes;
  final int noVotes;
  final int abstainVotes;
  final double quorumRequired;
  final double approvalThreshold;
  final Map<String, dynamic>? parameters;
  final String? discussionUrl;
  final List<String> tags;
  final String? category;
  final Map<String, dynamic>? metadata;

  Proposal({
    required this.id,
    required this.title,
    required this.description,
    required this.proposerId,
    required this.createdAt,
    this.updatedAt,
    required this.status,
    required this.type,
    required this.votingStartDate,
    required this.votingEndDate,
    required this.yesVotes,
    required this.noVotes,
    required this.abstainVotes,
    required this.quorumRequired,
    required this.approvalThreshold,
    this.parameters,
    this.discussionUrl,
    required this.tags,
    this.category,
    this.metadata,
  });

  factory Proposal.fromJson(Map<String, dynamic> json) {
    return Proposal(
      id: json['id'] as String,
      title: json['title'] as String,
      description: json['description'] as String,
      proposerId: json['proposer_id'] as String,
      createdAt: DateTime.parse(json['created_at'] as String),
      updatedAt: json['updated_at'] != null ? DateTime.parse(json['updated_at'] as String) : null,
      status: ProposalStatus.values.firstWhere(
        (e) => e.name == json['status'],
        orElse: () => ProposalStatus.draft,
      ),
      type: ProposalType.values.firstWhere(
        (e) => e.name == json['type'],
        orElse: () => ProposalType.other,
      ),
      votingStartDate: DateTime.parse(json['voting_start_date'] as String),
      votingEndDate: DateTime.parse(json['voting_end_date'] as String),
      yesVotes: json['yes_votes'] as int? ?? 0,
      noVotes: json['no_votes'] as int? ?? 0,
      abstainVotes: json['abstain_votes'] as int? ?? 0,
      quorumRequired: (json['quorum_required'] as num).toDouble(),
      approvalThreshold: (json['approval_threshold'] as num).toDouble(),
      parameters: json['parameters'] as Map<String, dynamic>?,
      discussionUrl: json['discussion_url'] as String?,
      tags: List<String>.from(json['tags'] ?? []),
      category: json['category'] as String?,
      metadata: json['metadata'] as Map<String, dynamic>?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'description': description,
      'proposer_id': proposerId,
      'created_at': createdAt.toIso8601String(),
      'updated_at': updatedAt?.toIso8601String(),
      'status': status.name,
      'type': type.name,
      'voting_start_date': votingStartDate.toIso8601String(),
      'voting_end_date': votingEndDate.toIso8601String(),
      'yes_votes': yesVotes,
      'no_votes': noVotes,
      'abstain_votes': abstainVotes,
      'quorum_required': quorumRequired,
      'approval_threshold': approvalThreshold,
      'parameters': parameters,
      'discussion_url': discussionUrl,
      'tags': tags,
      'category': category,
      'metadata': metadata,
    };
  }

  int get totalVotes => yesVotes + noVotes + abstainVotes;

  double get yesVotePercentage => totalVotes > 0 ? (yesVotes / totalVotes) * 100 : 0;

  double get noVotePercentage => totalVotes > 0 ? (noVotes / totalVotes) * 100 : 0;

  double get abstainVotePercentage => totalVotes > 0 ? (abstainVotes / totalVotes) * 100 : 0;

  bool get isActive => status == ProposalStatus.active;

  bool get isPassed => status == ProposalStatus.passed;

  bool get isRejected => status == ProposalStatus.rejected;

  bool get canVote => isActive && DateTime.now().isBefore(votingEndDate) && DateTime.now().isAfter(votingStartDate);

  bool get hasQuorum => totalVotes >= quorumRequired;

  bool get meetsApprovalThreshold => yesVotePercentage >= approvalThreshold;

  Proposal copyWith({
    String? id,
    String? title,
    String? description,
    String? proposerId,
    DateTime? createdAt,
    DateTime? updatedAt,
    ProposalStatus? status,
    ProposalType? type,
    DateTime? votingStartDate,
    DateTime? votingEndDate,
    int? yesVotes,
    int? noVotes,
    int? abstainVotes,
    double? quorumRequired,
    double? approvalThreshold,
    Map<String, dynamic>? parameters,
    String? discussionUrl,
    List<String>? tags,
    String? category,
    Map<String, dynamic>? metadata,
  }) {
    return Proposal(
      id: id ?? this.id,
      title: title ?? this.title,
      description: description ?? this.description,
      proposerId: proposerId ?? this.proposerId,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      status: status ?? this.status,
      type: type ?? this.type,
      votingStartDate: votingStartDate ?? this.votingStartDate,
      votingEndDate: votingEndDate ?? this.votingEndDate,
      yesVotes: yesVotes ?? this.yesVotes,
      noVotes: noVotes ?? this.noVotes,
      abstainVotes: abstainVotes ?? this.abstainVotes,
      quorumRequired: quorumRequired ?? this.quorumRequired,
      approvalThreshold: approvalThreshold ?? this.approvalThreshold,
      parameters: parameters ?? this.parameters,
      discussionUrl: discussionUrl ?? this.discussionUrl,
      tags: tags ?? this.tags,
      category: category ?? this.category,
      metadata: metadata ?? this.metadata,
    );
  }

  @override
  String toString() {
    return 'Proposal(id: $id, title: $title, status: $status, type: $type, totalVotes: $totalVotes)';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is Proposal && other.id == id;
  }

  @override
  int get hashCode => id.hashCode;
}
