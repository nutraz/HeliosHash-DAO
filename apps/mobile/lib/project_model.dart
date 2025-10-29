class Project {
  final String id;
  final String title;
  final String description;
  final String creatorId;
  final DateTime createdAt;
  final DateTime? updatedAt;
  final String status; // 'draft', 'active', 'completed', 'cancelled'
  final double budget;
  final String category;
  final List<String> tags;
  final String? imageUrl;
  final int upvotes;
  final int downvotes;
  final List<String> teamMembers;
  final String? githubUrl;
  final String? websiteUrl;
  final Map<String, dynamic>? metadata;

  Project({
    required this.id,
    required this.title,
    required this.description,
    required this.creatorId,
    required this.createdAt,
    this.updatedAt,
    required this.status,
    required this.budget,
    required this.category,
    required this.tags,
    this.imageUrl,
    required this.upvotes,
    required this.downvotes,
    required this.teamMembers,
    this.githubUrl,
    this.websiteUrl,
    this.metadata,
  });

  factory Project.fromJson(Map<String, dynamic> json) {
    return Project(
      id: json['id'] as String,
      title: json['title'] as String,
      description: json['description'] as String,
      creatorId: json['creator_id'] as String,
      createdAt: DateTime.parse(json['created_at'] as String),
      updatedAt: json['updated_at'] != null ? DateTime.parse(json['updated_at'] as String) : null,
      status: json['status'] as String,
      budget: (json['budget'] as num).toDouble(),
      category: json['category'] as String,
      tags: List<String>.from(json['tags'] ?? []),
      imageUrl: json['image_url'] as String?,
      upvotes: json['upvotes'] as int? ?? 0,
      downvotes: json['downvotes'] as int? ?? 0,
      teamMembers: List<String>.from(json['team_members'] ?? []),
      githubUrl: json['github_url'] as String?,
      websiteUrl: json['website_url'] as String?,
      metadata: json['metadata'] as Map<String, dynamic>?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'description': description,
      'creator_id': creatorId,
      'created_at': createdAt.toIso8601String(),
      'updated_at': updatedAt?.toIso8601String(),
      'status': status,
      'budget': budget,
      'category': category,
      'tags': tags,
      'image_url': imageUrl,
      'upvotes': upvotes,
      'downvotes': downvotes,
      'team_members': teamMembers,
      'github_url': githubUrl,
      'website_url': websiteUrl,
      'metadata': metadata,
    };
  }

  Project copyWith({
    String? id,
    String? title,
    String? description,
    String? creatorId,
    DateTime? createdAt,
    DateTime? updatedAt,
    String? status,
    double? budget,
    String? category,
    List<String>? tags,
    String? imageUrl,
    int? upvotes,
    int? downvotes,
    List<String>? teamMembers,
    String? githubUrl,
    String? websiteUrl,
    Map<String, dynamic>? metadata,
  }) {
    return Project(
      id: id ?? this.id,
      title: title ?? this.title,
      description: description ?? this.description,
      creatorId: creatorId ?? this.creatorId,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      status: status ?? this.status,
      budget: budget ?? this.budget,
      category: category ?? this.category,
      tags: tags ?? this.tags,
      imageUrl: imageUrl ?? this.imageUrl,
      upvotes: upvotes ?? this.upvotes,
      downvotes: downvotes ?? this.downvotes,
      teamMembers: teamMembers ?? this.teamMembers,
      githubUrl: githubUrl ?? this.githubUrl,
      websiteUrl: websiteUrl ?? this.websiteUrl,
      metadata: metadata ?? this.metadata,
    );
  }

  @override
  String toString() {
    return 'Project(id: $id, title: $title, status: $status, budget: $budget)';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is Project && other.id == id;
  }

  @override
  int get hashCode => id.hashCode;
}
