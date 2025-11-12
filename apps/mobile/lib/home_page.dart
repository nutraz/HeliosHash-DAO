import 'package:flutter/material.dart';
<<<<<<< HEAD
import 'package:helios_hash_dao/app_constant.dart';
import 'package:helios_hash_dao/dashboard_page.dart';
import 'package:helios_hash_dao/projects_page.dart';
import 'package:helios_hash_dao/governance_page.dart';
import 'package:helios_hash_dao/community_page.dart';
import 'package:helios_hash_dao/wallet_page.dart';
import 'package:helios_hash_dao/rewards_page.dart';
=======
import 'app_constant.dart';
import 'community_page.dart';
import 'dashboard_page.dart';
import 'governance_page.dart';
import 'projects_page.dart';
import 'rewards_page.dart';
import 'wallet_page.dart';
>>>>>>> 9823c84 (chore: sync and clean repo)

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  int _selectedIndex = 0;

  static const List<Widget> _pages = <Widget>[
    DashboardPage(),
    ProjectsPage(),
    GovernancePage(),
    CommunityPage(),
    WalletPage(),
    RewardsPage(),
  ];

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _pages[_selectedIndex],
      bottomNavigationBar: BottomNavigationBar(
        items: const <BottomNavigationBarItem>[
          BottomNavigationBarItem(icon: Icon(Icons.dashboard), label: 'Dashboard'),
          BottomNavigationBarItem(icon: Icon(Icons.work), label: 'Projects'),
          BottomNavigationBarItem(icon: Icon(Icons.gavel), label: 'Governance'),
          BottomNavigationBarItem(icon: Icon(Icons.people), label: 'Community'),
          BottomNavigationBarItem(icon: Icon(Icons.account_balance_wallet), label: 'Wallet'),
          BottomNavigationBarItem(icon: Icon(Icons.star), label: 'Rewards'),
        ],
        currentIndex: _selectedIndex,
        selectedItemColor: AppConstants.primaryColor,
        unselectedItemColor: Colors.grey,
        onTap: _onItemTapped,
        type: BottomNavigationBarType.fixed,
        backgroundColor: Colors.white,
        elevation: 8,
        selectedLabelStyle: const TextStyle(fontWeight: FontWeight.bold),
        unselectedLabelStyle: const TextStyle(fontWeight: FontWeight.normal),
      ),
    );
  }
}
