import 'package:flutter/foundation.dart';
import 'package:web3dart/web3dart.dart';
import 'package:http/http.dart';
import 'package:walletconnect_flutter_v2/walletconnect_flutter_v2.dart';
import 'package:shared_preferences/shared_preferences.dart';

enum WalletProvider {
  metamask,
  walletConnect,
  coinbase,
  internetIdentity,
}

class WalletService extends ChangeNotifier {
  Web3Client? _web3Client;
  EthereumAddress? _userAddress;
  String? _balance;
  WalletProvider? _connectedProvider;
  Web3App? _wcClient;

  bool get isConnected => _userAddress != null;
  String? get userAddress => _userAddress?.hexEip55;
  String? get balance => _balance;
  WalletProvider? get provider => _connectedProvider;

  void _initWeb3Client(String rpcUrl) {
    _web3Client = Web3Client(rpcUrl, Client());
  }

  Future<bool> connectMetaMask() async {
    if (kIsWeb) {
      try {
        // For web, you'll need to use js interop with MetaMask
        // This is a placeholder - implement with flutter_web3 or js package
        _connectedProvider = WalletProvider.metamask;
        await _saveWalletState();
        notifyListeners();
        return true;
      } catch (e) {
        debugPrint('MetaMask connection error: $e');
        return false;
      }
    }
    return false;
  }

  Future<bool> connectWalletConnect(String projectId) async {
    try {
      _wcClient = await Web3App.createInstance(
        projectId: projectId,
        metadata: const PairingMetadata(
          name: 'HeliosHash DAO',
          description: 'Decentralized Autonomous Organization',
          url: 'https://helioshash.io',
          icons: ['https://i.postimg.cc/1XxQvGCg/image.png'],
        ),
      );

      final session = await _wcClient!.connect(
        requiredNamespaces: {
          'eip155': const RequiredNamespace(
            chains: ['eip155:1'],
            methods: [
              'eth_sendTransaction',
              'eth_signTransaction',
              'eth_sign',
              'personal_sign',
              'eth_signTypedData',
            ],
            events: ['chainChanged', 'accountsChanged'],
          ),
        },
      );

      if (session != null) {
        final accounts = session.namespaces['eip155']?.accounts ?? [];
        if (accounts.isNotEmpty) {
          final addressString = accounts.first.split(':').last;
          _userAddress = EthereumAddress.fromHex(addressString);
          _connectedProvider = WalletProvider.walletConnect;
          _initWeb3Client('https://mainnet.infura.io/v3/YOUR_INFURA_KEY');
          await _updateBalance();
          await _saveWalletState();
          notifyListeners();
          return true;
        }
      }
      return false;
    } catch (e) {
      debugPrint('WalletConnect error: $e');
      return false;
    }
  }

  Future<bool> connectCoinbaseWallet() async {
    try {
      // Implement Coinbase Wallet SDK integration
      _connectedProvider = WalletProvider.coinbase;
      await _saveWalletState();
      notifyListeners();
      return true;
    } catch (e) {
      debugPrint('Coinbase Wallet error: $e');
      return false;
    }
  }

  Future<void> _updateBalance() async {
    if (_web3Client != null && _userAddress != null) {
      try {
        final etherAmount = await _web3Client!.getBalance(_userAddress!);
        _balance =
            etherAmount.getValueInUnit(EtherUnit.ether).toStringAsFixed(4);
        notifyListeners();
      } catch (e) {
        debugPrint('Balance fetch error: $e');
      }
    }
  }

  Future<void> _saveWalletState() async {
    final prefs = await SharedPreferences.getInstance();
    if (_userAddress != null) {
      await prefs.setString('wallet_address', _userAddress!.hexEip55);
      await prefs.setString('wallet_provider', _connectedProvider.toString());
    }
  }

  Future<void> restoreWalletState() async {
    final prefs = await SharedPreferences.getInstance();
    final address = prefs.getString('wallet_address');
    final providerString = prefs.getString('wallet_provider');
    if (address != null && providerString != null) {
      _userAddress = EthereumAddress.fromHex(address);
      _connectedProvider = WalletProvider.values.firstWhere(
        (p) => p.toString() == providerString,
      );
      _initWeb3Client('https://mainnet.infura.io/v3/YOUR_INFURA_KEY');
      await _updateBalance();
      notifyListeners();
    }
  }

  Future<void> disconnect() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('wallet_address');
    await prefs.remove('wallet_provider');
    _userAddress = null;
    _balance = null;
    _connectedProvider = null;
    _wcClient?.disconnectAllSessions();
    notifyListeners();
  }

  @override
  void dispose() {
    _web3Client?.dispose();
    super.dispose();
  }
}
