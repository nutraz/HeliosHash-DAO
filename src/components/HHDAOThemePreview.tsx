"use client";
import React, { useState, useEffect } from 'react';
import { Zap, Sun, Leaf, Award, TrendingUp, Users, Wallet, ArrowRight, Sparkles, Heart } from 'lucide-react';

const HHDAOThemePreview: React.FC = () => {
  const [activeTab, setActiveTab] = useState('components');
  const [glowIntensity, setGlowIntensity] = useState(1);
  const [animationSpeed, setAnimationSpeed] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlowIntensity(prev => (prev === 1 ? 1.5 : 1));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-blue-950 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-orange-500 blur-xl opacity-50 animate-pulse"></div>
              <Zap className="relative text-orange-400 w-16 h-16" />
            </div>
            <h1 className="text-6xl font-bold bg-gradient-to-r from-orange-400 via-white to-green-400 bg-clip-text text-transparent">
              HeliosHash DAO
            </h1>
          </div>
          <p className="text-gray-400 text-xl">Dark Theme Design System Preview</p>
        </div>

        {/* Color Palette */}
        <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-3xl p-8 shadow-2xl">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center space-x-3">
            <Sparkles className="text-orange-400" />
            <span>Color Palette</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {/* Orange */}
            <div className="space-y-3">
              <div className="relative group">
                <div className="absolute inset-0 bg-orange-500 blur-2xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative h-32 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl shadow-xl shadow-orange-500/50"></div>
              </div>
              <div className="text-center">
                <p className="text-white font-bold">Energy Orange</p>
                <p className="text-gray-400 text-sm">#FB923C</p>
              </div>
            </div>

            {/* White */}
            <div className="space-y-3">
              <div className="relative group">
                <div className="absolute inset-0 bg-white blur-2xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
                <div className="relative h-32 bg-gradient-to-br from-white to-gray-100 rounded-2xl shadow-xl"></div>
              </div>
              <div className="text-center">
                <p className="text-white font-bold">Pure White</p>
                <p className="text-gray-400 text-sm">#FFFFFF</p>
              </div>
            </div>

            {/* Green */}
            <div className="space-y-3">
              <div className="relative group">
                <div className="absolute inset-0 bg-green-500 blur-2xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative h-32 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl shadow-xl shadow-green-500/50"></div>
              </div>
              <div className="text-center">
                <p className="text-white font-bold">Eco Green</p>
                <p className="text-gray-400 text-sm">#4ADE80</p>
              </div>
            </div>

            {/* Deep Blue */}
            <div className="space-y-3">
              <div className="relative group">
                <div className="absolute inset-0 bg-blue-600 blur-2xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative h-32 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl shadow-xl shadow-blue-600/50"></div>
              </div>
              <div className="text-center">
                <p className="text-white font-bold">Deep Blue</p>
                <p className="text-gray-400 text-sm">#2563EB</p>
              </div>
            </div>

            {/* Dark Gray */}
            <div className="space-y-3">
              <div className="relative group">
                <div className="h-32 bg-gradient-to-br from-gray-800 to-gray-950 rounded-2xl shadow-xl border border-gray-700"></div>
              </div>
              <div className="text-center">
                <p className="text-white font-bold">Dark Base</p>
                <p className="text-gray-400 text-sm">#0F172A</p>
              </div>
            </div>
          </div>
        </div>

        {/* Glowing Buttons */}
        <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-3xl p-8 shadow-2xl">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center space-x-3">
            <Zap className="text-green-400" />
            <span>Glowing Interactive Elements</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Primary Button */}
            <button className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 blur-lg opacity-75 group-hover:opacity-100 transition-all group-hover:blur-xl"></div>
              <div className="relative bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-2xl font-bold text-lg transform group-hover:scale-105 transition-all shadow-xl">
                Primary Action
              </div>
            </button>

            {/* Success Button */}
            <button className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-600 blur-lg opacity-75 group-hover:opacity-100 transition-all group-hover:blur-xl"></div>
              <div className="relative bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-2xl font-bold text-lg transform group-hover:scale-105 transition-all shadow-xl">
                Success Action
              </div>
            </button>

            {/* Info Button */}
            <button className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 blur-lg opacity-75 group-hover:opacity-100 transition-all group-hover:blur-xl"></div>
              <div className="relative bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transform group-hover:scale-105 transition-all shadow-xl">
                Info Action
              </div>
            </button>

            {/* Ghost Button */}
            <button className="relative group">
              <div className="absolute inset-0 bg-white blur-lg opacity-20 group-hover:opacity-40 transition-all"></div>
              <div className="relative bg-transparent border-2 border-white/30 text-white px-8 py-4 rounded-2xl font-bold text-lg transform group-hover:scale-105 transition-all group-hover:border-white/60 group-hover:bg-white/10">
                Ghost Action
              </div>
            </button>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-3xl p-8 shadow-2xl">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center space-x-3">
            <TrendingUp className="text-blue-400" />
            <span>Glowing Stat Cards</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Energy Card */}
            <div className="relative group overflow-hidden rounded-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-orange-600/20 blur-xl"></div>
              <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 p-6 border border-orange-500/30 group-hover:border-orange-500/60 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <Sun className="text-orange-400 w-10 h-10" />
                  <div className="text-right">
                    <p className="text-orange-400 text-sm font-medium">Energy Generated</p>
                    <p className="text-white text-3xl font-bold">2,847 kWh</p>
                  </div>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div className="bg-gradient-to-r from-orange-500 to-orange-400 h-full rounded-full animate-pulse w-[67%]"></div>
                </div>
                <p className="text-gray-400 text-sm mt-2">↑ 23% from last month</p>
              </div>
            </div>

            {/* Green Impact Card */}
            <div className="relative group overflow-hidden rounded-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-green-600/20 blur-xl"></div>
              <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 p-6 border border-green-500/30 group-hover:border-green-500/60 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <Leaf className="text-green-400 w-10 h-10" />
                  <div className="text-right">
                    <p className="text-green-400 text-sm font-medium">CO₂ Saved</p>
                    <p className="text-white text-3xl font-bold">1,423 kg</p>
                  </div>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div className="bg-gradient-to-r from-green-500 to-green-400 h-full rounded-full animate-pulse w-[84%]"></div>
                </div>
                <p className="text-gray-400 text-sm mt-2">↑ 31% from last month</p>
              </div>
            </div>

            {/* Community Card */}
            <div className="relative group overflow-hidden rounded-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-blue-700/20 blur-xl"></div>
              <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 p-6 border border-blue-600/30 group-hover:border-blue-600/60 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <Users className="text-blue-400 w-10 h-10" />
                  <div className="text-right">
                    <p className="text-blue-400 text-sm font-medium">Active Members</p>
                    <p className="text-white text-3xl font-bold">1,247</p>
                  </div>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-600 to-blue-400 h-full rounded-full animate-pulse w-[92%]"></div>
                </div>
                <p className="text-gray-400 text-sm mt-2">↑ 156 new this month</p>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Section Example */}
        <div className="relative overflow-hidden rounded-3xl">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 via-green-500/20 to-blue-600/20 blur-3xl animate-pulse"></div>
          <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700 p-12">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <h1 className="text-6xl font-bold">
                <span className="bg-gradient-to-r from-orange-400 via-white to-green-400 bg-clip-text text-transparent animate-pulse">
                  Power the Future
                </span>
              </h1>
              <p className="text-2xl text-gray-300">
                Join the renewable energy revolution with blockchain technology
              </p>
              <div className="flex justify-center space-x-4 mt-8">
                <button className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-green-500 blur-lg opacity-75 group-hover:opacity-100 transition-all"></div>
                  <div className="relative bg-gradient-to-r from-orange-500 to-green-500 text-white px-10 py-4 rounded-2xl font-bold text-xl flex items-center space-x-2 transform group-hover:scale-105 transition-all">
                    <span>Get Started</span>
                    <ArrowRight />
                  </div>
                </button>
                <button className="relative group">
                  <div className="relative bg-transparent border-2 border-white/30 text-white px-10 py-4 rounded-2xl font-bold text-xl transform group-hover:scale-105 transition-all group-hover:border-white/60 group-hover:bg-white/10">
                    Learn More
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Animated Badge Examples */}
        <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-3xl p-8 shadow-2xl">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center space-x-3">
            <Award className="text-orange-400" />
            <span>Animated Badges & Tags</span>
          </h2>
          <div className="flex flex-wrap gap-4">
            <span className="relative group">
              <div className="absolute inset-0 bg-green-500 blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative bg-green-500/20 border border-green-500 text-green-400 px-6 py-2 rounded-full font-semibold">
                ✓ Functioning
              </div>
            </span>
            
            <span className="relative group">
              <div className="absolute inset-0 bg-orange-500 blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative bg-orange-500/20 border border-orange-500 text-orange-400 px-6 py-2 rounded-full font-semibold animate-pulse">
                ⚡ In Progress
              </div>
            </span>
            
            <span className="relative group">
              <div className="absolute inset-0 bg-blue-600 blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative bg-blue-600/20 border border-blue-600 text-blue-400 px-6 py-2 rounded-full font-semibold">
                🔧 Setup Phase
              </div>
            </span>
            
            <span className="relative group">
              <div className="absolute inset-0 bg-white blur-md opacity-30 group-hover:opacity-50 transition-opacity"></div>
              <div className="relative bg-white/10 border border-white/30 text-white px-6 py-2 rounded-full font-semibold">
                📋 Applied
              </div>
            </span>
          </div>
        </div>

        {/* Input Fields */}
        <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-3xl p-8 shadow-2xl">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center space-x-3">
            <Wallet className="text-green-400" />
            <span>Form Elements</span>
          </h2>
          <div className="space-y-4 max-w-2xl">
            <div className="relative group">
              <div className="absolute inset-0 bg-orange-500/20 blur-lg opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
              <input 
                type="text" 
                placeholder="Enter your wallet address..." 
                className="relative w-full bg-gray-800 border-2 border-gray-700 focus:border-orange-500 text-white px-6 py-4 rounded-xl outline-none transition-all placeholder-gray-500"
              />
            </div>
            
            <div className="relative group">
              <div className="absolute inset-0 bg-green-500/20 blur-lg opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
              <input 
                type="number" 
                placeholder="Amount (HHU Tokens)" 
                className="relative w-full bg-gray-800 border-2 border-gray-700 focus:border-green-500 text-white px-6 py-4 rounded-xl outline-none transition-all placeholder-gray-500"
              />
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center py-8">
          <p className="text-gray-400 flex items-center justify-center space-x-2">
            <span>Made with</span>
            <Heart className="text-red-500 w-5 h-5 animate-pulse" />
            <span>for HeliosHash DAO Community</span>
          </p>
        </div>

      </div>
    </div>
  );
};

export default HHDAOThemePreview;
