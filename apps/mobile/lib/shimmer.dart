import 'package:flutter/material.dart';
import 'package:shimmer/shimmer.dart';

class ShimmerLoading extends StatelessWidget {
<<<<<<< HEAD
  final Widget child;
  final Color? baseColor;
  final Color? highlightColor;

  const ShimmerLoading({
    super.key,
    required this.child,
    this.baseColor,
    this.highlightColor,
  });
=======
  const ShimmerLoading({super.key, required this.child, this.baseColor, this.highlightColor});
  final Widget child;
  final Color? baseColor;
  final Color? highlightColor;
>>>>>>> 9823c84 (chore: sync and clean repo)

  @override
  Widget build(BuildContext context) {
    return Shimmer.fromColors(
      baseColor: baseColor ?? Colors.grey[300]!,
      highlightColor: highlightColor ?? Colors.grey[100]!,
      child: child,
    );
  }
}

class ProjectCardShimmer extends StatelessWidget {
  const ProjectCardShimmer({super.key});

  @override
  Widget build(BuildContext context) {
    return ShimmerLoading(
      child: Card(
        elevation: 4,
        margin: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        child: Container(
          height: 200,
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Image placeholder
              Container(
                height: 100,
                width: double.infinity,
                color: Colors.white,
                margin: const EdgeInsets.only(bottom: 12),
              ),
              // Title
              Container(
                height: 20,
                width: 200,
                color: Colors.white,
                margin: const EdgeInsets.only(bottom: 8),
              ),
              // Description
              Container(
                height: 14,
                width: double.infinity,
                color: Colors.white,
                margin: const EdgeInsets.only(bottom: 8),
              ),
              Container(
                height: 14,
                width: 150,
                color: Colors.white,
                margin: const EdgeInsets.only(bottom: 12),
              ),
              // Tags and budget
              Row(
                children: [
                  Container(
                    height: 24,
                    width: 60,
                    color: Colors.white,
                    margin: const EdgeInsets.only(right: 8),
                  ),
                  Container(height: 24, width: 80, color: Colors.white),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class ProposalCardShimmer extends StatelessWidget {
  const ProposalCardShimmer({super.key});

  @override
  Widget build(BuildContext context) {
    return ShimmerLoading(
      child: Card(
        elevation: 4,
        margin: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        child: Container(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Title and status
              Row(
                children: [
                  Expanded(
                    child: Container(
                      height: 20,
                      color: Colors.white,
                      margin: const EdgeInsets.only(bottom: 8),
                    ),
                  ),
                  Container(height: 24, width: 60, color: Colors.white),
                ],
              ),
              // Description
              Container(
                height: 14,
                width: double.infinity,
                color: Colors.white,
                margin: const EdgeInsets.only(bottom: 8),
              ),
              Container(
                height: 14,
                width: 200,
                color: Colors.white,
                margin: const EdgeInsets.only(bottom: 12),
              ),
              // Type and category
              Row(
                children: [
                  Container(
                    height: 24,
                    width: 80,
                    color: Colors.white,
                    margin: const EdgeInsets.only(right: 8),
                  ),
                  Container(height: 24, width: 70, color: Colors.white),
                ],
              ),
              const SizedBox(height: 12),
              // Progress bar
              Container(
                height: 8,
                width: double.infinity,
                color: Colors.white,
                margin: const EdgeInsets.only(bottom: 8),
              ),
              // Vote buttons
              Row(
                children: [
                  Expanded(
                    child: Container(
                      height: 36,
                      color: Colors.white,
                      margin: const EdgeInsets.only(right: 4),
                    ),
                  ),
                  Expanded(
                    child: Container(
                      height: 36,
                      color: Colors.white,
                      margin: const EdgeInsets.only(left: 4, right: 4),
                    ),
                  ),
                  Expanded(
                    child: Container(
                      height: 36,
                      color: Colors.white,
                      margin: const EdgeInsets.only(left: 4),
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

class StatCardShimmer extends StatelessWidget {
  const StatCardShimmer({super.key});

  @override
  Widget build(BuildContext context) {
    return ShimmerLoading(
      child: Card(
        elevation: 4,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        child: Container(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
<<<<<<< HEAD
                children: [
                  Container(
                    width: 40,
                    height: 40,
                    color: Colors.white,
                  ),
=======
                children: <dynamic>[
                  Container(width: 40, height: 40, color: Colors.white),
>>>>>>> 9823c84 (chore: sync and clean repo)
                  const Spacer(),
                  Container(width: 60, height: 16, color: Colors.white),
                ],
              ),
              const SizedBox(height: 12),
              Container(
                height: 24,
                width: 80,
                color: Colors.white,
                margin: const EdgeInsets.only(bottom: 4),
              ),
              Container(height: 14, width: 120, color: Colors.white),
            ],
          ),
        ),
      ),
    );
  }
}

class ListShimmer extends StatelessWidget {
<<<<<<< HEAD
  final int itemCount;
  final double itemHeight;

  const ListShimmer({
    super.key,
    this.itemCount = 5,
    this.itemHeight = 60,
  });
=======
  const ListShimmer({super.key, this.itemCount = 5, this.itemHeight = 60});
  final int itemCount;
  final double itemHeight;
>>>>>>> 9823c84 (chore: sync and clean repo)

  @override
  Widget build(BuildContext context) {
    return ShimmerLoading(
      child: ListView.builder(
        itemCount: itemCount,
        itemBuilder: (BuildContext context, int index) {
          return Container(
            height: itemHeight,
            margin: const EdgeInsets.symmetric(vertical: 4, horizontal: 16),
            decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(8)),
            child: Padding(
              padding: const EdgeInsets.all(12),
              child: Row(
<<<<<<< HEAD
                children: [
                  Container(
                    width: 40,
                    height: 40,
                    color: Colors.grey[300],
                  ),
=======
                children: <dynamic>[
                  Container(width: 40, height: 40, color: Colors.grey[300]),
>>>>>>> 9823c84 (chore: sync and clean repo)
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Container(
                          height: 14,
                          width: 150,
                          color: Colors.grey[300],
                          margin: const EdgeInsets.only(bottom: 4),
                        ),
                        Container(height: 12, width: 100, color: Colors.grey[300]),
                      ],
                    ),
                  ),
                  Container(width: 60, height: 20, color: Colors.grey[300]),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
