import Debug "mo:base/Debug";
import TestAssert "./test/assertion";
import Time "mo:base/Time";
import Principal "mo:base/Principal";
import Multisig "./multisig";

module TestSuite {
  public func runTestSuite() : async Bool {
    let unwrap = func(opt : ?Principal) : Principal {
      switch (opt) { case (?p) p; case null Debug.trap("invalid principal in test") };
    };

    let g1 = unwrap(Principal.fromText("aaaaa-aa"));
    let g2 = unwrap(Principal.fromText("bbbbb-bb"));
    let recipient = unwrap(Principal.fromText("ccccc-cc"));

    // Bootstrap guardians
    let _ = await Multisig.addGuardian(g1);
    let _ = await Multisig.addGuardian(g2);

    // Configure dummy treasury principal
    let t = unwrap(Principal.fromText("ddddd-dd"));
    let _ = await Multisig.setTreasuryCanister(t);

    // 1) simple propose -> approve -> execute (happy path)
    let p1 = await Multisig.proposeTransfer(recipient, 500, null);
    switch (p1) {
      case (#err(e)) { TestAssert.fail("proposeTransfer failed: " # e) };
      case (#ok(id)) {
        let _ = await Multisig.approveProposal(id);
        let _ = await Multisig.approveProposal(id);
        let _ = await Multisig.executeIntent(id);
        let approved = await Multisig.isApproved(id);
        if (not approved) { TestAssert.fail("proposal should be approved") };
      };
    };

    // 2) timelock: high amount should not execute immediately
    let p2 = await Multisig.proposeTransfer(recipient, 2_000_000, null);
    switch (p2) {
      case (#err(e)) { TestAssert.fail("big proposeTransfer failed: " # e) };
      case (#ok(bid)) {
        let _ = await Multisig.approveProposal(bid);
        let _ = await Multisig.approveProposal(bid);
        let execRes = await Multisig.executeIntent(bid);
        switch (execRes) {
          case (#ok(_)) { TestAssert.fail("timelock should have prevented execution") };
          case (#err(_)) { };
        };
        let intent = await Multisig.getExecutableIntent(bid);
        switch (intent) {
          case null { TestAssert.fail("intent missing for big proposal") };
          case (?obj) { if (obj.ready) { TestAssert.fail("big proposal should not be ready due to timelock") } };
        };
      };
    };

    // 3) pause/resume prevents execution
    let _ = await Multisig.pause();
    let p3 = await Multisig.proposeTransfer(recipient, 100, null);
    switch (p3) {
      case (#err(_)) { };
      case (#ok(pid)) {
        let _ = await Multisig.approveProposal(pid);
        let _ = await Multisig.approveProposal(pid);
        let r = await Multisig.executeIntent(pid);
        switch (r) {
          case (#ok(_)) { TestAssert.fail("execute should be blocked when paused") };
          case (#err(_)) { };
        };
      };
    };
    let _ = await Multisig.resume();

    true
  };
};


        // Timelock case
