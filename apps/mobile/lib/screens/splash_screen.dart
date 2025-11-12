import 'package:flutter/material.dart';
import 'dart:async';
import 'dart:math';
import 'package:flutter_svg/flutter_svg.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  _SplashScreenState createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _rotationAnimation;
  late Animation<double> _glowAnimation;

  @override
  void initState() {
    super.initState();

    _controller = AnimationController(duration: const Duration(seconds: 3), vsync: this);

    _rotationAnimation = Tween<double>(
      begin: 0,
      end: 2 * pi,
    ).animate(CurvedAnimation(parent: _controller, curve: Curves.linear));

    _glowAnimation = TweenSequence<double>([
      TweenSequenceItem(tween: Tween<double>(begin: 1.0, end: 1.5), weight: 1),
      TweenSequenceItem(tween: Tween<double>(begin: 1.5, end: 1.0), weight: 1),
    ]).animate(CurvedAnimation(parent: _controller, curve: Curves.easeInOut));

    _controller.repeat();

    Timer(Duration(seconds: 3), () {
      Navigator.pushReplacementNamed(context, '/auth-options');
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: Center(
        child: Stack(
          alignment: Alignment.center,
          children: [
            AnimatedBuilder(
<<<<<<< HEAD
              animation: Listenable.merge([_rotationAnimation, _glowAnimation]),
              builder: (context, child) {
=======
              animation: Listenable.merge(<dynamic>[_rotationAnimation, _glowAnimation]),
              builder: (BuildContext context, Widget? child) {
>>>>>>> 9823c84 (chore: sync and clean repo)
                return Stack(
                  alignment: Alignment.center,
                  children: [
                    // Fiery Sudarshan Chakra outer glow
                    Container(
                      width: 200 * _glowAnimation.value,
                      height: 200 * _glowAnimation.value,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        gradient: RadialGradient(
                          colors: [
                            Colors.orange.withOpacity(0.8),
                            Colors.red.withOpacity(0.6),
                            Colors.transparent,
                          ],
<<<<<<< HEAD
                          stops: [0.1, 0.5, 1.0],
=======
                          stops: const <double>[0.1, 0.5, 1.0],
>>>>>>> 9823c84 (chore: sync and clean repo)
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.orange.withOpacity(0.5),
                            blurRadius: 30 * _glowAnimation.value,
                            spreadRadius: 10 * _glowAnimation.value,
                          ),
                        ],
                      ),
                    ),
                    // Blue Dharma Chakra
                    Transform.rotate(
                      angle: _rotationAnimation.value,
                      child: CustomPaint(
                        size: const Size(150, 150),
                        painter: DharmaChakraPainter(),
                      ),
                    ),
                  ],
                );
              },
            ),
            // Centered SVG logo overlay
            Positioned(
              child: SizedBox(
                width: 120,
                height: 120,
                child: SvgPicture.asset(
                  'assets/icons/hhdaologo.svg',
                  placeholderBuilder: (BuildContext context) =>
                      const Icon(Icons.broken_image, size: 80, color: Colors.white),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class DharmaChakraPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final Offset center = Offset(size.width / 2, size.height / 2);
    final double radius = size.width / 2;

    final Paint paint = Paint()
      ..color = Colors.blue.shade800
      ..style = PaintingStyle.stroke
      ..strokeWidth = 3.0;

    final Paint spokePaint = Paint()
      ..color = Colors.blue.shade700
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2.0;

    // Draw outer circle
    canvas.drawCircle(center, radius, paint);

    // Draw 24 spokes (Ashoka Chakra)
    for (int i = 0; i < 24; i++) {
<<<<<<< HEAD
      final angle = 2 * pi * i / 24;
      final x1 = center.dx + radius * 0.7 * cos(angle);
      final y1 = center.dy + radius * 0.7 * sin(angle);
      final x2 = center.dx + radius * 0.9 * cos(angle);
      final y2 = center.dy + radius * 0.9 * sin(angle);
=======
      final double angle = 2 * pi * i / 24;
      final double x1 = center.dx + radius * 0.7 * cos(angle);
      final double y1 = center.dy + radius * 0.7 * sin(angle);
      final double x2 = center.dx + radius * 0.9 * cos(angle);
      final double y2 = center.dy + radius * 0.9 * sin(angle);
>>>>>>> 9823c84 (chore: sync and clean repo)

      canvas.drawLine(Offset(x1, y1), Offset(x2, y2), spokePaint);
    }

    // Draw inner circle
    canvas.drawCircle(center, radius * 0.3, paint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
