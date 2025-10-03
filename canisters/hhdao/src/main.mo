

import HHDAOLib "lib";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Time "mo:base/Time";
import Array "mo:base/Array";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Cycles "mo:base/ExperimentalCycles";

// Inter-canister communication with optional injected principals (removes hard-coded IDs)


persistent actor class HHDAO(
  daoPrincipal : ?Principal,
  identityPrincipal : ?Principal,
  telemetryPrincipal : ?Principal,
  documentsPrincipal : ?Principal,
) {
	// Canister references built lazily from provided principals
	transient let dao_canister = switch daoPrincipal {
		case (?p) { ?(actor (Principal.toText(p)) : actor {
			joinDAO: () -> async Result.Result<{
				principal: Principal;
				votingPower: Nat;
				joinedAt: Int;
				reputation: Nat;
			}, Text>;
			createProposal: (Text, Text, {#Project; #Governance; #Treasury; #Community}, Nat, ?Text) -> async Result.Result<Nat, Text>;
			vote: (Nat, Bool) -> async Result.Result<Text, Text>;
			getProposal: query (Nat) -> async ?{
				id: Nat;
				title: Text;
				description: Text;
				proposer: Principal;
				proposalType: {#Project; #Governance; #Treasury; #Community};
				votesFor: Nat;
				votesAgainst: Nat;
				status: {#Active; #Passed; #Rejected; #Executed};
				createdAt: Int;
				votingDeadline: Int;
				executionData: ?Text;
			};
		}) };
		case null { null };
	};

	transient let identity_canister = switch identityPrincipal {
		case (?p) { ?(actor (Principal.toText(p)) : actor {
			createProfile: (?Text, ?Text, ?Text) -> async Result.Result<{
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
				verificationLevel: {#Basic; #Email; #KYC; #Enhanced};
			}, Text>;
			getProfile: query (Principal) -> async ?{
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
				verificationLevel: {#Basic; #Email; #KYC; #Enhanced};
			};
		}) };
		case null { null };
	};

	transient let telemetry_canister = switch telemetryPrincipal {
		case (?p) { ?(actor (Principal.toText(p)) : actor {
			registerDevice: (Text, Text, {#SolarPanel; #Inverter; #Battery; #EnergyMeter; #WeatherStation; #GridConnection}, {latitude: Float; longitude: Float; address: ?Text; region: ?Text}, [(Text, Text)]) -> async Result.Result<{
				id: Text;
				name: Text;
				deviceType: {#SolarPanel; #Inverter; #Battery; #EnergyMeter; #WeatherStation; #GridConnection};
				location: {latitude: Float; longitude: Float; address: ?Text; region: ?Text};
				owner: Principal;
				status: {#Online; #Offline; #Maintenance; #Error};
				registeredAt: Int;
				lastPing: Int;
				metadata: [(Text, Text)];
			}, Text>;
			getMyDevices: query () -> async [{
				id: Text;
				name: Text;
				deviceType: {#SolarPanel; #Inverter; #Battery; #EnergyMeter; #WeatherStation; #GridConnection};
				location: {latitude: Float; longitude: Float; address: ?Text; region: ?Text};
				owner: Principal;
				status: {#Online; #Offline; #Maintenance; #Error};
				registeredAt: Int;
				lastPing: Int;
				metadata: [(Text, Text)];
			}];
		}) };
		case null { null };
	};

	transient let documents_canister = switch documentsPrincipal {
		case (?p) { ?(actor (Principal.toText(p)) : actor {
			uploadDocument: (Text, ?Text, {#Legal; #Technical; #Financial; #Environmental; #Certificate; #Report; #Image; #Video; #Other: Text}, Text, Nat, Text, {#Public; #Private; #DAO; #Restricted: [Principal]}, [Text], [(Text, Text)]) -> async Result.Result<{
				id: Text;
				name: Text;
				description: ?Text;
				documentType: {#Legal; #Technical; #Financial; #Environmental; #Certificate; #Report; #Image; #Video; #Other: Text};
				mimeType: Text;
				size: Nat;
				hash: Text;
				owner: Principal;
				status: {#Draft; #Submitted; #UnderReview; #Approved; #Rejected; #Archived};
				accessLevel: {#Public; #Private; #DAO; #Restricted: [Principal]};
				createdAt: Int;
				updatedAt: Int;
				version: Nat;
				tags: [Text];
				metadata: [(Text, Text)];
			}, Text>;
			getMyDocuments: query () -> async [{
				id: Text;
				name: Text;
				description: ?Text;
				documentType: {#Legal; #Technical; #Financial; #Environmental; #Certificate; #Report; #Image; #Video; #Other: Text};
				mimeType: Text;
				size: Nat;
				hash: Text;
				owner: Principal;
				status: {#Draft; #Submitted; #UnderReview; #Approved; #Rejected; #Archived};
				accessLevel: {#Public; #Private; #DAO; #Restricted: [Principal]};
				createdAt: Int;
				updatedAt: Int;
				version: Nat;
				tags: [Text];
				metadata: [(Text, Text)];
			}];
		}) };
		case null { null };
	};

	// Local state for project management
	// Local state (not stable yet; add persistence later)
	transient let state = HHDAOLib.HHDAOState();

	// Enhanced project creation with integrated services
	public shared ({ caller }) func createProject(
		name : Text,
		location : Text,
		capacity : Nat,
		description : Text,
		estimatedCost : Nat,
		completionDate : ?Int
	) : async Result.Result<HHDAOLib.Project, Text> {
		// Create project locally
		let project = state.createProject(name, location, capacity, description, estimatedCost, completionDate, caller);

		// Optionally create a DAO proposal if canister configured
		switch (dao_canister) {
			case (?dao) {
				let proposalResult = await dao.createProposal(
					"Project Proposal: " # name,
					"Proposal for solar project: " # description,
					#Project,
					7, // 7 days voting period
					? ("project_id:" # Nat.toText(project.id))
				);
				switch (proposalResult) {
					case (#ok(_proposalId)) { #ok(project) };
					case (#err(error)) { #err("Project created locally but proposal failed: " # error) };
				};
			};
			case null { #ok(project) };
		}
	};

	// Enhanced user onboarding
	public shared ({ caller }) func joinPlatform(
		username: ?Text,
		email: ?Text,
		displayName: ?Text
	) : async Result.Result<Text, Text> {
		// Ensure identity canister configured
		switch (identity_canister) {
			case null { return #err("Identity canister not configured") };
			case (?identity) {
				let profileResult = await identity.createProfile(username, email, displayName);
				switch (profileResult) {
					case (#ok(_profile)) {
						// Attempt DAO join if configured
						switch (dao_canister) {
							case (?dao) {
								let daoResult = await dao.joinDAO();
								switch (daoResult) {
									case (#ok(_member)) { #ok("Successfully joined HHDAO platform with profile and DAO membership") };
									case (#err(error)) { #ok("Profile created but DAO join failed: " # error) };
								};
							};
							case null { #ok("Profile created; DAO canister not configured") };
						};
					};
					case (#err(error)) { #err("Failed to create profile: " # error) };
				};
			};
		}
	};

	// Integrated device registration for solar projects
	public shared ({ caller }) func registerSolarDevice(
		deviceId: Text,
		deviceName: Text,
		deviceType: {#SolarPanel; #Inverter; #Battery; #EnergyMeter; #WeatherStation; #GridConnection},
		latitude: Float,
		longitude: Float,
		address: ?Text,
		metadata: [(Text, Text)]
	) : async Result.Result<Text, Text> {
		let location = {
			latitude = latitude;
			longitude = longitude;
			address = address;
			region = ?"India"; // Default region
		};
		switch (telemetry_canister) {
			case null { #err("Telemetry canister not configured") };
			case (?telemetry) {
				let deviceResult = await telemetry.registerDevice(
					deviceId,
					deviceName,
					deviceType,
					location,
					metadata
				);
				switch (deviceResult) {
					case (#ok(device)) { #ok("Device registered successfully: " # device.id) };
					case (#err(error)) { #err("Device registration failed: " # error) };
				};
			};
		}
	};

	// Enhanced project documentation
	public shared ({ caller }) func uploadProjectDocument(
		projectId: Nat,
		documentName: Text,
		description: ?Text,
		documentType: {#Legal; #Technical; #Financial; #Environmental; #Certificate; #Report; #Image; #Video; #Other: Text},
		mimeType: Text,
		size: Nat,
		hash: Text,
		isPublic: Bool
	) : async Result.Result<Text, Text> {
		// Verify project ownership
		switch (state.getProject(projectId)) {
			case (null) { return #err("Project not found") };
			case (?project) {
				if (project.owner != caller) {
					return #err("Only project owner can upload documents");
				};
			};
		};

		let accessLevel = if (isPublic) { #Public } else { #Private };
		let tags = ["project:" # Nat.toText(projectId)];
		let metadata = [("projectId", Nat.toText(projectId))];
		switch (documents_canister) {
			case null { #err("Documents canister not configured") };
			case (?docs) {
				let docResult = await docs.uploadDocument(
					documentName,
					description,
					documentType,
					mimeType,
					size,
					hash,
					accessLevel,
					tags,
					metadata
				);
				switch (docResult) {
					case (#ok(document)) { #ok("Document uploaded successfully: " # document.id) };
					case (#err(error)) { #err("Document upload failed: " # error) };
				};
			};
		}
	};

	// Dashboard data aggregation
	public shared ({ caller }) func getDashboardData() : async {
		userProfile: ?{
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
			verificationLevel: {#Basic; #Email; #KYC; #Enhanced};
		};
		projects: [HHDAOLib.Project];
		devices: [{
			id: Text;
			name: Text;
			deviceType: {#SolarPanel; #Inverter; #Battery; #EnergyMeter; #WeatherStation; #GridConnection};
			location: {latitude: Float; longitude: Float; address: ?Text; region: ?Text};
			owner: Principal;
			status: {#Online; #Offline; #Maintenance; #Error};
			registeredAt: Int;
			lastPing: Int;
			metadata: [(Text, Text)];
		}];
		documents: [{
			id: Text;
			name: Text;
			description: ?Text;
			documentType: {#Legal; #Technical; #Financial; #Environmental; #Certificate; #Report; #Image; #Video; #Other: Text};
			mimeType: Text;
			size: Nat;
			hash: Text;
			owner: Principal;
			status: {#Draft; #Submitted; #UnderReview; #Approved; #Rejected; #Archived};
			accessLevel: {#Public; #Private; #DAO; #Restricted: [Principal]};
			createdAt: Int;
			updatedAt: Int;
			version: Nat;
			tags: [Text];
			metadata: [(Text, Text)];
		}];
	} {
		let userProfile = switch (identity_canister) { case (?idc) { await idc.getProfile(caller) }; case null { null } };
		let userProjects = state.getUserProjects(caller);
		let userDevices = switch (telemetry_canister) { case (?tc) { await tc.getMyDevices() }; case null { [] } };
		let userDocuments = switch (documents_canister) { case (?dc) { await dc.getMyDocuments() }; case null { [] } };
		{ userProfile = userProfile; projects = userProjects; devices = userDevices; documents = userDocuments; }
	};

	// Original project functions (maintained for backward compatibility)
	public query func getProjects() : async [HHDAOLib.Project] {
		state.getProjects()
	};

	public query func getProject(id : Nat) : async ?HHDAOLib.Project {
		state.getProject(id)
	};

	public shared ({ caller }) func updateProjectStatus(
		id : Nat,
		status : HHDAOLib.ProjectStatus
	) : async Bool {
		state.updateProjectStatus(id, status, caller)
	};

	// Legacy DAO functions (now delegated to DAO canister)
	public shared ({ caller }) func createProposal(proposal : {
		title : Text;
		description : Text;
		votesRequired : Nat;
		category : HHDAOLib.Category;
	}) : async Result.Result<Nat, Text> {
		switch (dao_canister) {
			case null { #err("DAO canister not configured") };
			case (?dao) {
				let proposalType = switch (proposal.category) {
					case (#Project) { #Project };
					case (#Governance) { #Governance };
					case (#Treasury) { #Treasury };
					// #Community removed (not part of Category in lib.mo)
				};
				await dao.createProposal(
					proposal.title,
					proposal.description,
					proposalType,
					proposal.votesRequired,
					null
				)
			};
		}
	};

	public shared ({ caller }) func vote(proposalId : Nat, inFavor : Bool) : async Result.Result<Text, Text> {
		switch (dao_canister) { case null { #err("DAO canister not configured") }; case (?dao) { await dao.vote(proposalId, inFavor) } }
	};

	public shared ({ caller }) func getProposal(proposalId : Nat) : async ?{
		id: Nat;
		title: Text;
		description: Text;
		proposer: Principal;
		proposalType: {#Project; #Governance; #Treasury; #Community};
		votesFor: Nat;
		votesAgainst: Nat;
		status: {#Active; #Passed; #Rejected; #Executed};
		createdAt: Int;
		votingDeadline: Int;
		executionData: ?Text;
	} {
		switch (dao_canister) { case null { null }; case (?dao) { await dao.getProposal(proposalId) } }
	};

	// NFT functions (maintained locally for now)
	public shared ({ caller }) func mintMembershipNFT(request : {
		recipient : Principal;
		tier : HHDAOLib.MembershipTier;
		durationDays : Nat;
	}) : async HHDAOLib.MintResult {
		state.mintMembershipNFT(request);
	};

	public query func getNFTInfo(tokenId : Nat) : async ?HHDAOLib.NFT {
		state.getNFTInfo(tokenId);
	};

	// Application Management System
	public shared ({ caller }) func submitApplication(
		applicationType : HHDAOLib.ApplicationType,
		title : Text,
		description : Text,
		applicationData : HHDAOLib.ApplicationData,
		priority : HHDAOLib.ApplicationPriority,
		relatedProjectId : ?Nat
	) : async Nat {
		state.submitApplication(applicationType, title, description, applicationData, priority, relatedProjectId, caller);
	};

	public shared ({ caller }) func updateApplicationStatus(
		applicationId : Nat,
		newStatus : HHDAOLib.ApplicationStatus,
		comments : ?Text,
		documentsRequested : ?[HHDAOLib.DocumentType]
	) : async Bool {
		state.updateApplicationStatus(applicationId, newStatus, comments, documentsRequested, caller);
	};

	public shared ({ caller }) func addDocumentToApplication(
		applicationId : Nat,
		document : HHDAOLib.UploadedDocument
	) : async Bool {
		state.addDocumentToApplication(applicationId, document, caller);
	};

	public shared ({ caller }) func assignApplicationReviewer(
		applicationId : Nat,
		reviewer : Principal
	) : async Bool {
		state.assignApplicationReviewer(applicationId, reviewer, caller);
	};

	public query func getApplication(applicationId : Nat) : async ?HHDAOLib.Application {
		state.getApplication(applicationId);
	};

	public query ({ caller }) func getUserApplications() : async [HHDAOLib.Application] {
		state.getUserApplications(caller);
	};

	public query func getApplicationsByStatus(status : HHDAOLib.ApplicationStatus) : async [HHDAOLib.Application] {
		state.getApplicationsByStatus(status);
	};

	public query func getApplicationsByType(appType : HHDAOLib.ApplicationType) : async [HHDAOLib.Application] {
		state.getApplicationsByType(appType);
	};

	public query ({ caller }) func getApplicationsByReviewer() : async [HHDAOLib.Application] {
		state.getApplicationsByReviewer(caller);
	};

	public query func getAllApplications() : async [HHDAOLib.Application] {
		state.getAllApplications();
	};

	// System statistics aggregation
	public query func getSystemStats() : async {
		totalProjects: Nat;
		totalUsers: Nat;
		timestamp: Int;
	} {
		{
			totalProjects = state.getProjects().size();
			totalUsers = 0; // Would need to query identity canister
			timestamp = Time.now();
		}
	};

	public query func getCyclesBalance() : async Nat { Cycles.balance() };
}
