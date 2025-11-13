'use client'

import React, { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'

export default function UserMenu() {
  const { user, logout, isAuthenticated } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (!isAuthenticated || !user) {
    return (
      <button className="bg-primary hover:bg-primary/90 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
        Connect Wallet
      </button>
    )
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 bg-white border border-gray-200 rounded-lg px-3 py-2 hover:border-gray-300 transition-colors"
      >
        <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full text-white text-sm font-semibold">
          {user.avatar ? (
            <Image src={user.avatar!} alt={user.name ?? 'User'} width={32} height={32} className="rounded-full" unoptimized />
          ) : (
            getInitials(user.name || 'U')
          )}
        </div>
        <div className="hidden md:block text-left">
          <div className="text-sm font-semibold text-gray-800">{user.name}</div>
          <div className="text-xs text-gray-500">
            {user.email}
          </div>
        </div>
        <svg className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
          <div className="px-4 py-2 border-b border-gray-100">
            <div className="text-sm font-medium text-gray-800">{user.name}</div>
            <div className="text-xs text-gray-500 truncate">{user.email}</div>
          </div>
          <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
            My Profile
          </button>
          <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
            Settings
          </button>
          <button onClick={logout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 transition-colors border-t border-gray-100">
            Sign Out
          </button>
        </div>
      )}
    </div>
  )
}
