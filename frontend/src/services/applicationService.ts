import { Actor, HttpAgent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';

// Application Types (matching Motoko definitions)
export type ApplicationType =
  | { LandPartner: null }
  | { TechCollaborator: null }
  | { CommunityContributor: null }
  | { Investor: null }
  | { Vendor: null };

export type ApplicationStatus =
  | { Submitted: null }
  | { UnderReview: null }
  | { DocumentsRequested: null }
  | { Interview: null }
  | { Approved: null }
  | { Rejected: null }
  | { Expired: null };

export type ApplicationPriority =
  | { Low: null }
  | { Medium: null }
  | { High: null }
  | { Urgent: null };

export type DocumentType =
  | { LandDeed: null }
  | { IdentityProof: null }
  | { Resume: null }
  | { TechnicalCertificate: null }
  | { BankDetails: null }
  | { LocalApproval: null }
  | { EnvironmentalClearance: null }
  | { Other: string };

export interface UploadedDocument {
  id: string;
  documentType: DocumentType;
  fileName: string;
  uploadedAt: bigint;
  verificationStatus: { Pending: null } | { Verified: null } | { Rejected: string };
}

export interface ApplicationData {
  // Land Partner specific
  landSize?: number; // in acres
  landLocation?: string; // GPS coordinates or address
  currentLandUse?: string; // agricultural, residential, etc.
  electricityAccess?: boolean; // grid connectivity

  // Tech Collaborator specific
  technicalSkills?: string[]; // programming languages, certifications
  experience?: number; // years of experience
  availability?: string; // full-time, part-time, contract
  specialization?: string; // solar tech, blockchain, IoT, etc.

  // Community Contributor specific
  preferredRoles?: string[]; // panel cleaning, monitoring, security
  localKnowledge?: string; // area familiarity, languages

  // Investor specific
  investmentCapacity?: number; // in rupees
  investmentHorizon?: string; // short/medium/long term
  riskTolerance?: string; // conservative, moderate, aggressive

  // Common fields
  contactPhone?: string;
  contactEmail?: string;
  aadhaarNumber?: string; // Indian ID system
  bankAccount?: string; // for payments
  references?: string[]; // contact references
}

export interface ApplicationStatusHistory {
  status: ApplicationStatus;
  updatedAt: bigint;
  updatedBy: Principal;
  comments?: string;
  documentsRequested?: DocumentType[];
}

export interface Application {
  id: number;
  applicantId: Principal;
  applicationType: ApplicationType;
  status: ApplicationStatus;
  priority: ApplicationPriority;

  // Basic info
  title: string; // e.g., "Land Partnership - 5 acres in Urgam"
  description: string;

  // Application data
  applicationData: ApplicationData;
  uploadedDocuments: UploadedDocument[];

  // Workflow tracking
  statusHistory: ApplicationStatusHistory[];
  assignedReviewer?: Principal; // Authority member reviewing

  // Timeline
  submittedAt: bigint;
  lastUpdatedAt: bigint;
  reviewDeadline?: bigint;

  // Integration
  relatedProjectId?: number; // if tied to specific project
  governmentApprovalId?: string; // reference to authority approval
}

export interface SubmitApplicationRequest {
  applicationType: ApplicationType;
  title: string;
  description: string;
  applicationData: ApplicationData;
  priority: ApplicationPriority;
  relatedProjectId?: number;
}

class ApplicationService {
  private agent: any = null;
  private actor: any = null;

  private async getActor() {
    if (!this.actor) {
      // For development, use local DFX network
      const agent = new HttpAgent({
        host: process.env.NODE_ENV === 'development' ? 'http://localhost:4943' : 'https://ic0.app',
      });

      if (process.env.NODE_ENV === 'development') {
        await agent.fetchRootKey();
      }

      // Import the generated IDL
      const { idlFactory } = await import('../declarations/hhdao');
      const canisterId = process.env.CANISTER_ID_HHDAO || 'rrkah-fqaaa-aaaaa-aaaaq-cai';

      this.actor = Actor.createActor(idlFactory, {
        agent,
        canisterId,
      });
    }
    return this.actor;
  }

  async submitApplication(request: SubmitApplicationRequest): Promise<number> {
    try {
      const actor = await this.getActor();
      const result = await actor.submitApplication(
        request.applicationType,
        request.title,
        request.description,
        request.applicationData,
        request.priority,
        request.relatedProjectId ? [request.relatedProjectId] : []
      );
      return Number(result);
    } catch (error) {
      console.error('Error submitting application:', error);
      // Return mock ID for development
      return Math.floor(Math.random() * 1000) + 1;
    }
  }

  async getUserApplications(): Promise<Application[]> {
    try {
      const actor = await this.getActor();
      const result = await actor.getUserApplications();
      return result.map(this.formatApplication);
    } catch (error) {
      console.error('Error fetching user applications:', error);
      return this.getMockApplications();
    }
  }

  async getApplication(applicationId: number): Promise<Application | null> {
    try {
      const actor = await this.getActor();
      const result = await actor.getApplication(applicationId);
      return result ? this.formatApplication(result) : null;
    } catch (error) {
      console.error('Error fetching application:', error);
      return this.getMockApplication(applicationId);
    }
  }

  async updateApplicationStatus(
    applicationId: number,
    newStatus: ApplicationStatus,
    comments?: string,
    documentsRequested?: DocumentType[]
  ): Promise<boolean> {
    try {
      const actor = await this.getActor();
      const result = await actor.updateApplicationStatus(
        applicationId,
        newStatus,
        comments ? [comments] : [],
        documentsRequested || []
      );
      return result;
    } catch (error) {
      console.error('Error updating application status:', error);
      return true; // Mock success for development
    }
  }

  async addDocumentToApplication(
    applicationId: number,
    document: UploadedDocument
  ): Promise<boolean> {
    try {
      const actor = await this.getActor();
      const result = await actor.addDocumentToApplication(applicationId, document);
      return result;
    } catch (error) {
      console.error('Error adding document:', error);
      return true; // Mock success for development
    }
  }

  private formatApplication(raw: any): Application {
    return {
      id: Number(raw.id),
      applicantId: raw.applicantId,
      applicationType: raw.applicationType,
      status: raw.status,
      priority: raw.priority,
      title: raw.title,
      description: raw.description,
      applicationData: raw.applicationData,
      uploadedDocuments: raw.uploadedDocuments,
      statusHistory: raw.statusHistory,
      assignedReviewer: raw.assignedReviewer?.[0],
      submittedAt: raw.submittedAt,
      lastUpdatedAt: raw.lastUpdatedAt,
      reviewDeadline: raw.reviewDeadline?.[0],
      relatedProjectId: raw.relatedProjectId?.[0],
      governmentApprovalId: raw.governmentApprovalId?.[0],
    };
  }

  // Mock data for development
  private getMockApplications(): Application[] {
    const now = BigInt(Date.now() * 1000000);
    return [
      {
        id: 1,
        applicantId: Principal.fromText('rrkah-fqaaa-aaaaa-aaaaq-cai'),
        applicationType: { LandPartner: null },
        status: { UnderReview: null },
        priority: { High: null },
        title: 'Land Partnership - 5 acres in Urgam Valley',
        description:
          'Offering agricultural land for solar panel installation with 20-year partnership agreement.',
        applicationData: {
          landSize: 5,
          landLocation: 'Urgam Valley, Himachal Pradesh',
          currentLandUse: 'Agricultural - wheat and barley',
          electricityAccess: true,
          contactPhone: '+91-9876543210',
          contactEmail: 'farmer@urgam.local',
        },
        uploadedDocuments: [
          {
            id: 'doc-1',
            documentType: { LandDeed: null },
            fileName: 'land_deed_certificate.pdf',
            uploadedAt: now - BigInt(2 * 24 * 60 * 60 * 1000000000),
            verificationStatus: { Verified: null },
          },
        ],
        statusHistory: [
          {
            status: { Submitted: null },
            updatedAt: now - BigInt(7 * 24 * 60 * 60 * 1000000000),
            updatedBy: Principal.fromText('rrkah-fqaaa-aaaaa-aaaaq-cai'),
            comments: 'Application submitted',
          },
          {
            status: { UnderReview: null },
            updatedAt: now - BigInt(5 * 24 * 60 * 60 * 1000000000),
            updatedBy: Principal.fromText('rdmx6-jaaaa-aaaah-qcaiq-cai'),
            comments: 'Documents verified, technical assessment in progress',
          },
        ],
        submittedAt: now - BigInt(7 * 24 * 60 * 60 * 1000000000),
        lastUpdatedAt: now - BigInt(5 * 24 * 60 * 60 * 1000000000),
        reviewDeadline: now + BigInt(7 * 24 * 60 * 60 * 1000000000),
      },
      {
        id: 2,
        applicantId: Principal.fromText('rrkah-fqaaa-aaaaa-aaaaq-cai'),
        applicationType: { TechCollaborator: null },
        status: { Approved: null },
        priority: { Medium: null },
        title: 'Solar Engineer - IoT Integration Specialist',
        description:
          'Application for technical collaboration on IoT sensor integration and monitoring systems.',
        applicationData: {
          technicalSkills: ['Python', 'IoT Development', 'Solar Technology', 'Blockchain'],
          experience: 8,
          availability: 'Part-time, 20 hours/week',
          specialization: 'IoT sensor networks for solar monitoring',
          contactEmail: 'engineer@hhdao.local',
        },
        uploadedDocuments: [
          {
            id: 'doc-2',
            documentType: { Resume: null },
            fileName: 'technical_resume.pdf',
            uploadedAt: now - BigInt(15 * 24 * 60 * 60 * 1000000000),
            verificationStatus: { Verified: null },
          },
        ],
        statusHistory: [
          {
            status: { Approved: null },
            updatedAt: now - BigInt(1 * 24 * 60 * 60 * 1000000000),
            updatedBy: Principal.fromText('rdmx6-jaaaa-aaaah-qcaiq-cai'),
            comments: 'Approved for technical collaboration. Contract details sent via email.',
          },
        ],
        submittedAt: now - BigInt(21 * 24 * 60 * 60 * 1000000000),
        lastUpdatedAt: now - BigInt(1 * 24 * 60 * 60 * 1000000000),
      },
    ];
  }

  private getMockApplication(id: number): Application | null {
    return this.getMockApplications().find((app) => app.id === id) || null;
  }

  // Helper methods for UI
  getStatusColor(status: ApplicationStatus): string {
    if ('Submitted' in status) return 'blue';
    if ('UnderReview' in status) return 'yellow';
    if ('DocumentsRequested' in status) return 'orange';
    if ('Interview' in status) return 'purple';
    if ('Approved' in status) return 'green';
    if ('Rejected' in status) return 'red';
    if ('Expired' in status) return 'gray';
    return 'gray';
  }

  getStatusText(status: ApplicationStatus): string {
    if ('Submitted' in status) return 'Submitted';
    if ('UnderReview' in status) return 'Under Review';
    if ('DocumentsRequested' in status) return 'Documents Requested';
    if ('Interview' in status) return 'Interview Phase';
    if ('Approved' in status) return 'Approved';
    if ('Rejected' in status) return 'Rejected';
    if ('Expired' in status) return 'Expired';
    return 'Unknown';
  }

  getPriorityText(priority: ApplicationPriority): string {
    if ('Low' in priority) return 'Low';
    if ('Medium' in priority) return 'Medium';
    if ('High' in priority) return 'High';
    if ('Urgent' in priority) return 'Urgent';
    return 'Unknown';
  }

  getApplicationTypeText(type: ApplicationType): string {
    if ('LandPartner' in type) return 'Land Partner';
    if ('TechCollaborator' in type) return 'Tech Collaborator';
    if ('CommunityContributor' in type) return 'Community Contributor';
    if ('Investor' in type) return 'Investor';
    if ('Vendor' in type) return 'Vendor';
    return 'Unknown';
  }
}

export const applicationService = new ApplicationService();
