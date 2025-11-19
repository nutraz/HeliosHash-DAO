import 'package:flutter_test/flutter_test.dart';
import 'package:helioshash_dao/dao_provider.dart';

void main() {
  test('DAOProvider connects wallet', () async {
    final provider = DAOProvider();
    await provider.connectWallet('II');
    expect(provider.isConnected, true);
  });
}
