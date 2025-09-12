import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Users, Clock, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FamilyEmergencyPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-white hover:text-indigo-300 transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/90 rounded-lg shadow-lg p-8 mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-indigo-900 mb-4 flex items-center gap-3">
            <AlertTriangle className="w-10 h-10 text-red-500" />
            Family Emergency Meeting Point
          </h1>
          <p className="text-lg text-gray-700">
            Essential information about designated safe meeting locations for your family during emergencies.
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Primary Meeting Point */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/90 rounded-lg shadow-lg p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="w-6 h-6 text-green-600" />
              <h2 className="text-xl font-bold text-indigo-900">Primary Meeting Point</h2>
            </div>
            <div className="space-y-3">
              <p className="text-gray-700">
                <strong>Location:</strong> Central Park, near the main fountain
              </p>
              <p className="text-gray-700">
                <strong>Address:</strong> 123 Main Street, City Center
              </p>
              <p className="text-gray-700">
                <strong>Landmarks:</strong> Next to the large oak tree and playground
              </p>
              <p className="text-gray-700">
                <strong>Coordinates:</strong> 40.7829° N, 73.9654° W
              </p>
            </div>
          </motion.div>

          {/* Secondary Meeting Point */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/90 rounded-lg shadow-lg p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-indigo-900">Secondary Meeting Point</h2>
            </div>
            <div className="space-y-3">
              <p className="text-gray-700">
                <strong>Location:</strong> City Library, main entrance
              </p>
              <p className="text-gray-700">
                <strong>Address:</strong> 456 Library Avenue, Downtown
              </p>
              <p className="text-gray-700">
                <strong>Landmarks:</strong> Across from the shopping mall
              </p>
              <p className="text-gray-700">
                <strong>Coordinates:</strong> 40.7505° N, 73.9934° W
              </p>
            </div>
          </motion.div>

          {/* Emergency Procedures */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/90 rounded-lg shadow-lg p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-6 h-6 text-orange-600" />
              <h2 className="text-xl font-bold text-indigo-900">Emergency Procedures</h2>
            </div>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                If separated, proceed to the primary meeting point immediately
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                Wait for 30 minutes; if no one arrives, go to secondary point
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                Contact emergency services if needed
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                Have identification and emergency contact numbers ready
              </li>
            </ul>
          </motion.div>

          {/* Family Contacts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/90 rounded-lg shadow-lg p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-6 h-6 text-purple-600" />
              <h2 className="text-xl font-bold text-indigo-900">Family Emergency Contacts</h2>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="font-medium text-gray-800">John Doe (Father)</span>
                <span className="text-indigo-600">+1 (555) 123-4567</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="font-medium text-gray-800">Jane Doe (Mother)</span>
                <span className="text-indigo-600">+1 (555) 234-5678</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="font-medium text-gray-800">Emergency Services</span>
                <span className="text-red-600">911</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Important Notes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-8"
        >
          <h3 className="text-lg font-bold text-yellow-800 mb-3">Important Safety Notes</h3>
          <ul className="space-y-2 text-yellow-700">
            <li>• Keep this information updated and share with all family members</li>
            <li>• Practice emergency drills regularly to ensure everyone knows the meeting points</li>
            <li>• Have a backup communication plan in case phones are unavailable</li>
            <li>• Consider accessibility needs when choosing meeting locations</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default FamilyEmergencyPage;
