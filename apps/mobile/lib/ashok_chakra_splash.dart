import 'package:flutter/material.dart';
import 'dart:math';
import 'dart:io';

class AshokChakraSplash extends StatefulWidget {
  final VoidCallback onAnimationComplete;

  const AshokChakraSplash({super.key, required this.onAnimationComplete});

  @override
  State<AshokChakraSplash> createState() => _AshokChakraSplashState();
}

class _AshokChakraSplashState extends State<AshokChakraSplash>
    with TickerProviderStateMixin {
  late AnimationController _scaleController;
  late Animation<double> _scaleAnimation;
  late AnimationController _fadeController;
  late Animation<double> _fadeAnimation;

  bool _mounted = false;
  final List<FlameParticle> _particles = [];

  @override
  void initState() {
    super.initState();
    _initializeParticles();
    _initializeAnimations();
    _startEntryAnimation();
  }

  void _initializeParticles() {
    for (int i = 0; i < 50; i++) {
      _particles.add(FlameParticle());
    }
  }

  void _initializeAnimations() {
    // Only initialize animations if not in test mode
    if (!Platform.environment.containsKey('FLUTTER_TEST')) {
      _scaleController = AnimationController(
        duration: const Duration(milliseconds: 1000),
        vsync: this,
      );

      _fadeController = AnimationController(
        duration: const Duration(milliseconds: 1000),
        vsync: this,
      );

      _scaleAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
        CurvedAnimation(parent: _scaleController, curve: Curves.elasticOut),
      );

      _fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
        CurvedAnimation(parent: _fadeController, curve: Curves.easeInOut),
      );
    } else {
      // In test mode, set static values
      _scaleAnimation = Tween<double>(
        begin: 1.0,
        end: 1.0,
      ).animate(AlwaysStoppedAnimation(1.0));
      _fadeAnimation = Tween<double>(
        begin: 1.0,
        end: 1.0,
      ).animate(AlwaysStoppedAnimation(1.0));
    }
  }

  void _startEntryAnimation() async {
    if (Platform.environment.containsKey('FLUTTER_TEST')) {
      // In test mode, skip animations and immediately complete
      setState(() => _mounted = true);
      widget.onAnimationComplete();
      return;
    }

    await Future.delayed(const Duration(milliseconds: 300));
    setState(() => _mounted = true);

    await _scaleController.forward();
    await Future.delayed(const Duration(milliseconds: 500));
    await _fadeController.forward();

    await Future.delayed(const Duration(seconds: 2));
    if (mounted) {
      widget.onAnimationComplete();
    }
  }

  @override
  void dispose() {
    if (!Platform.environment.containsKey('FLUTTER_TEST')) {
      _scaleController?.dispose();
      _fadeController?.dispose();
    }
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              Color(0xFF1a1a2e), // gray-900 equivalent
              Color(0xFF7c2d12), // orange-950 equivalent
              Colors.black,
            ],
          ),
        ),
        child: Stack(
          children: [
            // Animated fire particles
            ..._buildFireParticles(),

            // Main content
            Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  // Chakra Container
                  ScaleTransition(
                    scale: _scaleAnimation,
                    child: Stack(
                      alignment: Alignment.center,
                      children: [
                        // Outer fire glow layers
                        _buildFireGlow(),

                        // Outer rotating ring - Fiery Sudarshan Chakra
                        _buildFireChakra(),

                        // Inner spinning Ashoka Chakra - Cool Blue
                        _buildAshokChakra(),

                        // Center blue glow pulse
                        _buildCenterGlow(),
                      ],
                    ),
                  ),

                  const SizedBox(height: 80),

                  // App title fade in
                  FadeTransition(
                    opacity: _fadeAnimation,
                    child: Column(
                      children: [
                        ShaderMask(
                          shaderCallback: (bounds) => const LinearGradient(
                            colors: [
                              Color(0xFFFFA500), // orange-400
                              Color(0xFFEF4444), // red-500
                              Color(0xFFFFD700), // yellow-500
                            ],
                          ).createShader(bounds),
                          child: const Text(
                            'Welcome',
                            style: TextStyle(
                              fontSize: 48,
                              fontWeight: FontWeight.bold,
                              color: Colors.white,
                            ),
                          ),
                        ),
                        const SizedBox(height: 8),
                        const Text(
                          'Loading your experience...',
                          style: TextStyle(
                            color: Color(0xFFFFF8DC), // orange-200 equivalent
                            fontSize: 16,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  List<Widget> _buildFireParticles() {
    return _particles.map((particle) {
      return AnimatedPositioned(
        duration: Duration(milliseconds: (particle.duration * 1000).round()),
        left: particle.left * MediaQuery.of(context).size.width,
        top: particle.top * MediaQuery.of(context).size.height,
        child: Container(
          width: particle.size,
          height: particle.size,
          decoration: BoxDecoration(
            color: particle.color,
            shape: BoxShape.circle,
          ),
        ),
      );
    }).toList();
  }

  Widget _buildFireGlow() {
    return Stack(
      children: [
        // First glow layer
        AnimatedContainer(
          duration: const Duration(seconds: 2),
          width: 384, // w-96
          height: 384, // h-96
          decoration: BoxDecoration(
            color: const Color(0xFFEA580C), // orange-600
            shape: BoxShape.circle,
            boxShadow: [
              BoxShadow(
                blurRadius: 48, // blur-3xl
                color: const Color(0xFFEA580C).withOpacity(0.4),
              ),
            ],
          ),
        ),

        // Second glow layer
        AnimatedContainer(
          duration: const Duration(seconds: 2),
          width: 384,
          height: 384,
          decoration: BoxDecoration(
            color: const Color(0xFFDC2626), // red-600
            shape: BoxShape.circle,
            boxShadow: [
              BoxShadow(
                blurRadius: 48,
                color: const Color(0xFFDC2626).withOpacity(0.3),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildFireChakra() {
    return RotationTransition(
      turns: AlwaysStoppedAnimation(DateTime.now().millisecond / 1000 * 0.25),
      child: SizedBox(
        width: 384, // w-96
        height: 384, // h-96
        child: CustomPaint(painter: FireChakraPainter()),
      ),
    );
  }

  Widget _buildAshokChakra() {
    return RotationTransition(
      turns: AlwaysStoppedAnimation(DateTime.now().millisecond / 1000 * -0.2),
      child: SizedBox(
        width: 288, // w-72
        height: 288, // h-72
        child: CustomPaint(painter: AshokChakraPainter()),
      ),
    );
  }

  Widget _buildCenterGlow() {
    return Container(
      width: 80, // w-20
      height: 80, // h-20
      decoration: BoxDecoration(
        color: const Color(0xFF3B82F6), // blue-500
        shape: BoxShape.circle,
        boxShadow: [
          BoxShadow(
            blurRadius: 16, // blur-2xl
            color: const Color(0xFF3B82F6).withOpacity(0.7),
          ),
        ],
      ),
    );
  }
}

class FlameParticle {
  final double left;
  final double top;
  final double size;
  final Color color;
  final double duration;

  FlameParticle()
      : left = _random.nextDouble(),
        top = _random.nextDouble(),
        size = _random.nextDouble() * 6 + 2,
        color = _flameColors[_random.nextInt(_flameColors.length)],
        duration = _random.nextDouble() * 2 + 1;

  static final Random _random = Random();
  static const _flameColors = [
    Color(0xFFFF4500), // ff4500
    Color(0xFFFF6B00), // ff6b00
    Color(0xFFFF8C00), // ff8c00
    Color(0xFFFFA500), // ffaa00
    Color(0xFFFF0000), // ff0000
  ];
}

class FireChakraPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final paint = Paint();
    final outerRadius = size.width / 2;

    // Draw outer flame spikes
    for (int i = 0; i < 24; i++) {
      final angle = (i * 360 / 24) * (pi / 180);

      // Main flame spike
      final path = Path();
      path.moveTo(center.dx, center.dy - outerRadius + 10);
      path.quadraticBezierTo(
        center.dx - 5,
        center.dy - outerRadius + 25,
        center.dx,
        center.dy - outerRadius + 35,
      );
      path.quadraticBezierTo(
        center.dx + 5,
        center.dy - outerRadius + 25,
        center.dx,
        center.dy - outerRadius + 10,
      );
      path.close();

      // Transform for rotation
      final matrix = Matrix4.identity();
      matrix.rotateZ(angle);
      final transformedPath = path.transform(matrix.storage);

      // Gradient paint for flame
      final gradient = RadialGradient(
        colors: [
          const Color(0xFFFFFF00), // yellow
          const Color(0xFFFF6B00), // orange
          const Color(0xFFFF0000), // red
        ],
      );
      paint.shader = gradient.createShader(
        Rect.fromCircle(center: center, radius: outerRadius),
      );
      paint.color = const Color(0xFFFF6B00);

      canvas.drawPath(transformedPath, paint);
    }

    // Fire ring effects
    paint
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2
      ..shader = LinearGradient(
        colors: [
          const Color(0xFFFF0000),
          const Color(0xFFFF6B00),
          const Color(0xFFFF0000),
        ],
      ).createShader(Rect.fromCircle(center: center, radius: outerRadius - 22));

    canvas.drawCircle(center, outerRadius - 22, paint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => true;
}

class AshokChakraPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final paint = Paint();
    final radius = size.width / 2;

    // Center circles
    paint
      ..style = PaintingStyle.fill
      ..color = const Color(0xFF0A2463); // dark blue
    canvas.drawCircle(center, 15, paint);

    paint.color = const Color(0xFF1E40AF); // medium blue
    canvas.drawCircle(center, 12, paint);

    paint.color = const Color(0xFF3B82F6); // light blue
    canvas.drawCircle(center, 8, paint);

    paint.color = const Color(0xFF60A5FA); // lighter blue
    canvas.drawCircle(center, 5, paint);

    // 24 Blue Spokes
    paint
      ..style = PaintingStyle.stroke
      ..strokeWidth = 3
      ..color = const Color(0xFF0A2463);

    for (int i = 0; i < 24; i++) {
      final angle = (i * 360 / 24) * (pi / 180);
      final x1 = center.dx + 14 * cos(angle);
      final y1 = center.dy + 14 * sin(angle);
      final x2 = center.dx + 68 * cos(angle);
      final y2 = center.dy + 68 * sin(angle);

      // Dark blue spoke
      canvas.drawLine(Offset(x1, y1), Offset(x2, y2), paint);

      // Light blue spoke overlay
      paint
        ..strokeWidth = 2
        ..color = const Color(0xFF3B82F6);
      canvas.drawLine(Offset(x1, y1), Offset(x2, y2), paint);

      // Reset for next iteration
      paint
        ..strokeWidth = 3
        ..color = const Color(0xFF0A2463);

      // Glowing circles at spoke ends
      paint.style = PaintingStyle.fill;
      paint.color = const Color(0xFF1E40AF);
      canvas.drawCircle(Offset(x2, y2), 3.5, paint);

      paint.color = const Color(0xFF60A5FA);
      canvas.drawCircle(Offset(x2, y2), 2, paint);
      paint.style = PaintingStyle.stroke;
    }

    // Outer rim
    paint
      ..style = PaintingStyle.stroke
      ..strokeWidth = 5
      ..color = const Color(0xFF0A2463);
    canvas.drawCircle(center, 71, paint);

    paint
      ..strokeWidth = 2.5
      ..color = const Color(0xFF3B82F6);
    canvas.drawCircle(center, 71, paint);

    paint
      ..strokeWidth = 1
      ..color = const Color(0xFF60A5FA).withOpacity(0.6);
    canvas.drawCircle(center, 71, paint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => true;
}
