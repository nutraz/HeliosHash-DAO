"use client";

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  experience: string;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  dueDate: string;
  budget: number;
}

export interface FinancialReturn {
  period: string;
  projected: number;
  actual: number;
  type: 'revenue' | 'savings' | 'carbon_credits';
}

export interface MockProject {
  id: string;
  name: string;
  description: string;
  location: string;
  capacity: number; // MW
  status: 'planning' | 'funding' | 'construction' | 'operational' | 'maintenance';
  progress: number; // 0-100
  estimatedCost: number; // in base currency (e.g., INR)
  currentFunding: number;
  fundingGoal: number;
  completionDate: string; // ISO date
  image: string;
  team: TeamMember[];
  milestones: Milestone[];
  returns: FinancialReturn[];
  carbonOffset: number; // tons CO2/year
  energyOutput: number; // kWh/year
}

export const mockProjects: MockProject[] = [
  {
    id: 'urgamu-001',
    name: 'UrgamU Smart Highway & Solar',
    description:
      'Elevated 10km smart highway from Helang to Kalpeshwar with 3MW solar microgrids powering 50,000+ pilgrims annually. Features IoT monitoring, drone maintenance, and tokenized toll collection.',
    location: 'Urgam Valley, Uttarakhand',
    capacity: 3,
    status: 'funding',
    progress: 25,
    estimatedCost: 180000000,
    currentFunding: 45000000,
    fundingGoal: 180000000,
    completionDate: '2025-12-15',
    image: 'https://picsum.photos/seed/urgamu1/800/400.jpg',
    team: [
      { id: '1', name: 'Rajesh Soni', role: 'Project Lead', avatar: 'https://picsum.photos/seed/rajesh/100/100.jpg', experience: '15+ years infrastructure' },
      { id: '2', name: 'Priya Sharma', role: 'Solar Engineer', avatar: 'https://picsum.photos/seed/priya/100/100.jpg', experience: '8+ years renewable energy' },
      { id: '3', name: 'Amit Kumar', role: 'IoT Specialist', avatar: 'https://picsum.photos/seed/amit/100/100.jpg', experience: '5+ years smart systems' }
    ],
    milestones: [
      { id: 'm1', title: 'Land Acquisition & Clearances', description: 'Secure land and government approvals', completed: true, dueDate: '2024-03-15', budget: 25000000 },
      { id: 'm2', title: 'Foundation Work', description: 'Elevated structure foundation', completed: true, dueDate: '2024-06-30', budget: 45000000 },
      { id: 'm3', title: 'Solar Installation', description: 'Install 3MW solar capacity', completed: false, dueDate: '2024-09-30', budget: 80000000 },
      { id: 'm4', title: 'Smart Highway Tech', description: 'IoT sensors, drone systems, toll collection', completed: false, dueDate: '2024-11-15', budget: 30000000 }
    ],
    returns: [
      { period: '2025', projected: 15000000, actual: 0, type: 'revenue' },
      { period: '2026', projected: 22000000, actual: 0, type: 'revenue' },
      { period: '2027', projected: 28000000, actual: 0, type: 'revenue' }
    ],
    carbonOffset: 2500,
    energyOutput: 4500000
  },
  {
    id: 'baghpat-002',
    name: 'Helios Baghpat Solar Farm',
    description: '100MW utility-scale solar farm in Baghpat, Uttar Pradesh. Using bifacial panels with tracking systems, powering 75,000 homes with AI-optimized grid distribution.',
    location: 'Baghpat, Uttar Pradesh',
    capacity: 100,
    status: 'construction',
    progress: 65,
    estimatedCost: 75000000,
    currentFunding: 48750000,
    fundingGoal: 75000000,
    completionDate: '2024-08-20',
    image: 'https://picsum.photos/seed/baghpat1/800/400.jpg',
    team: [
      { id: '4', name: 'Sanjay Gupta', role: 'Project Manager', avatar: 'https://picsum.photos/seed/sanjay/100/100.jpg', experience: '12+ years solar projects' },
      { id: '5', name: 'Anita Verma', role: 'Electrical Engineer', avatar: 'https://picsum.photos/seed/anita/100/100.jpg', experience: '10+ years power systems' },
      { id: '6', name: 'Rohit Singh', role: 'Grid Integration', avatar: 'https://picsum.photos/seed/rohit/100/100.jpg', experience: '7+ years smart grids' }
    ],
    milestones: [
      { id: 'm5', title: 'Land Preparation', description: 'Site clearing and preparation', completed: true, dueDate: '2024-01-15', budget: 8000000 },
      { id: 'm6', title: 'Foundation Installation', description: 'Solar panel foundations', completed: true, dueDate: '2024-03-30', budget: 15000000 },
      { id: 'm7', title: 'Panel Installation', description: 'Install 100MW capacity', completed: false, dueDate: '2024-06-30', budget: 45000000 },
      { id: 'm8', title: 'Grid Connection', description: 'Connect to state grid', completed: false, dueDate: '2024-08-20', budget: 7000000 }
    ],
    returns: [
      { period: '2024', projected: 8500000, actual: 3200000, type: 'revenue' },
      { period: '2025', projected: 12000000, actual: 0, type: 'revenue' },
      { period: '2026', projected: 15000000, actual: 0, type: 'revenue' }
    ],
    carbonOffset: 85000,
    energyOutput: 165000000
  }
];

// Simulated API
export const getMockProjects = async (): Promise<MockProject[]> => {
  await new Promise((res) => setTimeout(res, 600));
  return mockProjects;
};

export const getProjectById = async (id: string): Promise<MockProject | undefined> => {
  await new Promise((res) => setTimeout(res, 300));
  return mockProjects.find((p) => p.id === id);
};

export const getMockProject = async (id: string): Promise<MockProject | null> => {
  const p = await getProjectById(id);
  return p ?? null;
};
