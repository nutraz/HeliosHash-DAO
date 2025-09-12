import 'package:flutter/material.dart';

void main() {
  runApp(const HeliosHashApp());
}

class HeliosHashApp extends StatelessWidget {
  const HeliosHashApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'HeliosHash DAO',
      theme: ThemeData(
        primarySwatch: Colors.green,
        visualDensity: VisualDensity.adaptivePlatformDensity,
      ),
      home: const Placeholder(), // Replace with your home screen
    );
  }
}
