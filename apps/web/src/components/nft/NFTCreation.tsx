'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Plus, Zap, Award, FileText,
  Upload, CheckCircle, Clock
} from 'lucide-react'

interface NFTCreationProps {
  user?: { name?: string }
  language?: string
  onBack?: () => void
}

const nftTemplates = [
  {
    id: 'project',
    name: 'Project NFT',
    nameHi: 'परियोजना NFT',
    description: 'Solar installation proof of ownership',
    descriptionHi: 'सौर स्थापना स्वामित्व का प्रमाण',
    icon: Zap,
    color: 'blue',
    fields: ['Project Name', 'Location', 'Capacity (kW)', 'Installation Date']
  },
  {
    id: 'badge',
    name: 'Achievement Badge',
    nameHi: 'उपलब्धि बैज',
    description: 'Milestone or certification badge',
    descriptionHi: 'मील का पत्थर या प्रमाणीकरण बैज',
    icon: Award,
    color: 'purple',
    fields: ['Achievement Name', 'Date Earned', 'Issuer']
  },
  {
    id: 'deed',
    name: 'Land Deed',
    nameHi: 'भूमि विलेख',
    description: 'Digital land ownership record',
    descriptionHi: 'डिजिटल भूमि स्वामित्व रिकॉर्ड',
    icon: FileText,
    color: 'green',
    fields: ['Land Location', 'Area (acres)', 'Registry Number']
  },
  {
    id: 'access',
    name: 'Access Pass',
    nameHi: 'एक्सेस पास',
    description: 'Special feature or area access',
    descriptionHi: 'विशेष सुविधा या क्षेत्र पहुंच',
    icon: CheckCircle,
    color: 'orange',
    fields: ['Pass Type', 'Valid Until', 'Access Level']
  }
]

export default function NFTCreation({ user, language = 'en', onBack }: NFTCreationProps) {
  // currently `user` is provided for future features; reference to avoid unused-var lint
  void user
  const [step, setStep] = useState<'select' | 'create' | 'preview'>('select')
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [nftData, setNftData] = useState<Record<string, unknown>>({})
  const [uploading, setUploading] = useState(false)

  const template = nftTemplates.find(t => t.id === selectedTemplate)

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplate(templateId)
    setStep('create')
  }

  const handleCreateNFT = () => {
    setUploading(true)
    // Simulate minting process
    setTimeout(() => {
      setUploading(false)
      setStep('preview')
    }, 2000)
  }

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-500/10 border-blue-500/30 hover:border-blue-500',
      purple: 'bg-purple-500/10 border-purple-500/30 hover:border-purple-500',
      green: 'bg-green-500/10 border-green-500/30 hover:border-green-500',
      orange: 'bg-orange-500/10 border-orange-500/30 hover:border-orange-500'
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  if (step === 'select') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              {language === 'en' ? 'Create NFT' : 'NFT बनाएं'}
            </h1>
            <p className="text-gray-400">
              {language === 'en'
                ? 'Choose a template to mint your digital asset'
                : 'अपनी डिजिटल संपत्ति बनाने के लिए एक टेम्पलेट चुनें'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {nftTemplates.map(tmpl => {
              const Icon = tmpl.icon
              return (
                <Card
                  key={tmpl.id}
                  className={`bg-gray-800/50 border-2 cursor-pointer transition-all ${getColorClasses(tmpl.color)}`}
                  onClick={() => handleSelectTemplate(tmpl.id)}
                >
                  <CardHeader>
                    <div className={`p-4 rounded-xl bg-${tmpl.color}-500/20 w-fit mb-3`}>
                      <Icon className={`w-8 h-8 text-${tmpl.color}-400`} />
                    </div>
                    <CardTitle className="text-white">
                      {language === 'en' ? tmpl.name : tmpl.nameHi}
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      {language === 'en' ? tmpl.description : tmpl.descriptionHi}
                    </CardDescription>
                  </CardHeader>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  if (step === 'create' && template) {
    const Icon = template.icon
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900 p-4 md:p-8">
        <div className="max-w-3xl mx-auto">
          <Button
            variant="outline"
            className="mb-6 border-gray-600 text-gray-300"
            onClick={() => setStep('select')}
          >
            ← {language === 'en' ? 'Back' : 'वापस'}
          </Button>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <div className={`p-4 rounded-xl bg-${template.color}-500/20`}>
                  <Icon className={`w-8 h-8 text-${template.color}-400`} />
                </div>
                <div>
                  <CardTitle className="text-white text-2xl">
                    {language === 'en' ? template.name : template.nameHi}
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    {language === 'en' ? template.description : template.descriptionHi}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Image Upload */}
              <div>
                <Label className="text-white mb-2">
                  {language === 'en' ? 'NFT Image/Icon' : 'NFT छवि/आइकन'}
                </Label>
                <div className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center hover:border-blue-500 transition-colors cursor-pointer">
                  <Upload className="w-12 h-12 text-gray-500 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm">
                    {language === 'en'
                      ? 'Click to upload or drag and drop'
                      : 'अपलोड करने के लिए क्लिक करें या ड्रैग एंड ड्रॉप करें'}
                  </p>
                  <p className="text-gray-600 text-xs mt-1">PNG, JPG up to 10MB</p>
                </div>
              </div>

              {/* Dynamic Fields */}
              {template.fields.map((field, idx) => (
                <div key={idx}>
                  <Label className="text-white mb-2">{field}</Label>
                  <Input
                    className="bg-gray-900 border-gray-600 text-white"
                    placeholder={`Enter ${field.toLowerCase()}`}
                    onChange={(e) => setNftData({ ...nftData, [field]: e.target.value })}
                  />
                </div>
              ))}

              {/* Metadata */}
              <div>
                <Label className="text-white mb-2">
                  {language === 'en' ? 'Description (Optional)' : 'विवरण (वैकल्पिक)'}
                </Label>
                <textarea
                  className="w-full bg-gray-900 border-2 border-gray-600 rounded-lg p-3 text-white min-h-[100px]"
                  placeholder={language === 'en' ? 'Add a description...' : 'विवरण जोड़ें...'}
                  onChange={(e) => setNftData({ ...nftData, description: e.target.value })}
                />
              </div>

              {/* Mint Button */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-700">
                <div className="text-sm text-gray-400">
                  <p>{language === 'en' ? 'Minting cost:' : 'मिंटिंग लागत:'} <span className="text-white font-bold">50 HHU</span></p>
                </div>
                <Button
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={handleCreateNFT}
                  disabled={uploading}
                >
                  {uploading ? (
                    <>
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      {language === 'en' ? 'Minting...' : 'मिंटिंग...'}
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      {language === 'en' ? 'Mint NFT' : 'NFT मिंट करें'}
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Preview/Success step
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <Card className="bg-gradient-to-r from-green-900 to-blue-900 border-green-700">
          <CardContent className="pt-8 text-center">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              {language === 'en' ? 'NFT Minted Successfully!' : 'NFT सफलतापूर्वक मिंट किया गया!'}
            </h2>
            <p className="text-gray-300 mb-6">
              {language === 'en'
                ? 'Your digital asset has been created on the Internet Computer'
                : 'आपकी डिजिटल संपत्ति इंटरनेट कंप्यूटर पर बनाई गई है'}
            </p>

            <div className="bg-gray-900/50 rounded-xl p-6 mb-6">
              <div className="grid grid-cols-2 gap-4 text-left">
                <div>
                  <p className="text-gray-500 text-sm mb-1">
                    {language === 'en' ? 'Token ID' : 'टोकन ID'}
                  </p>
                  <p className="text-white font-mono text-sm">#BH-{Math.floor(Math.random() * 10000)}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-1">
                    {language === 'en' ? 'Blockchain' : 'ब्लॉकचेन'}
                  </p>
                  <p className="text-white font-bold">Internet Computer</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-1">
                    {language === 'en' ? 'Type' : 'प्रकार'}
                  </p>
                  <p className="text-white">{language === 'en' ? template?.name : template?.nameHi}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-1">
                    {language === 'en' ? 'Minted' : 'मिंट किया'}
                  </p>
                  <p className="text-white">Just now</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <Button
                variant="outline"
                className="border-gray-600 text-gray-300"
                onClick={() => {
                  setStep('select')
                  setSelectedTemplate(null)
                  setNftData({})
                }}
              >
                {language === 'en' ? 'Create Another' : 'दूसरा बनाएं'}
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                onClick={onBack}
              >
                {language === 'en' ? 'View Collection' : 'संग्रह देखें'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
