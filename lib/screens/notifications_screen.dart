import 'package:flutter/material.dart';
import '../services/notification_service.dart';

class NotificationsScreen extends StatelessWidget {
  const NotificationsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Notifications')),
      body: ValueListenableBuilder<List<String>>(
        valueListenable: NotificationService.notifier,
        builder: (context, notifications, _) {
          if (notifications.isEmpty) {
            return const Center(child: Text('No notifications.'));
          }
          return ListView.builder(
            itemCount: notifications.length,
            itemBuilder: (context, idx) => ListTile(
              leading: const Icon(Icons.notifications),
              title: Text(notifications[idx]),
            ),
          );
        },
      ),
    );
  }
}
