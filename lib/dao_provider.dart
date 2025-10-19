import 'package:ic_dart/ic_dart.dart';

class DAOProvider {
  bool isConnected = false;
  String? principal;

  Future<void> connectWallet(String walletType) async {
    if (walletType == 'II') {
      final identity = await Ed25519KeyIdentity.generate();
      isConnected = true;
      principal = identity.getPrincipal().toText();
    } else {
      throw Exception('Unsupported wallet type');
    }
  }
}
