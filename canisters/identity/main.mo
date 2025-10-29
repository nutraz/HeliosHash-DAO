
import HashMap "mo:base/HashMap";
import Time "mo:base/Time";
import Principal "mo:base/Principal";
import Nat "mo:base/Nat";
import Nat32 "mo:base/Nat32";
import Text "mo:base/Text";
import Float "mo:base/Float";
<<<<<<< HEAD
import Iter "mo:base/Iter";
import Array "mo:base/Array";
import Result "mo:base/Result";
import Option "mo:base/Option";

import HashMap "mo:base/HashMap";
import Time "mo:base/Time";
import Principal "mo:base/Principal";
import Nat "mo:base/Nat";
import Nat32 "mo:base/Nat32";
import Text "mo:base/Text";
import Float "mo:base/Float";
=======
import Int "mo:base/Int";
>>>>>>> audit-clean
import Iter "mo:base/Iter";
import Array "mo:base/Array";
import Result "mo:base/Result";
import Option "mo:base/Option";

persistent actor Identity {
    // Data Types
    public type Role = {
        #Community;   // Villagers, local residents
        #Investor;    // Token holders, financial participants
        #Authority;   // Gram Panchayat, government officials
        #Partner;     // NGOs, corporate partners
        #DAO;         // DAO governance participants
    };

    public type UserProfile = {
        principal: Principal;
        username: ?Text;
        email: ?Text;
        displayName: ?Text;
        bio: ?Text;
        avatar: ?Text;
        location: ?Text;
        website: ?Text;
        role: Role;
        secondaryRoles: [Role];  // Users can have multiple roles
        createdAt: Int;
        updatedAt: Int;
        isVerified: Bool;
        verificationLevel: VerificationLevel;
        aadhaarVerified: Bool;   // For KYC compliance
        owpBalance: Nat;         // Will sync with treasury
        prefersDuoValidation: Bool;  // NEW: Preference for paired validation
    };

    public type VerificationLevel = {
        #Basic;    // Just registered
        #Email;    // Email verified
        #KYC;      // KYC completed
        #Enhanced; // Full verification
    };

    public type AuthSession = {
        principal: Principal;
        sessionId: Text;
        createdAt: Int;
        expiresAt: Int;
        lastActivity: Int;
        isActive: Bool;
    };

    public type VerificationRequest = {
        id: Nat;
        principal: Principal;
        verificationType: VerificationLevel;
        documentHash: ?Text;
        status: VerificationStatus;
        requestedAt: Int;
        processedAt: ?Int;
        notes: ?Text;
    };

    public type VerificationStatus = {
        #Pending;
        #InReview;
        #Approved;
        #Rejected;
    };

    // Stable storage
    private var verificationCounter: Nat = 0;
    private var profileEntries: [(Principal, UserProfile)] = [];
    private var sessionEntries: [(Text, AuthSession)] = [];
    private var usernameEntries: [(Text, Principal)] = [];
    private var emailEntries: [(Text, Principal)] = [];
    private var verificationEntries: [(Nat, VerificationRequest)] = [];

    // In-memory maps (rebuilt on init/post-upgrade)
    transient var profiles = HashMap.HashMap<Principal, UserProfile>(10, Principal.equal, Principal.hash);
    transient var sessions = HashMap.HashMap<Text, AuthSession>(10, Text.equal, Text.hash);
    transient var usernameMap = HashMap.HashMap<Text, Principal>(10, Text.equal, Text.hash);
    transient var emailMap = HashMap.HashMap<Text, Principal>(10, Text.equal, Text.hash);
    transient var verifications = HashMap.HashMap<Nat, VerificationRequest>(10, Nat.equal, func (n: Nat): Nat32 { Nat32.fromNat(n % 100000) });
    // Treasury authorization (set-once)
    private var treasuryCanister : ?Principal = null;
<<<<<<< HEAD
=======
    
    // Internet Identity integration
    // Note: Using a placeholder principal for local development
    // In production, this should be set to the actual II canister principal
    private let ii_canister : Principal = Principal.fromText("aaaaa-aa");
>>>>>>> audit-clean

    // System functions for upgrades
    system func preupgrade() {
        profileEntries := Iter.toArray(profiles.entries());
        sessionEntries := Iter.toArray(sessions.entries());
        usernameEntries := Iter.toArray(usernameMap.entries());
        emailEntries := Iter.toArray(emailMap.entries());
        verificationEntries := Iter.toArray(verifications.entries());
    };

    system func postupgrade() {
        profiles := HashMap.fromIter<Principal, UserProfile>(profileEntries.vals(), profileEntries.size(), Principal.equal, Principal.hash);
        sessions := HashMap.fromIter<Text, AuthSession>(sessionEntries.vals(), sessionEntries.size(), Text.equal, Text.hash);
        usernameMap := HashMap.fromIter<Text, Principal>(usernameEntries.vals(), usernameEntries.size(), Text.equal, Text.hash);
        emailMap := HashMap.fromIter<Text, Principal>(emailEntries.vals(), emailEntries.size(), Text.equal, Text.hash);
        verifications := HashMap.fromIter<Nat, VerificationRequest>(verificationEntries.vals(), verificationEntries.size(), Nat.equal, func (n: Nat): Nat32 { Nat32.fromNat(n % 100000) });
    };

    // Helper functions
    func isValidEmail(email: Text): Bool {
        // Basic email validation
        Text.contains(email, #char '@') and Text.size(email) > 5
    };

    func generateSessionId(principal: Principal): Text {
        Principal.toText(principal) # "_" # Int.toText(Time.now())
    };

<<<<<<< HEAD
=======
    func isSessionValid(session: AuthSession): Bool {
        let now = Time.now();
        now <= session.expiresAt
    };

    func refreshSession(sessionId: Text): async Result.Result<AuthSession, Text> {
        switch (sessions.get(sessionId)) {
            case (null) { #err("Session not found") };
            case (?session) {
                if (not isSessionValid(session)) {
                    sessions.delete(sessionId);
                    #err("Session expired")
                } else {
                    let now = Time.now();
                    let updatedSession = {
                        session with
                        expiresAt = now + (24 * 60 * 60 * 1_000_000_000);
                        lastActivity = now
                    };
                    sessions.put(sessionId, updatedSession);
                    #ok(updatedSession)
                }
            };
        }
    };

>>>>>>> audit-clean
    func isUsernameAvailable(username: Text): Bool {
        Option.isNull(usernameMap.get(username))
    };

    func isEmailAvailable(email: Text): Bool {
        Option.isNull(emailMap.get(email))
    };

<<<<<<< HEAD
=======
    // NOTE: Internet Identity delegation verification is not implemented here.
    func verifyIIDelegate(_principal: Principal, _delegation: Text): async Bool {
        // Placeholder: always return true for now
        true
    };

>>>>>>> audit-clean
    // Public functions
    public shared ({ caller }) func createProfile(
        username: ?Text,
        email: ?Text,
        displayName: ?Text,
<<<<<<< HEAD
        role: Role
=======
        role: Role,
        ii_delegation: ?Text  // Internet Identity delegation proof
>>>>>>> audit-clean
    ): async Result.Result<UserProfile, Text> {
        if (Principal.isAnonymous(caller)) {
            return #err("Anonymous principal cannot create profile");
        };
<<<<<<< HEAD
=======
        // Verify Internet Identity delegation
        switch (ii_delegation) {
            case (null) { return #err("Internet Identity delegation required") };
            case (?delegation) {
                let isValid = await verifyIIDelegate(caller, delegation);
                if (not isValid) {
                    return #err("Invalid Internet Identity delegation");
                };
            };
        };
>>>>>>> audit-clean

        // Check if profile already exists
        switch (profiles.get(caller)) {
            case (?_existing) { return #err("Profile already exists") };
            case (null) {};
        };

        // Validate username if provided
        switch (username) {
            case (?name) {
                if (not isUsernameAvailable(name)) {
                    return #err("Username already taken");
                };
                if (Text.size(name) < 3 or Text.size(name) > 30) {
                    return #err("Username must be between 3 and 30 characters");
                };
            };
            case (null) {};
        };

        // Validate email if provided
        switch (email) {
            case (?emailAddr) {
                if (not isValidEmail(emailAddr)) {
                    return #err("Invalid email format");
                };
                if (not isEmailAvailable(emailAddr)) {
                    return #err("Email already registered");
                };
            };
            case (null) {};
        };

        let profile: UserProfile = {
            principal = caller;
            username = username;
            email = email;
            displayName = displayName;
            bio = null;
            avatar = null;
            location = null;
            website = null;
            role = role;
            secondaryRoles = [];
            createdAt = Time.now();
            updatedAt = Time.now();
            isVerified = false;
            verificationLevel = #Basic;
            aadhaarVerified = false;
            owpBalance = 0;
            prefersDuoValidation = false;  // Default to false
        };

        profiles.put(caller, profile);
        
        // Update username and email maps
        switch (username) {
            case (?name) { usernameMap.put(name, caller) };
            case (null) {};
        };
        
        switch (email) {
            case (?emailAddr) { emailMap.put(emailAddr, caller) };
            case (null) {};
        };

        #ok(profile)
    };

    public shared ({ caller }) func updateProfile(
        username: ?Text,
        email: ?Text,
        displayName: ?Text,
        bio: ?Text,
        avatar: ?Text,
        location: ?Text,
        website: ?Text
    ): async Result.Result<UserProfile, Text> {
        switch (profiles.get(caller)) {
            case (null) { return #err("Profile not found") };
            case (?profile) {
                // Clear old username/email mappings
                switch (profile.username) {
                    case (?oldName) { usernameMap.delete(oldName) };
                    case (null) {};
                };
                switch (profile.email) {
                    case (?oldEmail) { emailMap.delete(oldEmail) };
                    case (null) {};
                };

                // Validate new username
                switch (username) {
                    case (?name) {
                        if (not isUsernameAvailable(name)) {
                            return #err("Username already taken");
                        };
                    };
                    case (null) {};
                };

                // Validate new email
                switch (email) {
                    case (?emailAddr) {
                        if (not isValidEmail(emailAddr)) {
                            return #err("Invalid email format");
                        };
                        if (not isEmailAvailable(emailAddr)) {
                            return #err("Email already registered");
                        };
                    };
                    case (null) {};
                };

                let updatedProfile = {
                    profile with
                    username = username;
                    email = email;
                    displayName = displayName;
                    bio = bio;
                    avatar = avatar;
                    location = location;
                    website = website;
                    updatedAt = Time.now();
                };

                profiles.put(caller, updatedProfile);

                // Update new mappings
                switch (username) {
                    case (?name) { usernameMap.put(name, caller) };
                    case (null) {};
                };
                switch (email) {
                    case (?emailAddr) { emailMap.put(emailAddr, caller) };
                    case (null) {};
                };

                #ok(updatedProfile)
            };
        }
    };

    public query func getProfile(principal: Principal): async ?UserProfile {
        profiles.get(principal)
    };

    // One-time treasury canister setter
    public shared ({ caller }) func setTreasuryCanister(p : Principal) : async Result.Result<(), Text> {
        switch (treasuryCanister) {
            case (?_) { return #err("treasuryCanister already set") };
            case null { treasuryCanister := ?p; return #ok(()) };
        }
    };

    public query func getProfileByUsername(username: Text): async ?UserProfile {
        switch (usernameMap.get(username)) {
            case (?principal) { profiles.get(principal) };
            case (null) { null };
        }
    };

    public shared ({ caller }) func createSession(): async Result.Result<Text, Text> {
        if (Principal.isAnonymous(caller)) {
            return #err("Anonymous principal cannot create session");
        };

        let sessionId = generateSessionId(caller);
        let session: AuthSession = {
            principal = caller;
            sessionId = sessionId;
            createdAt = Time.now();
            expiresAt = Time.now() + (24 * 60 * 60 * 1_000_000_000); // 24 hours
            lastActivity = Time.now();
            isActive = true;
        };

        sessions.put(sessionId, session);
        #ok(sessionId)
    };

    public shared ({ caller }) func validateSession(sessionId: Text): async Result.Result<UserProfile, Text> {
        switch (sessions.get(sessionId)) {
            case (null) { #err("Session not found") };
            case (?session) {
                if (session.principal != caller) {
                    return #err("Session does not belong to caller");
                };
                if (not session.isActive) {
                    return #err("Session is inactive");
                };
                if (Time.now() > session.expiresAt) {
                    // Deactivate expired session
                    let expiredSession = { session with isActive = false };
                    sessions.put(sessionId, expiredSession);
                    return #err("Session expired");
                };

                // Update last activity
                let updatedSession = { session with lastActivity = Time.now() };
                sessions.put(sessionId, updatedSession);

                // Return user profile
                switch (profiles.get(caller)) {
                    case (?profile) { #ok(profile) };
                    case (null) { #err("Profile not found") };
                }
            };
        }
    };

    public shared ({ caller }) func logout(sessionId: Text): async Result.Result<Text, Text> {
        switch (sessions.get(sessionId)) {
            case (null) { #err("Session not found") };
            case (?session) {
                if (session.principal != caller) {
                    return #err("Session does not belong to caller");
                };
                
                let deactivatedSession = { session with isActive = false };
                sessions.put(sessionId, deactivatedSession);
                #ok("Logged out successfully")
            };
        }
    };

    public shared ({ caller }) func requestVerification(
        verificationType: VerificationLevel,
        documentHash: ?Text
    ): async Result.Result<Nat, Text> {
        switch (profiles.get(caller)) {
            case (null) { return #err("Profile not found") };
            case (?_profile) {
                verificationCounter += 1;
                let requestId = verificationCounter;

                let request: VerificationRequest = {
                    id = requestId;
                    principal = caller;
                    verificationType = verificationType;
                    documentHash = documentHash;
                    status = #Pending;
                    requestedAt = Time.now();
                    processedAt = null;
                    notes = null;
                };

                verifications.put(requestId, request);
                #ok(requestId)
            };
        }
    };

    public query func getVerificationRequest(requestId: Nat): async ?VerificationRequest {
        verifications.get(requestId)
    };

    public query ({ caller }) func getMyVerificationRequests(): async [VerificationRequest] {
        let allRequests = Iter.toArray(verifications.vals());
        Iter.toArray(Iter.filter<VerificationRequest>(allRequests.vals(), func(req: VerificationRequest): Bool {
            req.principal == caller
        }))
    };

    // Administrative functions (would need proper authorization in production)
    public shared ({ caller = _caller }) func processVerificationRequest(
        requestId: Nat,
        status: VerificationStatus,
        notes: ?Text
    ): async Result.Result<Text, Text> {
        switch (verifications.get(requestId)) {
            case (null) { #err("Verification request not found") };
            case (?request) {
                let updatedRequest = {
                    request with
                    status = status;
                    processedAt = ?Time.now();
                    notes = notes;
                };
                verifications.put(requestId, updatedRequest);

                // Update user verification level if approved
                if (status == #Approved) {
                    switch (profiles.get(request.principal)) {
                        case (?profile) {
                            let updatedProfile = {
                                profile with
                                verificationLevel = request.verificationType;
                                isVerified = true;
                                updatedAt = Time.now();
                            };
                            profiles.put(request.principal, updatedProfile);
                        };
                        case (null) {};
                    };
                };

                #ok("Verification request processed")
            };
        }
    };

    public query func getIdentityStats(): async {
        totalProfiles: Nat;
        verifiedProfiles: Nat;
        activeSessions: Nat;
        pendingVerifications: Nat;
    } {
        let allProfiles = Iter.toArray(profiles.vals());
        let verifiedCount = Iter.toArray(Iter.filter<UserProfile>(allProfiles.vals(), func(p: UserProfile): Bool {
            p.isVerified
        })).size();

        let allSessions = Iter.toArray(sessions.vals());
        let activeSessionCount = Iter.toArray(Iter.filter<AuthSession>(allSessions.vals(), func(s: AuthSession): Bool {
            s.isActive and Time.now() <= s.expiresAt
        })).size();

        let allVerifications = Iter.toArray(verifications.vals());
        let pendingCount = Iter.toArray(Iter.filter<VerificationRequest>(allVerifications.vals(), func(v: VerificationRequest): Bool {
            v.status == #Pending
        })).size();

        {
            totalProfiles = profiles.size();
            verifiedProfiles = verifiedCount;
            activeSessions = activeSessionCount;
            pendingVerifications = pendingCount;
        }
    };

    // === ROLE MANAGEMENT FUNCTIONS ===

    public shared ({ caller }) func updateUserRole(role: Role): async Result.Result<UserProfile, Text> {
        if (Principal.isAnonymous(caller)) {
            return #err("Anonymous principal cannot update role");
        };

        switch (profiles.get(caller)) {
            case (null) { return #err("Profile not found") };
            case (?profile) {
                let updatedProfile = {
                    profile with 
                    role = role;
                    updatedAt = Time.now();
                };
                profiles.put(caller, updatedProfile);
                #ok(updatedProfile)
            };
        }
    };

    public shared ({ caller }) func addSecondaryRole(role: Role): async Result.Result<UserProfile, Text> {
        if (Principal.isAnonymous(caller)) {
            return #err("Anonymous principal cannot add secondary role");
        };

        switch (profiles.get(caller)) {
            case (null) { return #err("Profile not found") };
            case (?profile) {
                // Check if role already exists in secondary roles
                let hasRole = Array.find<Role>(profile.secondaryRoles, func(r: Role): Bool { r == role });
                switch (hasRole) {
                    case (?_) { return #err("Role already assigned") };
                    case (null) {
                        let newSecondaryRoles = Array.append<Role>(profile.secondaryRoles, [role]);
                        let updatedProfile = {
                            profile with 
                            secondaryRoles = newSecondaryRoles;
                            updatedAt = Time.now();
                        };
                        profiles.put(caller, updatedProfile);
                        #ok(updatedProfile)
                    };
                }
            };
        }
    };

    public query func getUserRole(principal: Principal): async ?Role {
        switch (profiles.get(principal)) {
            case (null) { null };
            case (?profile) { ?profile.role };
        }
    };

    public query func getUserRoles(principal: Principal): async ?{primary: Role; secondary: [Role]} {
        switch (profiles.get(principal)) {
            case (null) { null };
            case (?profile) { ?{primary = profile.role; secondary = profile.secondaryRoles} };
        }
    };

    public query func hasRole(principal: Principal, role: Role): async Bool {
        switch (profiles.get(principal)) {
            case (null) { false };
            case (?profile) {
                if (profile.role == role) {
                    true
                } else {
                    Option.isSome(Array.find<Role>(profile.secondaryRoles, func(r: Role): Bool { r == role }))
                }
            };
        }
    };

    // Authority-specific functions
    public query func getAuthorities(): async [Principal] {
        let authoritiesList = Iter.toArray(Iter.filter<(Principal, UserProfile)>(profiles.entries(), func(entry): Bool {
            let (_, profile) = entry;
            profile.role == #Authority or Option.isSome(Array.find<Role>(profile.secondaryRoles, func(r: Role): Bool { r == #Authority }))
        }));
        Array.map<(Principal, UserProfile), Principal>(authoritiesList, func(entry): Principal {
            let (principal, _) = entry;
            principal
        })
    };

    // Update OWP balance (called only by treasury canister)
    public shared ({ caller }) func updateOWPBalance(userPrincipal: Principal, newBalance: Nat): async Result.Result<(), Text> {
        switch (treasuryCanister) {
            case null { return #err("treasuryCanister not configured") };
            case (?t) { if (t != caller) { return #err("unauthorized") } };
        };
        switch (profiles.get(userPrincipal)) {
            case (null) { #err("Profile not found") };
            case (?profile) {
                let updatedProfile = {
                    profile with 
                    owpBalance = newBalance;
                    updatedAt = Time.now();
                };
                profiles.put(userPrincipal, updatedProfile);
                #ok(())
            };
        }
    };

    // Aadhaar verification
    public shared ({ caller }) func setAadhaarVerified(): async Result.Result<UserProfile, Text> {
        if (Principal.isAnonymous(caller)) {
            return #err("Anonymous principal cannot update Aadhaar status");
        };

        switch (profiles.get(caller)) {
            case (null) { return #err("Profile not found") };
            case (?profile) {
                let updatedProfile = {
                    profile with 
                    aadhaarVerified = true;
                    verificationLevel = #KYC;  // Upgrade verification level
                    updatedAt = Time.now();
                };
                profiles.put(caller, updatedProfile);
                #ok(updatedProfile)
            };
        }
    };

    // Duo Validation Preferences
    public shared ({ caller }) func setDuoValidationPreference(prefersDuo: Bool): async Result.Result<UserProfile, Text> {
        if (Principal.isAnonymous(caller)) {
            return #err("Anonymous principal cannot update preferences");
        };

        switch (profiles.get(caller)) {
            case (null) { return #err("Profile not found") };
            case (?profile) {
                let updatedProfile = {
                    profile with 
                    prefersDuoValidation = prefersDuo;
                    updatedAt = Time.now();
                };
                profiles.put(caller, updatedProfile);
                #ok(updatedProfile)
            };
        }
    };

    public query func getDuoValidationPreference(userPrincipal: Principal): async Bool {
        switch (profiles.get(userPrincipal)) {
            case (null) { false };
            case (?profile) { profile.prefersDuoValidation };
        }
    };

    // Get users who prefer duo validation (for partner discovery)
    public query func getUsersWithDuoPreference(): async [Principal] {
        let duoUsers = profiles.entries()
            |> Iter.filter(_, func ((principal, profile): (Principal, UserProfile)): Bool {
                profile.prefersDuoValidation
            })
            |> Iter.map(_, func ((principal, profile): (Principal, UserProfile)): Principal { principal })
            |> Iter.toArray(_);
        duoUsers
    };
}
