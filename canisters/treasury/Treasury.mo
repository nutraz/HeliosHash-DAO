import Array "mo:base/Array";
import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Int "mo:base/Int";
import Nat "mo:base/Nat";

persistent actor Treasury {
  public type Transaction = {
    id : Nat;
    amount : Int;
    description : Text;
    timestamp : Int;
    from : Principal;
    to : Principal;
  };

  // C2: verified-deposit dedup/intent record, keyed by dedupId.
  public type DepositStatus = { #Pending; #Settled; #Failed };
  public type DepositRecord = {
    from : Principal;
    amount : Nat;
    status : DepositStatus;
    txIndex : ?Nat;   // unpopulated against the homegrown token (no tx index); Path B / real ICRC-2 fills this
    startedAt : Int;
  };

  // Minimal interface to the deployed HHU token (homegrown, not ICRC-2).
  type TokenApiResponse = { #Ok : Bool; #Err : Text };
  type Token = actor {
    transfer_from : (Principal, Principal, Nat) -> async TokenApiResponse;
    balance_of : (Principal) -> async Nat;
  };

  var balance : Int = 0;
  var transactions : [Transaction] = [];
  var nextTransactionId : Nat = 1;
  var owner : ?Principal = null;

  // C2 state. tokenBalance = sum of verified (token-backed) deposit credits,
  // kept separate from the legacy forgeable `balance`. deposits is the
  // stable-backed dedup/intent store keyed by dedupId.
  var ledger : ?Principal = null;
  var tokenBalance : Nat = 0;
  var deposits : [(Text, DepositRecord)] = [];

  public query func getBalance() : async Int {
    return balance;
  };

  public query func getTransactions() : async [Transaction] {
    return transactions;
  };

  // C2: verified deposit via token transfer_from. Credits tokenBalance ONLY
  // after the token confirms the pull. Never trusts a caller-reported amount,
  // and never writes the legacy forgeable `balance`.
  public shared ({ caller }) func deposit(amount : Nat, dedupId : Text) : async Text {
    if (Principal.isAnonymous(caller)) {
      return "Error: anonymous caller not permitted";
    };
    if (amount == 0) {
      return "Error: deposit amount must be positive";
    };
    let ledgerPrincipal = switch (ledger) {
      case (null) { return "Error: ledger not configured" };
      case (?l) { l };
    };

    // Idempotency / replay guard.
    switch (findDeposit(dedupId)) {
      case (?rec) {
        switch (rec.status) {
          case (#Settled) { return "Already settled (idempotent no-op)" };
          case (#Pending) { return "Error: deposit pending for this dedupId; manual reconciliation required (see reconcile)" };
          case (#Failed) { /* prior attempt failed before any token movement; allow retry */ };
        };
      };
      case (null) {};
    };

    // Record Pending BEFORE the await (state commits at the await point, so the
    // intent survives even if the continuation traps).
    putDeposit(dedupId, { from = caller; amount = amount; status = #Pending; txIndex = null; startedAt = Time.now() });

    let token : Token = actor (Principal.toText(ledgerPrincipal));
    let result = await token.transfer_from(caller, Principal.fromActor(Treasury), amount);

    switch (result) {
      case (#Ok(_)) {
        tokenBalance += amount;
        putDeposit(dedupId, { from = caller; amount = amount; status = #Settled; txIndex = null; startedAt = Time.now() });
        let transaction : Transaction = {
          id = nextTransactionId;
          amount = amount;
          description = "verified-deposit:" # dedupId;
          timestamp = Time.now();
          from = caller;
          to = Principal.fromActor(Treasury);
        };
        transactions := Array.append(transactions, [transaction]);
        nextTransactionId += 1;
        return "Deposit verified. tokenBalance: " # Nat.toText(tokenBalance);
      };
      case (#Err(e)) {
        putDeposit(dedupId, { from = caller; amount = amount; status = #Failed; txIndex = null; startedAt = Time.now() });
        return "Error: token transfer failed: " # e;
      };
    };
  };

  public shared ({ caller }) func withdraw(amount : Int, to : Principal, description : Text) : async Text {
    if (Principal.isAnonymous(caller)) {
      return "Error: anonymous caller not permitted";
    };

    switch (owner) {
      case (null) { return "Error: treasury owner not configured"; };
      case (?o) {
        if (caller != o) {
          return "Error: caller is not the treasury owner";
        };
      };
    };

    if (amount <= 0) {
      return "Error: Withdrawal amount must be positive";
    };

    if (balance < amount) {
      return "Error: Insufficient balance";
    };

    balance -= amount;
    
    let transaction : Transaction = {
      id = nextTransactionId;
      amount = -amount;
      description = description;
      timestamp = Time.now();
      from = Principal.fromActor(Treasury);
      to = to;
    };
    
    transactions := Array.append(transactions, [transaction]);
    nextTransactionId += 1;
    
    return "Withdrawal successful! New balance: " # Int.toText(balance);
  };

  // Bootstrap and rotate the treasury owner. Gated on IC controller authority
  // (ic0.is_controller): only a controller of this canister may set the owner,
  // so there is no "first caller wins" race. The configured owner is the only
  // principal permitted to withdraw.
  public shared ({ caller }) func setOwner(newOwner : Principal) : async Text {
    if (not Principal.isController(caller)) {
      return "Error: only a canister controller may set the owner";
    };
    if (Principal.isAnonymous(newOwner)) {
      return "Error: owner cannot be the anonymous principal";
    };
    owner := ?newOwner;
    return "Owner set";
  };

  // C2: configure the token/ledger canister. Controller-gated, mirroring setOwner.
  public shared ({ caller }) func setLedger(newLedger : Principal) : async Text {
    if (not Principal.isController(caller)) {
      return "Error: only a canister controller may set the ledger";
    };
    if (Principal.isAnonymous(newLedger)) {
      return "Error: ledger cannot be the anonymous principal";
    };
    ledger := ?newLedger;
    return "Ledger set";
  };

  public query func getTokenBalance() : async Nat {
    return tokenBalance;
  };

  public query func getDeposit(dedupId : Text) : async ?DepositRecord {
    return findDeposit(dedupId);
  };

  // C2: read-only reconciliation diagnostic (owner-gated). Compares the token's
  // view of the treasury's balance against credited tokenBalance, reporting the
  // delta only. It does NOT auto-credit (attributing an aggregate token balance
  // to a specific dedupId is unsafe). Stuck-Pending recovery and the
  // trap-after-effect window are deferred to Path B / real ICRC-2 migration.
  public shared ({ caller }) func reconcile() : async Text {
    switch (owner) {
      case (null) { return "Error: treasury owner not configured" };
      case (?o) { if (caller != o) { return "Error: caller is not the treasury owner" } };
    };
    let ledgerPrincipal = switch (ledger) {
      case (null) { return "Error: ledger not configured" };
      case (?l) { l };
    };
    let token : Token = actor (Principal.toText(ledgerPrincipal));
    let onToken = await token.balance_of(Principal.fromActor(Treasury));
    let delta : Int = if (onToken >= tokenBalance) onToken - tokenBalance else -(tokenBalance - onToken);
    return "onToken=" # Nat.toText(onToken) # " credited=" # Nat.toText(tokenBalance) # " delta=" # Int.toText(delta);
  };

  // C2 dedup-store helpers (stable assoc array; mirrors identity_canister's pattern).
  private func findDeposit(id : Text) : ?DepositRecord {
    for ((k, v) in deposits.vals()) { if (k == id) return ?v };
    null
  };

  private func putDeposit(id : Text, rec : DepositRecord) {
    switch (findDeposit(id)) {
      case (?_) {
        deposits := Array.map<(Text, DepositRecord), (Text, DepositRecord)>(
          deposits, func ((k, v) : (Text, DepositRecord)) : (Text, DepositRecord) {
            if (k == id) (k, rec) else (k, v)
          }
        );
      };
      case (null) { deposits := Array.append(deposits, [(id, rec)]) };
    };
  };

  public query func getVersion() : async Text {
    return "HeliosHash DAO Treasury v1.0";
  };
}
