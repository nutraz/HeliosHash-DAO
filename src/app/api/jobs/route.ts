import { NextRequest, NextResponse } from 'next/server';
import { JobPosting, JobListResponse, JobSearchParams } from '@/types/jobs';

// Mock database for development - replace with actual database/IC integration
const MOCK_JOBS: JobPosting[] = [
  {
    id: '1',
    title: 'Solar Panel Installation Technician',
    description: `Join our team to install and maintain solar panel systems across the Urgam Valley. This is a perfect opportunity for local residents to gain technical skills in renewable energy while contributing to India's sustainable energy future.

Key Responsibilities:
- Install residential and commercial solar panel systems
- Perform routine maintenance and troubleshooting
- Ensure safety protocols are followed at all times
- Collaborate with electrical engineers and project managers
- Document installation progress and report issues

What We Offer:
- Comprehensive training program for new technicians
- Opportunities to work on cutting-edge renewable energy projects
- Career advancement within the growing solar industry
- Direct impact on community energy independence`,
    category: 'Engineering',
    location: { type: 'OnSite', location: 'Urgam Valley, Gujarat' },
    compensation: { amount: 25000, currency: 'INR', paymentType: 'Monthly' },
    requirements: [
      'Basic electrical knowledge or willingness to learn',
      'Physical fitness for rooftop work and equipment handling',
      'Attention to detail and safety consciousness',
      'Local resident of Gujarat preferred',
      "Valid driver's license preferred",
    ],
    skills: [
      'Solar Panel Installation',
      'Electrical Wiring',
      'Safety Protocols',
      'Equipment Maintenance',
    ],
    poster: 'dao-admin',
    posterName: 'HeliosHash DAO',
    posterAvatar: '/logo.svg',
    status: 'Active',
    created: Date.now() - 86400000, // 1 day ago
    deadline: Date.now() + 604800000, // 1 week from now
    applicants: ['user-123', 'user-456'],
    applicationCount: 12,
    featured: true,
    urgency: 'High',
    experienceLevel: 'Entry',
    workType: 'FullTime',
    benefits: [
      'Health Insurance',
      'Training Provided',
      'Equipment Supplied',
      'Transportation Allowance',
    ],
    companyInfo: {
      name: 'HeliosHash DAO',
      description:
        'Decentralized solar energy infrastructure organization focused on community-driven renewable energy projects.',
      website: 'https://helioshash.org',
    },
  },
  {
    id: '2',
    title: 'Blockchain Developer - Smart Contracts',
    description: `Develop and maintain smart contracts for our decentralized energy trading platform. Work with cutting-edge Internet Computer technology to build the future of decentralized energy markets.

Key Responsibilities:
- Design and implement smart contracts using Motoko
- Integrate with Internet Computer infrastructure
- Build DeFi protocols for energy trading
- Collaborate with frontend developers on Web3 integration
- Optimize contract performance and security

Technical Requirements:
- Experience with Internet Computer development
- Understanding of DeFi protocols and tokenomics
- Knowledge of energy markets (preferred)
- Security-focused development practices`,
    category: 'Technology',
    location: { type: 'Remote' },
    compensation: { amount: 80000, currency: 'USD', paymentType: 'Monthly' },
    requirements: [
      '3+ years blockchain development experience',
      'Proficiency in Motoko or Rust programming',
      'Understanding of DeFi protocols and smart contract security',
      'Experience with Internet Computer ecosystem',
      'Strong problem-solving and analytical skills',
    ],
    skills: ['Motoko', 'Smart Contracts', 'Internet Computer', 'DeFi', 'Web3', 'Rust'],
    poster: 'tech-lead',
    posterName: 'Technical Team',
    status: 'Active',
    created: Date.now() - 172800000, // 2 days ago
    applicants: ['dev-789'],
    applicationCount: 8,
    urgency: 'Medium',
    experienceLevel: 'Senior',
    workType: 'Contract',
    benefits: ['Flexible Hours', 'Crypto Payments', 'Remote Work', 'Equipment Stipend'],
    companyInfo: {
      name: 'HeliosHash DAO',
      description: 'Decentralized solar energy infrastructure organization',
      website: 'https://helioshash.org',
    },
  },
  {
    id: '3',
    title: 'Community Outreach Coordinator',
    description: `Build relationships with local communities and manage stakeholder engagement for our pilot projects. Help bridge the gap between technology and community needs.

Key Responsibilities:
- Engage with local community leaders and residents
- Organize educational workshops about solar energy
- Facilitate feedback collection and community input
- Coordinate with government officials and regulatory bodies
- Manage social media and community communications
- Support rural development initiatives

Impact Areas:
- Direct community empowerment through energy independence
- Educational initiatives in renewable energy
- Local economic development through job creation
- Cultural sensitivity and inclusive development`,
    category: 'Community',
    location: { type: 'Hybrid', location: 'Gujarat & Remote' },
    compensation: { amount: 40000, currency: 'INR', paymentType: 'Monthly' },
    requirements: [
      'Strong communication skills in Gujarati, Hindi, and English',
      'Experience in community engagement or social work',
      'Understanding of rural development challenges',
      'Local network in Gujarat preferred',
      "Bachelor's degree in relevant field",
    ],
    skills: [
      'Community Engagement',
      'Stakeholder Relations',
      'Public Speaking',
      'Project Management',
    ],
    poster: 'community-manager',
    posterName: 'Community Team',
    status: 'Active',
    created: Date.now() - 259200000, // 3 days ago
    applicants: ['comm-101', 'comm-102', 'comm-103'],
    applicationCount: 15,
    urgency: 'Medium',
    experienceLevel: 'Mid',
    workType: 'FullTime',
    benefits: ['Travel Allowance', 'Local Impact', 'Skill Development', 'Networking Opportunities'],
    companyInfo: {
      name: 'HeliosHash DAO',
      description: 'Decentralized solar energy infrastructure organization',
      website: 'https://helioshash.org',
    },
  },
  {
    id: '4',
    title: 'ASIC Mining Operations Specialist',
    description: `Manage and optimize ASIC mining operations as part of our integrated energy ecosystem. Contribute to both cryptocurrency mining and grid stabilization efforts.

Key Responsibilities:
- Monitor and maintain ASIC mining equipment
- Optimize power consumption and mining efficiency
- Coordinate mining operations with solar energy production
- Implement predictive maintenance schedules
- Ensure 24/7 operational uptime
- Manage cooling and infrastructure systems`,
    category: 'Engineering',
    location: { type: 'OnSite', location: 'Urgam Valley Data Center' },
    compensation: { amount: 50000, currency: 'INR', paymentType: 'Monthly' },
    requirements: [
      'Experience with cryptocurrency mining operations',
      'Knowledge of ASIC hardware and troubleshooting',
      'Understanding of electrical systems and power management',
      'Ability to work in shift rotations including nights/weekends',
      'Strong attention to detail for monitoring systems',
    ],
    skills: [
      'ASIC Mining',
      'Hardware Troubleshooting',
      'Power Management',
      'Data Center Operations',
    ],
    poster: 'mining-team',
    posterName: 'Mining Operations',
    status: 'Active',
    created: Date.now() - 345600000, // 4 days ago
    applicants: [],
    applicationCount: 5,
    urgency: 'High',
    experienceLevel: 'Mid',
    workType: 'FullTime',
    benefits: ['Shift Allowance', 'Technical Training', 'Performance Bonuses', 'Equipment Access'],
  },
  {
    id: '5',
    title: 'Digital Literacy Trainer',
    description: `Empower local communities with digital skills and blockchain knowledge. Help bridge the digital divide in rural areas while introducing Web3 concepts.

Key Responsibilities:
- Conduct digital literacy workshops for all age groups
- Teach basic computer skills and internet usage
- Introduce blockchain and cryptocurrency concepts
- Train community members on DAO participation
- Develop culturally appropriate training materials
- Support ongoing digital transformation initiatives`,
    category: 'Education',
    location: { type: 'OnSite', location: 'Urgam Valley Community Center' },
    compensation: { amount: 30000, currency: 'INR', paymentType: 'Monthly' },
    requirements: [
      'Teaching or training experience preferred',
      'Strong digital literacy and computer skills',
      'Patience and ability to work with diverse age groups',
      'Fluency in local languages (Gujarati, Hindi)',
      'Passion for community development',
    ],
    skills: ['Digital Literacy', 'Adult Education', 'Blockchain Education', 'Community Training'],
    poster: 'education-team',
    posterName: 'Education Department',
    status: 'Active',
    created: Date.now() - 432000000, // 5 days ago
    applicants: ['teacher-201'],
    applicationCount: 3,
    urgency: 'Medium',
    experienceLevel: 'Entry',
    workType: 'PartTime',
    benefits: [
      'Flexible Schedule',
      'Community Impact',
      'Training Materials Provided',
      'Skill Development',
    ],
  },
];

/**
 * Retrieve a filtered, sorted, and paginated list of job postings based on URL query parameters.
 *
 * Supports filtering by category, location, search (title/description/skills/category), featured,
 * experience level, work type, urgency, compensation range, and posted timeframe (Today/Week/Month).
 * Results can be sorted by `compensation`, `applications`, `deadline`, or `created` in `asc` or `desc` order,
 * and are paginated via `page` and `limit`.
 *
 * @returns A JobListResponse object containing the matching `jobs`, the `total` number of matches, current `page`, `limit`, and `hasMore` flag.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const location = searchParams.get('location');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured') === 'true';
    const sortBy = searchParams.get('sortBy') || 'created';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const minCompensation = searchParams.get('minCompensation');
    const maxCompensation = searchParams.get('maxCompensation');
    const experienceLevel = searchParams.get('experienceLevel');
    const workType = searchParams.get('workType');
    const urgency = searchParams.get('urgency');
    const posted = searchParams.get('posted');

    let filteredJobs = [...MOCK_JOBS];

    // Apply filters
    if (category) {
      const categories = category.split(',');
      filteredJobs = filteredJobs.filter((job) => categories.includes(job.category));
    }

    if (location) {
      const locations = location.split(',');
      filteredJobs = filteredJobs.filter((job) => locations.includes(job.location.type));
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredJobs = filteredJobs.filter(
        (job) =>
          job.title.toLowerCase().includes(searchLower) ||
          job.description.toLowerCase().includes(searchLower) ||
          job.skills.some((skill) => skill.toLowerCase().includes(searchLower)) ||
          job.category.toLowerCase().includes(searchLower)
      );
    }

    if (featured) {
      filteredJobs = filteredJobs.filter((job) => job.featured);
    }

    if (experienceLevel) {
      const levels = experienceLevel.split(',');
      filteredJobs = filteredJobs.filter(
        (job) => job.experienceLevel && levels.includes(job.experienceLevel)
      );
    }

    if (workType) {
      const types = workType.split(',');
      filteredJobs = filteredJobs.filter((job) => job.workType && types.includes(job.workType));
    }

    if (urgency) {
      const urgencyLevels = urgency.split(',');
      filteredJobs = filteredJobs.filter(
        (job) => job.urgency && urgencyLevels.includes(job.urgency)
      );
    }

    if (minCompensation) {
      const min = parseFloat(minCompensation);
      filteredJobs = filteredJobs.filter((job) => job.compensation.amount >= min);
    }

    if (maxCompensation) {
      const max = parseFloat(maxCompensation);
      filteredJobs = filteredJobs.filter((job) => job.compensation.amount <= max);
    }

    // Posted date filter
    if (posted && posted !== 'All') {
      const now = Date.now();
      let timeLimit = 0;

      switch (posted) {
        case 'Today':
          timeLimit = now - 24 * 60 * 60 * 1000;
          break;
        case 'Week':
          timeLimit = now - 7 * 24 * 60 * 60 * 1000;
          break;
        case 'Month':
          timeLimit = now - 30 * 24 * 60 * 60 * 1000;
          break;
      }

      if (timeLimit > 0) {
        filteredJobs = filteredJobs.filter((job) => job.created >= timeLimit);
      }
    }

    // Apply sorting
    filteredJobs.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case 'compensation':
          aValue = a.compensation.amount;
          bValue = b.compensation.amount;
          break;
        case 'applications':
          aValue = a.applicationCount || 0;
          bValue = b.applicationCount || 0;
          break;
        case 'deadline':
          aValue = a.deadline || Infinity;
          bValue = b.deadline || Infinity;
          break;
        default: // 'created'
          aValue = a.created;
          bValue = b.created;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedJobs = filteredJobs.slice(startIndex, endIndex);

    const response: JobListResponse = {
      jobs: paginatedJobs,
      total: filteredJobs.length,
      page,
      limit,
      hasMore: endIndex < filteredJobs.length,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}

/**
 * Create a new job posting from the request body and add it to the in-memory mock database.
 *
 * @param request - Incoming NextRequest whose JSON body provides the job fields used to construct the new job posting
 * @returns The created `JobPosting` object as the response body; returns a JSON error object on failure. Successful creation is returned with HTTP status 201, failures return HTTP status 500.
 */
export async function POST(request: NextRequest) {
  try {
    const jobData = await request.json();

    // In a real app, validate the data and save to database
    const newJob: JobPosting = {
      id: `job-${Date.now()}`,
      ...jobData,
      created: Date.now(),
      status: 'Active' as const,
      applicants: [],
      applicationCount: 0,
    };

    // Add to mock database (in real app, save to IC canister or database)
    MOCK_JOBS.unshift(newJob);

    return NextResponse.json(newJob, { status: 201 });
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json({ error: 'Failed to create job' }, { status: 500 });
  }
}