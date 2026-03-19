'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function Home() {
  const [selectedCompany, setSelectedCompany] = useState('all')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('dashboard')

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        <div className="h-full px-4 py-6 overflow-y-auto bg-white shadow-xl border-r border-slate-200">
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
                <h1 className="text-xl font-bold text-slate-800">
                   Data Lake
                </h1>
              </div>
            </div>
            <p className="text-xs text-slate-500">Intelligence Dashboard</p>
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
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span className="font-medium">{item.name}</span>
              </button>
            ))}
          </nav>

          {/* User Section */}
          <div className="absolute bottom-6 left-4 right-4">
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-semibold">
                  U
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800">User</p>
                  <p className="text-xs text-slate-500">Damcho Lhendup</p>
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
        <header className="sticky top-0 z-20 backdrop-blur-xl bg-white/70 shadow-sm border-b border-slate-200">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              {/* Mobile menu button */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              <div className="flex-1 flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
                    {selectedCompany === 'all' ? 'Dashboard' : currentCompany?.name}
                  </h2>
                  <p className="text-sm text-slate-500 mt-0.5">
                    {selectedCompany === 'all' 
                      ? "Welcome back! Here's your overview" 
                      : `Viewing data for ${currentCompany?.name}`
                    }
                  </p>
                </div>

                {/* Company Selector */}
                <select
                  value={selectedCompany}
                  onChange={(e) => setSelectedCompany(e.target.value)}
                  className="px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm hover:border-slate-300 transition-colors"
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
        </header>

        {/* Main Content Area */}
        <main className="px-4 sm:px-6 lg:px-8 py-8">
          {/* Dashboard Section */}
          <section id="dashboard" className="scroll-mt-24">
          {/* Company Showcase - Only show when "All Companies" is selected */}
          {selectedCompany === 'all' && (
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <h2 className="text-lg font-bold text-slate-800 mb-4">Portfolio Companies</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                <div 
                  onClick={() => setSelectedCompany('bt')}
                  className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <div className="relative w-24 h-24 mb-3">
                    <Image 
                      src="/images/logos/BT.jpeg" 
                      alt="Bhutan Telecom" 
                      fill
                      className="object-contain"
                    />
                  </div>
                  <p className="text-sm font-medium text-slate-700 text-center">Bhutan Telecom</p>
                </div>
                <div 
                  onClick={() => setSelectedCompany('druk')}
                  className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <div className="relative w-24 h-24 mb-3">
                    <Image 
                      src="/images/logos/Drukair.png" 
                      alt="DrukAir" 
                      fill
                      className="object-contain"
                    />
                  </div>
                  <p className="text-sm font-medium text-slate-700 text-center">DrukAir</p>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer">
                  <div className="relative w-24 h-24 mb-3 flex items-center justify-center">
                    <span className="text-3xl text-slate-400">+</span>
                  </div>
                  <p className="text-sm font-medium text-slate-500 text-center">More Companies</p>
                </div>
              </div>
            </div>
          )}

          {/* Single Company View - Show when specific company is selected */}
          {selectedCompany !== 'all' && currentCompany?.logo && (
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 flex items-center justify-between">
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
                  <h2 className="text-xl font-bold text-slate-800">{currentCompany.name}</h2>
                  <p className="text-sm text-slate-500">Company Dashboard</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedCompany('all')}
                className="px-4 py-2 text-sm font-semibold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                View All Companies
              </button>
            </div>
          )}

          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Revenue Card */}
            <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold text-green-600 bg-green-50 px-2.5 py-1 rounded-full">+12.5%</span>
                </div>
                <h3 className="text-sm font-medium text-slate-600 mb-2">Total Revenue</h3>
                <p className="text-3xl font-bold text-slate-800 mb-1">--</p>
                <p className="text-xs text-slate-500">All service verticals</p>
              </div>
            </div>

            {/* Active Cell Towers */}
            <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold text-green-600 bg-green-50 px-2.5 py-1 rounded-full">Online</span>
                </div>
                <h3 className="text-sm font-medium text-slate-600 mb-2">Active Cell Towers</h3>
                <p className="text-3xl font-bold text-slate-800 mb-1">--</p>
                <p className="text-xs text-slate-500">Network availability</p>
              </div>
            </div>

            {/* Traffic Volume */}
            <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">24h</span>
                </div>
                <h3 className="text-sm font-medium text-slate-600 mb-2">Data Traffic</h3>
                <p className="text-3xl font-bold text-slate-800 mb-1">--</p>
                <p className="text-xs text-slate-500">GB throughput today</p>
              </div>
            </div>

            {/* Customer Service */}
            <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold text-green-600 bg-green-50 px-2.5 py-1 rounded-full">--</span>
                </div>
                <h3 className="text-sm font-medium text-slate-600 mb-2">SLA Compliance</h3>
                <p className="text-3xl font-bold text-slate-800 mb-1">--</p>
                <p className="text-xs text-slate-500">Service level agreement</p>
              </div>
            </div>
          </div>

          {/* Network Infrastructure Overview */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h2 className="text-lg font-bold text-slate-800 mb-4">Network Infrastructure</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4">
                <h3 className="text-xs font-semibold text-slate-600 mb-2">Cell Towers</h3>
                <p className="text-2xl font-bold text-blue-600 mb-1">--</p>
                <p className="text-xs text-slate-500">Total sites</p>
              </div>
              <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-4">
                <h3 className="text-xs font-semibold text-slate-600 mb-2">Network Uptime</h3>
                <p className="text-2xl font-bold text-emerald-600 mb-1">--</p>
                <p className="text-xs text-slate-500">Availability %</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4">
                <h3 className="text-xs font-semibold text-slate-600 mb-2">Avg Latency</h3>
                <p className="text-2xl font-bold text-purple-600 mb-1">--</p>
                <p className="text-xs text-slate-500">ms</p>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4">
                <h3 className="text-xs font-semibold text-slate-600 mb-2">Handover Success</h3>
                <p className="text-2xl font-bold text-orange-600 mb-1">--</p>
                <p className="text-xs text-slate-500">Success rate %</p>
              </div>
            </div>
          </div>

          {/* Traffic & Revenue Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Traffic Volume by Dzongkhag */}
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-shadow">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Traffic Volume by Region</h2>
                  <p className="text-sm text-slate-500 mt-1">Voice, Data & SMS breakdown</p>
                </div>
                <select className="px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 rounded-lg border-0">
                  <option>Daily</option>
                  <option>Hourly</option>
                  <option>Monthly</option>
                </select>
              </div>
              <div className="h-64 flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl border-2 border-dashed border-slate-200">
                <div className="text-center">
                  <p className="text-sm text-slate-500 font-medium">Dzongkhag traffic map</p>
                  <p className="text-xs text-slate-400 mt-1">Aggregated data visualization</p>
                </div>
              </div>
            </div>

            {/* Revenue by Service Vertical */}
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-shadow">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Revenue by Service</h2>
                  <p className="text-sm text-slate-500 mt-1">Voice, Data, Broadband, Enterprise</p>
                </div>
                <button className="px-4 py-2 text-xs font-semibold text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors">
                  Export
                </button>
              </div>
              <div className="h-64 flex items-center justify-center bg-gradient-to-br from-slate-50 to-emerald-50 rounded-xl border-2 border-dashed border-slate-200">
                <div className="text-center">
                  <p className="text-sm text-slate-500 font-medium">Service vertical breakdown</p>
                  <p className="text-xs text-slate-400 mt-1">Revenue distribution chart</p>
                </div>
              </div>
            </div>
          </div>

          {/* Cell Tower Data Table */}
          <div id="companies" className="scroll-mt-24 bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow">
            <div className="px-6 py-5 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Cell Tower Infrastructure</h2>
                  <p className="text-sm text-slate-500 mt-1">Site data, coordinates, coverage & KPIs</p>
                </div>
                <button className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30 transition-all">
                  Export Data
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left py-4 px-6 text-xs font-bold text-slate-700 uppercase tracking-wider">Tower ID</th>
                    <th className="text-left py-4 px-6 text-xs font-bold text-slate-700 uppercase tracking-wider hidden sm:table-cell">Location</th>
                    <th className="text-left py-4 px-6 text-xs font-bold text-slate-700 uppercase tracking-wider hidden lg:table-cell">RAT Type</th>
                    <th className="text-right py-4 px-6 text-xs font-bold text-slate-700 uppercase tracking-wider">Coverage (km)</th>
                    <th className="text-right py-4 px-6 text-xs font-bold text-slate-700 uppercase tracking-wider">Uptime %</th>
                    <th className="text-right py-4 px-6 text-xs font-bold text-slate-700 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-12 px-6 text-center" colSpan={6}>
                      <div className="flex flex-col items-center justify-center">
                        <p className="text-sm font-semibold text-slate-700">No tower data available yet</p>
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
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Network & Service Analytics</h2>
                <p className="text-sm text-slate-500 mt-1">Comprehensive telecom performance metrics</p>
              </div>
              
              {/* Traffic Analytics */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Traffic Volume Metrics</h3>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
                    <h4 className="text-sm font-semibold text-slate-700 mb-2">Voice Traffic</h4>
                    <p className="text-3xl font-bold text-blue-600 mb-2">--</p>
                    <p className="text-xs text-slate-500">Erlangs (aggregated)</p>
                  </div>
                  <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-6">
                    <h4 className="text-sm font-semibold text-slate-700 mb-2">Data Throughput</h4>
                    <p className="text-3xl font-bold text-emerald-600 mb-2">--</p>
                    <p className="text-xs text-slate-500">GB (by dzongkhag)</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6">
                    <h4 className="text-sm font-semibold text-slate-700 mb-2">SMS Count</h4>
                    <p className="text-3xl font-bold text-purple-600 mb-2">--</p>
                    <p className="text-xs text-slate-500">Messages (24h)</p>
                  </div>
                </div>
              </div>

              {/* Revenue Breakdown */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Revenue by Service Vertical</h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-xs font-semibold text-slate-600 mb-1">Mobile Voice</p>
                    <p className="text-xl font-bold text-blue-600">--</p>
                  </div>
                  <div className="bg-emerald-50 rounded-lg p-4">
                    <p className="text-xs font-semibold text-slate-600 mb-1">Mobile Data</p>
                    <p className="text-xl font-bold text-emerald-600">--</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <p className="text-xs font-semibold text-slate-600 mb-1">Fixed Broadband</p>
                    <p className="text-xl font-bold text-purple-600">--</p>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-4">
                    <p className="text-xs font-semibold text-slate-600 mb-1">Enterprise</p>
                    <p className="text-xl font-bold text-orange-600">--</p>
                  </div>
                </div>
              </div>

              {/* Customer Service Metrics */}
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Customer Service Performance</h3>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                  <div className="border-2 border-slate-200 rounded-xl p-4">
                    <p className="text-xs font-semibold text-slate-600 mb-1">Ticket Volume</p>
                    <p className="text-2xl font-bold text-slate-800 mb-1">--</p>
                    <p className="text-xs text-slate-500">Total active</p>
                  </div>
                  <div className="border-2 border-slate-200 rounded-xl p-4">
                    <p className="text-xs font-semibold text-slate-600 mb-1">Mean Time to Repair</p>
                    <p className="text-2xl font-bold text-slate-800 mb-1">--</p>
                    <p className="text-xs text-slate-500">hours</p>
                  </div>
                  <div className="border-2 border-slate-200 rounded-xl p-4">
                    <p className="text-xs font-semibold text-slate-600 mb-1">First Call Resolution</p>
                    <p className="text-2xl font-bold text-slate-800 mb-1">--</p>
                    <p className="text-xs text-slate-500">% success</p>
                  </div>
                  <div className="border-2 border-slate-200 rounded-xl p-4">
                    <p className="text-xs font-semibold text-slate-600 mb-1">SLA Compliance</p>
                    <p className="text-2xl font-bold text-slate-800 mb-1">--</p>
                    <p className="text-xs text-slate-500">% compliance</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Reports Section */}
          <section id="reports" className="scroll-mt-24 mt-8">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">Data Reports & Exports</h2>
                  <p className="text-sm text-slate-500 mt-1">Access telecom data exports and summaries</p>
                </div>
                <button className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-700 hover:to-indigo-700 shadow-lg transition-all">
                  Generate Report
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="border-2 border-slate-200 rounded-xl p-4 hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-xl">📡</span>
                    </div>
                    <h3 className="text-sm font-semibold text-slate-800">CDR Aggregates</h3>
                  </div>
                  <p className="text-xs text-slate-500 mb-3">Call detail record summaries by segment</p>
                  <p className="text-xs text-slate-400">Format: CSV, Excel</p>
                </div>
                <div className="border-2 border-slate-200 rounded-xl p-4 hover:border-emerald-500 hover:shadow-lg transition-all cursor-pointer">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <span className="text-xl">💰</span>
                    </div>
                    <h3 className="text-sm font-semibold text-slate-800">Revenue Report</h3>
                  </div>
                  <p className="text-xs text-slate-500 mb-3">Service vertical revenue breakdowns</p>
                  <p className="text-xs text-slate-400">Format: PDF, Excel</p>
                </div>
                <div className="border-2 border-slate-200 rounded-xl p-4 hover:border-purple-500 hover:shadow-lg transition-all cursor-pointer">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <span className="text-xl">📋</span>
                    </div>
                    <h3 className="text-sm font-semibold text-slate-800">Tariff Catalog</h3>
                  </div>
                  <p className="text-xs text-slate-500 mb-3">Complete pricing tiers and plan details</p>
                  <p className="text-xs text-slate-400">Format: PDF, JSON</p>
                </div>
                <div className="border-2 border-slate-200 rounded-xl p-4 hover:border-orange-500 hover:shadow-lg transition-all cursor-pointer">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <span className="text-xl">🗼</span>
                    </div>
                    <h3 className="text-sm font-semibold text-slate-800">Tower Site Data</h3>
                  </div>
                  <p className="text-xs text-slate-500 mb-3">Cell tower locations and network KPIs</p>
                  <p className="text-xs text-slate-400">Format: CSV, GeoJSON</p>
                </div>
                <div className="border-2 border-slate-200 rounded-xl p-4 hover:border-pink-500 hover:shadow-lg transition-all cursor-pointer">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                      <span className="text-xl">🔄</span>
                    </div>
                    <h3 className="text-sm font-semibold text-slate-800">Interconnect Settlement</h3>
                  </div>
                  <p className="text-xs text-slate-500 mb-3">Anonymized invoice metadata summaries</p>
                  <p className="text-xs text-slate-400">Format: PDF, Excel</p>
                </div>
                <div className="border-2 border-slate-200 rounded-xl p-4 hover:border-indigo-500 hover:shadow-lg transition-all cursor-pointer">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <span className="text-xl">📊</span>
                    </div>
                    <h3 className="text-sm font-semibold text-slate-800">Traffic Analytics</h3>
                  </div>
                  <p className="text-xs text-slate-500 mb-3">Voice, data & SMS by dzongkhag</p>
                  <p className="text-xs text-slate-400">Format: Excel, CSV</p>
                </div>
              </div>
            </div>
          </section>

          {/* Settings Section */}
          <section id="settings" className="scroll-mt-24 mt-8 mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Settings</h2>
                <p className="text-sm text-slate-500 mt-1">Manage your dashboard preferences</p>
              </div>
              <div className="space-y-4">
                <div className="border-b border-slate-200 pb-4">
                  <h3 className="text-sm font-semibold text-slate-800 mb-3">Display Settings</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Currency Format</span>
                      <select className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm">
                        <option>BTN (Nu.)</option>
                        <option>USD ($)</option>
                        <option>EUR (€)</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Date Format</span>
                      <select className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm">
                        <option>DD/MM/YYYY</option>
                        <option>MM/DD/YYYY</option>
                        <option>YYYY-MM-DD</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="border-b border-slate-200 pb-4">
                  <h3 className="text-sm font-semibold text-slate-800 mb-3">Notification Preferences</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Email Notifications</span>
                      <input type="checkbox" className="w-5 h-5 text-blue-600 rounded" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Report Alerts</span>
                      <input type="checkbox" className="w-5 h-5 text-blue-600 rounded" />
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-800 mb-3">Account</h3>
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
