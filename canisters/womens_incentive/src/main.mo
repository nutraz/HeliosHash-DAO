

actor WomensIncentiveCanister {
    
    // ===== TYPE DEFINITIONS =====
    
    public type Gender = {
        #Female;
        #Male;
        #NonBinary;
        #PreferNotToSay;
    };
    
    public type TierPurchase = {
        buyer: Principal;
        tier: Nat8;
        priceUSDC: Float;
        baseOWP: Nat;
        bonusOWP: Nat;
        totalOWP: Nat;
        gender: Gender;
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
    private var tierPurchases = HashMap.HashMap<Text, TierPurchase>(0, Text.equal, Text.hash);
    private var microGrants = HashMap.HashMap<Text, MicroGrant>(0, Text.equal, Text.hash);
    private var memberProfiles = HashMap.HashMap<Principal, MemberProfile>(0, Principal.equal, Principal.hash);
    
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
    
    // Called by bridge oracle when TierPurchased event detected on Polygon
    public shared(msg) func processTierPurchase(
        buyer: Principal,
        tier: Nat8,
        priceUSDC: Float,
        gender: Gender,
        polygonTxHash: Text,
        nftTokenId: Text
    ) : async Result.Result<BonusCalculation, Text> {
        
        // Validate tier
        if (tier < 1 or tier > 7) {
            return #err("Invalid tier: must be 1-7");
        };
        
        // Get base OWP for tier
        let baseOWP = switch (Array.find(tierOWP, func((t, owp): (Nat8, Nat)) : Bool { t == tier })) {
            case (?(_tier, owp)) { owp };
            case null { return #err("Tier configuration not found"); };
        };
        
        // Calculate bonus (20% for women, 0% for others)
        let bonusRate: Float = switch (gender) {
            case (#Female) { 0.20 }; // 20% bonus
            case (_) { 0.0 }; // No bonus for other genders
        };
        
        let bonusOWP = Float.toInt(Float.fromInt(baseOWP) * bonusRate);
        let totalOWP = baseOWP + bonusOWP;
        
        // Create purchase record
        let purchase: TierPurchase = {
            buyer = buyer;
            tier = tier;
            priceUSDC = priceUSDC;
            baseOWP = baseOWP;
            bonusOWP = bonusOWP;
            totalOWP = totalOWP;
            gender = gender;
            timestamp = Time.now();
            polygonTxHash = polygonTxHash;
            nftTokenId = nftTokenId;
        };
        
        // Store purchase
        tierPurchases.put(polygonTxHash, purchase);
        
        // Update member profile
        await updateMemberProfile(buyer, gender, totalOWP, bonusOWP, tier);
        
        // Update global stats
        totalBonusDistributed += bonusOWP;
        
        // Return calculation details
        let calculation: BonusCalculation = {
            tier = tier;
            baseOWP = baseOWP;
            bonusRate = bonusRate;
            bonusOWP = bonusOWP;
            totalOWP = totalOWP;
        };
        
        #ok(calculation)
    };
    
    // Update or create member profile
    private func updateMemberProfile(
        member: Principal,
        gender: Gender,
        totalOWP: Nat,
        bonusOWP: Nat,
        tier: Nat8
    ) : async () {
        let currentTime = Time.now();
        
        let existingProfile = memberProfiles.get(member);
        
        let updatedProfile: MemberProfile = switch (existingProfile) {
            case (?profile) {
                {
                    principal = member;
                    gender = ?gender;
                    totalOWP = profile.totalOWP + totalOWP;
                    bonusOWP = profile.bonusOWP + bonusOWP;
                    tiersPurchased = Array.append(profile.tiersPurchased, [tier]);
                    microGrantsApplied = profile.microGrantsApplied;
                    joinDate = profile.joinDate;
                    lastActivity = currentTime;
                    kycVerified = profile.kycVerified;
                }
            };
            case null {
                {
                    principal = member;
                    gender = ?gender;
                    totalOWP = totalOWP;
                    bonusOWP = bonusOWP;
                    tiersPurchased = [tier];
                    microGrantsApplied = [];
                    joinDate = currentTime;
                    lastActivity = currentTime;
                    kycVerified = false;
                }
            };
        };
        
        memberProfiles.put(member, updatedProfile);
    };
    
    // ===== MICRO-GRANT SYSTEM =====
    
    public shared(msg) func applyForMicroGrant(
        projectTitle: Text,
        description: Text,
        requestedAmount: Float,
        milestones: [Text] // Milestone descriptions
    ) : async Result.Result<Text, Text> {
        
        let applicant = msg.caller;
        
        // Check if member exists and is eligible
        let memberProfile = switch (memberProfiles.get(applicant)) {
            case (?profile) { profile };
            case null { return #err("Member not found. Please purchase a tier first."); };
        };
        
        // Check if member is female (required for micro-grants)
        let isEligible = switch (memberProfile.gender) {
            case (?#Female) { true };
            case (_) { false };
        };
        
        if (not isEligible) {
            return #err("Micro-grants are currently available only for women members.");
        };
        
        // Check if member has Tier 4+ (minimum $420 investment)
        let hasTier4Plus = Array.find(memberProfile.tiersPurchased, func(tier: Nat8) : Bool { tier <= 4 }) != null;
        
        if (not hasTier4Plus) {
            return #err("Micro-grants require Tier 4 or higher membership ($420+ investment).");
        };
        
        // Validate grant amount
        if (requestedAmount < 500.0 or requestedAmount > 2000.0) {
            return #err("Grant amount must be between $500 and $2,000 USDC.");
        };
        
        // Check budget availability
        if (microGrantSpent + requestedAmount > microGrantBudget) {
            return #err("Insufficient micro-grant budget remaining. Current available: $" # Float.toText(microGrantBudget - microGrantSpent));
        };
        
        // Create grant application
        let grantId = "GRANT_" # Nat.toText(nextGrantId);
        nextGrantId += 1;
        
        let grantMilestones: [Milestone] = Array.map(milestones, func(desc: Text) : Milestone {
            {
                description = desc;
                targetDate = Time.now() + (30 * 24 * 60 * 60 * 1000_000_000); // 30 days from now
                completed = false;
                completionDate = null;
                proofSubmitted = false;
            }
        });
        
        let grant: MicroGrant = {
            id = grantId;
            applicant = applicant;
            projectTitle = projectTitle;
            description = description;
            requestedAmount = requestedAmount;
            status = #Pending;
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
    
    public query func getBonus Calculation(tier: Nat8, gender: Gender) : async Result.Result<BonusCalculation, Text> {
        
        if (tier < 1 or tier > 7) {
            return #err("Invalid tier: must be 1-7");
        };
        
        let baseOWP = switch (Array.find(tierOWP, func((t, owp): (Nat8, Nat)) : Bool { t == tier })) {
            case (?(_tier, owp)) { owp };
            case null { return #err("Tier configuration not found"); };
        };
        
        let bonusRate: Float = switch (gender) {
            case (#Female) { 0.20 };
            case (_) { 0.0 };
        };
        
        let bonusOWP = Float.toInt(Float.fromInt(baseOWP) * bonusRate);
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
        Array.filter(Array.fromIter(allGrants), func(grant: MicroGrant) : Bool {
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