// Minimal stub for ic_dart to satisfy analyzer during dev.
// Replace with the real package or remove the stub in production.

import 'dart:async';

/// Minimal dev-time stub for `ic_dart` used to satisfy analyzer in this repo.
/// This file intentionally contains no network functionality. Replace with
/// the real package or a proper mock before using in production.

class Principal {
  final String _text;
  Principal.fromText(this._text);
  String toText() => _text;
  @override
  String toString() => _text;
}

class Ed25519KeyIdentity {
  Ed25519KeyIdentity();

  /// Simulate async keypair generation used by calling sites.
  static Future<Ed25519KeyIdentity> generate() async => Ed25519KeyIdentity();

  /// Return a placeholder principal for the generated identity.
  Principal getPrincipal() => Principal.fromText('test-principal');
}

class CanisterActor {
  final String canisterId;
  final String? agentUrl;

  CanisterActor({required this.canisterId, this.agentUrl});

  /// Minimal query stub. Calling code expects a Future result.
  Future<dynamic> query(String method, List<dynamic> args) async {
    throw UnimplementedError('CanisterActor.query is a stub (method: $method)');
  }

  /// Minimal call/update stub.
  Future<dynamic> call(String method, List<dynamic> args) async {
    throw UnimplementedError('CanisterActor.call is a stub (method: $method)');
  }
}

/// Helper resembling `createActor<T>` patterns used in code. Returns a
/// `CanisterActor` stub so callers can be analyzed. In production this should
/// create a typed actor proxy.
T createActor<T>(dynamic canisterId, {String? agentUrl}) {
  // Unsafe cast for dev-time stub; production code should use a proper
  // typed actor proxy. This keeps the analyzer happy.
  return CanisterActor(canisterId: canisterId.toString(), agentUrl: agentUrl) as T;
}
