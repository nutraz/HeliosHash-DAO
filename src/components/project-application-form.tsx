'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Upload, MapPin, FileText, X, Plus } from 'lucide-react';

interface ProjectApplicationFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export function ProjectApplicationForm({ onSubmit, onCancel }: ProjectApplicationFormProps) {
  const [formData, setFormData] = useState({
    ownerName: '',
    location: '',
    area: '',
    projectType: '',
    capacity: '',
    description: '',
    documents: [] as File[],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const projectTypes = [
    { value: 'solar', label: 'Solar Farm', icon: '☀️' },
    { value: 'mining', label: 'Bitcoin Mining', icon: '⛏️' },
    { value: 'datacenter', label: 'Data Center', icon: '💾' },
    { value: 'hybrid', label: 'Hybrid (Solar + Mining)', icon: '🔄' },
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setFormData((prev) => ({
      ...prev,
      documents: [...prev.documents, ...files],
    }));
  };

  const removeDocument = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const applicationData = {
      ...formData,
      id: Date.now(),
      submittedDate: new Date().toISOString().split('T')[0],
      status: 'pending',
    };

    onSubmit(applicationData);
    setIsSubmitting(false);
  };

  return (
    <div className='min-h-screen app-container p-4 pb-20'>
      <Card className='card-readable'>
        <CardHeader>
          <CardTitle className='text-white flex items-center gap-2'>
            <Plus className='w-5 h-5' />
            New Project Application
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-4'>
            {/* Land Owner Information */}
            <div className='space-y-2'>
              <Label className='text-white'>Land Owner Name</Label>
              <Input
                value={formData.ownerName}
                onChange={(e) => setFormData((prev) => ({ ...prev, ownerName: e.target.value }))}
                placeholder='Enter land owner name'
                className='bg-gray-800 border-gray-600 text-white'
                required
              />
            </div>

            {/* Location Details */}
            <div className='space-y-2'>
              <Label className='text-white'>Location</Label>
              <div className='flex gap-2'>
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                  placeholder='Village name, Plot number'
                  className='bg-gray-800 border-gray-600 text-white flex-1'
                  required
                />
                <Button type='button' variant='outline' className='border-gray-600 text-white'>
                  <MapPin className='w-4 h-4' />
                </Button>
              </div>
            </div>

            {/* Land Area */}
            <div className='space-y-2'>
              <Label className='text-white'>Land Area</Label>
              <Input
                value={formData.area}
                onChange={(e) => setFormData((prev) => ({ ...prev, area: e.target.value }))}
                placeholder='e.g., 2.5 acres'
                className='bg-gray-800 border-gray-600 text-white'
                required
              />
            </div>

            {/* Project Type */}
            <div className='space-y-2'>
              <Label className='text-white'>Project Type</Label>
              <Select
                onValueChange={(value) => setFormData((prev) => ({ ...prev, projectType: value }))}
              >
                <SelectTrigger className='bg-gray-800 border-gray-600 text-white'>
                  <SelectValue placeholder='Select project type' />
                </SelectTrigger>
                <SelectContent className='bg-gray-800 border-gray-600'>
                  {projectTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value} className='text-white'>
                      <div className='flex items-center gap-2'>
                        <span>{type.icon}</span>
                        <span>{type.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Capacity */}
            <div className='space-y-2'>
              <Label className='text-white'>Planned Capacity</Label>
              <Input
                value={formData.capacity}
                onChange={(e) => setFormData((prev) => ({ ...prev, capacity: e.target.value }))}
                placeholder='e.g., 500kW'
                className='bg-gray-800 border-gray-600 text-white'
                required
              />
            </div>

            {/* Project Description */}
            <div className='space-y-2'>
              <Label className='text-white'>Project Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder='Describe your project goals and vision...'
                className='bg-gray-800 border-gray-600 text-white min-h-[100px]'
                required
              />
            </div>

            {/* Document Upload */}
            <div className='space-y-2'>
              <Label className='text-white'>Required Documents</Label>
              <div className='space-y-2'>
                <div className='text-xs text-gray-400 space-y-1'>
                  <p>• Khasra (Land Record)</p>
                  <p>• Ownership Deed</p>
                  <p>• Land Map/Survey</p>
                  <p>• ID Proof</p>
                  <p>• NOC (if applicable)</p>
                </div>

                <div className='border-2 border-dashed border-gray-600 rounded-lg p-4 text-center'>
                  <Upload className='w-8 h-8 text-gray-400 mx-auto mb-2' />
                  <p className='text-sm text-gray-300'>Upload documents</p>
                  <Input
                    type='file'
                    multiple
                    onChange={handleFileUpload}
                    className='hidden'
                    id='document-upload'
                  />
                  <Button
                    type='button'
                    onClick={() => document.getElementById('document-upload')?.click()}
                    variant='outline'
                    className='mt-2 border-gray-600 text-white'
                  >
                    Choose Files
                  </Button>
                </div>

                {/* Uploaded Documents List */}
                {formData.documents.length > 0 && (
                  <div className='space-y-2'>
                    <Label className='text-white'>Uploaded Documents</Label>
                    {formData.documents.map((doc, index) => (
                      <div
                        key={index}
                        className='flex items-center justify-between bg-gray-800 rounded-lg p-2'
                      >
                        <div className='flex items-center gap-2'>
                          <FileText className='w-4 h-4 text-gray-400' />
                          <span className='text-sm text-white'>{doc.name}</span>
                          <Badge variant='outline' className='border-gray-600 text-white text-xs'>
                            {(doc.size / 1024).toFixed(1)} KB
                          </Badge>
                        </div>
                        <Button
                          type='button'
                          onClick={() => removeDocument(index)}
                          variant='ghost'
                          size='sm'
                          className='text-red-400 hover:text-red-300'
                        >
                          <X className='w-4 h-4' />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Expected Timeline */}
            <div className='space-y-2'>
              <Label className='text-white'>Expected Timeline</Label>
              <div className='grid grid-cols-2 gap-2 text-xs'>
                <div className='bg-gray-800 rounded-lg p-2'>
                  <p className='text-gray-400'>Land Preparation</p>
                  <p className='text-white'>2-4 weeks</p>
                </div>
                <div className='bg-gray-800 rounded-lg p-2'>
                  <p className='text-gray-400'>Permissions</p>
                  <p className='text-white'>4-8 weeks</p>
                </div>
                <div className='bg-gray-800 rounded-lg p-2'>
                  <p className='text-gray-400'>Construction</p>
                  <p className='text-white'>8-12 weeks</p>
                </div>
                <div className='bg-gray-800 rounded-lg p-2'>
                  <p className='text-gray-400'>Operational</p>
                  <p className='text-white'>2-4 weeks</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className='flex gap-2 pt-4'>
              <Button
                type='button'
                onClick={onCancel}
                variant='outline'
                className='border-gray-600 text-white flex-1'
              >
                Cancel
              </Button>
              <Button
                type='submit'
                disabled={isSubmitting}
                className='bg-blue-600 hover:bg-blue-700 text-white flex-1'
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
