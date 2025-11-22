"use client";

import { Zap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-800 border-t border-gray-700 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <Zap className="text-blue-400" size={20} />
            <span className="text-gray-400">HHDAO v1.0 - Built on Internet Computer</span>
          </div>
          <div className="flex items-center space-x-6 text-sm">
            <a href="#" className="text-gray-400 hover:text-white">Privacy</a>
            <a href="#" className="text-gray-400 hover:text-white">Terms</a>
            <a href="#" className="text-gray-400 hover:text-white">Docs</a>
            <a href="#" className="text-gray-400 hover:text-white">Support</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
