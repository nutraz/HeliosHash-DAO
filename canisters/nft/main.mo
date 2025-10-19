// === HeliosHash DAO - Community NFT Badges ===
// Gamified rewards system for cultural participation and achievements

<<<<<<< HEAD

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
>>>>>>> audit-clean

persistent actor CommunityBadges {
  
  // === Types ===
  
  public type BadgeId = Nat;
  public type MemberId = Principal;
  
  public type BadgeCategory = {
    #Language;          // Language selection and usage
    #Voice;            // Voice interface usage  
    #Governance;       // DAO participation
    #Solar;            // Solar energy contributions
    #Community;        // Community building
    #Mentorship;       // Teaching and learning
    #Cultural;         // Cultural preservation
    #Achievement;      // Special accomplishments
  };
  
  public type BadgeTemplate = {
    id: BadgeId;
    name: Text;                    // Badge name in Hindi
    nameEnglish: Text;            // Badge name in English
    description: Text;            // Description in Hindi
    descriptionEnglish: Text;     // Description in English
    category: BadgeCategory;
    emoji: Text;                  // Emoji representation
    criteria: Text;               // Earning criteria
    owpReward: Nat;              // OWP tokens awarded
    isActive: Bool;              // Can be earned
    maxSupply: ?Nat;             // Limited edition badges
    currentSupply: Nat;          // Currently minted
  };
  
  public type Badge = {
    id: BadgeId;
    template: BadgeTemplate;
    owner: MemberId;
    mintedAt: Time.Time;
    metadata: ?Text;             // Additional context
    verified: Bool;              // Verified by community
  };
  
  public type Achievement = {
    badgeId: BadgeId;
    memberId: MemberId;
    earnedAt: Time.Time;
    context: Text;               // How it was earned
    witnesses: [MemberId];       // Community verification
  };
  
  // === State ===

  // 'stable' is implicit for top-level mutable vars; removed redundant keywords
  private var nextBadgeId : BadgeId = 1;
  private var nextTemplateId : BadgeId = 1;

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

  private transient var badgeTemplates = HashMap.HashMap<BadgeId, BadgeTemplate>(10, Nat.equal, natHash);
  private transient var memberBadges = HashMap.HashMap<MemberId, [Badge]>(100, Principal.equal, Principal.hash);
  private transient var badgeAchievements = HashMap.HashMap<BadgeId, [Achievement]>(100, Nat.equal, natHash);
  
  // === Initialization ===
  
  private func initializeDefaultBadges() {
    let templates = [
      {
        id = 1;
        name = "स्वागत बैज";
        nameEnglish = "Welcome Badge";
        description = "हेलियोसहैश DAO में सफल पंजीकरण";
        descriptionEnglish = "Successful registration in HeliosHash DAO";
        category = #Community;
        emoji = "🏆";
        criteria = "Complete onboarding process";
        owpReward = 10;
        isActive = true;
        maxSupply = null;
        currentSupply = 0;
      },
      {
        id = 2;
        name = "भाषा मास्टर";
        nameEnglish = "Language Master";
        description = "हिंदी भाषा का सफल चयन और उपयोग";
        descriptionEnglish = "Successful selection and usage of Hindi language";
        category = #Language;
        emoji = "🗣️";
        criteria = "Select Hindi as preferred language and complete 5 actions";
        owpReward = 15;
        isActive = true;
        maxSupply = null;
        currentSupply = 0;
      },
      {
        id = 3;
        name = "वॉइस पायनियर";
        nameEnglish = "Voice Pioneer";
        description = "वॉइस इंटरफेस का सफल उपयोग";
        descriptionEnglish = "Successful use of voice interface";
        category = #Voice;
        emoji = "🎤";
        criteria = "Use voice commands 10+ times during onboarding";
        owpReward = 20;
        isActive = true;
        maxSupply = ?500;  // Limited edition
        currentSupply = 0;
      },
      {
        id = 4;
        name = "सोलर एडवोकेट";
        nameEnglish = "Solar Advocate";  
        description = "सौर ऊर्जा समुदाय में पूर्ण सदस्यता";
        descriptionEnglish = "Full membership in solar energy community";
        category = #Solar;
        emoji = "☀️";
        criteria = "Complete membership registration and first vote";
        owpReward = 25;
        isActive = true;
        maxSupply = null;
        currentSupply = 0;
      },
      {
        id = 5;
        name = "गढ़वाली गार्डियन";
        nameEnglish = "Garhwali Guardian";
        description = "गढ़वाली भाषा और संस्कृति का संरक्षण";
        descriptionEnglish = "Preservation of Garhwali language and culture";
        category = #Cultural;
        emoji = "🏔️";
        criteria = "Use Garhwali interface and teach 3+ community members";
        owpReward = 50;
        isActive = true;
        maxSupply = ?100;  // Very limited
        currentSupply = 0;
      },
      {
        id = 6;
        name = "महिला नेता";
        nameEnglish = "Women Leader";
        description = "महिला सशक्तिकरण और नेतृत्व";
        descriptionEnglish = "Women empowerment and leadership";
        category = #Community;
        emoji = "👩‍💼";
        criteria = "Female member who mentors 5+ women and creates 1+ proposal";
        owpReward = 100;
        isActive = true;
        maxSupply = ?50;   // Highly exclusive
        currentSupply = 0;
      },
      {
        id = 7;
        name = "डिस्प्यूट रिज़ॉल्वर";
        nameEnglish = "Dispute Resolver";
        description = "समुदायिक विवादों का न्यायसंगत समाधान";
        descriptionEnglish = "Fair resolution of community disputes";
        category = #Governance;
        emoji = "⚖️";
        criteria = "Successfully resolve 3+ disputes as juror";
        owpReward = 75;
        isActive = true;
        maxSupply = ?25;
        currentSupply = 0;
      },
      {
        id = 8;
        name = "थर्मल मास्टर";
        nameEnglish = "Thermal Master";
        description = "सौर प्रणाली की तापीय निगरानी विशेषज्ञता";
        descriptionEnglish = "Expertise in solar system thermal monitoring";
        category = #Solar;
        emoji = "🌡️";
        criteria = "Monitor thermal systems for 30+ days without critical alerts";
        owpReward = 60;
        isActive = true;
        maxSupply = null;
        currentSupply = 0;
      }
    ];
    
    for (template in templates.vals()) {
      badgeTemplates.put(template.id, template);
    };
    nextTemplateId := 9;
  };
  
  // === Public Functions ===
  
  public func initializeBadges() : async () {
    initializeDefaultBadges();
  };
  
  public shared({ caller }) func mintBadge(templateId: BadgeId, recipient: MemberId, context: Text) : async Result.Result<Badge, Text> {
    // Only authorized minters (DAO canister, onboarding system)
    // In production, add proper authorization checks
    
    switch (badgeTemplates.get(templateId)) {
      case null { #err("Badge template not found") };
      case (?template) {
        if (not template.isActive) {
          return #err("Badge template is not active");
        };
        
        // Check supply limits
        switch (template.maxSupply) {
          case (?max) {
            if (template.currentSupply >= max) {
              return #err("Badge supply limit reached");
            };
          };
          case null {};
        };
        
        // Check if member already has this badge
        switch (memberBadges.get(recipient)) {
          case (?existingBadges) {
            let hasThisBadge = Array.find<Badge>(existingBadges, func(b) = b.template.id == templateId);
            if (hasThisBadge != null) {
              return #err("Member already owns this badge");
            };
          };
          case null {};
        };
        
        let badge : Badge = {
          id = nextBadgeId;
          template = template;
          owner = recipient;
          mintedAt = Time.now();
          metadata = ?context;
          verified = true;  // Auto-verified for system mints
        };
        
        // Add to member's collection
        let currentBadges = switch (memberBadges.get(recipient)) {
          case (?badges) { badges };
          case null { [] };
        };
        let updatedBadges = Array.append<Badge>(currentBadges, [badge]);
        memberBadges.put(recipient, updatedBadges);
        
        // Update template supply
        let updatedTemplate = {
          template with currentSupply = template.currentSupply + 1;
        };
        badgeTemplates.put(templateId, updatedTemplate);
        
        // Record achievement
        let achievement : Achievement = {
          badgeId = badge.id;
          memberId = recipient;
          earnedAt = badge.mintedAt;
          context = context;
          witnesses = [caller];  // Minter as witness
        };
        
        let currentAchievements = switch (badgeAchievements.get(badge.id)) {
          case (?achievements) { achievements };
          case null { [] };
        };
        let updatedAchievements = Array.append<Achievement>(currentAchievements, [achievement]);
        badgeAchievements.put(badge.id, updatedAchievements);
        
        nextBadgeId += 1;
        #ok(badge)
      };
    };
  };
  
  public query func getMemberBadges(member: MemberId) : async [Badge] {
    switch (memberBadges.get(member)) {
      case (?badges) { badges };
      case null { [] };
    };
  };
  
  public query func getBadgeTemplate(templateId: BadgeId) : async ?BadgeTemplate {
    badgeTemplates.get(templateId)
  };
  
  public query func getAllBadgeTemplates() : async [BadgeTemplate] {
    Iter.toArray(badgeTemplates.vals())
  };
  
  public query func getMemberBadgeCount(member: MemberId) : async Nat {
    switch (memberBadges.get(member)) {
      case (?badges) { badges.size() };
      case null { 0 };
    };
  };
  
  public query func getBadgeLeaderboard() : async [(MemberId, Nat)] {
    // Return top 10 members by badge count
    let members = Iter.toArray(memberBadges.entries());
    let sorted = Array.sort<(MemberId, [Badge])>(members, func(a, b) = 
      if (a.1.size() > b.1.size()) { #less } 
      else if (a.1.size() < b.1.size()) { #greater }
      else { #equal }
    );
    
    let top10 = if (sorted.size() > 10) {
      Array.subArray<(MemberId, [Badge])>(sorted, 0, 10)
    } else {
      sorted
    };
    
    Array.map<(MemberId, [Badge]), (MemberId, Nat)>(top10, func(entry) = (entry.0, entry.1.size()))
  };
  
  public query func getCommunityStats() : async {
    totalMembers: Nat;
    totalBadges: Nat;
    totalTemplates: Nat;
    mostPopularBadge: ?Text;
    raresBadge: ?Text;
  } {
    let totalMembers = memberBadges.size();
    let totalTemplates = badgeTemplates.size();
    
    var totalBadges = 0;
    for (badges in memberBadges.vals()) {
      totalBadges += badges.size();
    };
    
    // Find most/least popular badges
    let templates = Iter.toArray(badgeTemplates.vals());
    let sortedBySupply = Array.sort<BadgeTemplate>(templates, func(a, b) = 
      if (a.currentSupply > b.currentSupply) { #less }
      else if (a.currentSupply < b.currentSupply) { #greater }
      else { #equal }
    );
    
    let mostPopular = if (sortedBySupply.size() > 0) { ?sortedBySupply[0].name } else { null };
    let rarest = if (sortedBySupply.size() > 0) { ?sortedBySupply[sortedBySupply.size() - 1].name } else { null };
    
    {
      totalMembers = totalMembers;
      totalBadges = totalBadges;
      totalTemplates = totalTemplates;
      mostPopularBadge = mostPopular;
      raresBadge = rarest;
    }
  };
  
  // === Badge Earning Automation ===
  
  public shared({ caller = _ }) func checkAndAwardBadges(member: MemberId, action: Text, metadata: Text) : async [Badge] {
    // Auto-award badges based on actions
    // This would be called by other canisters when members perform actions
    
    var earnedBadges : [Badge] = [];
    
    // Language Master Badge
    if (Text.contains(action, #text "language_selected:hi") and Text.contains(metadata, #text "actions:5")) {
      switch (await mintBadge(2, member, "Completed 5 actions in Hindi")) {
        case (#ok(badge)) { earnedBadges := Array.append(earnedBadges, [badge]); };
        case (#err(_)) {};
      };
    };
    
    // Voice Pioneer Badge
    if (Text.contains(action, #text "voice_command") and Text.contains(metadata, #text "count:10")) {
      switch (await mintBadge(3, member, "Used voice commands 10+ times")) {
        case (#ok(badge)) { earnedBadges := Array.append(earnedBadges, [badge]); };
        case (#err(_)) {};
      };
    };
    
    // Solar Advocate Badge
    if (Text.contains(action, #text "membership_complete") and Text.contains(metadata, #text "first_vote:true")) {
      switch (await mintBadge(4, member, "Completed membership and first vote")) {
        case (#ok(badge)) { earnedBadges := Array.append(earnedBadges, [badge]); };
        case (#err(_)) {};
      };
    };
    
    earnedBadges
  };
  
  // === System Functions ===
  
  system func preupgrade() {
    // Stable storage handled by HashMap implementations
  };
  
  system func postupgrade() {
    // Reinitialize if needed
    if (badgeTemplates.size() == 0) {
      initializeDefaultBadges();
    };
  };
}