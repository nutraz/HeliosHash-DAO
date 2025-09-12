import Result "mo:base/Result";
import Array "mo:base/Array";
import Nat "mo:base/Nat";
import Nat32 "mo:base/Nat32";
import Text "mo:base/Text";
import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Hash "mo:base/Hash";
import Iter "mo:base/Iter";
import Time "mo:base/Time";

module {
  public type ProjectStatus = {
    #Planning;
    #Construction;
    #Operational;
    #Maintenance;
  };

  public type Project = {
    id : Nat;
    name : Text;
    location : Text;
    capacity : Nat; // in kW
    status : ProjectStatus;
    owner : Principal;
    createdAt : Int;
    governmentApprovals : [Text];
    telemetryId : ?Text;
    description : Text;
    estimatedCost : Nat;
    completionDate : ?Int;
  };
  public type Proposal = {
    id : Nat;
    title : Text;
    description : Text;
    votesRequired : Nat;
    category : Category;
    votesFor : Nat;
    votesAgainst : Nat;
    status : Status;
  };

  public type Category = {
    #Governance;
    #Project;
    #Treasury;
  };

  public type Status = {
    #Open;
    #Passed;
    #Rejected;
  };

  public type NFT = {
    id : Nat;
    owner : Principal;
    tier : MembershipTier;
    mintedAt : Int;
    expiresAt : Int;
  };

  public type MembershipTier = {
    #Community;
    #Supporter;
    #Investor;
    #Partner;
  };

  public type MintResult = Result.Result<Nat, Text>;

  public class HHDAOState() {
    private var nextProposalId : Nat = 1;
    private var nextNFTId : Nat = 1;
  private var nextProjectId : Nat = 1;
  private var projects : [Project] = [];
    public func createProject(
      name : Text,
      location : Text,
      capacity : Nat,
      description : Text,
      estimatedCost : Nat,
      completionDate : ?Int,
      owner : Principal
    ) : Project {
      let newProject : Project = {
        id = nextProjectId;
        name = name;
        location = location;
        capacity = capacity;
        status = #Planning;
        owner = owner;
        createdAt = Time.now();
        governmentApprovals = [];
        telemetryId = null;
        description = description;
        estimatedCost = estimatedCost;
        completionDate = completionDate;
      };
      projects := Array.append(projects, [newProject]);
      nextProjectId += 1;
      newProject
    };

    public func getProjects() : [Project] {
      projects
    };

    public func getProject(id : Nat) : ?Project {
      Array.find(projects, func (p : Project) : Bool { p.id == id })
    };

    public func updateProjectStatus(
      id : Nat,
      status : ProjectStatus,
      caller : Principal
    ) : Bool {
      switch (Array.find(projects, func (p : Project) : Bool { p.id == id })) {
        case (?project) {
          if (project.owner != caller) {
            return false;
          };
          let updatedProject = {
            id = project.id;
            name = project.name;
            location = project.location;
            capacity = project.capacity;
            status = status;
            owner = project.owner;
            createdAt = project.createdAt;
            governmentApprovals = project.governmentApprovals;
            telemetryId = project.telemetryId;
            description = project.description;
            estimatedCost = project.estimatedCost;
            completionDate = project.completionDate;
          };
          projects := Array.filter<Project>(projects, func (p : Project) : Bool {
            p.id != id
          });
          projects := Array.append(projects, [updatedProject]);
          true
        };
        case (null) { false };
      }
    };
  // Custom full-Nat hash function to replace deprecated Hash.hash
  private func natHash(n : Nat) : Nat32 {
    if (n == 0) { 0 }
    else {
      func hashRec(x : Nat, acc : Nat32) : Nat32 {
        if (x == 0) { acc }
        else {
          let bit = x % 2;  // Get LSB
          let shifted = x / 2;  // Right shift
          let newAcc = if (bit == 1) { acc *% 31 +% 1 } else { acc *% 31 };  // FNV-like prime
          hashRec(shifted, Nat32.fromNat((Nat32.toNat(newAcc) % 0xFFFFFFFF)));
        }
      };
      hashRec(n, 2166136261 : Nat32);  // FNV offset basis
    }
  };

  private var proposals = HashMap.HashMap<Nat, Proposal>(0, Nat.equal, natHash);
  private var nfts = HashMap.HashMap<Nat, NFT>(0, Nat.equal, natHash);

    public func createProposal(proposal : {
      title : Text;
      description : Text;
      votesRequired : Nat;
      category : Category;
    }) : Nat {
      let id = nextProposalId;
      nextProposalId += 1;
      let newProposal : Proposal = {
        id = id;
        title = proposal.title;
        description = proposal.description;
        votesRequired = proposal.votesRequired;
        category = proposal.category;
        votesFor = 0;
        votesAgainst = 0;
        status = #Open;
      };
      proposals.put(id, newProposal);
      id;
    };

    public func vote(proposalId : Nat, inFavor : Bool) : Bool {
      switch (proposals.get(proposalId)) {
        case (?proposal) {
          if (proposal.status != #Open) {
            return false;
          };
          let updatedProposal : Proposal = {
            id = proposal.id;
            title = proposal.title;
            description = proposal.description;
            votesRequired = proposal.votesRequired;
            category = proposal.category;
            votesFor = if (inFavor) proposal.votesFor + 1 else proposal.votesFor;
            votesAgainst = if (not inFavor) proposal.votesAgainst + 1 else proposal.votesAgainst;
            status = proposal.status;
          };
          let newStatus : Status = 
            if (updatedProposal.votesFor >= proposal.votesRequired) #Passed
            else if (updatedProposal.votesAgainst >= proposal.votesRequired) #Rejected
            else #Open;
          let finalProposal = { updatedProposal with status = newStatus };
          proposals.put(proposalId, finalProposal);
          true;
        };
        case (null) {
          false;
        };
      };
    };

    public func getProposal(proposalId : Nat) : ?Proposal {
      proposals.get(proposalId);
    };

    public func mintMembershipNFT(request : {
      recipient : Principal;
      tier : MembershipTier;
      durationDays : Nat;
    }) : MintResult {
      let id = nextNFTId;
      nextNFTId += 1;
      let now = Time.now();
      let expiresAt = now + (request.durationDays * 24 * 60 * 60 * 1000000000);
      let nft : NFT = {
        id = id;
        owner = request.recipient;
        tier = request.tier;
        mintedAt = now;
        expiresAt = expiresAt;
      };
      nfts.put(id, nft);
      #ok(id);
    };

    public func getNFTInfo(tokenId : Nat) : ?NFT {
      nfts.get(tokenId);
    };

    public func getAllProposals() : [Proposal] {
      Iter.toArray(proposals.vals());
    };

    public func getAllNFTs() : [NFT] {
      Iter.toArray(nfts.vals());
    };
  };
}
