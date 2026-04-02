'use client'

import { useState, useMemo } from 'react'
import dynamic from 'next/dynamic'
import type { InfraAsset } from './data/infrastructure'
import { infrastructureAssets } from './data/infrastructure'

const NetworkMap = dynamic(() => import('./components/NetworkMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-center">
        <div className="relative w-16 h-16 mx-auto mb-4">
          <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20" />
          <div className="absolute inset-0 rounded-full border-t-2 border-cyan-400 animate-spin" />
          <div className="absolute inset-2 rounded-full border-t-2 border-purple-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
        </div>
        <p className="text-sm text-slate-500 tracking-widest uppercase">Initializing Command Center</p>
      </div>
    </div>
  ),
})

const allTypes = ['hydropower', 'telecom', 'airline', 'mining', 'solar', 'substation']

const categoryConfig: Record<string, { label: string; icon: JSX.Element; color: string }> = {
  hydropower: {
    label: 'Hydropower',
    color: '#00e5ff',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00e5ff" strokeWidth="2" strokeLinecap="round">
        <path d="M12 2v6l3 2" /><path d="M8 14h8" /><path d="M10 18h4" /><circle cx="12" cy="12" r="10" strokeOpacity="0.3" />
      </svg>
    ),
  },
  telecom: {
    label: 'Telecom Infrastructure',
    color: '#00e676',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00e676" strokeWidth="2" strokeLinecap="round">
        <path d="M12 20V10" /><path d="M6 20v-4" /><path d="M18 20v-8" /><path d="M2 20h20" />
      </svg>
    ),
  },
  airline: {
    label: 'Airline & Airports',
    color: '#ffab00',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffab00" strokeWidth="2" strokeLinecap="round">
        <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
      </svg>
    ),
  },
  mining: {
    label: 'Mining & Industrial',
    color: '#ff1744',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ff1744" strokeWidth="2" strokeLinecap="round">
        <path d="M6 20l6-16 6 16" /><path d="M8 16h8" />
      </svg>
    ),
  },
  solar: {
    label: 'Solar Energy',
    color: '#ffd600',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffd600" strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="M4.93 4.93l1.41 1.41" /><path d="M17.66 17.66l1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="M6.34 17.66l-1.41 1.41" /><path d="M19.07 4.93l-1.41 1.41" />
      </svg>
    ),
  },
  substation: {
    label: 'Substations',
    color: '#d500f9',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d500f9" strokeWidth="2" strokeLinecap="round">
        <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="12" cy="12" r="4" /><path d="M12 8v8" /><path d="M8 12h8" />
      </svg>
    ),
  },
}

const tabs = ['Assets', 'Status', 'Coverage', 'Analytics', 'Reports']

export default function Home() {
  const [selectedAsset, setSelectedAsset] = useState<InfraAsset | null>(null)
  const [activeFilters, setActiveFilters] = useState<string[]>(allTypes)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('Assets')
  const [detailOpen, setDetailOpen] = useState(false)

  const toggleFilter = (type: string) => {
    setActiveFilters(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    )
  }

  const handleAssetClick = (asset: InfraAsset) => {
    setSelectedAsset(asset)
    setDetailOpen(true)
  }

  const stats = useMemo(() => {
    const filtered = infrastructureAssets.filter(a => activeFilters.includes(a.type))
    const operational = filtered.filter(a => a.status === 'operational').length
    const maintenance = filtered.filter(a => a.status === 'maintenance').length
    const offline = filtered.filter(a => a.status === 'offline').length
    return { total: filtered.length, operational, maintenance, offline }
  }, [activeFilters])

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden" style={{ background: '#060b18' }}>
      {/* Top Header Bar */}
      <header className="flex-shrink-0 glass-panel flex items-center justify-between px-5 h-14 z-50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </div>
            <h1 className="text-sm font-bold tracking-wide text-white">
              DHI National Infrastructure Command Center
            </h1>
          </div>

          <div className="relative ml-6 hidden md:block">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search infrastructure..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-72 pl-10 pr-4 py-2 rounded-lg text-sm bg-[#0c1425] border border-[#1a2744] text-slate-300 placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <nav className="hidden lg:flex items-center gap-1 mr-4">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  activeTab === tab
                    ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                    : 'text-slate-500 hover:text-slate-300 border border-transparent'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1.5 text-green-400">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              LIVE
            </span>
          </div>

          <button className="relative p-2 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-[#0f1a2e] transition-colors">
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
          </button>

          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold cursor-pointer ring-2 ring-transparent hover:ring-cyan-500/40 transition-all">
            DL
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <aside className="flex-shrink-0 w-56 glass-panel border-r border-[#1a2744] flex flex-col z-40">
          <div className="px-4 py-4">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600 mb-3">Infrastructure Layers</h2>
            <div className="space-y-1">
              {Object.entries(categoryConfig).map(([key, config]) => {
                const isActive = activeFilters.includes(key)
                const count = infrastructureAssets.filter(a => a.type === key).length
                return (
                  <button
                    key={key}
                    onClick={() => toggleFilter(key)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all group ${
                      isActive
                        ? 'bg-white/[0.04]'
                        : 'opacity-40 hover:opacity-70'
                    }`}
                  >
                    <div className={`flex-shrink-0 transition-transform ${isActive ? 'scale-110' : 'scale-90'}`}>
                      {config.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-medium text-slate-300 block truncate">{config.label}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-600">{count}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-auto px-4 py-4 border-t border-[#1a2744]">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600 mb-3">System Status</h2>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Total Assets</span>
                <span className="text-xs font-mono text-cyan-400">{stats.total}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Operational</span>
                <span className="text-xs font-mono text-green-400">{stats.operational}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Maintenance</span>
                <span className="text-xs font-mono text-amber-400">{stats.maintenance}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Offline</span>
                <span className="text-xs font-mono text-red-400">{stats.offline}</span>
              </div>
              <div className="mt-2">
                <div className="h-1.5 rounded-full bg-[#0c1425] overflow-hidden flex">
                  <div className="bg-green-500 transition-all" style={{ width: `${(stats.operational / Math.max(stats.total, 1)) * 100}%` }} />
                  <div className="bg-amber-500 transition-all" style={{ width: `${(stats.maintenance / Math.max(stats.total, 1)) * 100}%` }} />
                  <div className="bg-red-500 transition-all" style={{ width: `${(stats.offline / Math.max(stats.total, 1)) * 100}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="px-4 py-4 border-t border-[#1a2744]">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600 mb-3">Legend</h2>
            <div className="space-y-1.5">
              {Object.entries(categoryConfig).map(([key, config]) => (
                <div key={key} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-sm" style={{ background: config.color }} />
                  <span className="text-[10px] text-slate-500">{config.label}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Map Area */}
        <main className="flex-1 relative">
          <NetworkMap
            onAssetClick={handleAssetClick}
            selectedAsset={selectedAsset}
            activeFilters={activeFilters}
          />

          {/* Bottom Stats Overlay */}
          <div className="absolute bottom-4 left-4 z-[1000] flex items-center gap-3">
            <div className="glass-panel rounded-lg px-3 py-2 flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-400" />
                <span className="text-[10px] text-slate-400">{stats.operational} Active</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="text-[10px] text-slate-400">{stats.maintenance} Maintenance</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-400" />
                <span className="text-[10px] text-slate-400">{stats.offline} Offline</span>
              </div>
            </div>
          </div>

          {/* Top-right quick actions */}
          <div className="absolute top-4 right-4 z-[1000] flex items-center gap-2">
            <button
              onClick={() => setActiveFilters(allTypes)}
              className="glass-panel rounded-lg px-3 py-1.5 text-[10px] font-medium text-slate-400 hover:text-cyan-400 transition-colors"
            >
              Show All
            </button>
            <button
              onClick={() => setActiveFilters([])}
              className="glass-panel rounded-lg px-3 py-1.5 text-[10px] font-medium text-slate-400 hover:text-red-400 transition-colors"
            >
              Hide All
            </button>
          </div>
        </main>

        {/* Right Detail Panel */}
        <aside className={`flex-shrink-0 glass-panel border-l border-[#1a2744] transition-all duration-300 overflow-y-auto overflow-x-hidden z-40 ${
          detailOpen && selectedAsset ? 'w-80' : 'w-0'
        }`}>
          {selectedAsset && detailOpen && (
            <div className="w-80 animate-fade-in-up">
              <div className="px-5 py-4 border-b border-[#1a2744] flex items-start justify-between">
                <div className="flex-1 min-w-0 pr-2">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full" style={{ background: categoryConfig[selectedAsset.type]?.color }} />
                    <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: categoryConfig[selectedAsset.type]?.color }}>
                      {selectedAsset.type}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white leading-tight">{selectedAsset.name}</h3>
                </div>
                <button
                  onClick={() => setDetailOpen(false)}
                  className="p-1 rounded-md text-slate-600 hover:text-slate-300 hover:bg-[#1a2744] transition-colors flex-shrink-0"
                >
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <div className="px-5 py-4 space-y-4">
                {/* Status badge */}
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500">Status</span>
                  <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
                    selectedAsset.status === 'operational' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                    selectedAsset.status === 'maintenance' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                    'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      selectedAsset.status === 'operational' ? 'bg-green-400' :
                      selectedAsset.status === 'maintenance' ? 'bg-amber-400' : 'bg-red-400'
                    }`} />
                    {selectedAsset.status.charAt(0).toUpperCase() + selectedAsset.status.slice(1)}
                  </span>
                </div>

                {/* Key metrics */}
                {(selectedAsset.capacity || selectedAsset.output) && (
                  <div className="grid grid-cols-2 gap-3">
                    {selectedAsset.capacity && (
                      <div className="rounded-lg bg-[#0c1425] border border-[#1a2744] p-3">
                        <span className="text-[10px] text-slate-600 uppercase tracking-wider block mb-1">Capacity</span>
                        <span className="text-sm font-bold text-white">{selectedAsset.capacity}</span>
                      </div>
                    )}
                    {selectedAsset.output && (
                      <div className="rounded-lg bg-[#0c1425] border border-[#1a2744] p-3">
                        <span className="text-[10px] text-slate-600 uppercase tracking-wider block mb-1">Output</span>
                        <span className="text-sm font-bold text-white">{selectedAsset.output}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Detail properties */}
                {selectedAsset.details && (
                  <div className="rounded-lg bg-[#0c1425] border border-[#1a2744] overflow-hidden">
                    <div className="px-3 py-2 border-b border-[#1a2744]">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Properties</span>
                    </div>
                    <div className="divide-y divide-[#1a2744]">
                      {Object.entries(selectedAsset.details).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between px-3 py-2">
                          <span className="text-xs text-slate-500">{key}</span>
                          <span className="text-xs font-medium text-slate-300">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Hydropower charts */}
                {selectedAsset.type === 'hydropower' && (
                  <>
                    <div className="rounded-lg bg-[#0c1425] border border-[#1a2744] p-4">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-3 block">Generation Output</span>
                      <div className="flex items-end gap-1 h-16">
                        {[65, 78, 92, 88, 95, 82, 70, 85, 90, 96, 88, 75].map((v, i) => (
                          <div key={i} className="flex-1 rounded-t" style={{
                            height: `${v}%`,
                            background: `linear-gradient(to top, rgba(0,229,255,0.1), rgba(0,229,255,${v/100 * 0.6}))`,
                            boxShadow: v > 90 ? '0 0 8px rgba(0,229,255,0.3)' : 'none',
                          }} />
                        ))}
                      </div>
                      <div className="flex justify-between mt-2">
                        <span className="text-[9px] text-slate-600">Jan</span>
                        <span className="text-[9px] text-slate-600">Dec</span>
                      </div>
                    </div>

                    <div className="rounded-lg bg-[#0c1425] border border-[#1a2744] p-4">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-3 block">Power Distribution</span>
                      <div className="space-y-2">
                        {[
                          { label: 'Domestic', value: 340, color: '#00e5ff' },
                          { label: 'Export (India)', value: 510, color: '#d500f9' },
                          { label: 'Industrial', value: 180, color: '#ffab00' },
                        ].map((item) => (
                          <div key={item.label}>
                            <div className="flex justify-between text-[10px] mb-1">
                              <span className="text-slate-500">{item.label}</span>
                              <span className="text-slate-400">{item.value} GWh</span>
                            </div>
                            <div className="h-1.5 rounded-full bg-[#1a2744]">
                              <div
                                className="h-full rounded-full transition-all"
                                style={{
                                  width: `${(item.value / 510) * 100}%`,
                                  background: item.color,
                                  boxShadow: `0 0 8px ${item.color}40`,
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Telecom charts */}
                {selectedAsset.type === 'telecom' && (
                  <div className="rounded-lg bg-[#0c1425] border border-[#1a2744] p-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-3 block">Network Load (24h)</span>
                    <div className="flex items-end gap-0.5 h-12">
                      {[30, 25, 20, 18, 15, 20, 35, 60, 85, 90, 88, 80, 75, 70, 72, 78, 85, 92, 95, 88, 70, 55, 45, 35].map((v, i) => (
                        <div key={i} className="flex-1 rounded-t" style={{
                          height: `${v}%`,
                          background: v > 85 ? '#ff1744' : v > 70 ? '#ffab00' : '#00e676',
                          opacity: 0.7,
                        }} />
                      ))}
                    </div>
                    <div className="flex justify-between mt-2">
                      <span className="text-[9px] text-slate-600">00:00</span>
                      <span className="text-[9px] text-slate-600">23:00</span>
                    </div>
                  </div>
                )}

                {/* Coordinates */}
                <div className="flex items-center gap-2 text-[10px] text-slate-600 pt-2 border-t border-[#1a2744]">
                  <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" /><circle cx="12" cy="9" r="2.5" /></svg>
                  <span>{selectedAsset.position[0].toFixed(4)}°N, {selectedAsset.position[1].toFixed(4)}°E</span>
                </div>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}
