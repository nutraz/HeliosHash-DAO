enum ProjectStatus { active, pending, completed, maintenance }

class SolarProject {
  final String id;
  final String name;
  final String location;
  final double capacity; // MW
  final double currentGeneration; // MW
  final double totalGeneration; // MWh
  final int efficiency; // percentage
  final ProjectStatus status;
  final DateTime installDate;
  BigInt investment; // ETH in wei
  BigInt returns; // ETH in wei
  int investors;
  final String imageUrl;

  SolarProject({
    required this.id,
    required this.name,
    required this.location,
    required this.capacity,
    required this.currentGeneration,
    required this.totalGeneration,
    required this.efficiency,
    required this.status,
    required this.installDate,
    required this.investment,
    required this.returns,
    required this.investors,
    required this.imageUrl,
  });

  double get utilizationRate {
    if (capacity == 0) return 0;
    return (currentGeneration / capacity) * 100;
  }

  double get roi {
    if (investment == BigInt.zero) return 0;
    return (returns.toDouble() / investment.toDouble()) * 100;
  }
}
