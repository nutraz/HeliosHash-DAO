/**
 * Job Board & Talent Marketplace Types
 * Based on the Community Opportunities Feature Specification
 */

export type JobCategory = 
  | 'Engineering'
  | 'Technology'
  | 'Management'
  | 'Security'
  | 'Education'
  | 'Construction'
  | 'Operations'
  | 'Community';

export type LocationType = {
  type: 'OnSite' | 'Remote' | 'Hybrid';
  location?: string; // Location name for OnSite/Hybrid
};

export type Currency = 'INR' | 'ICP' | 'BTC' | 'USD';
export type PaymentType = 'Hourly' | 'Monthly' | 'Project' | 'Equity';

export interface Compensation {
  amount: number;
  currency: Currency;
  paymentType: PaymentType;
  minAmount?: number; // For ranges
  maxAmount?: number;
}

export type JobStatus = 
  | 'Draft'
  | 'PendingApproval' 
  | 'Active'
  | 'Closed'
  | 'Filled'
  | 'Cancelled';

export interface JobPosting {
  id: string;
  title: string;
  description: string;
  category: JobCategory;
  location: LocationType;
  compensation: Compensation;
  requirements: string[];
  skills: string[];
  poster: string; // User ID or Principal
  posterName?: string;
  posterAvatar?: string;
  status: JobStatus;
  created: number; // Unix timestamp
  updated?: number;
  deadline?: number;
  applicants: string[]; // Array of applicant IDs
  applicationCount: number;
  featured?: boolean;
  urgency?: 'Low' | 'Medium' | 'High' | 'Critical';
  experienceLevel: 'Entry' | 'Mid' | 'Senior' | 'Lead';
  workType: 'FullTime' | 'PartTime' | 'Contract' | 'Internship';
  benefits?: string[];
  companyInfo?: {
    name: string;
    description: string;
    website?: string;
    logo?: string;
  };
}

export type ApplicationStatus = 
  | 'Submitted'
  | 'UnderReview'
  | 'Interviewed' 
  | 'Accepted'
  | 'Rejected'
  | 'Withdrawn';

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle?: string;
  applicantId: string;
  applicantName?: string;
  applicantEmail?: string;
  applicantAvatar?: string;
  coverLetter: string;
  resume?: string; // URL or file path
  portfolio?: string; // URL
  videoIntroduction?: string; // URL
  skills: string[];
  experience: number; // Years of experience
  expectedCompensation?: Compensation;
  availability: 'Immediate' | 'TwoWeeks' | 'Month' | 'Negotiable';
  status: ApplicationStatus;
  submitted: number; // Unix timestamp
  lastUpdate?: number;
  notes?: string; // Internal notes from reviewer
  rating?: number; // 1-5 rating
  documents?: {
    name: string;
    url: string;
    type: 'resume' | 'certificate' | 'portfolio' | 'other';
  }[];
}

export interface JobFilters {
  categories?: JobCategory[];
  locations?: string[];
  experienceLevels?: ('Entry' | 'Mid' | 'Senior' | 'Lead')[];
  workTypes?: ('FullTime' | 'PartTime' | 'Contract' | 'Internship')[];
  currency?: Currency[];
  compensationRange?: {
    min?: number;
    max?: number;
  };
  skills?: string[];
  search?: string;
  featured?: boolean;
  urgency?: ('Low' | 'Medium' | 'High' | 'Critical')[];
  posted?: 'Today' | 'Week' | 'Month' | 'All';
}

export interface JobSearchParams {
  filters?: JobFilters;
  sortBy?: 'created' | 'compensation' | 'applications' | 'deadline';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface JobStats {
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  averageTimeToFill: number; // in days
  topCategories: { category: JobCategory; count: number }[];
  compensationTrends: {
    currency: Currency;
    average: number;
    median: number;
  }[];
}

// User profile for job context
export interface JobUserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  location?: string;
  skills: string[];
  experience: number;
  resumeUrl?: string;
  portfolioUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  isLocalResident?: boolean; // Urgam Valley resident
  kycStatus: 'Pending' | 'Verified' | 'Rejected';
  reputation: number; // 0-100 score
  completedJobs: number;
  totalEarnings: {
    amount: number;
    currency: Currency;
  }[];
  badges: string[]; // Achievement badges
  joinedDate: number;
  lastActive: number;
}

// Smart contract and escrow types
export interface JobContract {
  id: string;
  jobId: string;
  employerId: string;
  workerId: string;
  amount: number;
  currency: Currency;
  milestones: {
    id: string;
    description: string;
    amount: number;
    dueDate?: number;
    status: 'Pending' | 'InProgress' | 'Completed' | 'Disputed';
    completedDate?: number;
  }[];
  status: 'Created' | 'Active' | 'Completed' | 'Disputed' | 'Cancelled';
  startDate: number;
  endDate?: number;
  terms: string;
  escrowAddress?: string;
}

// Notification types for job-related events
export interface JobNotification {
  id: string;
  userId: string;
  type: 'NewApplication' | 'ApplicationUpdate' | 'NewJob' | 'JobUpdate' | 'PaymentReceived' | 'ContractUpdate';
  title: string;
  message: string;
  jobId?: string;
  applicationId?: string;
  contractId?: string;
  read: boolean;
  created: number;
  data?: Record<string, any>; // Additional notification data
}

// API Response types
export interface JobListResponse {
  jobs: JobPosting[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface ApplicationListResponse {
  applications: JobApplication[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Form validation schemas (for react-hook-form)
export interface JobPostingFormData {
  title: string;
  description: string;
  category: JobCategory;
  locationType: 'OnSite' | 'Remote' | 'Hybrid';
  locationName?: string;
  compensation: {
    amount: number;
    currency: Currency;
    paymentType: PaymentType;
    isRange: boolean;
    minAmount?: number;
    maxAmount?: number;
  };
  requirements: string[];
  skills: string[];
  experienceLevel: 'Entry' | 'Mid' | 'Senior' | 'Lead';
  workType: 'FullTime' | 'PartTime' | 'Contract' | 'Internship';
  urgency: 'Low' | 'Medium' | 'High' | 'Critical';
  deadline?: string; // ISO date string
  benefits?: string[];
  companyInfo?: {
    name: string;
    description: string;
    website?: string;
  };
}

export interface JobApplicationFormData {
  coverLetter: string;
  skills: string[];
  experience: number;
  expectedCompensation?: {
    amount: number;
    currency: Currency;
    paymentType: PaymentType;
  };
  availability: 'Immediate' | 'TwoWeeks' | 'Month' | 'Negotiable';
  resumeFile?: File;
  portfolioUrl?: string;
  videoFile?: File;
  additionalDocuments?: File[];
}

// Category configurations
export const JOB_CATEGORIES: { value: JobCategory; label: string; icon: string; description: string }[] = [
  {
    value: 'Engineering',
    label: 'Engineering & Technical',
    icon: '🔧',
    description: 'Solar panel installation, ASIC mining, IoT sensors, microgrids'
  },
  {
    value: 'Technology',
    label: 'Technology & Development',
    icon: '💻',
    description: 'Frontend, backend, smart contracts, DevOps, data analysis'
  },
  {
    value: 'Security',
    label: 'Security',
    icon: '🛡️',
    description: 'Physical security, cybersecurity, equipment monitoring'
  },
  {
    value: 'Education',
    label: 'Education & Community',
    icon: '📚',
    description: 'Training, digital literacy, community coordination'
  },
  {
    value: 'Construction',
    label: 'Construction & Operations',
    icon: '🏗️',
    description: 'Installation contractors, transportation, maintenance'
  },
  {
    value: 'Operations',
    label: 'Operations',
    icon: '⚙️',
    description: 'Project management, logistics, quality assurance'
  },
  {
    value: 'Community',
    label: 'Community',
    icon: '🤝',
    description: 'Community engagement, local partnerships, outreach'
  }
];

// Predefined skills for each category
export const CATEGORY_SKILLS: Record<JobCategory, string[]> = {
  Engineering: [
    'Solar Panel Installation', 'ASIC Mining', 'IoT Systems', 'Electrical Engineering',
    'Microgrid Design', 'Power Electronics', 'Equipment Maintenance', 'Troubleshooting',
    'Circuit Design', 'Renewable Energy', 'Energy Storage', 'Grid Integration'
  ],
  Technology: [
    'React', 'TypeScript', 'Node.js', 'Motoko', 'Internet Computer', 'Web3',
    'Smart Contracts', 'Blockchain', 'DevOps', 'Docker', 'Kubernetes',
    'Data Analysis', 'Python', 'Rust', 'API Development', 'Database Design'
  ],
  Management: [
    'Project Management', 'Team Leadership', 'Strategic Planning', 'Budget Management',
    'Stakeholder Management', 'Operations Management', 'Business Development',
    'Performance Management', 'Risk Management', 'Communication', 'Decision Making'
  ],
  Security: [
    'Physical Security', 'Cybersecurity', 'Network Security', 'Incident Response',
    'Risk Assessment', 'Compliance', 'CCTV Systems', 'Access Control',
    'Security Auditing', 'Threat Analysis', 'Emergency Response'
  ],
  Education: [
    'Technical Training', 'Digital Literacy', 'Community Outreach', 'Curriculum Development',
    'Workshop Facilitation', 'Documentation', 'Translation', 'Public Speaking',
    'Adult Education', 'Skill Assessment', 'Knowledge Transfer'
  ],
  Construction: [
    'Construction Management', 'Site Preparation', 'Equipment Transportation',
    'Safety Compliance', 'Project Planning', 'Quality Control', 'Heavy Machinery',
    'Civil Engineering', 'Structural Design', 'Material Management'
  ],
  Operations: [
    'Project Management', 'Process Optimization', 'Supply Chain', 'Logistics',
    'Quality Assurance', 'Performance Monitoring', 'Budget Management',
    'Team Leadership', 'Stakeholder Management', 'Strategic Planning'
  ],
  Community: [
    'Community Engagement', 'Stakeholder Relations', 'Cultural Sensitivity',
    'Local Partnerships', 'Event Organization', 'Social Media Management',
    'Grant Writing', 'Fundraising', 'Volunteer Management', 'Public Relations'
  ]
};

export const CURRENCIES: { value: Currency; label: string; symbol: string }[] = [
  { value: 'INR', label: 'Indian Rupee', symbol: '₹' },
  { value: 'USD', label: 'US Dollar', symbol: '$' },
  { value: 'ICP', label: 'Internet Computer', symbol: 'ICP' },
  { value: 'BTC', label: 'Bitcoin', symbol: '₿' }
];

export const EXPERIENCE_LEVELS = [
  { value: 'Entry', label: 'Entry Level (0-2 years)' },
  { value: 'Mid', label: 'Mid Level (2-5 years)' },
  { value: 'Senior', label: 'Senior Level (5-10 years)' },
  { value: 'Lead', label: 'Lead/Expert (10+ years)' }
];

export const WORK_TYPES = [
  { value: 'FullTime', label: 'Full Time' },
  { value: 'PartTime', label: 'Part Time' },
  { value: 'Contract', label: 'Contract' },
  { value: 'Internship', label: 'Internship' }
];