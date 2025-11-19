<<<<<<< HEAD
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
=======
persistent actor Auth {
  public query func version() : async Text {
    "Authentication v1.0";
  };
  
  public query func ping() : async Text {
    "pong";
  };
  
  public query func get_auth_methods() : async [Text] {
    ["Internet Identity", "NFID", "Stoic", "Plug"];
  };
};
>>>>>>> 954253d5 (docs: refresh and clean up all documentation (README, repo summary, critical fixes, copilot context))
