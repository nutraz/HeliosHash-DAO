'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  CreateDisputeRequest,
  Dispute,
  DisputeCategory,
  DisputePriority,
  DisputeStatus,
  formatDisputeCategory,
  getDisputePriorityColor,
  getDisputeStatusColor,
} from '@/types/dispute-resolution';
import { Clock, FileText, Filter, Gavel, Plus, Scale, Search, Vote } from 'lucide-react';
import React, { useEffect, useState } from 'react';

// Utility function for formatting timestamps
const formatTimestamp = (timestamp: bigint): string => {
  return new Date(Number(timestamp)).toLocaleDateString();
};

interface DisputeResolutionProps {
  // Props will be filled when connecting to backend
}

const DisputeResolution: React.FC<DisputeResolutionProps> = () => {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [filteredDisputes, setFilteredDisputes] = useState<Dispute[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<DisputeStatus | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<DisputeCategory | 'all'>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock data for development - replace with actual canister calls
  const mockDisputes: Dispute[] = [
    {
      id: 1,
      complainant: 'user123',
      respondent: 'contractor456',
      category: DisputeCategory.ContractorPerformance,
      priority: DisputePriority.High,
      title: 'Solar Panel Installation Delay',
      description:
        'Contractor has delayed solar panel installation by 3 weeks without proper notification',
      evidence: [],
      status: DisputeStatus.UnderReview,
      votes: [],
      createdAt: BigInt(Date.now() - 86400000),
      updatedAt: BigInt(Date.now() - 86400000),
      tags: ['solar', 'installation', 'delay'],
    },
    {
      id: 2,
      complainant: 'community789',
      respondent: 'project123',
      category: DisputeCategory.ProjectFunding,
      priority: DisputePriority.Medium,
      title: 'Funding Allocation Dispute',
      description: 'Disagreement over budget allocation for community solar project',
      evidence: [],
      status: DisputeStatus.InArbitration,
      votes: [],
      createdAt: BigInt(Date.now() - 172800000),
      updatedAt: BigInt(Date.now() - 86400000),
      tags: ['funding', 'budget', 'community'],
    },
  ];

  useEffect(() => {
    // Mock loading - replace with actual canister call
    setTimeout(() => {
      setDisputes(mockDisputes);
      setFilteredDisputes(mockDisputes);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter disputes based on search and filters
  useEffect(() => {
    let filtered = disputes;

    if (searchTerm) {
      filtered = filtered.filter(
        (dispute) =>
          dispute.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          dispute.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((dispute) => dispute.status === statusFilter);
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter((dispute) => dispute.category === categoryFilter);
    }

    setFilteredDisputes(filtered);
  }, [disputes, searchTerm, statusFilter, categoryFilter]);

  const handleCreateDispute = (formData: CreateDisputeRequest) => {
    // TODO: Replace with actual canister call
    console.log('Creating dispute:', formData);
    setIsCreateDialogOpen(false);
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900 flex items-center gap-2'>
            <Scale className='h-8 w-8' />
            Dispute Resolution
          </h1>
          <p className='text-gray-600 mt-1'>
            Manage and resolve conflicts within the HeliosHash DAO community
          </p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className='flex items-center gap-2'>
              <Plus className='h-4 w-4' />
              File Dispute
            </Button>
          </DialogTrigger>
          <DialogContent className='max-w-2xl'>
            <DialogHeader>
              <DialogTitle>File a New Dispute</DialogTitle>
              <DialogDescription>
                Submit a formal dispute for community review and resolution
              </DialogDescription>
            </DialogHeader>
            <CreateDisputeForm onSubmit={handleCreateDispute} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Filter className='h-5 w-5' />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
              <Input
                placeholder='Search disputes...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='pl-10'
              />
            </div>

            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value as DisputeStatus | 'all')}
            >
              <SelectTrigger>
                <SelectValue placeholder='Filter by status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Statuses</SelectItem>
                {Object.values(DisputeStatus).map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={categoryFilter}
              onValueChange={(value) => setCategoryFilter(value as DisputeCategory | 'all')}
            >
              <SelectTrigger>
                <SelectValue placeholder='Filter by category' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Categories</SelectItem>
                {Object.values(DisputeCategory).map((category) => (
                  <SelectItem key={category} value={category}>
                    {formatDisputeCategory(category)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className='flex items-center gap-2'>
              <Badge variant='outline'>{filteredDisputes.length} disputes</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Disputes List */}
      <div className='space-y-4'>
        {filteredDisputes.length === 0 ? (
          <Card>
            <CardContent className='py-12 text-center'>
              <Scale className='h-12 w-12 mx-auto text-gray-400 mb-4' />
              <h3 className='text-lg font-semibold text-gray-900 mb-2'>No Disputes Found</h3>
              <p className='text-gray-600'>No disputes match your current filters.</p>
            </CardContent>
          </Card>
        ) : (
          filteredDisputes.map((dispute) => (
            <DisputeCard
              key={String(dispute.id)}
              dispute={dispute}
              onClick={() => setSelectedDispute(dispute)}
            />
          ))
        )}
      </div>

      {/* Dispute Details Modal */}
      {selectedDispute && (
        <Dialog open={!!selectedDispute} onOpenChange={() => setSelectedDispute(null)}>
          <DialogContent className='max-w-4xl max-h-[80vh] overflow-y-auto'>
            <DisputeDetails dispute={selectedDispute} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

// Individual Dispute Card Component
const DisputeCard: React.FC<{ dispute: Dispute; onClick: () => void }> = ({ dispute, onClick }) => {
  return (
    <Card className='hover:shadow-md transition-shadow cursor-pointer' onClick={onClick}>
      <CardContent className='p-6'>
        <div className='flex items-start justify-between mb-4'>
          <div className='flex-1'>
            <div className='flex items-center gap-2 mb-2'>
              <h3 className='text-lg font-semibold text-gray-900'>{dispute.title}</h3>
              <Badge variant='outline' className={getDisputeStatusColor(dispute.status)}>
                {dispute.status}
              </Badge>
              <Badge variant='outline' className={getDisputePriorityColor(dispute.priority)}>
                {dispute.priority}
              </Badge>
            </div>
            <p className='text-gray-600 text-sm mb-3 line-clamp-2'>{dispute.description}</p>
            <div className='flex items-center gap-4 text-sm text-gray-500'>
              <span className='flex items-center gap-1'>
                <FileText className='h-4 w-4' />
                {formatDisputeCategory(dispute.category)}
              </span>
              <span className='flex items-center gap-1'>
                <Clock className='h-4 w-4' />
                {formatTimestamp(dispute.createdAt)}
              </span>
              <span className='flex items-center gap-1'>
                <Vote className='h-4 w-4' />
                {dispute.votes.length} votes
              </span>
            </div>
          </div>
        </div>

        <div className='flex flex-wrap gap-1'>
          {dispute.tags.map((tag) => (
            <Badge key={tag} variant='secondary' className='text-xs'>
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Create Dispute Form Component
const CreateDisputeForm: React.FC<{ onSubmit: (data: CreateDisputeRequest) => void }> = ({
  onSubmit,
}) => {
  const [formData, setFormData] = useState<CreateDisputeRequest>({
    respondent: '',
    category: DisputeCategory.ProjectFunding,
    priority: DisputePriority.Medium,
    title: '',
    description: '',
    tags: [],
  });
  const [tagsInput, setTagsInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tags = tagsInput
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);
    onSubmit({ ...formData, tags });
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div>
        <Label htmlFor='respondent'>Respondent (User ID)</Label>
        <Input
          id='respondent'
          value={formData.respondent}
          onChange={(e) => setFormData({ ...formData, respondent: e.target.value })}
          placeholder="Enter the respondent's user ID"
          required
        />
      </div>

      <div className='grid grid-cols-2 gap-4'>
        <div>
          <Label htmlFor='category'>Category</Label>
          <Select
            value={formData.category}
            onValueChange={(value) =>
              setFormData({ ...formData, category: value as DisputeCategory })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.values(DisputeCategory).map((category) => (
                <SelectItem key={category} value={category}>
                  {formatDisputeCategory(category)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor='priority'>Priority</Label>
          <Select
            value={formData.priority}
            onValueChange={(value) =>
              setFormData({ ...formData, priority: value as DisputePriority })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.values(DisputePriority).map((priority) => (
                <SelectItem key={priority} value={priority}>
                  {priority}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor='title'>Dispute Title</Label>
        <Input
          id='title'
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder='Brief title describing the dispute'
          required
        />
      </div>

      <div>
        <Label htmlFor='description'>Description</Label>
        <Textarea
          id='description'
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder='Detailed description of the dispute and desired resolution'
          rows={4}
          required
        />
      </div>

      <div>
        <Label htmlFor='tags'>Tags (comma-separated)</Label>
        <Input
          id='tags'
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          placeholder='solar, funding, community, etc.'
        />
      </div>

      <div className='flex gap-2 justify-end'>
        <Button type='button' variant='outline'>
          Cancel
        </Button>
        <Button type='submit'>Submit Dispute</Button>
      </div>
    </form>
  );
};

// Dispute Details Component
const DisputeDetails: React.FC<{ dispute: Dispute }> = ({ dispute }) => {
  return (
    <div className='space-y-6'>
      <div>
        <div className='flex items-center justify-between mb-4'>
          <h2 className='text-2xl font-bold text-gray-900'>{dispute.title}</h2>
          <div className='flex gap-2'>
            <Badge
              className={`bg-${getDisputeStatusColor(
                dispute.status
              )}-50 text-${getDisputeStatusColor(dispute.status)}-700`}
            >
              {dispute.status}
            </Badge>
            <Badge
              className={`bg-${getDisputePriorityColor(
                dispute.priority
              )}-50 text-${getDisputePriorityColor(dispute.priority)}-700`}
            >
              {dispute.priority}
            </Badge>
          </div>
        </div>

        <div className='grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4'>
          <div>
            <strong>Category:</strong> {formatDisputeCategory(dispute.category)}
          </div>
          <div>
            <strong>Created:</strong> {formatTimestamp(dispute.createdAt)}
          </div>
          <div>
            <strong>Complainant:</strong> {dispute.complainant}
          </div>
          <div>
            <strong>Respondent:</strong> {dispute.respondent}
          </div>
        </div>

        <p className='text-gray-700 mb-4'>{dispute.description}</p>

        <div className='flex flex-wrap gap-1 mb-6'>
          {dispute.tags.map((tag) => (
            <Badge key={tag} variant='secondary'>
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Evidence Section */}
      <div>
        <h3 className='text-lg font-semibold mb-3 flex items-center gap-2'>
          <FileText className='h-5 w-5' />
          Evidence ({dispute.evidence.length})
        </h3>
        {dispute.evidence.length === 0 ? (
          <p className='text-gray-500'>No evidence submitted yet.</p>
        ) : (
          <div className='space-y-2'>
            {dispute.evidence.map((evidence) => (
              <Card key={evidence.id}>
                <CardContent className='p-4'>
                  <h4 className='font-medium'>{evidence.title}</h4>
                  <p className='text-sm text-gray-600'>{evidence.description}</p>
                  <p className='text-xs text-gray-500 mt-2'>
                    Submitted by {evidence.submittedBy} on{' '}
                    {formatTimestamp(BigInt(evidence.timestamp))}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Voting Section */}
      <div>
        <h3 className='text-lg font-semibold mb-3 flex items-center gap-2'>
          <Vote className='h-5 w-5' />
          Community Votes ({dispute.votes.length})
        </h3>
        {dispute.votes.length === 0 ? (
          <p className='text-gray-500'>No votes cast yet.</p>
        ) : (
          <div className='space-y-2'>
            {dispute.votes.map((vote, index) => (
              <Card key={index}>
                <CardContent className='p-4'>
                  <div className='flex items-center justify-between'>
                    <span className='font-medium'>{vote.voter}</span>
                    <Badge variant={vote.decision ? 'default' : 'secondary'}>
                      {vote.decision ? 'Support Complainant' : 'Support Respondent'}
                    </Badge>
                  </div>
                  {vote.reasoning && <p className='text-sm text-gray-600 mt-2'>{vote.reasoning}</p>}
                  <p className='text-xs text-gray-500 mt-2'>
                    {formatTimestamp(BigInt(vote.timestamp))}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Arbitrator Decision */}
      {dispute.arbitratorDecision && (
        <div>
          <h3 className='text-lg font-semibold mb-3 flex items-center gap-2'>
            <Gavel className='h-5 w-5' />
            Arbitrator Decision
          </h3>
          <Card>
            <CardContent className='p-4'>
              <div className='mb-3'>
                <strong>Arbitrator:</strong> {dispute.arbitratorDecision.arbitrator}
              </div>
              <div className='mb-3'>
                <strong>Decision:</strong> {dispute.arbitratorDecision.decision}
              </div>
              <div className='mb-3'>
                <strong>Reasoning:</strong> {dispute.arbitratorDecision.reasoning}
              </div>
              {dispute.arbitratorDecision.compensationAmount && (
                <div className='mb-3'>
                  <strong>Compensation:</strong> {dispute.arbitratorDecision.compensationAmount}{' '}
                  tokens
                </div>
              )}
              {dispute.arbitratorDecision.actionRequired && (
                <div className='mb-3'>
                  <strong>Required Action:</strong> {dispute.arbitratorDecision.actionRequired}
                </div>
              )}
              <p className='text-xs text-gray-500'>
                {formatTimestamp(BigInt(dispute.arbitratorDecision.timestamp))}
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default DisputeResolution;
