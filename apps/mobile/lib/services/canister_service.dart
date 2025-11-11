import 'package:http/http.dart' as http;
import 'dart:convert';

class CanisterService {
  final String _canisterId = "rrkah-fqaaa-aaaaa-aaaaq-cai"; // Replace with your canister ID
  final String _backendUrl = "https://your-nextjs-backend.com"; // Your backend URL

  // For read-only queries (direct to canister)
  Future<List<Map<String, dynamic>>> getProposals() async {
    try {
      final response = await http.post(
        Uri.parse('https://$_canisterId.ic0.app/getProposals'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({}), // Empty arguments
      );

      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        return data.map((item) => item as Map<String, dynamic>).toList();
      } else {
        throw Exception('Failed to load proposals: \\n${response.body}');
      }
    } catch (e) {
      print("Error fetching proposals: $e");
      throw Exception("Failed to fetch proposals");
    }
  }

  // For authenticated transactions (via backend)
  Future<String> createProposal({
    required String title,
    required String description,
    required int deadline,
    required String authToken,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$_backendUrl/api/createProposal'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $authToken',
        },
        body: jsonEncode({
          'title': title,
          'description': description,
          'deadline': deadline,
        }),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return data['proposalId'];
      } else {
        throw Exception('Failed to create proposal: \\n${response.body}');
      }
    } catch (e) {
      print("Error creating proposal: $e");
      throw Exception("Failed to create proposal");
    }
  }

  // Similar implementation for other transactions
  Future<void> voteProposal({
    required String proposalId,
    required bool voteYes,
    required String authToken,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$_backendUrl/api/voteProposal'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $authToken',
        },
        body: jsonEncode({
          'proposalId': proposalId,
          'vote': voteYes,
        }),
      );

      if (response.statusCode != 200) {
        throw Exception('Failed to vote: \\n${response.body}');
      }
    } catch (e) {
      print("Error voting: $e");
      throw Exception("Failed to vote");
    }
  }
}
