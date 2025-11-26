import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Trie "mo:base/Trie";
import Nat "mo:base/Nat";
import Option "mo:base/Option";
import Hash "mo:base/Hash";

persistent actor OWPToken {

    // --- Types ---

    type Key = Trie.Key<Principal>;

    // --- State ---

    stable var ledger : Trie.Trie<Principal, Nat> = Trie.empty();
    stable var totalSupply: Nat = 0;
    stable var owner: Principal = Principal.fromText("aaaaa-aa"); // Placeholder
    stable var initialized: Bool = false;

    // --- Errors ---

    public type Error = {
        #InsufficientBalance;
        #Unauthorized;
        #AlreadyInitialized;
    };

    // --- Helpers ---

    private func principalKey(p: Principal) : Key {
        { hash = Principal.hash(p); key = p };
    };

    // --- Initialization ---

    public shared(msg) func initialize(initialOwner: Principal, initialSupply: Nat) : async Result.Result<Bool, Error> {
        if (initialized) {
            return #err(#AlreadyInitialized);
        };
        owner := initialOwner;
        let (newLedger, _) = Trie.put(ledger, principalKey(owner), Principal.equal, initialSupply);
        ledger := newLedger;
        totalSupply := initialSupply;
        initialized := true;
        return #ok(true);
    };

    // --- Queries ---

    public query func getBalanceOf(who: Principal): async Nat {
        return Option.get(Trie.get(ledger, principalKey(who), Principal.equal), 0);
    };

    public query func getTotalSupply(): async Nat {
        return totalSupply;
    };

    // --- Updates ---

    public shared({ caller }) func transfer(to: Principal, amount: Nat): async Result.Result<Nat, Error> {
        let from = caller;
        let fromBalance = Option.get(Trie.get(ledger, principalKey(from), Principal.equal), 0);

        if (fromBalance < amount) {
            return #err(#InsufficientBalance);
        };

        let toBalance = Option.get(Trie.get(ledger, principalKey(to), Principal.equal), 0);

        let (ledgerAfterFrom, _) = Trie.put(ledger, principalKey(from), Principal.equal, fromBalance - amount);
        let (ledgerAfterTo, _) = Trie.put(ledgerAfterFrom, principalKey(to), Principal.equal, toBalance + amount);
        ledger := ledgerAfterTo;

        return #ok(toBalance + amount);
    };

    public shared({ caller }) func mint(to: Principal, amount: Nat): async Result.Result<Nat, Error> {
        if (caller != owner) {
            return #err(#Unauthorized);
        };

        let toBalance = Option.get(Trie.get(ledger, principalKey(to), Principal.equal), 0);
        let (newLedger, _) = Trie.put(ledger, principalKey(to), Principal.equal, toBalance + amount);
        ledger := newLedger;
        totalSupply += amount;

        return #ok(toBalance + amount);
    };

    public shared({ caller }) func burn(from: Principal, amount: Nat): async Result.Result<Nat, Error> {
        if (caller != owner) {
            return #err(#Unauthorized);
        };

        let fromBalance = Option.get(Trie.get(ledger, principalKey(from), Principal.equal), 0);

        if (fromBalance < amount) {
            return #err(#InsufficientBalance);
        };

        let (newLedger, _) = Trie.put(ledger, principalKey(from), Principal.equal, fromBalance - amount);
        ledger := newLedger;
        totalSupply -= amount;

        return #ok(fromBalance - amount);
    };
}