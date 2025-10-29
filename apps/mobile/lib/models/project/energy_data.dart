class EnergyData {
  final DateTime date;
  final double generation; // kWh
  final double consumption; // kWh
  final int efficiency; // percentage

  EnergyData({
    required this.date,
    required this.generation,
    required this.consumption,
    required this.efficiency,
  });

  double get surplus => generation - consumption;
}
