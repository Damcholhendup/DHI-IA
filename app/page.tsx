'use client'

import { useState } from 'react'
import Image from 'next/image'
import dynamic from 'next/dynamic'

// Dynamically import the map component (client-side only)
const NetworkMap = dynamic(() => import('./components/NetworkMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-slate-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-slate-600">Loading map...</p>
      </div>
    </div>
  ),
})

export default function Home() {
  const [selectedCompany, setSelectedCompany] = useState('all')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('dashboard')
  const [darkMode, setDarkMode] = useState(false)

  const companies = [
    { id: 'all', name: 'All Companies' },
    { id: 'bt', name: 'Bhutan Telecom', logo: '/images/logos/BT.jpeg' },
    { id: 'druk', name: 'DrukAir', logo: '/images/logos/Drukair.png' },
    { id: 'other', name: 'Other DHI Companies' },
  ]

  // Get currently selected company details
  const currentCompany = companies.find(c => c.id === selectedCompany)

  const navItems = [
    { name: 'Dashboard', id: 'dashboard' },
    { name: 'Analytics', id: 'analytics' },
    { name: 'Infrastructure', id: 'companies' },
    { name: 'Network Map', id: 'map' },
    { name: 'Reports', id: 'reports' },
    { name: 'Settings', id: 'settings' },
  ]

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const offset = 100 // Offset for sticky header
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.scrollY - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
      setActiveSection(sectionId)
      setSidebarOpen(false) // Close mobile sidebar after navigation
    }
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode 
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' 
        : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'
    }`}>
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        <div className={`h-full px-4 py-6 overflow-y-auto shadow-xl transition-colors duration-300 ${
          darkMode 
            ? 'bg-slate-900 border-r border-slate-700' 
            : 'bg-white border-r border-slate-200'
        }`}>
          {/* Logo */}
          <div className="mb-8 px-3">
            <div className="flex items-center gap-3 mb-2">
              <Image 
                src="/images/logos/DHI.webp" 
                alt="DHI Logo" 
                width={40} 
                height={40}
                className="object-contain"
              />
              <div>
                <h1 className={`text-xl font-bold transition-colors ${
                  darkMode ? 'text-white' : 'text-slate-800'
                }`}>
                   Data Lake
                </h1>
              </div>
            </div>
            <p className={`text-xs transition-colors ${
              darkMode ? 'text-slate-400' : 'text-slate-500'
            }`}>Intelligence Dashboard</p>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.id)}
                className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                  activeSection === item.id
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30'
                    : darkMode
                      ? 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span className="font-medium">{item.name}</span>
              </button>
            ))}
          </nav>

          {/* User Section */}
          <div className="absolute bottom-6 left-4 right-4">
            <div className={`rounded-xl p-4 border transition-colors ${
              darkMode 
                ? 'bg-slate-800 border-slate-700' 
                : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-semibold">
                  U
                </div>
                <div>
                  <p className={`text-sm font-medium transition-colors ${
                    darkMode ? 'text-white' : 'text-slate-800'
                  }`}>User</p>
                  <p className={`text-xs transition-colors ${
                    darkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}>Damcho Lhendup</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Header */}
        <header className={`sticky top-0 z-20 backdrop-blur-xl shadow-sm border-b transition-colors duration-300 ${
          darkMode 
            ? 'bg-slate-900/70 border-slate-700' 
            : 'bg-white/70 border-slate-200'
        }`}>
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              {/* Mobile menu button */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className={`lg:hidden p-2 rounded-lg transition-colors ${
                  darkMode 
                    ? 'text-slate-300 hover:bg-slate-800' 
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              <div className="flex-1 flex items-center justify-between gap-4">
                <div>
                  <h2 className={`text-xl sm:text-2xl font-bold transition-colors ${
                    darkMode ? 'text-white' : 'text-slate-800'
                  }`}>
                    {selectedCompany === 'all' ? 'Dashboard' : currentCompany?.name}
                  </h2>
                  <p className={`text-sm mt-0.5 transition-colors ${
                    darkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    {selectedCompany === 'all' 
                      ? "Welcome back! Here's your overview" 
                      : `Viewing data for ${currentCompany?.name}`
                    }
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  {/* Theme Toggle */}
                  <button
                    onClick={() => setDarkMode(!darkMode)}
                    className={`p-2.5 rounded-xl transition-all duration-300 ${
                      darkMode 
                        ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                    title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                  >
                    {darkMode ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                      </svg>
                    )}
                  </button>

                  {/* Company Selector */}
                  <select
                    value={selectedCompany}
                    onChange={(e) => setSelectedCompany(e.target.value)}
                    className={`px-4 py-2.5 border-2 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-colors ${
                      darkMode
                        ? 'bg-slate-800 border-slate-700 text-slate-200 hover:border-slate-600'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {companies.map((company) => (
                      <option key={company.id} value={company.id}>
                        {company.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="px-4 sm:px-6 lg:px-8 py-8">
          {/* Dashboard Section */}
          <section id="dashboard" className="scroll-mt-24">
          {/* Company Showcase - Only show when "All Companies" is selected */}
          {selectedCompany === 'all' && (
            <div className={`rounded-2xl shadow-lg p-6 mb-8 transition-colors ${
              darkMode ? 'bg-slate-800' : 'bg-white'
            }`}>
              <h2 className={`text-lg font-bold mb-4 transition-colors ${
                darkMode ? 'text-white' : 'text-slate-800'
              }`}>Portfolio Companies</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                <div 
                  onClick={() => setSelectedCompany('bt')}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl transition-colors cursor-pointer ${
                    darkMode 
                      ? 'bg-slate-700 hover:bg-slate-600' 
                      : 'bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <div className="relative w-24 h-24 mb-3">
                    <Image 
                      src="/images/logos/BT.jpeg" 
                      alt="Bhutan Telecom" 
                      fill
                      className="object-contain"
                    />
                  </div>
                  <p className={`text-sm font-medium text-center transition-colors ${
                    darkMode ? 'text-slate-200' : 'text-slate-700'
                  }`}>Bhutan Telecom</p>
                </div>
                <div 
                  onClick={() => setSelectedCompany('druk')}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl transition-colors cursor-pointer ${
                    darkMode 
                      ? 'bg-slate-700 hover:bg-slate-600' 
                      : 'bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <div className="relative w-24 h-24 mb-3">
                    <Image 
                      src="/images/logos/Drukair.png" 
                      alt="DrukAir" 
                      fill
                      className="object-contain"
                    />
                  </div>
                  <p className={`text-sm font-medium text-center transition-colors ${
                    darkMode ? 'text-slate-200' : 'text-slate-700'
                  }`}>DrukAir</p>
                </div>
                <div className={`flex flex-col items-center justify-center p-4 rounded-xl transition-colors cursor-pointer ${
                  darkMode 
                    ? 'bg-slate-700 hover:bg-slate-600' 
                    : 'bg-slate-50 hover:bg-slate-100'
                }`}>
                  <div className="relative w-24 h-24 mb-3 flex items-center justify-center">
                    <span className={`text-3xl ${
                      darkMode ? 'text-slate-500' : 'text-slate-400'
                    }`}>+</span>
                  </div>
                  <p className={`text-sm font-medium text-center ${
                    darkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}>More Companies</p>
                </div>
              </div>
            </div>
          )}

          {/* Single Company View - Show when specific company is selected */}
          {selectedCompany !== 'all' && currentCompany?.logo && (
            <div className={`rounded-2xl shadow-lg p-6 mb-8 flex items-center justify-between transition-colors ${
              darkMode ? 'bg-slate-800' : 'bg-white'
            }`}>
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16">
                  <Image 
                    src={currentCompany.logo} 
                    alt={currentCompany.name} 
                    fill
                    className="object-contain"
                  />
                </div>
                <div>
                  <h2 className={`text-xl font-bold ${
                    darkMode ? 'text-white' : 'text-slate-800'
                  }`}>{currentCompany.name}</h2>
                  <p className={`text-sm ${
                    darkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}>Company Dashboard</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedCompany('all')}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
                  darkMode 
                    ? 'text-blue-400 bg-slate-700 hover:bg-slate-600' 
                    : 'text-blue-600 bg-blue-50 hover:bg-blue-100'
                }`}
              >
                View All Companies
              </button>
            </div>
          )}

          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Revenue Card */}
            <div className={`group relative rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden ${
              darkMode ? 'bg-slate-800' : 'bg-white'
            }`}>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    darkMode ? 'text-green-400 bg-green-900/30' : 'text-green-600 bg-green-50'
                  }`}>+12.5%</span>
                </div>
                <h3 className={`text-sm font-medium mb-2 ${
                  darkMode ? 'text-slate-400' : 'text-slate-600'
                }`}>Total Revenue</h3>
                <p className={`text-3xl font-bold mb-1 ${
                  darkMode ? 'text-white' : 'text-slate-800'
                }`}>--</p>
                <p className={`text-xs ${
                  darkMode ? 'text-slate-500' : 'text-slate-500'
                }`}>All service verticals</p>
              </div>
            </div>

            {/* Active Cell Towers */}
            <div className={`group relative rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden ${
              darkMode ? 'bg-slate-800' : 'bg-white'
            }`}>
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    darkMode ? 'text-green-400 bg-green-900/30' : 'text-green-600 bg-green-50'
                  }`}>Online</span>
                </div>
                <h3 className={`text-sm font-medium mb-2 ${
                  darkMode ? 'text-slate-400' : 'text-slate-600'
                }`}>Active Cell Towers</h3>
                <p className={`text-3xl font-bold mb-1 ${
                  darkMode ? 'text-white' : 'text-slate-800'
                }`}>--</p>
                <p className={`text-xs ${
                  darkMode ? 'text-slate-500' : 'text-slate-500'
                }`}>Network availability</p>
              </div>
            </div>

            {/* Traffic Volume */}
            <div className={`group relative rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden ${
              darkMode ? 'bg-slate-800' : 'bg-white'
            }`}>
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    darkMode ? 'text-blue-400 bg-blue-900/30' : 'text-blue-600 bg-blue-50'
                  }`}>24h</span>
                </div>
                <h3 className={`text-sm font-medium mb-2 ${
                  darkMode ? 'text-slate-400' : 'text-slate-600'
                }`}>Data Traffic</h3>
                <p className={`text-3xl font-bold mb-1 ${
                  darkMode ? 'text-white' : 'text-slate-800'
                }`}>--</p>
                <p className={`text-xs ${
                  darkMode ? 'text-slate-500' : 'text-slate-500'
                }`}>GB throughput today</p>
              </div>
            </div>

            {/* Customer Service */}
            <div className={`group relative rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden ${
              darkMode ? 'bg-slate-800' : 'bg-white'
            }`}>
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    darkMode ? 'text-green-400 bg-green-900/30' : 'text-green-600 bg-green-50'
                  }`}>--</span>
                </div>
                <h3 className={`text-sm font-medium mb-2 ${
                  darkMode ? 'text-slate-400' : 'text-slate-600'
                }`}>SLA Compliance</h3>
                <p className={`text-3xl font-bold mb-1 ${
                  darkMode ? 'text-white' : 'text-slate-800'
                }`}>--</p>
                <p className={`text-xs ${
                  darkMode ? 'text-slate-500' : 'text-slate-500'
                }`}>Service level agreement</p>
              </div>
            </div>
          </div>

          {/* Network Infrastructure Overview */}
          <div className={`rounded-2xl shadow-lg p-6 mb-8 transition-colors ${
            darkMode ? 'bg-slate-800' : 'bg-white'
          }`}>
            <h2 className={`text-lg font-bold mb-4 ${
              darkMode ? 'text-white' : 'text-slate-800'
            }`}>Network Infrastructure</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className={`rounded-xl p-4 ${
                darkMode 
                  ? 'bg-gradient-to-br from-blue-900/30 to-indigo-900/30' 
                  : 'bg-gradient-to-br from-blue-50 to-indigo-50'
              }`}>
                <h3 className={`text-xs font-semibold mb-2 ${
                  darkMode ? 'text-slate-400' : 'text-slate-600'
                }`}>Cell Towers</h3>
                <p className={`text-2xl font-bold mb-1 ${
                  darkMode ? 'text-blue-400' : 'text-blue-600'
                }`}>--</p>
                <p className="text-xs text-slate-500">Total sites</p>
              </div>
              <div className={`rounded-xl p-4 ${
                darkMode 
                  ? 'bg-gradient-to-br from-emerald-900/30 to-green-900/30' 
                  : 'bg-gradient-to-br from-emerald-50 to-green-50'
              }`}>
                <h3 className={`text-xs font-semibold mb-2 ${
                  darkMode ? 'text-slate-400' : 'text-slate-600'
                }`}>Network Uptime</h3>
                <p className={`text-2xl font-bold mb-1 ${
                  darkMode ? 'text-emerald-400' : 'text-emerald-600'
                }`}>--</p>
                <p className="text-xs text-slate-500">Availability %</p>
              </div>
              <div className={`rounded-xl p-4 ${
                darkMode 
                  ? 'bg-gradient-to-br from-purple-900/30 to-pink-900/30' 
                  : 'bg-gradient-to-br from-purple-50 to-pink-50'
              }`}>
                <h3 className={`text-xs font-semibold mb-2 ${
                  darkMode ? 'text-slate-400' : 'text-slate-600'
                }`}>Avg Latency</h3>
                <p className={`text-2xl font-bold mb-1 ${
                  darkMode ? 'text-purple-400' : 'text-purple-600'
                }`}>--</p>
                <p className="text-xs text-slate-500">ms</p>
              </div>
              <div className={`rounded-xl p-4 ${
                darkMode 
                  ? 'bg-gradient-to-br from-orange-900/30 to-amber-900/30' 
                  : 'bg-gradient-to-br from-orange-50 to-amber-50'
              }`}>
                <h3 className={`text-xs font-semibold mb-2 ${
                  darkMode ? 'text-slate-400' : 'text-slate-600'
                }`}>Handover Success</h3>
                <p className={`text-2xl font-bold mb-1 ${
                  darkMode ? 'text-orange-400' : 'text-orange-600'
                }`}>--</p>
                <p className="text-xs text-slate-500">Success rate %</p>
              </div>
            </div>
          </div>

          {/* Traffic & Revenue Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Traffic Volume by Dzongkhag */}
            <div className={`rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all ${
              darkMode ? 'bg-slate-800' : 'bg-white'
            }`}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className={`text-lg font-bold ${
                    darkMode ? 'text-white' : 'text-slate-800'
                  }`}>Traffic Volume by Region</h2>
                  <p className={`text-sm mt-1 ${
                    darkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}>Voice, Data & SMS breakdown</p>
                </div>
                <select className={`px-3 py-1.5 text-xs font-semibold rounded-lg border-0 ${
                  darkMode 
                    ? 'text-blue-400 bg-slate-700' 
                    : 'text-blue-600 bg-blue-50'
                }`}>
                  <option>Daily</option>
                  <option>Hourly</option>
                  <option>Monthly</option>
                </select>
              </div>
              <div className={`h-64 flex items-center justify-center rounded-xl border-2 border-dashed ${
                darkMode 
                  ? 'bg-gradient-to-br from-slate-900 to-blue-900/30 border-slate-600' 
                  : 'bg-gradient-to-br from-slate-50 to-blue-50 border-slate-200'
              }`}>
                <div className="text-center">
                  <p className={`text-sm font-medium ${
                    darkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}>Dzongkhag traffic map</p>
                  <p className="text-xs text-slate-400 mt-1">Aggregated data visualization</p>
                </div>
              </div>
            </div>

            {/* Revenue by Service Vertical */}
            <div className={`rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all ${
              darkMode ? 'bg-slate-800' : 'bg-white'
            }`}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className={`text-lg font-bold ${
                    darkMode ? 'text-white' : 'text-slate-800'
                  }`}>Revenue by Service</h2>
                  <p className={`text-sm mt-1 ${
                    darkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}>Voice, Data, Broadband, Enterprise</p>
                </div>
                <button className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
                  darkMode 
                    ? 'text-emerald-400 bg-emerald-900/30 hover:bg-emerald-900/50' 
                    : 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100'
                }`}>
                  Export
                </button>
              </div>
              <div className={`h-64 flex items-center justify-center rounded-xl border-2 border-dashed ${
                darkMode 
                  ? 'bg-gradient-to-br from-slate-900 to-emerald-900/30 border-slate-600' 
                  : 'bg-gradient-to-br from-slate-50 to-emerald-50 border-slate-200'
              }`}>
                <div className="text-center">
                  <p className={`text-sm font-medium ${
                    darkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}>Service vertical breakdown</p>
                  <p className="text-xs text-slate-400 mt-1">Revenue distribution chart</p>
                </div>
              </div>
            </div>
          </div>

          {/* Cell Tower Data Table */}
          <div id="companies" className={`scroll-mt-24 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all ${
            darkMode ? 'bg-slate-800' : 'bg-white'
          }`}>
            <div className={`px-6 py-5 border-b ${
              darkMode 
                ? 'border-slate-700 bg-gradient-to-r from-slate-800 to-blue-900/30' 
                : 'border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className={`text-lg font-bold ${
                    darkMode ? 'text-white' : 'text-slate-800'
                  }`}>Cell Tower Infrastructure</h2>
                  <p className={`text-sm mt-1 ${
                    darkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}>Site data, coordinates, coverage & KPIs</p>
                </div>
                <button className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30 transition-all">
                  Export Data
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`border-b ${
                    darkMode 
                      ? 'bg-slate-700 border-slate-600' 
                      : 'bg-slate-50 border-slate-200'
                  }`}>
                    <th className={`text-left py-4 px-6 text-xs font-bold uppercase tracking-wider ${
                      darkMode ? 'text-slate-300' : 'text-slate-700'
                    }`}>Tower ID</th>
                    <th className={`text-left py-4 px-6 text-xs font-bold uppercase tracking-wider hidden sm:table-cell ${
                      darkMode ? 'text-slate-300' : 'text-slate-700'
                    }`}>Location</th>
                    <th className={`text-left py-4 px-6 text-xs font-bold uppercase tracking-wider hidden lg:table-cell ${
                      darkMode ? 'text-slate-300' : 'text-slate-700'
                    }`}>RAT Type</th>
                    <th className={`text-right py-4 px-6 text-xs font-bold uppercase tracking-wider ${
                      darkMode ? 'text-slate-300' : 'text-slate-700'
                    }`}>Coverage (km)</th>
                    <th className={`text-right py-4 px-6 text-xs font-bold uppercase tracking-wider ${
                      darkMode ? 'text-slate-300' : 'text-slate-700'
                    }`}>Uptime %</th>
                    <th className={`text-right py-4 px-6 text-xs font-bold uppercase tracking-wider ${
                      darkMode ? 'text-slate-300' : 'text-slate-700'
                    }`}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-12 px-6 text-center" colSpan={6}>
                      <div className="flex flex-col items-center justify-center">
                        <p className={`text-sm font-semibold ${
                          darkMode ? 'text-slate-300' : 'text-slate-700'
                        }`}>No tower data available yet</p>
                        <p className="text-xs text-slate-500 mt-1">Awaiting Bhutan Telecom database access</p>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          </section>

          {/* Analytics Section */}
          <section id="analytics" className="scroll-mt-24 mt-8">
            <div className={`rounded-2xl shadow-lg p-6 transition-colors ${
              darkMode ? 'bg-slate-800' : 'bg-white'
            }`}>
              <div className="mb-6">
                <h2 className={`text-2xl font-bold ${
                  darkMode ? 'text-white' : 'text-slate-800'
                }`}>Network & Service Analytics</h2>
                <p className={`text-sm mt-1 ${
                  darkMode ? 'text-slate-400' : 'text-slate-500'
                }`}>Comprehensive telecom performance metrics</p>
              </div>
              
              {/* Traffic Analytics */}
              <div className="mb-6">
                <h3 className={`text-lg font-semibold mb-4 ${
                  darkMode ? 'text-white' : 'text-slate-800'
                }`}>Traffic Volume Metrics</h3>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className={`rounded-xl p-6 ${
                    darkMode 
                      ? 'bg-gradient-to-br from-blue-900/30 to-indigo-900/30' 
                      : 'bg-gradient-to-br from-blue-50 to-indigo-50'
                  }`}>
                    <h4 className={`text-sm font-semibold mb-2 ${
                      darkMode ? 'text-slate-300' : 'text-slate-700'
                    }`}>Voice Traffic</h4>
                    <p className={`text-3xl font-bold mb-2 ${
                      darkMode ? 'text-blue-400' : 'text-blue-600'
                    }`}>--</p>
                    <p className="text-xs text-slate-500">Erlangs (aggregated)</p>
                  </div>
                  <div className={`rounded-xl p-6 ${
                    darkMode 
                      ? 'bg-gradient-to-br from-emerald-900/30 to-green-900/30' 
                      : 'bg-gradient-to-br from-emerald-50 to-green-50'
                  }`}>
                    <h4 className={`text-sm font-semibold mb-2 ${
                      darkMode ? 'text-slate-300' : 'text-slate-700'
                    }`}>Data Throughput</h4>
                    <p className={`text-3xl font-bold mb-2 ${
                      darkMode ? 'text-emerald-400' : 'text-emerald-600'
                    }`}>--</p>
                    <p className="text-xs text-slate-500">GB (by dzongkhag)</p>
                  </div>
                  <div className={`rounded-xl p-6 ${
                    darkMode 
                      ? 'bg-gradient-to-br from-purple-900/30 to-pink-900/30' 
                      : 'bg-gradient-to-br from-purple-50 to-pink-50'
                  }`}>
                    <h4 className={`text-sm font-semibold mb-2 ${
                      darkMode ? 'text-slate-300' : 'text-slate-700'
                    }`}>SMS Count</h4>
                    <p className={`text-3xl font-bold mb-2 ${
                      darkMode ? 'text-purple-400' : 'text-purple-600'
                    }`}>--</p>
                    <p className="text-xs text-slate-500">Messages (24h)</p>
                  </div>
                </div>
              </div>

              {/* Revenue Breakdown */}
              <div className="mb-6">
                <h3 className={`text-lg font-semibold mb-4 ${
                  darkMode ? 'text-white' : 'text-slate-800'
                }`}>Revenue by Service Vertical</h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className={`rounded-lg p-4 ${
                    darkMode ? 'bg-blue-900/30' : 'bg-blue-50'
                  }`}>
                    <p className={`text-xs font-semibold mb-1 ${
                      darkMode ? 'text-slate-400' : 'text-slate-600'
                    }`}>Mobile Voice</p>
                    <p className={`text-xl font-bold ${
                      darkMode ? 'text-blue-400' : 'text-blue-600'
                    }`}>--</p>
                  </div>
                  <div className={`rounded-lg p-4 ${
                    darkMode ? 'bg-emerald-900/30' : 'bg-emerald-50'
                  }`}>
                    <p className={`text-xs font-semibold mb-1 ${
                      darkMode ? 'text-slate-400' : 'text-slate-600'
                    }`}>Mobile Data</p>
                    <p className={`text-xl font-bold ${
                      darkMode ? 'text-emerald-400' : 'text-emerald-600'
                    }`}>--</p>
                  </div>
                  <div className={`rounded-lg p-4 ${
                    darkMode ? 'bg-purple-900/30' : 'bg-purple-50'
                  }`}>
                    <p className={`text-xs font-semibold mb-1 ${
                      darkMode ? 'text-slate-400' : 'text-slate-600'
                    }`}>Fixed Broadband</p>
                    <p className={`text-xl font-bold ${
                      darkMode ? 'text-purple-400' : 'text-purple-600'
                    }`}>--</p>
                  </div>
                  <div className={`rounded-lg p-4 ${
                    darkMode ? 'bg-orange-900/30' : 'bg-orange-50'
                  }`}>
                    <p className={`text-xs font-semibold mb-1 ${
                      darkMode ? 'text-slate-400' : 'text-slate-600'
                    }`}>Enterprise</p>
                    <p className={`text-xl font-bold ${
                      darkMode ? 'text-orange-400' : 'text-orange-600'
                    }`}>--</p>
                  </div>
                </div>
              </div>

              {/* Customer Service Metrics */}
              <div>
                <h3 className={`text-lg font-semibold mb-4 ${
                  darkMode ? 'text-white' : 'text-slate-800'
                }`}>Customer Service Performance</h3>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                  <div className={`border-2 rounded-xl p-4 ${
                    darkMode 
                      ? 'border-slate-600' 
                      : 'border-slate-200'
                  }`}>
                    <p className={`text-xs font-semibold mb-1 ${
                      darkMode ? 'text-slate-400' : 'text-slate-600'
                    }`}>Ticket Volume</p>
                    <p className={`text-2xl font-bold mb-1 ${
                      darkMode ? 'text-white' : 'text-slate-800'
                    }`}>--</p>
                    <p className="text-xs text-slate-500">Total active</p>
                  </div>
                  <div className={`border-2 rounded-xl p-4 ${
                    darkMode 
                      ? 'border-slate-600' 
                      : 'border-slate-200'
                  }`}>
                    <p className={`text-xs font-semibold mb-1 ${
                      darkMode ? 'text-slate-400' : 'text-slate-600'
                    }`}>Mean Time to Repair</p>
                    <p className={`text-2xl font-bold mb-1 ${
                      darkMode ? 'text-white' : 'text-slate-800'
                    }`}>--</p>
                    <p className="text-xs text-slate-500">hours</p>
                  </div>
                  <div className={`border-2 rounded-xl p-4 ${
                    darkMode 
                      ? 'border-slate-600' 
                      : 'border-slate-200'
                  }`}>
                    <p className={`text-xs font-semibold mb-1 ${
                      darkMode ? 'text-slate-400' : 'text-slate-600'
                    }`}>First Call Resolution</p>
                    <p className={`text-2xl font-bold mb-1 ${
                      darkMode ? 'text-white' : 'text-slate-800'
                    }`}>--</p>
                    <p className="text-xs text-slate-500">% success</p>
                  </div>
                  <div className={`border-2 rounded-xl p-4 ${
                    darkMode 
                      ? 'border-slate-600' 
                      : 'border-slate-200'
                  }`}>
                    <p className={`text-xs font-semibold mb-1 ${
                      darkMode ? 'text-slate-400' : 'text-slate-600'
                    }`}>SLA Compliance</p>
                    <p className={`text-2xl font-bold mb-1 ${
                      darkMode ? 'text-white' : 'text-slate-800'
                    }`}>--</p>
                    <p className="text-xs text-slate-500">% compliance</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* Network Map Section */}
          <section id="map" className="scroll-mt-24 mt-8 mb-8">
            <div className={`rounded-2xl shadow-lg p-6 transition-colors ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
              <div className="mb-6">
                <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>Network Coverage Map</h2>
                <p className={`text-sm mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Interactive map of cell towers and network infrastructure</p>
              </div>
              
              {/* Map Container */}
              <div className={`rounded-xl overflow-hidden border transition-colors ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                <div className="relative w-full" style={{ height: '500px' }}>
                  <NetworkMap darkMode={darkMode} />
                </div>
              </div>
              
              {/* Map Legend */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`p-4 rounded-lg transition-colors ${darkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                    <div>
                      <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-slate-800'}`}>Active Towers</p>
                      <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>142 locations</p>
                    </div>
                  </div>
                </div>
                <div className={`p-4 rounded-lg transition-colors ${darkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                    <div>
                      <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-slate-800'}`}>Maintenance</p>
                      <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>8 locations</p>
                    </div>
                  </div>
                </div>
                <div className={`p-4 rounded-lg transition-colors ${darkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <div>
                      <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-slate-800'}`}>Coverage Area</p>
                      <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>95% nationwide</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* Reports Section */}
          <section id="reports" className="scroll-mt-24 mt-8">
            <div className={`rounded-2xl shadow-lg p-6 transition-colors ${
              darkMode ? 'bg-slate-800' : 'bg-white'
            }`}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className={`text-2xl font-bold ${
                    darkMode ? 'text-white' : 'text-slate-800'
                  }`}>Data Reports & Exports</h2>
                  <p className={`text-sm mt-1 ${
                    darkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}>Access telecom data exports and summaries</p>
                </div>
                <button className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-700 hover:to-indigo-700 shadow-lg transition-all">
                  Generate Report
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className={`border-2 rounded-xl p-4 hover:shadow-lg transition-all cursor-pointer ${
                  darkMode 
                    ? 'border-slate-600 hover:border-blue-500' 
                    : 'border-slate-200 hover:border-blue-500'
                }`}>
                  <h3 className={`text-sm font-semibold mb-3 ${
                    darkMode ? 'text-white' : 'text-slate-800'
                  }`}>CDR Aggregates</h3>
                  <p className={`text-xs mb-3 ${
                    darkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}>Call detail record summaries by segment</p>
                  <p className="text-xs text-slate-400">Format: CSV, Excel</p>
                </div>
                <div className={`border-2 rounded-xl p-4 hover:shadow-lg transition-all cursor-pointer ${
                  darkMode 
                    ? 'border-slate-600 hover:border-emerald-500' 
                    : 'border-slate-200 hover:border-emerald-500'
                }`}>
                  <h3 className={`text-sm font-semibold mb-3 ${
                    darkMode ? 'text-white' : 'text-slate-800'
                  }`}>Revenue Report</h3>
                  <p className={`text-xs mb-3 ${
                    darkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}>Service vertical revenue breakdowns</p>
                  <p className="text-xs text-slate-400">Format: PDF, Excel</p>
                </div>
                <div className={`border-2 rounded-xl p-4 hover:shadow-lg transition-all cursor-pointer ${
                  darkMode 
                    ? 'border-slate-600 hover:border-purple-500' 
                    : 'border-slate-200 hover:border-purple-500'
                }`}>
                  <h3 className={`text-sm font-semibold mb-3 ${
                    darkMode ? 'text-white' : 'text-slate-800'
                  }`}>Tariff Catalog</h3>
                  <p className={`text-xs mb-3 ${
                    darkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}>Complete pricing tiers and plan details</p>
                  <p className="text-xs text-slate-400">Format: PDF, JSON</p>
                </div>
                <div className={`border-2 rounded-xl p-4 hover:shadow-lg transition-all cursor-pointer ${
                  darkMode 
                    ? 'border-slate-600 hover:border-orange-500' 
                    : 'border-slate-200 hover:border-orange-500'
                }`}>
                  <h3 className={`text-sm font-semibold mb-3 ${
                    darkMode ? 'text-white' : 'text-slate-800'
                  }`}>Tower Site Data</h3>
                  <p className={`text-xs mb-3 ${
                    darkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}>Cell tower locations and network KPIs</p>
                  <p className="text-xs text-slate-400">Format: CSV, GeoJSON</p>
                </div>
                <div className={`border-2 rounded-xl p-4 hover:shadow-lg transition-all cursor-pointer ${
                  darkMode 
                    ? 'border-slate-600 hover:border-pink-500' 
                    : 'border-slate-200 hover:border-pink-500'
                }`}>
                  <h3 className={`text-sm font-semibold mb-3 ${
                    darkMode ? 'text-white' : 'text-slate-800'
                  }`}>Interconnect Settlement</h3>
                  <p className={`text-xs mb-3 ${
                    darkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}>Anonymized invoice metadata summaries</p>
                  <p className="text-xs text-slate-400">Format: PDF, Excel</p>
                </div>
                <div className={`border-2 rounded-xl p-4 hover:shadow-lg transition-all cursor-pointer ${
                  darkMode 
                    ? 'border-slate-600 hover:border-indigo-500' 
                    : 'border-slate-200 hover:border-indigo-500'
                }`}>
                  <h3 className={`text-sm font-semibold mb-3 ${
                    darkMode ? 'text-white' : 'text-slate-800'
                  }`}>Traffic Analytics</h3>
                  <p className={`text-xs mb-3 ${
                    darkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}>Voice, data & SMS by dzongkhag</p>
                  <p className="text-xs text-slate-400">Format: Excel, CSV</p>
                </div>
              </div>
            </div>
          </section>

          {/* Settings Section */}
          <section id="settings" className="scroll-mt-24 mt-8 mb-8">
            <div className={`rounded-2xl shadow-lg p-6 transition-colors ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
              <div className="mb-6">
                <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>Settings</h2>
                <p className={`text-sm mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Manage your dashboard preferences</p>
              </div>
              <div className="space-y-4">
                <div className={`border-b pb-4 ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                  <h3 className={`text-sm font-semibold mb-3 ${darkMode ? 'text-white' : 'text-slate-800'}`}>Display Settings</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>Currency Format</span>
                      <select className={`px-3 py-1.5 border rounded-lg text-sm ${darkMode ? 'border-slate-600 bg-slate-700 text-white' : 'border-slate-200 bg-white'}`}>
                        <option>BTN (Nu.)</option>
                        <option>USD ($)</option>
                        <option>EUR (€)</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>Date Format</span>
                      <select className={`px-3 py-1.5 border rounded-lg text-sm ${darkMode ? 'border-slate-600 bg-slate-700 text-white' : 'border-slate-200 bg-white'}`}>
                        <option>DD/MM/YYYY</option>
                        <option>MM/DD/YYYY</option>
                        <option>YYYY-MM-DD</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className={`border-b pb-4 ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                  <h3 className={`text-sm font-semibold mb-3 ${darkMode ? 'text-white' : 'text-slate-800'}`}>Notification Preferences</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>Email Notifications</span>
                      <input type="checkbox" className="w-5 h-5 text-blue-600 rounded" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>Report Alerts</span>
                      <input type="checkbox" className="w-5 h-5 text-blue-600 rounded" />
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className={`text-sm font-semibold mb-3 ${darkMode ? 'text-white' : 'text-slate-800'}`}>Account</h3>
                  <button className="px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
