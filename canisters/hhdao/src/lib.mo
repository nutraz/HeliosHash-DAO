
import Result "mo:base/Result";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Nat32 "mo:base/Nat32";
import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";

module HHDAOLib {
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
    expiresAt : Int; // Proposal expiration timestamp (nanoseconds)
  };

  // No mutable state or non-static initializations at module level. Only type definitions and pure functions.

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

  // Application System Types
  public type ApplicationType = {
    #LandPartner;     // Landowners offering land for solar projects
    #TechCollaborator; // Technical partners (engineers, developers, etc.)
    #CommunityContributor; // Village roles (maintenance, cleaning, monitoring)
    #Investor;        // Investment applications
    #Vendor;          // Equipment/service vendors
  };

  public type ApplicationStatus = {
    #Submitted;       // Initial submission
    #UnderReview;     // Being evaluated by authorities
    #DocumentsRequested; // Additional docs needed
    #Interview;       // Interview/verification phase
    #Approved;        // Accepted
    #Rejected;        // Declined with reason
    #Expired;         // Timed out
  };

  public type ApplicationPriority = {
    #Low;
    #Medium;
    #High;
    #Urgent;
  };

  public type DocumentType = {
    #LandDeed;
    #IdentityProof;
    #Resume;
    #TechnicalCertificate;
    #BankDetails;
    #LocalApproval;
    #EnvironmentalClearance;
    #Other : Text;
  };

  public type UploadedDocument = {
    id : Text;
    documentType : DocumentType;
    fileName : Text;
    uploadedAt : Int;
    verificationStatus : {#Pending; #Verified; #Rejected : Text};
  };

  public type ApplicationData = {
    // Land Partner specific
    landSize : ?Nat;              // in acres
    landLocation : ?Text;         // GPS coordinates or address  
    currentLandUse : ?Text;       // agricultural, residential, etc.
    electricityAccess : ?Bool;    // grid connectivity
    
    // Tech Collaborator specific  
    technicalSkills : ?[Text];    // programming languages, certifications
    experience : ?Nat;            // years of experience
    availability : ?Text;         // full-time, part-time, contract
    specialization : ?Text;       // solar tech, blockchain, IoT, etc.
    
    // Community Contributor specific
    preferredRoles : ?[Text];     // panel cleaning, monitoring, security
    workingHours : ?Text;         // daily hours, seasonal
    localKnowledge : ?Text;       // area familiarity, languages
    
    // Investor specific
    investmentCapacity : ?Nat;    // in rupees
    investmentHorizon : ?Text;    // short/medium/long term
    riskTolerance : ?Text;        // conservative, moderate, aggressive
    
    // Common fields
    contactPhone : ?Text;
    contactEmail : ?Text;
    aadhaarNumber : ?Text;        // Indian ID system
    bankAccount : ?Text;          // for payments
    references : ?[Text];         // contact references
  };

  public type ApplicationStatusHistory = {
    status : ApplicationStatus;
    updatedAt : Int;
    updatedBy : Principal;
    comments : ?Text;
    documentsRequested : ?[DocumentType];
  };

  public type Application = {
    id : Nat;
    applicantId : Principal;
    applicationType : ApplicationType;
    status : ApplicationStatus;
    priority : ApplicationPriority;
    
    // Basic info
    title : Text;                 // e.g., "Land Partnership - 5 acres in Urgam"
    description : Text;
    
    // Application data
    applicationData : ApplicationData;
    uploadedDocuments : [UploadedDocument];
    
    // Workflow tracking
    statusHistory : [ApplicationStatusHistory];
    assignedReviewer : ?Principal; // Authority member reviewing
    
    // Timeline
    submittedAt : Int;
    lastUpdatedAt : Int;
    reviewDeadline : ?Int;
    
    // Integration
    relatedProjectId : ?Nat;      // if tied to specific project
    governmentApprovalId : ?Text; // reference to authority approval
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

    public func getUserProjects(user : Principal) : [Project] {
      Array.filter<Project>(projects, func (p : Project) : Bool { p.owner == user })
    };

    // Application Management System
    private var nextApplicationId : Nat = 1;
    private var applications = HashMap.HashMap<Nat, Application>(10, Nat.equal, natHash);

    public func submitApplication(
      applicationType : ApplicationType,
      title : Text,
      description : Text,
      applicationData : ApplicationData,
      priority : ApplicationPriority,
      relatedProjectId : ?Nat,
      applicant : Principal
    ) : Nat {
      let initialStatus : ApplicationStatus = #Submitted;
      let now = Time.now();
      
      let initialHistory : ApplicationStatusHistory = {
        status = initialStatus;
        updatedAt = now;
        updatedBy = applicant;
        comments = ?"Application submitted";
        documentsRequested = null;
      };
      
      // Set review deadline based on priority (7-30 days)
      let reviewDeadline = switch(priority) {
        case (#Urgent) { ?(now + (7 * 24 * 60 * 60 * 1000000000)) };  // 7 days
        case (#High) { ?(now + (14 * 24 * 60 * 60 * 1000000000)) };   // 14 days  
        case (#Medium) { ?(now + (21 * 24 * 60 * 60 * 1000000000)) }; // 21 days
        case (#Low) { ?(now + (30 * 24 * 60 * 60 * 1000000000)) };    // 30 days
      };

      let application : Application = {
        id = nextApplicationId;
        applicantId = applicant;
        applicationType = applicationType;
        status = initialStatus;
        priority = priority;
        title = title;
        description = description;
        applicationData = applicationData;
        uploadedDocuments = [];
        statusHistory = [initialHistory];
        assignedReviewer = null;
        submittedAt = now;
        lastUpdatedAt = now;
        reviewDeadline = reviewDeadline;
        relatedProjectId = relatedProjectId;
        governmentApprovalId = null;
      };

      applications.put(nextApplicationId, application);
      let applicationId = nextApplicationId;
      nextApplicationId += 1;
      applicationId;
    };

    public func updateApplicationStatus(
      applicationId : Nat,
      newStatus : ApplicationStatus,
      comments : ?Text,
      documentsRequested : ?[DocumentType],
      reviewer : Principal
    ) : Bool {
      switch (applications.get(applicationId)) {
        case (?application) {
          let now = Time.now();
          let statusUpdate : ApplicationStatusHistory = {
            status = newStatus;
            updatedAt = now;
            updatedBy = reviewer;
            comments = comments;
            documentsRequested = documentsRequested;
          };
          
          let updatedApplication : Application = {
            application with 
            status = newStatus;
            statusHistory = Array.append(application.statusHistory, [statusUpdate]);
            lastUpdatedAt = now;
            assignedReviewer = ?reviewer;
          };
          
          applications.put(applicationId, updatedApplication);
          true;
        };
        case (null) {
          false;
        };
      };
    };

    public func addDocumentToApplication(
      applicationId : Nat,
      document : UploadedDocument,
      uploader : Principal
    ) : Bool {
      switch (applications.get(applicationId)) {
        case (?application) {
          if (application.applicantId != uploader) {
            return false; // Only applicant can upload documents
          };
          let updatedApplication : Application = {
            application with 
            uploadedDocuments = Array.append(application.uploadedDocuments, [document]);
            lastUpdatedAt = Time.now();
          };
          applications.put(applicationId, updatedApplication);
          true;
        };
        case (null) {
          false;
        };
      };
    };

    public func getApplication(applicationId : Nat) : ?Application {
      applications.get(applicationId);
    };

    public func getUserApplications(user : Principal) : [Application] {
      let allApplications = Iter.toArray(applications.vals());
      Array.filter<Application>(allApplications, func (app : Application) : Bool { 
        app.applicantId == user 
      });
    };

    public func getApplicationsByStatus(status : ApplicationStatus) : [Application] {
      let allApplications = Iter.toArray(applications.vals());
      Array.filter<Application>(allApplications, func (app : Application) : Bool { 
        app.status == status 
      });
    };

    public func getApplicationsByType(appType : ApplicationType) : [Application] {
      let allApplications = Iter.toArray(applications.vals());
      Array.filter<Application>(allApplications, func (app : Application) : Bool { 
        app.applicationType == appType 
      });
    };

    public func getApplicationsByReviewer(reviewer : Principal) : [Application] {
      let allApplications = Iter.toArray(applications.vals());
      Array.filter<Application>(allApplications, func (app : Application) : Bool { 
        switch (app.assignedReviewer) {
          case (?r) { r == reviewer };
          case (null) { false };
        };
      });
    };

    public func getAllApplications() : [Application] {
      Iter.toArray(applications.vals());
    };

    public func assignApplicationReviewer(
      applicationId : Nat, 
      reviewer : Principal,
      assigner : Principal
    ) : Bool {
      switch (applications.get(applicationId)) {
        case (?application) {
          let now = Time.now();
          let statusUpdate : ApplicationStatusHistory = {
            status = #UnderReview;
            updatedAt = now;
            updatedBy = assigner;
            comments = ?"Application assigned for review";
            documentsRequested = null;
          };
          
          let updatedApplication : Application = {
            application with 
            status = #UnderReview;
            assignedReviewer = ?reviewer;
            statusHistory = Array.append(application.statusHistory, [statusUpdate]);
            lastUpdatedAt = now;
          };
          
          applications.put(applicationId, updatedApplication);
          true;
        };
        case (null) {
          false;
        };
      };
    };

    /* Animal care (stray) reporting & community-validated rewards
       - Reporters submit animal-care events (location, description, photos)
       - Community members vote; when votesFor >= votesRequired the report is validated
       - On validation we issue a small community NFT reward to the reporter (low-risk, uses existing mintMembershipNFT)
    */

    public type ReportStatus = { #Submitted; #Open; #Validated; #Rejected };

    public type AnimalReport = {
      id : Nat;
      reporter : Principal;
      location : Text;
      description : Text;
      photos : [Text];
      votesFor : Nat;
      votesAgainst : Nat;
      votesRequired : Nat;
      status : ReportStatus;
      createdAt : Int;
      validatedAt : ?Int;
      rewardIssued : Bool;
    };

    private var nextReportId : Nat = 1;
    private var animalReports = HashMap.HashMap<Nat, AnimalReport>(8, Nat.equal, natHash);

    public func submitAnimalReport(
      location : Text,
      description : Text,
      photos : [Text],
      votesRequired : ?Nat,
      reporter : Principal
    ) : Nat {
      let id = nextReportId;
      nextReportId += 1;
      let now = Time.now();
  let required = switch (votesRequired) { case (?v) { v }; case (null) { 3 } }; // default 3 votes
      let report : AnimalReport = {
        id = id;
        reporter = reporter;
        location = location;
        description = description;
        photos = photos;
        votesFor = 0;
        votesAgainst = 0;
        votesRequired = required;
        status = #Submitted;
        createdAt = now;
        validatedAt = null;
        rewardIssued = false;
      };
      animalReports.put(id, report);
      id;
    };

    private func tryIssueReward(report : AnimalReport) : Bool {
      // low-risk reward path: mint a short-duration membership NFT to recognise the reporter
      if (report.rewardIssued) { return false }; // already issued
      // Mint a community-tier NFT for 30 days as recognition
      let mintReq = {
        recipient = report.reporter;
        tier = #Community;
        durationDays = 30 : Nat;
      };
      // ignore result; if mint fails we still mark rewardIssued=false
      switch (mintMembershipNFT(mintReq)) {
        case (#ok(_tokenId)) {
          true
        };
        case (#err(_e)) {
          false
        };
      };
    };

    public func voteOnAnimalReport(reportId : Nat, inFavor : Bool) : Bool {
      switch (animalReports.get(reportId)) {
        case (?report) {
          if (report.status != #Submitted and report.status != #Open) { return false }; 
          let updated : AnimalReport = {
            id = report.id;
            reporter = report.reporter;
            location = report.location;
            description = report.description;
            photos = report.photos;
            votesFor = if (inFavor) report.votesFor + 1 else report.votesFor;
            votesAgainst = if (not inFavor) report.votesAgainst + 1 else report.votesAgainst;
            votesRequired = report.votesRequired;
            status = report.status;
            createdAt = report.createdAt;
            validatedAt = report.validatedAt;
            rewardIssued = report.rewardIssued;
          };

          let newStatus : ReportStatus =
          let newStatus : ReportStatus =
            if (updated.votesFor >= report.votesRequired) {
              #Validated
            } else if (updated.votesAgainst >= report.votesRequired) {
              #Rejected
            } else {
              #Open
            };

          let final = { updated with status = newStatus };
          // store
          animalReports.put(reportId, final);

          // On validation, attempt reward issuance (best-effort)
          if (newStatus == #Validated and not final.rewardIssued) {
            let issued = tryIssueReward(final);
            if (issued) {
              let now = Time.now();
              let withReward : AnimalReport = { final with rewardIssued = true; validatedAt = ?now };
              animalReports.put(reportId, withReward);
            };
          };

          true;

            // On validation, attempt reward issuance (best-effort)
            if (newStatus == #Validated and not final.rewardIssued) {
              let issued = tryIssueReward(final);
              if (issued) {
                let now = Time.now();
                let withReward : AnimalReport = { final with rewardIssued = true; validatedAt = ?now };
                animalReports.put(reportId, withReward);
              };
            };


            true
        };
        case (null) { false };
      };
    };

    public func getAnimalReport(reportId : Nat) : ?AnimalReport { animalReports.get(reportId) };

    public func getAllAnimalReports() : [AnimalReport] { Iter.toArray(animalReports.vals()) };

  };
}
