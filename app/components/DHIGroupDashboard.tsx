'use client'

import { useState, useMemo, useRef } from 'react'
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Area
} from 'recharts'
import {
  dhiCompanies, groupSummary, sectorBreakdown, groupQuarterlyRevenue,
  topPerformers, type DHICompany
} from '../data/dhi-group-data'
import Image from 'next/image'

const companyLogos: Record<string, string> = {
  bt: '/images/logos/Bhutan Telecom.webp',
  drukair: '/images/logos/Drukair.webp',
  dgpc: '/images/logos/Druk Green power Corporation.webp',
  bpc: '/images/logos/Bhutan Power Corporation.webp',
  nrdc: '/images/logos/NRDCL.webp',
  smc: '/images/logos/state mining corporation limited.webp',
  cdcl: '/images/logos/CDCL.webp',
  ttp: '/images/logos/thimphu tech park.webp',
  stcb: '/images/logos/STCBL.webp',
  dpl: '/images/logos/Dungsam polymers Limited.webp',
  abhl: '/images/logos/Azista Bhutan Healthcare.webp',
  kil: '/images/logos/Koufuku.webp',
  bbpl: '/images/logos/BPL.webp',
  dcl: '/images/logos/dungsam cement.webp',
}

const COLORS = ['#00e5ff', '#00e676', '#ffab00', '#ff1744', '#d500f9', '#ffd600', '#448aff', '#e040fb', '#ff6d00', '#7c4dff']

function formatNu(val: number) {
  if (val >= 1000) return `${(val / 1000).toFixed(1)}B`
  return `${val}M`
}

export default function DHIGroupDashboard() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCompany, setSelectedCompany] = useState<DHICompany | null>(null)
  const carouselRef = useRef<HTMLDivElement>(null)

  const filteredCompanies = useMemo(() => {
    if (!searchQuery.trim()) return dhiCompanies
    const q = searchQuery.toLowerCase()
    return dhiCompanies.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.shortName.toLowerCase().includes(q) ||
      c.sector.toLowerCase().includes(q)
    )
  }, [searchQuery])

  const scroll = (dir: 'left' | 'right') => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: dir === 'left' ? -320 : 320, behavior: 'smooth' })
    }
  }

  // ---- render group overview ----
  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header with group KPIs */}
      <div className="flex-shrink-0 px-6 pt-4 pb-3 border-b border-[#1a2744]">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-lg font-bold text-white">DHI Group Overview</h2>
            <p className="text-[11px] text-slate-300">Druk Holding &amp; Investments — Commercial Arm of the Royal Government of Bhutan</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-600 uppercase tracking-widest">FY 2024</span>
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-6 gap-3 mb-3">
          {[
            { label: 'Companies', value: groupSummary.totalCompanies, suffix: '', color: '#00e5ff' },
            { label: 'Total Revenue', value: formatNu(groupSummary.totalRevenue), suffix: ' Nu.', color: '#00e676' },
            { label: 'Net Profit', value: formatNu(groupSummary.totalProfit), suffix: ' Nu.', color: '#ffab00' },
            { label: 'Total Assets', value: formatNu(groupSummary.totalAssets), suffix: ' Nu.', color: '#448aff' },
            { label: 'Employees', value: groupSummary.totalEmployees.toLocaleString(), suffix: '', color: '#e040fb' },
            { label: 'Profitable', value: `${groupSummary.profitableCount}/${groupSummary.totalCompanies}`, suffix: '', color: '#00e676' },
          ].map((kpi, i) => (
            <div key={i} className="rounded-lg bg-[#0c1425] border border-[#1a2744] p-3">
              <span className="text-[10px] text-slate-600 uppercase tracking-wider block mb-1">{kpi.label}</span>
              <span className="text-lg font-bold" style={{ color: kpi.color }}>{kpi.value}<span className="text-xs text-slate-300">{kpi.suffix}</span></span>
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left side: Charts + Carousel */}
        <div className={`overflow-y-auto p-6 space-y-6 transition-all ${selectedCompany ? 'w-[60%]' : 'w-full'}`}>

          {/* Search + Carousel */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Subsidiaries</h3>
              <div className="flex-1" />
              {/* Search */}
              <div className="relative">
                <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search companies..."
                  className="w-52 pl-8 pr-3 py-1.5 rounded-lg bg-[#0c1425] border border-[#1a2744] text-xs text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/40"
                />
              </div>
              {/* Carousel nav */}
              <button onClick={() => scroll('left')} className="p-1.5 rounded-md bg-[#0c1425] border border-[#1a2744] text-slate-300 hover:text-white transition-colors">
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
              </button>
              <button onClick={() => scroll('right')} className="p-1.5 rounded-md bg-[#0c1425] border border-[#1a2744] text-slate-300 hover:text-white transition-colors">
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
              </button>
            </div>

            {/* Company Carousel */}
            <div
              ref={carouselRef}
              className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin"
              style={{ scrollbarWidth: 'thin', scrollbarColor: '#1a2744 transparent' }}
            >
              {filteredCompanies.map(company => (
                <button
                  key={company.id}
                  onClick={() => {
                    setSelectedCompany(prev => prev?.id === company.id ? null : company)
                  }}
                  className={`flex-shrink-0 w-56 rounded-lg border p-3 text-left transition-all hover:border-slate-500 ${
                    selectedCompany?.id === company.id
                      ? 'bg-[#0c1425] border-cyan-500/40 shadow-lg shadow-cyan-500/5'
                      : 'bg-[#0a0f1e] border-[#1a2744]'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {companyLogos[company.id] ? (
                      <div className="w-6 h-6 rounded overflow-hidden flex items-center justify-center flex-shrink-0 bg-white p-0.5">
                        <Image src={companyLogos[company.id]} alt={company.shortName} width={20} height={20} className="object-contain w-full h-full" />
                      </div>
                    ) : (
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: company.sectorColor }} />
                    )}
                    <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: company.sectorColor }}>
                      {company.sector}
                    </span>
                    <span className={`ml-auto text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full ${
                      ['bt', 'drukair'].includes(company.id)
                        ? 'bg-green-500/15 text-green-400'
                        : 'bg-slate-700/40 text-slate-600'
                    }`}>
                      {['bt', 'drukair'].includes(company.id) ? 'Live' : 'Est.'}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white leading-tight mb-1 truncate">{company.shortName}</h4>
                  <p className="text-[10px] text-slate-300 truncate mb-2">{company.name}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-600 block">Revenue</span>
                      <span className="text-xs font-bold text-white">Nu. {formatNu(company.annualRevenue)}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-600 block">Profit</span>
                      <span className={`text-xs font-bold ${company.netProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {company.netProfit >= 0 ? '+' : ''}{formatNu(company.netProfit)}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 h-1 rounded-full bg-[#1a2744] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${Math.min(100, (company.annualRevenue / (dhiCompanies[0]?.annualRevenue || 1)) * 100)}%`,
                        background: company.sectorColor,
                        opacity: 0.6,
                      }}
                    />
                  </div>
                </button>
              ))}
              {filteredCompanies.length === 0 && (
                <div className="w-full py-8 text-center text-sm text-slate-600">No companies match &quot;{searchQuery}&quot;</div>
              )}
            </div>
          </div>

          {/* Charts Row 1: Revenue by Sector + Quarterly Trend */}
          <div className="grid grid-cols-2 gap-6">
            {/* Revenue by Sector - Pie */}
            <ChartCard title="Revenue by Sector">
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={sectorBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={95}
                    paddingAngle={3}
                    dataKey="revenue"
                    nameKey="name"
                  >
                    {sectorBreakdown.map((entry, i) => (
                      <Cell key={i} fill={entry.color} fillOpacity={0.8} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.[0]) return null
                      const d = payload[0].payload
                      return (
                        <div className="recharts-custom-tooltip">
                          <p className="text-xs font-bold text-white mb-1">{d.name}</p>
                          <p className="text-[11px] text-slate-300">Revenue: Nu. {formatNu(d.revenue)}</p>
                          <p className="text-[11px] text-slate-300">Companies: {d.companies}</p>
                        </div>
                      )
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-x-4 gap-y-1 px-4 pb-3">
                {sectorBreakdown.map((s, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                    <span className="text-[10px] text-slate-300">{s.name}</span>
                  </div>
                ))}
              </div>
            </ChartCard>

            {/* Quarterly Revenue + Profit Trend */}
            <ChartCard title="Quarterly Group Performance">
              <ResponsiveContainer width="100%" height={280}>
                <ComposedChart data={groupQuarterlyRevenue} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a2744" />
                  <XAxis dataKey="quarter" tick={{ fill: '#475569', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#475569', fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ background: '#0c1425', border: '1px solid #1a2744', borderRadius: 8, fontSize: 12 }}
                    labelStyle={{ color: '#94a3b8' }}
                    formatter={(value: any) => [`Nu. ${formatNu(value)}`, '']}
                  />
                  <Area type="monotone" dataKey="revenue" fill="#00e5ff" fillOpacity={0.1} stroke="#00e5ff" strokeWidth={2} name="Revenue" />
                  <Bar dataKey="profit" fill="#00e676" fillOpacity={0.6} radius={[4, 4, 0, 0]} name="Profit" />
                </ComposedChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          {/* Charts Row 2: Top Performers + Employees by Sector */}
          <div className="grid grid-cols-2 gap-6">
            {/* Top 5 by Revenue */}
            <ChartCard title="Top 5 Companies by Revenue">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={topPerformers} layout="vertical" margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a2744" horizontal={false} />
                  <XAxis type="number" tick={{ fill: '#475569', fontSize: 11 }} />
                  <YAxis
                    type="category"
                    dataKey="shortName"
                    tick={{ fill: '#94a3b8', fontSize: 11 }}
                    width={60}
                  />
                  <Tooltip
                    contentStyle={{ background: '#0c1425', border: '1px solid #1a2744', borderRadius: 8, fontSize: 12 }}
                    formatter={(value: any) => [`Nu. ${formatNu(value)}`, 'Revenue']}
                  />
                  <Bar dataKey="annualRevenue" radius={[0, 4, 4, 0]} name="Revenue">
                    {topPerformers.map((entry, i) => (
                      <Cell key={i} fill={entry.sectorColor} fillOpacity={0.7} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Employees by Sector */}
            <ChartCard title="Workforce Distribution by Sector">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={sectorBreakdown} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a2744" />
                  <XAxis dataKey="name" tick={{ fill: '#475569', fontSize: 10 }} />
                  <YAxis tick={{ fill: '#475569', fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ background: '#0c1425', border: '1px solid #1a2744', borderRadius: 8, fontSize: 12 }}
                    formatter={(value: any) => [value.toLocaleString(), 'Employees']}
                  />
                  <Bar dataKey="employees" radius={[4, 4, 0, 0]}>
                    {sectorBreakdown.map((entry, i) => (
                      <Cell key={i} fill={entry.color} fillOpacity={0.7} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          {/* Profitability Table */}
          <ChartCard title="All Companies — Financial Overview">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-[#1a2744]">
                    <th className="text-left px-3 py-2.5 text-slate-500 font-medium">Company</th>
                    <th className="text-left px-3 py-2.5 text-slate-500 font-medium">Sector</th>
                    <th className="text-right px-3 py-2.5 text-slate-500 font-medium">Revenue</th>
                    <th className="text-right px-3 py-2.5 text-slate-500 font-medium">Profit</th>
                    <th className="text-right px-3 py-2.5 text-slate-500 font-medium">Margin</th>
                    <th className="text-right px-3 py-2.5 text-slate-500 font-medium">Employees</th>
                    <th className="text-right px-3 py-2.5 text-slate-500 font-medium">DHI Stake</th>
                  </tr>
                </thead>
                <tbody>
                  {[...dhiCompanies].sort((a, b) => b.annualRevenue - a.annualRevenue).map(c => (
                    <tr
                      key={c.id}
                      onClick={() => setSelectedCompany(prev => prev?.id === c.id ? null : c)}
                      className="border-b border-[#1a2744]/50 hover:bg-white/[0.02] cursor-pointer transition-colors"
                    >
                      <td className="px-3 py-2.5 text-white font-medium">{c.shortName}</td>
                      <td className="px-3 py-2.5">
                        <span className="inline-flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full" style={{ background: c.sectorColor }} />
                          <span className="text-slate-300">{c.sector}</span>
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-right text-slate-300 font-mono">Nu. {formatNu(c.annualRevenue)}</td>
                      <td className={`px-3 py-2.5 text-right font-mono ${c.netProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {c.netProfit >= 0 ? '+' : ''}{formatNu(c.netProfit)}
                      </td>
                      <td className={`px-3 py-2.5 text-right font-mono ${c.netProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {((c.netProfit / c.annualRevenue) * 100).toFixed(1)}%
                      </td>
                      <td className="px-3 py-2.5 text-right text-slate-300 font-mono">{c.employees.toLocaleString()}</td>
                      <td className="px-3 py-2.5 text-right text-slate-300 font-mono">{c.ownership}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ChartCard>
        </div>

        {/* Right: Company Detail Panel */}
        <div className={`flex-shrink-0 border-l border-[#1a2744] overflow-y-auto transition-all duration-300 ${
          selectedCompany ? 'w-[40%]' : 'w-0'
        }`}>
          {selectedCompany && (
            <div className="animate-fade-in-up">
              {/* Header */}
              <div className="px-5 py-4 border-b border-[#1a2744] flex items-start justify-between">
                <div className="flex-1 min-w-0 pr-2">
                  <div className="flex items-center gap-2 mb-1">
                    {companyLogos[selectedCompany.id] ? (
                      <div className="w-6 h-6 rounded overflow-hidden flex items-center justify-center flex-shrink-0 bg-white p-0.5">
                        <Image src={companyLogos[selectedCompany.id]} alt={selectedCompany.shortName} width={20} height={20} className="object-contain w-full h-full" />
                      </div>
                    ) : (
                      <div className="w-2 h-2 rounded-full" style={{ background: selectedCompany.sectorColor }} />
                    )}
                    <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: selectedCompany.sectorColor }}>
                      {selectedCompany.sector}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white leading-tight">{selectedCompany.name}</h3>
                  <p className="text-[11px] text-slate-300 mt-1">{selectedCompany.description}</p>
                </div>
                <button
                  onClick={() => setSelectedCompany(null)}
                  className="p-1 rounded-md text-slate-300 hover:text-slate-300 hover:bg-[#1a2744] transition-colors flex-shrink-0"
                >
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              {/* Status + Establishment */}
              <div className="px-5 py-3 flex items-center gap-3 border-b border-[#1a2744]/50">
                <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
                  selectedCompany.status === 'profitable' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                  selectedCompany.status === 'loss' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                  'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    selectedCompany.status === 'profitable' ? 'bg-green-400' :
                    selectedCompany.status === 'loss' ? 'bg-red-400' : 'bg-amber-400'
                  }`} />
                  {selectedCompany.status.charAt(0).toUpperCase() + selectedCompany.status.slice(1)}
                </span>
                <span className="text-xs text-slate-300">Est. {selectedCompany.established}</span>
                <span className="text-xs text-slate-300 ml-auto">DHI: {selectedCompany.ownership}%</span>
                {!['bt', 'drukair'].includes(selectedCompany.id) && (
                  <span className="text-[9px] text-slate-600 bg-slate-800/60 border border-slate-700/40 px-1.5 py-0.5 rounded-full">
                    Estimated data
                  </span>
                )}
              </div>

              {/* Financial metrics */}
              <div className="px-5 py-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Annual Revenue', value: `Nu. ${formatNu(selectedCompany.annualRevenue)}`, color: '#00e5ff' },
                    { label: 'Net Profit', value: `${selectedCompany.netProfit >= 0 ? '+' : ''}Nu. ${formatNu(selectedCompany.netProfit)}`, color: selectedCompany.netProfit >= 0 ? '#00e676' : '#ff1744' },
                    { label: 'Total Assets', value: `Nu. ${formatNu(selectedCompany.totalAssets)}`, color: '#448aff' },
                    { label: 'Employees', value: selectedCompany.employees.toLocaleString(), color: '#e040fb' },
                  ].map((m, i) => (
                    <div key={i} className="rounded-lg bg-[#0c1425] border border-[#1a2744] p-3">
                      <span className="text-[10px] text-slate-600 uppercase tracking-wider block mb-1">{m.label}</span>
                      <span className="text-sm font-bold" style={{ color: m.color }}>{m.value}</span>
                    </div>
                  ))}
                </div>

                {/* Profit Margin */}
                <div className="rounded-lg bg-[#0c1425] border border-[#1a2744] p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] text-slate-600 uppercase tracking-wider">Profit Margin</span>
                    <span className={`text-sm font-bold ${selectedCompany.netProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {((selectedCompany.netProfit / selectedCompany.annualRevenue) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-[#1a2744] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${Math.min(100, Math.max(0, (selectedCompany.netProfit / selectedCompany.annualRevenue) * 100))}%`,
                        background: selectedCompany.netProfit >= 0 ? '#00e676' : '#ff1744',
                      }}
                    />
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="rounded-lg bg-[#0c1425] border border-[#1a2744] overflow-hidden">
                  <div className="px-3 py-2 border-b border-[#1a2744]">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Key Metrics</span>
                  </div>
                  <div className="divide-y divide-[#1a2744]">
                    {Object.entries(selectedCompany.keyMetrics).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between px-3 py-2">
                        <span className="text-xs text-slate-300">{key}</span>
                        <span className="text-xs font-medium text-slate-300">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quarterly Revenue Chart */}
                <div className="rounded-lg bg-[#0c1425] border border-[#1a2744] p-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600 block mb-3">Quarterly Performance</span>
                  <ResponsiveContainer width="100%" height={180}>
                    <LineChart data={selectedCompany.quarterlyRevenue} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1a2744" />
                      <XAxis dataKey="quarter" tick={{ fill: '#475569', fontSize: 10 }} />
                      <YAxis tick={{ fill: '#475569', fontSize: 10 }} />
                      <Tooltip
                        contentStyle={{ background: '#0c1425', border: '1px solid #1a2744', borderRadius: 8, fontSize: 11 }}
                        formatter={(value: any) => [`Nu. ${value}M`, '']}
                      />
                      <Line type="monotone" dataKey="revenue" stroke={selectedCompany.sectorColor} strokeWidth={2} dot={{ fill: selectedCompany.sectorColor, r: 3 }} name="Revenue" />
                      <Line type="monotone" dataKey="profit" stroke="#00e676" strokeWidth={2} dot={{ fill: '#00e676', r: 3 }} name="Profit" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* Reusable chart card wrapper */
function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-[#0a0f1e] border border-[#1a2744] overflow-hidden">
      <div className="px-4 py-3 border-b border-[#1a2744] flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">{title}</h3>
      </div>
      {children}
    </div>
  )
}
