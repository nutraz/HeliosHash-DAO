import 'package:flutter/material.dart';
import 'project_model.dart';

class ProjectCard extends StatelessWidget {
  const ProjectCard({super.key, required this.project, this.onTap, this.showVoteButtons = true});
  final Project project;
  final VoidCallback? onTap;
  final bool showVoteButtons;

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 4,
      margin: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: SizedBox(
          height: 280, // Fixed height for consistent card sizing
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              // Project Image
              if (project.imageUrl != null)
                ClipRRect(
                  borderRadius: const BorderRadius.vertical(top: Radius.circular(12)),
                  child: Container(
                    height: 120,
                    width: double.infinity,
                    color: Colors.grey[300],
                    child: const Icon(Icons.image, size: 40, color: Colors.grey),
                  ),
                ),

              Expanded(
                child: Padding(
                  padding: const EdgeInsets.all(12),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: <dynamic>[
                      // Title and Status
                      Row(
                        children: <dynamic>[
                          Expanded(
                            child: Text(
                              project.title,
                              style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                          _buildStatusChip(),
                        ],
                      ),

                      const SizedBox(height: 6),

                      // Description
                      Text(
                        project.description,
                        style: TextStyle(fontSize: 12, color: Colors.grey[600]),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),

                      const SizedBox(height: 8),

                      // Category and Budget
                      Row(
                        children: <dynamic>[
                          Chip(
                            label: Text(project.category, style: const TextStyle(fontSize: 10)),
                            backgroundColor: Colors.blue[50],
                            labelStyle: TextStyle(color: Colors.blue[700]),
                            materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
                            padding: EdgeInsets.zero,
                          ),
                          const SizedBox(width: 6),
                          Text(
                            '\$${project.budget.toStringAsFixed(0)}',
                            style: const TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.bold,
                              color: Colors.green,
                            ),
                          ),
                        ],
                      ),

                      const SizedBox(height: 6),

                      // Tags
                      if (project.tags.isNotEmpty)
                        Wrap(
                          spacing: 2,
                          runSpacing: 2,
                          children: project.tags
                              .take(2)
                              .map(
                                (String tag) => Chip(
                                  label: Text(tag, style: const TextStyle(fontSize: 8)),
                                  backgroundColor: Colors.grey[200],
                                  materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
                                  padding: EdgeInsets.zero,
                                ),
                              )
                              .toList(),
                        ),

                      const Spacer(), // Push content to bottom
                      // Vote buttons and stats
                      if (showVoteButtons)
                        Row(
                          children: <dynamic>[
                            Expanded(
                              child: Row(
                                children: <dynamic>[
                                  IconButton(
                                    onPressed: () {
                                      // Handle upvote
                                    },
                                    icon: const Icon(Icons.thumb_up, size: 16),
                                    color: Colors.green,
                                    padding: EdgeInsets.zero,
                                    constraints: const BoxConstraints(),
                                  ),
                                  Text(
                                    project.upvotes.toString(),
                                    style: const TextStyle(fontSize: 12),
                                  ),
                                  const SizedBox(width: 12),
                                  IconButton(
                                    onPressed: () {
                                      // Handle downvote
                                    },
                                    icon: const Icon(Icons.thumb_down, size: 16),
                                    color: Colors.red,
                                    padding: EdgeInsets.zero,
                                    constraints: const BoxConstraints(),
                                  ),
                                  Text(
                                    project.downvotes.toString(),
                                    style: const TextStyle(fontSize: 12),
                                  ),
                                ],
                              ),
                            ),
                            Text(
                              '${project.teamMembers.length} members',
                              style: TextStyle(fontSize: 10, color: Colors.grey[600]),
                            ),
                          ],
                        ),

                      // Team members
                      if (!showVoteButtons)
                        Row(
                          children: <dynamic>[
                            const Icon(Icons.people, size: 14, color: Colors.grey),
                            const SizedBox(width: 4),
                            Text(
                              '${project.teamMembers.length} members',
                              style: TextStyle(fontSize: 10, color: Colors.grey[600]),
                            ),
                          ],
                        ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStatusChip() {
    Color chipColor;
    String statusText;

    switch (project.status) {
      case 'active':
        chipColor = Colors.green;
        statusText = 'Active';
      case 'completed':
        chipColor = Colors.blue;
        statusText = 'Completed';
      case 'draft':
        chipColor = Colors.orange;
        statusText = 'Draft';
      case 'cancelled':
        chipColor = Colors.red;
        statusText = 'Cancelled';
      default:
        chipColor = Colors.grey;
        statusText = 'Unknown';
    }

    return Chip(
      label: Text(statusText, style: const TextStyle(fontSize: 10, color: Colors.white)),
      backgroundColor: chipColor,
      materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
      padding: EdgeInsets.zero,
    );
  }
}
