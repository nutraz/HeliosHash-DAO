'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Home, Wrench, Zap, HardHat, Package, 
  Truck, CheckCircle, MapPin, Users
} from 'lucide-react'

interface RoleSelectionProps {
  user: any
  onRoleSelected: (roleData: any) => void
}

const userRoles = [
  {
    id: 'landowner',
    label: 'Landowner',
    labelHi: 'भूमि स्वामी',
    description: 'Apply for solar project on your land',
    descriptionHi: 'अपनी जमीन पर सौर परियोजना के लिए आवेदन करें',
    icon: Home,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/30'
  },
  {
    id: 'solar-contractor',
    label: 'Solar Contractor',
    labelHi: 'सौर ठेकेदार',
    description: 'Bid on projects and manage installations',
    descriptionHi: 'परियोजनाओं पर बोली लगाएं और स्थापना प्रबंधित करें',
    icon: Wrench,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/30'
  },
  {
    id: 'engineer',
    label: 'Engineer',
    labelHi: 'इंजीनियर',
    description: 'Certify designs and inspect sites',
    descriptionHi: 'डिजाइन प्रमाणित करें और साइटों का निरीक्षण करें',
    icon: Zap,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30'
  },
  {
    id: 'node-operator',
    label: 'Node Operator',
    labelHi: 'नोड संचालक',
    description: 'Run validator node, earn HHU tokens',
    descriptionHi: 'वैलिडेटर नोड चलाएं, HHU टोकन कमाएं',
    icon: Zap,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30'
  },
  {
    id: 'labour',
    label: 'Manual Labour',
    labelHi: 'श्रमिक',
    description: 'Register for site jobs and earn wages',
    descriptionHi: 'साइट नौकरियों के लिए पंजीकरण करें और मजदूरी कमाएं',
    icon: HardHat,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/30'
  },
  {
    id: 'equipment-provider',
    label: 'Equipment Provider',
    labelHi: 'उपकरण प्रदाता',
    description: 'Supply panels, inverters, batteries',
    descriptionHi: 'पैनल, इन्वर्टर, बैटरी की आपूर्ति करें',
    icon: Package,
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-500/10',
    borderColor: 'border-indigo-500/30'
  },
  {
    id: 'service-provider',
    label: 'Service Provider',
    labelHi: 'सेवा प्रदाता',
    description: 'Transport, catering, training services',
    descriptionHi: 'परिवहन, खानपान, प्रशिक्षण सेवाएं',
    icon: Truck,
    color: 'text-pink-500',
    bgColor: 'bg-pink-500/10',
    borderColor: 'border-pink-500/30'
  },
  {
    id: 'verified-citizen',
    label: 'Verified Citizen',
    labelHi: 'सत्यापित नागरिक',
    description: 'Participate in governance, run light node',
    descriptionHi: 'शासन में भाग लें, लाइट नोड चलाएं',
    icon: CheckCircle,
    color: 'text-teal-500',
    bgColor: 'bg-teal-500/10',
    borderColor: 'border-teal-500/30'
  },
  {
    id: 'investor',
    label: 'Investor',
    labelHi: 'निवेशक',
    description: 'Fund projects and earn returns',
    descriptionHi: 'परियोजनाओं में निवेश करें और रिटर्न कमाएं',
    icon: Users,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30'
  },
  {
    id: 'community-manager',
    label: 'Community Manager',
    labelHi: 'समुदाय प्रबंधक',
    description: 'Manage local project communities',
    descriptionHi: 'स्थानीय परियोजना समुदायों का प्रबंधन करें',
    icon: MapPin,
    color: 'text-rose-500',
    bgColor: 'bg-rose-500/10',
    borderColor: 'border-rose-500/30'
  }
]

export default function RoleSelection({ user, onRoleSelected }: RoleSelectionProps) {
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const language = user.language || 'en'

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId)
  }

  const handleContinue = () => {
    if (selectedRole) {
      const role = userRoles.find(r => r.id === selectedRole)
      onRoleSelected({
        role: selectedRole,
        roleLabel: role?.label,
        roleLabelHi: role?.labelHi,
        kycRequired: ['landowner', 'solar-contractor', 'engineer', 'equipment-provider'].includes(selectedRole)
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {language === 'en' 
              ? 'How do you contribute to UrgamU?' 
              : 'आप उरगमू में कैसे योगदान देते हैं?'}
          </h1>
          <p className="text-gray-400 text-lg">
            {language === 'en' 
              ? 'Select your role to unlock specific dashboards and features' 
              : 'विशिष्ट डैशबोर्ड और सुविधाओं को अनलॉक करने के लिए अपनी भूमिका चुनें'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {userRoles.map((role) => {
            const Icon = role.icon
            const isSelected = selectedRole === role.id
            
            return (
              <button
                key={role.id}
                onClick={() => handleRoleSelect(role.id)}
                className={`text-left transition-all ${
                  isSelected 
                    ? `${role.bgColor} border-2 ${role.borderColor} shadow-2xl scale-105` 
                    : 'bg-gray-800 border-2 border-gray-700 hover:border-gray-600 hover:bg-gray-750'
                } rounded-xl p-6`}
              >
                <div className="flex items-start space-x-4">
                  <div className={`${role.bgColor} p-3 rounded-lg`}>
                    <Icon className={`w-6 h-6 ${role.color}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-1">
                      {language === 'en' ? role.label : role.labelHi}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {language === 'en' ? role.description : role.descriptionHi}
                    </p>
                    {isSelected && (
                      <div className="mt-3 flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-xs text-green-500 font-medium">
                          {language === 'en' ? 'Selected' : 'चयनित'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {selectedRole && (
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">
                {language === 'en' ? 'Next Steps' : 'अगले कदम'}
              </CardTitle>
              <CardDescription className="text-gray-400">
                {['landowner', 'solar-contractor', 'engineer', 'equipment-provider'].includes(selectedRole) 
                  ? (language === 'en' 
                      ? 'KYC verification required for this role' 
                      : 'इस भूमिका के लिए केवाईसी सत्यापन आवश्यक है')
                  : (language === 'en' 
                      ? 'Basic verification will be completed' 
                      : 'बुनियादी सत्यापन पूरा किया जाएगा')
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-6 text-lg"
                onClick={handleContinue}
              >
                {language === 'en' ? 'Continue to Dashboard' : 'डैशबोर्ड पर जारी रखें'} →
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
