"use client";

import { useState } from 'react';
import { ChevronRight, Upload, Video, CheckCircle, AlertCircle } from 'lucide-react';
import { applicantTypes } from '@/lib/data';

export default function ProjectCreation() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    applicantType: '',
    projectDetails: {
      name: '',
      description: '',
      location: '',
      estimatedCost: '',
      timeline: ''
    },
    documents: {
      landDocuments: null,
      kycDocuments: null,
      policeClearance: null,
      cibilReport: null,
      criminalBackground: null,
      businessPlan: null
    },
    testimonial: {
      videoRecorded: false,
      videoFile: null
    }
  });

  const handleApplicantTypeSelect = (type: string) => {
    setFormData({ ...formData, applicantType: type });
    setStep(2);
  };

  const handleInputChange = (section: string, field: string, value: string) => {
    setFormData({
      ...formData,
      [section]: {
        ...(formData[section as keyof typeof formData] as any),
        [field]: value
      }
    });
  };

  const handleFileUpload = (docType: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setFormData({
      ...formData,
      documents: {
        ...formData.documents,
        [docType]: file
      }
    });
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8 space-x-2">
      {[1, 2, 3, 4].map((s) => (
        <div key={s} className="flex items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
            step >= s ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400'
          }`}>
            {s}
          </div>
          {s < 4 && (
            <div className={`w-12 h-1 ${step > s ? 'bg-blue-600' : 'bg-gray-700'}`} />
          )}
        </div>
      ))}
    </div>
  );

  const DocumentUpload = ({ label, docType, required = true, uploaded }: any) => (
    <div className="border-2 border-dashed border-gray-700 rounded-lg p-4 hover:border-blue-500 transition-colors bg-gray-900 bg-opacity-30">
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-gray-300">
          {label} {required && <span className="text-red-400">*</span>}
        </label>
        {uploaded && <CheckCircle className="text-green-400" size={20} />}
      </div>
      <input
        type="file"
        onChange={(e) => handleFileUpload(docType, e)}
        className="hidden"
        id={docType}
        accept=".pdf,.jpg,.jpeg,.png"
      />
      <label
        htmlFor={docType}
        className="flex items-center justify-center space-x-2 bg-gray-700 hover:bg-gray-600 py-2 px-4 rounded cursor-pointer transition-colors"
      >
        <Upload size={18} className="text-gray-300" />
        <span className="text-sm text-gray-300">
          {uploaded ? 'Change File' : 'Upload Document'}
        </span>
      </label>
      {uploaded && (
        <p className="text-xs text-green-400 mt-2">{uploaded.name}</p>
      )}
    </div>
  );

  if (step === 1) {
    return (
      <div className="space-y-6">
        {renderStepIndicator()}
        <h2 className="text-3xl font-bold text-white mb-6">Select Applicant Type</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {applicantTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => handleApplicantTypeSelect(type.id)}
              className="p-6 border-2 border-gray-700 rounded-lg hover:border-blue-500 hover:bg-gray-700 transition-all text-left group"
            >
              <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-400">
                {type.label}
              </h3>
              <p className="text-gray-400 text-sm">{type.desc}</p>
              <ChevronRight className="mt-3 text-gray-600 group-hover:text-blue-400" />
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="space-y-6">
        {renderStepIndicator()}
        <h2 className="text-3xl font-bold text-white mb-6">Project Details</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Project Name *
            </label>
            <input
              type="text"
              value={formData.projectDetails.name}
              onChange={(e) => handleInputChange('projectDetails', 'name', e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter project name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Project Description *
            </label>
            <textarea
              value={formData.projectDetails.description}
              onChange={(e) => handleInputChange('projectDetails', 'description', e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32"
              placeholder="Describe your project in detail"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Location *
              </label>
              <input
                type="text"
                value={formData.projectDetails.location}
                onChange={(e) => handleInputChange('projectDetails', 'location', e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Project location"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Estimated Cost (₹) *
              </label>
              <input
                type="number"
                value={formData.projectDetails.estimatedCost}
                onChange={(e) => handleInputChange('projectDetails', 'estimatedCost', e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Project Timeline *
            </label>
            <input
              type="text"
              value={formData.projectDetails.timeline}
              onChange={(e) => handleInputChange('projectDetails', 'timeline', e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 6 months, 1 year"
            />
          </div>
        </div>

        <button
          onClick={() => setStep(3)}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
        >
          Continue to Documents
        </button>
        <button
          onClick={() => setStep(1)}
          className="mt-2 text-blue-400 hover:text-blue-300 font-medium"
        >
          ← Back
        </button>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="space-y-6">
        {renderStepIndicator()}
        <h2 className="text-3xl font-bold text-white mb-6">Document Upload</h2>
        
        <div className="bg-yellow-900 bg-opacity-30 border border-yellow-700 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="text-yellow-400 mt-0.5" size={20} />
            <div>
              <h4 className="font-semibold text-yellow-400 mb-1">Required Documents</h4>
              <p className="text-sm text-yellow-300">
                All marked documents must be uploaded for KYC verification
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {formData.applicantType === 'landowner' && (
            <DocumentUpload 
              label="Land Ownership Documents" 
              docType="landDocuments"
              uploaded={formData.documents.landDocuments}
            />
          )}
          
          <DocumentUpload 
            label="KYC Documents (Aadhaar/PAN/Passport)" 
            docType="kycDocuments"
            uploaded={formData.documents.kycDocuments}
          />
          
          <DocumentUpload 
            label="Police Clearance Certificate" 
            docType="policeClearance"
            uploaded={formData.documents.policeClearance}
          />
          
          <DocumentUpload 
            label="CIBIL Credit Report" 
            docType="cibilReport"
            uploaded={formData.documents.cibilReport}
          />
          
          <DocumentUpload 
            label="Criminal Background Verification" 
            docType="criminalBackground"
            uploaded={formData.documents.criminalBackground}
          />
          
          {['entrepreneur', 'bitcoin-mining'].includes(formData.applicantType) && (
            <DocumentUpload 
              label="Business Plan / Project Proposal" 
              docType="businessPlan"
              uploaded={formData.documents.businessPlan}
            />
          )}
        </div>

        <button
          onClick={() => setStep(4)}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
        >
          Continue to Testimonial
        </button>
        <button
          onClick={() => setStep(2)}
          className="mt-2 text-blue-400 hover:text-blue-300 font-medium"
        >
          ← Back
        </button>
      </div>
    );
  }

  // Step 4
  return (
    <div className="space-y-6">
      {renderStepIndicator()}
      <h2 className="text-3xl font-bold text-white mb-6">Video Testimonial</h2>
      
      <div className="bg-blue-900 bg-opacity-30 border border-blue-700 rounded-lg p-4 mb-6">
        <div className="flex items-start space-x-3">
          <Video className="text-blue-400 mt-0.5" size={20} />
          <div>
            <h4 className="font-semibold text-blue-400 mb-1">Record Your Testimonial</h4>
            <p className="text-sm text-blue-300 mb-2">
              Please introduce yourself and explain your project in a 2-3 minute video
            </p>
            <ul className="text-xs text-blue-300 space-y-1 ml-4 list-disc">
              <li>State your name and applicant type</li>
              <li>Describe your project goals</li>
              <li>Explain why you are the right person for this project</li>
              <li>Share your commitment to the HHDAO community</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center bg-gray-900 bg-opacity-30">
        {!formData.testimonial.videoFile ? (
          <div>
            <Video className="mx-auto mb-4 text-gray-600" size={48} />
            <input
              type="file"
              accept="video/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setFormData({
                    ...formData,
                    testimonial: {
                      videoRecorded: true,
                      videoFile: file as any
                    }
                  });
                }
              }}
              className="hidden"
              id="video-upload"
            />
            <label
              htmlFor="video-upload"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 cursor-pointer transition-colors font-semibold"
            >
              Upload Video Testimonial
            </label>
            <p className="text-sm text-gray-400 mt-3">
              Max file size: 100MB | Formats: MP4, MOV, AVI
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <CheckCircle className="mx-auto text-green-400" size={48} />
            <p className="font-semibold text-white">Video Uploaded Successfully</p>
            <p className="text-sm text-gray-400">{(formData.testimonial.videoFile as any)?.name}</p>
            <label
              htmlFor="video-upload"
              className="inline-block bg-gray-700 text-gray-300 px-6 py-2 rounded-lg hover:bg-gray-600 cursor-pointer transition-colors"
            >
              Replace Video
            </label>
          </div>
        )}
      </div>

      <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
        <h4 className="font-semibold text-white mb-3">Application Summary</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Applicant Type:</span>
            <span className="font-medium text-white capitalize">
              {formData.applicantType.replace('-', ' ')}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Project Name:</span>
            <span className="font-medium text-white">
              {formData.projectDetails.name || 'Not provided'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Documents Uploaded:</span>
            <span className="font-medium text-white">
              {Object.values(formData.documents).filter(Boolean).length}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Video Testimonial:</span>
            <span className={`font-medium ${formData.testimonial.videoFile ? 'text-green-400' : 'text-red-400'}`}>
              {formData.testimonial.videoFile ? 'Uploaded' : 'Required'}
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={() => {
          import('@/lib/notify').then(({ notify }) => notify.success('Project submitted successfully! You will receive a confirmation email.'))
          window.location.href = '/dashboard';
        }}
        className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
        disabled={!formData.testimonial.videoFile}
      >
        Submit Project Application
      </button>
      <button
        onClick={() => setStep(3)}
        className="mt-2 text-blue-400 hover:text-blue-300 font-medium"
      >
        ← Back
      </button>
    </div>
  );
}

