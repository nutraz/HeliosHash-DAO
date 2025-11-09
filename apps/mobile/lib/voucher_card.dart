import 'package:flutter/material.dart';

class VoucherCard extends StatelessWidget {

  const VoucherCard({
    super.key,
    required this.title,
    required this.description,
    required this.code,
    required this.discount,
    required this.expiryDate,
    this.isUsed = false,
    this.onTap,
  });
  final String title;
  final String description;
  final String code;
  final String discount;
  final DateTime expiryDate;
  final bool isUsed;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    final bool isExpired = DateTime.now().isAfter(expiryDate);

    return Card(
      elevation: 4,
      margin: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      color: isUsed
          ? Colors.grey[100]
          : isExpired
              ? Colors.red[50]
              : Colors.white,
      child: InkWell(
        onTap: isUsed || isExpired ? null : onTap,
        borderRadius: BorderRadius.circular(12),
        child: Container(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <dynamic>[
              Row(
                children: <dynamic>[
                  Expanded(
                    child: Text(
                      title,
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: isUsed || isExpired ? Colors.grey[600] : Colors.black,
                      ),
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: isUsed
                          ? Colors.grey[300]!
                          : isExpired
                              ? Colors.red[200]!
                              : Colors.green[100]!,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      isUsed
                          ? 'Used'
                          : isExpired
                              ? 'Expired'
                              : 'Active',
                      style: TextStyle(
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                        color: isUsed
                            ? Colors.grey[700]
                            : isExpired
                                ? Colors.red[800]
                                : Colors.green[800],
                      ),
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 8),

              Text(
                description,
                style: TextStyle(
                  fontSize: 14,
                  color: isUsed || isExpired ? Colors.grey[500] : Colors.grey[600],
                ),
              ),

              const SizedBox(height: 12),

              // Voucher Code
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: isUsed || isExpired ? Colors.grey[200] : Colors.blue[50],
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(
                    color: isUsed || isExpired ? Colors.grey[300] : Colors.blue[200],
                  ),
                ),
                child: Row(
                  children: <dynamic>[
                    Text(
                      'Code: ',
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.bold,
                        color: isUsed || isExpired ? Colors.grey[600] : Colors.blue[800],
                      ),
                    ),
                    Expanded(
                      child: Text(
                        code,
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          letterSpacing: 1,
                          color: isUsed || isExpired ? Colors.grey[600] : Colors.blue[800],
                        ),
                      ),
                    ),
                    IconButton(
                      onPressed: isUsed || isExpired ? null : () {
                        // Copy to clipboard functionality
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Code copied to clipboard')),
                        );
                      },
                      icon: Icon(
                        Icons.copy,
                        size: 20,
                        color: isUsed || isExpired ? Colors.grey[400] : Colors.blue[600],
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 12),

              // Discount and Expiry
              Row(
                children: <dynamic>[
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: isUsed || isExpired ? Colors.grey[300]! : Colors.orange[100]!,
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: Text(
                      discount,
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                        color: isUsed || isExpired ? Colors.grey[700] : Colors.orange[800],
                      ),
                    ),
                  ),
                  const Spacer(),
                  Row(
                    children: <dynamic>[
                      Icon(
                        Icons.schedule,
                        size: 14,
                        color: isExpired ? Colors.red[400] : Colors.grey[500],
                      ),
                      const SizedBox(width: 4),
                      Text(
                        isExpired ? 'Expired' : 'Expires ${_formatDate(expiryDate)}',
                        style: TextStyle(
                          fontSize: 12,
                          color: isExpired ? Colors.red[600] : Colors.grey[600],
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  String _formatDate(DateTime date) {
    final DateTime now = DateTime.now();
    final Duration difference = date.difference(now);

    if (difference.isNegative) {
      return 'Expired';
    } else if (difference.inDays == 0) {
      return 'today';
    } else if (difference.inDays == 1) {
      return 'tomorrow';
    } else if (difference.inDays < 7) {
      return 'in ${difference.inDays} days';
    } else if (difference.inDays < 30) {
      final int weeks = (difference.inDays / 7).floor();
      return 'in $weeks week${weeks > 1 ? 's' : ''}';
    } else {
      final int months = (difference.inDays / 30).floor();
      return 'in $months month${months > 1 ? 's' : ''}';
    }
  }
}
