'use client';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Proposal } from '@/services/daoService';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

// Fix for default markers in react-leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Create custom icon for projects
const ProjectIcon = new Icon({
  iconUrl: markerIcon.src,
  shadowUrl: markerShadow.src,
  iconRetinaUrl: markerIcon2x.src,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface ProposalMapProps {
  proposals: Proposal[];
  onProposalSelect?: (proposal: Proposal) => void;
  className?: string;
}

export const ProposalMap = ({ proposals, onProposalSelect, className }: ProposalMapProps) => {
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Ensure this only renders on client to avoid hydration issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle proposal selection
  const handleProposalClick = (proposal: Proposal) => {
    setSelectedProposal(proposal);
    onProposalSelect?.(proposal);
  };

  // Get status color for proposals
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-blue-500';
      case 'passed':
        return 'bg-green-500';
      case 'rejected':
        return 'bg-red-500';
      case 'pending':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Filter proposals that have location data
  const proposalsWithLocation = proposals.filter((p) => p.location);

  // Default center (India - around Rajasthan area)
  const defaultCenter: [number, number] = [27.0238, 74.2179];

  if (!isClient) {
    return (
      <Card className={`p-4 ${className}`}>
        <div className='flex items-center justify-center h-64'>
          <div className='text-gray-500'>Loading map...</div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`overflow-hidden ${className}`}>
      <div className='p-4'>
        <div className='flex items-center justify-between mb-4'>
          <h3 className='text-lg font-semibold'>Solar Projects Map</h3>
          <Badge variant='outline'>
            {proposalsWithLocation.length} Project{proposalsWithLocation.length !== 1 ? 's' : ''}
          </Badge>
        </div>

        <div className='h-96 rounded-lg overflow-hidden'>
          <MapContainer
            center={defaultCenter}
            zoom={6}
            style={{ height: '100%', width: '100%' }}
            className='z-0'
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            />

            {proposalsWithLocation.map((proposal) => (
              <Marker
                key={proposal.id}
                position={[proposal.location!.latitude, proposal.location!.longitude]}
                icon={ProjectIcon}
                eventHandlers={{
                  click: () => handleProposalClick(proposal),
                }}
              >
                <Popup>
                  <div className='p-2 min-w-[200px]'>
                    <h4 className='font-semibold text-sm mb-2'>{proposal.title}</h4>
                    <p className='text-xs text-gray-600 mb-2 line-clamp-2'>
                      {proposal.description}
                    </p>
                    <div className='flex items-center justify-between mb-2'>
                      <Badge className={`text-xs ${getStatusColor(proposal.status)} text-white`}>
                        {proposal.status.toUpperCase()}
                      </Badge>
                      <Badge variant='outline' className='text-xs'>
                        {proposal.type.toUpperCase()}
                      </Badge>
                    </div>
                    <div className='text-xs text-gray-500 mb-1'>
                      📍 {proposal.location!.address}
                    </div>
                    <div className='text-xs text-gray-500'>
                      👍 {proposal.votesFor} | 👎 {proposal.votesAgainst}
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {selectedProposal && (
          <div className='mt-4 p-3 bg-gray-50 rounded-lg'>
            <div className='flex items-center justify-between mb-2'>
              <h4 className='font-semibold'>{selectedProposal.title}</h4>
              <Badge className={`${getStatusColor(selectedProposal.status)} text-white`}>
                {selectedProposal.status.toUpperCase()}
              </Badge>
            </div>
            <p className='text-sm text-gray-600 mb-2'>{selectedProposal.description}</p>
            <div className='flex items-center gap-4 text-xs text-gray-500'>
              <span>📍 {selectedProposal.location?.address}</span>
              <span>👍 {selectedProposal.votesFor}</span>
              <span>👎 {selectedProposal.votesAgainst}</span>
            </div>
          </div>
        )}

        {proposalsWithLocation.length === 0 && (
          <div className='text-center py-8 text-gray-500'>
            <p>No projects with location data available.</p>
            <p className='text-sm mt-1'>
              Projects will appear here once they include geographic coordinates.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ProposalMap;
