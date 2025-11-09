class Post {

  const Post({
    required this.id,
    required this.author,
    required this.title,
    required this.content,
    required this.createdAt,
    required this.likes,
    required this.comments,
    required this.isLiked,
    required this.tags,
  });

  factory Post.fromJson(Map<String, dynamic> json) {
    return Post(
      id: json['id'] as String,
      author: json['author'] as String,
      title: json['title'] as String,
      content: json['content'] as String,
      createdAt: DateTime.parse(json['created_at'] as String),
      likes: json['likes'] as int,
      comments: json['comments'] as int,
      isLiked: json['is_liked'] as bool,
      tags: List<String>.from(json['tags'] as List),
    );
  }
  final String id;
  final String author;
  final String title;
  final String content;
  final DateTime createdAt;
  final int likes;
  final int comments;
  final bool isLiked;
  final List<String> tags;

  Post copyWith({
    String? id,
    String? author,
    String? title,
    String? content,
    DateTime? createdAt,
    int? likes,
    int? comments,
    bool? isLiked,
    List<String>? tags,
  }) {
    return Post(
      id: id ?? this.id,
      author: author ?? this.author,
      title: title ?? this.title,
      content: content ?? this.content,
      createdAt: createdAt ?? this.createdAt,
      likes: likes ?? this.likes,
      comments: comments ?? this.comments,
      isLiked: isLiked ?? this.isLiked,
      tags: tags ?? this.tags,
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'id': id,
      'author': author,
      'title': title,
      'content': content,
      'created_at': createdAt.toIso8601String(),
      'likes': likes,
      'comments': comments,
      'is_liked': isLiked,
      'tags': tags,
    };
  }
}
