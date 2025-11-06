'use client'

import React, { useState } from 'react'
import { ChevronRight, Upload, Video, FileText, CheckCircle, AlertCircle } from 'lucide-react'

interface ProjectCreationProps {
  onProjectCreated?: (projectData: any) => void
}

const HHDAOProjectCreation: React.FC<ProjectCreationProps> = ({ onProjectCreated }) => {
  const [step, setStep] = useState<number>(1)
  const [formData, setFormData] = useState<any>({
    projectType: '',
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
  })

  const applicantTypes = [
    { id: 'landowner', label: 'Land Owner', desc: 'Own land for development' },
    { id: 'solar-contractor', label: 'Solar Contractor', desc: 'Solar energy projects' },
    { id: 'bitcoin-mining', label: 'Bitcoin Mining Setup', desc: 'Crypto mining operations' },
    { id: 'civil-contractor', label: 'Civil Contractor', desc: 'Construction projects' },
    { id: 'supplier', label: 'Supplier', desc: 'Material/service supply' },
    { id: 'entrepreneur', label: 'Entrepreneur', desc: 'New project idea' }
  ]

  const handleApplicantTypeSelect = (type: string) => {
    setFormData({ ...formData, applicantType: type })
    setStep(2)
  }

  const handleInputChange = (section: string, field: string, value: any) => {
    setFormData({
      ...formData,
      [section]: {
        ...formData[section],
        [field]: value
      }
    })
  }

  const handleFileUpload = (docType: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0]
    setFormData({
      ...formData,
      documents: {
        ...formData.documents,
        [docType]: file
      }
    })
  }

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8 space-x-2">
      {[1, 2, 3, 4].map((s) => (
        <div key={s} className="flex items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
            step >= s ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
          }`}>
            {s}
          </div>
          {s < 4 && (
            <div className={`w-12 h-1 ${step > s ? 'bg-blue-600' : 'bg-gray-200'}`} />
          )}
        </div>
      ))}
    </div>
  )

  const renderStep1 = () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Select Applicant Type</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {applicantTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => handleApplicantTypeSelect(type.id)}
            className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left group"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-blue-600">
              {type.label}
            </h3>
            <p className="text-gray-600 text-sm">{type.desc}</p>
            <ChevronRight className="mt-3 text-gray-400 group-hover:text-blue-600" />
          </button>
        ))}
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Project Details</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Project Name *</label>
          <input
            type="text"
            value={formData.projectDetails.name}
            onChange={(e) => handleInputChange('projectDetails', 'name', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter project name"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Project Description *</label>
          <textarea
            value={formData.projectDetails.description}
            onChange={(e) => handleInputChange('projectDetails', 'description', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32"
            placeholder="Describe your project in detail"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
            <input
              type="text"
              value={formData.projectDetails.location}
              onChange={(e) => handleInputChange('projectDetails', 'location', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Project location"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Cost (₹) *</label>
            <input
              type="number"
              value={formData.projectDetails.estimatedCost}
              onChange={(e) => handleInputChange('projectDetails', 'estimatedCost', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Project Timeline *</label>
          <input
            type="text"
            value={formData.projectDetails.timeline}
            onChange={(e) => handleInputChange('projectDetails', 'timeline', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
    </div>
  )

  const DocumentUpload: React.FC<{ label: string; docType: string; required?: boolean; uploaded?: any }> = ({ label, docType, required = true, uploaded }) => (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-500 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-gray-700">{label} {required && <span className="text-red-500">*</span>}</label>
        {uploaded && <CheckCircle className="text-green-500" size={20} />}
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
        className="flex items-center justify-center space-x-2 bg-gray-50 hover:bg-gray-100 py-2 px-4 rounded cursor-pointer transition-colors"
      >
        <Upload size={18} className="text-gray-600" />
        <span className="text-sm text-gray-600">{uploaded ? 'Change File' : 'Upload Document'}</span>
      </label>
      {uploaded && (<p className="text-xs text-green-600 mt-2">{uploaded.name}</p>)}
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Document Upload</h2>
      
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <div className="flex items-start space-x-3">
          <AlertCircle className="text-yellow-600 mt-0.5" size={20} />
          <div>
            <h4 className="font-semibold text-yellow-800 mb-1">Required Documents</h4>
            <p className="text-sm text-yellow-700">All marked documents must be uploaded for KYC verification</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {formData.applicantType === 'landowner' && (
          <DocumentUpload label="Land Ownership Documents" docType="landDocuments" uploaded={formData.documents.landDocuments} />
        )}
        
        <DocumentUpload label="KYC Documents (Aadhaar/PAN/Passport)" docType="kycDocuments" uploaded={formData.documents.kycDocuments} />
        
        <DocumentUpload label="Police Clearance Certificate" docType="policeClearance" uploaded={formData.documents.policeClearance} />
        
        <DocumentUpload label="CIBIL Credit Report" docType="cibilReport" uploaded={formData.documents.cibilReport} />
        
        <DocumentUpload label="Criminal Background Verification" docType="criminalBackground" uploaded={formData.documents.criminalBackground} />
        
        {['entrepreneur', 'bitcoin-mining'].includes(formData.applicantType) && (
          <DocumentUpload label="Business Plan / Project Proposal" docType="businessPlan" uploaded={formData.documents.businessPlan} />
        )}
      </div>

      <button
        onClick={() => setStep(4)}
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
      >
        Continue to Testimonial
      </button>
    </div>
  )

  const renderStep4 = () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Video Testimonial</h2>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start space-x-3">
          <Video className="text-blue-600 mt-0.5" size={20} />
          <div>
            <h4 className="font-semibold text-blue-800 mb-1">Record Your Testimonial</h4>
            <p className="text-sm text-blue-700 mb-2">Please introduce yourself and explain your project in a 2-3 minute video</p>
            <ul className="text-xs text-blue-600 space-y-1 ml-4 list-disc">
              <li>State your name and applicant type</li>
              <li>Describe your project goals</li>
              <li>Explain why you're the right person for this project</li>
              <li>Share your commitment to the HHDAO community</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        {!formData.testimonial.videoFile ? (
          <div>
            <Video className="mx-auto mb-4 text-gray-400" size={48} />
            <input
              type="file"
              accept="video/*"
              onChange={(e) => {
                const file = e.target.files && e.target.files[0]
                setFormData({
                  ...formData,
                  testimonial: {
                    videoRecorded: true,
                    videoFile: file
                  }
                })
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
            <p className="text-sm text-gray-500 mt-3">Max file size: 100MB | Formats: MP4, MOV, AVI</p>
          </div>
        ) : (
          <div className="space-y-4">
            <CheckCircle className="mx-auto text-green-500" size={48} />
            <p className="font-semibold text-gray-800">Video Uploaded Successfully</p>
            <p className="text-sm text-gray-600">{formData.testimonial.videoFile.name}</p>
            <label
              htmlFor="video-upload"
              className="inline-block bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 cursor-pointer transition-colors"
            >
              Replace Video
            </label>
          </div>
        )}
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-semibold text-gray-800 mb-3">Application Summary</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Applicant Type:</span>
            <span className="font-medium text-gray-800 capitalize">{(formData.applicantType || '').replace('-', ' ')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Project Name:</span>
            <span className="font-medium text-gray-800">{formData.projectDetails.name || 'Not provided'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Documents Uploaded:</span>
            <span className="font-medium text-gray-800">{Object.values(formData.documents).filter(Boolean).length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Video Testimonial:</span>
            <span className={`font-medium ${formData.testimonial.videoFile ? 'text-green-600' : 'text-red-600'}`}>{formData.testimonial.videoFile ? 'Uploaded' : 'Required'}</span>
          </div>
        </div>
      </div>

      <button
        onClick={() => {
          if (onProjectCreated) {
            onProjectCreated(formData)
          } else {
            alert('Project submitted successfully! You will receive a confirmation email.')
          }
        }}
        className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
        disabled={!formData.testimonial.videoFile}
      >
        Submit Project Application
      </button>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">HHDAO</h1>
            <p className="text-gray-600">Project Creation & Application</p>
          </div>

          {renderStepIndicator()}

          <div className="mt-8">
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
            {step === 4 && renderStep4()}
          </div>

          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="mt-6 text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Back
            </button>
          )}
        </div>

        <div className="text-center mt-6 text-sm text-gray-600">
          <p>Need help? Contact support@hhdao.com</p>
        </div>
      </div>
    </div>
  )
}

export default HHDAOProjectCreation
