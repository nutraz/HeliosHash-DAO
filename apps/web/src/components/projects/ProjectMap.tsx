'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MapPin, Filter, Plus, Users, Zap, TrendingUp } from 'lucide-react'

interface ProjectMapProps {
  user: any
  onNavigate: (view: string, projectId?: string) => void
}

const projectStages = [
  { id: 'all', label: 'All', labelHi: 'सभी', color: 'bg-gray-500', count: 47 },
  { id: 'applied', label: 'Applied', labelHi: 'आवेदन किया', color: 'bg-gray-500', count: 12 },
  { id: 'civil', label: 'Civil Works', labelHi: 'सिविल कार्य', color: 'bg-blue-500', count: 8 },
  { id: 'solar', label: 'Solar Setup', labelHi: 'सौर सेटअप', color: 'bg-orange-500', count: 15 },
  { id: 'tech', label: 'Tech Setup', labelHi: 'तकनीक सेटअप', color: 'bg-yellow-500', count: 7 },
  { id: 'functioning', label: 'Functioning', labelHi: 'कार्यरत', color: 'bg-green-500', count: 5 }
]

const mockProjects = [
  {
    id: '1',
    name: 'Baghpat Village Solar Grid',
    nameHi: 'बागपत गांव सौर ग्रिड',
    stage: 'functioning',
    location: 'Baghpat, UP',
    locationHi: 'बागपत, यूपी',
    capacity: '500 kW',
    members: 45,
    opportunities: 0,
    energyToday: '3.2 MWh',
    lat: 29.0,
    lng: 77.2
  },
  {
    id: '2',
    name: 'Khekada Solar Farm',
    nameHi: 'खेकड़ा सौर फार्म',
    stage: 'tech',
    location: 'Khekada, UP',
    locationHi: 'खेकड़ा, यूपी',
    capacity: '750 kW',
    members: 32,
    opportunities: 3,
    energyToday: null,
    lat: 28.95,
    lng: 77.3
  },
  {
    id: '3',
    name: 'Baraut Community Hub',
    nameHi: 'बड़ौत सामुदायिक केंद्र',
    stage: 'solar',
    location: 'Baraut, UP',
    locationHi: 'बड़ौत, यूपी',
    capacity: '300 kW',
    members: 28,
    opportunities: 7,
    energyToday: null,
    lat: 29.1,
    lng: 77.25
  },
  {
    id: '4',
    name: 'Pilana Solar Grid',
    nameHi: 'पिलाना सौर ग्रिड',
    stage: 'solar',
    location: 'Pilana, UP',
    locationHi: 'पिलाना, यूपी',
    capacity: '600 kW',
    members: 38,
    opportunities: 5,
    energyToday: null,
    lat: 28.9,
    lng: 77.15
  },
  {
    id: '5',
    name: 'Chhaprauli Energy',
    nameHi: 'छपरौली ऊर्जा',
    stage: 'civil',
    location: 'Chhaprauli, UP',
    locationHi: 'छपरौली, यूपी',
    capacity: '450 kW',
    members: 25,
    opportunities: 12,
    energyToday: null,
    lat: 29.2,
    lng: 77.18
  },
  {
    id: '6',
    name: 'Binauli Solar Project',
    nameHi: 'बिनौली सौर परियोजना',
    stage: 'applied',
    location: 'Binauli, UP',
    locationHi: 'बिनौली, यूपी',
    capacity: '350 kW',
    members: 18,
    opportunities: 0,
    energyToday: null,
    lat: 29.05,
    lng: 77.1
  }
]

export default function ProjectMap({ user, onNavigate }: ProjectMapProps) {
  const [selectedStage, setSelectedStage] = useState('all')
  const language = user.language || 'en'

  const filteredProjects = selectedStage === 'all' 
    ? mockProjects 
    : mockProjects.filter(p => p.stage === selectedStage)

  const getStageColor = (stage: string) => {
    const stageObj = projectStages.find(s => s.id === stage)
    return stageObj?.color || 'bg-gray-500'
  }

  const getStageLabel = (stage: string) => {
    const stageObj = projectStages.find(s => s.id === stage)
    return language === 'en' ? stageObj?.label : stageObj?.labelHi
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {language === 'en' ? 'Project Map' : 'परियोजना मानचित्र'}
            </h1>
            <p className="text-gray-400">
              {language === 'en' 
                ? `${filteredProjects.length} projects in Baghpat region` 
                : `बागपत क्षेत्र में ${filteredProjects.length} परियोजनाएं`}
            </p>
          </div>
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            onClick={() => onNavigate('create-project')}
          >
            <Plus className="w-4 h-4 mr-2" />
            {language === 'en' ? 'Create Project' : 'परियोजना बनाएं'}
          </Button>
        </div>

        {/* Stage Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {projectStages.map((stage) => (
            <button
              key={stage.id}
              onClick={() => setSelectedStage(stage.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedStage === stage.id
                  ? `${stage.color} text-white shadow-lg scale-105`
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                <span>{language === 'en' ? stage.label : stage.labelHi}</span>
                <span className="text-xs opacity-75">({stage.count})</span>
              </div>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map View */}
          <div className="lg:col-span-2">
            <Card className="bg-gray-800 border-gray-700 h-[600px]">
              <CardContent className="p-0 h-full relative">
                {/* SVG Map Placeholder */}
                <svg viewBox="0 0 800 600" className="w-full h-full">
                  {/* Background */}
                  <rect width="800" height="600" fill="#1f2937" />
                  
                  {/* Grid lines */}
                  {[...Array(10)].map((_, i) => (
                    <g key={`grid-${i}`}>
                      <line 
                        x1={i * 80} 
                        y1="0" 
                        x2={i * 80} 
                        y2="600" 
                        stroke="#374151" 
                        strokeWidth="0.5" 
                      />
                      <line 
                        x1="0" 
                        y1={i * 60} 
                        x2="800" 
                        y2={i * 60} 
                        stroke="#374151" 
                        strokeWidth="0.5" 
                      />
                    </g>
                  ))}

                  {/* Project Pins */}
                  {filteredProjects.map((project, idx) => {
                    const x = 200 + (project.lng - 77) * 500
                    const y = 300 - (project.lat - 29) * 1200
                    const stageColor = getStageColor(project.stage)
                    const colorMap: any = {
                      'bg-green-500': '#10b981',
                      'bg-yellow-500': '#eab308',
                      'bg-orange-500': '#f97316',
                      'bg-blue-500': '#3b82f6',
                      'bg-gray-500': '#6b7280'
                    }
                    const fillColor = colorMap[stageColor] || '#6b7280'

                    return (
                      <g key={project.id}>
                        {/* Pin shadow */}
                        <ellipse 
                          cx={x} 
                          cy={y + 22} 
                          rx="12" 
                          ry="3" 
                          fill="rgba(0,0,0,0.3)" 
                        />
                        {/* Pin */}
                        <circle 
                          cx={x} 
                          cy={y} 
                          r="10" 
                          fill={fillColor} 
                          stroke="white" 
                          strokeWidth="2"
                          className="cursor-pointer hover:r-12 transition-all"
                          onClick={() => onNavigate('project', project.id)}
                        />
                        <path 
                          d={`M ${x},${y + 10} L ${x},${y + 20}`} 
                          stroke={fillColor} 
                          strokeWidth="2"
                        />
                        {/* Label */}
                        <text 
                          x={x} 
                          y={y + 35} 
                          fill="white" 
                          fontSize="10" 
                          textAnchor="middle"
                          className="pointer-events-none"
                        >
                          {project.name.split(' ')[0]}
                        </text>
                      </g>
                    )
                  })}

                  {/* Legend */}
                  <g transform="translate(650, 20)">
                    <rect width="130" height="120" fill="rgba(31, 41, 55, 0.9)" rx="5" />
                    <text x="10" y="20" fill="white" fontSize="12" fontWeight="bold">
                      {language === 'en' ? 'Status' : 'स्थिति'}
                    </text>
                    {projectStages.filter(s => s.id !== 'all').map((stage, idx) => {
                      const colorMap: any = {
                        'bg-green-500': '#10b981',
                        'bg-yellow-500': '#eab308',
                        'bg-orange-500': '#f97316',
                        'bg-blue-500': '#3b82f6',
                        'bg-gray-500': '#6b7280'
                      }
                      return (
                        <g key={stage.id} transform={`translate(10, ${35 + idx * 18})`}>
                          <circle cx="5" cy="0" r="4" fill={colorMap[stage.color]} />
                          <text x="15" y="4" fill="white" fontSize="10">
                            {language === 'en' ? stage.label : stage.labelHi}
                          </text>
                        </g>
                      )
                    })}
                  </g>
                </svg>
              </CardContent>
            </Card>
          </div>

          {/* Project List */}
          <div className="space-y-4 max-h-[600px] overflow-y-auto">
            {filteredProjects.map((project) => (
              <Card 
                key={project.id} 
                className="bg-gray-800 border-gray-700 hover:border-blue-500 cursor-pointer transition-all"
                onClick={() => onNavigate('project', project.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-white text-lg mb-1">
                        {language === 'en' ? project.name : project.nameHi}
                      </CardTitle>
                      <CardDescription className="text-gray-400 text-sm">
                        {language === 'en' ? project.location : project.locationHi}
                      </CardDescription>
                    </div>
                    <div className={`px-2 py-1 ${getStageColor(project.stage)} text-white text-xs font-bold rounded`}>
                      {getStageLabel(project.stage)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <div className="flex items-center text-gray-400 mb-1">
                        <Zap className="w-3 h-3 mr-1" />
                        <span className="text-xs">
                          {language === 'en' ? 'Capacity' : 'क्षमता'}
                        </span>
                      </div>
                      <div className="text-white font-semibold">{project.capacity}</div>
                    </div>
                    <div>
                      <div className="flex items-center text-gray-400 mb-1">
                        <Users className="w-3 h-3 mr-1" />
                        <span className="text-xs">
                          {language === 'en' ? 'Members' : 'सदस्य'}
                        </span>
                      </div>
                      <div className="text-white font-semibold">{project.members}</div>
                    </div>
                    {project.energyToday && (
                      <div>
                        <div className="flex items-center text-gray-400 mb-1">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          <span className="text-xs">
                            {language === 'en' ? 'Today' : 'आज'}
                          </span>
                        </div>
                        <div className="text-white font-semibold">{project.energyToday}</div>
                      </div>
                    )}
                    {project.opportunities > 0 && (
                      <div>
                        <div className="flex items-center text-orange-400 mb-1">
                          <MapPin className="w-3 h-3 mr-1" />
                          <span className="text-xs">
                            {language === 'en' ? 'Jobs' : 'नौकरियां'}
                          </span>
                        </div>
                        <div className="text-orange-400 font-semibold">{project.opportunities}</div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
