

import HashMap "mo:base/HashMap";
import Time "mo:base/Time";
import Float "mo:base/Float";
import Array "mo:base/Array";
import Result "mo:base/Result";
import Principal "mo:base/Principal";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Iter "mo:base/Iter";
import Int "mo:base/Int";
import Buffer "mo:base/Buffer";
actor WomensIncentiveCanister {

    // ===== TYPE DEFINITIONS =====

    // Import identity canister interface
    public type IdentityCanister = actor {
        getProfile : (Principal) -> async ?{
            principal: Principal;
            username: ?Text;
            email: ?Text;
            displayName: ?Text;
            bio: ?Text;
            avatar: ?Text;
            location: ?Text;
            website: ?Text;
            role: { #Community; #Investor; #Authority; #Partner; #DAO };
            secondaryRoles: [{ #Community; #Investor; #Authority; #Partner; #DAO }];
            createdAt: Int;
            updatedAt: Int;
            isVerified: Bool;
            verificationLevel: { #Basic; #Email; #KYC; #Enhanced };
            aadhaarVerified: Bool;
            owpBalance: Nat;
            prefersDuoValidation: Bool;
            isWoman: Bool;
        };
    };
    
    public type TierPurchase = {
        buyer: Principal;
        tier: Nat8;
        priceUSDC: Float;
        baseOWP: Nat;
        bonusOWP: Nat;
        totalOWP: Nat;
        isWoman: Bool;
        timestamp: Int;
        polygonTxHash: Text;
        nftTokenId: Text; // e.g., "URGAMU_T7_001"
    };
    
    public type MicroGrant = {
        id: Text;
        applicant: Principal;
        projectTitle: Text;
        description: Text;
        requestedAmount: Float; // USDC
        status: GrantStatus;
        tier: Nat8; // Must be Tier 4+ for eligibility
        applicationDate: Int;
        reviewDate: ?Int;
        disbursementDate: ?Int;
        completionDate: ?Int;
        milestones: [Milestone];
    };
    
    public type GrantStatus = {
        #Pending;
        #UnderReview;
        #Approved;
        #Rejected;
        #Disbursed;
        #Completed;
    };
    
    public type Milestone = {
        description: Text;
        targetDate: Int;
        completed: Bool;
        completionDate: ?Int;
        proofSubmitted: Bool;
    };
    
    public type BonusCalculation = {
        tier: Nat8;
        baseOWP: Nat;
        bonusRate: Float; // 0.20 for 20%
        bonusOWP: Nat;
        totalOWP: Nat;
    };
    
    // ===== STATE VARIABLES =====

    private stable var nextGrantId: Nat = 1;
    private stable var totalBonusDistributed: Nat = 0;
    private stable var totalGrantsApproved: Nat = 0;
    private stable var microGrantBudget: Float = 8000.0; // $8K from Phase 1
    private stable var microGrantSpent: Float = 0.0;

    // Identity canister reference (set during initialization)
    private var identityCanister : ?Principal = null;
    
    // Tier configuration (aligned with 1WP contract)
    private let tierPrices: [(Nat8, Float)] = [
        (1, 3162.50),
        (2, 1581.25),
        (3, 841.28),
        (4, 420.64),
        (5, 209.21),
        (6, 139.52),
        (7, 69.76)
    ];
    
    private let tierOWP: [(Nat8, Nat)] = [
        (1, 316250),
        (2, 158125),
        (3, 84128),
        (4, 42064),
        (5, 20921),
        (6, 13952),
        (7, 6976)
    ];
    
    // Storage maps
    private stable var tierPurchases = HashMap.HashMap<Text, TierPurchase>(0, Text.equal, Text.hash);
    private stable var microGrants = HashMap.HashMap<Text, MicroGrant>(0, Text.equal, Text.hash);
    private stable var memberProfiles = HashMap.HashMap<Principal, MemberProfile>(0, Principal.equal, Principal.hash);
    
    public type Gender = { #Male; #Female; #Other };

    public type MemberProfile = {
        principal: Principal;
        gender: ?Gender;
        totalOWP: Nat;
        bonusOWP: Nat;
        tiersPurchased: [Nat8];
        microGrantsApplied: [Text];
        joinDate: Int;
        lastActivity: Int;
        kycVerified: Bool;
    };
    
    // ===== CORE FUNCTIONS =====

    // Set identity canister reference (called during deployment)
    public shared(msg) func setIdentityCanister(identityPrincipal: Principal) : async Result.Result<(), Text> {
        // TODO: Add authorization check for admin/trustee
        identityCanister := ?identityPrincipal;
        #ok(())
    };

    // Helper function to query user gender from identity canister
    private func getUserIsWoman(buyer: Principal) : async Result.Result<Bool, Text> {
        switch (identityCanister) {
            case null { #err("Identity canister not configured") };
            case (?identityPrincipal) {
                let identityActor : IdentityCanister = actor(Principal.toText(identityPrincipal));
                switch (await identityActor.getProfile(buyer)) {
                    case null { #err("User profile not found in identity canister") };
                    case (?profile) { #ok(profile.isWoman) };
                };
            };
        };
    };

    // Called by bridge oracle when TierPurchased event detected on Polygon
    public shared(msg) func processTierPurchase(
        buyer: Principal,
        tier: Nat8,
        priceUSDC: Float,
        polygonTxHash: Text,
        nftTokenId: Text
    ) : async Result.Result<BonusCalculation, Text> {
        
        // Validate tier
        if (tier < 1 or tier > 7) {
            return #err("Invalid tier: must be 1-7");
        };

        // Query user gender from identity canister
        let isWomanResult = await getUserIsWoman(buyer);
        let isWoman = switch (isWomanResult) {
            case (#ok(isWoman)) { isWoman };
            case (#err(error)) { return #err("Failed to get user gender: " # error); };
        };

        // Get base OWP for tier
        let baseOWP = switch (Array.find(tierOWP, func((t, owp): (Nat8, Nat)) : Bool { t == tier })) {
            case (?(_tier, owp)) { owp };
            case null { return #err("Tier OWP not found"); };
        };

        // ...continue with the rest of processTierPurchase logic here...

                // Women's incentive multiplier
                public func getGenderMultiplier(userId: Principal): async Result.Result<Float, Text> {
                    // In a real implementation, this would check the identity canister
                    // For now, return a default multiplier
                    #ok(1.2); // 20% bonus for women
                };

                // Tier management
                public func purchaseTier(tierId: Text, amount: Nat, purchaser: Principal): async Result.Result<Text, Text> {
                    let purchaseId = Nat.toText(nextTierId);
                    nextTierId += 1;
    
                    let purchase: TierPurchase = {
                        tierId = tierId;
                        amount = amount;
                        timestamp = 0; // Should use Time.now() in real implementation
                        purchaser = purchaser;
                    };
    
                    tierPurchases.put(purchaseId, purchase);
                    #ok(purchaseId);
                };

                // Micro-grant management
                public func createMicroGrant(recipient: Principal, amount: Nat, purpose: Text): async Result.Result<Text, Text> {
                    let grantId = Nat.toText(nextGrantId);
                    nextGrantId += 1;
    
                    let grant: MicroGrant = {
                        grantId = grantId;
                        recipient = recipient;
                        amount = amount;
                        purpose = purpose;
                        timestamp = 0; // Should use Time.now() in real implementation
                        status = "pending";
                    };
    
                    microGrants.put(grantId, grant);
                    #ok(grantId);
                };

                // Member profile management
                public func createMemberProfile(principal: Principal): async Result.Result<Text, Text> {
                    let profile: MemberProfile = {
                        principal = principal;
                        joinDate = 0; // Should use Time.now() in real implementation
                        totalContributions = 0;
                        tierLevel = "basic";
                        isActive = true;
                    };
    
                    memberProfiles.put(principal, profile);
                    #ok("Profile created successfully");
                };

                // Query functions
                public query func getTierPurchase(purchaseId: Text): async ?TierPurchase {
                    tierPurchases.get(purchaseId);
                };

                public query func getMicroGrant(grantId: Text): async ?MicroGrant {
                    microGrants.get(grantId);
                };

                public query func getMemberProfile(principal: Principal): async ?MemberProfile {
                    memberProfiles.get(principal);
                };

                public query func getAllActiveMembers(): async [MemberProfile] {
                    let activeMembers = Buffer.Buffer<MemberProfile>(0);
                    for (profile in memberProfiles.vals()) {
                        if (profile.isActive) {
                            activeMembers.add(profile);
                        }
                    };
                    Buffer.toArray(activeMembers);
                };
            };
            tier = Array.foldLeft(memberProfile.tiersPurchased, 7:Nat8, func(acc: Nat8, tier: Nat8) : Nat8 {
                if (tier < acc) tier else acc // Get highest tier (lowest number)
            });
            applicationDate = Time.now();
            reviewDate = null;
            disbursementDate = null;
            completionDate = null;
            milestones = grantMilestones;
        };
        
        microGrants.put(grantId, grant);
        
        // Update member profile
        let updatedProfile = {
            memberProfile with
            microGrantsApplied = Array.append(memberProfile.microGrantsApplied, [grantId]);
            lastActivity = Time.now();
        };
        memberProfiles.put(applicant, updatedProfile);
        
        #ok(grantId)
    };
    
    // Trustee function to review grants
    public shared(msg) func reviewMicroGrant(
        grantId: Text,
        approved: Bool,
        reviewComments: Text
    ) : async Result.Result<Text, Text> {
        
        // TODO: Add trustee permission check
        // For now, assume caller is authorized trustee
        
        let grant = switch (microGrants.get(grantId)) {
            case (?g) { g };
            case null { return #err("Grant not found: " # grantId); };
        };
        
        if (grant.status != #Pending) {
            return #err("Grant is not in pending status");
        };
        
        let newStatus = if (approved) { #Approved } else { #Rejected };
        
        let updatedGrant = {
            grant with
            status = newStatus;
            reviewDate = ?Time.now();
        };
        
        microGrants.put(grantId, updatedGrant);
        
        if (approved) {
            totalGrantsApproved += 1;
            microGrantSpent += grant.requestedAmount;
        };
        
        let statusText = if (approved) { "approved" } else { "rejected" };
        #ok("Grant " # grantId # " has been " # statusText)
    };
    
    // ===== QUERY FUNCTIONS =====
    
    public func getBonusCalculation(tier: Nat8, userPrincipal: Principal) : async Result.Result<BonusCalculation, Text> {

        if (tier < 1 or tier > 7) {
            return #err("Invalid tier: must be 1-7");
        };

        // Query user gender from identity canister
        let isWomanResult = await getUserIsWoman(userPrincipal);
        let isWoman = switch (isWomanResult) {
            case (#ok(isWoman)) { isWoman };
            case (#err(error)) { return #err("Failed to get user gender: " # error); };
        };

        let baseOWP = switch (Array.find(tierOWP, func((t, owp): (Nat8, Nat)) : Bool { t == tier })) {
            case (?(_tier, owp)) { owp };
            case null { return #err("Tier configuration not found"); };
        };

        let bonusRate: Float = if (isWoman) { 0.20 } else { 0.0 }; // 20% bonus for women

        let bonusOWP = Int.abs(Float.toInt(Float.fromInt(baseOWP) * bonusRate));
        let totalOWP = baseOWP + bonusOWP;

        #ok({
            tier = tier;
            baseOWP = baseOWP;
            bonusRate = bonusRate;
            bonusOWP = bonusOWP;
            totalOWP = totalOWP;
        })
    };
    
    public query func getMemberProfile(member: Principal) : async ?MemberProfile {
        memberProfiles.get(member)
    };
    
    public query func getTierPurchase(txHash: Text) : async ?TierPurchase {
        tierPurchases.get(txHash)
    };
    
    public query func getMicroGrant(grantId: Text) : async ?MicroGrant {
        microGrants.get(grantId)
    };
    
    public query func getSystemStats() : async {
        totalMembers: Nat;
        womenMembers: Nat;
        totalBonusDistributed: Nat;
        totalGrantsApproved: Nat;
        microGrantBudgetUsed: Float;
        microGrantBudgetRemaining: Float;
    } {
        let allProfiles = memberProfiles.vals();
        var totalMembers: Nat = 0;
        var womenMembers: Nat = 0;
        
        for (profile in allProfiles) {
            totalMembers += 1;
            switch (profile.gender) {
                case (?#Female) { womenMembers += 1; };
                case (_) {};
            };
        };
        
        {
            totalMembers = totalMembers;
            womenMembers = womenMembers;
            totalBonusDistributed = totalBonusDistributed;
            totalGrantsApproved = totalGrantsApproved;
            microGrantBudgetUsed = microGrantSpent;
            microGrantBudgetRemaining = microGrantBudget - microGrantSpent;
        }
    };
    
    public query func getPendingGrants() : async [MicroGrant] {
        let allGrants = microGrants.vals();
        Array.filter(Iter.toArray(allGrants), func(grant: MicroGrant) : Bool {
            grant.status == #Pending
        })
    };
    
    // ===== ADMIN FUNCTIONS =====
    
    // Emergency pause function (for trustees)
    private stable var systemPaused: Bool = false;
    
    public shared(msg) func pauseSystem() : async Result.Result<Text, Text> {
        // TODO: Add trustee permission check
        systemPaused := true;
        #ok("System paused successfully")
    };
    
    public shared(msg) func resumeSystem() : async Result.Result<Text, Text> {
        // TODO: Add trustee permission check
        systemPaused := false;
        #ok("System resumed successfully")
    };
    
    // Get system status
    public query func getSystemStatus() : async {
        paused: Bool;
        version: Text;
        lastUpdate: Int;
    } {
        {
            paused = systemPaused;
            version = "1.0.0";
            lastUpdate = Time.now();
        }
    };
    
    // ===== UPGRADE HOOKS =====
    
    system func preupgrade() {
        // State is already stable, no action needed
    };
    
    system func postupgrade() {
        // Reinitialize hashmaps after upgrade
        // State is preserved in stable variables
    };
}