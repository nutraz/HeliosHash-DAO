import 'package:helios_hash_dao/post_model.dart';
import 'package:helios_hash_dao/project_model.dart';
import 'package:helios_hash_dao/proposal_model.dart';

class MockData {
  static List<Project> getMockProjects() {
    return <dynamic>[
      Project(
        id: '1',
        title: 'Decentralized Identity System',
        description: 'A blockchain-based identity verification system that gives users control over their personal data.',
        creatorId: 'user1',
        createdAt: DateTime.now().subtract(const Duration(days: 30)),
        status: 'active',
        budget: 50000.0,
        category: 'Infrastructure',
        tags: <String>['blockchain', 'identity', 'privacy'],
        imageUrl: null,
        upvotes: 45,
        downvotes: 3,
        teamMembers: <String>['user1', 'user2', 'user3'],
        githubUrl: 'https://github.com/heliosdao/identity-system',
        websiteUrl: 'https://identity.heliosdao.com',
      ),
      Project(
        id: '2',
        title: 'Sustainable Energy Marketplace',
        description: 'A platform connecting renewable energy producers with consumers in a decentralized marketplace.',
        creatorId: 'user2',
        createdAt: DateTime.now().subtract(const Duration(days: 15)),
        status: 'active',
        budget: 75000.0,
        category: 'Environment',
        tags: <String>['energy', 'sustainability', 'marketplace'],
        imageUrl: null,
        upvotes: 67,
        downvotes: 5,
        teamMembers: <String>['user2', 'user4', 'user5'],
        githubUrl: 'https://github.com/heliosdao/energy-marketplace',
      ),
      Project(
        id: '3',
        title: 'AI-Powered Governance Assistant',
        description: 'An AI assistant that helps community members understand and participate in governance decisions.',
        creatorId: 'user3',
        createdAt: DateTime.now().subtract(const Duration(days: 7)),
        status: 'draft',
        budget: 25000.0,
        category: 'Governance',
        tags: <String>['AI', 'governance', 'assistant'],
        imageUrl: null,
        upvotes: 23,
        downvotes: 1,
        teamMembers: <String>['user3', 'user6'],
        githubUrl: 'https://github.com/heliosdao/governance-ai',
      ),
    ];
  }

  static List<Proposal> getMockProposals() {
    return <dynamic>[
      Proposal(
        id: '1',
        title: 'Increase Community Fund Allocation',
        description: 'Proposal to increase the community fund allocation from 20% to 25% of total treasury.',
        proposerId: 'user1',
        createdAt: DateTime.now().subtract(const Duration(days: 14)),
        status: ProposalStatus.active,
        type: ProposalType.funding,
        votingStartDate: DateTime.now().subtract(const Duration(days: 7)),
        votingEndDate: DateTime.now().add(const Duration(days: 7)),
        yesVotes: 1250,
        noVotes: 340,
        abstainVotes: 89,
        quorumRequired: 1000,
        approvalThreshold: 60.0,
        tags: <String>['funding', 'treasury', 'community'],
        category: 'Finance',
        parameters: <String, double>{'new_allocation': 25.0, 'current_allocation': 20.0},
      ),
      Proposal(
        id: '2',
        title: 'Implement Quadratic Voting',
        description: 'Change the voting system to quadratic voting for better representation of community preferences.',
        proposerId: 'user2',
        createdAt: DateTime.now().subtract(const Duration(days: 21)),
        status: ProposalStatus.passed,
        type: ProposalType.governance,
        votingStartDate: DateTime.now().subtract(const Duration(days: 14)),
        votingEndDate: DateTime.now().subtract(const Duration(days: 7)),
        yesVotes: 1800,
        noVotes: 450,
        abstainVotes: 120,
        quorumRequired: 1200,
        approvalThreshold: 65.0,
        tags: <String>['voting', 'governance', 'quadratic'],
        category: 'Governance',
        parameters: <String, String>{'voting_system': 'quadratic'},
      ),
      Proposal(
        id: '3',
        title: 'Approve New Project: DeFi Protocol',
        description: 'Approval for a new decentralized finance protocol project with 100k budget.',
        proposerId: 'user3',
        createdAt: DateTime.now().subtract(const Duration(days: 5)),
        status: ProposalStatus.active,
        type: ProposalType.projectApproval,
        votingStartDate: DateTime.now().subtract(const Duration(days: 2)),
        votingEndDate: DateTime.now().add(const Duration(days: 12)),
        yesVotes: 890,
        noVotes: 156,
        abstainVotes: 45,
        quorumRequired: 800,
        approvalThreshold: 55.0,
        tags: <String>['project', 'defi', 'approval'],
        category: 'Projects',
        parameters: <String, Object>{'project_id': 'defi-001', 'budget': 100000.0},
      ),
    ];
  }

  static List<Post> getMockPosts() {
    return <dynamic>[
      Post(
        id: '1',
        author: 'Alice Johnson',
        title: 'Welcome to HeliosHash DAO!',
        content: "Excited to launch our new DAO platform. Let's build something amazing together! This is a great opportunity for all of us to collaborate on innovative projects that can make a real difference in the world.",
        createdAt: DateTime.now().subtract(const Duration(hours: 2)),
        likes: 45,
        comments: 12,
        isLiked: true,
        tags: <String>['announcement', 'welcome'],
      ),
      Post(
        id: '2',
        author: 'Bob Smith',
        title: 'Proposal Discussion: Quadratic Voting Implementation',
        content: "Let's discuss the upcoming quadratic voting proposal. What are your thoughts on this governance change? I think it could help with better representation.",
        createdAt: DateTime.now().subtract(const Duration(hours: 5)),
        likes: 23,
        comments: 8,
        isLiked: false,
        tags: <String>['governance', 'voting', 'discussion'],
      ),
      Post(
        id: '3',
        author: 'Carol Davis',
        title: 'Project Showcase: Our New Identity System',
        content: "Check out the progress on our decentralized identity system project! We've made significant advances in the past week and would love to get community feedback.",
        createdAt: DateTime.now().subtract(const Duration(hours: 8)),
        likes: 67,
        comments: 15,
        isLiked: true,
        tags: <String>['project', 'showcase', 'identity'],
      ),
      Post(
        id: '4',
        author: 'David Wilson',
        title: 'Community Guidelines Update',
        content: "We've updated our community guidelines to better reflect our growing community. Please take a moment to review the changes and let us know your thoughts.",
        createdAt: DateTime.now().subtract(const Duration(hours: 12)),
        likes: 34,
        comments: 6,
        isLiked: false,
        tags: <String>['guidelines', 'community', 'update'],
      ),
      Post(
        id: '5',
        author: 'Eva Martinez',
        title: 'Q&A Session: Treasury Management',
        content: '',
        createdAt: DateTime.now().subtract(const Duration(hours: 18)),
        likes: 28,
        comments: 22,
        isLiked: false,
        tags: <String>['q&a', 'treasury', 'finance'],
      ),
    ];
  }

  static Map<String, dynamic> getMockUserProfile(String userId) {
    return <String, dynamic>{
      'id': userId,
      'username': 'user_$userId',
      'email': 'user$userId@heliosdao.com',
      'avatar_url': null,
      'bio': 'Passionate about decentralized technologies and community governance.',
      'joined_date': DateTime.now().subtract(const Duration(days: 365)).toIso8601String(),
      'reputation_score': 1250,
      'projects_contributed': 5,
      'proposals_submitted': 12,
      'voting_power': 1500,
      'badges': <String>['Early Supporter', 'Active Voter', 'Project Contributor'],
      'social_links': <String, String>{
        'twitter': 'https://twitter.com/user$userId',
        'github': 'https://github.com/user$userId',
        'linkedin': 'https://linkedin.com/in/user$userId',
      },
    };
  }

  static List<Map<String, dynamic>> getMockCommunityPosts() {
    return <Map<String, dynamic>>[
      <String, dynamic>{
        'id': '1',
        'author_id': 'user1',
        'title': 'Welcome to HeliosHash DAO!',
        'content': "Excited to launch our new DAO platform. Let's build something amazing together!",
        'created_at': DateTime.now().subtract(const Duration(hours: 2)).toIso8601String(),
        'upvotes': 45,
        'downvotes': 2,
        'comments_count': 12,
        'tags': <String>['announcement', 'welcome'],
        'image_url': null,
      },
      <String, dynamic>{
        'id': '2',
        'author_id': 'user2',
        'title': 'Proposal Discussion: Quadratic Voting Implementation',
        'content': "Let's discuss the upcoming quadratic voting proposal. What are your thoughts?",
        'created_at': DateTime.now().subtract(const Duration(hours: 5)).toIso8601String(),
        'upvotes': 23,
        'downvotes': 1,
        'comments_count': 8,
        'tags': <String>['governance', 'voting', 'discussion'],
        'image_url': null,
      },
      <String, dynamic>{
        'id': '3',
        'author_id': 'user3',
        'title': 'Project Showcase: Our New Identity System',
        'content': 'Check out the progress on our decentralized identity system project!',
        'created_at': DateTime.now().subtract(const Duration(hours: 8)).toIso8601String(),
        'upvotes': 67,
        'downvotes': 0,
        'comments_count': 15,
        'tags': <String>['project', 'showcase', 'identity'],
        'image_url': null,
      },
    ];
  }

  static Map<String, dynamic> getMockDaoStats() {
    return <String, dynamic>{
      'total_members': 15420,
      'active_members': 8920,
      'total_projects': 45,
      'active_projects': 23,
      'total_proposals': 156,
      'active_proposals': 8,
      'treasury_balance': 2500000.0,
      'monthly_active_users': 12000,
      'governance_participation_rate': 68.5,
      'average_proposal_success_rate': 72.3,
    };
  }

  static List<Map<String, dynamic>> getMockRewards() {
    return <Map<String, dynamic>>[
      <String, dynamic>{
        'id': '1',
        'type': 'voting',
        'title': 'Active Voter',
        'description': 'Participated in 10 governance votes',
        'points': 100,
        'icon': 'vote',
        'unlocked_at': DateTime.now().subtract(const Duration(days: 30)).toIso8601String(),
      },
      <String, dynamic>{
        'id': '2',
        'type': 'contribution',
        'title': 'Project Contributor',
        'description': 'Contributed to a community project',
        'points': 250,
        'icon': 'code',
        'unlocked_at': DateTime.now().subtract(const Duration(days: 15)).toIso8601String(),
      },
      <String, dynamic>{
        'id': '3',
        'type': 'proposal',
        'title': 'Proposal Champion',
        'description': 'Submitted a proposal that passed',
        'points': 500,
        'icon': 'lightbulb',
        'unlocked_at': DateTime.now().subtract(const Duration(days: 7)).toIso8601String(),
      },
    ];
  }
}
