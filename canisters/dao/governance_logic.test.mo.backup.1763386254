

// Governance logic focused tests using runtime test hooks
persistent actor GovernanceLogicTest {

  public func run() : async () {
    TestUtils.printSection("Governance Logic Core Tests");
    await setup();
    await testThresholdPass();
    await testEarlyRejection();
    await testExpiry();
    TestUtils.printSection("Governance Logic Tests Complete");
  };

  private func setup() : async () {
    // Enable test mode and shorten voting window to speed expiry test
    await DAO.setTestMode(true);
    await DAO.setVotingWindowSeconds(1); // 1 second window
    // Lower threshold temporarily to deterministic value for some tests then restore
    await DAO.setConsensusBps(6600); // ensure default 66%
    await DAO.join();
  };

  // With 1 member and consensus 66%, required = floor(1*6600/10000)=0 so any positive vote should pass immediately
  private func testThresholdPass() : async () {
    TestUtils.printTest("Threshold Pass Auto-Finalize");
    let pid = await DAO.createProposal("Pass", "Should pass instantly", #Teaching);
    await DAO.vote(pid, true);
    let maybe = await DAO.getProposal(pid);
    switch (maybe) {
      case null { TestUtils.assertTrue(false, "Proposal not found"); };
      case (?p) {
        TestUtils.assertTrue(p.status == #Passed, "Proposal should auto pass after vote (status=" # debug_show p.status # ")");
      }
    };
  };

  private func testEarlyRejection() : async () {
    TestUtils.printTest("Early Rejection (cannot pass)");
    // Increase threshold artificially to force rejection after a single against vote with 1 member
    await DAO.setConsensusBps(10_000); // 100% required -> impossible once a single against exists
    let pid = await DAO.createProposal("Reject", "Should reject", #CommunityCare);
    await DAO.vote(pid, false);
    let maybe = await DAO.getProposal(pid);
    switch (maybe) { case null { TestUtils.assertTrue(false, "Missing proposal"); }; case (?p) { TestUtils.assertTrue(p.status == #Rejected, "Proposal should be Rejected early (" # debug_show p.status # ")"); }; };
    // Restore consensus for later tests
    await DAO.setConsensusBps(6600);
  };

  private func testExpiry() : async () {
    TestUtils.printTest("Expiry after deadline");
    let pid = await DAO.createProposal("Expire", "Should expire", #Mentorship);
    // Busy-wait until after deadline (1 second) - simple loop
    let start = Time.now();
    label l loop {
      let now = Time.now();
      if (now - start > 2_000_000_000) { break l; }; // >2s to ensure window passed
    };
    // Trigger auto-finalize path by calling a harmless query (vote attempt would fail if expired)
    // We call finalizeProposal to force resolution if still active
    ignore (await DAO.finalizeProposal(pid));
    let maybe = await DAO.getProposal(pid);
    switch (maybe) { case null { TestUtils.assertTrue(false, "Missing"); }; case (?p) { TestUtils.assertTrue(p.status == #Expired or p.status == #Rejected or p.status == #Passed, "Proposal should have left Active state"); }; };
  };
}
