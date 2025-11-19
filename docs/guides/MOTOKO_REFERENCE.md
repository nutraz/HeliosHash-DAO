# HeliosHash DAO Motoko Syntax Quick Reference

## Actor Patterns

### Basic Actor Structure

```motoko
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Time "mo:base/Time";

actor HeliosHashDAO {
    // Stable state (persists across upgrades)
    private stable var memberCount : Nat = 0;
    private stable var projectCounter : Nat = 0;

    // Runtime state
    private let projects = HashMap.HashMap<Nat, Project>(10, Nat.equal, Hash.hash);

    // Shared function with caller identity
    public shared ({ caller }) func createProject(
        name : Text,
        location : Text,
        capacity : Nat
    ) : async Result.Result<Project, Text> {
        // Implementation
    };

    // Query function (read-only, fast)
    public query func getProject(id : Nat) : async ?Project {
        projects.get(id)
    };
}
```

## Type Definitions

### Common Types for HeliosHash DAO

```motoko
// Enums using variant types
type ProjectStatus = {
    #Planning;
    #Active;
    #Completed;
    #Cancelled;
};

type ProposalType = {
    #Project;
    #Governance;
    #Treasury;
    #Community;
};

// Record types
type Project = {
    id : Nat;
    name : Text;
    location : Text;
    capacity : Nat;
    creator : Principal;
    status : ProjectStatus;
    createdAt : Int;
    funding : Nat;
};

type Proposal = {
    id : Nat;
    title : Text;
    description : Text;
    proposer : Principal;
    proposalType : ProposalType;
    votesFor : Nat;
    votesAgainst : Nat;
    status : ProposalStatus;
    createdAt : Int;
    votingDeadline : Int;
};
```

## Error Handling Patterns

### Using Result Types

```motoko
public func validateProject(project : Project) : Result.Result<(), Text> {
    if (Text.size(project.name) == 0) {
        return #err("Project name cannot be empty");
    };

    if (project.capacity == 0) {
        return #err("Project capacity must be greater than 0");
    };

    #ok(())
};

// Using switch for pattern matching
public func processResult(result : Result.Result<Project, Text>) : Text {
    switch (result) {
        case (#ok(project)) {
            "Project " # project.name # " created successfully";
        };
        case (#err(message)) {
            "Error: " # message;
        };
    }
};
```

### Option Types

```motoko
public func findProject(id : Nat) : ?Project {
    projects.get(id)
};

public func processProject(projectOpt : ?Project) : Text {
    switch (projectOpt) {
        case (?project) {
            "Found project: " # project.name;
        };
        case (null) {
            "Project not found";
        };
    }
};
```

## Collections and Data Structures

### HashMap Usage

```motoko
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";

// Initialize HashMap
private let members = HashMap.HashMap<Principal, Member>(
    10,
    Principal.equal,
    Principal.hash
);

// Add to HashMap
members.put(caller, newMember);

// Get from HashMap
switch (members.get(caller)) {
    case (?member) { /* Found */ };
    case (null) { /* Not found */ };
};

// Iterate over HashMap
for ((principal, member) in members.entries()) {
    Debug.print("Member: " # Principal.toText(principal));
};
```

### Array Operations

```motoko
import Array "mo:base/Array";

// Create array
let numbers : [Nat] = [1, 2, 3, 4, 5];

// Filter array
let evenNumbers = Array.filter<Nat>(numbers, func(n) { n % 2 == 0 });

// Map array
let doubled = Array.map<Nat, Nat>(numbers, func(n) { n * 2 });

// Find in array
let found = Array.find<Nat>(numbers, func(n) { n == 3 });
```

## Inter-Canister Communication

### Calling Other Canisters

```motoko
// Define interface for other canister
let daoCanister = actor "canister-id" : actor {
    createProposal : (Text, Text, ProposalType) -> async Result.Result<Nat, Text>;
    vote : (Nat, Bool) -> async Result.Result<Text, Text>;
};

// Call other canister
public func createDAOProposal(title : Text, description : Text) : async Result.Result<Nat, Text> {
    try {
        await daoCanister.createProposal(title, description, #Project)
    } catch (error) {
        #err("Failed to create proposal: " # Error.message(error))
    }
};
```

## Common Utility Functions

### Time Handling

```motoko
import Time "mo:base/Time";

// Get current time
let now = Time.now();

// Time comparison
public func isExpired(deadline : Int) : Bool {
    Time.now() > deadline
};
```

### Text Operations

```motoko
import Text "mo:base/Text";

// Concatenation
let fullName = firstName # " " # lastName;

// Size check
if (Text.size(input) == 0) {
    // Handle empty string
};

// Text comparison
Text.equal(str1, str2)
```

### Debug and Logging

```motoko
import Debug "mo:base/Debug";

// Print debug messages (only in development)
Debug.print("Project created with ID: " # Nat.toText(projectId));
```

## Security Patterns

### Access Control

```motoko
// Admin-only functions
private func isAdmin(caller : Principal) : Bool {
    let adminPrincipal = Principal.fromText("admin-principal-id");
    Principal.equal(caller, adminPrincipal)
};

public shared ({ caller }) func adminFunction() : async Result.Result<Text, Text> {
    if (not isAdmin(caller)) {
        return #err("Unauthorized: Admin access required");
    };

    // Admin logic here
    #ok("Operation completed")
};

// Member verification
private func isMember(caller : Principal) : Bool {
    switch (members.get(caller)) {
        case (?member) { true };
        case (null) { false };
    }
};
```

### Input Validation

```motoko
private func validateTextInput(text : Text, maxLength : Nat) : Result.Result<(), Text> {
    if (Text.size(text) == 0) {
        return #err("Input cannot be empty");
    };

    if (Text.size(text) > maxLength) {
        return #err("Input exceeds maximum length of " # Nat.toText(maxLength));
    };

    #ok(())
};
```

## Upgrade Patterns

### Stable Variables

```motoko
// Data that persists across canister upgrades
private stable var memberCount : Nat = 0;
private stable var projectEntries : [(Nat, Project)] = [];

// Pre-upgrade hook
system func preupgrade() {
    projectEntries := Iter.toArray(projects.entries());
};

// Post-upgrade hook
system func postupgrade() {
    projects := HashMap.fromIter<Nat, Project>(
        projectEntries.vals(),
        projectEntries.size(),
        Nat.equal,
        Hash.hash
    );
    projectEntries := [];
};
```

This reference guide provides the essential Motoko patterns used in HeliosHash DAO development.
