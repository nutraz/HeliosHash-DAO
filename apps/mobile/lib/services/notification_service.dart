import 'package:flutter/material.dart';

class NotificationService {
  static final _notifications = <String>[];
  static final ValueNotifier<List<String>> notifier = ValueNotifier([]);

  static void show(String message) {
    _notifications.add(message);
    notifier.value = List.from(_notifications);
  }
}
