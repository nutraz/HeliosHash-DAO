persistent actor HhuToken {
  // Migration function for stable variables
  system func preupgrade() {
    // Preserve stable variables during upgrade
  };
  
  system func postupgrade() {
    // Initialize after upgrade  
  };
  
  // Simple token interface
  public query func name() : async Text { 
    return "HeliosHash Token"; 
  };
  
  public query func symbol() : async Text { 
    return "HHU"; 
  };
  
  public query func totalSupply() : async Nat { 
    return 1_000_000_000; // 1 billion HHU
  };
  
  public query func balanceOf(principal : Text) : async Nat {
    return 1000; // Mock balance
  };
}
