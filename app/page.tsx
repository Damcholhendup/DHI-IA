'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function Home() {
  const [selectedCompany, setSelectedCompany] = useState('all')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const companies = [
    { id: 'all', name: 'All Companies' },
    { id: 'bt', name: 'Bhutan Telecom' },
    { id: 'druk', name: 'DrukAir' },
    { id: 'other', name: 'Other DHI Companies' },
  ]

  const navItems = [
    { name: 'Dashboard', active: true },
    { name: 'Analytics', active: false },
    { name: 'Companies', active: false },
    { name: 'Reports', active: false },
    { name: 'Settings', active: false },
  ]

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
              <a
                key={item.name}
                href="#"
                className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                  item.active
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span className="font-medium">{item.name}</span>
              </a>
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
                  <p className="text-xs text-slate-500">Administrator</p>
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
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-800">Dashboard</h2>
                  <p className="text-sm text-slate-500 mt-0.5">Welcome back! Here&apos;s your overview</p>
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
          {/* Company Showcase */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h2 className="text-lg font-bold text-slate-800 mb-4">Portfolio Companies</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer">
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
              <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer">
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

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Revenue Card */}
            <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold text-green-600 bg-green-50 px-2.5 py-1 rounded-full">+12.5%</span>
                </div>
                <h3 className="text-sm font-medium text-slate-600 mb-2">Total Revenue</h3>
                <p className="text-3xl font-bold text-slate-800 mb-1">--</p>
                <p className="text-xs text-slate-500">Awaiting data</p>
              </div>
            </div>

            {/* Profit Card */}
            <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold text-green-600 bg-green-50 px-2.5 py-1 rounded-full">+8.2%</span>
                </div>
                <h3 className="text-sm font-medium text-slate-600 mb-2">Total Profit</h3>
                <p className="text-3xl font-bold text-slate-800 mb-1">--</p>
                <p className="text-xs text-slate-500">Awaiting data</p>
              </div>
            </div>

            {/* Companies Card */}
            <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">Active</span>
                </div>
                <h3 className="text-sm font-medium text-slate-600 mb-2">Active Companies</h3>
                <p className="text-3xl font-bold text-slate-800 mb-1">--</p>
                <p className="text-xs text-slate-500">Awaiting data</p>
              </div>
            </div>

            {/* Growth Card */}
            <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold text-green-600 bg-green-50 px-2.5 py-1 rounded-full">+15.8%</span>
                </div>
                <h3 className="text-sm font-medium text-slate-600 mb-2">Average Growth</h3>
                <p className="text-3xl font-bold text-slate-800 mb-1">--</p>
                <p className="text-xs text-slate-500">Awaiting data</p>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Revenue Trends */}
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-shadow">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Revenue Trends</h2>
                  <p className="text-sm text-slate-500 mt-1">Monthly overview</p>
                </div>
                <button className="px-4 py-2 text-xs font-semibold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  View Details
                </button>
              </div>
              <div className="h-64 flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl border-2 border-dashed border-slate-200">
                <div className="text-center">
                  <p className="text-sm text-slate-500 font-medium">Chart visualization</p>
                  <p className="text-xs text-slate-400 mt-1">Coming soon</p>
                </div>
              </div>
            </div>

            {/* Company Performance */}
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-shadow">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Company Performance</h2>
                  <p className="text-sm text-slate-500 mt-1">Comparative analysis</p>
                </div>
                <button className="px-4 py-2 text-xs font-semibold text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors">
                  Export
                </button>
              </div>
              <div className="h-64 flex items-center justify-center bg-gradient-to-br from-slate-50 to-emerald-50 rounded-xl border-2 border-dashed border-slate-200">
                <div className="text-center">
                  <p className="text-sm text-slate-500 font-medium">Performance metrics</p>
                  <p className="text-xs text-slate-400 mt-1">Coming soon</p>
                </div>
              </div>
            </div>
          </div>

          {/* Company Data Table */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow">
            <div className="px-6 py-5 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Company Overview</h2>
                  <p className="text-sm text-slate-500 mt-1">Detailed company statistics</p>
                </div>
                <button className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30 transition-all">
                  + Add Company
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left py-4 px-6 text-xs font-bold text-slate-700 uppercase tracking-wider">Company</th>
                    <th className="text-left py-4 px-6 text-xs font-bold text-slate-700 uppercase tracking-wider hidden sm:table-cell">Sector</th>
                    <th className="text-right py-4 px-6 text-xs font-bold text-slate-700 uppercase tracking-wider">Revenue</th>
                    <th className="text-right py-4 px-6 text-xs font-bold text-slate-700 uppercase tracking-wider">Growth</th>
                    <th className="text-right py-4 px-6 text-xs font-bold text-slate-700 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-12 px-6 text-center" colSpan={5}>
                      <div className="flex flex-col items-center justify-center">
                        <p className="text-sm font-semibold text-slate-700">No data available yet</p>
                        <p className="text-xs text-slate-500 mt-1">Start by adding company data</p>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
