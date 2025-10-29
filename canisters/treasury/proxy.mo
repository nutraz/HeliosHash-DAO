/**
 * Upgradeable Proxy Pattern for Treasury Canister
 *
 * This proxy canister provides upgradeable functionality while maintaining
 * governance control over upgrades. All upgrades must be approved through
 * the governance canister.
 */

import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Time "mo:base/Time";
import Debug "mo:base/Debug";

actor TreasuryProxy {
  // Proxy state
  private stable var implementation : ?Principal = null;
  private stable var governanceCanister : ?Principal = null;
  private stable var admin : ?Principal = null;
  private stable var locked : Bool = false;

  // Upgrade proposal tracking
  private stable var pendingUpgrade : ?{
    newImplementation : Principal;
    proposedAt : Int;
    executed : Bool;
  } = null;

  // Timelock for upgrades (7 days)
  private let UPGRADE_TIMELOCK_NS : Int = 7 * 24 * 60 * 60 * 1_000_000_000;

  // Initialize proxy
  public shared({ caller }) func initialize(
    initialImplementation : Principal,
    governance : Principal
  ) : async Result.Result<(), Text> {
    if (locked) { return #err("Proxy already initialized") };
    if (caller != admin) { return #err("Unauthorized") };

    implementation := ?initialImplementation;
    governanceCanister := ?governance;
    locked := true;
    #ok(())
  };

  // Propose upgrade - only governance can propose
  public shared({ caller }) func proposeUpgrade(
    newImplementation : Principal
  ) : async Result.Result<(), Text> {
    switch (governanceCanister) {
      case null { #err("Governance not configured") };
      case (?gov) {
        if (caller != gov) { return #err("Only governance can propose upgrades") };
        if (Option.isSome(pendingUpgrade)) { return #err("Upgrade already pending") };

        pendingUpgrade := ?{
          newImplementation;
          proposedAt = Time.now();
          executed = false;
        };
        #ok(())
      };
    };
  };

  // Execute upgrade after timelock
  public shared({ caller }) func executeUpgrade() : async Result.Result<(), Text> {
    switch (pendingUpgrade) {
      case null { #err("No pending upgrade") };
      case (?upgrade) {
        if (upgrade.executed) { return #err("Upgrade already executed") };

        let timeElapsed = Time.now() - upgrade.proposedAt;
        if (timeElapsed < UPGRADE_TIMELOCK_NS) {
          return #err("Timelock not expired");
        };

        // Only governance can execute
        switch (governanceCanister) {
          case null { #err("Governance not configured") };
          case (?gov) {
            if (caller != gov) { return #err("Only governance can execute upgrades") };

            implementation := ?upgrade.newImplementation;
            pendingUpgrade := ?{ upgrade with executed = true };
            #ok(())
          };
        };
      };
    };
  };

  // Delegate all other calls to implementation
  public shared({ caller }) func delegateCall(
    method : Text,
    args : Blob
  ) : async Result.Result<Blob, Text> {
    switch (implementation) {
      case null { #err("No implementation set") };
      case (?impl) {
        // Forward call to implementation canister
        // In Motoko, this would be implemented using inter-canister calls
        // This is a simplified representation
        type ImplementationActor = actor {
          receiveCall : (Principal, Text, Blob) -> async Result.Result<Blob, Text>
        };
        let implActor : ImplementationActor = actor (Principal.toText(impl));
        await implActor.receiveCall(caller, method, args)
      };
    };
  };

  // Query functions
  public query func getProxyStatus() : async {
    implementation : ?Principal;
    governanceCanister : ?Principal;
    pendingUpgrade : ?{
      newImplementation : Principal;
      proposedAt : Int;
      executed : Bool;
      timelockExpiry : Int;
    };
    locked : Bool;
  } {
    {
      implementation;
      governanceCanister;
      pendingUpgrade = switch (pendingUpgrade) {
        case null { null };
        case (?upgrade) {
          ?{
            newImplementation = upgrade.newImplementation;
            proposedAt = upgrade.proposedAt;
            executed = upgrade.executed;
            timelockExpiry = upgrade.proposedAt + UPGRADE_TIMELOCK_NS;
          }
        };
      };
      locked;
    }
  };

  // Set admin (one-time operation)
  public shared({ caller }) func setAdmin(newAdmin : Principal) : async Result.Result<(), Text> {
    if (Option.isSome(admin)) { return #err("Admin already set") };
    admin := ?newAdmin;
    #ok(())
  };
}
