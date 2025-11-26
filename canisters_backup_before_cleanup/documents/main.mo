


 audit-clean

persistent actor Documents {
    // Data Types
    public type DocumentType = {
        #Legal;
        #Technical;
        #Financial;
        #Environmental;
        #Certificate;
        #Report;
        #Image;
        #Video;
        #Other: Text;
    };

    public type DocumentStatus = {
        #Draft;
        #Submitted;
        #UnderReview;
        #Approved;
        #Rejected;
        #Archived;
    };

    public type AccessLevel = {
        #Public;
        #Private;
        #DAO;
        #Restricted: [Principal];
    };

    public type Document = {
        id: Text;
        name: Text;
        description: ?Text;
        documentType: DocumentType;
        mimeType: Text;
        size: Nat;
        hash: Text; // IPFS hash or content hash
        owner: Principal;
        status: DocumentStatus;
        accessLevel: AccessLevel;
        createdAt: Int;
        updatedAt: Int;
        version: Nat;
        tags: [Text];
        metadata: [(Text, Text)];
    };

    public type DocumentWorkflow = {
        id: Nat;
        documentId: Text;
        workflowType: WorkflowType;
        status: WorkflowStatus;
        assignedTo: ?Principal;
        createdBy: Principal;
        createdAt: Int;
        completedAt: ?Int;
        steps: [WorkflowStep];
        currentStep: Nat;
    };

    public type WorkflowType = {
        #Approval;
        #Review;
        #Certification;
        #Audit;
        #Custom: Text;
    };

    public type WorkflowStatus = {
        #Pending;
        #InProgress;
        #Completed;
        #Cancelled;
    };

    public type WorkflowStep = {
        id: Nat;
        name: Text;
        description: Text;
        assignedTo: ?Principal;
        status: StepStatus;
        completedAt: ?Int;
        comments: ?Text;
        required: Bool;
    };

    public type StepStatus = {
        #NotStarted;
        #InProgress;
        #Completed;
        #Skipped;
    };

    public type DocumentShare = {
        documentId: Text;
        sharedWith: Principal;
        sharedBy: Principal;
        accessLevel: ShareAccessLevel;
        expiresAt: ?Int;
        createdAt: Int;
    };

    public type ShareAccessLevel = {
        #Read;
        #Comment;
        #Edit;
    };

    public type DocumentVersion = {
        documentId: Text;
        version: Nat;
        hash: Text;
        changedBy: Principal;
        changeNote: ?Text;
        timestamp: Int;
    };

    // Stable storage
    private var workflowCounter: Nat = 0;
    private var documentEntries: [(Text, Document)] = [];
    private var workflowEntries: [(Nat, DocumentWorkflow)] = [];
    private var shareEntries: [(Text, DocumentShare)] = []; // key: documentId_principal
    private var versionEntries: [(Text, [DocumentVersion])] = []; // key: documentId

    // In-memory maps
    private transient var documents = HashMap.fromIter<Text, Document>(documentEntries.vals(), 10, Text.equal, Text.hash);
    private transient var workflows = HashMap.fromIter<Nat, DocumentWorkflow>(workflowEntries.vals(), 10, Nat.equal, func(n: Nat): Nat32 { Nat32.fromNat(n % 100000) });
    private transient var shares = HashMap.fromIter<Text, DocumentShare>(shareEntries.vals(), 10, Text.equal, Text.hash);
    private transient var versions = HashMap.fromIter<Text, [DocumentVersion]>(versionEntries.vals(), 10, Text.equal, Text.hash);

    // System functions for upgrades
    system func preupgrade() {
        documentEntries := Iter.toArray(documents.entries());
        workflowEntries := Iter.toArray(workflows.entries());
        shareEntries := Iter.toArray(shares.entries());
        versionEntries := Iter.toArray(versions.entries());
    };

    system func postupgrade() {
        documentEntries := [];
        workflowEntries := [];
        shareEntries := [];
        versionEntries := [];
    };

    // Helper functions
    func generateDocumentId(): Text {
        "doc_" # Int.toText(Time.now()) # "_" # Nat.toText(documents.size())
    };

    func hasDocumentAccess(documentId: Text, caller: Principal): Bool {
        switch (documents.get(documentId)) {
            case (null) { false };
            case (?doc) {
                if (doc.owner == caller) { return true };
                
                switch (doc.accessLevel) {
                    case (#Public) { true };
                    case (#Private) { false };
                    case (#DAO) { true }; // In real implementation, check DAO membership
                    case (#Restricted(principals)) {
                        Array.find<Principal>(principals, func(p: Principal): Bool { p == caller }) != null
                    };
                }
            };
        }
    };

    func getShareKey(documentId: Text, principal: Principal): Text {
        documentId # "_" # Principal.toText(principal)
    };

    // Public functions
    public shared ({ caller }) func uploadDocument(
        name: Text,
        description: ?Text,
        documentType: DocumentType,
        mimeType: Text,
        size: Nat,
        hash: Text,
        accessLevel: AccessLevel,
        tags: [Text],
        metadata: [(Text, Text)]
    ): async Result.Result<Document, Text> {
        if (Principal.isAnonymous(caller)) {
            return #err("Anonymous principal cannot upload documents");
        };

        let documentId = generateDocumentId();
        let document: Document = {
            id = documentId;
            name = name;
            description = description;
            documentType = documentType;
            mimeType = mimeType;
            size = size;
            hash = hash;
            owner = caller;
            status = #Draft;
            accessLevel = accessLevel;
            createdAt = Time.now();
            updatedAt = Time.now();
            version = 1;
            tags = tags;
            metadata = metadata;
        };

        documents.put(documentId, document);
        
        // Initialize version history
        let initialVersion: DocumentVersion = {
            documentId = documentId;
            version = 1;
            hash = hash;
            changedBy = caller;
            changeNote = ?"Initial upload";
            timestamp = Time.now();
        };
        versions.put(documentId, [initialVersion]);

        #ok(document)
    };

    public shared ({ caller }) func updateDocument(
        documentId: Text,
        name: ?Text,
        description: ?Text,
        newHash: ?Text,
        accessLevel: ?AccessLevel,
        tags: ?[Text],
        changeNote: ?Text
    ): async Result.Result<Document, Text> {
        switch (documents.get(documentId)) {
            case (null) { #err("Document not found") };
            case (?doc) {
                if (doc.owner != caller) {
                    return #err("Only document owner can update");
                };

                let updatedDoc = {
                    doc with
                    name = switch (name) { case (?n) n; case (null) doc.name };
                    description = switch (description) { case (?d) ?d; case (null) doc.description };
                    accessLevel = switch (accessLevel) { case (?a) a; case (null) doc.accessLevel };
                    tags = switch (tags) { case (?t) t; case (null) doc.tags };
                    updatedAt = Time.now();
                    version = if (newHash != null) { doc.version + 1 } else { doc.version };
                };

                documents.put(documentId, updatedDoc);

                // Add version if hash changed
                switch (newHash) {
                    case (?hash) {
                        let existingVersions = switch (versions.get(documentId)) {
                            case (?v) v;
                            case (null) [];
                        };

                        let newVersion: DocumentVersion = {
                            documentId = documentId;
                            version = updatedDoc.version;
                            hash = hash;
                            changedBy = caller;
                            changeNote = changeNote;
                            timestamp = Time.now();
                        };

                        versions.put(documentId, Array.append(existingVersions, [newVersion]));
                    };
                    case (null) {};
                };

                #ok(updatedDoc)
            };
        }
    };

    public query ({ caller }) func getDocument(documentId: Text): async Result.Result<Document, Text> {
        if (not hasDocumentAccess(documentId, caller)) {
            return #err("Access denied");
        };

        switch (documents.get(documentId)) {
            case (?doc) { #ok(doc) };
            case (null) { #err("Document not found") };
        }
    };

    public query ({ caller }) func getMyDocuments(): async [Document] {
        let allDocs = Iter.toArray(documents.vals());
        Array.filter<Document>(allDocs, func(doc: Document): Bool {
            doc.owner == caller
        })
    };

    public query ({ caller }) func getAccessibleDocuments(): async [Document] {
        let allDocs = Iter.toArray(documents.vals());
        Array.filter<Document>(allDocs, func(doc: Document): Bool {
            hasDocumentAccess(doc.id, caller)
        })
    };

    public shared ({ caller }) func shareDocument(
        documentId: Text,
        shareWith: Principal,
        accessLevel: ShareAccessLevel,
        expiresAt: ?Int
    ): async Result.Result<Text, Text> {
        switch (documents.get(documentId)) {
            case (null) { #err("Document not found") };
            case (?doc) {
                if (doc.owner != caller) {
                    return #err("Only document owner can share");
                };

                let shareKey = getShareKey(documentId, shareWith);
                let share: DocumentShare = {
                    documentId = documentId;
                    sharedWith = shareWith;
                    sharedBy = caller;
                    accessLevel = accessLevel;
                    expiresAt = expiresAt;
                    createdAt = Time.now();
                };

                shares.put(shareKey, share);
                #ok("Document shared successfully")
            };
        }
    };

    public shared ({ caller }) func startWorkflow(
        documentId: Text,
        workflowType: WorkflowType,
        steps: [Text], // Step names
        assignTo: ?Principal
    ): async Result.Result<Nat, Text> {
        if (not hasDocumentAccess(documentId, caller)) {
            return #err("Access denied");
        };

        workflowCounter += 1;
        let workflowId = workflowCounter;

        let workflowSteps = Array.tabulate<WorkflowStep>(steps.size(), func(i: Nat): WorkflowStep {
            let stepName = steps[i];
                {
                    id = i;
                    name = stepName;
                    description = "Step: " # stepName;
                    assignedTo = if (i == 0) assignTo else null;
                    status = if (i == 0) #NotStarted else #NotStarted;
                    completedAt = null;
                    comments = null;
                    required = true;
                }
            }
        );

        let workflow: DocumentWorkflow = {
            id = workflowId;
            documentId = documentId;
            workflowType = workflowType;
            status = #Pending;
            assignedTo = assignTo;
            createdBy = caller;
            createdAt = Time.now();
            completedAt = null;
            steps = workflowSteps;
            currentStep = 0;
        };

        workflows.put(workflowId, workflow);
        #ok(workflowId)
    };

    public shared ({ caller }) func completeWorkflowStep(
        workflowId: Nat,
        stepId: Nat,
        comments: ?Text
    ): async Result.Result<Text, Text> {
        switch (workflows.get(workflowId)) {
            case (null) { #err("Workflow not found") };
            case (?workflow) {
                if (stepId >= workflow.steps.size()) {
                    return #err("Invalid step ID");
                };

                // Check if caller is assigned to this step
                let step = workflow.steps[stepId];
                switch (step.assignedTo) {
                    case (?assigned) {
                        if (assigned != caller) {
                            return #err("Not assigned to this step");
                        };
                    };
                    case (null) {
                        // Anyone can complete if not specifically assigned
                    };
                };

                // Update step
                let updatedSteps = Array.tabulate<WorkflowStep>(workflow.steps.size(), func(i: Nat): WorkflowStep {
                    let s = workflow.steps[i];
                        if (i == stepId) {
                            {
                                s with
                                status = #Completed;
                                completedAt = ?Time.now();
                                comments = comments;
                            }
                        } else {
                            s
                        }
                    }
                );

                // Check if all steps are completed
                let allCompleted = Array.foldLeft<WorkflowStep, Bool>(
                    updatedSteps,
                    true,
                    func(acc: Bool, step: WorkflowStep): Bool {
                        acc and (step.status == #Completed or not step.required)
                    }
                );

                let updatedWorkflow = {
                    workflow with
                    steps = updatedSteps;
                    status = if (allCompleted) #Completed else #InProgress;
                    completedAt = if (allCompleted) ?Time.now() else null;
                };

                workflows.put(workflowId, updatedWorkflow);

                // Update document status if workflow is completed
                if (allCompleted) {
                    switch (documents.get(workflow.documentId)) {
                        case (?doc) {
                            let updatedDoc = {
                                doc with
                                status = switch (workflow.workflowType) {
                                    case (#Approval) #Approved;
                                    case (#Review) #UnderReview;
                                    case (#Certification) #Approved;
                                    case (#Audit) #UnderReview;
                                    case (#Custom(_)) #UnderReview;
                                };
                                updatedAt = Time.now();
                            };
                            documents.put(workflow.documentId, updatedDoc);
                        };
                        case (null) {};
                    };
                };

                #ok("Step completed successfully")
            };
        }
    };

    public query func getWorkflow(workflowId: Nat): async ?DocumentWorkflow {
        workflows.get(workflowId)
    };

    public query ({ caller }) func getDocumentWorkflows(documentId: Text): async [DocumentWorkflow] {
        if (not hasDocumentAccess(documentId, caller)) {
            return [];
        };

        let allWorkflows = Iter.toArray(workflows.vals());
        Array.filter<DocumentWorkflow>(allWorkflows, func(w: DocumentWorkflow): Bool {
            w.documentId == documentId
        })
    };

    public query ({ caller }) func getMyWorkflows(): async [DocumentWorkflow] {
        let allWorkflows = Iter.toArray(workflows.vals());
        Array.filter<DocumentWorkflow>(allWorkflows, func(w: DocumentWorkflow): Bool {
            w.createdBy == caller or
            (switch (w.assignedTo) { case (?assigned) assigned == caller; case (null) false }) or
            Array.find<WorkflowStep>(w.steps, func(step: WorkflowStep): Bool {
                switch (step.assignedTo) { case (?assigned) assigned == caller; case (null) false }
            }) != null
        })
    };

    public query func getDocumentVersions(documentId: Text): async ?[DocumentVersion] {
        versions.get(documentId)
    };

    public query ({ caller }) func searchDocuments(
        searchQuery: Text,
        documentType: ?DocumentType,
        tags: ?[Text]
    ): async [Document] {
        let allDocs = Iter.toArray(documents.vals());
        Array.filter<Document>(allDocs, func(doc: Document): Bool {
            if (not hasDocumentAccess(doc.id, caller)) {
                return false;
            };

            let nameMatch = Text.contains(doc.name, #text searchQuery);
            let descMatch = switch (doc.description) {
                case (?desc) Text.contains(desc, #text searchQuery);
                case (null) false;
            };

            let typeMatch = switch (documentType) {
                case (?reqType) doc.documentType == reqType;
                case (null) true;
            };

            let tagMatch = switch (tags) {
                case (?reqTags) {
                    Array.find<Text>(reqTags, func(reqTag: Text): Bool {
                        Array.find<Text>(doc.tags, func(docTag: Text): Bool {
                            docTag == reqTag
                        }) != null
                    }) != null
                };
                case (null) true;
            };

            (nameMatch or descMatch) and typeMatch and tagMatch
        })
    };

    public query func getDocumentStats(): async {
        totalDocuments: Nat;
        documentsByType: [(DocumentType, Nat)];
        documentsByStatus: [(DocumentStatus, Nat)];
        totalWorkflows: Nat;
        activeWorkflows: Nat;
    } {
        let allDocs = Iter.toArray(documents.vals());
        let allWorkflows = Iter.toArray(workflows.vals());

        // Count by type (simplified)
        var legalCount: Nat = 0;
        var technicalCount: Nat = 0;
        var financialCount: Nat = 0;
        var certificateCount: Nat = 0;
        var otherCount: Nat = 0;

        // Count by status
        var draftCount: Nat = 0;
        var submittedCount: Nat = 0;
        var reviewCount: Nat = 0;
        var approvedCount: Nat = 0;
        var rejectedCount: Nat = 0;
        var archivedCount: Nat = 0;

        for (doc in allDocs.vals()) {
            switch (doc.documentType) {
                case (#Legal) { legalCount += 1 };
                case (#Technical) { technicalCount += 1 };
                case (#Financial) { financialCount += 1 };
                case (#Certificate) { certificateCount += 1 };
                case (_) { otherCount += 1 };
            };

            switch (doc.status) {
                case (#Draft) { draftCount += 1 };
                case (#Submitted) { submittedCount += 1 };
                case (#UnderReview) { reviewCount += 1 };
                case (#Approved) { approvedCount += 1 };
                case (#Rejected) { rejectedCount += 1 };
                case (#Archived) { archivedCount += 1 };
            };
        };

        let activeWorkflowCount = Array.filter<DocumentWorkflow>(allWorkflows, func(w: DocumentWorkflow): Bool {
            w.status == #InProgress or w.status == #Pending
        }).size();

        {
            totalDocuments = documents.size();
            documentsByType = [
                (#Legal, legalCount),
                (#Technical, technicalCount),
                (#Financial, financialCount),
                (#Certificate, certificateCount)
            ];
            documentsByStatus = [
                (#Draft, draftCount),
                (#Submitted, submittedCount),
                (#UnderReview, reviewCount),
                (#Approved, approvedCount),
                (#Rejected, rejectedCount),
                (#Archived, archivedCount)
            ];
            totalWorkflows = workflows.size();
            activeWorkflows = activeWorkflowCount;
        }
    };
}
