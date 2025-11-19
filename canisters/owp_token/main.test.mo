import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Nat "mo:base/Nat";
import OWPToken "canister:owp_token";
import Debug "mo:base/Debug";

persistent actor OWPTokenTest {

    // --- Test Principals ---
    // The owner will be this test canister itself, determined at runtime.
<<<<<<< HEAD
    let userA = Principal.fromText("6ac5f-zrbmg-nnoo6-5i66v-bmv57-smqm4-yjlgk-mwwkd-xbozy-3ofaz-sqe"); // nutrazz
=======
    let userA = Principal.fromText("TEST_PRINCIPAL_PLACEHOLDER"); // replaced real principal for tests
>>>>>>> audit-clean
    let userB = Principal.fromText("kb3zf-7ggcy-tbd2h-vgglj-4tfvk-mfvgv-6kmt3-dac6p-6cpqv-rrm6k-4qe"); // test_user_a

    // --- Test Utils ---
    private func printSection(name : Text) {
        Debug.print("\n--- " # name # " ---");
    };

    private func printTest(name : Text) {
        Debug.print("▶️ " # name);
    };

    private func assertTrue(cond : Bool, msg : Text) {
        if (not cond) {
            Debug.print("🛑 TEST FAILED: " # msg);
            assert(false);
        };
    };

    // --- Test Runner ---
    public func run() : async () {
        printSection("OWP Token Canister Tests");
        await setup();
        await testInitialState();
        await testTransfer();
        await testTransferInsufficientBalance();
        await testMint();
        await testBurn();
        printSection("OWP Token Canister Tests Complete");
    };

    private func setup() : async () {
        printTest("Initializing Canister");
        let owner = Principal.fromActor(OWPTokenTest);
        let initialSupply = 1_000_000;
        let result = await OWPToken.initialize(owner, initialSupply);
        switch (result) {
            case (#ok(true)) {};
            case (err) {
                assertTrue(false, "Initialization failed: " # debug_show(err));
            };
        };
    };

    private func testInitialState() : async () {
        printTest("Initial State Verification");
        let owner = Principal.fromActor(OWPTokenTest);
        let supply = await OWPToken.getTotalSupply();
        assertTrue(supply == 1_000_000, "Total supply should be 1,000,000");

        let ownerBalance = await OWPToken.getBalanceOf(owner);
        assertTrue(ownerBalance == 1_000_000, "Owner balance should be 1,000,000");

        let userABalance = await OWPToken.getBalanceOf(userA);
        assertTrue(userABalance == 0, "User A balance should be 0");
    };

    private func testTransfer() : async () {
        printTest("Token Transfer (from Owner)");
        let owner = Principal.fromActor(OWPTokenTest);
        let initialOwnerBalance = await OWPToken.getBalanceOf(owner);
        let initialUserBBalance = await OWPToken.getBalanceOf(userB);
        let amountToTransfer = 100;

        let result = await OWPToken.transfer(userB, amountToTransfer);
        switch (result) {
            case (#ok(_)) {};
            case (err) { assertTrue(false, "Transfer failed: " # debug_show(err)); };
        };

        let finalOwnerBalance = await OWPToken.getBalanceOf(owner);
        let finalUserBBalance = await OWPToken.getBalanceOf(userB);

        assertTrue(finalOwnerBalance == initialOwnerBalance - amountToTransfer, "Owner balance incorrect after transfer");
        assertTrue(finalUserBBalance == initialUserBBalance + amountToTransfer, "User B balance incorrect after transfer");
    };

    private func testTransferInsufficientBalance() : async () {
        printTest("Insufficient Balance Transfer");
        let owner = Principal.fromActor(OWPTokenTest);
        let ownerBalance = await OWPToken.getBalanceOf(owner);
        let amountToTransfer = ownerBalance + 1; // More than the owner has

        let transferResult = await OWPToken.transfer(userA, amountToTransfer);
        switch (transferResult) {
            case (#ok(_)) { assertTrue(false, "Transfer should have failed with insufficient balance"); };
            case (#err(e)) {
                assertTrue(debug_show(e) == debug_show(#InsufficientBalance), "Incorrect error type for insufficient balance transfer");
            };
        };
    };

    private func testMint() : async () {
        printTest("Minting Tokens (as Owner)");
        let initialSupply = await OWPToken.getTotalSupply();
        let initialBalance = await OWPToken.getBalanceOf(userB);

        let result = await OWPToken.mint(userB, 500);
        switch (result) {
            case (#ok(newBalance)) {
                assertTrue(newBalance == initialBalance + 500, "Mint did not return correct new balance");
            };
            case (err) {
                assertTrue(false, "Minting failed: " # debug_show(err));
            };
        };

        let finalSupply = await OWPToken.getTotalSupply();
        assertTrue(finalSupply == initialSupply + 500, "Total supply did not update after mint");

        let finalBalance = await OWPToken.getBalanceOf(userB);
        assertTrue(finalBalance == initialBalance + 500, "User B balance did not update after mint");
    };

    private func testBurn() : async () {
        printTest("Burning Tokens (as Owner)");
        let initialSupply = await OWPToken.getTotalSupply();
        let initialBalance = await OWPToken.getBalanceOf(userB);

        assertTrue(initialBalance >= 200, "User B must have enough tokens to burn");

        let result = await OWPToken.burn(userB, 200);
         switch (result) {
            case (#ok(newBalance)) {
                assertTrue(newBalance == initialBalance - 200, "Burn did not return correct new balance");
            };
            case (err) {
                assertTrue(false, "Burning failed: " # debug_show(err));
            };
        };

        let finalSupply = await OWPToken.getTotalSupply();
        assertTrue(finalSupply == initialSupply - 200, "Total supply did not update after burn");

        let finalBalance = await OWPToken.getBalanceOf(userB);
        assertTrue(finalBalance == initialBalance - 200, "User B balance did not update after burn");
    };
}