import 'package:flutter/material.dart';

class RewardTile extends StatelessWidget {

  const RewardTile({
    super.key,
    required this.title,
    required this.description,
    required this.points,
    required this.icon,
    this.isUnlocked = false,
    this.unlockedAt,
    this.onTap,
  });
  final String title;
  final String description;
  final int points;
  final String icon;
  final bool isUnlocked;
  final DateTime? unlockedAt;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: isUnlocked ? 4 : 2,
      margin: const EdgeInsets.symmetric(vertical: 4, horizontal: 16),
      color: isUnlocked ? Colors.white : Colors.grey[100],
      child: ListTile(
        onTap: onTap,
        leading: Container(
          width: 40,
          height: 40,
          decoration: BoxDecoration(
            color: isUnlocked ? Colors.amber[100] : Colors.grey[300],
            borderRadius: BorderRadius.circular(8),
          ),
          child: Icon(
            _getIconData(icon),
            color: isUnlocked ? Colors.amber[700] : Colors.grey[600],
            size: 24,
          ),
        ),
        title: Text(
          title,
          style: TextStyle(
            fontWeight: FontWeight.bold,
            color: isUnlocked ? Colors.black : Colors.grey[600],
          ),
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <dynamic>[
            Text(
              description,
              style: TextStyle(
                color: isUnlocked ? Colors.grey[600] : Colors.grey[500],
              ),
            ),
            if (unlockedAt != null)
              Text(
                'Unlocked ${_formatDate(unlockedAt!)}',
                style: const TextStyle(
                  fontSize: 12,
                  color: Colors.green,
                  fontWeight: FontWeight.w500,
                ),
              ),
          ],
        ),
        trailing: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.end,
          children: <dynamic>[
            Text(
              '+$points',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: isUnlocked ? Colors.green[700] : Colors.grey[600],
              ),
            ),
            Text(
              'points',
              style: TextStyle(
                fontSize: 10,
                color: isUnlocked ? Colors.green[600] : Colors.grey[500],
              ),
            ),
          ],
        ),
      ),
    );
  }

  IconData _getIconData(String iconName) {
    switch (iconName) {
      case 'vote':
        return Icons.how_to_vote;
      case 'code':
        return Icons.code;
      case 'lightbulb':
        return Icons.lightbulb;
      case 'trophy':
        return Icons.emoji_events;
      case 'star':
        return Icons.star;
      case 'medal':
        return Icons.military_tech;
      case 'badge':
        return Icons.verified;
      case 'heart':
        return Icons.favorite;
      case 'thumbs_up':
        return Icons.thumb_up;
      case 'comment':
        return Icons.comment;
      case 'share':
        return Icons.share;
      default:
        return Icons.star;
    }
  }

  String _formatDate(DateTime date) {
    final DateTime now = DateTime.now();
    final Duration difference = now.difference(date);

    if (difference.inDays == 0) {
      return 'today';
    } else if (difference.inDays == 1) {
      return 'yesterday';
    } else if (difference.inDays < 7) {
      return '${difference.inDays} days ago';
    } else if (difference.inDays < 30) {
      final int weeks = (difference.inDays / 7).floor();
      return '$weeks week${weeks > 1 ? 's' : ''} ago';
    } else if (difference.inDays < 365) {
      final int months = (difference.inDays / 30).floor();
      return '$months month${months > 1 ? 's' : ''} ago';
    } else {
      final int years = (difference.inDays / 365).floor();
      return '$years year${years > 1 ? 's' : ''} ago';
    }
  }
}
