"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Users, MessageSquare, Vote, Plus, ArrowLeft, Briefcase, MapPin, Camera, FileText, Video, Star, Clock, Calendar, Monitor, Shield, Wrench, BookOpen, HardHat, Zap, Factory, Building, Sprout, Layers } from "lucide-react";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import JobBoard from "@/components/community/opportunities/JobBoard";

interface CommunityPost {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  category: string;
}

interface Proposal {
  id: string;
  title: string;
  description: string;
  author: string;
  status: "active" | "voting" | "passed" | "rejected";
  votesFor: number;
  votesAgainst: number;
  deadline: string;
  category: string;
}

interface Opportunity {
  id: string;
  title: string;
  company: string;
  type: "full-time" | "part-time" | "seasonal" | "contract";
  category: "engineering" | "tech" | "teaching" | "security" | "construction" | "agriculture";
  location: string;
  salary: string;
  description: string;
  requirements: string[];
  posted: string;
  deadline: string;
}

interface Project {
  id: string;
  title: string;
  landOwner: string;
  location: string;
  type: "solar" | "mining" | "data-center" | "agricultural" | "mixed";
  status: "planning" | "application" | "approved" | "in-progress" | "completed";
  budget: string;
  description: string;
  progress: number;
  iotMetrics: {
    energy: number;
    temperature: number;
    uptime: number;
    efficiency: number;
  };
  timeline: string;
  applications: number;
}

export default function CommunityPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [newProject, setNewProject] = useState({
    title: "",
    landOwner: "",
    location: "",
    type: "" as "solar" | "mining" | "data-center" | "agricultural" | "mixed" | "",
    budget: "",
    description: "",
    timeline: "",
    requirements: [] as string[],
    expectedEnergy: "",
    landSize: "",
    investmentType: "equity" as "equity" | "loan" | "grant",
    roi: "",
    sustainability: "" as "high" | "medium" | "low" | ""
  });

  useEffect(() => {
    setTimeout(() => {
      setPosts([
        {
          id: "1",
          author: "Rajesh Kumar",
          content: "Excited to announce our new solar farm in Gujarat! This 50MW facility will power over 20,000 homes.",
          timestamp: "2 hours ago",
          likes: 45,
          comments: 12,
          category: "Announcement"
        },
        {
          id: "2",
          author: "Priya Sharma",
          content: "Just completed the installation of solar panels on my rooftop. The process was smooth!",
          timestamp: "5 hours ago",
          likes: 32,
          comments: 8,
          category: "Success Story"
        },
        {
          id: "3",
          author: "Amit Patel",
          content: "Looking for collaborators for a community solar project in Mumbai. DM if interested!",
          timestamp: "1 day ago",
          likes: 28,
          comments: 15,
          category: "Collaboration"
        }
      ]);

      setProposals([
        {
          id: "1",
          title: "Expand to Tamil Nadu Market",
          description: "Establish new solar infrastructure with initial investment of ₹5 Crore",
          author: "DAO Council",
          status: "voting",
          votesFor: 847,
          votesAgainst: 123,
          deadline: "2 days",
          category: "Expansion"
        },
        {
          id: "2",
          title: "Increase Mining Rewards by 15%",
          description: "Adjust reward distribution to incentivize more miners",
          author: "Mining Committee",
          status: "active",
          votesFor: 654,
          votesAgainst: 89,
          deadline: "5 days",
          category: "Rewards"
        },
        {
          id: "3",
          title: "Community Education Program",
          description: "Launch educational initiative for rural areas",
          author: "Education Team",
          status: "passed",
          votesFor: 1203,
          votesAgainst: 45,
          deadline: "Completed",
          category: "Education"
        }
      ]);

      setOpportunities([
        {
          id: "1",
          title: "Senior Solar Engineer",
          company: "HeliosHash Energy",
          type: "full-time",
          category: "engineering",
          location: "Gujarat",
          salary: "₹15-20 LPA",
          description: "Lead solar farm design and implementation",
          requirements: ["B.Tech in Electrical", "5+ years experience"],
          posted: "2 days ago",
          deadline: "30 days"
        },
        {
          id: "2",
          title: "Blockchain Developer",
          company: "HHDAO Tech",
          type: "contract",
          category: "tech",
          location: "Remote",
          salary: "₹25-35 LPA",
          description: "Develop smart contracts for DAO governance",
          requirements: ["Solidity expertise", "DeFi experience"],
          posted: "1 week ago",
          deadline: "15 days"
        },
        {
          id: "3",
          title: "Technical Trainer",
          company: "Rural Education",
          type: "part-time",
          category: "teaching",
          location: "Maharashtra",
          salary: "₹8-12 LPA",
          description: "Train rural communities in solar technology",
          requirements: ["Teaching experience", "Technical background"],
          posted: "3 days ago",
          deadline: "21 days"
        }
      ]);

      setProjects([
        {
          id: "1",
          title: "Rajasthan Solar Farm",
          landOwner: "Rajasthan Cooperative",
          location: "Jodhpur",
          type: "solar",
          status: "in-progress",
          budget: "₹50 Crore",
          description: "100MW solar farm with integrated mining",
          progress: 65,
          iotMetrics: { energy: 87, temperature: 42, uptime: 98, efficiency: 94 },
          timeline: "18 months",
          applications: 45
        },
        {
          id: "2",
          title: "Tamil Nadu Data Center",
          landOwner: "Chennai Tech Park",
          location: "Chennai",
          type: "data-center",
          status: "approved",
          budget: "₹75 Crore",
          description: "State-of-the-art data center powered by renewable energy",
          progress: 25,
          iotMetrics: { energy: 92, temperature: 38, uptime: 99, efficiency: 96 },
          timeline: "24 months",
          applications: 78
        },
        {
          id: "3",
          title: "Kerala Agricultural Project",
          landOwner: "Kerala Farmers Union",
          location: "Kochi",
          type: "agricultural",
          status: "application",
          budget: "₹25 Crore",
          description: "Integrated solar-powered agricultural facility",
          progress: 10,
          iotMetrics: { energy: 78, temperature: 35, uptime: 95, efficiency: 89 },
          timeline: "12 months",
          applications: 23
        }
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-blue-100 text-blue-800";
      case "voting": return "bg-orange-100 text-orange-800";
      case "passed": return "bg-green-100 text-green-800";
      case "rejected": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getOpportunityTypeColor = (type: string) => {
    switch (type) {
      case "full-time": return "bg-green-100 text-green-800";
      case "part-time": return "bg-blue-100 text-blue-800";
      case "seasonal": return "bg-orange-100 text-orange-800";
      case "contract": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getProjectStatusColor = (status: string) => {
    switch (status) {
      case "planning": return "bg-blue-100 text-blue-800";
      case "application": return "bg-orange-100 text-orange-800";
      case "approved": return "bg-green-100 text-green-800";
      case "in-progress": return "bg-purple-100 text-purple-800";
      case "completed": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getProjectTypeIcon = (type: string) => {
    switch (type) {
      case "solar": return <Zap className="h-5 w-5" />;
      case "mining": return <HardHat className="h-5 w-5" />;
      case "data-center": return <Monitor className="h-5 w-5" />;
      case "agricultural": return <Sprout className="h-5 w-5" />;
      case "mixed": return <Layers className="h-5 w-5" />;
      default: return <Building className="h-5 w-5" />;
    }
  };

  const handleCreateProject = () => {
    if (!newProject.title || !newProject.landOwner || !newProject.location || !newProject.type || !newProject.budget) {
      alert("Please fill in all required fields");
      return;
    }

    const project: Project = {
      id: (projects.length + 1).toString(),
      title: newProject.title,
      landOwner: newProject.landOwner,
      location: newProject.location,
      type: newProject.type as "solar" | "mining" | "data-center" | "agricultural" | "mixed",
      status: "planning",
      budget: newProject.budget,
      description: newProject.description,
      progress: 0,
      iotMetrics: { energy: 0, temperature: 0, uptime: 0, efficiency: 0 },
      timeline: newProject.timeline,
      applications: 0
    };

    setProjects([project, ...projects]);
    setShowCreateProject(false);
    setNewProject({
      title: "",
      landOwner: "",
      location: "",
      type: "",
      budget: "",
      description: "",
      timeline: "",
      requirements: [],
      expectedEnergy: "",
      landSize: "",
      investmentType: "equity",
      roi: "",
      sustainability: ""
    });
  };  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              className="flex items-center gap-2"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                <Users className="h-8 w-8 text-primary" />
                Community
              </h1>
              <p className="text-muted-foreground">Connect, collaborate, and govern</p>
            </div>
          </div>
          <div className="flex gap-2">
            <ThemeToggle />
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Post
            </Button>
          </div>
        </div>

        {/* Community Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="minimal-card p-6 india-saffron">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Active Members</p>
                <p className="text-2xl font-bold">1,234</p>
              </div>
              <Users className="h-8 w-8 text-foreground/80" />
            </div>
          </Card>

          <Card className="minimal-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Discussions</p>
                <p className="text-2xl font-bold text-foreground">3,456</p>
              </div>
              <MessageSquare className="h-8 w-8 text-primary/60" />
            </div>
          </Card>

          <Card className="minimal-card p-6 india-green">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Proposals</p>
                <p className="text-2xl font-bold">42</p>
              </div>
              <Vote className="h-8 w-8 text-foreground/80" />
            </div>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="feed" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="feed">Feed</TabsTrigger>
            <TabsTrigger value="proposals">Governance</TabsTrigger>
            <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
          </TabsList>

          <TabsContent value="feed" className="space-y-4">
            {posts.map((post) => (
              <Card key={post.id} className="minimal-card p-6">
                <div className="flex items-start gap-4">
                  <Avatar>
                    <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-foreground">{post.author}</h3>
                      <Badge variant="secondary">{post.category}</Badge>
                      <span className="text-sm text-muted-foreground">{post.timestamp}</span>
                    </div>
                    <p className="text-foreground mb-3">{post.content}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{post.likes} likes</span>
                      <span>{post.comments} comments</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="proposals" className="space-y-4">
            {proposals.map((proposal) => (
              <Card key={proposal.id} className="minimal-card p-6">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-1">{proposal.title}</h3>
                      <p className="text-muted-foreground mb-2">{proposal.description}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>By {proposal.author}</span>
                        <span>Deadline: {proposal.deadline}</span>
                      </div>
                    </div>
                    <Badge className={getStatusColor(proposal.status)}>
                      {proposal.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-4 text-sm">
                      <span className="text-green-600">For: {proposal.votesFor}</span>
                      <span className="text-red-600">Against: {proposal.votesAgainst}</span>
                    </div>
                    <Button variant="outline" size="sm">Vote</Button>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="opportunities" className="space-y-4">
            <JobBoard />
          </TabsContent>

          <TabsContent value="projects" className="space-y-4">
            {/* Project Creation Section */}
            <Card className="minimal-card p-6 border-dashed border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-secondary/5 hover:border-primary/50 transition-colors">
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="p-3 rounded-full bg-primary/20 border border-primary/30">
                    <Plus className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Create New Project</h3>
                  <p className="text-muted-foreground mb-4">Start a new solar energy, mining, or infrastructure project in your community</p>
                  <Dialog open={showCreateProject} onOpenChange={setShowCreateProject}>
                    <DialogTrigger asChild>
                      <Button className="w-full sm:w-auto">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Project
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto bg-background/95 backdrop-blur-sm border shadow-lg">
                      <DialogHeader className="space-y-3">
                        <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <Building className="h-5 w-5 text-primary" />
                          </div>
                          Create New Project
                        </DialogTitle>
                        <DialogDescription className="text-muted-foreground">
                          Fill in the details to create a new community project. All required fields must be completed.
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-6 py-4">
                        {/* Project Basic Info */}
                        <div className="space-y-4 p-4 rounded-lg bg-muted/30">
                          <h4 className="font-semibold text-sm text-foreground flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-primary"></div>
                            Basic Information
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="title">Project Title *</Label>
                              <Input
                                id="title"
                                placeholder="e.g., Mumbai Solar Farm Phase 1"
                                value={newProject.title}
                                onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="landOwner">Land Owner *</Label>
                              <Input
                                id="landOwner"
                                placeholder="e.g., Maharashtra State Board"
                                value={newProject.landOwner}
                                onChange={(e) => setNewProject({...newProject, landOwner: e.target.value})}
                              />
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="location">Location *</Label>
                              <Input
                                id="location"
                                placeholder="e.g., Mumbai, Maharashtra"
                                value={newProject.location}
                                onChange={(e) => setNewProject({...newProject, location: e.target.value})}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="type">Project Type *</Label>
                              <Select value={newProject.type} onValueChange={(value) => setNewProject({...newProject, type: value as any})}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select project type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="solar">
                                    <div className="flex items-center gap-2">
                                      <Zap className="h-4 w-4" />
                                      Solar Energy
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="mining">
                                    <div className="flex items-center gap-2">
                                      <HardHat className="h-4 w-4" />
                                      Mining Operations
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="data-center">
                                    <div className="flex items-center gap-2">
                                      <Monitor className="h-4 w-4" />
                                      Data Center
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="agricultural">
                                    <div className="flex items-center gap-2">
                                      <Sprout className="h-4 w-4" />
                                      Agricultural
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="mixed">
                                    <div className="flex items-center gap-2">
                                      <Layers className="h-4 w-4" />
                                      Mixed Use
                                    </div>
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>

                        {/* Project Details */}
                        <div className="space-y-4 p-4 rounded-lg bg-muted/30">
                          <h4 className="font-semibold text-sm text-foreground flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-primary"></div>
                            Project Details
                          </h4>
                          <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                              id="description"
                              placeholder="Describe your project goals, scope, and expected outcomes..."
                              value={newProject.description}
                              onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                              className="min-h-[100px]"
                            />
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="budget">Budget *</Label>
                              <Input
                                id="budget"
                                placeholder="e.g., ₹50 Crore"
                                value={newProject.budget}
                                onChange={(e) => setNewProject({...newProject, budget: e.target.value})}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="timeline">Timeline</Label>
                              <Input
                                id="timeline"
                                placeholder="e.g., 18 months"
                                value={newProject.timeline}
                                onChange={(e) => setNewProject({...newProject, timeline: e.target.value})}
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="landSize">Land Size</Label>
                              <Input
                                id="landSize"
                                placeholder="e.g., 100 acres"
                                value={newProject.landSize}
                                onChange={(e) => setNewProject({...newProject, landSize: e.target.value})}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="expectedEnergy">Expected Energy Output</Label>
                              <Input
                                id="expectedEnergy"
                                placeholder="e.g., 50 MW"
                                value={newProject.expectedEnergy}
                                onChange={(e) => setNewProject({...newProject, expectedEnergy: e.target.value})}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Investment & Sustainability */}
                        <div className="space-y-4 p-4 rounded-lg bg-muted/30">
                          <h4 className="font-semibold text-sm text-foreground flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-primary"></div>
                            Investment & Impact
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="investmentType">Investment Type</Label>
                              <Select value={newProject.investmentType} onValueChange={(value) => setNewProject({...newProject, investmentType: value as any})}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="equity">Equity Investment</SelectItem>
                                  <SelectItem value="loan">Loan Funding</SelectItem>
                                  <SelectItem value="grant">Grant Funded</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="roi">Expected ROI</Label>
                              <Input
                                id="roi"
                                placeholder="e.g., 12% annually"
                                value={newProject.roi}
                                onChange={(e) => setNewProject({...newProject, roi: e.target.value})}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="sustainability">Sustainability Rating</Label>
                              <Select value={newProject.sustainability} onValueChange={(value) => setNewProject({...newProject, sustainability: value as any})}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select rating" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="high">High Impact</SelectItem>
                                  <SelectItem value="medium">Medium Impact</SelectItem>
                                  <SelectItem value="low">Low Impact</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                      </div>

                      <DialogFooter className="flex gap-3 pt-6 border-t bg-muted/10">
                        <Button 
                          variant="outline" 
                          onClick={() => setShowCreateProject(false)}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                        <Button 
                          onClick={handleCreateProject}
                          className="flex-1"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Create Project
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </Card>

            {/* Existing Projects */}
            {projects.map((project) => (
              <Card key={project.id} className="minimal-card p-6">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getProjectTypeIcon(project.type)}
                        <h3 className="text-lg font-semibold text-foreground">{project.title}</h3>
                      </div>
                      <p className="text-muted-foreground mb-2">📍 {project.location} • 👤 {project.landOwner}</p>
                      <p className="text-foreground mb-3">{project.description}</p>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
                        <Badge className={getProjectStatusColor(project.status)}>
                          {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                        </Badge>
                        <span className="flex items-center gap-1">
                          💰 {project.budget}
                        </span>
                        <span className="flex items-center gap-1">
                          ⏱️ {project.timeline}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Progress</span>
                      <span className="text-primary font-semibold">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center pt-2">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {project.applications} applications
                      </span>
                      {project.progress > 0 && (
                        <span className="flex items-center gap-1">
                          ⚡ {project.iotMetrics.energy}% efficiency
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        📊 View Details
                      </Button>
                      <Button variant="default" size="sm">
                        🤝 Apply
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
            
            {projects.length === 0 && !loading && (
              <Card className="minimal-card p-8 text-center">
                <Building className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Projects Yet</h3>
                <p className="text-muted-foreground">Be the first to create a project in your community!</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="events" className="space-y-4">
            <Card className="minimal-card p-8 text-center">
              <Calendar className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Coming Soon</h3>
              <p className="text-muted-foreground">Events and meetups will be announced here</p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}