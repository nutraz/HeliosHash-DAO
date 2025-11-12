import 'package:flutter/material.dart';

// Web stub for WebView auth - returns a mock token and explains that WebView is not available
class WebViewAuthScreen extends StatefulWidget {
  const WebViewAuthScreen({super.key});

  @override
  _WebViewAuthScreenState createState() => _WebViewAuthScreenState();
}

class _WebViewAuthScreenState extends State<WebViewAuthScreen> {
  @override
  void initState() {
    super.initState();
    // Immediately return a mock token for web
    Future.microtask(() {
      Navigator.pop(context, 'mock_web_token');
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Internet Identity (Web)')),
      body: const Center(
        child: Text(
          'Internet Identity login is not supported via WebView on web. Returning mock token.',
        ),
      ),
    );
  }
}
