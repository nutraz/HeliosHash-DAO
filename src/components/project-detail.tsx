"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  MapPin, 
  Zap, 
  Building, 
  FileText, 
  Download, 
  Eye, 
  Edit,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface ProjectDetailProps {
  project: any;
  onBack: () => void;
}

export function ProjectDetail({ project, onBack }: ProjectDetailProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const getMilestoneStatus = (milestone: any) => {
    if (milestone.completed) {
      return { color: 'bg-green-600', icon: CheckCircle, text: 'Completed' };
    } else {
      return { color: 'bg-yellow-600', icon: Clock, text: 'Pending' };
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'bg-green-600';
      case 'construction': return 'bg-blue-600';
      case 'permissions': return 'bg-yellow-600';
      case 'assessment': return 'bg-purple-600';
      default: return 'bg-gray-600';
    }
  };

  const getProductionData = () => {
    // Mock production data for the last 7 days
    return [
      { day: 'Mon', production: 2.1 },
      { day: 'Tue', production: 2.3 },
      { day: 'Wed', production: 1.9 },
      { day: 'Thu', production: 2.4 },
      { day: 'Fri', production: 2.2 },
      { day: 'Sat', production: 2.0 },
      { day: 'Sun', production: 2.1 }
    ];
  };

  return (
    <div className="min-h-screen app-container p-4 pb-20">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Button variant="ghost" onClick={onBack} className="text-white">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-white">{project.owner}'s Project</h1>
          <p className="text-sm text-gray-400">{project.location}</p>
        </div>
        <Badge className={`${getStatusColor(project.project.status)} text-white`}>
          {project.project.status}
        </Badge>
      </div>

      {/* Project Summary */}
      <Card className="card-readable mb-4">
        <CardContent className="p-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{project.area}</p>
              <p className="text-xs text-gray-400">Land Area</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{project.project.capacity}</p>
              <p className="text-xs text-gray-400">Capacity</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{project.project.production}</p>
              <p className="text-xs text-gray-400">Daily Production</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">
                {Object.values(project.project.milestones).filter((m: any) => m.completed).length}/4
              </p>
              <p className="text-xs text-gray-400">Milestones</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gray-800">
          <TabsTrigger value="overview" className="data-[state=active]:bg-gray-700 text-white">📊 Overview</TabsTrigger>
          <TabsTrigger value="milestones" className="data-[state=active]:bg-gray-700 text-white">🎯 Milestones</TabsTrigger>
          <TabsTrigger value="production" className="data-[state=active]:bg-gray-700 text-white">⚡ Production</TabsTrigger>
          <TabsTrigger value="documents" className="data-[state=active]:bg-gray-700 text-white">📄 Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-3">
          <Card className="card-readable">
            <CardHeader>
              <CardTitle className="text-sm text-white">Project Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Project Type:</span>
                <span className="text-white">{project.project.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Location:</span>
                <span className="text-white">{project.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Land Owner:</span>
                <span className="text-white">{project.owner}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Submission Date:</span>
                <span className="text-white">{project.submissionDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Verification Status:</span>
                <Badge className={`${getStatusColor(project.status)} text-white`}>
                  {project.status}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="card-readable">
            <CardHeader>
              <CardTitle className="text-sm text-white">Overall Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <Progress 
                value={(Object.values(project.project.milestones).filter((m: any) => m.completed).length / 4) * 100} 
                className="h-3 mb-2" 
              />
              <p className="text-xs text-gray-300">
                {Object.values(project.project.milestones).filter((m: any) => m.completed).length} of 4 milestones completed
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="milestones" className="space-y-3">
          {Object.entries(project.project.milestones).map(([key, milestone]: [string, any]) => {
            const status = getMilestoneStatus(milestone);
            const Icon = status.icon;
            
            return (
              <Card key={key} className="card-readable">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${status.color}`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium text-white capitalize">
                          {key.replace('_', ' ')}
                        </h4>
                        <p className="text-sm text-gray-300">{status.text}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      {milestone.completed ? (
                        <p className="text-xs text-green-400">
                          ✅ {milestone.date}
                        </p>
                      ) : (
                        <p className="text-xs text-yellow-400">
                          📅 {milestone.estimated}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="production" className="space-y-3">
          <Card className="card-readable">
            <CardHeader>
              <CardTitle className="text-sm text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Daily Production (Last 7 Days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {getProductionData().map((data, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">{data.day}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-800 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${(data.production / 3) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-white font-medium">
                        {data.production} MW
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 p-3 bg-green-900/20 border border-green-600 rounded-lg">
                <h4 className="font-medium text-white mb-1">Total This Week</h4>
                <p className="text-lg font-bold text-white">
                  {getProductionData().reduce((sum, data) => sum + data.production, 0).toFixed(1)} MW
                </p>
                <p className="text-xs text-gray-300">Average: {(getProductionData().reduce((sum, data) => sum + data.production, 0) / 7).toFixed(1)} MW/day</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-3">
          <Card className="card-readable">
            <CardHeader>
              <CardTitle className="text-sm text-white flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Project Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {project.documents.map((doc: string, index: number) => (
                  <div key={index} className="flex items-center justify-between bg-gray-800 rounded-lg p-3">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-white">{doc}</p>
                        <p className="text-xs text-gray-400">Verified</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="border-gray-600 text-white">
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline" className="border-gray-600 text-white">
                        <Download className="w-3 h-3 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="card-readable">
            <CardHeader>
              <CardTitle className="text-sm text-white">Government Approvals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white">Land Use Permit</span>
                  <Badge className="bg-green-600 text-white">Approved</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white">Environmental Clearance</span>
                  <Badge className="bg-blue-600 text-white">Under Review</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white">Electrical Connection</span>
                  <Badge className="bg-green-600 text-white">Approved</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white">Building Permit</span>
                  <Badge className="bg-yellow-600 text-white">Pending</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}