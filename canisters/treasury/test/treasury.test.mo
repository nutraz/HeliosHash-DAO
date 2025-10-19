// Treasury logic tests using pure ledger module


persistent actor TreasuryLedgerTest {
  func assertTrue(b : Bool, msg : Text) { if (not b) Debug.trap("Assertion failed: " # msg) };

  public func run() : async () {
    Debug.print("Starting pure ledger tests...");
    var state = Ledger.init();

    let p1 = Principal.fromText("rdmx6-jaaaa-aaaah-qdrpq-cai");
    let p2 = Principal.fromText("rrkah-fqaaa-aaaah-qdrpq-cai");

    // Mint
    switch (Ledger.mint(state, p1, 1_000_000_000)) { case (#ok id) { assertTrue(id == 0, "first tx id 0") }; case (#err e) Debug.trap(e); };
    switch (Ledger.mint(state, p2, 500_000_000)) { case (#ok id2) { assertTrue(id2 == 1, "second tx id 1") }; case (#err e) Debug.trap(e); };
    assertTrue(Ledger.balanceOf(state, p1) == 1_000_000_000, "p1 balance");
    assertTrue(Ledger.balanceOf(state, p2) == 500_000_000, "p2 balance");

    // Transfer p1 -> p2
    switch (Ledger.transfer(state, p1, p2, 200_000_000)) { case (#ok id3) { assertTrue(id3 == 2, "third tx id 2") }; case (#err e) Debug.trap(e); };
    assertTrue(Ledger.balanceOf(state, p1) == 800_000_000, "p1 after transfer");
    assertTrue(Ledger.balanceOf(state, p2) == 700_000_000, "p2 after transfer");

    // ICRC transfer (caller p2 -> p1)
    switch (Ledger.icrc1_transfer(state, p2, { from_subaccount = null; to = { owner = p1; subaccount = null }; amount = 100_000_000; fee = null; memo = null; created_at_time = null })) {
      case (#Ok _) {};
      case (#Err e) Debug.trap("icrc1 transfer failed")
    };
    assertTrue(Ledger.balanceOf(state, p1) == 900_000_000, "p1 after icrc1");
    assertTrue(Ledger.balanceOf(state, p2) == 600_000_000, "p2 after icrc1");

    // Burn from p1
    switch (Ledger.burn(state, p1, 100_000_000)) { case (#ok _) {}; case (#err e) Debug.trap(e); };
    assertTrue(Ledger.balanceOf(state, p1) == 800_000_000, "p1 after burn");
  assertTrue(state.totalSupply == 1_200_000_000, "supply after burn");

    // Edge cases
    switch (Ledger.transfer(state, p1, p1, 10)) { case (#ok _) Debug.trap("self transfer should fail"); case (#err _) {} };
    switch (Ledger.transfer(state, p1, p2, 9_999_999_999)) { case (#ok _) Debug.trap("insufficient should fail"); case (#err _) {} };
    switch (Ledger.mint(state, p1, 0)) { case (#ok _) Debug.trap("zero mint should fail"); case (#err _) {} };
    switch (Ledger.burn(state, p1, 0)) { case (#ok _) Debug.trap("zero burn should fail"); case (#err _) {} };
    switch (Ledger.icrc1_transfer(state, p2, { from_subaccount = null; to = { owner = p1; subaccount = null }; amount = 0; fee = null; memo = null; created_at_time = null })) { case (#Ok _) Debug.trap("zero icrc1 should fail"); case (#Err _) {} };

    // Meta
    let meta = Ledger.meta(state, "OWP", "One World Power", 8);
    assertTrue(meta.totalSupply == state.totalSupply, "meta supply matches");
    assertTrue(meta.txCount == 5, "expected 5 txs (2 mint,1 transfer,1 icrc transfer,1 burn)");

    Debug.print("Ledger tests successful ✅");
  };
}
