"use client";
import React, { useEffect, useState } from 'react';
import { Badge } from './ui/badge';
import { Card } from './ui/card';

interface BadgeTemplate {
  id: number;
  name: string;
  nameEnglish: string;
  description: string;
  descriptionEnglish: string;
  category: string;
  emoji: string;
  criteria: string;
  owpReward: number;
  isActive: boolean;
  maxSupply?: number;
  currentSupply: number;
}

interface Badge {
  id: number;
  template: BadgeTemplate;
  owner: string;
  mintedAt: bigint;
  metadata?: string;
  verified: boolean;
}


const BADGE_CATEGORIES = [
  'All',
  'Community',
  'Language',
  'Solar',
  'Voice',
  'Governance',
  'Cultural',
  'Achievement',
];

const STATUS_OPTIONS = ['All', 'Completed', 'In Progress', 'Pending'];
const REWARD_RANGES = [
  { label: 'All', min: 0, max: Infinity },
  { label: '< 500', min: 0, max: 499 },
  { label: '500-1000', min: 500, max: 1000 },
  { label: '> 1000', min: 1001, max: Infinity },
];

const NftCollection: React.FC<{ principal?: string }> = ({ principal }) => {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);

  const [filter, setFilter] = useState('All');
  const [status, setStatus] = useState('All');
  const [rewardRange, setRewardRange] = useState(REWARD_RANGES[0]);
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  // MOCK DATA for UI development
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setBadges([
        {
          id: 1,
          template: {
            id: 1,
            name: 'स्वागत बैज',
            nameEnglish: 'Welcome Badge',
            description: 'हेलियोसहैश DAO में सफल पंजीकरण',
            descriptionEnglish: 'Successful registration in HeliosHash DAO',
            category: 'Community',
            emoji: '🏆',
            criteria: 'Complete onboarding process',
            owpReward: 10,
            isActive: true,
            maxSupply: undefined,
            currentSupply: 1,
          },
          owner: 'aaaaa-aa',
          mintedAt: BigInt(Date.now() * 1_000_000),
          metadata: 'Onboarding',
          verified: true,
        },
        {
          id: 2,
          template: {
            id: 2,
            name: 'भाषा मास्टर',
            nameEnglish: 'Language Master',
            description: 'हिंदी भाषा का सफल चयन और उपयोग',
            descriptionEnglish: 'Successful selection and usage of Hindi language',
            category: 'Language',
            emoji: '🗣️',
            criteria: 'Select Hindi as preferred language and complete 5 actions',
            owpReward: 15,
            isActive: true,
            maxSupply: undefined,
            currentSupply: 1,
          },
          owner: 'aaaaa-aa',
          mintedAt: BigInt(Date.now() * 1_000_000 - 86400_000_000_000),
          metadata: 'Language onboarding',
          verified: true,
        },
        {
          id: 3,
          template: {
            id: 3,
            name: 'सोलर एडवोकेट',
            nameEnglish: 'Solar Advocate',
            description: 'सौर ऊर्जा समुदाय में पूर्ण सदस्यता',
            descriptionEnglish: 'Full membership in solar energy community',
            category: 'Solar',
            emoji: '☀️',
            criteria: 'Complete membership registration and first vote',
            owpReward: 25,
            isActive: true,
            maxSupply: undefined,
            currentSupply: 1,
          },
          owner: 'aaaaa-aa',
          mintedAt: BigInt(Date.now() * 1_000_000 - 172800_000_000_000),
          metadata: 'Solar onboarding',
          verified: false,
        },
      ]);
      setLoading(false);
    }, 500);
  }, [principal]);

  if (loading) return <div>Loading your NFT badges...</div>;
  if (!badges.length) return <div>No NFT badges found.</div>;


  // Status logic (mock):
  // Completed: verified === true
  // In Progress: verified === false && mintedAt < now
  // Pending: not minted (not in badges) -- not possible in this mock, so show none

  let filteredBadges = badges;
  if (filter !== 'All') {
    filteredBadges = filteredBadges.filter((b) => b.template.category === filter);
  }
  if (status !== 'All') {
    if (status === 'Completed') {
      filteredBadges = filteredBadges.filter((b) => b.verified);
    } else if (status === 'In Progress') {
      filteredBadges = filteredBadges.filter((b) => !b.verified);
    } else if (status === 'Pending') {
      filteredBadges = [];
    }
  }
  if (rewardRange.label !== 'All') {
    filteredBadges = filteredBadges.filter(
      (b) => b.template.owpReward >= rewardRange.min && b.template.owpReward <= rewardRange.max
    );
  }

  return (
    <>

      {/* Category Filter Bar */}
      <div className="flex flex-wrap gap-2 mb-2 justify-center">
        {BADGE_CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
              filter === cat
                ? 'bg-orange-500 text-white border-orange-500'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-orange-100'
            }`}
            onClick={() => setFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Status Filter Bar */}
      <div className="flex flex-wrap gap-2 mb-2 justify-center">
        {STATUS_OPTIONS.map((opt) => (
          <button
            key={opt}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
              status === opt
                ? 'bg-green-600 text-white border-green-600'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-green-100'
            }`}
            onClick={() => setStatus(opt)}
          >
            {opt}
          </button>
        ))}
      </div>

      {/* OWP Reward Filter Bar */}
      <div className="flex flex-wrap gap-2 mb-4 justify-center">
        {REWARD_RANGES.map((range) => (
          <button
            key={range.label}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
              rewardRange.label === range.label
                ? 'bg-purple-600 text-white border-purple-600'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-purple-100'
            }`}
            onClick={() => setRewardRange(range)}
          >
            {range.label}
          </button>
        ))}
      </div>

      {/* Badge Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {filteredBadges.map((badge) => (
          <Card
            key={badge.id}
            className="flex flex-col items-center p-3 sm:p-4 bg-gradient-to-br from-orange-50 to-blue-50 border-0 shadow-md hover:scale-105 transition-transform cursor-pointer"
            onClick={() => setSelectedBadge(badge)}
            tabIndex={0}
            role="button"
            aria-label={`View details for ${badge.template.nameEnglish}`}
          >
            <div className="text-4xl mb-1 sm:mb-2 drop-shadow-sm">{badge.template.emoji}</div>
            <h3 className="font-bold text-base sm:text-lg mb-0.5 text-center leading-tight">
              {badge.template.nameEnglish}
            </h3>
            <Badge
              className={`mb-1 sm:mb-2 px-2 py-0.5 rounded-full text-xs font-medium ${
                badge.template.category === 'Community'
                  ? 'bg-blue-100 text-blue-700'
                  : badge.template.category === 'Language'
                  ? 'bg-green-100 text-green-700'
                  : badge.template.category === 'Solar'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {badge.template.category}
            </Badge>
            <p className="text-xs sm:text-sm text-gray-600 mb-1 text-center line-clamp-2">
              {badge.template.descriptionEnglish}
            </p>
            <div className="flex items-center gap-1 text-xs text-orange-600 font-semibold mb-1">
              <span>+{badge.template.owpReward}</span>
              <span>OWP</span>
            </div>
            <div className="text-[10px] text-gray-400 mb-0.5">
              Minted: {new Date(Number(badge.mintedAt) / 1_000_000).toLocaleDateString()}
            </div>
            {badge.verified && (
              <span className="text-green-600 text-[10px] font-medium">Verified</span>
            )}
          </Card>
        ))}
      </div>

      {/* Badge Details Modal */}
      {selectedBadge && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => setSelectedBadge(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-white rounded-xl shadow-xl max-w-xs w-full p-6 relative flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl"
              onClick={() => setSelectedBadge(null)}
              aria-label="Close badge details"
            >
              ×
            </button>
            <div className="text-6xl mb-3">{selectedBadge.template.emoji}</div>
            <h2 className="font-bold text-lg mb-1 text-center">
              {selectedBadge.template.nameEnglish}
            </h2>
            <Badge
              className={`mb-2 px-3 py-1 rounded-full text-xs font-medium ${
                selectedBadge.template.category === 'Community'
                  ? 'bg-blue-100 text-blue-700'
                  : selectedBadge.template.category === 'Language'
                  ? 'bg-green-100 text-green-700'
                  : selectedBadge.template.category === 'Solar'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {selectedBadge.template.category}
            </Badge>
            <p className="text-sm text-gray-700 mb-2 text-center">
              {selectedBadge.template.descriptionEnglish}
            </p>
            <div className="mb-2 text-xs text-gray-500 text-center">
              <span className="block font-medium text-gray-800">Criteria:</span>
              {selectedBadge.template.criteria}
            </div>
            <div className="flex items-center gap-1 text-sm text-orange-600 font-semibold mb-2">
              <span>+{selectedBadge.template.owpReward}</span>
              <span>OWP</span>
            </div>
            <div className="text-xs text-gray-400 mb-1">
              Minted: {new Date(Number(selectedBadge.mintedAt) / 1_000_000).toLocaleString()}
            </div>
            {selectedBadge.verified && (
              <span className="text-green-600 text-xs font-medium">Verified</span>
            )}
            {selectedBadge.metadata && (
              <div className="mt-2 text-xs text-gray-500 text-center">
                <span className="font-medium text-gray-800">Context:</span> {selectedBadge.metadata}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default NftCollection;
