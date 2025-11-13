import 'package:flutter/material.dart';

class EnergyChart extends StatelessWidget {
  const EnergyChart({super.key});

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);

    // Mock data for demonstration
    final data = [
      {'day': 'Mon', 'value': 120.5},
      {'day': 'Tue', 'value': 135.2},
      {'day': 'Wed', 'value': 98.7},
      {'day': 'Thu', 'value': 145.3},
      {'day': 'Fri', 'value': 132.8},
      {'day': 'Sat', 'value': 110.9},
      {'day': 'Sun', 'value': 125.4},
    ];

    final double maxValue = data
        .map((Map<String, Object> e) => e['value']! as double)
        .reduce((double a, double b) => a > b ? a : b);

    return Container(
      height: 200,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.grey.shade100,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        children: [
          // Chart area
          Expanded(
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.end,
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: data.map((entry) {
                final height = ((entry['value'] as double) / maxValue) * 120;
                return Expanded(
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 2),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.end,
                      children: [
                        Text(
                          '${(entry['value'] as double).toInt()}',
                          style: theme.textTheme.bodySmall?.copyWith(fontSize: 10),
                        ),
                        const SizedBox(height: 4),
                        Container(
                          height: height,
                          decoration: const BoxDecoration(
                            gradient: LinearGradient(
                              begin: Alignment.topCenter,
                              end: Alignment.bottomCenter,
                              colors: [Color(0xFFFFA726), Color(0xFFFF7043)],
                            ),
                            borderRadius: BorderRadius.circular(4),
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              }).toList(),
            ),
          ),
          const SizedBox(height: 8),
          // Labels
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: data.map((d) {
              return Expanded(
                child: Text(
                  d['day'] as String,
                  style: theme.textTheme.bodySmall?.copyWith(fontSize: 10),
                  textAlign: TextAlign.center,
                ),
              );
            }).toList(),
          ),
        ],
      ),
    );
  }
}
