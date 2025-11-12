import 'package:flutter/material.dart';
<<<<<<< HEAD
// import 'package:supabase_flutter/supabase_flutter.dart';
// import 'package:device_preview/device_preview.dart';
import 'app_constant.dart';
// import 'package:helios_hash_dao/supabaseConstant.dart';
import 'ashok_chakra_splash.dart';
import 'home_page.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // TODO: Configure Supabase credentials
  // await Supabase.initialize(url: supabaseUrl, anonKey: supabaseAnonKey);

  runApp(const MyApp());
=======

void main() {
  runApp(const HeliosHashApp());
>>>>>>> 9823c84 (chore: sync and clean repo)
}

class HeliosHashApp extends StatelessWidget {
  const HeliosHashApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'HeliosHash DAO',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: Colors.orange,
          brightness: Brightness.light,
        ),
        useMaterial3: true,
      ),
<<<<<<< HEAD
      home: AshokChakraSplash(
        onAnimationComplete: () {
          // Navigate to home page after animation
          Navigator.of(context).pushReplacement(
            MaterialPageRoute<void>(builder: (BuildContext context) => const HomePage()),
          );
        },
=======
      home: const MyHomePage(title: 'HeliosHash DAO'),
      debugShowCheckedModeBanner: false,
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key, required this.title});

  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  int _selectedIndex = 0;

  // Navigation destinations
  static const List<Widget> _pages = <Widget>[
    DashboardPage(),
    GovernancePage(),
    TreasuryPage(),
    CommunityPage(),
  ];

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.primaryContainer,
        title: Text(widget.title),
        elevation: 0,
      ),
      body: _pages[_selectedIndex],
      bottomNavigationBar: NavigationBar(
        selectedIndex: _selectedIndex,
        onDestinationSelected: _onItemTapped,
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.dashboard),
            label: 'Dashboard',
          ),
          NavigationDestination(
            icon: Icon(Icons.how_to_vote),
            label: 'Governance',
          ),
          NavigationDestination(
            icon: Icon(Icons.account_balance_wallet),
            label: 'Treasury',
          ),
          NavigationDestination(
            icon: Icon(Icons.people),
            label: 'Community',
          ),
        ],
      ),
    );
  }
}

// Individual Page Widgets
class DashboardPage extends StatelessWidget {
  const DashboardPage({super.key});

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      child: Center(
        child: Padding(
          padding: const EdgeInsets.all(20.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: <Widget>[
              const Icon(
                Icons.sunny,
                size: 100,
                color: Colors.orange,
              ),
              const SizedBox(height: 20),
              Text(
                'Welcome to HeliosHash DAO!',
                style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
              ),
              const SizedBox(height: 10),
              Text(
                'Your decentralized autonomous organization',
                style: Theme.of(context).textTheme.bodyLarge,
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 40),
              // DAO Stats Cards
              const Row(
                children: [
                  Expanded(
                    child: StatCard(
                      title: 'Members',
                      value: '1.2K',
                      icon: Icons.people,
                    ),
                  ),
                  Expanded(
                    child: StatCard(
                      title: 'Proposals',
                      value: '24',
                      icon: Icons.assignment,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              const Row(
                children: [
                  Expanded(
                    child: StatCard(
                      title: 'Treasury',
                      value: 'Ξ 42.5',
                      icon: Icons.account_balance_wallet,
                    ),
                  ),
                  Expanded(
                    child: StatCard(
                      title: 'Active Votes',
                      value: '8',
                      icon: Icons.how_to_vote,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class GovernancePage extends StatelessWidget {
  const GovernancePage({super.key});

  @override
  Widget build(BuildContext context) {
    return const Center(
      child: Text(
        'Governance - Participate in voting',
        style: TextStyle(fontSize: 24),
      ),
    );
  }
}

class TreasuryPage extends StatelessWidget {
  const TreasuryPage({super.key});

  @override
  Widget build(BuildContext context) {
    return const Center(
      child: Text(
        'Treasury - Manage DAO funds',
        style: TextStyle(fontSize: 24),
      ),
    );
  }
}

class CommunityPage extends StatelessWidget {
  const CommunityPage({super.key});

  @override
  Widget build(BuildContext context) {
    return const Center(
      child: Text(
        'Community - Connect with members',
        style: TextStyle(fontSize: 24),
      ),
    );
  }
}

// Reusable Stat Card Widget
class StatCard extends StatelessWidget {
  final String title;
  final String value;
  final IconData icon;

  const StatCard({
    super.key,
    required this.title,
    required this.value,
    required this.icon,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            Icon(icon, size: 30, color: Colors.orange),
            const SizedBox(height: 8),
            Text(
              value,
              style: const TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
            Text(
              title,
              style: const TextStyle(
                fontSize: 12,
                color: Colors.grey,
              ),
            ),
          ],
        ),
>>>>>>> 9823c84 (chore: sync and clean repo)
      ),
    );
  }
}
