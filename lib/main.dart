import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:helioshash_dao/providers/governance_provider.dart';
import 'package:helioshash_dao/screens/dashboard_screen.dart';
import 'package:helioshash_dao/services/authentication_service.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (context) => GovernanceProvider(),
      child: MaterialApp(
        title: 'HeliosHash DAO',
        theme: ThemeData(
          primarySwatch: Colors.green,
          visualDensity: VisualDensity.adaptivePlatformDensity,
        ),
        home: const AuthWrapper(),
        debugShowCheckedModeBanner: false,
      ),
    );
  }
}

class AuthWrapper extends StatefulWidget {
  const AuthWrapper({Key? key}) : super(key: key);

  @override
  _AuthWrapperState createState() => _AuthWrapperState();
}

class _AuthWrapperState extends State<AuthWrapper> {
  final AuthenticationService _authService = AuthenticationService();
  bool _isLoading = true;
  bool _isAuthenticated = false;

  @override
  void initState() {
    super.initState();
    _checkAuthStatus();
  }

  Future<void> _checkAuthStatus() async {
    final token = await _authService.getAuthToken();
    setState(() {
      _isAuthenticated = token != null;
      _isLoading = false;
    });
  }

  Future<void> _authenticate() async {
    final token = await _authService.authenticateWithII(context);
    setState(() {
      _isAuthenticated = token != null;
    });
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      );
    }

    if (_isAuthenticated) {
      return const DashboardScreen();
    }

    return Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text(
              'HeliosHash DAO',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: _authenticate,
              child: const Text('Login with Internet Identity'),
            ),
          ],
        ),
      ),
    );
  }
}
