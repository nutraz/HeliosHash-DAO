class EnergyData { // percentage

  EnergyData({
    required this.date,
    required this.generation,
    required this.consumption,
    required this.efficiency,
  });
  final DateTime date;
  final double generation; // kWh
  final double consumption; // kWh
  final int efficiency;

  double get surplus => generation - consumption;
}
