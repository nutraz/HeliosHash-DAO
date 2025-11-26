// Chain Fusion imports for ckBTC integration
// Note: These would be actual imports in production
// import CKBTC "mo:ckbtc/ckbtc";
// import AICompute "canister:ai-service";

// Core imports
import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Nat32 "mo:base/Nat32";
import Float "mo:base/Float";
import Debug "mo:base/Debug";
import Buffer "mo:base/Buffer";
import Iter "mo:base/Iter";

persistent actor Compute {
  
  type ComputeMode = {
    #Bitcoin;
    #AI;
    #Hybrid;
  };

  type ComputeStats = {
    mode: ComputeMode;
    hashRate: Float; // TH/s for Bitcoin
    aiWorkloads: Nat; // Number of AI inference jobs
    powerConsumption: Float; // kW
    efficiency: Float; // Performance per watt
    revenue: Float; // Daily revenue in USD
    lastUpdated: Int;
  };

  type PivotDecision = {
    trigger: Text; // "profitability", "efficiency", "demand"
    threshold: Float;
    newMode: ComputeMode;
    estimatedImpact: Float;
    timestamp: Int;
  };

  private var currentMode: ComputeMode = #Bitcoin;
  private var computeStatsEntries: [(Principal, ComputeStats)] = [];
  private var pivotHistoryEntries: [(Nat, PivotDecision)] = [];

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

  private transient var computeStats = HashMap.fromIter<Principal, ComputeStats>(computeStatsEntries.vals(), 10, Principal.equal, Principal.hash);
  private transient var pivotHistory = HashMap.fromIter<Nat, PivotDecision>(pivotHistoryEntries.vals(), 10, Nat.equal, natHash);
  
  private transient var pivotCounter: Nat = 0;

  // Bitcoin mining profitability threshold (USD per TH/s per day)
  private transient let BITCOIN_THRESHOLD: Float = 0.10;
  
  // AI compute demand threshold (jobs per hour)
  private transient let AI_DEMAND_THRESHOLD: Float = 50.0;

  // System management functions
  system func preupgrade() {
    computeStatsEntries := Iter.toArray(computeStats.entries());
    pivotHistoryEntries := Iter.toArray(pivotHistory.entries());
  };

  system func postupgrade() {
    computeStatsEntries := [];
    pivotHistoryEntries := [];
  };

  // Main pivot function for switching compute modes
  public shared ({ caller }) func pivotComputeMode(targetMode: Text, trigger: Text, threshold: Float): async Result.Result<Bool, Text> {
    
    let mode: ComputeMode = switch (targetMode) {
      case ("bitcoin") #Bitcoin;
      case ("ai") #AI;
      case ("hybrid") #Hybrid;
      case (_) return #err("Invalid compute mode. Use: bitcoin, ai, or hybrid");
    };

    // Validate caller permissions (in production, check for admin role)
    let stats = switch (computeStats.get(caller)) {
      case (null) {
        // Create default stats for new user
        let defaultStats: ComputeStats = {
          mode = currentMode;
          hashRate = 0.0;
          aiWorkloads = 0;
          powerConsumption = 0.0;
          efficiency = 0.0;
          revenue = 0.0;
          lastUpdated = Time.now();
        };
        computeStats.put(caller, defaultStats);
        defaultStats;
      };
      case (?existing) existing;
    };

    // Check if pivot is justified based on threshold
    let shouldPivot = switch (trigger) {
      case ("profitability") {
        mode == #AI and stats.revenue < threshold
      };
      case ("efficiency") {
        stats.efficiency < threshold
      };
      case ("demand") {
        mode == #AI and Float.fromInt(stats.aiWorkloads) > threshold
      };
      case (_) false;
    };

    if (not shouldPivot) {
      return #err("Pivot conditions not met for trigger: " # trigger);
    };

    // Execute the pivot
    currentMode := mode;
    
    // Record pivot decision
    let decision: PivotDecision = {
      trigger = trigger;
      threshold = threshold;
      newMode = mode;
      estimatedImpact = calculatePivotImpact(stats, mode);
      timestamp = Time.now();
    };
    
    pivotHistory.put(pivotCounter, decision);
    pivotCounter += 1;

    // Update compute stats for the caller
    let updatedStats: ComputeStats = {
      mode = mode;
      hashRate = if (mode == #Bitcoin or mode == #Hybrid) stats.hashRate else 0.0;
      aiWorkloads = if (mode == #AI or mode == #Hybrid) stats.aiWorkloads else 0;
      powerConsumption = stats.powerConsumption;
      efficiency = stats.efficiency * 1.15; // Assumed 15% efficiency gain from optimization
      revenue = stats.revenue;
      lastUpdated = Time.now();
    };
    
    computeStats.put(caller, updatedStats);

    // In production, this would:
    // 1. Transfer ckBTC to AI compute canister
    // 2. Notify mining hardware controllers
    // 3. Update resource allocation
    
    Debug.print("Pivoted to " # targetMode # " mode for principal: " # Principal.toText(caller));
    
    #ok(true)
  };

  // Calculate estimated impact of pivot
  private func calculatePivotImpact(stats: ComputeStats, newMode: ComputeMode): Float {
    switch (newMode) {
      case (#AI) {
        // AI workloads typically more profitable per watt
        stats.revenue * 1.3
      };
      case (#Bitcoin) {
        // Bitcoin mining baseline
        stats.revenue * 0.9
      };
      case (#Hybrid) {
        // Balance between both
        stats.revenue * 1.1
      };
    }
  };

  // Update compute statistics (called by external monitoring)
  public shared ({ caller }) func updateComputeStats(
    hashRate: Float,
    aiWorkloads: Nat,
    powerConsumption: Float,
    revenue: Float
  ): async Result.Result<(), Text> {
    
    let efficiency = if (powerConsumption > 0.0) {
      (Float.fromInt(aiWorkloads) + hashRate) / powerConsumption
    } else 0.0;

    let stats: ComputeStats = {
      mode = currentMode;
      hashRate = hashRate;
      aiWorkloads = aiWorkloads;
      powerConsumption = powerConsumption;
      efficiency = efficiency;
      revenue = revenue;
      lastUpdated = Time.now();
    };

    computeStats.put(caller, stats);
    
    // Auto-pivot if conditions are met
    if (revenue < BITCOIN_THRESHOLD and currentMode == #Bitcoin) {
      let _ = await pivotComputeMode("ai", "profitability", BITCOIN_THRESHOLD);
    };

    #ok()
  };

  // Get current compute mode and statistics
  public query func getComputeStatus(user: ?Principal): async {
    mode: ComputeMode;
    stats: ?ComputeStats;
    pivotHistory: [(Nat, PivotDecision)];
  } {
    let userPrincipal = switch (user) {
      case (?p) p;
      case (null) return {
        mode = currentMode;
        stats = null;
        pivotHistory = Iter.toArray(pivotHistory.entries());
      };
    };

    {
      mode = currentMode;
      stats = computeStats.get(userPrincipal);
      pivotHistory = Iter.toArray(pivotHistory.entries());
    }
  };

  // Get pivot recommendations based on current conditions
  public query func getPivotRecommendations(): async [{
    recommendedMode: ComputeMode;
    reason: Text;
    estimatedGain: Float;
    confidence: Float;
  }] {
    let recommendations = Buffer.Buffer<{
      recommendedMode: ComputeMode;
      reason: Text;
      estimatedGain: Float;
      confidence: Float;
    }>(3);

    // Analyze current market conditions (mock data for demo)
    let btcProfitability = 0.08; // USD per TH/s per day
    let aiDemand = 75.0; // Jobs per hour
    let powerCost = 0.12; // USD per kWh

    if (btcProfitability < BITCOIN_THRESHOLD and currentMode == #Bitcoin) {
      recommendations.add({
        recommendedMode = #AI;
        reason = "Bitcoin mining below profitability threshold";
        estimatedGain = 0.25;
        confidence = 0.85;
      });
    };

    if (aiDemand > AI_DEMAND_THRESHOLD and currentMode != #AI) {
      recommendations.add({
        recommendedMode = #AI;
        reason = "High AI compute demand detected";
        estimatedGain = 0.40;
        confidence = 0.90;
      });
    };

    if (currentMode != #Hybrid) {
      recommendations.add({
        recommendedMode = #Hybrid;
        reason = "Diversified approach for stable returns";
        estimatedGain = 0.15;
        confidence = 0.70;
      });
    };

    Buffer.toArray(recommendations)
  };

  // Emergency shutdown for all compute operations
  public shared ({ caller }) func emergencyShutdown(reason: Text): async Bool {
    // In production, verify admin permissions
    
    // Stop all compute operations
    for ((user, _) in computeStats.entries()) {
      let shutdownStats: ComputeStats = {
        mode = #Bitcoin; // Default safe mode
        hashRate = 0.0;
        aiWorkloads = 0;
        powerConsumption = 0.0;
        efficiency = 0.0;
        revenue = 0.0;
        lastUpdated = Time.now();
      };
      computeStats.put(user, shutdownStats);
    };

    Debug.print("Emergency shutdown initiated by: " # Principal.toText(caller) # " Reason: " # reason);
    true
  };

  // Health check for compute systems
  public query func healthCheck(): async {
    status: Text;
    activeUsers: Nat;
    totalHashRate: Float;
    totalAIWorkloads: Nat;
    averageEfficiency: Float;
  } {
    let users = Iter.toArray(computeStats.entries());
    let userCount = users.size();
    
    var totalHash: Float = 0.0;
    var totalAI: Nat = 0;
    var totalEff: Float = 0.0;
    
    for ((_, stats) in users.vals()) {
      totalHash += stats.hashRate;
      totalAI += stats.aiWorkloads;
      totalEff += stats.efficiency;
    };

    {
      status = "operational";
      activeUsers = userCount;
      totalHashRate = totalHash;
      totalAIWorkloads = totalAI;
      averageEfficiency = if (userCount > 0) totalEff / Float.fromInt(userCount) else 0.0;
    }
  };
}