import Time "mo:base/Time";
import Map "mo:base/HashMap";
import Iter "mo:base/Iter";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Option "mo:base/Option";
import Text "mo:base/Text";

persistent actor Identity {
    // Data Types
    public type UserProfile = {
        principal: Principal;
        username: ?Text;
        email: ?Text;
        displayName: ?Text;
        bio: ?Text;
        avatar: ?Text;
        location: ?Text;
        website: ?Text;
        createdAt: Int;
        updatedAt: Int;
        isVerified: Bool;
        verificationLevel: VerificationLevel;
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
    stable var verificationCounter: Nat = 0;
    stable var profileEntries: [(Principal, UserProfile)] = [];
    stable var sessionEntries: [(Text, AuthSession)] = [];
    stable var usernameEntries: [(Text, Principal)] = [];
    stable var emailEntries: [(Text, Principal)] = [];
    stable var verificationEntries: [(Nat, VerificationRequest)] = [];

    // In-memory maps
    var profiles = Map.fromIter<Principal, UserProfile>(profileEntries.vals(), 10, Principal.hash, Principal.equal);
    var sessions = Map.fromIter<Text, AuthSession>(sessionEntries.vals(), 10, Text.hash, Text.equal);
    var usernameMap = Map.fromIter<Text, Principal>(usernameEntries.vals(), 10, Text.hash, Text.equal);
    var emailMap = Map.fromIter<Text, Principal>(emailEntries.vals(), 10, Text.hash, Text.equal);
    var verifications = Map.fromIter<Nat, VerificationRequest>(verificationEntries.vals(), 10, func(n: Nat): Nat32 { Nat32.fromNat(n % 100000) }, func(a: Nat, b: Nat): Bool { a == b });

    // System functions for upgrades
    system func preupgrade() {
        profileEntries := Iter.toArray(profiles.entries());
        sessionEntries := Iter.toArray(sessions.entries());
        usernameEntries := Iter.toArray(usernameMap.entries());
        emailEntries := Iter.toArray(emailMap.entries());
        verificationEntries := Iter.toArray(verifications.entries());
    };

    system func postupgrade() {
        profileEntries := [];
        sessionEntries := [];
        usernameEntries := [];
        emailEntries := [];
        verificationEntries := [];
    };

    // Helper functions
    func isValidEmail(email: Text): Bool {
        // Basic email validation
        Text.contains(email, #char '@') and Text.size(email) > 5
    };

    func generateSessionId(principal: Principal): Text {
        Principal.toText(principal) # "_" # Int.toText(Time.now())
    };

    func isUsernameAvailable(username: Text): Bool {
        Option.isNull(usernameMap.get(username))
    };

    func isEmailAvailable(email: Text): Bool {
        Option.isNull(emailMap.get(email))
    };

    // Public functions
    public shared ({ caller }) func createProfile(
        username: ?Text,
        email: ?Text,
        displayName: ?Text
    ): async Result.Result<UserProfile, Text> {
        if (Principal.isAnonymous(caller)) {
            return #err("Anonymous principal cannot create profile");
        };

        // Check if profile already exists
        switch (profiles.get(caller)) {
            case (?existing) { return #err("Profile already exists") };
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
            createdAt = Time.now();
            updatedAt = Time.now();
            isVerified = false;
            verificationLevel = #Basic;
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
            case (?profile) {
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
    public shared ({ caller }) func processVerificationRequest(
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
}
