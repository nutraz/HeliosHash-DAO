


persistent actor MicroGrantSystemUpgraded {
  // Enhanced error types for better error handling
  type ErrorCode = {
    #InvalidInput: { code: Nat; field: Text; message: Text };
    #Unauthorized: { code: Nat; requiredRole: Text; message: Text };
    #InsufficientFunds: { code: Nat; available: Nat; requested: Nat };
    #NotFound: { code: Nat; resourceType: Text; resourceId: Text };
    #StateError: { code: Nat; currentState: Text; expectedState: Text };
    #SystemError: { code: Nat; operation: Text; details: Text };
  };

  type OperationResult<T> = Result.Result<T, ErrorCode>;

  // Health monitoring types
  type HealthStatus = {
    #Healthy;
    #Degraded: { reason: Text };
    #Critical: { reason: Text };
    #Offline;
  };

  type SystemHealth = {
    overallStatus: HealthStatus;
    components: [{name: Text; status: HealthStatus; lastCheck: Int}];
    uptime: Int;
    version: Text;
    cyclesBalance: ?Nat;
  };

  // Core business types
  type UserId = Principal;
  type GrantId = Nat;
  type Timestamp = Int;
  
  type MembershipTier = {
    #Tier1; #Tier2; #Tier3; #Tier4; #Tier5; #Tier6; #Tier7;
  };

  type GrantCategory = {
    #SolarInstallation;
    #WomenEntrepreneurship; 
    #CommunityDevelopment;
    #TechnicalTraining;
    #EnergyAccess;
  };

  type ApplicationStatus = {
    #Submitted;
    #UnderReview;
    #RequiresDocuments;
    #ApprovedByTrustee;
    #Rejected;
    #FundsReleased;
    #Completed;
  };

  // Enhanced application type with versioning and audit trail
  type GrantApplicationV2 = {
    id: GrantId;
    version: Nat; // For upgrade compatibility
    applicant: UserId;
    applicantTier: MembershipTier;
    isWomen: Bool;
    category: GrantCategory;
    title: Text;
    description: Text;
    requestedAmount: Nat; // Amount in USDC cents (e.g., 50000 = $500)
    expectedImpact: Text;
    timeline: Text;
    documents: [Text]; // Document URLs/hashes
    submittedAt: Timestamp;
    status: ApplicationStatus;
    reviewNotes: [ReviewNote];
    approvedAmount: ?Nat;
    disbursedAt: ?Timestamp;
    lastModified: Timestamp;
    statusHistory: [StatusChange];
  };

  type StatusChange = {
    timestamp: Timestamp;
    fromStatus: ApplicationStatus;
    toStatus: ApplicationStatus;
    actor: UserId;
    reason: Text;
  };

  type ReviewNote = {
    reviewer: UserId;
    timestamp: Timestamp;
    note: Text;
    action: Text; // "approved", "rejected", "requested_documents", etc.
  };

  type TrusteeRole = {
    #SeniorTrustee;  // Can approve up to $2000
    #JuniorTrustee;  // Can approve up to $1000
    #Observer;       // Can view and comment only
  };

  type Trustee = {
    principal: UserId;
    role: TrusteeRole;
    name: Text;
    addedAt: Timestamp;
    isActive: Bool;
  };

  type BudgetAllocationV2 = {
    totalBudget: Nat;      // $8,000 USD in cents
    allocatedAmount: Nat;   // Amount already allocated
    disbursedAmount: Nat;   // Amount actually disbursed
    availableAmount: Nat;   // Remaining budget
    lastUpdated: Timestamp;
    reservedAmount: Nat;    // For pending applications
    emergencyReserve: Nat;  // Emergency fund reserve
  };

  type GrantStatistics = {
    totalApplications: Nat;
    approvedApplications: Nat;
    rejectedApplications: Nat;
    womenApplicants: Nat;
    averageGrantSize: Nat;
    totalDisbursed: Nat;
  };

  // Constants with versioning
  private let CANISTER_VERSION : Text = "2.1.0";
  private let DATA_VERSION : Nat = 2;
  private let MAX_GRANT_AMOUNT : Nat = 200000; // $2,000 in cents
  private let MIN_GRANT_AMOUNT : Nat = 50000;  // $500 in cents
  private let TOTAL_BUDGET : Nat = 800000;     // $8,000 in cents
  private let HEARTBEAT_INTERVAL : Nat = 300_000_000_000; // 5 minutes in nanoseconds

  // Stable memory for upgrade persistence
  private stable var stableApplications : [(GrantId, GrantApplicationV2)] = [];
  private stable var stableTrustees : [(UserId, Trustee)] = [];
  private stable var stableBudget : BudgetAllocationV2 = {
    totalBudget = TOTAL_BUDGET;
    allocatedAmount = 0;
    disbursedAmount = 0;
    availableAmount = TOTAL_BUDGET;
    lastUpdated = 0;
    reservedAmount = 0;
    emergencyReserve = TOTAL_BUDGET / 10; // 10% emergency reserve
  };
  private stable var stableNextGrantId : GrantId = 1;
  private stable var stableStartTime : Int = 0;
  private stable var stableErrorLog : [(Int, Text)] = [];

  // Custom hash function for Nat (replacement for deprecated Hash.hash)
  private func natHash(n: Nat) : Nat32 {
    let hash = Int.abs(n);
    var h : Nat32 = 0;
    var remaining = hash;

    // FNV-1a like hash
    while (remaining > 0) {
      let byte = Nat32.fromNat(remaining % 256);
      h := (h ^ byte) *% 0x01000193;  // FNV prime
      remaining := remaining / 256;
    };

    // Ensure non-zero for better distribution
    if (h == 0) { 1 } else { h }
  };

  // Runtime state (rebuilt from stable memory on upgrade)
  private var applications = HashMap.HashMap<GrantId, GrantApplicationV2>(10, Nat.equal, natHash);
  private var trustees = HashMap.HashMap<UserId, Trustee>(10, Principal.equal, Principal.hash);
  private var budget : BudgetAllocationV2 = stableBudget;
  private var nextGrantId : GrantId = stableNextGrantId;
  private var startTime : Int = stableStartTime;
  private var lastHeartbeat : Int = 0;
  private var errorLog : Buffer.Buffer<(Int, Text)> = Buffer.fromArray(stableErrorLog);

  // Health monitoring state
  private var componentHealth = HashMap.HashMap<Text, (HealthStatus, Int)>(5, Text.equal, Text.hash);

  // Error logging and monitoring
  private func logError(operation: Text, details: Text) : () {
    let timestamp = Time.now();
    let errorMsg = operation # ": " # details;
    errorLog.add((timestamp, errorMsg));
    
    // Keep only last 1000 errors to prevent memory overflow
    if (errorLog.size() > 1000) {
      let newLog = Buffer.Buffer<(Int, Text)>(1000);
      let startIndex = errorLog.size() - 1000;
      for (i in Iter.range(startIndex, errorLog.size() - 1)) {
        switch (errorLog.getOpt(i)) {
          case (?entry) { newLog.add(entry) };
          case null { /* skip */ };
        };
      };
      errorLog := newLog;
    };

    Debug.print("ERROR: " # errorMsg);
  };

  private func logWarning(message: Text) : () {
    Debug.print("WARNING: " # message);
  };

  // System initialization and upgrade handling
  system func preupgrade() {
    stableApplications := Iter.toArray(applications.entries());
    stableTrustees := Iter.toArray(trustees.entries());
    stableBudget := budget;
    stableNextGrantId := nextGrantId;
    stableStartTime := startTime;
    stableErrorLog := Buffer.toArray(errorLog);
    
    Debug.print("Preupgrade: Saving " # Nat.toText(applications.size()) # " applications");
  };

  system func postupgrade() {
    // Restore state from stable memory
    for ((id, app) in stableApplications.vals()) {
      applications.put(id, app);
    };
    
    for ((id, trustee) in stableTrustees.vals()) {
      trustees.put(id, trustee);
    };

    budget := stableBudget;
    nextGrantId := stableNextGrantId;
    errorLog := Buffer.fromArray(stableErrorLog);
    
    // Set start time if not set (first deployment)
    if (stableStartTime == 0) {
      startTime := Time.now();
    } else {
      startTime := stableStartTime;
    };

    // Initialize component health monitoring
    updateComponentHealth("applications", #Healthy);
    updateComponentHealth("trustees", #Healthy);
    updateComponentHealth("budget", #Healthy);
    updateComponentHealth("memory", #Healthy);

    // Start heartbeat monitoring
    ignore Timer.setTimer(#nanoseconds(HEARTBEAT_INTERVAL), performHeartbeat);

    Debug.print("Postupgrade: Restored " # Nat.toText(applications.size()) # " applications, version " # CANISTER_VERSION);
  };

  // Health monitoring functions
  private func updateComponentHealth(component: Text, status: HealthStatus) : () {
    componentHealth.put(component, (status, Time.now()));
  };

  private func performHeartbeat() : async () {
    lastHeartbeat := Time.now();
    
    // Check component health
    await checkApplicationHealth();
    await checkBudgetHealth();
    await checkMemoryHealth();
    await checkTrusteeHealth();

    // Schedule next heartbeat
    ignore Timer.setTimer(#nanoseconds(HEARTBEAT_INTERVAL), performHeartbeat);
  };

  private func checkApplicationHealth() : async () {
    if (applications.size() == 0) {
      updateComponentHealth("applications", #Degraded({reason = "No applications in system"}));
    } else if (applications.size() > 10000) {
      updateComponentHealth("applications", #Critical({reason = "Too many applications, performance may be affected"}));
    } else {
      updateComponentHealth("applications", #Healthy);
    };
  };

  private func checkBudgetHealth() : async () {
    let utilizationPercent = if (budget.totalBudget > 0) {
      (budget.allocatedAmount * 100) / budget.totalBudget
    } else { 0 };

    if (utilizationPercent > 90) {
      updateComponentHealth("budget", #Critical({reason = "Budget utilization over 90%"}));
    } else if (utilizationPercent > 75) {
      updateComponentHealth("budget", #Degraded({reason = "Budget utilization over 75%"}));
    } else {
      updateComponentHealth("budget", #Healthy);
    };
  };

  private func checkMemoryHealth() : async () {
    let appCount = applications.size();
    let trusteeCount = trustees.size();
    let totalObjects = appCount + trusteeCount + errorLog.size();

    if (totalObjects > 50000) {
      updateComponentHealth("memory", #Critical({reason = "High object count: " # Nat.toText(totalObjects)}));
    } else if (totalObjects > 25000) {
      updateComponentHealth("memory", #Degraded({reason = "Moderate object count: " # Nat.toText(totalObjects)}));
    } else {
      updateComponentHealth("memory", #Healthy);
    };
  };

  private func checkTrusteeHealth() : async () {
    let activeTrustees = Array.filter<Trustee>(
      Iter.toArray(trustees.vals()),
      func(t: Trustee) : Bool { t.isActive }
    );

    if (activeTrustees.size() == 0) {
      updateComponentHealth("trustees", #Critical({reason = "No active trustees"}));
    } else if (activeTrustees.size() < 2) {
      updateComponentHealth("trustees", #Degraded({reason = "Only " # Nat.toText(activeTrustees.size()) # " active trustee(s)"}));
    } else {
      updateComponentHealth("trustees", #Healthy);
    };
  };

  // Enhanced validation functions
  private func validateAmount(amount: Nat) : OperationResult<()> {
    if (amount < MIN_GRANT_AMOUNT) {
      #err(#InvalidInput({
        code = 1001;
        field = "requestedAmount";
        message = "Amount below minimum of $" # Nat.toText(MIN_GRANT_AMOUNT / 100);
      }))
    } else if (amount > MAX_GRANT_AMOUNT) {
      #err(#InvalidInput({
        code = 1002;
        field = "requestedAmount";
        message = "Amount exceeds maximum of $" # Nat.toText(MAX_GRANT_AMOUNT / 100);
      }))
    } else {
      #ok(())
    }
  };

  private func validateBudgetAvailability(amount: Nat) : OperationResult<()> {
    if (budget.availableAmount < amount) {
      #err(#InsufficientFunds({
        code = 2001;
        available = budget.availableAmount;
        requested = amount;
      }))
    } else {
      #ok(())
    }
  };

  // Initialize with default trustees (should be updated in production)
  private func initializeTrustees() {
    // These should be replaced with actual trustee principals
    // For now, using placeholder principals
  };

  // Helper functions
  private func isTierEligible(tier: MembershipTier) : Bool {
    switch (tier) {
      case (#Tier1 or #Tier2 or #Tier3 or #Tier4 or #Tier5 or #Tier6 or #Tier7) { 
        true // All tiers eligible, but Tier 4+ get priority
      };
    }
  };

  private func getTierPriority(tier: MembershipTier) : Nat {
    switch (tier) {
      case (#Tier1) { 7 };
      case (#Tier2) { 6 };
      case (#Tier3) { 5 };
      case (#Tier4) { 4 };
      case (#Tier5) { 3 };
      case (#Tier6) { 2 };
      case (#Tier7) { 1 }; // Highest priority
    }
  };

  private func canApproveAmount(trusteeRole: TrusteeRole, amount: Nat) : Bool {
    switch (trusteeRole) {
      case (#SeniorTrustee) { amount <= 200000 }; // Up to $2,000
      case (#JuniorTrustee) { amount <= 100000 }; // Up to $1,000
      case (#Observer) { false };
    }
  };

  // Public functions

  /**
   * Submit a new grant application with enhanced error handling
   */
  public shared ({ caller }) func submitApplication(
    tier: MembershipTier,
    isWomen: Bool,
    category: GrantCategory,
    title: Text,
    description: Text,
    requestedAmount: Nat,
    expectedImpact: Text,
    timeline: Text,
    documents: [Text]
  ) : async OperationResult<GrantId> {
    
    // Input validation with detailed error codes
    switch (validateAmount(requestedAmount)) {
      case (#err(error)) { 
        logError("submitApplication", "Amount validation failed: " # debug_show(error));
        return #err(error);
      };
      case (#ok()) {};
    };

    switch (validateBudgetAvailability(requestedAmount)) {
      case (#err(error)) {
        logError("submitApplication", "Budget validation failed: " # debug_show(error));
        return #err(error);
      };
      case (#ok()) {};
    };

    if (title.size() == 0 or title.size() > 200) {
      let error = #InvalidInput({
        code = 1003;
        field = "title";
        message = "Title must be between 1 and 200 characters";
      });
      logError("submitApplication", "Title validation failed");
      return #err(error);
    };

    if (description.size() < 50 or description.size() > 2000) {
      let error = #InvalidInput({
        code = 1004;
        field = "description";
        message = "Description must be between 50 and 2000 characters";
      });
      logError("submitApplication", "Description validation failed");
      return #err(error);
    };

    try {
      let currentTime = Time.now();
      let application : GrantApplicationV2 = {
        id = nextGrantId;
        version = DATA_VERSION;
        applicant = caller;
        applicantTier = tier;
        isWomen = isWomen;
        category = category;
        title = title;
        description = description;
        requestedAmount = requestedAmount;
        expectedImpact = expectedImpact;
        timeline = timeline;
        documents = documents;
        submittedAt = currentTime;
        status = #Submitted;
        reviewNotes = [];
        approvedAmount = null;
        disbursedAt = null;
        lastModified = currentTime;
        statusHistory = [{
          timestamp = currentTime;
          fromStatus = #Submitted;
          toStatus = #Submitted;
          actor = caller;
          reason = "Application submitted";
        }];
      };

      applications.put(nextGrantId, application);
      nextGrantId += 1;

      // Update budget with reservation
      budget := {
        budget with
        reservedAmount = budget.reservedAmount + requestedAmount;
        availableAmount = budget.availableAmount - requestedAmount;
        lastUpdated = currentTime;
      };

      Debug.print("Application submitted successfully: ID " # Nat.toText(application.id));
      #ok(application.id)
    } catch (error) {
      let systemError = #SystemError({
        code = 9001;
        operation = "submitApplication";
        details = "Unexpected error during application submission";
      });
      logError("submitApplication", "System error: " # debug_show(error));
      #err(systemError)
    }
  };

  /**
   * Add trustee (admin function)
   */
  public shared ({ caller }) func addTrustee(
    trusteeId: UserId,
    role: TrusteeRole,
    name: Text
  ) : async Result.Result<(), Text> {
    // In production, add proper admin authorization
    
    let trustee : Trustee = {
      principal = trusteeId;
      role = role;
      name = name;
      addedAt = Time.now();
      isActive = true;
    };

    trustees.put(trusteeId, trustee);
    #ok()
  };

  /**
   * Review application (trustee function)
   */
  public shared ({ caller }) func reviewApplication(
    grantId: GrantId,
    action: Text, // "approve", "reject", "request_documents"
    note: Text,
    approvedAmount: ?Nat
  ) : async Result.Result<(), Text> {
    
    switch (trustees.get(caller)) {
      case (null) { return #err("Only trustees can review applications") };
      case (?trustee) {
        if (not trustee.isActive) {
          return #err("Trustee account is not active");
        };

        switch (applications.get(grantId)) {
          case (null) { return #err("Application not found") };
          case (?application) {
            let newNote : ReviewNote = {
              reviewer = caller;
              timestamp = Time.now();
              note = note;
              action = action;
            };

            var newStatus = application.status;
            var newApprovedAmount = application.approvedAmount;

            switch (action) {
              case ("approve") {
                switch (approvedAmount) {
                  case (null) { return #err("Approved amount must be specified") };
                  case (?amount) {
                    if (not canApproveAmount(trustee.role, amount)) {
                      return #err("Trustee cannot approve amounts above their limit");
                    };
                    newStatus := #ApprovedByTrustee;
                    newApprovedAmount := ?amount;
                  };
                };
              };
              case ("reject") {
                newStatus := #Rejected;
                // Return allocated budget (safe subtraction)
                let newAllocated = if (budget.allocatedAmount >= application.requestedAmount) {
                  budget.allocatedAmount - application.requestedAmount
                } else {
                  0
                };
                budget := {
                  budget with
                  allocatedAmount = newAllocated;
                  availableAmount = budget.availableAmount + application.requestedAmount;
                };
              };
              case ("request_documents") {
                newStatus := #RequiresDocuments;
              };
              case (_) { return #err("Invalid action") };
            };

            let updatedApplication = {
              application with
              status = newStatus;
              reviewNotes = Array.append(application.reviewNotes, [newNote]);
              approvedAmount = newApprovedAmount;
            };

            applications.put(grantId, updatedApplication);
            #ok()
          };
        };
      };
    }
  };

  /**
   * Disburse funds (admin function)
   */
  public shared ({ caller }) func disburseFunds(grantId: GrantId) : async Result.Result<(), Text> {
    // In production, add proper admin authorization
    
    switch (applications.get(grantId)) {
      case (null) { return #err("Application not found") };
      case (?application) {
        if (application.status != #ApprovedByTrustee) {
          return #err("Application must be approved before disbursement");
        };

        switch (application.approvedAmount) {
          case (null) { return #err("No approved amount found") };
          case (?amount) {
            let updatedApplication = {
              application with
              status = #FundsReleased;
              disbursedAt = ?Time.now();
            };

            applications.put(grantId, updatedApplication);

            // Update budget
            budget := {
              budget with
              disbursedAmount = budget.disbursedAmount + amount;
            };

            #ok()
          };
        };
      };
    }
  };

  /**
   * Get applications by status
   */
  public query func getApplicationsByStatus(status: ApplicationStatus) : async [GrantApplication] {
    let filteredApps = Array.filter<GrantApplication>(
      Iter.toArray(applications.vals()),
      func(app: GrantApplication) : Bool { app.status == status }
    );
    filteredApps
  };

  /**
   * Get user's applications
   */
  public query func getUserApplications(userId: UserId) : async [GrantApplication] {
    let userApps = Array.filter<GrantApplication>(
      Iter.toArray(applications.vals()),
      func(app: GrantApplication) : Bool { app.applicant == userId }
    );
    userApps
  };

  /**
   * Get application details
   */
  public query func getApplication(grantId: GrantId) : async ?GrantApplication {
    applications.get(grantId)
  };

  /**
   * Get budget status
   */
  public query func getBudgetStatus() : async BudgetAllocation {
    budget
  };

  /**
   * Get grant statistics
   */
  public query func getGrantStatistics() : async GrantStatistics {
    let allApps = Iter.toArray(applications.vals());
    let approvedApps = Array.filter<GrantApplication>(allApps, func(app) { 
      app.status == #ApprovedByTrustee or app.status == #FundsReleased or app.status == #Completed 
    });
    let rejectedApps = Array.filter<GrantApplication>(allApps, func(app) { app.status == #Rejected });
    let womenApps = Array.filter<GrantApplication>(allApps, func(app) { app.isWomen });

    let totalApproved = Array.foldLeft<GrantApplication, Nat>(
      approvedApps, 0, func(acc, app) { 
        switch (app.approvedAmount) {
          case (null) { acc };
          case (?amount) { acc + amount };
        }
      }
    );

    let avgGrantSize = if (approvedApps.size() > 0) {
      totalApproved / approvedApps.size()
    } else { 0 };

    {
      totalApplications = allApps.size();
      approvedApplications = approvedApps.size();
      rejectedApplications = rejectedApps.size();
      womenApplicants = womenApps.size();
      averageGrantSize = avgGrantSize;
      totalDisbursed = budget.disbursedAmount;
    }
  };

  /**
   * Get trustee list (admin function)
   */
  public query func getTrustees() : async [Trustee] {
    Iter.toArray(trustees.vals())
  };

  /**
   * Mark application as completed
   */
  public shared ({ caller }) func markApplicationCompleted(grantId: GrantId, completionNote: Text) : async OperationResult<()> {
    switch (applications.get(grantId)) {
      case (null) { 
        let error = #NotFound({
          code = 4001;
          resourceType = "GrantApplication";
          resourceId = Nat.toText(grantId);
        });
        logError("markApplicationCompleted", "Application not found: " # Nat.toText(grantId));
        return #err(error);
      };
      case (?application) {
        if (application.applicant != caller) {
          let error = #Unauthorized({
            code = 3001;
            requiredRole = "Applicant";
            message = "Only applicant can mark application as completed";
          });
          logError("markApplicationCompleted", "Unauthorized completion attempt by " # Principal.toText(caller));
          return #err(error);
        };

        if (application.status != #FundsReleased) {
          let error = #StateError({
            code = 5001;
            currentState = debug_show(application.status);
            expectedState = "FundsReleased";
          });
          logError("markApplicationCompleted", "Invalid state for completion");
          return #err(error);
        };

        let currentTime = Time.now();
        let completionReview : ReviewNote = {
          reviewer = caller;
          timestamp = currentTime;
          note = completionNote;
          action = "completed";
        };

        let statusChange : StatusChange = {
          timestamp = currentTime;
          fromStatus = application.status;
          toStatus = #Completed;
          actor = caller;
          reason = completionNote;
        };

        let updatedApplication = {
          application with
          status = #Completed;
          reviewNotes = Array.append(application.reviewNotes, [completionReview]);
          lastModified = currentTime;
          statusHistory = Array.append(application.statusHistory, [statusChange]);
        };

        applications.put(grantId, updatedApplication);
        #ok()
      };
    }
  };

  /**
   * Get comprehensive system health status
   */
  public query func getSystemHealth() : async SystemHealth {
    let components = Array.map<(Text, (HealthStatus, Int)), {name: Text; status: HealthStatus; lastCheck: Int}>(
      Iter.toArray(componentHealth.entries()),
      func((name, (status, lastCheck))) : {name: Text; status: HealthStatus; lastCheck: Int} {
        {name = name; status = status; lastCheck = lastCheck}
      }
    );

    let overallStatus = if (Array.find<{name: Text; status: HealthStatus; lastCheck: Int}>(
      components,
      func(comp) : Bool {
        switch (comp.status) {
          case (#Critical(_)) { true };
          case (_) { false };
        }
      }
    ) != null) {
      #Critical({reason = "One or more components in critical state"})
    } else if (Array.find<{name: Text; status: HealthStatus; lastCheck: Int}>(
      components,
      func(comp) : Bool {
        switch (comp.status) {
          case (#Degraded(_)) { true };
          case (_) { false };
        }
      }
    ) != null) {
      #Degraded({reason = "One or more components degraded"})
    } else {
      #Healthy
    };

    {
      overallStatus = overallStatus;
      components = components;
      uptime = Time.now() - startTime;
      version = CANISTER_VERSION;
      cyclesBalance = null; // Would require management canister integration
    }
  };

  /**
   * Get recent error logs for debugging (admin function)
   */
  public query func getErrorLogs(limit: ?Nat) : async [(Int, Text)] {
    let maxLimit = Option.get(limit, 100);
    let logs = Buffer.toArray(errorLog);
    
    if (logs.size() <= maxLimit) {
      logs
    } else {
      let startIndex = logs.size() - maxLimit;
      Array.tabulate<(Int, Text)>(maxLimit, func(i) {
        logs[startIndex + i]
      })
    }
  };

  /**
   * Inter-canister health check function
   */
  public func healthCheck() : async Bool {
    let health = await getSystemHealth();
    switch (health.overallStatus) {
      case (#Healthy) { true };
      case (#Degraded(_)) { true }; // Still operational
      case (#Critical(_) or #Offline) { false };
    }
  };

  /**
   * Heartbeat function for system monitoring
   */
  public func heartbeat() : async () {
    await performHeartbeat();
  };

  /**
   * Get canister metrics for monitoring
   */
  public query func getCanisterMetrics() : async {
    totalApplications: Nat;
    activeApplications: Nat;
    completedApplications: Nat;
    totalBudgetUtilization: Float;
    averageProcessingTime: ?Int;
    errorCount24h: Nat;
    lastHeartbeat: Int;
    version: Text;
  } {
    let allApps = Iter.toArray(applications.vals());
    let activeApps = Array.filter<GrantApplicationV2>(allApps, func(app) { 
      switch (app.status) {
        case (#Submitted or #UnderReview or #RequiresDocuments or #ApprovedByTrustee) { true };
        case (_) { false };
      }
    });
    let completedApps = Array.filter<GrantApplicationV2>(allApps, func(app) { app.status == #Completed });
    
    let utilizationPercent = if (budget.totalBudget > 0) {
      Float.fromInt(budget.allocatedAmount) / Float.fromInt(budget.totalBudget)
    } else { 0.0 };

    // Count errors in last 24 hours
    let dayAgo = Time.now() - (24 * 60 * 60 * 1_000_000_000);
    let recentErrors = Array.filter<(Int, Text)>(
      Buffer.toArray(errorLog),
      func((timestamp, _)) { timestamp > dayAgo }
    );

    {
      totalApplications = allApps.size();
      activeApplications = activeApps.size();
      completedApplications = completedApps.size();
      totalBudgetUtilization = utilizationPercent;
      averageProcessingTime = null; // Could be calculated from status history
      errorCount24h = recentErrors.size();
      lastHeartbeat = lastHeartbeat;
      version = CANISTER_VERSION;
    }
  };
}