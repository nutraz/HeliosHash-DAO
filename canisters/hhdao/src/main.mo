<<<<<<< HEAD


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
		switch (state.createProject(name, location, capacity, description, estimatedCost, completionDate, caller)) {
			case (#ok(project)) {
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
			case (#err(error)) { #err(error) };
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
	) : async Result.Result<(), Text> {
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

	// Internet Identity integration - returns caller principal
	public shared ({ caller }) func whoami() : async Principal {
		caller
	};

	// Seed data method for development and testing
	public shared ({ caller }) func seed_data() : async Text {
		var summary = "=== Seeding HHDAO with sample data ===\n\n";

		// 1. Create Sample Projects
		summary #= "📊 Creating sample projects...\n";
		let project1Result = state.createProject(
			"Urgam Valley Solar Farm",
			"Urgam Valley, Gujarat, India",
			500, // 500 kW capacity
			"Community-owned solar farm providing clean energy to 200+ households in Urgam Valley",
			2500000, // 25 lakh rupees
			?(Time.now() + (180 * 24 * 60 * 60 * 1000000000)), // 180 days from now
			caller
		);
		let project1 = switch (project1Result) {
			case (#ok(p)) p;
			case (#err(e)) { summary #= "❌ Failed to create project 1: " # e # "\n"; return summary; };
		};
		summary #= "  ✓ Project #" # Nat.toText(project1.id) # ": " # project1.name # "\n";

		let project2Result = state.createProject(
			"Dharampur Rooftop Solar Initiative",
			"Dharampur, Gujarat, India",
			250, // 250 kW capacity
			"Distributed rooftop solar installation across 50 homes and small businesses",
			1200000, // 12 lakh rupees
			?(Time.now() + (120 * 24 * 60 * 60 * 1000000000)), // 120 days from now
			caller
		);
		let project2 = switch (project2Result) {
			case (#ok(p)) p;
			case (#err(e)) { summary #= "❌ Failed to create project 2: " # e # "\n"; return summary; };
		};
		summary #= "  ✓ Project #" # Nat.toText(project2.id) # ": " # project2.name # "\n";

		let project3Result = state.createProject(
			"Valsad Agricultural Solar Pumps",
			"Valsad District, Gujarat, India",
			100, // 100 kW capacity
			"Solar-powered irrigation pumps for 30 farming families",
			800000, // 8 lakh rupees
			?(Time.now() + (90 * 24 * 60 * 60 * 1000000000)), // 90 days from now
			caller
		);
		let project3 = switch (project3Result) {
			case (#ok(p)) p;
			case (#err(e)) { summary #= "❌ Failed to create project 3: " # e # "\n"; return summary; };
		};
		summary #= "  ✓ Project #" # Nat.toText(project3.id) # ": " # project3.name # "\n";

		// 2. Create Sample Proposals
		summary #= "\n📋 Creating sample proposals...\n";
		let proposal1 = state.createProposal({
			title = "Approve Urgam Valley Solar Farm";
			description = "Proposal to approve the construction of a 500kW solar farm in Urgam Valley with community ownership model";
			votesRequired = 100;
			category = #Project;
		});
		summary #= "  ✓ Proposal #" # Nat.toText(proposal1) # ": Urgam Valley Solar Farm\n";

		let proposal2 = state.createProposal({
			title = "Update DAO Governance Rules";
			description = "Proposal to reduce voting period from 7 days to 5 days for faster decision making";
			votesRequired = 150;
			category = #Governance;
		});
		summary #= "  ✓ Proposal #" # Nat.toText(proposal2) # ": Governance Rules Update\n";

		let proposal3 = state.createProposal({
			title = "Allocate Treasury Funds for Training";
			description = "Proposal to allocate 500,000 rupees for solar technician training program";
			votesRequired = 120;
			category = #Treasury;
		});
		summary #= "  ✓ Proposal #" # Nat.toText(proposal3) # ": Treasury Allocation\n";

		// Add some votes to proposals
		ignore state.vote(proposal1, true);
		ignore state.vote(proposal1, true);
		ignore state.vote(proposal2, true);
		ignore state.vote(proposal2, false);

		// 3. Mint Sample NFTs
		summary #= "\n🎫 Minting sample membership NFTs...\n";
		let nft1 = state.mintMembershipNFT({
			recipient = caller;
			tier = #Community;
			durationDays = 365;
		});
		switch (nft1) {
			case (#ok(tokenId)) {
				summary #= "  ✓ NFT #" # Nat.toText(tokenId) # ": Community Tier (365 days)\n";
			};
			case (#err(e)) {
				summary #= "  ✗ Failed to mint Community NFT: " # e # "\n";
			};
		};

		let nft2 = state.mintMembershipNFT({
			recipient = caller;
			tier = #Supporter;
			durationDays = 180;
		});
		switch (nft2) {
			case (#ok(tokenId)) {
				summary #= "  ✓ NFT #" # Nat.toText(tokenId) # ": Supporter Tier (180 days)\n";
			};
			case (#err(e)) {
				summary #= "  ✗ Failed to mint Supporter NFT: " # e # "\n";
			};
		};

		let nft3 = state.mintMembershipNFT({
			recipient = caller;
			tier = #Investor;
			durationDays = 730;
		});
		switch (nft3) {
			case (#ok(tokenId)) {
				summary #= "  ✓ NFT #" # Nat.toText(tokenId) # ": Investor Tier (730 days)\n";
			};
			case (#err(e)) {
				summary #= "  ✗ Failed to mint Investor NFT: " # e # "\n";
			};
		};

		// 4. Create Sample Applications
		summary #= "\n📝 Creating sample applications...\n";
		let app1 = state.submitApplication(
			#LandPartner,
			"5 Acre Land Partnership - Urgam Valley",
			"Offering 5 acres of agricultural land for solar farm development with 25-year lease agreement",
			{
				landSize = ?5;
				landLocation = ?"Urgam Valley, Gujarat - GPS: 20.5937° N, 73.0076° E";
				currentLandUse = ?"Agricultural - currently fallow";
				electricityAccess = ?true;
				technicalSkills = null;
				experience = null;
				availability = null;
				specialization = null;
				preferredRoles = null;
				workingHours = null;
				localKnowledge = null;
				investmentCapacity = null;
				investmentHorizon = null;
				riskTolerance = null;
				contactPhone = ?"+91-9876543210";
				contactEmail = ?"landowner@example.com";
				aadhaarNumber = ?"1234-5678-9012";
				bankAccount = ?"HDFC-123456789";
				references = ?["Village Sarpanch", "Local Cooperative"];
			},
			#High,
			?project1.id,
			caller
		);
		summary #= "  ✓ Application #" # Nat.toText(app1) # ": Land Partnership\n";

		let app2 = state.submitApplication(
			#TechCollaborator,
			"Solar Engineer - System Design & Installation",
			"Experienced solar engineer with 5 years in renewable energy sector, specializing in grid-tied systems",
			{
				landSize = null;
				landLocation = null;
				currentLandUse = null;
				electricityAccess = null;
				technicalSkills = ?["Solar PV Design", "Grid Integration", "SCADA Systems", "AutoCAD"];
				experience = ?5;
				availability = ?"Full-time";
				specialization = ?"Solar photovoltaic systems and grid integration";
				preferredRoles = null;
				workingHours = null;
				localKnowledge = null;
				investmentCapacity = null;
				investmentHorizon = null;
				riskTolerance = null;
				contactPhone = ?"+91-9876543211";
				contactEmail = ?"engineer@example.com";
				aadhaarNumber = ?"2345-6789-0123";
				bankAccount = ?"SBI-987654321";
				references = ?["Previous Employer - Solar Corp", "IIT Professor"];
			},
			#High,
			null,
			caller
		);
		summary #= "  ✓ Application #" # Nat.toText(app2) # ": Tech Collaborator\n";

		let app3 = state.submitApplication(
			#CommunityContributor,
			"Solar Panel Maintenance - Local Resident",
			"Local resident interested in panel cleaning and basic maintenance work",
			{
				landSize = null;
				landLocation = null;
				currentLandUse = null;
				electricityAccess = null;
				technicalSkills = null;
				experience = null;
				availability = null;
				specialization = null;
				preferredRoles = ?["Panel Cleaning", "Site Monitoring", "Basic Maintenance"];
				workingHours = ?"4 hours daily, flexible timing";
				localKnowledge = ?"Born and raised in Urgam Valley, fluent in Gujarati and Hindi";
				investmentCapacity = null;
				investmentHorizon = null;
				riskTolerance = null;
				contactPhone = ?"+91-9876543212";
				contactEmail = ?"resident@example.com";
				aadhaarNumber = ?"3456-7890-1234";
				bankAccount = ?"BOI-456789123";
				references = ?["Village Elder", "Local School Teacher"];
			},
			#Medium,
			?project1.id,
			caller
		);
		summary #= "  ✓ Application #" # Nat.toText(app3) # ": Community Contributor\n";

		let app4 = state.submitApplication(
			#Investor,
			"Investment Proposal - 500K INR",
			"Interested in investing 500,000 rupees in solar projects with 5-year horizon",
			{
				landSize = null;
				landLocation = null;
				currentLandUse = null;
				electricityAccess = null;
				technicalSkills = null;
				experience = null;
				availability = null;
				specialization = null;
				preferredRoles = null;
				workingHours = null;
				localKnowledge = null;
				investmentCapacity = ?500000;
				investmentHorizon = ?"Medium-term (5 years)";
				riskTolerance = ?"Moderate - seeking 8-12% annual returns";
				contactPhone = ?"+91-9876543213";
				contactEmail = ?"investor@example.com";
				aadhaarNumber = ?"4567-8901-2345";
				bankAccount = ?"ICICI-789123456";
				references = ?["Financial Advisor", "Business Partner"];
			},
			#High,
			?project2.id,
			caller
		);
		summary #= "  ✓ Application #" # Nat.toText(app4) # ": Investor\n";

		// 5. Create Sample Animal Care Reports
		summary #= "\n🐕 Creating sample animal care reports...\n";
		let report1 = state.submitAnimalReport(
			"Near Urgam Valley Primary School",
			"Injured stray dog with leg wound, provided first aid and water. Needs veterinary attention.",
			["photo1_dog_injury.jpg", "photo2_location.jpg"],
			?3,
			caller
		);
		summary #= "  ✓ Report #" # Nat.toText(report1) # ": Injured stray dog\n";

		let report2 = state.submitAnimalReport(
			"Village Square, Urgam Valley",
			"Fed 5 stray dogs and provided water bowls. Regular feeding spot established.",
			["photo1_feeding.jpg", "photo2_dogs.jpg", "photo3_water_bowls.jpg"],
			?3,
			caller
		);
		summary #= "  ✓ Report #" # Nat.toText(report2) # ": Community feeding initiative\n";

		// Add votes to animal reports
		ignore state.voteOnAnimalReport(report1, true);
		ignore state.voteOnAnimalReport(report1, true);
		ignore state.voteOnAnimalReport(report2, true);
		ignore state.voteOnAnimalReport(report2, true);
		ignore state.voteOnAnimalReport(report2, true); // This should validate it

		summary #= "\n✅ Seed data creation complete!\n";
		summary #= "\nSummary:\n";
		summary #= "  • Projects: 3\n";
		summary #= "  • Proposals: 3\n";
		summary #= "  • NFTs: 3\n";
		summary #= "  • Applications: 4\n";
		summary #= "  • Animal Reports: 2\n";
		summary #= "\nYou can now test the canister with populated data.\n";

		summary
	};
}
=======
persistent actor HHDAO {
  public query func version() : async Text {
    "HHDAO Fusion v1.0";
  };
  
  public query func greet(name : Text) : async Text {
    "Hello, " # name # "! Welcome to HHDAO Fusion";
  };
  
  public query func ping() : async Text {
    "pong";
  };
  
  public query func get_canisters() : async [Text] {
    ["hhdao", "governance", "identity", "auth", "treasury", "nft"];
  };
};
>>>>>>> 954253d5 (docs: refresh and clean up all documentation (README, repo summary, critical fixes, copilot context))
