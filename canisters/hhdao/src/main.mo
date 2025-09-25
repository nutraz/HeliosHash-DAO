
import HHDAOLib "lib";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Time "mo:base/Time";

// Inter-canister communication
actor class HHDAO() {
	// Canister references - these would be set during deployment
	let dao_canister = actor "bkyz2-fmaaa-aaaaa-qaaaq-cai" : actor {
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
	};

	let identity_canister = actor "be2us-64aaa-aaaaa-qaabq-cai" : actor {
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
	};

	let telemetry_canister = actor "bd3sg-teaaa-aaaaa-qaaiq-cai" : actor {
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
	};

	let documents_canister = actor "bw4dl-smaaa-aaaaa-qaacq-cai" : actor {
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
	};

	// Local state for project management
	private stable let state = HHDAOLib.HHDAOState();

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
		
		// Create a DAO proposal for the project
		let proposalResult = await dao_canister.createProposal(
			"Project Proposal: " # name,
			"Proposal for solar project: " # description,
			#Project,
			7, // 7 days voting period
			?"project_id:" # Nat.toText(project.id)
		);

		switch (proposalResult) {
			case (#ok(proposalId)) {
				// Project created and proposal submitted successfully
				#ok(project)
			};
			case (#err(error)) {
				// Log error but still return the project as it was created locally
				#ok(project)
			};
		}
	};

	// Enhanced user onboarding
	public shared ({ caller }) func joinPlatform(
		username: ?Text,
		email: ?Text,
		displayName: ?Text
	) : async Result.Result<Text, Text> {
		// Create identity profile
		let profileResult = await identity_canister.createProfile(username, email, displayName);
		
		switch (profileResult) {
			case (#ok(profile)) {
				// Join the DAO
				let daoResult = await dao_canister.joinDAO();
				switch (daoResult) {
					case (#ok(member)) {
						#ok("Successfully joined HHDAO platform with profile and DAO membership")
					};
					case (#err(error)) {
						#ok("Profile created but DAO join failed: " # error)
					};
				}
			};
			case (#err(error)) {
				#err("Failed to create profile: " # error)
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

		let deviceResult = await telemetry_canister.registerDevice(
			deviceId,
			deviceName,
			deviceType,
			location,
			metadata
		);

		switch (deviceResult) {
			case (#ok(device)) {
				#ok("Device registered successfully: " # device.id)
			};
			case (#err(error)) {
				#err("Device registration failed: " # error)
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

		let docResult = await documents_canister.uploadDocument(
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
			case (#ok(document)) {
				#ok("Document uploaded successfully: " # document.id)
			};
			case (#err(error)) {
				#err("Document upload failed: " # error)
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
		let userProfile = await identity_canister.getProfile(caller);
		let userProjects = state.getUserProjects(caller);
		let userDevices = await telemetry_canister.getMyDevices();
		let userDocuments = await documents_canister.getMyDocuments();

		{
			userProfile = userProfile;
			projects = userProjects;
			devices = userDevices;
			documents = userDocuments;
		}
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
		let proposalType = switch (proposal.category) {
			case (#Project) { #Project };
			case (#Governance) { #Governance };
			case (#Treasury) { #Treasury };
			case (#Community) { #Community };
		};

		await dao_canister.createProposal(
			proposal.title,
			proposal.description,
			proposalType,
			proposal.votesRequired,
			null
		)
	};

	public shared ({ caller }) func vote(proposalId : Nat, inFavor : Bool) : async Result.Result<Text, Text> {
		await dao_canister.vote(proposalId, inFavor)
	};

	public query func getProposal(proposalId : Nat) : async ?{
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
		await dao_canister.getProposal(proposalId)
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
}
