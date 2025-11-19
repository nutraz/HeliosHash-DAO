import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Time "mo:base/Time";
import Result "mo:base/Result";
import Option "mo:base/Option";

module AuthLib {
  // Types — simplified slice of the full design
  public type UserTier = {
    #unverified;
    #verified;
    #kycBasic;
    #kycAdvanced;
  };

  public type Verification = {
    email: Bool;
    phone: Bool;
    aadhaar: Bool;
    identity: Bool;
  };

  public type UserProfile = {
    principal: Principal;
    email: ?Text;
    phone: ?Text;
    authMethod: Text;
    tier: UserTier;
    verifications: Verification;
    createdAt: Int;
  };

  // Minimal registration function — returns a fully-formed UserProfile for Internet Identity
  public func registerInternetIdentity(caller : Principal) : Result.Result<UserProfile, Text> {
    if (Principal.isAnonymous(caller)) {
      return #err("Anonymous principal")
    } else {
      let profile : UserProfile = {
        principal = caller;
        email = null;
        phone = null;
        authMethod = "internet_identity";
        tier = #kycAdvanced;
        verifications = { email = false; phone = false; aadhaar = false; identity = true };
        createdAt = Time.now();
      };
      #ok(profile)
    };
  };

  // Small helper used by tests
  public func isKYCAdvanced(profile : UserProfile) : Bool {
    switch (profile.tier) {
      case (#kycAdvanced) true;
      case (_) false;
    }
  };
}
