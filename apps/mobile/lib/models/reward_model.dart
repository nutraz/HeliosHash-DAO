// lib/models/reward_model.dart

class RewardModel { // e.g., 'Hilton', 'Uber Eats', 'Amazon'

  RewardModel({
    required this.id,
    required this.name,
    required this.description,
    required this.pointsCost,
    required this.category,
    required this.imageUrl,
    required this.partnerName,
  });

  // Factory method to create a RewardModel from a JSON map (e.g., from Firebase/API)
  factory RewardModel.fromJson(Map<String, dynamic> json) {
    return RewardModel(
      id: json['id'] as String,
      name: json['name'] as String,
      description: json['description'] as String,
      pointsCost: json['pointsCost'] as int,
      category: json['category'] as String,
      imageUrl: json['imageUrl'] as String,
      partnerName: json['partnerName'] as String,
    );
  }
  final String id;
  final String name;
  final String description;
  final int pointsCost; // Cost in your DAO token/points
  final String category; // e.g., 'hotel', 'food', 'travel', 'store'
  final String imageUrl; // Image for the reward
  final String partnerName;
}
