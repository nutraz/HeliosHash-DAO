import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:web3dart/web3dart.dart';
import 'package:http/http.dart' as http;
import 'dart:math';

class WalletProvider with ChangeNotifier {
  EthereumAddress? _address;
  EthPrivateKey? _credentials;
  Web3Client? _client;
  EtherAmount _balance = EtherAmount.zero();
  EtherAmount _tokenBalance = EtherAmount.zero();
  bool _isConnected = false;
  bool _isLoading = false;
  String _network = 'Sepolia Testnet';

  // Getters
  EthereumAddress? get address => _address;
  String get addressString => _address?.hex ?? '';
  String get shortAddress => _address != null
      ? '${_address!.hex.substring(0, 6)}...${_address!.hex.substring(_address!.hex.length - 4)}'
      : '';
  EtherAmount get balance => _balance;
  EtherAmount get tokenBalance => _tokenBalance;
  bool get isConnected => _isConnected;
  bool get isLoading => _isLoading;
  String get network => _network;

  // Initialize Web3 client
  Future<void> initialize() async {
    _isLoading = true;
    notifyListeners();

    try {
      // Initialize Web3 client (use your RPC endpoint)
      final rpcUrl = 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY';
      _client = Web3Client(rpcUrl, http.Client());

      // Check for saved wallet
      final prefs = await SharedPreferences.getInstance();
      final savedPrivateKey = prefs.getString('wallet_private_key');
      
      if (savedPrivateKey != null) {
        await _restoreWallet(savedPrivateKey);
      }
    } catch (e) {
      debugPrint('Wallet initialization error: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // Connect wallet (create or import)
  Future<void> connectWallet({String? privateKey}) async {
    _isLoading = true;
    notifyListeners();

    try {
      if (privateKey != null) {
        // Import existing wallet
        _credentials = EthPrivateKey.fromHex(privateKey);
      } else {
        // Create new wallet
        _credentials = EthPrivateKey.createRandom(Random.secure());
      }

      _address = _credentials!.address;
      _isConnected = true;

      // Save wallet (in production, use secure storage)
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('wallet_private_key', _credentials!.privateKey.toString());

      // Fetch initial balance
      await refreshBalance();
    } catch (e) {
      debugPrint('Connect wallet error: $e');
      _isConnected = false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // Restore wallet from saved credentials
  Future<void> _restoreWallet(String privateKey) async {
    try {
      _credentials = EthPrivateKey.fromHex(privateKey);
      _address = _credentials!.address;
      _isConnected = true;
      await refreshBalance();
    } catch (e) {
      debugPrint('Restore wallet error: $e');
    }
  }

  // Refresh balances
  Future<void> refreshBalance() async {
    if (_client == null || _address == null) return;

    try {
      _balance = await _client!.getBalance(_address!);
      // TODO: Add token balance fetch
      notifyListeners();
    } catch (e) {
      debugPrint('Refresh balance error: $e');
    }
  }

  // Disconnect wallet
  Future<void> disconnectWallet() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('wallet_private_key');

    _address = null;
    _credentials = null;
    _balance = EtherAmount.zero();
    _tokenBalance = EtherAmount.zero();
    _isConnected = false;

    notifyListeners();
  }

  // Send transaction
  Future<String?> sendTransaction({
    required String toAddress,
    required BigInt amount,
  }) async {
    if (_client == null || _credentials == null) return null;

    _isLoading = true;
    notifyListeners();

    try {
      final transaction = Transaction(
        to: EthereumAddress.fromHex(toAddress),
        value: EtherAmount.inWei(amount),
      );

      final txHash = await _client!.sendTransaction(
        _credentials!,
        transaction,
        chainId: 11155111, // Sepolia
      );

      await refreshBalance();
      return txHash;
    } catch (e) {
      debugPrint('Send transaction error: $e');
      return null;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  @override
  void dispose() {
    _client?.dispose();
    super.dispose();
  }
}
