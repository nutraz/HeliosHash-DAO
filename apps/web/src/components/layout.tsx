'use client'

import React, { ReactNode, useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import UserMenu from './user/UserMenu'
import { useAuth } from '@/contexts/AuthContext'
import { Moon, Sun } from 'lucide-react'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const pathname = usePathname()
  const { isAuthenticated } = useAuth()
  
  // Initialize dark mode from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('hhdao-theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const isDark = savedTheme === 'dark' || (!savedTheme && prefersDark)
    setDarkMode(isDark)
    if (isDark) {
      document.documentElement.classList.add('dark')
    }
  }, [])

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    if (!darkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('hhdao-theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('hhdao-theme', 'light')
    }
  }
  
  // Generate page title based on current route
  const getPageTitle = () => {
    if (pathname === '/projects/create') return 'Create Project - HeliosHash DAO'
    if (pathname === '/projects') return 'Projects - HeliosHash DAO'
    if (pathname === '/login') return 'Sign In - HeliosHash DAO'
    return 'HeliosHash DAO - Decentralized Solar Energy'
  }

  return (
    <>
      <Head>
        <title>{getPageTitle()}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="description" content="HeliosHash DAO - Decentralized Autonomous Organization for Solar Energy" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800">
        <nav className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo and Brand */}
            <Link href="/" className="flex items-center space-x-3 hover:opacity-90 transition-all">
              <Image 
                src="/hhdaologo-main.svg" 
                alt="HeliosHash DAO"
                width={180}
                height={45}
                className="h-11 w-auto"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <Link
                href="/"
                className={`font-semibold transition-colors ${pathname === '/' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'}`}
              >
                Dashboard
              </Link>
              <Link
                href="/projects"
                className={`font-semibold transition-colors ${pathname?.startsWith('/projects') ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'}`}
              >
                Projects
              </Link>
              
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="Toggle dark mode"
              >
                {darkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-700" />}
              </button>
              
              {isAuthenticated ? (
                <Link
                  href="/projects/create"
                  className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Create Project
                </Link>
              ) : (
                <Link href="/login" className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors">Sign In</Link>
              )}
              <UserMenu />
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center space-x-2">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800"
                aria-label="Toggle dark mode"
              >
                {darkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5" />}
              </button>
              <button
                className="p-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                <svg className="w-6 h-6 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 space-y-4 pb-4">
              <Link href="/" className="block font-semibold text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Dashboard</Link>
              <Link href="/projects" className="block font-semibold text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Projects</Link>
              {isAuthenticated ? (
                <Link href="/projects/create" className="block font-semibold text-blue-600 dark:text-blue-400">Create Project</Link>
              ) : (
                <Link href="/login" className="block font-semibold text-blue-600 dark:text-blue-400">Sign In</Link>
              )}
              <div className="pt-2 border-t border-gray-200 dark:border-gray-700"><UserMenu /></div>
            </div>
          )}
        </nav>
      </header>

      <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
        {children}
      </main>

      <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 mt-8">
        <div className="container mx-auto px-4 py-6 text-sm text-gray-600 dark:text-gray-400 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2">
            <Image src="/logo-simple.svg" alt="HHDAO" width={20} height={20} className="dark:invert" />
            <span>© {new Date().getFullYear()} HeliosHash DAO — All rights reserved</span>
          </div>
          <div className="space-x-4 mt-2 md:mt-0">
            <Link href="/terms" className="hover:text-blue-600 dark:hover:text-blue-400">Terms</Link>
            <Link href="/privacy" className="hover:text-blue-600 dark:hover:text-blue-400">Privacy</Link>
            <a href="mailto:support@hhdao.com" className="hover:text-blue-600 dark:hover:text-blue-400">Support</a>
          </div>
        </div>
      </footer>
    </>
  )
}
