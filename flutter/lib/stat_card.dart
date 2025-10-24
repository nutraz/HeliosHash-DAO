import 'package:flutter/material.dart';

class StatCard extends StatelessWidget {
  final String title;
  final String value;
  final IconData icon;
  final Color color;
  final String? subtitle;
  final double? change;
  final String? changeLabel;

  const StatCard({
    super.key,
    required this.title,
    required this.value,
    required this.icon,
    required this.color,
    this.subtitle,
    this.change,
    this.changeLabel,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 4,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(12),
          gradient: LinearGradient(
            colors: [color.withOpacity(0.1), color.withOpacity(0.05)],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(6),
                  decoration: BoxDecoration(
                    color: color.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: Icon(
                    icon,
                    color: color,
                    size: 20,
                  ),
                ),
                const Spacer(),
                if (change != null) _buildChangeIndicator(),
              ],
            ),
            const SizedBox(height: 8),
            Flexible(
              child: Text(
                value,
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: color,
                ),
                overflow: TextOverflow.ellipsis,
              ),
            ),
            const SizedBox(height: 2),
            Flexible(
              child: Text(
                title,
                style: TextStyle(
                  fontSize: 12,
                  color: Colors.grey[600],
                  fontWeight: FontWeight.w500,
                ),
                overflow: TextOverflow.ellipsis,
              ),
            ),
            if (subtitle != null) ...[
              const SizedBox(height: 2),
              Flexible(
                child: Text(
                  subtitle!,
                  style: TextStyle(
                    fontSize: 10,
                    color: Colors.grey[500],
                  ),
                  overflow: TextOverflow.ellipsis,
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildChangeIndicator() {
    final isPositive = change! >= 0;
    final changeColor = isPositive ? Colors.green : Colors.red;
    final changeIcon = isPositive ? Icons.trending_up : Icons.trending_down;

    return Row(
      children: [
        Icon(
          changeIcon,
          size: 16,
          color: changeColor,
        ),
        const SizedBox(width: 4),
        Text(
          '${change!.abs().toStringAsFixed(1)}${changeLabel ?? '%'}',
          style: TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.bold,
            color: changeColor,
          ),
        ),
      ],
    );
  }
}
