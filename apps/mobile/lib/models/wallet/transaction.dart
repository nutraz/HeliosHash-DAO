enum TransactionType { investment, withdrawal, reward, governance }
enum TransactionStatus { pending, confirmed, failed }

class Transaction {
  final String id;
  final TransactionType type;
  final String from;
  final String to;
  final BigInt amount;
  final TransactionStatus status;
  final DateTime timestamp;
  final String? txHash;

  Transaction({
    required this.id,
    required this.type,
    required this.from,
    required this.to,
    required this.amount,
    required this.status,
    required this.timestamp,
    this.txHash,
  });

  String get shortTxHash {
    if (txHash == null) return '';
    return '${txHash!.substring(0, 6)}...${txHash!.substring(txHash!.length - 4)}';
  }
}
