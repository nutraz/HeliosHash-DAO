import 'package:flutter/material.dart';

class AppConstants {
  static const String appName = 'HeliosHash DAO';
  static const String appVersion = '1.0.0';

  // Colors
  static const Color primaryColor = Color(0xFF6200EE);
  static const Color secondaryColor = Color(0xFF03DAC6);
  static const Color accentColor = Color(0xFFFF5722);
  static const Color backgroundColor = Color(0xFFF5F5F5);
  static const Color surfaceColor = Colors.white;
  static const Color errorColor = Color(0xFFB00020);

  // Text Styles
  static const TextStyle headline1 = TextStyle(
    fontSize: 32,
    fontWeight: FontWeight.bold,
    color: Colors.black,
  );

  static const TextStyle headline2 = TextStyle(
    fontSize: 24,
    fontWeight: FontWeight.bold,
    color: Colors.black,
  );

  static const TextStyle bodyText1 = TextStyle(
    fontSize: 16,
    color: Colors.black87,
  );

  static const TextStyle bodyText2 = TextStyle(
    fontSize: 14,
    color: Colors.black54,
  );

  // Spacing
  static const double paddingSmall = 8.0;
  static const double paddingMedium = 16.0;
  static const double paddingLarge = 24.0;

  // Border Radius
  static const double borderRadiusSmall = 4.0;
  static const double borderRadiusMedium = 8.0;
  static const double borderRadiusLarge = 16.0;

  // Icons
  static const IconData homeIcon = Icons.home;
  static const IconData dashboardIcon = Icons.dashboard;
  static const IconData projectsIcon = Icons.work;
  static const IconData governanceIcon = Icons.gavel;
  static const IconData communityIcon = Icons.people;
  static const IconData walletIcon = Icons.account_balance_wallet;
  static const IconData rewardsIcon = Icons.star;
  static const IconData profileIcon = Icons.person;
  static const IconData settingsIcon = Icons.settings;

  // Animation Durations
  static const Duration animationDurationShort = Duration(milliseconds: 200);
  static const Duration animationDurationMedium = Duration(milliseconds: 500);
  static const Duration animationDurationLong = Duration(milliseconds: 1000);

  // API Endpoints (placeholders)
  static const String apiBaseUrl = 'https://api.heliosdao.com';
  static const String projectsEndpoint = '$apiBaseUrl/projects';
  static const String proposalsEndpoint = '$apiBaseUrl/proposals';
  static const String usersEndpoint = '$apiBaseUrl/users';
  static const String governanceEndpoint = '$apiBaseUrl/governance';

  // Local Storage Keys
  static const String userTokenKey = 'user_token';
  static const String userIdKey = 'user_id';
  static const String themeKey = 'theme';
  static const String languageKey = 'language';

  // Validation
  static const int minPasswordLength = 8;
  static const int maxUsernameLength = 20;
  static const int maxProjectTitleLength = 100;
  static const int maxProposalDescriptionLength = 1000;

  // Pagination
  static const int defaultPageSize = 20;
  static const int maxPageSize = 100;

  // File Upload
  static const int maxFileSize = 10 * 1024 * 1024; // 10MB
  static const List<String> allowedImageExtensions = <String>['jpg', 'jpeg', 'png', 'gif'];
  static const List<String> allowedDocumentExtensions = <String>['pdf', 'doc', 'docx', 'txt'];

  // Notification Settings
  static const String notificationChannelId = 'helios_dao_channel';
  static const String notificationChannelName = 'HeliosHash DAO';
  static const String notificationChannelDescription = 'Notifications for HeliosHash DAO app';

  // Social Links (placeholders)
  static const String twitterUrl = 'https://twitter.com/heliosdao';
  static const String discordUrl = 'https://discord.gg/heliosdao';
  static const String githubUrl = 'https://github.com/heliosdao';
  static const String websiteUrl = 'https://heliosdao.com';

  // Feature Flags
  static const bool enableDarkMode = false;
  static const bool enableNotifications = true;
  static const bool enableOfflineMode = false;
  static const bool enableBiometrics = false;

  // Error Messages
  static const String networkErrorMessage = 'Network error. Please check your connection.';
  static const String serverErrorMessage = 'Server error. Please try again later.';
  static const String authenticationErrorMessage = 'Authentication failed. Please log in again.';
  static const String validationErrorMessage = 'Please check your input and try again.';
  static const String unknownErrorMessage = 'An unknown error occurred. Please try again.';

  // Success Messages
  static const String loginSuccessMessage = 'Login successful!';
  static const String registrationSuccessMessage = 'Registration successful!';
  static const String projectCreationSuccessMessage = 'Project created successfully!';
  static const String proposalSubmissionSuccessMessage = 'Proposal submitted successfully!';
}
