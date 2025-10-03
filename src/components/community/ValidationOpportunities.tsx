'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuthContext';
import { validationService } from '@/services/validationService';
import { ValidationOpportunity } from '@/types/validation';
import {
  AlertTriangle,
  CheckCircle,
  Coins,
  Filter,
  RefreshCw,
  Search,
  User,
  Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { DuoValidationOpportunityCard } from './validation/DuoValidationOpportunityCard';

interface ValidationOpportunitiesProps {
  onApply?: (opportunityId: string, sessionType: 'solo' | 'duo') => void;
}

export function ValidationOpportunities({ onApply }: ValidationOpportunitiesProps) {
  const { user } = useAuth();
  const [opportunities, setOpportunities] = useState<ValidationOpportunity[]>([]);
  const [filteredOpportunities, setFilteredOpportunities] = useState<ValidationOpportunity[]>([]);
  const [partnerNeededOpportunities, setPartnerNeededOpportunities] = useState<
    ValidationOpportunity[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOpportunities: 0,
    duoOpportunities: 0,
    partnerNeeded: 0,
    highPriority: 0,
    averageReward: 0,
    averageDuoReward: 0,
  });

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedValidationType, setSelectedValidationType] = useState<string>('all');
  const [selectedExperienceLevel, setSelectedExperienceLevel] = useState<string>('all');
  const [selectedDuoPreference, setSelectedDuoPreference] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('all');

  // User preferences
  const userPrefersDuo = user?.prefersDuoValidation || false;

  useEffect(() => {
    loadValidationOpportunities();
    loadStats();
  }, [userPrefersDuo]);

  useEffect(() => {
    applyFilters();
  }, [
    opportunities,
    searchTerm,
    selectedValidationType,
    selectedExperienceLevel,
    selectedDuoPreference,
    activeTab,
  ]);

  const loadValidationOpportunities = async () => {
    setLoading(true);
    try {
      const [allOpportunities, partnerNeeded] = await Promise.all([
        validationService.getValidationOpportunities(
          undefined, // No filters initially
          user?.location,
          userPrefersDuo
        ),
        validationService.getPartnerNeededOpportunities(),
      ]);

      setOpportunities(allOpportunities);
      setPartnerNeededOpportunities(partnerNeeded);
    } catch (error) {
      console.error('Failed to load validation opportunities:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const validationStats = await validationService.getValidationStats(userPrefersDuo);
      setStats(validationStats);
    } catch (error) {
      console.error('Failed to load validation stats:', error);
    }
  };

  const applyFilters = () => {
    let filtered = [...opportunities];

    // Tab-based filtering
    if (activeTab === 'duo-preferred' && userPrefersDuo) {
      filtered = filtered.filter((op) => op.supportsDuoValidation);
    } else if (activeTab === 'partner-needed') {
      filtered = filtered.filter((op) => op.status === 'PartiallyFilled');
    } else if (activeTab === 'solo-only') {
      filtered = filtered.filter((op) => !op.supportsDuoValidation || op.maxValidators === 1);
    } else if (activeTab === 'high-priority') {
      filtered = filtered.filter((op) => op.priority === 'High' || op.priority === 'Critical');
    }

    // Search term filtering
    if (searchTerm) {
      filtered = filtered.filter(
        (op) =>
          op.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          op.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          op.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          op.location.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Validation type filtering
    if (selectedValidationType !== 'all') {
      filtered = filtered.filter((op) => op.validationType === selectedValidationType);
    }

    // Experience level filtering
    if (selectedExperienceLevel !== 'all') {
      filtered = filtered.filter((op) => op.experienceLevel === selectedExperienceLevel);
    }

    // Duo preference filtering
    if (selectedDuoPreference !== 'all') {
      switch (selectedDuoPreference) {
        case 'duo-only':
          filtered = filtered.filter((op) => op.supportsDuoValidation);
          break;
        case 'solo-only':
          filtered = filtered.filter((op) => !op.supportsDuoValidation);
          break;
        case 'partner-needed':
          filtered = filtered.filter((op) => op.status === 'PartiallyFilled');
          break;
      }
    }

    setFilteredOpportunities(filtered);
  };

  const handleApply = async (opportunityId: string, sessionType: 'solo' | 'duo') => {
    if (!user) return;

    try {
      const result = await validationService.applyForValidation(
        opportunityId,
        user.id,
        user.displayName || user.username || 'Unknown User',
        sessionType
      );

      if (result.success) {
        // Refresh opportunities to show updated status
        await loadValidationOpportunities();
        await loadStats();

        // Call parent callback if provided
        if (onApply) {
          onApply(opportunityId, sessionType);
        }
      }

      // In a real app, you'd show a toast notification here
      console.log(result.message);
    } catch (error) {
      console.error('Failed to apply for validation:', error);
    }
  };

  const getTabCount = (tabType: string): number => {
    switch (tabType) {
      case 'duo-preferred':
        return opportunities.filter((op) => op.supportsDuoValidation).length;
      case 'partner-needed':
        return partnerNeededOpportunities.length;
      case 'solo-only':
        return opportunities.filter((op) => !op.supportsDuoValidation).length;
      case 'high-priority':
        return opportunities.filter((op) => op.priority === 'High' || op.priority === 'Critical')
          .length;
      default:
        return opportunities.length;
    }
  };

  if (loading) {
    return (
      <div className='space-y-6'>
        <div className='text-center py-8'>
          <RefreshCw className='w-8 h-8 animate-spin text-blue-400 mx-auto mb-4' />
          <div className='text-gray-400'>Loading validation opportunities...</div>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Stats Overview */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        <Card className='bg-gray-800/50 border-gray-700'>
          <CardContent className='p-4'>
            <div className='flex items-center gap-3'>
              <CheckCircle className='w-8 h-8 text-blue-400' />
              <div>
                <div className='text-2xl font-bold text-white'>{stats.totalOpportunities}</div>
                <div className='text-sm text-gray-400'>Total Opportunities</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='bg-gray-800/50 border-gray-700'>
          <CardContent className='p-4'>
            <div className='flex items-center gap-3'>
              <Users className='w-8 h-8 text-green-400' />
              <div>
                <div className='text-2xl font-bold text-white'>{stats.duoOpportunities}</div>
                <div className='text-sm text-gray-400'>Duo Validations</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='bg-gray-800/50 border-gray-700'>
          <CardContent className='p-4'>
            <div className='flex items-center gap-3'>
              <AlertTriangle className='w-8 h-8 text-yellow-400' />
              <div>
                <div className='text-2xl font-bold text-white'>{stats.partnerNeeded}</div>
                <div className='text-sm text-gray-400'>Need Partners</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='bg-gray-800/50 border-gray-700'>
          <CardContent className='p-4'>
            <div className='flex items-center gap-3'>
              <Coins className='w-8 h-8 text-yellow-400' />
              <div>
                <div className='text-2xl font-bold text-white'>
                  {Math.round(stats.averageDuoReward || stats.averageReward)}
                </div>
                <div className='text-sm text-gray-400'>Avg Reward (OWP)</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Preference Banner */}
      {userPrefersDuo && partnerNeededOpportunities.length > 0 && (
        <Card className='bg-gradient-to-r from-green-500/20 to-blue-500/20 border-green-500/50'>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <Users className='w-6 h-6 text-green-400' />
                <div>
                  <div className='font-semibold text-white'>
                    {partnerNeededOpportunities.length} Validation
                    {partnerNeededOpportunities.length > 1 ? 's' : ''} Need Partners!
                  </div>
                  <div className='text-sm text-gray-300'>
                    Perfect opportunities for duo validation with enhanced rewards
                  </div>
                </div>
              </div>
              <Button
                size='sm'
                onClick={() => setActiveTab('partner-needed')}
                className='bg-green-600 hover:bg-green-700'
              >
                View Opportunities
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters and Search */}
      <Card className='bg-gray-800/50 border-gray-700'>
        <CardHeader>
          <CardTitle className='text-white flex items-center gap-2'>
            <Filter className='w-5 h-5' />
            Filter Opportunities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
            <div className='relative'>
              <Search className='absolute left-3 top-3 w-4 h-4 text-gray-400' />
              <Input
                placeholder='Search opportunities...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='pl-10 bg-gray-700 border-gray-600 text-white'
              />
            </div>

            <Select value={selectedValidationType} onValueChange={setSelectedValidationType}>
              <SelectTrigger className='bg-gray-700 border-gray-600 text-white'>
                <SelectValue placeholder='Validation Type' />
              </SelectTrigger>
              <SelectContent className='bg-gray-700 border-gray-600'>
                <SelectItem value='all' className='text-white'>
                  All Types
                </SelectItem>
                <SelectItem value='Installation' className='text-white'>
                  Installation
                </SelectItem>
                <SelectItem value='Maintenance' className='text-white'>
                  Maintenance
                </SelectItem>
                <SelectItem value='Performance' className='text-white'>
                  Performance
                </SelectItem>
                <SelectItem value='Compliance' className='text-white'>
                  Compliance
                </SelectItem>
                <SelectItem value='Safety' className='text-white'>
                  Safety
                </SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedExperienceLevel} onValueChange={setSelectedExperienceLevel}>
              <SelectTrigger className='bg-gray-700 border-gray-600 text-white'>
                <SelectValue placeholder='Experience Level' />
              </SelectTrigger>
              <SelectContent className='bg-gray-700 border-gray-600'>
                <SelectItem value='all' className='text-white'>
                  All Levels
                </SelectItem>
                <SelectItem value='Entry' className='text-white'>
                  Entry Level
                </SelectItem>
                <SelectItem value='Mid' className='text-white'>
                  Mid Level
                </SelectItem>
                <SelectItem value='Senior' className='text-white'>
                  Senior Level
                </SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedDuoPreference} onValueChange={setSelectedDuoPreference}>
              <SelectTrigger className='bg-gray-700 border-gray-600 text-white'>
                <SelectValue placeholder='Validation Mode' />
              </SelectTrigger>
              <SelectContent className='bg-gray-700 border-gray-600'>
                <SelectItem value='all' className='text-white'>
                  All Modes
                </SelectItem>
                <SelectItem value='duo-only' className='text-white'>
                  Duo Only
                </SelectItem>
                <SelectItem value='solo-only' className='text-white'>
                  Solo Only
                </SelectItem>
                <SelectItem value='partner-needed' className='text-white'>
                  Partner Needed
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Opportunity Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
        <TabsList className='grid w-full grid-cols-2 md:grid-cols-5 bg-gray-800 border-gray-700'>
          <TabsTrigger
            value='all'
            className='data-[state=active]:bg-blue-600 data-[state=active]:text-white'
          >
            All ({getTabCount('all')})
          </TabsTrigger>

          {userPrefersDuo && (
            <TabsTrigger
              value='duo-preferred'
              className='data-[state=active]:bg-green-600 data-[state=active]:text-white'
            >
              <Users className='w-4 h-4 mr-1' />
              Duo ({getTabCount('duo-preferred')})
            </TabsTrigger>
          )}

          <TabsTrigger
            value='partner-needed'
            className='data-[state=active]:bg-yellow-600 data-[state=active]:text-white'
          >
            Partner Needed ({getTabCount('partner-needed')})
          </TabsTrigger>

          <TabsTrigger
            value='solo-only'
            className='data-[state=active]:bg-purple-600 data-[state=active]:text-white'
          >
            <User className='w-4 h-4 mr-1' />
            Solo ({getTabCount('solo-only')})
          </TabsTrigger>

          <TabsTrigger
            value='high-priority'
            className='data-[state=active]:bg-red-600 data-[state=active]:text-white'
          >
            High Priority ({getTabCount('high-priority')})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className='mt-6'>
          {filteredOpportunities.length > 0 ? (
            <div className='grid gap-6'>
              {filteredOpportunities.map((opportunity) => (
                <DuoValidationOpportunityCard
                  key={opportunity.id}
                  opportunity={opportunity}
                  onApply={handleApply}
                  showPartnerMatches={userPrefersDuo}
                />
              ))}
            </div>
          ) : (
            <Card className='bg-gray-800/50 border-gray-700'>
              <CardContent className='p-8 text-center'>
                <div className='text-gray-400 mb-4'>No validation opportunities found</div>
                <div className='text-sm text-gray-500'>
                  Try adjusting your filters or check back later for new opportunities
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
