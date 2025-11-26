

actor MicroGrantSystemEnhanced {
  // Error types for detailed error handling
  type ErrorCode = {
    #InvalidInput: { code: Nat; field: Text; message: Text };
    #Unauthorized: { code: Nat; requiredRole: Text; message: Text };
    #InsufficientFunds: { code: Nat; available: Nat; requested: Nat };
    #NotFound: { code: Nat; resourceType: Text; resourceId: Text };
    #StateError: { code: Nat; currentState: Text; expectedState: Text };
    #SystemError: { code: Nat; operation: Text; details: Text };
  };

  type OperationResult<T> = Result.Result<T, ErrorCode>;

  // Health status types
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
    upgradeHistory: [UpgradeRecord];
  };

  type UpgradeRecord = {
    timestamp: Int;
    fromVersion: Text;
    toVersion: Text;
    success: Bool;
    notes: Text;
  };

  // Core business types (enhanced with versioning)
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

  // Enhanced types with version tracking
  type GrantApplicationV2 = {
    id: GrantId;
    version: Nat; // For upgrade compatibility
    applicant: UserId;
    applicantTier: MembershipTier;
    isWomen: Bool;
    category: GrantCategory;
    title: Text;
    description: Text;
    requestedAmount: Nat;
    expectedImpact: Text;
    timeline: Text;
    documents: [Text];
    submittedAt: Timestamp;
    status: ApplicationStatus;
    reviewNotes: [ReviewNote];
    approvedAmount: ?Nat;
    disbursedAt: ?Timestamp;
    lastModified: Timestamp;
    statusHistory: [StatusChange];
  };

  type ReviewNote = {
    reviewer: UserId;
    timestamp: Timestamp;
    note: Text;
    action: Text;
  };

  type StatusChange = {
    timestamp: Timestamp;
    fromStatus: ApplicationStatus;
    toStatus: ApplicationStatus;
    actor: UserId;
    reason: Text;
  };

  type TrusteeRole = {
    #SeniorTrustee;
    #JuniorTrustee;
    #Observer;
  };

  type TrusteeV2 = {
    principal: UserId;
    role: TrusteeRole;
    name: Text;
    addedAt: Timestamp;
    isActive: Bool;
    lastActivity: Timestamp;
    permissionLevel: Nat; // 0-100 for granular permissions
  };

  type BudgetAllocationV2 = {
    totalBudget: Nat;
    allocatedAmount: Nat;
    disbursedAmount: Nat;
    availableAmount: Nat;
    lastUpdated: Timestamp;
    reservedAmount: Nat; // For pending applications
    emergencyReserve: Nat; // Emergency fund reserve
  };

  type CanisterMetrics = {
    totalApplications: Nat;
    cyclesBalance: Nat;
    memoryUsage: Nat;
    lastHeartbeat: Int;
    errorCount: Nat;
    warningCount: Nat;
  };

  // Constants with versioning
  private let CANISTER_VERSION : Text = "2.0.0";
  private let DATA_VERSION : Nat = 2;
  private let MAX_GRANT_AMOUNT : Nat = 200000; // $2,000 in cents
  private let MIN_GRANT_AMOUNT : Nat = 50000;  // $500 in cents
  private let TOTAL_BUDGET : Nat = 800000;     // $8,000 in cents
  private let EMERGENCY_RESERVE_PERCENT : Nat = 10; // 10% emergency reserve
  private let HEARTBEAT_INTERVAL : Nat = 300_000_000_000; // 5 minutes in nanoseconds

  // Stable memory for upgrade persistence
  private stable var stableApplications : [(GrantId, GrantApplicationV2)] = [];
  private stable var stableTrustees : [(UserId, TrusteeV2)] = [];
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
  private stable var stableUpgradeHistory : [UpgradeRecord] = [];
  private stable var stableStartTime : Int = 0;
  private stable var stableErrorLog : [(Int, ErrorCode)] = [];

  // Runtime state (rebuilt from stable memory on upgrade)
  private var applications = HashMap.HashMap<GrantId, GrantApplicationV2>(10, Nat.equal, natHash);
  private var trustees = HashMap.HashMap<UserId, TrusteeV2>(10, Principal.equal, Principal.hash);
  private var budget : BudgetAllocationV2 = stableBudget;
  private var nextGrantId : GrantId = stableNextGrantId;
  private var upgradeHistory : Buffer.Buffer<UpgradeRecord> = Buffer.fromArray(stableUpgradeHistory);
  private var errorLog : Buffer.Buffer<(Int, ErrorCode)> = Buffer.fromArray(stableErrorLog);
  private var startTime : Int = stableStartTime;
  private var lastHeartbeat : Int = 0;

  // Health monitoring state
  private var componentHealth = HashMap.HashMap<Text, (HealthStatus, Int)>(5, Text.equal, Text.hash);
  private var systemMetrics : CanisterMetrics = {
    totalApplications = 0;
    cyclesBalance = 0;
    memoryUsage = 0;
    lastHeartbeat = 0;
    errorCount = 0;
    warningCount = 0;
  };

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

  // Error logging and handling
  private func logError(error: ErrorCode) : () {
    let timestamp = Time.now();
    errorLog.add((timestamp, error));
    
    // Keep only last 1000 errors to prevent memory overflow
    if (errorLog.size() > 1000) {
      let newLog = Buffer.Buffer<(Int, ErrorCode)>(1000);
      let startIndex = errorLog.size() - 1000;
      for (i in Iter.range(startIndex, errorLog.size() - 1)) {
        switch (errorLog.getOpt(i)) {
          case (?entry) { newLog.add(entry) };
          case null { /* skip */ };
        };
      };
      errorLog := newLog;
    };

    systemMetrics := {
      systemMetrics with
      errorCount = systemMetrics.errorCount + 1;
    };

    Debug.print("ERROR: " # debug_show(error));
  };

  private func logWarning(message: Text) : () {
    systemMetrics := {
      systemMetrics with
      warningCount = systemMetrics.warningCount + 1;
    };
    Debug.print("WARNING: " # message);
  };

  // System initialization and upgrade handling
  system func preupgrade() {
    stableApplications := Iter.toArray(applications.entries());
    stableTrustees := Iter.toArray(trustees.entries());
    stableBudget := budget;
    stableNextGrantId := nextGrantId;
    stableUpgradeHistory := Buffer.toArray(upgradeHistory);
    stableErrorLog := Buffer.toArray(errorLog);
    stableStartTime := startTime;
    
    Debug.print("Preupgrade: Saved " # Nat.toText(applications.size()) # " applications");
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
    upgradeHistory := Buffer.fromArray(stableUpgradeHistory);
    errorLog := Buffer.fromArray(stableErrorLog);
    
    // Set start time if not set (first deployment)
    if (stableStartTime == 0) {
      startTime := Time.now();
    } else {
      startTime := stableStartTime;
    };

    // Record successful upgrade
    let upgradeRecord : UpgradeRecord = {
      timestamp = Time.now();
      fromVersion = "unknown"; // Could be enhanced to track previous version
      toVersion = CANISTER_VERSION;
      success = true;
      notes = "Successful postupgrade with " # Nat.toText(applications.size()) # " applications restored";
    };
    upgradeHistory.add(upgradeRecord);

    // Initialize component health monitoring
    updateComponentHealth("applications", #Healthy);
    updateComponentHealth("trustees", #Healthy);
    updateComponentHealth("budget", #Healthy);
    updateComponentHealth("memory", #Healthy);

    // Start heartbeat monitoring
    ignore Timer.setTimer(#nanoseconds(HEARTBEAT_INTERVAL), performHeartbeat);

    Debug.print("Postupgrade: Restored " # Nat.toText(applications.size()) # " applications");
  };

  // Health monitoring functions
  private func updateComponentHealth(component: Text, status: HealthStatus) : () {
    componentHealth.put(component, (status, Time.now()));
  };

  private func performHeartbeat() : async () {
    lastHeartbeat := Time.now();
    
    // Update system metrics
    systemMetrics := {
      systemMetrics with
      totalApplications = applications.size();
      lastHeartbeat = lastHeartbeat;
      // Note: Cycles and memory would need IC management canister integration
    };

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
    // Simplified memory check - in production would use IC management APIs
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
    let activeTrustees = Array.filter<TrusteeV2>(
      Iter.toArray(trustees.vals()),
      func(t: TrusteeV2) : Bool { t.isActive }
    );

    if (activeTrustees.size() == 0) {
      updateComponentHealth("trustees", #Critical({reason = "No active trustees"}));
    } else if (activeTrustees.size() < 2) {
      updateComponentHealth("trustees", #Degraded({reason = "Only " # Nat.toText(activeTrustees.size()) # " active trustee(s)"}));
    } else {
      updateComponentHealth("trustees", #Healthy);
    };
  };

  // Enhanced business logic with better error handling
  private func validateTier(tier: MembershipTier) : OperationResult<()> {
    // All tiers are valid, but this validates the structure
    #ok(())
  };

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

  // Public functions with enhanced error handling

  /**
   * Submit a new grant application with comprehensive validation
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
    
    // Input validation
    switch (validateAmount(requestedAmount)) {
      case (#err(error)) { 
        logError(error);
        return #err(error);
      };
      case (#ok()) {};
    };

    switch (validateBudgetAvailability(requestedAmount)) {
      case (#err(error)) {
        logError(error);
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
      logError(error);
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
          fromStatus = #Submitted; // Initial status
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

      #ok(application.id)
    } catch (error) {
      let systemError = #SystemError({
        code = 9001;
        operation = "submitApplication";
        details = "Unexpected error during application submission";
      });
      logError(systemError);
      #err(systemError)
    }
  };

  /**
   * Review application with enhanced tracking
   */
  public shared ({ caller }) func reviewApplication(
    grantId: GrantId,
    action: Text,
    note: Text,
    approvedAmount: ?Nat
  ) : async OperationResult<()> {
    
    // Verify trustee authorization
    switch (trustees.get(caller)) {
      case (null) { 
        let error = #Unauthorized({
          code = 3001;
          requiredRole = "Trustee";
          message = "Only trustees can review applications";
        });
        logError(error);
        return #err(error);
      };
      case (?trustee) {
        if (not trustee.isActive) {
          let error = #Unauthorized({
            code = 3002;
            requiredRole = "Active Trustee";
            message = "Trustee account is not active";
          });
          logError(error);
          return #err(error);
        };

        // Find application
        switch (applications.get(grantId)) {
          case (null) { 
            let error = #NotFound({
              code = 4001;
              resourceType = "GrantApplication";
              resourceId = Nat.toText(grantId);
            });
            logError(error);
            return #err(error);
          };
          case (?application) {
            try {
              let currentTime = Time.now();
              let newNote : ReviewNote = {
                reviewer = caller;
                timestamp = currentTime;
                note = note;
                action = action;
              };

              var newStatus = application.status;
              var newApprovedAmount = application.approvedAmount;
              var budgetAdjustment : Int = 0;

              // Process different actions
              switch (action) {
                case ("approve") {
                  switch (approvedAmount) {
                    case (null) { 
                      let error = #InvalidInput({
                        code = 1004;
                        field = "approvedAmount";
                        message = "Approved amount must be specified for approval";
                      });
                      logError(error);
                      return #err(error);
                    };
                    case (?amount) {
                      // Validate trustee authority
                      let canApprove = switch (trustee.role) {
                        case (#SeniorTrustee) { amount <= 200000 };
                        case (#JuniorTrustee) { amount <= 100000 };
                        case (#Observer) { false };
                      };

                      if (not canApprove) {
                        let error = #Unauthorized({
                          code = 3003;
                          requiredRole = "Senior Trustee for amounts > $1000";
                          message = "Trustee cannot approve amounts above their authority limit";
                        });
                        logError(error);
                        return #err(error);
                      };

                      newStatus := #ApprovedByTrustee;
                      newApprovedAmount := ?amount;
                      budgetAdjustment := amount - application.requestedAmount;
                    };
                  };
                };
                case ("reject") {
                  newStatus := #Rejected;
                  budgetAdjustment := 0 - application.requestedAmount; // Return reserved funds
                };
                case ("request_documents") {
                  newStatus := #RequiresDocuments;
                };
                case (_) { 
                  let error = #InvalidInput({
                    code = 1005;
                    field = "action";
                    message = "Invalid action: " # action;
                  });
                  logError(error);
                  return #err(error);
                };
              };

              // Create status history entry
              let statusChange : StatusChange = {
                timestamp = currentTime;
                fromStatus = application.status;
                toStatus = newStatus;
                actor = caller;
                reason = note;
              };

              // Update application
              let updatedApplication = {
                application with
                status = newStatus;
                reviewNotes = Array.append(application.reviewNotes, [newNote]);
                approvedAmount = newApprovedAmount;
                lastModified = currentTime;
                statusHistory = Array.append(application.statusHistory, [statusChange]);
              };

              applications.put(grantId, updatedApplication);

              // Update budget
              budget := {
                budget with
                reservedAmount = Int.max(0, budget.reservedAmount + budgetAdjustment);
                availableAmount = budget.availableAmount - budgetAdjustment;
                lastUpdated = currentTime;
              };

              // Update trustee activity
              let updatedTrustee = {
                trustee with
                lastActivity = currentTime;
              };
              trustees.put(caller, updatedTrustee);

              #ok()
            } catch (error) {
              let systemError = #SystemError({
                code = 9002;
                operation = "reviewApplication";
                details = "Unexpected error during application review";
              });
              logError(systemError);
              #err(systemError)
            }
          };
        };
      };
    }
  };

  /**
   * Get system health status
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
      upgradeHistory = Buffer.toArray(upgradeHistory);
    }
  };

  /**
   * Get detailed system metrics
   */
  public query func getSystemMetrics() : async CanisterMetrics {
    {
      systemMetrics with
      totalApplications = applications.size();
      lastHeartbeat = lastHeartbeat;
    }
  };

  /**
   * Get recent error logs (admin function)
   */
  public query func getErrorLogs(limit: ?Nat) : async [(Int, ErrorCode)] {
    let maxLimit = Option.get(limit, 100);
    let logs = Buffer.toArray(errorLog);
    
    if (logs.size() <= maxLimit) {
      logs
    } else {
      let startIndex = logs.size() - maxLimit;
      Array.tabulate<(Int, ErrorCode)>(maxLimit, func(i) {
        logs[startIndex + i]
      })
    }
  };

  /**
   * Emergency budget adjustment (admin function with enhanced validation)
   */
  public shared ({ caller }) func emergencyBudgetAdjustment(
    newTotalBudget: Nat,
    reason: Text
  ) : async OperationResult<()> {
    // In production, this would check for admin privileges
    // For now, we'll implement basic validation
    
    if (newTotalBudget < budget.disbursedAmount) {
      let error = #InvalidInput({
        code = 1006;
        field = "newTotalBudget";
        message = "New budget cannot be less than already disbursed amount";
      });
      logError(error);
      return #err(error);
    };

    let currentTime = Time.now();
    let oldBudget = budget.totalBudget;
    let adjustment = if (newTotalBudget > oldBudget) {
      newTotalBudget - oldBudget
    } else {
      0 // No negative adjustments for safety
    };

    budget := {
      totalBudget = newTotalBudget;
      allocatedAmount = budget.allocatedAmount;
      disbursedAmount = budget.disbursedAmount;
      availableAmount = budget.availableAmount + adjustment;
      lastUpdated = currentTime;
      reservedAmount = budget.reservedAmount;
      emergencyReserve = newTotalBudget / 10; // Maintain 10% emergency reserve
    };

    logWarning("Emergency budget adjustment: " # reason);
    #ok()
  };

  // Existing functions (enhanced with error handling) would go here...
  // For brevity, I'm including key functions with the new pattern

  /**
   * Get applications with enhanced filtering and pagination
   */
  public query func getApplicationsByStatusPaginated(
    status: ?ApplicationStatus,
    offset: Nat,
    limit: Nat
  ) : async {
    applications: [GrantApplicationV2];
    total: Nat;
    hasMore: Bool;
  } {
    let allApps = Iter.toArray(applications.vals());
    
    let filteredApps = switch (status) {
      case (null) { allApps };
      case (?s) { 
        Array.filter<GrantApplicationV2>(allApps, func(app: GrantApplicationV2) : Bool { 
          app.status == s 
        })
      };
    };

    let total = filteredApps.size();
    let startIndex = Int.min(offset, total);
    let endIndex = Int.min(offset + limit, total);
    
    let pageApps = if (startIndex >= total) {
      []
    } else {
      Array.tabulate<GrantApplicationV2>(endIndex - startIndex, func(i) {
        filteredApps[startIndex + i]
      })
    };

    {
      applications = pageApps;
      total = total;
      hasMore = endIndex < total;
    }
  };

  // Heartbeat function for inter-canister health monitoring
  public func heartbeat() : async () {
    await performHeartbeat();
  };

}