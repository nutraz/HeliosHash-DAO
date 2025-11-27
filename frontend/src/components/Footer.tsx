import React from "react"
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="w-full bg-gray-900 text-gray-300 py-6 mt-16 border-t border-gray-800">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center gap-2 mb-2 md:mb-0">
          <Image src="/assets/icons/hhdaologo.svg" alt="HHDAO Logo" width={32} height={32} className="w-8 h-8" />
          <span className="font-bold text-lg">HeliosHash DAO</span>
        </div>
        <div className="flex gap-6 text-sm">
          <a href="/dashboard" className="hover:text-white">Dashboard</a>
          <a href="/projects" className="hover:text-white">Projects</a>
          <a href="/login" className="hover:text-white">Sign In</a>
          <a href="https://github.com/nutraz/HeliosHash-DAO" target="_blank" rel="noopener noreferrer" className="hover:text-white">GitHub</a>
        </div>
        <div className="text-xs text-gray-500 mt-2 md:mt-0">&copy; {new Date().getFullYear()} HeliosHash DAO. All rights reserved.</div>
      </div>
    </footer>
  )
}
