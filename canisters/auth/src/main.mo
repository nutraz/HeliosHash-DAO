import AuthLib "lib";
import Principal "mo:base/Principal";
import Result "mo:base/Result";

// Simple wrapper actor to expose AuthLib to the canister interface.
actor Auth {
  public shared (msg) func registerInternetIdentity() : async Result.Result<AuthLib.UserProfile, Text> {
    if (Principal.isAnonymous(msg.caller)) {
      return #err("Anonymous principal")
    } else {
      return AuthLib.registerInternetIdentity(msg.caller);
    };
  };

  // Expose a query method to get a mocked permissions object — for integration
  public query func ping() : async Text {
    "auth-ready"
  };
}
 954253d5 (docs: refresh and clean up all documentation (README, repo summary, critical fixes, copilot context))
