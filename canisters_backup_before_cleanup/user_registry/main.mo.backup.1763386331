import Time "mo:base/Time";
import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Nat32 "mo:base/Nat32";
import Text "mo:base/Text";
import Array "mo:base/Array";
import Option "mo:base/Option";
import Result "mo:base/Result";

/// User Registry Canister
/// Handles user registration, KYC verification, and profile management

actor UserRegistry {
  
  // ============================================================================
  // TYPE DEFINITIONS
  // ============================================================================
  
  /// KYC Status enumeration
  public type KYCStatus = {
    #NotVerified;
    #Pending;
    #Verified;
    #Rejected;
  };

  /// Government ID Type
  public type GovernmentIdType = {
    #Aadhaar;
    #PAN;
    #DrivingLicense;
    #Passport;
    #VoterID;
    #Other : Text;
  };

  /// User Profile with complete information
  public type UserProfile = {
    id: Principal;
    email: Text;
    name: Text;
    walletAddress: ?Text;
    role: Text;
    kycStatus: KYCStatus;
    kycVerifiedAt: ?Time.Time;
    kycProvider: ?Text;
    kycReferenceId: ?Text;
    phoneNumber: ?Text;
    country: ?Text;
    state: ?Text;
    city: ?Text;
    postalCode: ?Text;
    dateOfBirth: ?Time.Time;
    governmentId: ?Text;
    governmentIdType: ?GovernmentIdType;
    createdAt: Time.Time;
    updatedAt: Time.Time;
  };

  /// User Registration Request
  public type RegisterRequest = {
    email: Text;
    name: Text;
    walletAddress: ?Text;
  };

  /// KYC Verification Request
  public type KYCVerificationRequest = {
    provider: Text;
    documentType: GovernmentIdType;
    documentNumber: Text;
    dateOfBirth: Time.Time;
    country: Text;
    phoneNumber: ?Text;
  };

  /// API Response wrapper
  public type ApiResponse<T> = {
    #Ok : T;
    #Err : Text;
  };

  // ============================================================================
  // STATE
  // ============================================================================

  private var users = HashMap.HashMap<Principal, UserProfile>(1, Principal.equal, Principal.hash);
  private var emailIndex = HashMap.HashMap<Text, Principal>(1, Text.equal, Text.hash);
  private var totalUsers : Nat32 = 0;
  private var lastUpdated : Time.Time = Time.now();

  // ============================================================================
  // PUBLIC FUNCTIONS
  // ============================================================================

  /// Register a new user
  public shared(msg) func register_user(request : RegisterRequest) : async ApiResponse<UserProfile> {
    let caller = msg.caller;

    // Validate input
    if (Text.size(request.email) == 0 or Text.size(request.name) == 0) {
      return #Err("Email and name are required");
    };

    // Check if user already exists
    switch (users.get(caller)) {
      case (?existing) {
        return #Err("User already registered");
      };
      case (null) {
        // Proceed with registration
      };
    };

    // Check if email already registered
    switch (emailIndex.get(request.email)) {
      case (?_) {
        return #Err("Email already in use");
      };
      case (null) {
        // Proceed
      };
    };

    let now = Time.now();
    let newUser : UserProfile = {
      id = caller;
      email = request.email;
      name = request.name;
      walletAddress = request.walletAddress;
      role = "member";
      kycStatus = #NotVerified;
      kycVerifiedAt = null;
      kycProvider = null;
      kycReferenceId = null;
      phoneNumber = null;
      country = null;
      state = null;
      city = null;
      postalCode = null;
      dateOfBirth = null;
      governmentId = null;
      governmentIdType = null;
      createdAt = now;
      updatedAt = now;
    };

    users.put(caller, newUser);
    emailIndex.put(request.email, caller);
    totalUsers += 1;
    lastUpdated := now;

    #Ok(newUser)
  };

  /// Get user profile by principal
  public query func get_user_profile(userId : Principal) : async ApiResponse<UserProfile> {
    switch (users.get(userId)) {
      case (?profile) {
        #Ok(profile)
      };
      case (null) {
        #Err("User not found")
      };
    }
  };

  /// Update user profile
  public shared(msg) func update_user_profile(
    updates : {
      name: ?Text;
      phoneNumber: ?Text;
      country: ?Text;
      state: ?Text;
      city: ?Text;
      postalCode: ?Text;
    }
  ) : async ApiResponse<UserProfile> {
    let caller = msg.caller;

    switch (users.get(caller)) {
      case (?profile) {
        let updated : UserProfile = {
          id = profile.id;
          email = profile.email;
          name = Option.get(updates.name, profile.name);
          walletAddress = profile.walletAddress;
          role = profile.role;
          kycStatus = profile.kycStatus;
          kycVerifiedAt = profile.kycVerifiedAt;
          kycProvider = profile.kycProvider;
          kycReferenceId = profile.kycReferenceId;
          phoneNumber = Option.get(updates.phoneNumber, profile.phoneNumber);
          country = Option.get(updates.country, profile.country);
          state = Option.get(updates.state, profile.state);
          city = Option.get(updates.city, profile.city);
          postalCode = Option.get(updates.postalCode, profile.postalCode);
          dateOfBirth = profile.dateOfBirth;
          governmentId = profile.governmentId;
          governmentIdType = profile.governmentIdType;
          createdAt = profile.createdAt;
          updatedAt = Time.now();
        };

        users.put(caller, updated);
        lastUpdated := Time.now();
        #Ok(updated)
      };
      case (null) {
        #Err("User not found")
      };
    }
  };

  /// Submit KYC verification
  public shared(msg) func submit_kyc_verification(request : KYCVerificationRequest) : async ApiResponse<UserProfile> {
    let caller = msg.caller;

    switch (users.get(caller)) {
      case (?profile) {
        // Generate reference ID (simplified - in production use external KYC service)
        let referenceId = "kyc_" # Principal.toText(caller) # "_" # Int.toText(Time.now());

        let updated : UserProfile = {
          id = profile.id;
          email = profile.email;
          name = profile.name;
          walletAddress = profile.walletAddress;
          role = profile.role;
          kycStatus = #Pending;
          kycVerifiedAt = null;
          kycProvider = ?request.provider;
          kycReferenceId = ?referenceId;
          phoneNumber = request.phoneNumber;
          country = ?request.country;
          state = profile.state;
          city = profile.city;
          postalCode = profile.postalCode;
          dateOfBirth = ?request.dateOfBirth;
          governmentId = ?request.documentNumber;
          governmentIdType = ?request.documentType;
          createdAt = profile.createdAt;
          updatedAt = Time.now();
        };

        users.put(caller, updated);
        lastUpdated := Time.now();
        #Ok(updated)
      };
      case (null) {
        #Err("User not found")
      };
    }
  };

  /// Update KYC status (admin function - simplified)
  public shared(msg) func update_kyc_status(
    userId : Principal,
    status : KYCStatus,
    referenceId : Text
  ) : async ApiResponse<UserProfile> {
    // In production, would check admin role
    switch (users.get(userId)) {
      case (?profile) {
        let verifiedAt = switch (status) {
          case (#Verified) { ?Time.now() };
          case (_) { null };
        };

        let updated : UserProfile = {
          id = profile.id;
          email = profile.email;
          name = profile.name;
          walletAddress = profile.walletAddress;
          role = profile.role;
          kycStatus = status;
          kycVerifiedAt = verifiedAt;
          kycProvider = profile.kycProvider;
          kycReferenceId = ?referenceId;
          phoneNumber = profile.phoneNumber;
          country = profile.country;
          state = profile.state;
          city = profile.city;
          postalCode = profile.postalCode;
          dateOfBirth = profile.dateOfBirth;
          governmentId = profile.governmentId;
          governmentIdType = profile.governmentIdType;
          createdAt = profile.createdAt;
          updatedAt = Time.now();
        };

        users.put(userId, updated);
        lastUpdated := Time.now();
        #Ok(updated)
      };
      case (null) {
        #Err("User not found")
      };
    }
  };

  /// Link or update wallet address
  public shared(msg) func link_wallet(walletAddress : Text) : async ApiResponse<UserProfile> {
    let caller = msg.caller;

    switch (users.get(caller)) {
      case (?profile) {
        let updated : UserProfile = {
          id = profile.id;
          email = profile.email;
          name = profile.name;
          walletAddress = ?walletAddress;
          role = profile.role;
          kycStatus = profile.kycStatus;
          kycVerifiedAt = profile.kycVerifiedAt;
          kycProvider = profile.kycProvider;
          kycReferenceId = profile.kycReferenceId;
          phoneNumber = profile.phoneNumber;
          country = profile.country;
          state = profile.state;
          city = profile.city;
          postalCode = profile.postalCode;
          dateOfBirth = profile.dateOfBirth;
          governmentId = profile.governmentId;
          governmentIdType = profile.governmentIdType;
          createdAt = profile.createdAt;
          updatedAt = Time.now();
        };

        users.put(caller, updated);
        lastUpdated := Time.now();
        #Ok(updated)
      };
      case (null) {
        #Err("User not found")
      };
    }
  };

  /// Get user count
  public query func get_user_count() : async Nat32 {
    totalUsers
  };

  /// Get verification stats
  public query func get_verification_stats() : async {
    total: Nat32;
    verified: Nat32;
    pending: Nat32;
    notVerified: Nat32;
  } {
    var verified : Nat32 = 0;
    var pending : Nat32 = 0;
    var notVerified : Nat32 = 0;

    for ((_, profile) in users.entries()) {
      switch (profile.kycStatus) {
        case (#Verified) { verified += 1 };
        case (#Pending) { pending += 1 };
        case (#NotVerified) { notVerified += 1 };
        case (#Rejected) { };
      };
    };

    {
      total = totalUsers;
      verified = verified;
      pending = pending;
      notVerified = notVerified;
    }
  };

  /// Health check
  public query func health_check() : async {
    status: Text;
    users: Nat32;
    lastUpdated: Int;
  } {
    {
      status = "healthy";
      users = totalUsers;
      lastUpdated = lastUpdated;
    }
  };
}
