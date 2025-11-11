import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';

class WebViewAuthScreen extends StatefulWidget {
  const WebViewAuthScreen({Key? key}) : super(key: key);

  @override
  _WebViewAuthScreenState createState() => _WebViewAuthScreenState();
}

class _WebViewAuthScreenState extends State<WebViewAuthScreen> {
  late final WebViewController _controller;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setNavigationDelegate(
        NavigationDelegate(
          onProgress: (int progress) {},
          onPageStarted: (String url) {
            setState(() {
              _isLoading = true;
            });
          },
          onPageFinished: (String url) {
            setState(() {
              _isLoading = false;
            });
            if (url.contains('#authorization')) {
              _handleAuthSuccess(url);
            }
          },
        ),
      )
      ..loadRequest(Uri.parse('https://identity.ic0.app'));
  }

  void _handleAuthSuccess(String url) {
    final uri = Uri.parse(url);
    final fragment = uri.fragment;
    final parts = fragment.split('delegation=');
    if (parts.length > 1) {
      final delegation = parts[1].split('&')[0];
      Navigator.pop(context, delegation);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Internet Identity Authentication'),
      ),
      body: Stack(
        children: [
          WebViewWidget(controller: _controller),
          if (_isLoading)
            const Center(
              child: CircularProgressIndicator(),
            ),
        ],
      ),
    );
  }
}
