// canisters/dao/gender_incentives.mo
// Complete Gender Equity & Incentives Module for HeliosHash DAO
// Version: 1.0.0
// Author: HeliosHash Core Team
// License: Apache 2.0

<<<<<<< HEAD




actor GenderIncentives {
=======
import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Nat32 "mo:base/Nat32";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Option "mo:base/Option";
import Order "mo:base/Order";
import Float "mo:base/Float";
import Char "mo:base/Char";
import Buffer "mo:base/Buffer";

persistent actor GenderIncentives {
>>>>>>> audit-clean
    
    // ==================== TYPE DEFINITIONS ====================
    
    public type Gender = {
        #Male;
        #Female;
        #NonBinary;
        #PreferNotToSay;
    };
    
    public type IncentiveType = {
        #TokenBonus;
        #PriorityJob;
        #MicroGrant;
        #NFTBadge;
        #MentorshipStipend;
    };
    
    public type Member = {
        principal: Principal;
        name: Text;
        gender: Gender;
        joinDate: Time.Time;
        owpBalance: Nat;
        bonusEarned: Nat;
        mentorshipRole: ?MentorshipRole;
        nftBadges: [Text];
        jobApplications: [JobApplication];
        grantApplications: [GrantApplication];
    };
    
    public type MentorshipRole = {
        role: { #Mentor; #Mentee };
        monthlyStipend: Nat;
        startDate: Time.Time;
        mentorPrincipal: ?Principal;
        menteePrincipals: [Principal];
    };
    
    public type JobApplication = {
        jobId: Text;
        jobTitle: Text;
        appliedAt: Time.Time;
        status: JobStatus;
        priorityScore: Nat;
    };
    
    public type JobStatus = {
        #Pending;
        #Approved;
        #Rejected;
        #Completed;
    };
    
    public type GrantApplication = {
        grantId: Text;
        projectTitle: Text;
        description: Text;
        requestedAmount: Nat;
        appliedAt: Time.Time;
        status: GrantStatus;
        coSignerTrustee: ?Principal;
    };
    
    public type GrantStatus = {
        #Pending;
        #UnderReview;
        #Approved;
        #Disbursed;
        #Rejected;
    };
    
    public type NFTBadge = {
        badgeId: Text;
        name: Text;
        description: Text;
        imageUrl: Text;
        mintedAt: Time.Time;
    };
    
    public type IncentiveStats = {
        totalWomenMembers: Nat;
        totalBonusDistributed: Nat;
        totalGrantsDisbursed: Nat;
        totalNFTsMinted: Nat;
        averageParticipation: Float;
    };
    
    // ==================== STATE VARIABLES ====================
    
<<<<<<< HEAD
    private stable var memberEntries : [(Principal, Member)] = [];
    private var members = HashMap.HashMap<Principal, Member>(10, Principal.equal, Principal.hash);
    
    private stable var grantPoolBalance : Nat = 8_000_000; // $8K in micro-units
    private stable var bonusMultiplier : Float = 0.20; // 20% bonus
    
    private stable var nextGrantId : Nat = 1;
    private stable var nextJobId : Nat = 1;
    
    // NFT Badge templates
    private let nftBadgeTemplates : [NFTBadge] = [
=======
    stable var memberEntries : [(Principal, Member)] = [];
    transient var members = HashMap.HashMap<Principal, Member>(10, Principal.equal, Principal.hash);
    
    stable var grantPoolBalance : Nat = 8_000_000; // $8K in micro-units
    stable var bonusMultiplier : Float = 0.20; // 20% bonus
    
    stable var nextGrantId : Nat = 1;
    stable var nextJobId : Nat = 1;
    
    // NFT Badge templates
    transient let nftBadgeTemplates : [NFTBadge] = [
>>>>>>> audit-clean
        {
            badgeId = "solar_sister_001";
            name = "Solar Sister";
            description = "Pioneering women in renewable energy";
            imageUrl = "ipfs://Qm...SolarSister";
            mintedAt = Time.now();
        },
        {
            badgeId = "urgam_changemaker_001";
            name = "Urgam Changemaker";
            description = "Leading community transformation";
            imageUrl = "ipfs://Qm...Changemaker";
            mintedAt = Time.now();
        },
        {
            badgeId = "green_mentor_001";
            name = "Green Mentor";
            description = "Guiding others in sustainable practices";
            imageUrl = "ipfs://Qm...Mentor";
            mintedAt = Time.now();
        }
    ];
    
    // ==================== LIFECYCLE HOOKS ====================
    
    system func preupgrade() {
        memberEntries := Iter.toArray(members.entries());
    };
    
    system func postupgrade() {
        members := HashMap.fromIter<Principal, Member>(
            memberEntries.vals(),
            10,
            Principal.equal,
            Principal.hash
        );
    };
    
    // ==================== MEMBER MANAGEMENT ====================
    
    public shared(msg) func registerMember(
        name: Text,
        gender: Gender
    ) : async Result.Result<Member, Text> {
        
        let caller = msg.caller;
        
        // Check if already registered
        switch (members.get(caller)) {
            case (?existing) {
                return #err("Member already registered");
            };
            case null {};
        };
        
        let newMember : Member = {
            principal = caller;
            name = name;
            gender = gender;
            joinDate = Time.now();
            owpBalance = 0;
            bonusEarned = 0;
            mentorshipRole = null;
            nftBadges = [];
            jobApplications = [];
            grantApplications = [];
        };
        
        members.put(caller, newMember);
        
        // Auto-mint welcome NFT for women
        switch (gender) {
            case (#Female) {
                ignore await mintWelcomeBadge(caller);
            };
            case (_) {};
        };
        
        #ok(newMember)
    };
    
    public query func getMember(principal: Principal) : async ?Member {
        members.get(principal)
    };
    
    // ==================== TOKEN BONUS SYSTEM ====================
    
    public shared(msg) func mintOWPWithBonus(
        recipient: Principal,
        baseAmount: Nat
    ) : async Result.Result<Nat, Text> {
        
        switch (members.get(recipient)) {
            case null {
                return #err("Recipient not registered");
            };
            case (?member) {
                var totalAmount = baseAmount;
                var bonusAmount : Nat = 0;
                
                // Apply 20% bonus for women
                switch (member.gender) {
                    case (#Female) {
                        bonusAmount := Nat.div(baseAmount * 20, 100);
                        totalAmount := baseAmount + bonusAmount;
                    };
                    case (_) {};
                };
                
                // Update member balance
                let updatedMember : Member = {
                    principal = member.principal;
                    name = member.name;
                    gender = member.gender;
                    joinDate = member.joinDate;
                    owpBalance = member.owpBalance + totalAmount;
                    bonusEarned = member.bonusEarned + bonusAmount;
                    mentorshipRole = member.mentorshipRole;
                    nftBadges = member.nftBadges;
                    jobApplications = member.jobApplications;
                    grantApplications = member.grantApplications;
                };
                
                members.put(recipient, updatedMember);
                
                // TODO: Integrate with actual token ledger canister
                // await TokenLedger.mint(recipient, totalAmount);
                
                #ok(totalAmount)
            };
        };
    };
    
    // ==================== PRIORITY JOB ACCESS ====================
    
    public shared(msg) func applyForJob(
        jobId: Text,
        jobTitle: Text
    ) : async Result.Result<Text, Text> {
        
        let caller = msg.caller;
        
        switch (members.get(caller)) {
            case null {
                return #err("Member not registered");
            };
            case (?member) {
                // Calculate priority score
                var priorityScore : Nat = 50; // Base score
                
                switch (member.gender) {
                    case (#Female) {
                        priorityScore := priorityScore + 30; // +30 priority points
                    };
                    case (_) {};
                };
                
                // Additional points for mentorship
                switch (member.mentorshipRole) {
                    case (?role) {
                        priorityScore := priorityScore + 10;
                    };
                    case null {};
                };
                
                let application : JobApplication = {
                    jobId = jobId;
                    jobTitle = jobTitle;
                    appliedAt = Time.now();
                    status = #Pending;
                    priorityScore = priorityScore;
                };
                
                let applications = Array.append(member.jobApplications, [application]);
                
                let updatedMember : Member = {
                    principal = member.principal;
                    name = member.name;
                    gender = member.gender;
                    joinDate = member.joinDate;
                    owpBalance = member.owpBalance;
                    bonusEarned = member.bonusEarned;
                    mentorshipRole = member.mentorshipRole;
                    nftBadges = member.nftBadges;
                    jobApplications = applications;
                    grantApplications = member.grantApplications;
                };
                
                members.put(caller, updatedMember);
                
                #ok("Application submitted with priority score: " # Nat.toText(priorityScore))
            };
        };
    };
    
    public query func getJobApplicationsByPriority() : async [JobApplication] {
        var allApplications : [JobApplication] = [];
        
        for ((_, member) in members.entries()) {
            allApplications := Array.append(allApplications, member.jobApplications);
        };
        
        // Sort by priority score (descending)
        Array.sort(allApplications, func (a: JobApplication, b: JobApplication) : Order.Order {
            if (a.priorityScore > b.priorityScore) { #less }
            else if (a.priorityScore < b.priorityScore) { #greater }
            else { #equal }
        })
    };
    
    // ==================== MICRO-GRANT SYSTEM ====================
    
    public shared(msg) func applyForMicroGrant(
        projectTitle: Text,
        description: Text,
        requestedAmount: Nat,
        coSignerTrustee: ?Principal
    ) : async Result.Result<Text, Text> {
        
        let caller = msg.caller;
        
        // Validate amount range (₹5,000 - ₹20,000)
        if (requestedAmount < 5_000_000 or requestedAmount > 20_000_000) {
            return #err("Grant amount must be between ₹5,000 and ₹20,000");
        };
        
        switch (members.get(caller)) {
            case null {
                return #err("Member not registered");
            };
            case (?member) {
                // Only women can apply for micro-grants (as per policy)
                switch (member.gender) {
                    case (#Female) {
                        let grantId = "GRANT_" # Nat.toText(nextGrantId);
                        nextGrantId := nextGrantId + 1;
                        
                        let application : GrantApplication = {
                            grantId = grantId;
                            projectTitle = projectTitle;
                            description = description;
                            requestedAmount = requestedAmount;
                            appliedAt = Time.now();
                            status = #Pending;
                            coSignerTrustee = coSignerTrustee;
                        };
                        
                        let applications = Array.append(member.grantApplications, [application]);
                        
                        let updatedMember : Member = {
                            principal = member.principal;
                            name = member.name;
                            gender = member.gender;
                            joinDate = member.joinDate;
                            owpBalance = member.owpBalance;
                            bonusEarned = member.bonusEarned;
                            mentorshipRole = member.mentorshipRole;
                            nftBadges = member.nftBadges;
                            jobApplications = member.jobApplications;
                            grantApplications = applications;
                        };
                        
                        members.put(caller, updatedMember);
                        
                        #ok("Grant application submitted: " # grantId)
                    };
                    case (_) {
                        return #err("Micro-grants are currently available only for women members");
                    };
                };
            };
        };
    };
    
    public shared(msg) func approveGrant(
        applicantPrincipal: Principal,
        grantId: Text
    ) : async Result.Result<Text, Text> {
        
        // TODO: Add trustee authorization check
        // require msg.caller is trustee
        
        switch (members.get(applicantPrincipal)) {
            case null {
                return #err("Applicant not found");
            };
            case (?member) {
                // Find the grant application
                let grantOpt = Array.find<GrantApplication>(
                    member.grantApplications,
                    func(g: GrantApplication) : Bool { g.grantId == grantId }
                );
                
                switch (grantOpt) {
                    case null {
                        return #err("Grant application not found");
                    };
                    case (?grant) {
                        // Check grant pool balance
                        if (grantPoolBalance < grant.requestedAmount) {
                            return #err("Insufficient grant pool balance");
                        };
                        
                        // Update grant status
                        let updatedApplications = Array.map<GrantApplication, GrantApplication>(
                            member.grantApplications,
                            func(g: GrantApplication) : GrantApplication {
                                if (g.grantId == grantId) {
                                    {
                                        grantId = g.grantId;
                                        projectTitle = g.projectTitle;
                                        description = g.description;
                                        requestedAmount = g.requestedAmount;
                                        appliedAt = g.appliedAt;
                                        status = #Approved;
                                        coSignerTrustee = g.coSignerTrustee;
                                    }
                                } else { g }
                            }
                        );
                        
                        let updatedMember : Member = {
                            principal = member.principal;
                            name = member.name;
                            gender = member.gender;
                            joinDate = member.joinDate;
                            owpBalance = member.owpBalance;
                            bonusEarned = member.bonusEarned;
                            mentorshipRole = member.mentorshipRole;
                            nftBadges = member.nftBadges;
                            jobApplications = member.jobApplications;
                            grantApplications = updatedApplications;
                        };
                        
                        members.put(applicantPrincipal, updatedMember);
                        grantPoolBalance := grantPoolBalance - grant.requestedAmount;
                        
                        // TODO: Trigger actual token transfer
                        // await TokenLedger.transfer(applicantPrincipal, grant.requestedAmount);
                        
                        #ok("Grant approved and funds allocated")
                    };
                };
            };
        };
    };
    
    public query func getGrantPoolBalance() : async Nat {
        grantPoolBalance
    };
    
    public query func getPendingGrants() : async [GrantApplication] {
        var pendingGrants : [GrantApplication] = [];
        
        for ((_, member) in members.entries()) {
            for (grant in member.grantApplications.vals()) {
                switch (grant.status) {
                    case (#Pending or #UnderReview) {
                        pendingGrants := Array.append(pendingGrants, [grant]);
                    };
                    case (_) {};
                };
            };
        };
        
        pendingGrants
    };
    
    // ==================== NFT BADGE SYSTEM ====================
    
    private func mintWelcomeBadge(recipient: Principal) : async Result.Result<Text, Text> {
        switch (members.get(recipient)) {
            case null {
                return #err("Member not found");
            };
            case (?member) {
                let badge = nftBadgeTemplates[0]; // Solar Sister badge
                let badgeId = badge.badgeId # "_" # Principal.toText(recipient);
                
                let updatedBadges = Array.append(member.nftBadges, [badgeId]);
                
                let updatedMember : Member = {
                    principal = member.principal;
                    name = member.name;
                    gender = member.gender;
                    joinDate = member.joinDate;
                    owpBalance = member.owpBalance;
                    bonusEarned = member.bonusEarned;
                    mentorshipRole = member.mentorshipRole;
                    nftBadges = updatedBadges;
                    jobApplications = member.jobApplications;
                    grantApplications = member.grantApplications;
                };
                
                members.put(recipient, updatedMember);
                
                // TODO: Mint actual NFT on Polygon via bridge
                // await NFTBridge.mintOnPolygon(recipient, badgeId, badge.imageUrl);
                
                #ok(badgeId)
            };
        };
    };
    
    public shared(msg) func mintAchievementBadge(
        recipient: Principal,
        badgeType: Text
    ) : async Result.Result<Text, Text> {
        
        // TODO: Add authorization check (only trustees or system)
        
        switch (members.get(recipient)) {
            case null {
                return #err("Member not found");
            };
            case (?member) {
                let badgeTemplate = switch (badgeType) {
                    case ("changemaker") { nftBadgeTemplates[1] };
                    case ("mentor") { nftBadgeTemplates[2] };
                    case (_) { nftBadgeTemplates[0] };
                };
                
<<<<<<< HEAD
                let badgeId = badgeTemplate.badgeId # "_" # Principal.toText(recipient);
                
                // Check if already has this badge
                let hasBadge = Array.find<Text>(
                    member.nftBadges,
                    func(b: Text) : Bool { 
                        Text.contains(b, badgeTemplate.badgeId)
=======
                let prefix = badgeTemplate.badgeId # "_";
                let badgeId = prefix # Principal.toText(recipient);

                // Check if already has this badge
                let hasBadge = Array.find<Text>(
                    member.nftBadges,
                    func(b: Text) : Bool {
                        let bSize = Text.size(b);
                        let prefixSize = Text.size(prefix);
                        if (bSize < prefixSize) {
                            false
                        } else {
                            // Compare character by character for prefix match
                            let bChars = Iter.toArray(Text.toIter(b));
                            let prefixChars = Iter.toArray(Text.toIter(prefix));
                            var matches = true;
                            var i = 0;
                            while (i < prefixSize and matches) {
                                if (bChars[i] != prefixChars[i]) {
                                    matches := false;
                                };
                                i := i + 1;
                            };
                            matches
                        }
>>>>>>> audit-clean
                    }
                );
                
                switch (hasBadge) {
                    case (?_) {
                        return #err("Badge already minted for this member");
                    };
                    case null {};
                };
                
                let updatedBadges = Array.append(member.nftBadges, [badgeId]);
                
                let updatedMember : Member = {
                    principal = member.principal;
                    name = member.name;
                    gender = member.gender;
                    joinDate = member.joinDate;
                    owpBalance = member.owpBalance;
                    bonusEarned = member.bonusEarned;
                    mentorshipRole = member.mentorshipRole;
                    nftBadges = updatedBadges;
                    jobApplications = member.jobApplications;
                    grantApplications = member.grantApplications;
                };
                
                members.put(recipient, updatedMember);
                
                #ok(badgeId)
            };
        };
    };
    
    public query func getMemberBadges(principal: Principal) : async [Text] {
        switch (members.get(principal)) {
            case null { [] };
            case (?member) { member.nftBadges };
        };
    };
    
    // ==================== MENTORSHIP SYSTEM ====================
    
    public shared(msg) func registerAsMentor(
        monthlyStipend: Nat
    ) : async Result.Result<Text, Text> {
        
        let caller = msg.caller;
        
        switch (members.get(caller)) {
            case null {
                return #err("Member not registered");
            };
            case (?member) {
                // Only women with >6 months membership can be mentors
                let membershipDuration = Time.now() - member.joinDate;
                let sixMonthsNanos : Int = 6 * 30 * 24 * 60 * 60 * 1_000_000_000;
                
                switch (member.gender) {
                    case (#Female) {
                        if (membershipDuration < sixMonthsNanos) {
                            return #err("Minimum 6 months membership required for mentorship");
                        };
                        
                        let mentorshipRole : MentorshipRole = {
                            role = #Mentor;
                            monthlyStipend = monthlyStipend;
                            startDate = Time.now();
                            mentorPrincipal = null;
                            menteePrincipals = [];
                        };
                        
                        let updatedMember : Member = {
                            principal = member.principal;
                            name = member.name;
                            gender = member.gender;
                            joinDate = member.joinDate;
                            owpBalance = member.owpBalance;
                            bonusEarned = member.bonusEarned;
                            mentorshipRole = ?mentorshipRole;
                            nftBadges = member.nftBadges;
                            jobApplications = member.jobApplications;
                            grantApplications = member.grantApplications;
                        };
                        
                        members.put(caller, updatedMember);
                        
                        // Mint mentor badge
                        ignore await mintAchievementBadge(caller, "mentor");
                        
                        #ok("Registered as mentor with " # Nat.toText(monthlyStipend) # " OWP monthly stipend")
                    };
                    case (_) {
                        return #err("Mentorship program currently available for women members");
                    };
                };
            };
        };
    };
    
    public shared(msg) func assignMentee(
        menteePrincipal: Principal
    ) : async Result.Result<Text, Text> {
        
        let mentorPrincipal = msg.caller;
        
        // Get mentor
        switch (members.get(mentorPrincipal)) {
            case null {
                return #err("Mentor not found");
            };
            case (?mentor) {
                switch (mentor.mentorshipRole) {
                    case null {
                        return #err("Not registered as mentor");
                    };
                    case (?mentorRole) {
                        // Get mentee
                        switch (members.get(menteePrincipal)) {
                            case null {
                                return #err("Mentee not found");
                            };
                            case (?mentee) {
                                // Update mentor's mentee list
                                let updatedMentees = Array.append(
                                    mentorRole.menteePrincipals,
                                    [menteePrincipal]
                                );
                                
                                let updatedMentorRole : MentorshipRole = {
                                    role = mentorRole.role;
                                    monthlyStipend = mentorRole.monthlyStipend;
                                    startDate = mentorRole.startDate;
                                    mentorPrincipal = mentorRole.mentorPrincipal;
                                    menteePrincipals = updatedMentees;
                                };
                                
                                let updatedMentor : Member = {
                                    principal = mentor.principal;
                                    name = mentor.name;
                                    gender = mentor.gender;
                                    joinDate = mentor.joinDate;
                                    owpBalance = mentor.owpBalance;
                                    bonusEarned = mentor.bonusEarned;
                                    mentorshipRole = ?updatedMentorRole;
                                    nftBadges = mentor.nftBadges;
                                    jobApplications = mentor.jobApplications;
                                    grantApplications = mentor.grantApplications;
                                };
                                
                                members.put(mentorPrincipal, updatedMentor);
                                
                                // Update mentee's mentor reference
                                let menteeMentorRole : MentorshipRole = {
                                    role = #Mentee;
                                    monthlyStipend = 0;
                                    startDate = Time.now();
                                    mentorPrincipal = ?mentorPrincipal;
                                    menteePrincipals = [];
                                };
                                
                                let updatedMentee : Member = {
                                    principal = mentee.principal;
                                    name = mentee.name;
                                    gender = mentee.gender;
                                    joinDate = mentee.joinDate;
                                    owpBalance = mentee.owpBalance;
                                    bonusEarned = mentee.bonusEarned;
                                    mentorshipRole = ?menteeMentorRole;
                                    nftBadges = mentee.nftBadges;
                                    jobApplications = mentee.jobApplications;
                                    grantApplications = mentee.grantApplications;
                                };
                                
                                members.put(menteePrincipal, updatedMentee);
                                
                                #ok("Mentee assigned successfully")
                            };
                        };
                    };
                };
            };
        };
    };
    
    public shared func distributeMentorStipends() : async Nat {
        var totalDistributed : Nat = 0;
        
        for ((principal, member) in members.entries()) {
            switch (member.mentorshipRole) {
                case (?role) {
                    switch (role.role) {
                        case (#Mentor) {
                            // Distribute monthly stipend
                            ignore await mintOWPWithBonus(principal, role.monthlyStipend);
                            totalDistributed := totalDistributed + role.monthlyStipend;
                        };
                        case (_) {};
                    };
                };
                case null {};
            };
        };
        
        totalDistributed
    };
    
    // ==================== STATISTICS & ANALYTICS ====================
    
    public query func getIncentiveStats() : async IncentiveStats {
        var totalWomen : Nat = 0;
        var totalBonus : Nat = 0;
        var totalGrants : Nat = 0;
        var totalNFTs : Nat = 0;
        var totalMembers : Nat = 0;
        
        for ((_, member) in members.entries()) {
            totalMembers := totalMembers + 1;
            
            switch (member.gender) {
                case (#Female) {
                    totalWomen := totalWomen + 1;
                    totalBonus := totalBonus + member.bonusEarned;
                };
                case (_) {};
            };
            
            totalNFTs := totalNFTs + Array.size(member.nftBadges);
            
            for (grant in member.grantApplications.vals()) {
                switch (grant.status) {
                    case (#Disbursed) {
                        totalGrants := totalGrants + 1;
                    };
                    case (_) {};
                };
            };
        };
        
        let participationRate : Float = if (totalMembers > 0) {
            Float.fromInt(totalWomen) / Float.fromInt(totalMembers)
        } else { 0.0 };
        
        {
            totalWomenMembers = totalWomen;
            totalBonusDistributed = totalBonus;
            totalGrantsDisbursed = totalGrants;
            totalNFTsMinted = totalNFTs;
            averageParticipation = participationRate;
        }
    };
    
    public query func getWomenLeaderboard() : async [(Text, Nat)] {
        var leaderboard : [(Text, Nat)] = [];
        
        for ((_, member) in members.entries()) {
            switch (member.gender) {
                case (#Female) {
                    leaderboard := Array.append(
                        leaderboard,
                        [(member.name, member.owpBalance)]
                    );
                };
                case (_) {};
            };
        };
        
        // Sort by OWP balance
        Array.sort(leaderboard, func (a: (Text, Nat), b: (Text, Nat)) : Order.Order {
            if (a.1 > b.1) { #less }
            else if (a.1 < b.1) { #greater }
            else { #equal }
        })
    };
    
    // ==================== ADMIN FUNCTIONS ====================
    
    public shared(msg) func updateBonusMultiplier(newMultiplier: Float) : async Result.Result<Text, Text> {
        // TODO: Add admin authorization
        
        if (newMultiplier < 0.0 or newMultiplier > 1.0) {
            return #err("Multiplier must be between 0.0 and 1.0");
        };
        
        bonusMultiplier := newMultiplier;
        #ok("Bonus multiplier updated to " # Float.toText(newMultiplier))
    };
    
    public shared(msg) func addToGrantPool(amount: Nat) : async Result.Result<Text, Text> {
        // TODO: Add admin authorization
        
        grantPoolBalance := grantPoolBalance + amount;
        #ok("Grant pool increased by " # Nat.toText(amount))
    };
    
    // ==================== QUERY HELPERS ====================
    
    public query func getAllWomenMembers() : async [Member] {
        var womenMembers : [Member] = [];
        
        for ((_, member) in members.entries()) {
            switch (member.gender) {
                case (#Female) {
                    womenMembers := Array.append(womenMembers, [member]);
                };
                case (_) {};
            };
        };
        
        womenMembers
    };
    
    public query func getMemberCount() : async (Nat, Nat) {
        var totalCount : Nat = 0;
        var womenCount : Nat = 0;
        
        for ((_, member) in members.entries()) {
            totalCount := totalCount + 1;
            switch (member.gender) {
                case (#Female) { womenCount := womenCount + 1 };
                case (_) {};
            };
        };
        
        (totalCount, womenCount)
    };
}