import 'package:flutter/material.dart';
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
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'HeliosHash DAO',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      home: AshokChakraSplash(
        onAnimationComplete: () {
          // Navigate to home page after animation
          Navigator.of(context).pushReplacement(
            MaterialPageRoute<void>(builder: (BuildContext context) => const HomePage()),
          );
        },
      ),
    );
  }
}
