// === HeliosHash DAO - Community Governance Canister ===
// Enforces ≥ consensusBps community approval for proposals (default 66%)
// Supports non-financial contributions (mentorship, care, teaching)



persistent actor DAO {
  // === Versioning & Governance Parameters ===
  var schemaVersion : Nat = 1; // increment when structural changes occur
  // consensus threshold in basis points (6600 = 66.00%) replacing former hard-coded 60%
  var consensusBps : Nat = 6600;
  // default voting window (nanoseconds) - mutable in test mode only
  var votingWindowNs : Time.Time = 7 * 24 * 60 * 60 * 1_000_000_000; // 7 days
  // simple runtime test flag (can be toggled by test helper); not exposed in prod UI
  var isTestMode : Bool = false;

  // === Types ===

  public type MemberId = Principal;
  public type ProposalId = Nat;

  public type ContributionType = {
    #Mentorship;
    #CommunityCare;
    #Teaching;
    #PanelMaintenance;
    #DisputeResolution;
    #Other : Text;
  };

  public type Member = {
    id : MemberId;
    joinedAt : Time.Time;
    contributionScore : Nat;
  };

  public type Proposal = {
    id : ProposalId;
    title : Text;
    description : Text;
    proposer : MemberId;
    createdAt : Time.Time;
    votesFor : Nat;
    votesAgainst : Nat;
    // Deprecated fields (kept temporarily for backward stable layout if upgrading from earlier schema)
    finalized : Bool;
    approved : Bool;
    // New status variant replacing finalized/approved booleans as source of truth
    status : ProposalStatus;
    votingDeadline : Time.Time;
    category : ContributionType;
    // Geolocation data for project mapping
    location : ?{
      latitude : Float;
      longitude : Float;
      address : Text;
    };
  };

  public type ProposalStatus = { #Active; #Passed; #Rejected; #Expired };

  public type Vote = {
    proposalId : ProposalId;
    voter : MemberId;
    approve : Bool;
  };

  // === State ===
  
  private var nextProposalId : ProposalId = 0;
  private var members : [Member] = [];
  private var proposals : [Proposal] = [];
  private var votes : [Vote] = [];
  // Future optimization: replace linear votes array with HashMap for O(1) lookups
  // private transient var voteMap = HashMap.HashMap<(ProposalId, MemberId), Bool>(10, func(a, b) { a == b }, func (key : (ProposalId, MemberId)) : Nat32 { Nat32.fromNat((key.0 * 31 + key.1)) });

  // === Helpers ===

  private transient let deployer = Principal.fromText("tsz6u-gwe2g-lrhc7-we6wc-rbdtb-lhszp-mzuxg-qnbru-xca7v-l2yxd-tae");

  private func _isAdmin(caller : Principal) : Bool { // underscore to silence unused warning (future use)
    Principal.equal(caller, deployer)
  };

  private func findMember(id : MemberId) : ?Member {
    Array.find<Member>(members, func(m) = Principal.equal(m.id, id))
  };

  private func hasMember(id : MemberId) : Bool {
    switch (findMember(id)) {
      case null false;
      case (?_) true;
    }
  };

  private func findProposal(id : ProposalId) : ?Proposal {
    Array.find<Proposal>(proposals, func(p) = Nat.equal(p.id, id))
  };

  private func hasVoted(proposalId : ProposalId, voter : MemberId) : Bool {
    switch (Array.find<Vote>(votes, func(v) = Nat.equal(v.proposalId, proposalId) and Principal.equal(v.voter, voter))) {
      case null false;
      case (?_) true;
    }
  };

  private func getInternalMemberCount() : Nat {
    members.size()
  };

  private func meetsApprovalThreshold(proposal : Proposal) : Bool {
    let total = getInternalMemberCount();
    if (total == 0) return false;
    // consensusBps e.g. 6600 => 66.00%
    let required = (total * consensusBps) / 10_000;
    proposal.votesFor >= required
  };

  // Determine if proposal can no longer mathematically pass.
  private func cannotPass(proposal : Proposal) : Bool {
    let totalMembers = getInternalMemberCount();
    if (totalMembers == 0) return false;
    let required = (totalMembers * consensusBps) / 10_000;
    // Maximum possible for votes = current for + (remaining members not yet voting assumed for) simplified: if even if everyone else voted for it still falls short.
    let consumed : Nat = proposal.votesFor + proposal.votesAgainst;
    let remainingPotential = if (consumed >= totalMembers) 0 else Nat.sub(totalMembers, consumed);
    proposal.votesFor + remainingPotential < required
  };

  private func isExpired(proposal : Proposal, now : Time.Time) : Bool {
    now >= proposal.votingDeadline
  };

  private func autoFinalizeIfNeeded(id : ProposalId) {
    switch (findProposal(id)) {
      case null {};
      case (?p) {
        let now = Time.now();
        var newStatus = p.status;
        if (p.status == #Active) {
          if (isExpired(p, now)) {
            newStatus := #Expired;
          } else if (meetsApprovalThreshold(p)) {
            newStatus := #Passed;
          } else if (cannotPass(p)) {
            newStatus := #Rejected;
          };
          if (newStatus != p.status) {
            updateProposal(id, { p with status = newStatus; finalized = (newStatus != #Active); approved = (newStatus == #Passed) });
          };
        };
      }
    };
  };

  private func addMember(member : Member) {
    let buffer = Buffer.fromArray<Member>(members);
    buffer.add(member);
    members := Buffer.toArray(buffer);
  };

  private func updateMember(memberId : MemberId, newMember : Member) {
    let buffer = Buffer.fromArray<Member>(members);
    for (i in Iter.range(0, buffer.size() - 1)) {
      if (Principal.equal(buffer.get(i).id, memberId)) {
        buffer.put(i, newMember);
      };
    };
    members := Buffer.toArray(buffer);
  };

  private func addProposal(proposal : Proposal) {
    let buffer = Buffer.fromArray<Proposal>(proposals);
    buffer.add(proposal);
    proposals := Buffer.toArray(buffer);
  };

  private func updateProposal(proposalId : ProposalId, newProposal : Proposal) {
    let buffer = Buffer.fromArray<Proposal>(proposals);
    for (i in Iter.range(0, buffer.size() - 1)) {
      if (Nat.equal(buffer.get(i).id, proposalId)) {
        buffer.put(i, newProposal);
      };
    };
    proposals := Buffer.toArray(buffer);
  };

  private func addVote(vote : Vote) {
    let buffer = Buffer.fromArray<Vote>(votes);
    buffer.add(vote);
    votes := Buffer.toArray(buffer);
  };

  // === Public Functions ===

  public shared({ caller }) func join() : async () {
    if (not hasMember(caller)) {
      addMember({
        id = caller;
        joinedAt = Time.now();
        contributionScore = 0;
      });
    };
  };

  public shared({ caller }) func createProposal(
    title : Text,
    description : Text,
    category : ContributionType
  ) : async ProposalId {
    if (not hasMember(caller)) {
      throw Error.reject("Must join DAO first");
    };
    let id = nextProposalId;
    nextProposalId += 1;
    let now = Time.now();
  let window = votingWindowNs;
    addProposal({
      id = id;
      title = title;
      description = description;
      proposer = caller;
      createdAt = now;
      votesFor = 0;
      votesAgainst = 0;
      finalized = false;
      approved = false;
      status = #Active;
      votingDeadline = now + window;
      category = category;
      location = null;
    });
    id
  };

  // === Test-only helpers (no-op unless isTestMode toggled) ===
  public shared({ caller = _ }) func setTestMode(flag : Bool) : async () {
    // Allow any caller during early development; could restrict to deployer later
    isTestMode := flag;
  };

  public shared({ caller = _ }) func setConsensusBps(newBps : Nat) : async () {
    if (not isTestMode) return; // guard
    if (newBps > 10_000) return; // invalid
    consensusBps := newBps;
  };

  public shared({ caller = _ }) func setVotingWindowSeconds(secs : Nat) : async () {
    if (not isTestMode) return;
    // convert seconds to nanoseconds
    let ns = secs * 1_000_000_000;
    if (ns == 0) return; // avoid zero window
    votingWindowNs := ns;
  };

  public shared({ caller }) func vote(proposalId : ProposalId, approve : Bool) : async () {
    if (not hasMember(caller)) {
      throw Error.reject("Only members can vote");
    };
    
    switch (findProposal(proposalId)) {
      case null { throw Error.reject("Proposal not found") };
  case (?_proposal) {
        autoFinalizeIfNeeded(proposalId);
        switch (findProposal(proposalId)) {
          case null { throw Error.reject("Proposal not found") };
          case (?current) {
            if (current.status != #Active) throw Error.reject("Proposal not active");
          }
        };
        if (hasVoted(proposalId, caller)) throw Error.reject("Already voted");
        
        // Add the vote
        addVote({
          proposalId;
          voter = caller;
          approve;
        });
        
        // Update proposal vote counts
        switch (findProposal(proposalId)) {
          case null {};
          case (?postVote) {
            let updated = {
              postVote with
              votesFor = if (approve) postVote.votesFor + 1 else postVote.votesFor;
              votesAgainst = if (not approve) postVote.votesAgainst + 1 else postVote.votesAgainst;
            };
            updateProposal(proposalId, updated);
            autoFinalizeIfNeeded(proposalId);
          }
        };
      }
    };
  };

  public shared({ caller }) func finalizeProposal(proposalId : ProposalId) : async () {
    // Temporarily allow any member to finalize for testing
    switch (findMember(caller)) {
      case null { throw Error.reject("Must be a member to finalize") };
      case (?_) {}; // Member found, proceed
    };
    
    switch (findProposal(proposalId)) {
      case null { throw Error.reject("Proposal not found") };
      case (?_proposal) {
        if (_proposal.finalized or _proposal.status != #Active) throw Error.reject("Already finalized");
        autoFinalizeIfNeeded(proposalId);
        switch (findProposal(proposalId)) {
          case null {};
          case (?current) {
            if (current.status == #Active) {
              // Force resolution now even if not threshold met (manual finalize scenario)
              let approvedNow = meetsApprovalThreshold(current);
              let newStatus = if (approvedNow) #Passed else #Rejected;
              updateProposal(proposalId, { current with status = newStatus; finalized = true; approved = approvedNow });
              if (approvedNow) {
                switch (findMember(current.proposer)) {
                  case null {};
                  case (?member) {
                    updateMember(current.proposer, { member with contributionScore = member.contributionScore + 10 });
                  }
                };
              };
            } else {
              // Already auto-finalized; ensure finalized flag coherence
              if (not _proposal.finalized) {
                updateProposal(proposalId, { _proposal with finalized = true; approved = (_proposal.status == #Passed) });
              };
            };
          }
        };
      }
    };
  };

  // === Query Functions ===

  public query func getProposal(id : ProposalId) : async ?Proposal {
    findProposal(id)
  };

  public query func getMember(id : MemberId) : async ?Member {
    findMember(id)
  };

  public query func getMemberCount() : async Nat {
    getInternalMemberCount()
  };

  public query func getAllProposals() : async [Proposal] {
    proposals
  };

  public query func getAllMembers() : async [Member] {
    members
  };

  public query func getVoteCount(proposalId : ProposalId) : async ?(Nat, Nat) {
    switch (findProposal(proposalId)) {
      case null null;  
      case (?proposal) ?(proposal.votesFor, proposal.votesAgainst);
    }
  };

  public query func hasVotedQuery(proposalId : ProposalId, memberId : MemberId) : async Bool {
    hasVoted(proposalId, memberId)
  };

  public query func getApprovalThreshold() : async Nat {
    let total = getInternalMemberCount();
    if (total == 0) return 0;
    (total * consensusBps) / 10_000
  };

  public query func getGovernanceMeta() : async {
    schemaVersion : Nat;
    consensusBps : Nat;
    totalProposals : Nat;
    activeCount : Nat;
    nextId : Nat;
  } {
    let active = Array.filter<Proposal>(proposals, func(p) = p.status == #Active).size();
    {
      schemaVersion = schemaVersion;
      consensusBps = consensusBps;
      totalProposals = proposals.size();
      activeCount = active;
      nextId = nextProposalId;
    }
  };

  // === Treasury Registration Helper ===
  public shared({ caller }) func registerWithTreasury(treasuryPrincipal : Principal) : async Result.Result<(), Text> {
    // any member may trigger registration for now (future: restrict to proposer of a passed config proposal)
    if (not hasMember(caller)) { return #err("Not a member") };
    let selfPrincipal = Principal.fromActor(DAO);
    let treasury : actor { setDaoCanister : (Principal) -> async () } = actor (Principal.toText(treasuryPrincipal));
    await treasury.setDaoCanister(selfPrincipal);
    #ok(())
  };

  // === Upgrade Hooks ===
  system func preupgrade() {
    // Placeholder: no migration logic yet (schemaVersion = 1)
  };

  system func postupgrade() {
    // Future: detect older schemaVersion and migrate
  };

}