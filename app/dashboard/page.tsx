'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import type { InfraAsset } from '../data/infrastructure'
import { infrastructureAssets } from '../data/infrastructure'
import { dhiCompanies } from '../data/dhi-group-data'
import { useAuth } from '../contexts/AuthContext'
import { canAccessCompany } from '../lib/auth'

const NetworkMap = dynamic(() => import('../components/NetworkMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-center">
        <div className="relative w-16 h-16 mx-auto mb-4">
          <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20" />
          <div className="absolute inset-0 rounded-full border-t-2 border-cyan-400 animate-spin" />
          <div className="absolute inset-2 rounded-full border-t-2 border-purple-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
        </div>
        <p className="text-sm text-slate-500 tracking-widest uppercase">Loading Map...</p>
      </div>
    </div>
  ),
})

const DHIGroupDashboard = dynamic(() => import('../components/DHIGroupDashboard'), {
  ssr: false,
  loading: () => <DashboardLoader label="DHI Group" />,
})

const BTDashboard = dynamic(() => import('../components/BTDashboard'), {
  ssr: false,
  loading: () => <DashboardLoader label="Bhutan Telecom" />,
})

const DrukAirDashboard = dynamic(() => import('../components/DrukAirDashboard'), {
  ssr: false,
  loading: () => <DashboardLoader label="Druk Air" />,
})

function DashboardLoader({ label }: { label: string }) {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-center">
        <div className="relative w-12 h-12 mx-auto mb-3">
          <div className="absolute inset-0 rounded-full border-t-2 border-cyan-400 animate-spin" />
        </div>
        <p className="text-sm text-slate-500 tracking-widest uppercase">Loading {label} Data...</p>
      </div>
    </div>
  )
}

const allTypes = ['hydropower', 'telecom', 'airline']

type CompanyView = string

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
    label: 'Telecom',
    color: '#00e676',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00e676" strokeWidth="2" strokeLinecap="round">
        <path d="M12 20V10" /><path d="M6 20v-4" /><path d="M18 20v-8" /><path d="M2 20h20" />
      </svg>
    ),
  },
  airline: {
    label: 'Airports',
    color: '#ffab00',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffab00" strokeWidth="2" strokeLinecap="round">
        <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
      </svg>
    ),
  },
}

export default function Home() {
  const { session, logout } = useAuth()
  const router = useRouter()

  const [activeView, setActiveView] = useState<CompanyView>('map')
  const [selectedAsset, setSelectedAsset] = useState<InfraAsset | null>(null)
  const [activeFilters, setActiveFilters] = useState<string[]>(allTypes)
  const [detailOpen, setDetailOpen] = useState(false)
  const [companySearch, setCompanySearch] = useState('')
  const [carouselPaused, setCarouselPaused] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const [dropdownPos, setDropdownPos] = useState({ top: 60, left: 0 })

  useEffect(() => {
    const update = () => {
      if (searchRef.current) {
        const rect = searchRef.current.getBoundingClientRect()
        setDropdownPos({ top: rect.bottom + 4, left: rect.left })
      }
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const orderedCompanies = useMemo(() => {
    const priority = ['bt', 'drukair']
    const all = [
      ...priority.map(id => dhiCompanies.find(c => c.id === id)!),
      ...dhiCompanies.filter(c => !priority.includes(c.id)),
    ]
    if (!session) return all
    return all.filter(c => canAccessCompany(session, c.id))
  }, [session])

  const searchResults = useMemo(() => {
    if (!companySearch.trim()) return []
    const q = companySearch.toLowerCase()
    return orderedCompanies.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.shortName.toLowerCase().includes(q) ||
      c.sector.toLowerCase().includes(q)
    )
  }, [companySearch, orderedCompanies])

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
      {/* Top Header */}
      <header className="flex-shrink-0 glass-panel flex items-center justify-between px-5 h-14 z-50">
        <div className="flex items-center gap-4">
          {/* Logo & Title */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </div>
            <h1 className="text-sm font-bold tracking-wide text-white">
              DHI Data Lake
            </h1>
          </div>

          {/* Company Selector — Map + DHI Group (fixed) + company carousel */}
          <div className="flex items-center gap-1 ml-4">
            {/* Fixed tabs */}
            <div className="flex items-center gap-1 bg-[#0c1425] rounded-lg p-1 border border-[#1a2744]">
              <button
                onClick={() => setActiveView('map')}
                className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                  activeView === 'map'
                    ? 'bg-cyan-500/15 text-cyan-400 shadow-sm shadow-cyan-500/10'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4z" />
                    <path d="M8 2v16" /><path d="M16 6v16" />
                  </svg>
                  Map
                </span>
              </button>
              <button
                onClick={() => setActiveView('dhi')}
                className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                  activeView === 'dhi'
                    ? 'bg-cyan-500/15 text-cyan-400 shadow-sm shadow-cyan-500/10'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                    <rect x="14" y="14" width="7" height="7" rx="1" />
                  </svg>
                  DHI &amp; Group
                </span>
              </button>
            </div>

            {/* Divider */}
            <div className="w-px h-6 bg-[#1a2744] mx-1" />

            {/* Auto-scrolling company carousel */}
            <div
              className="relative overflow-hidden"
              style={{ maxWidth: '520px', WebkitMaskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)', maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)' }}
              onMouseEnter={() => setCarouselPaused(true)}
              onMouseLeave={() => setCarouselPaused(false)}
            >
              <div
                className="flex items-center gap-1"
                style={{
                  animation: 'marquee 50s linear infinite',
                  animationPlayState: carouselPaused ? 'paused' : 'running',
                  width: 'max-content',
                }}
              >
                {[...orderedCompanies, ...orderedCompanies].map((company, i) => {
                  const isActive = activeView === company.id
                  const hasData = company.id === 'bt' || company.id === 'drukair'
                  return (
                    <button
                      key={`${company.id}-${i}`}
                      onClick={() => setActiveView(company.id)}
                      className={`flex-shrink-0 px-3.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                        isActive ? '' : 'text-slate-500 hover:text-slate-300'
                      }`}
                      style={isActive ? { background: `${company.sectorColor}22`, color: company.sectorColor, boxShadow: `0 0 8px ${company.sectorColor}20` } : {}}
                    >
                      <span className="flex items-center gap-1.5 whitespace-nowrap">
                        <span
                          className="w-4 h-4 rounded flex items-center justify-center text-[8px] font-bold flex-shrink-0"
                          style={{ background: `${company.sectorColor}25`, color: company.sectorColor }}
                        >
                          {company.shortName.charAt(0)}
                        </span>
                        {company.name}
                        {hasData && <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Company search — always visible */}
          <div ref={searchRef} className="relative ml-2 hidden md:block">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search company..."
              value={companySearch}
              onChange={(e) => setCompanySearch(e.target.value)}
              className="w-52 pl-10 pr-4 py-2 rounded-lg text-sm bg-[#0c1425] border border-[#1a2744] text-slate-300 placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          {session?.role === 'super_admin' && (
            <button
              onClick={() => router.push('/admin')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium text-slate-400 hover:text-cyan-400 border border-[#1a2744] hover:border-cyan-500/30 transition-all"
            >
              <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              Users
            </button>
          )}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
              {session?.username?.slice(0, 2).toUpperCase() ?? 'DL'}
            </div>
            <span className="hidden md:block text-xs text-slate-400 max-w-[100px] truncate">{session?.username}</span>
          </div>
          <button
            onClick={logout}
            title="Sign out"
            className="p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </header>

      {/* Search dropdown — outside header to escape backdrop-filter stacking context */}
      {companySearch.trim() && searchResults.length > 0 && (
        <div
          className="fixed rounded-xl border border-[#1a2744] z-[99999] overflow-hidden shadow-2xl"
          style={{ background: '#0c1425', top: dropdownPos.top, left: dropdownPos.left, width: 288 }}
        >
          {searchResults.map(company => (
            <button
              key={company.id}
              onClick={() => { setActiveView(company.id); setCompanySearch('') }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-white/5 transition-colors"
            >
              <span
                className="w-6 h-6 rounded flex-shrink-0 flex items-center justify-center text-[9px] font-bold"
                style={{ background: `${company.sectorColor}20`, color: company.sectorColor }}
              >
                {company.shortName.charAt(0)}
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-slate-200 truncate">{company.name}</div>
                <div className="text-[10px] text-slate-600">{company.sector}</div>
              </div>
              {(company.id === 'bt' || company.id === 'drukair') && (
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* ===== MAP VIEW ===== */}
        {activeView === 'map' && (
          <>
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
                          isActive ? 'bg-white/[0.04]' : 'opacity-40 hover:opacity-70'
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

              {/* AI Assistant Placeholder */}
              <div className="mt-auto border-t border-[#1a2744] p-4">
                <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600 mb-3">AI Assistant</h2>
                <div className="rounded-lg border border-dashed border-[#1a2744] p-3 flex flex-col items-center gap-2 opacity-60 hover:opacity-80 transition-opacity cursor-not-allowed">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    <path d="M8 10h8M8 14h5" />
                  </svg>
                  <p className="text-[10px] text-slate-600 text-center leading-tight">AI Chat<br/><span className="text-slate-700">Coming Soon</span></p>
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

              {/* Quick actions */}
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

                    {/* Coordinates */}
                    <div className="flex items-center gap-2 text-[10px] text-slate-600 pt-2 border-t border-[#1a2744]">
                      <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" /><circle cx="12" cy="9" r="2.5" /></svg>
                      <span>{selectedAsset.position[0].toFixed(4)}°N, {selectedAsset.position[1].toFixed(4)}°E</span>
                    </div>
                  </div>
                </div>
              )}
            </aside>
          </>
        )}

        {/* ===== DHI GROUP VIEW ===== */}
        {activeView === 'dhi' && <DHIGroupDashboard />}

        {/* ===== BT DASHBOARD ===== */}
        {activeView === 'bt' && <BTDashboard />}

        {/* ===== DRUK AIR DASHBOARD ===== */}
        {activeView === 'drukair' && <DrukAirDashboard />}

        {/* ===== COMPANY - NO DATA YET ===== */}
        {activeView !== 'map' && activeView !== 'dhi' && activeView !== 'bt' && activeView !== 'drukair' && (() => {
          const company = dhiCompanies.find(c => c.id === activeView)
          if (!company) return null
          return (
            <div className="flex-1 flex items-center justify-center overflow-hidden">
              <div className="text-center max-w-md px-6">
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold"
                  style={{ background: `linear-gradient(135deg, ${company.sectorColor}33, ${company.sectorColor}11)`, border: `1px solid ${company.sectorColor}30` }}
                >
                  {company.shortName.slice(0, 2)}
                </div>
                <h2 className="text-xl font-bold text-white mb-1">{company.name}</h2>
                <p className="text-sm text-slate-500 mb-2">{company.sector}</p>
                <div
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium mb-6"
                  style={{ background: `${company.sectorColor}15`, color: company.sectorColor }}
                >
                  {company.status}
                </div>
                <div className="glass-panel rounded-xl p-6 border border-[#1a2744] text-left mb-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                      <svg width="16" height="16" fill="none" stroke="#ffab00" viewBox="0 0 24 24" strokeWidth="2">
                        <path d="M12 2a4 4 0 0 1 4 4v1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1V6a4 4 0 0 1 4-4z" />
                        <path d="M12 14v3" /><circle cx="12" cy="12" r="1" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Data Not Yet Available</p>
                      <p className="text-[10px] text-slate-500">Pending data lake integration</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{company.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-3 text-left">
                  <div className="glass-panel rounded-lg p-3 border border-[#1a2744]">
                    <p className="text-[10px] text-slate-600 uppercase tracking-wider mb-1">Established</p>
                    <p className="text-sm font-mono text-slate-300">{company.established}</p>
                  </div>
                  <div className="glass-panel rounded-lg p-3 border border-[#1a2744]">
                    <p className="text-[10px] text-slate-600 uppercase tracking-wider mb-1">DHI Ownership</p>
                    <p className="text-sm font-mono text-slate-300">{company.ownership}%</p>
                  </div>
                  <div className="glass-panel rounded-lg p-3 border border-[#1a2744]">
                    <p className="text-[10px] text-slate-600 uppercase tracking-wider mb-1">Employees</p>
                    <p className="text-sm font-mono text-slate-300">{company.employees.toLocaleString()}</p>
                  </div>
                  <div className="glass-panel rounded-lg p-3 border border-[#1a2744]">
                    <p className="text-[10px] text-slate-600 uppercase tracking-wider mb-1">Revenue (Est.)</p>
                    <p className="text-sm font-mono" style={{ color: company.sectorColor }}>Nu. {company.annualRevenue}M</p>
                  </div>
                </div>
              </div>
            </div>
          )
        })()}
      </div>
    </div>
  )
}
