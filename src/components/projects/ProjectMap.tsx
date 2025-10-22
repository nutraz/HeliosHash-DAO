'use client';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { MOCK_SOLAR_PROJECTS, SolarProject } from '../../types/enhanced-solar-project';

// Fix for default markers in react-leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Create custom icon to fix marker display issues
const DefaultIcon = new Icon({
  iconUrl: markerIcon.src,
  shadowUrl: markerShadow.src,
  iconRetinaUrl: markerIcon2x.src,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface ProjectMapProps {
  onProjectSelect?: (project: SolarProject) => void;
  className?: string;
}

export const ProjectMap = ({ onProjectSelect, className }: ProjectMapProps) => {
  const [selectedProject, setSelectedProject] = useState<SolarProject | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Ensure this only renders on client to avoid hydration issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle project selection
  const handleProjectClick = (project: SolarProject) => {
    setSelectedProject(project);
    onProjectSelect?.(project);
  };

  // Get status color
  const getStatusColor = (stage: string) => {
    switch (stage) {
      case 'operational':
        return 'bg-emerald-500 text-white';
      case 'construction':
        return 'bg-amber-500 text-white';
      case 'installation':
        return 'bg-blue-500 text-white';
      case 'planning':
        return 'bg-slate-500 text-white';
      default:
        return 'bg-purple-500 text-white';
    }
  };

  // Format capacity display
  const formatCapacity = (kw: number) => {
    if (kw >= 1000) return `${(kw / 1000).toFixed(1)} MW`;
    return `${kw} kW`;
  };

  // Default center: Uttarakhand region
  const defaultCenter: [number, number] = [30.0668, 79.0193];

  if (!isClient) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className='h-96 bg-slate-100 rounded-lg flex items-center justify-center'>
          <p className='text-slate-500'>Loading map...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`overflow-hidden ${className}`}>
      <div className='relative h-96'>
        <MapContainer
          center={defaultCenter}
          zoom={8}
          style={{ height: '100%', width: '100%' }}
          className='rounded-lg'
        >
          <TileLayer
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {MOCK_SOLAR_PROJECTS.map((project) => (
            <Marker
              key={project.id}
              position={[project.location.latitude, project.location.longitude]}
              icon={DefaultIcon}
            >
              <Popup className='font-sans'>
                <div className='p-2 min-w-[250px]'>
                  <div className='flex items-start justify-between mb-2'>
                    <h3 className='font-semibold text-sm text-slate-900 pr-2'>{project.name}</h3>
                    <Badge className={`text-xs ${getStatusColor(project.progress.stage)}`}>
                      {project.progress.stage}
                    </Badge>
                  </div>

                  <p className='text-xs text-slate-600 mb-2 line-clamp-2'>{project.description}</p>

                  <div className='space-y-1 text-xs'>
                    <div className='flex justify-between'>
                      <span className='text-slate-500'>Capacity:</span>
                      <span className='font-medium'>{formatCapacity(project.capacity_kw)}</span>
                    </div>

                    <div className='flex justify-between'>
                      <span className='text-slate-500'>Investment:</span>
                      <span className='font-medium'>
                        ₹{project.total_investment_inr.toLocaleString()}
                      </span>
                    </div>

                    <div className='flex justify-between'>
                      <span className='text-slate-500'>Progress:</span>
                      <span className='font-medium'>{project.progress.progress_percent}%</span>
                    </div>

                    <div className='pt-1 border-t border-slate-200 mt-2'>
                      <span className='text-slate-500 text-xs'>📍 {project.location.address}</span>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Map Legend */}
      <div className='p-3 bg-slate-50 border-t'>
        <div className='flex flex-wrap gap-2 text-xs'>
          <div className='flex items-center gap-1'>
            <div className='w-2 h-2 rounded-full bg-emerald-500'></div>
            <span>Operational</span>
          </div>
          <div className='flex items-center gap-1'>
            <div className='w-2 h-2 rounded-full bg-blue-500'></div>
            <span>Installation</span>
          </div>
          <div className='flex items-center gap-1'>
            <div className='w-2 h-2 rounded-full bg-amber-500'></div>
            <span>Construction</span>
          </div>
          <div className='flex items-center gap-1'>
            <div className='w-2 h-2 rounded-full bg-slate-500'></div>
            <span>Planning</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProjectMap;
