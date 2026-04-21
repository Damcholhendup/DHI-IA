'use client'

import { useState, useEffect } from 'react'
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart,
} from 'recharts'
import {
  fetchBTRevenueVoice, fetchBTRevenueData, fetchBTRevenueSMS,
  fetchBTCellTowerKPI, fetchBTComplaints, fetchBTTowerDetails,
  fetchBTDataTraffic, fetchBTVoiceTraffic, fetchBTCDRVoice, fetchBTCDRData,
  fetchBTPostpaidTariff, fetchBTPrepaidTariff,
  fetchBTCDRPostpaidData, fetchBTCDRPostpaidSMS,
  fetchBTCellDataTraffic, fetchBTKPIReport,
  fetchBTPostpaidBooster, fetchBTPostpaidSMSTariff, fetchBTPostpaidVoiceTariff,
  fetchBTPrepaidAirFibre, fetchBTPrepaidVoiceSMS,
  combinedRevenue, groupBy, aggregateCDRVoice, aggregateCDRData,
  aggregateCDRPostpaidData, aggregateCDRSMS, sortCellDataTraffic, towersByRegion,
  fmtBTN, KPI_MONTHS, KPI_LABELS,
  type BTCellTowerKPI, type BTComplaint, type BTCellTowerDetail,
  type BTDataTraffic, type BTVoiceTraffic, type BTPostpaidTariff, type BTPrepaidTariff,
  type BTCellDataTraffic, type BTKPIReport,
  type BTPostpaidBooster, type BTPostpaidSMSTariff, type BTPostpaidVoiceTariff,
  type BTPrepaidAirFibre, type BTPrepaidVoiceSMS,
} from '../lib/bt-api'

const COLORS = ['#00e5ff', '#00e676', '#ffab00', '#ff1744', '#d500f9', '#ffd600', '#00bfa5', '#ff6e40']
const subtabs = ['Revenue', 'Network', 'Subscribers', 'Complaints', 'Coverage', 'Tariffs']

const tabDescriptions: Record<string, string> = {
  'Revenue':     'Monthly voice, data and SMS revenue streams — combined earnings trend across all service categories. Nu. = Ngultrum, Bhutan\'s national currency. Figures are shown in millions (M).',
  'Network':     'Cell tower KPI (Key Performance Indicator) metrics — availability, drop rate and throughput by technology generation. PS = Packet-Switched (mobile data). DL = Downlink (download). KPI benchmarks are regulatory targets set by BICMA.',
  'Subscribers': 'CDR (Call Detail Record) analytics — a sampled log of individual voice calls, SMS messages and data sessions from BT\'s subscriber base. Prepaid and postpaid breakdowns shown separately.',
  'Complaints':  'Customer complaint analytics — breakdown by district (Dzongkhag), complaint type, service category and ticket status. "Caller Withdrew" = customer called back to cancel their own ticket. "Escalated" = referred to a specialist team.',
  'Coverage':    'Cell tower deployment by region — site inventory with 2G (GSM), 3G (UMTS), 4G (LTE) and 5G (NR) technology bands per site.',
  'Tariffs':     'Active postpaid monthly plans and prepaid data packs — current pricing and data quota reference from the BT API.',
}

const tipStyle = { background: '#0f1a2e', border: '1px solid #1a2744', borderRadius: 8, color: '#e8edf5' }
const G = '#00e676'

export default function BTDashboard() {
  const [activeSubTab, setActiveSubTab] = useState('Revenue')
  const [detailPanel, setDetailPanel] = useState<{ title: string; data: Array<Record<string, string | number>> } | null>(null)

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Sub-tab navigation */}
      <div className="flex-shrink-0 px-6 pt-4 pb-2 border-b border-[#1a2744]">
        <div className="flex items-center gap-1 overflow-x-auto pb-1">
          {subtabs.map(tab => (
            <button
              key={tab}
              onClick={() => { setActiveSubTab(tab); setDetailPanel(null) }}
              className={`px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                activeSubTab === tab
                  ? 'bg-green-500/15 text-green-400 border border-green-500/30'
                  : 'text-slate-500 hover:text-slate-300 border border-transparent hover:bg-white/[0.02]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        {tabDescriptions[activeSubTab] && (
          <p className="text-[11px] text-slate-500 mt-2 pl-0.5 leading-relaxed">{tabDescriptions[activeSubTab]}</p>
        )}
      </div>

      {/* Content — split layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: charts */}
        <div className={`overflow-y-auto p-6 space-y-6 transition-all ${detailPanel ? 'w-1/2' : 'w-full'}`}>
          {activeSubTab === 'Revenue'     && <RevenueView onDetail={setDetailPanel} />}
          {activeSubTab === 'Network'     && <NetworkView onDetail={setDetailPanel} />}
          {activeSubTab === 'Subscribers' && <SubscribersView onDetail={setDetailPanel} />}
          {activeSubTab === 'Complaints'  && <ComplaintsView onDetail={setDetailPanel} />}
          {activeSubTab === 'Coverage'    && <CoverageView onDetail={setDetailPanel} />}
          {activeSubTab === 'Tariffs'     && <TariffsView onDetail={setDetailPanel} />}
        </div>

        {/* Right: detail panel */}
        {detailPanel && (
          <div className="w-1/2 border-l border-[#1a2744] overflow-y-auto p-5 animate-fade-in-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-green-400">{detailPanel.title}</h3>
              <button onClick={() => setDetailPanel(null)} className="p-1 rounded-md text-slate-600 hover:text-slate-300 hover:bg-[#1a2744] transition-colors">
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="rounded-xl bg-[#0c1425] border border-[#1a2744] overflow-hidden">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-[#1a2744]">
                    {Object.keys(detailPanel.data[0] || {}).map(key => (
                      <th key={key} className="text-left py-2.5 px-3 text-slate-500 font-medium">{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {detailPanel.data.map((row, i) => (
                    <tr key={i} className="border-b border-[#1a2744]/50 hover:bg-white/[0.02] transition-colors">
                      {Object.values(row).map((val, j) => (
                        <td key={j} className={`py-2 px-3 ${j === 0 ? 'text-slate-300 font-medium' : 'text-slate-400 font-mono'}`}>
                          {typeof val === 'number' ? val.toLocaleString() : val}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

type DetailSetter = (d: { title: string; data: Array<Record<string, string | number>> } | null) => void

// ─── Shared UI ────────────────────────────────────────────────────────────────
/** Format an array of ISO/partial date strings → "MMM YYYY – MMM YYYY" */
function fmtPeriod(dates: (string | null | undefined)[]): string {
  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  const parsed: Date[] = []
  for (const d of dates) {
    if (!d) continue
    const s = String(d)
    // ISO: 2025-03-01... or 2025-09-01T...
    const isoM = s.match(/^(\d{4})-(\d{2})/)
    if (isoM) { parsed.push(new Date(+isoM[1], +isoM[2] - 1)); continue }
    // DD.MM.YYYY
    const dmy = s.match(/^(\d{2})\.(\d{2})\.(\d{4})/)
    if (dmy) { parsed.push(new Date(+dmy[3], +dmy[2] - 1)); continue }
    // year only: 2025
    const yr = s.match(/^(\d{4})$/)
    if (yr) { parsed.push(new Date(+yr[1], 0)); continue }
  }
  if (!parsed.length) return ''
  parsed.sort((a, b) => a.getTime() - b.getTime())
  const fmt = (d: Date) => `${MONTHS[d.getMonth()]} ${d.getFullYear()}`
  const lo = fmt(parsed[0]), hi = fmt(parsed[parsed.length - 1])
  return lo === hi ? lo : `${lo} – ${hi}`
}

function StatCard({ label, value, sub, period, color = G }: { label: string; value: string; sub?: string; period?: string; color?: string }) {
  return (
    <div className="rounded-xl bg-[#0c1425] border border-[#1a2744] p-4 hover:border-opacity-60 transition-all" style={{ borderColor: `${color}20` }}>
      <div className="flex items-start justify-between gap-1 mb-1">
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600">{label}</span>
        {period && <span className="text-[9px] text-slate-700 font-mono whitespace-nowrap flex-shrink-0">{period}</span>}
      </div>
      <span className="text-xl font-bold block" style={{ color }}>{value}</span>
      {sub && <span className="text-[10px] text-slate-500 mt-1 block">{sub}</span>}
    </div>
  )
}

function ChartCard({ title, period, children, onClick }: { title: string; period?: string; children: React.ReactNode; onClick?: () => void }) {
  return (
    <div
      className={`rounded-xl bg-[#0c1425] border border-[#1a2744] p-5 ${onClick ? 'cursor-pointer hover:border-green-500/30 transition-colors group' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 truncate">{title}</h3>
          {period && (
            <span className="flex-shrink-0 text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#0a1128] border border-[#1a2744] text-slate-600">
              {period}
            </span>
          )}
        </div>
        {onClick && <span className="text-[9px] text-slate-600 group-hover:text-green-400 transition-colors flex-shrink-0 ml-2">Click for details &rarr;</span>}
      </div>
      {children}
    </div>
  )
}

function InsightBanner({ insights }: { insights: string[] }) {
  if (!insights.length) return null
  return (
    <div className="rounded-xl border border-green-500/20 bg-green-500/5 px-5 py-4">
      <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-green-400 mb-2">Key Insights</div>
      <ul className="space-y-1">
        {insights.map((t, i) => (
          <li key={i} className="text-[11px] text-slate-300 flex items-start gap-2">
            <span className="mt-0.5 text-green-400 flex-shrink-0">›</span>{t}
          </li>
        ))}
      </ul>
    </div>
  )
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="flex items-center gap-3 text-slate-500">
        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
        <span className="text-xs">Loading from API…</span>
      </div>
    </div>
  )
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-3">
      <svg viewBox="0 0 24 24" className="w-10 h-10 text-red-500/60" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeWidth={1.5} d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      </svg>
      <span className="text-xs font-medium text-red-400">API Unreachable</span>
      <span className="text-[11px] text-slate-500 max-w-xs text-center">{message}</span>
      <span className="text-[10px] text-slate-600">Ensure Tailscale is active — API at 100.85.189.71:8000</span>
    </div>
  )
}

// ─── Revenue Tab ──────────────────────────────────────────────────────────────
function RevenueView({ onDetail }: { onDetail: DetailSetter }) {
  const [rows, setRows] = useState<ReturnType<typeof combinedRevenue>>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([fetchBTRevenueVoice(), fetchBTRevenueData(), fetchBTRevenueSMS()])
      .then(([v, d, s]) => setRows(combinedRevenue(v, d, s)))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingState />
  if (error)   return <ErrorState message={error} />

  const latest  = rows[rows.length - 1]
  const prev    = rows[rows.length - 2]
  const momGrowth = prev ? (((latest.total - prev.total) / prev.total) * 100).toFixed(1) : '—'
  const annualTotal = rows.reduce((s, r) => s + r.total, 0)

  const chartData = rows.map(r => ({
    month:       r.month,
    'Voice (M)': +(r.voice / 1e6).toFixed(2),
    'Data (M)':  +(r.data  / 1e6).toFixed(2),
    'SMS (M)':   +(r.sms   / 1e6).toFixed(2),
  }))

  const mixPie = latest ? [
    { name: 'Voice', value: +(latest.voice / 1e6).toFixed(2) },
    { name: 'Data',  value: +(latest.data  / 1e6).toFixed(2) },
    { name: 'SMS',   value: +(latest.sms   / 1e6).toFixed(2) },
  ] : []

  const insights = rows.length >= 2 ? [
    `Latest month total: ${fmtBTN(latest.total)} — ${momGrowth}% MoM change across voice, data and SMS.`,
    `Data share: ${latest.total > 0 ? ((latest.data / latest.total) * 100).toFixed(0) : '—'}% of revenue — generated ${fmtBTN(latest.data)} from ${(latest.dataGB / 1e6).toFixed(1)}M GB internet traffic.`,
    `Cumulative revenue across ${rows.length} months: ${fmtBTN(annualTotal)}.`,
  ] : []
  const revPeriod = fmtPeriod(rows.map(r => r.iso))
  const latestRevPeriod = rows.length ? fmtPeriod([rows[rows.length - 1].iso]) : ''

  return (
    <>
      <InsightBanner insights={insights} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Latest Total Revenue" value={fmtBTN(latest?.total ?? 0)} sub={`${momGrowth}% MoM`} period={latestRevPeriod} />
        <StatCard label="Voice Revenue" value={fmtBTN(latest?.voice ?? 0)} sub={`${((latest?.voiceMin ?? 0) / 1e6).toFixed(1)}M min usage`} color="#00e5ff" period={latestRevPeriod} />
        <StatCard label="Data Revenue"  value={fmtBTN(latest?.data ?? 0)} sub={`${((latest?.dataGB ?? 0) / 1e6).toFixed(1)}M GB traffic`} color="#ffab00" period={latestRevPeriod} />
        <StatCard label="SMS Revenue"   value={fmtBTN(latest?.sms ?? 0)} sub={`${((latest?.smsUsage ?? 0) / 1e6).toFixed(1)}M messages`} color="#d500f9" period={latestRevPeriod} />
      </div>

      <ChartCard title="Monthly Revenue — Voice, Data & SMS (Millions Nu.)" period={revPeriod} onClick={() => onDetail({
        title: 'Monthly Revenue Breakdown',
        data: rows.map(r => ({
          Month: r.month, 'Voice (Nu.)': Math.round(r.voice),
          'Data (Nu.)': Math.round(r.data), 'SMS (Nu.)': Math.round(r.sms), 'Total (Nu.)': Math.round(r.total),
        }))
      })}>
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1a2744" />
            <XAxis dataKey="month" tick={{ fill: '#7a8baa', fontSize: 11 }} />
            <YAxis tick={{ fill: '#7a8baa', fontSize: 11 }} />
            <Tooltip contentStyle={tipStyle} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Area type="monotone" dataKey="Voice (M)" stackId="1" stroke="#00e5ff" fill="#00e5ff" fillOpacity={0.15} strokeWidth={2} />
            <Area type="monotone" dataKey="Data (M)"  stackId="1" stroke="#ffab00" fill="#ffab00" fillOpacity={0.15} strokeWidth={2} />
            <Area type="monotone" dataKey="SMS (M)"   stackId="1" stroke="#d500f9" fill="#d500f9" fillOpacity={0.15} strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Revenue Mix — Latest Month" period={latestRevPeriod}>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie data={mixPie} cx="50%" cy="50%" outerRadius={100} innerRadius={45} dataKey="value"
              label={({ name, percent }: any) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}>
              {mixPie.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
            </Pie>
            <Tooltip contentStyle={tipStyle} formatter={(v: any) => [`Nu. ${v.toFixed(1)}M`, '']} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>
    </>
  )
}

// ─── Network Tab ──────────────────────────────────────────────────────────────
function NetworkView({ onDetail }: { onDetail: DetailSetter }) {
  const [kpis,           setKpis]           = useState<BTCellTowerKPI[]>([])
  const [dataTraffic,    setDataTraffic]    = useState<BTDataTraffic[]>([])
  const [voiceTraffic,   setVoiceTraffic]   = useState<BTVoiceTraffic[]>([])
  const [techTraffic,    setTechTraffic]    = useState<BTCellDataTraffic[]>([])
  const [kpiReport,      setKpiReport]      = useState<BTKPIReport[]>([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')

  useEffect(() => {
    Promise.all([
      fetchBTCellTowerKPI(), fetchBTDataTraffic(), fetchBTVoiceTraffic(),
      fetchBTCellDataTraffic(), fetchBTKPIReport(),
    ])
      .then(([k, dt, vt, tt, kr]) => {
        setKpis(k); setDataTraffic(dt); setVoiceTraffic(vt)
        setTechTraffic(sortCellDataTraffic(tt)); setKpiReport(kr)
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingState />
  if (error)   return <ErrorState message={error} />

  const latestYear     = kpis.length ? Math.max(...kpis.map(k => k.year)) : 2025
  const latestKpis     = kpis.filter(k => k.year === latestYear)
  const latestTY       = dataTraffic.length ? Math.max(...dataTraffic.map(d => d.year)) : 2025
  const trafficForYear = dataTraffic.filter(d => d.year === latestTY)
  const regions        = [...new Set(trafficForYear.map(d => d.regions))]

  const trafficChart = KPI_MONTHS.map((m, i) => {
    const obj: Record<string, string | number> = { month: KPI_LABELS[i] }
    trafficForYear.forEach(d => { obj[d.regions] = (d[m as keyof BTDataTraffic] as number | null) ?? 0 })
    return obj
  })

  const sortedVoice = [...voiceTraffic]
    .sort((a, b) => a.year * 12 + KPI_MONTHS.indexOf(a.month.toLowerCase() as typeof KPI_MONTHS[number])
                  - b.year * 12 - KPI_MONTHS.indexOf(b.month.toLowerCase() as typeof KPI_MONTHS[number]))
    .slice(-12)
  const voiceChart = sortedVoice.map(v => ({
    month: `${v.month.slice(0, 3)} ${String(v.year).slice(2)}`,
    '3G':    +(v.voice_3g / 1e6).toFixed(2),
    '2G':    +(v.voice_2g / 1e6).toFixed(2),
    'VoLTE': +(v.volte    / 1e6).toFixed(2),
  }))

  // Tech-split data traffic chart (LTE / 3G / 5G)
  const techChart = techTraffic.slice(-18).map(r => ({
    month: `${r.months.slice(0, 3)} ${String(r.year).slice(2)}`,
    LTE:   +r.lte.toFixed(1),
    '3G':  +r.data_3g.toFixed(1),
    '5G':  +r.data_5g.toFixed(1),
  }))

  // KPI report throughput chart (sorted by throughput desc)
  const kpiReportSorted = [...kpiReport].sort((a, b) => b.dl_user_throughput_mbps - a.dl_user_throughput_mbps)
  const avgThroughput   = kpiReport.length ? (kpiReport.reduce((s, r) => s + r.dl_user_throughput_mbps, 0) / kpiReport.length).toFixed(1) : '—'
  const avgDrop         = kpiReport.length ? (kpiReport.reduce((s, r) => s + r.ps_drop_rate, 0) / kpiReport.length).toFixed(2) : '—'
  const avgSuccess      = kpiReport.length ? (kpiReport.reduce((s, r) => s + r.ps_success_rate, 0) / kpiReport.length).toFixed(2) : '—'

  const topRegion = trafficForYear.length ? trafficForYear.reduce((max, d) => {
    const tot = KPI_MONTHS.reduce((s, m) => s + ((d[m as keyof BTDataTraffic] as number | null) ?? 0), 0)
    const mxT = KPI_MONTHS.reduce((s, m) => s + ((max[m as keyof BTDataTraffic] as number | null) ?? 0), 0)
    return tot > mxT ? d : max
  }, trafficForYear[0]) : null

  const insights = [
    latestKpis.length ? `${latestKpis.length} KPI parameters tracked for ${latestYear} across GSM, UMTS and LTE technologies.` : '',
    topRegion ? `Highest regional data traffic: ${topRegion.regions} in ${latestTY}.` : '',
    kpiReport.length ? `Core area avg: ${avgThroughput} Mbps DL throughput, ${avgDrop}% PS drop rate, ${avgSuccess}% PS success rate across ${kpiReport.length} locations.` : '',
  ].filter(Boolean) as string[]
  const techPeriod = (() => {
    const ys = techTraffic.map(r => r.year)
    if (!ys.length) return ''
    const mn = Math.min(...ys), mx = Math.max(...ys)
    return mn === mx ? String(mn) : `${mn} – ${mx}`
  })()
  const voicePeriod = (() => {
    const ys = voiceTraffic.map(r => r.year)
    if (!ys.length) return ''
    const mn = Math.min(...ys), mx = Math.max(...ys)
    return mn === mx ? String(mn) : `${mn} – ${mx}`
  })()

  return (
    <>
      <InsightBanner insights={insights} />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard label="KPI Parameters" value={latestKpis.length.toString()} sub={`Year ${latestYear}`} />
        <StatCard label="Traffic Regions" value={regions.length.toString()} sub={`Year ${latestTY}`} color="#00e5ff" />
        <StatCard label="Avg Download Speed" value={`${avgThroughput} Mbps`} sub="Downlink throughput, core areas" color="#00e676" />
        <StatCard label="PS Drop Rate" value={`${avgDrop}%`} sub="Lower is better (target < 0.5%)" color="#ff1744" />
        <StatCard label="Avg PS Success Rate" value={`${avgSuccess}%`} sub="Higher is better (target > 99%)" color="#00bfa5" />
      </div>

      {/* Tech-split data traffic trend (LTE / 3G / 5G) */}
      <ChartCard title="Data Traffic by Technology — LTE, 3G & 5G (GB)" period={techPeriod} onClick={() => onDetail({
        title: 'Cell Tower Data Traffic by Technology',
        data: techTraffic.map(r => ({
          Month: `${r.months} ${r.year}`, 'LTE (GB)': r.lte.toFixed(1),
          '3G (GB)': r.data_3g.toFixed(1), '5G (GB)': r.data_5g.toFixed(1), 'Total (GB)': r.total_data.toFixed(1),
        }))
      })}>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={techChart}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1a2744" />
            <XAxis dataKey="month" tick={{ fill: '#7a8baa', fontSize: 10 }} />
            <YAxis tick={{ fill: '#7a8baa', fontSize: 11 }} unit=" GB" />
            <Tooltip contentStyle={tipStyle} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Area type="monotone" dataKey="LTE" stackId="1" stroke="#00e5ff" fill="#00e5ff" fillOpacity={0.2} strokeWidth={2} />
            <Area type="monotone" dataKey="3G"  stackId="1" stroke="#ffab00" fill="#ffab00" fillOpacity={0.2} strokeWidth={2} />
            <Area type="monotone" dataKey="5G"  stackId="1" stroke="#00e676" fill="#00e676" fillOpacity={0.2} strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Core area KPI report */}
      <ChartCard title="Core Area KPI — Download Speed by Location, Feb 2026 (Mbps)" onClick={() => onDetail({
        title: 'Core Area KPI Report',
        data: kpiReportSorted.map(r => ({
          Location: r.location_of_core_areas,
          'Download Speed (Mbps)': r.dl_user_throughput_mbps,
          'Packet-Switch Drop Rate (%)': r.ps_drop_rate,
          'Packet-Switch Success Rate (%)': r.ps_success_rate,
        }))
      })}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={kpiReportSorted} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#1a2744" />
            <XAxis type="number" tick={{ fill: '#7a8baa', fontSize: 11 }} unit=" Mbps" />
            <YAxis type="category" dataKey="location_of_core_areas" tick={{ fill: '#7a8baa', fontSize: 10 }} width={90} />
            <Tooltip contentStyle={tipStyle} formatter={(v: any) => [`${v} Mbps`, 'DL Throughput']} />
            <Bar dataKey="dl_user_throughput_mbps" name="Download Speed" fill={G} radius={[0, 3, 3, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* KPI Table */}
        <ChartCard title={`Cell Tower KPI Parameters — ${latestYear}`} onClick={() => onDetail({
          title: `KPI Details ${latestYear}`,
          data: latestKpis.map(k => ({
            Parameter: k.parameters.trim(), Technology: k.technology, Benchmark: k.benchmark,
            Jan: k.january ?? '—', Feb: k.february ?? '—', Mar: k.march ?? '—',
            Apr: k.april ?? '—',  May: k.may ?? '—',     Jun: k.june ?? '—',
            Jul: k.july ?? '—',   Aug: k.august ?? '—',  Sep: k.september ?? '—',
            Oct: k.october ?? '—',Nov: k.november ?? '—',Dec: k.december ?? '—',
          }))
        })}>
          <div className="overflow-x-auto max-h-64">
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-[#0c1425]">
                <tr className="border-b border-[#1a2744] text-slate-500">
                  <th className="text-left py-2 pr-3 min-w-[160px]">Parameter</th>
                  <th className="text-left py-2 pr-2">Tech</th>
                  <th className="text-left py-2 pr-2 text-[9px]">Benchmark</th>
                  {KPI_LABELS.map(m => <th key={m} className="text-right py-2 pr-1 text-[9px]">{m}</th>)}
                </tr>
              </thead>
              <tbody>
                {latestKpis.map((k, i) => (
                  <tr key={i} className="border-b border-[#1a2744]/50 hover:bg-white/[0.02]">
                    <td className="py-2 pr-3 text-slate-300 font-medium text-[10px]">{k.parameters.trim()}</td>
                    <td className="py-2 pr-2">
                      <span className={`px-1 py-0.5 rounded text-[8px] font-bold ${
                        k.technology === 'GSM' ? 'bg-amber-500/15 text-amber-400'
                        : k.technology === 'LTE' ? 'bg-cyan-500/15 text-cyan-400'
                        : 'bg-green-500/15 text-green-400'
                      }`}>{k.technology}</span>
                    </td>
                    <td className="py-2 pr-2 text-slate-500 text-[9px]">{k.benchmark}</td>
                    {KPI_MONTHS.map(m => {
                      const v = k[m as keyof BTCellTowerKPI] as number | null
                      return <td key={m} className="py-1 pr-1 text-right font-mono text-slate-300 text-[9px]">{v != null ? v.toFixed(1) : '—'}</td>
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>

        {/* Regional traffic summary */}
        <ChartCard title={`Data Traffic by Region — ${latestTY} (TB)`} onClick={() => onDetail({
          title: 'Data Traffic by Month & Region',
          data: trafficChart as Array<Record<string, string | number>>,
        })}>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={trafficChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a2744" />
              <XAxis dataKey="month" tick={{ fill: '#7a8baa', fontSize: 11 }} />
              <YAxis tick={{ fill: '#7a8baa', fontSize: 11 }} unit=" TB" />
              <Tooltip contentStyle={tipStyle} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              {regions.map((r, i) => (
                <Bar key={r} dataKey={r} stackId="a" fill={COLORS[i % COLORS.length]}
                  radius={i === regions.length - 1 ? [2, 2, 0, 0] : undefined} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Voice traffic by generation */}
      <ChartCard title="Voice Traffic by Generation — Last 12 Months (M minutes)" period={voicePeriod}>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={voiceChart}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1a2744" />
            <XAxis dataKey="month" tick={{ fill: '#7a8baa', fontSize: 10 }} />
            <YAxis tick={{ fill: '#7a8baa', fontSize: 11 }} unit=" M" />
            <Tooltip contentStyle={tipStyle} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Area type="monotone" dataKey="3G"    stackId="1" stroke="#ffab00" fill="#ffab00" fillOpacity={0.15} strokeWidth={2} />
            <Area type="monotone" dataKey="2G"    stackId="1" stroke="#00e5ff" fill="#00e5ff" fillOpacity={0.15} strokeWidth={2} />
            <Area type="monotone" dataKey="VoLTE" stackId="1" stroke="#00e676" fill="#00e676" fillOpacity={0.15} strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>
    </>
  )
}

// ─── Subscribers Tab ──────────────────────────────────────────────────────────
function SubscribersView({ onDetail }: { onDetail: DetailSetter }) {
  const [cdrVoice,       setCdrVoice]       = useState<ReturnType<typeof aggregateCDRVoice>>([])
  const [cdrData,        setCdrData]        = useState<ReturnType<typeof aggregateCDRData>>([])
  const [cdrPostData,    setCdrPostData]    = useState<ReturnType<typeof aggregateCDRPostpaidData>>([])
  const [cdrSMS,         setCdrSMS]         = useState<ReturnType<typeof aggregateCDRSMS>>([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')

  useEffect(() => {
    Promise.all([
      fetchBTCDRVoice(), fetchBTCDRData(),
      fetchBTCDRPostpaidData(), fetchBTCDRPostpaidSMS(),
    ])
      .then(([v, d, pd, sms]) => {
        setCdrVoice(aggregateCDRVoice(v))
        setCdrData(aggregateCDRData(d))
        setCdrPostData(aggregateCDRPostpaidData(pd))
        setCdrSMS(aggregateCDRSMS(sms))
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingState />
  if (error)   return <ErrorState message={error} />

  const totCalls   = cdrVoice.reduce((s, r) => s + r.calls, 0)
  const totDurMin  = cdrVoice.reduce((s, r) => s + r.duration_min, 0)
  const totDataGB  = cdrData.reduce((s, r) => s + r.usage_gb, 0)
  const totReq     = cdrData.reduce((s, r) => s + r.requests, 0)
  const totSMS     = cdrSMS.reduce((s, r) => s + r.sms_count, 0)
  const totPostMB  = cdrPostData.reduce((s, r) => s + r.volume_mb, 0)

  const voiceChart   = cdrVoice.map(r   => ({ month: r.month, Calls: r.calls }))
  const dataChart    = cdrData.map(r    => ({ month: r.month, Sessions: r.requests, 'Usage (GB)': +r.usage_gb.toFixed(1) }))
  const postDataChart = cdrPostData.map(r => ({ month: r.month, Sessions: r.sessions, 'Volume (MB)': +r.volume_mb.toFixed(1) }))
  const smsChart     = cdrSMS.map(r     => ({ month: r.month, SMS: r.sms_count }))

  const insights = [
    `${totCalls.toLocaleString()} postpaid voice CDR records — ${(totDurMin / 60).toFixed(0)} hours call time across ${cdrVoice.length} months.`,
    `Prepaid data: ${totDataGB.toFixed(0)} GB in ${totReq.toLocaleString()} sessions across ${cdrData.length} months.`,
    `Postpaid data CDR: ${totPostMB.toFixed(0)} MB across ${cdrPostData.length} months. Postpaid SMS: ${totSMS.toLocaleString()} messages.`,
  ]
  const cdrVoicePeriod    = fmtPeriod(cdrVoice.map(r => r.month))
  const cdrDataPeriod     = fmtPeriod(cdrData.map(r => r.month))
  const cdrPostDataPeriod = fmtPeriod(cdrPostData.map(r => r.month))
  const cdrSMSPeriod      = fmtPeriod(cdrSMS.map(r => r.month))

  return (
    <>
      <InsightBanner insights={insights} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Voice Calls (CDR)" value={totCalls.toLocaleString()} sub="Postpaid sample" period={cdrVoicePeriod} />
        <StatCard label="Prepaid Data Sessions" value={totReq.toLocaleString()} sub={`${totDataGB.toFixed(0)} GB`} color="#00e5ff" period={cdrDataPeriod} />
        <StatCard label="Postpaid Data CDR" value={`${totPostMB.toFixed(0)} MB`} sub={`${cdrPostData.length} months`} color="#ffab00" period={cdrPostDataPeriod} />
        <StatCard label="Postpaid SMS" value={totSMS.toLocaleString()} sub={`${cdrSMS.length} months sample`} color="#d500f9" period={cdrSMSPeriod} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Postpaid Voice Calls — by Month" period={cdrVoicePeriod} onClick={() => onDetail({
          title: 'CDR Voice Monthly Summary',
          data: cdrVoice.map(r => ({ Month: r.month, Calls: r.calls, 'Duration (min)': Math.round(r.duration_min), 'Revenue (Nu.)': Math.round(r.revenue) }))
        })}>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={voiceChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a2744" />
              <XAxis dataKey="month" tick={{ fill: '#7a8baa', fontSize: 10 }} />
              <YAxis tick={{ fill: '#7a8baa', fontSize: 11 }} />
              <Tooltip contentStyle={tipStyle} />
              <Bar dataKey="Calls" fill={G} radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Postpaid SMS — by Month" period={cdrSMSPeriod} onClick={() => onDetail({
          title: 'CDR Postpaid SMS Monthly',
          data: cdrSMS.map(r => ({ Month: r.month, 'SMS Count': r.sms_count, 'Revenue (Nu.)': Math.round(r.revenue) }))
        })}>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={smsChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a2744" />
              <XAxis dataKey="month" tick={{ fill: '#7a8baa', fontSize: 10 }} />
              <YAxis tick={{ fill: '#7a8baa', fontSize: 11 }} />
              <Tooltip contentStyle={tipStyle} />
              <Bar dataKey="SMS" fill="#d500f9" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <ChartCard title="Prepaid Data Sessions & Usage — by Month" period={cdrDataPeriod} onClick={() => onDetail({
        title: 'CDR Prepaid Data Monthly',
        data: cdrData.map(r => ({ Month: r.month, Sessions: r.requests, 'Usage (GB)': +r.usage_gb.toFixed(2) }))
      })}>
        <ResponsiveContainer width="100%" height={270}>
          <ComposedChart data={dataChart}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1a2744" />
            <XAxis dataKey="month" tick={{ fill: '#7a8baa', fontSize: 11 }} />
            <YAxis yAxisId="left"  tick={{ fill: '#7a8baa', fontSize: 11 }} />
            <YAxis yAxisId="right" orientation="right" tick={{ fill: '#7a8baa', fontSize: 11 }} />
            <Tooltip contentStyle={tipStyle} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar  yAxisId="left"  dataKey="Sessions"   fill="#ffab00" fillOpacity={0.4} radius={[2, 2, 0, 0]} />
            <Line yAxisId="right" type="monotone" dataKey="Usage (GB)" stroke="#00e5ff" strokeWidth={2.5} dot={{ r: 3, fill: '#00e5ff' }} />
          </ComposedChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Postpaid Data Usage — by Month (CDR Sample)" period={cdrPostDataPeriod} onClick={() => onDetail({
        title: 'CDR Postpaid Data Monthly',
        data: cdrPostData.map(r => ({ Month: r.month, Sessions: r.sessions, 'Volume (MB)': +r.volume_mb.toFixed(2), 'Revenue (Nu.)': Math.round(r.revenue) }))
      })}>
        <ResponsiveContainer width="100%" height={270}>
          <ComposedChart data={postDataChart}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1a2744" />
            <XAxis dataKey="month" tick={{ fill: '#7a8baa', fontSize: 11 }} />
            <YAxis yAxisId="left"  tick={{ fill: '#7a8baa', fontSize: 11 }} />
            <YAxis yAxisId="right" orientation="right" tick={{ fill: '#7a8baa', fontSize: 11 }} />
            <Tooltip contentStyle={tipStyle} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar  yAxisId="left"  dataKey="Sessions"    fill="#00e676" fillOpacity={0.4} radius={[2, 2, 0, 0]} />
            <Line yAxisId="right" type="monotone" dataKey="Volume (MB)" stroke="#00e5ff" strokeWidth={2.5} dot={{ r: 3, fill: '#00e5ff' }} />
          </ComposedChart>
        </ResponsiveContainer>
      </ChartCard>
    </>
  )
}

// ─── Complaints Tab ───────────────────────────────────────────────────────────
function ComplaintsView({ onDetail }: { onDetail: DetailSetter }) {
  const [complaints, setComplaints] = useState<BTComplaint[]>([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')

  useEffect(() => {
    fetchBTComplaints()
      .then(setComplaints)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingState />
  if (error)   return <ErrorState message={error} />

  // Normalise raw API status values to human-readable labels
  const STATUS_LABEL: Record<string, string> = {
    Close: 'Closed', Closed: 'Closed',
    Withdrew: 'Caller Withdrew',
    Escalate: 'Escalated', Escalated: 'Escalated',
    'In Progress': 'In Progress',
  }
  const normalised = complaints.map(c => ({
    ...c,
    status: STATUS_LABEL[c.status ?? ''] ?? c.status ?? 'Unknown',
  }))

  const byDzongkhag = groupBy(normalised, 'dzongkhag', 15)
  const byType      = groupBy(normalised, 'complaint_type')
  const byStatus    = groupBy(normalised, 'status')
  const byService   = groupBy(normalised, 'service', 10)
  const closedCount    = normalised.filter(c => c.status === 'Closed').length
  const withdrawnCount = normalised.filter(c => c.status === 'Caller Withdrew').length
  const resolvedPct = complaints.length ? ((closedCount / complaints.length) * 100).toFixed(1) : '—'

  const insights = [
    `${complaints.length.toLocaleString()} complaints logged — ${closedCount.toLocaleString()} formally closed (${resolvedPct}%). ${withdrawnCount.toLocaleString()} tickets were withdrawn by the caller (customer resolved issue before official closure).`,
    byDzongkhag.length ? `Highest volume district: ${byDzongkhag[0].name} with ${byDzongkhag[0].value.toLocaleString()} tickets — likely reflects population density in the capital.` : '',
    byType.length ? `Top complaint category: "${byType[0].name}" (${byType[0].value.toLocaleString()} cases) — click any chart for the full breakdown.` : '',
  ].filter(Boolean) as string[]
  const compPeriod = (() => {
    const ys = [...new Set(complaints.map(c => c.year).filter(y => y != null))].sort() as number[]
    return ys.length ? (ys[0] === ys[ys.length - 1] ? String(ys[0]) : `${ys[0]} – ${ys[ys.length - 1]}`) : ''
  })()

  return (
    <>
      <InsightBanner insights={insights} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Complaints" value={complaints.length.toLocaleString()} sub="Loaded from API" color="#ff1744" period={compPeriod} />
        <StatCard label="Closed / Resolved" value={closedCount.toLocaleString()} sub={`${resolvedPct}% rate`} period={compPeriod} />
        <StatCard label="Top Type" value={byType[0]?.name ?? '—'} sub={`${byType[0]?.value ?? 0} cases`} color="#ffab00" period={compPeriod} />
        <StatCard label="Top District" value={byDzongkhag[0]?.name ?? '—'} sub={`${byDzongkhag[0]?.value ?? 0} tickets`} color="#00e5ff" period={compPeriod} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Complaints by District (Top 15)" period={compPeriod} onClick={() => onDetail({
          title: 'All Complaints by Dzongkhag',
          data: byDzongkhag.map(r => ({ Dzongkhag: r.name, Complaints: r.value }))
        })}>
          <ResponsiveContainer width="100%" height={340}>
            <BarChart data={byDzongkhag} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#1a2744" />
              <XAxis type="number" tick={{ fill: '#7a8baa', fontSize: 11 }} />
              <YAxis type="category" dataKey="name" tick={{ fill: '#7a8baa', fontSize: 10 }} width={90} />
              <Tooltip contentStyle={tipStyle} />
              <Bar dataKey="value" name="Complaints" fill={G} radius={[0, 3, 3, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Complaint Status Breakdown" period={compPeriod} onClick={() => onDetail({
          title: 'Status Breakdown',
          data: byStatus.map(r => ({ Status: r.name, Count: r.value }))
        })}>
          <ResponsiveContainer width="100%" height={340}>
            <PieChart>
              <Pie data={byStatus} cx="50%" cy="50%" outerRadius={120} innerRadius={55} dataKey="value"
                label={({ name, percent }: any) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}>
                {byStatus.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={tipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <ChartCard title="Top 10 Complaint Services" period={compPeriod} onClick={() => onDetail({
        title: 'All Complaints by Service',
        data: groupBy(complaints, 'service').map(r => ({ Service: r.name, Count: r.value }))
      })}>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={byService} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#1a2744" />
            <XAxis type="number" tick={{ fill: '#7a8baa', fontSize: 11 }} />
            <YAxis type="category" dataKey="name" tick={{ fill: '#7a8baa', fontSize: 10 }} width={165} />
            <Tooltip contentStyle={tipStyle} />
            <Bar dataKey="value" name="Cases" fill="#00e5ff" radius={[0, 3, 3, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Complaint Types" period={compPeriod}>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={byType}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1a2744" />
            <XAxis dataKey="name" tick={{ fill: '#7a8baa', fontSize: 11 }} />
            <YAxis tick={{ fill: '#7a8baa', fontSize: 11 }} />
            <Tooltip contentStyle={tipStyle} labelStyle={{ color: '#ffffff' }} itemStyle={{ color: '#ffffff' }} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
            <Bar dataKey="value" name="Count" radius={[3, 3, 0, 0]}>
              {byType.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </>
  )
}

// ─── Coverage Tab ─────────────────────────────────────────────────────────────
function CoverageView({ onDetail }: { onDetail: DetailSetter }) {
  const [towers, setTowers] = useState<BTCellTowerDetail[]>([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')

  useEffect(() => {
    fetchBTTowerDetails()
      .then(setTowers)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingState />
  if (error)   return <ErrorState message={error} />

  const regionSummary = towersByRegion(towers)
  const total   = towers.length
  const has4G   = towers.filter(t => t.lte_1800 || t.lte_700_ || t.lte_850 || t.lte_900 || t.tdd_2300).length
  const has5G   = towers.filter(t => t.network_5g).length
  const has2G   = towers.filter(t => t.network_2g).length
  const has3G   = towers.filter(t => t.network_3g).length

  const regionChart = regionSummary.map(r => ({
    region: r.region, 'Total': r.count, '4G (LTE)': r.lte4g, '2G': r.has2g, '3G': r.has3g,
  }))

  const techPie = [
    { name: '4G LTE',  value: has4G },
    { name: '2G GSM',  value: has2G },
    { name: '3G UMTS', value: has3G },
    { name: '5G NR',   value: has5G },
  ].filter(d => d.value > 0)

  const insights = [
    `${total} cell tower sites — ${has4G} (${total > 0 ? ((has4G / total) * 100).toFixed(0) : 0}%) have 4G LTE coverage.`,
    regionSummary.length ? `Largest region: ${regionSummary[0].region} with ${regionSummary[0].count} sites.` : '',
    has5G > 0 ? `${has5G} sites with 5G NR capability.` : '5G NR not deployed in this dataset.',
  ].filter(Boolean) as string[]

  return (
    <>
      <InsightBanner insights={insights} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Sites" value={total.toLocaleString()} sub="Loaded from API" />
        <StatCard label="4G Enabled" value={has4G.toLocaleString()} sub={`${total > 0 ? ((has4G / total) * 100).toFixed(0) : 0}% of total`} color="#00e5ff" />
        <StatCard label="5G NR Sites" value={has5G.toLocaleString()} sub="NR capable" color="#d500f9" />
        <StatCard label="Regions" value={regionSummary.length.toString()} sub="Coverage areas" color="#ffab00" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Sites by Region" onClick={() => onDetail({
          title: 'Tower Count by Region',
          data: regionSummary.map(r => ({ Region: r.region, Total: r.count, '4G': r.lte4g, '2G': r.has2g, '3G': r.has3g, '5G': r.has5g }))
        })}>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={regionChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a2744" />
              <XAxis dataKey="region" tick={{ fill: '#7a8baa', fontSize: 10 }} />
              <YAxis tick={{ fill: '#7a8baa', fontSize: 11 }} />
              <Tooltip contentStyle={tipStyle} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="Total"    fill={G}       radius={[2, 2, 0, 0]} />
              <Bar dataKey="4G (LTE)" fill="#00e5ff" radius={[2, 2, 0, 0]} />
              <Bar dataKey="2G"       fill="#ffab00" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Technology Generation Mix">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={techPie} cx="50%" cy="50%" outerRadius={100} innerRadius={45} dataKey="value"
                label={({ name, percent }: any) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}>
                {techPie.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={tipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Tower table */}
      <ChartCard title="Cell Site Inventory (first 50 shown — click to expand all)" onClick={() => onDetail({
        title: 'Cell Tower Sites — All Sites',
        data: towers.map(t => ({
          'Site ID': t.site_id, 'Site Name': t.site_name_, Region: t.regions,
          '4G': (t.lte_1800 || t.lte_700_ || t.lte_850 || t.lte_900 || t.tdd_2300) ? 'Yes' : 'No',
          '2G': t.network_2g ? 'Yes' : 'No', '3G': t.network_3g ? 'Yes' : 'No', '5G': t.network_5g ? 'Yes' : 'No',
        }))
      })}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#1a2744] text-slate-500">
                <th className="text-left py-2 pr-3">Site ID</th>
                <th className="text-left py-2 pr-3">Site Name</th>
                <th className="text-left py-2 pr-3">Region</th>
                <th className="text-center py-2 pr-2">2G</th>
                <th className="text-center py-2 pr-2">3G</th>
                <th className="text-center py-2 pr-2">4G</th>
                <th className="text-center py-2">5G</th>
              </tr>
            </thead>
            <tbody>
              {towers.slice(0, 50).map((t, i) => {
                const h4 = !!(t.lte_1800 || t.lte_700_ || t.lte_850 || t.lte_900 || t.tdd_2300)
                return (
                  <tr key={i} className="border-b border-[#1a2744]/50 hover:bg-white/[0.02]">
                    <td className="py-2 pr-3 font-mono text-cyan-400 text-[10px]">{t.site_id}</td>
                    <td className="py-2 pr-3 text-slate-300">{t.site_name_}</td>
                    <td className="py-2 pr-3 text-slate-400">{t.regions}</td>
                    <td className="py-2 pr-2 text-center">{t.network_2g ? <span className="text-green-400">✓</span> : <span className="text-slate-700">—</span>}</td>
                    <td className="py-2 pr-2 text-center">{t.network_3g ? <span className="text-green-400">✓</span> : <span className="text-slate-700">—</span>}</td>
                    <td className="py-2 pr-2 text-center">{h4          ? <span className="text-cyan-400">✓</span>  : <span className="text-slate-700">—</span>}</td>
                    <td className="py-2 text-center">    {t.network_5g ? <span className="text-purple-400">✓</span>: <span className="text-slate-700">—</span>}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </ChartCard>
    </>
  )
}

// ─── Tariffs Tab ──────────────────────────────────────────────────────────────
function TariffsView({ onDetail }: { onDetail: DetailSetter }) {
  const [postpaid,      setPostpaid]      = useState<BTPostpaidTariff[]>([])
  const [prepaid,       setPrepaid]       = useState<BTPrepaidTariff[]>([])
  const [booster,       setBooster]       = useState<BTPostpaidBooster[]>([])
  const [ppVoice,       setPpVoice]       = useState<BTPostpaidVoiceTariff[]>([])
  const [ppSMS,         setPpSMS]         = useState<BTPostpaidSMSTariff[]>([])
  const [airFibre,      setAirFibre]      = useState<BTPrepaidAirFibre[]>([])
  const [prepaidVoice,  setPrepaidVoice]  = useState<BTPrepaidVoiceSMS[]>([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')

  useEffect(() => {
    Promise.all([
      fetchBTPostpaidTariff(), fetchBTPrepaidTariff(),
      fetchBTPostpaidBooster(), fetchBTPostpaidVoiceTariff(), fetchBTPostpaidSMSTariff(),
      fetchBTPrepaidAirFibre(), fetchBTPrepaidVoiceSMS(),
    ])
      .then(([pp, pr, b, ppv, pps, af, pv]) => {
        setPostpaid(pp); setPrepaid(pr); setBooster(b)
        setPpVoice(ppv); setPpSMS(pps); setAirFibre(af); setPrepaidVoice(pv)
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingState />
  if (error)   return <ErrorState message={error} />

  const prices    = postpaid.filter(p => p.price).map(p => p.price as number)
  const minPrice  = prices.length ? Math.min(...prices) : 0
  const maxPrice  = prices.length ? Math.max(...prices) : 0
  const withData  = postpaid.filter(p => p.data_quota_mb).length

  const validityMap: Record<string, number> = {}
  prepaid.forEach(p => { const v = p.validity_days || 'unknown'; validityMap[v] = (validityMap[v] || 0) + 1 })
  const validityChart = Object.entries(validityMap)
    .map(([name, value]) => ({ name: `${name}d`, value }))
    .sort((a, b) => parseInt(a.name) - parseInt(b.name))

  const priceChart = postpaid.filter(p => p.price && p.plans).slice(0, 20).map(p => ({
    name: p.plans.length > 22 ? p.plans.slice(0, 20) + '…' : p.plans,
    price: p.price as number,
  }))

  const boosterChart = booster.map(b => ({
    name: `${b.data_quota_mb >= 1024 ? (b.data_quota_mb / 1024).toFixed(0) + 'GB' : b.data_quota_mb + 'MB'}`,
    'Price (Nu.)': b.price,
  }))

  const airFibreChart = airFibre.map(f => ({
    name: f.package_name.length > 18 ? f.package_name.slice(0, 16) + '…' : f.package_name,
    'Rate (Nu.)': f.rate_nu,
    'Data (GB)': f.data_volume_gb,
  }))

  const prepaidVoiceByType = [...new Set(prepaidVoice.map(r => r.call_type))]

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Postpaid Monthly Plans" value={postpaid.length.toString()} sub="from API" />
        <StatCard label="Postpaid Booster Packs"  value={booster.length.toString()} sub="add-ons" color="#00e5ff" />
        <StatCard label="AirFibre Packages" value={airFibre.length.toString()} sub="prepaid" color="#ffab00" />
        <StatCard label="Prepaid Voice/SMS Rates" value={prepaidVoice.length.toString()} sub="rate entries" color="#d500f9" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Postpaid Monthly Plans — Price (Nu.)" onClick={() => onDetail({
          title: 'Postpaid Tariff Plans',
          data: postpaid.map(p => ({
            Plan: p.plans, 'Price (Nu.)': p.price ?? '—',
            'Data (MB)': p.data_quota_mb ?? 'Unlimited', Validity: p.validity ?? '—',
          }))
        })}>
          <ResponsiveContainer width="100%" height={270}>
            <BarChart data={priceChart} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#1a2744" />
              <XAxis type="number" tick={{ fill: '#7a8baa', fontSize: 11 }} />
              <YAxis type="category" dataKey="name" tick={{ fill: '#7a8baa', fontSize: 9 }} width={130} />
              <Tooltip contentStyle={tipStyle} />
              <Bar dataKey="price" name="Price (Nu.)" fill={G} radius={[0, 3, 3, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Postpaid Booster Packs — Price vs Data" onClick={() => onDetail({
          title: 'Postpaid Booster Packs',
          data: booster.map(b => ({
            Pack: b.plans, 'Price (Nu.)': b.price,
            'Data Quota (MB)': b.data_quota_mb, Validity: b.validity,
          }))
        })}>
          <ResponsiveContainer width="100%" height={270}>
            <BarChart data={boosterChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a2744" />
              <XAxis dataKey="name" tick={{ fill: '#7a8baa', fontSize: 11 }} />
              <YAxis tick={{ fill: '#7a8baa', fontSize: 11 }} />
              <Tooltip contentStyle={tipStyle} />
              <Bar dataKey="Price (Nu.)" fill="#00e5ff" radius={[3, 3, 0, 0]}>
                {boosterChart.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Postpaid Voice Rate Table */}
        <ChartCard title="Postpaid Voice Tariff — Nu. per 15 sec unit" onClick={() => onDetail({
          title: 'Postpaid Voice Tariff',
          data: ppVoice.map(r => ({
            'Call Type': r.call_type_1_unit_15_sec,
            'Off-peak (6AM–3PM)': r.off_peak_hour_6am_3pm,
            'Peak (3PM–10PM)': r.peak_hour_3pm_10pm,
            'Economy (4AM–6AM)': r.economy_hour_4am_6am,
            'Late Night (12AM–4AM)': r.late_night_12am_4am,
          }))
        })}>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[#1a2744] text-slate-500">
                  <th className="text-left py-2 pr-2">Call Type</th>
                  <th className="text-right py-2 pr-2">Off-peak</th>
                  <th className="text-right py-2 pr-2">Peak</th>
                  <th className="text-right py-2 pr-2">Economy</th>
                  <th className="text-right py-2">Late Night</th>
                </tr>
              </thead>
              <tbody>
                {ppVoice.map((r, i) => (
                  <tr key={i} className="border-b border-[#1a2744]/50 hover:bg-white/[0.02]">
                    <td className="py-2 pr-2 text-slate-300 font-medium">{r.call_type_1_unit_15_sec}</td>
                    <td className="py-2 pr-2 text-right text-green-400 font-mono">{r.off_peak_hour_6am_3pm}</td>
                    <td className="py-2 pr-2 text-right text-amber-400 font-mono">{r.peak_hour_3pm_10pm}</td>
                    <td className="py-2 pr-2 text-right text-cyan-400 font-mono">{r.economy_hour_4am_6am}</td>
                    <td className="py-2 text-right text-purple-400 font-mono">{r.late_night_12am_4am}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>

        {/* Postpaid SMS Rate Table */}
        <ChartCard title="Postpaid SMS Tariff — Nu. per SMS" onClick={() => onDetail({
          title: 'Postpaid SMS Tariff',
          data: ppSMS.map(r => ({
            'Call Type': r.call_type,
            'Standard (4AM–12MN)': r.standard_4am_12_midnight,
            'Midnight (12MN–4AM)': r.midnight_12_midnight_4am,
          }))
        })}>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[#1a2744] text-slate-500">
                  <th className="text-left py-2 pr-4">Destination</th>
                  <th className="text-right py-2 pr-4">Standard (4AM–12MN)</th>
                  <th className="text-right py-2">Midnight (12MN–4AM)</th>
                </tr>
              </thead>
              <tbody>
                {ppSMS.map((r, i) => (
                  <tr key={i} className="border-b border-[#1a2744]/50 hover:bg-white/[0.02]">
                    <td className="py-2 pr-4 text-slate-300 font-medium">{r.call_type}</td>
                    <td className="py-2 pr-4 text-right text-green-400 font-mono">{r.standard_4am_12_midnight}</td>
                    <td className="py-2 text-right text-cyan-400 font-mono">{r.midnight_12_midnight_4am}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AirFibre packages chart */}
        <ChartCard title="Prepaid AirFibre Packages — Rate (Nu.)" onClick={() => onDetail({
          title: 'Prepaid AirFibre Packages',
          data: airFibre.map(f => ({
            Package: f.package_name, 'Rate (Nu.)': f.rate_nu,
            'Speed (Mbps)': f.bw_mbps, 'Data (GB)': f.data_volume_gb,
            'Cost/GB': f.cost_gb, 'Fair Usage': f.fair_usage, Validity: f.validity,
          }))
        })}>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={airFibreChart} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#1a2744" />
              <XAxis type="number" tick={{ fill: '#7a8baa', fontSize: 11 }} />
              <YAxis type="category" dataKey="name" tick={{ fill: '#7a8baa', fontSize: 9 }} width={120} />
              <Tooltip contentStyle={tipStyle} />
              <Bar dataKey="Rate (Nu.)" fill="#ffab00" radius={[0, 3, 3, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Prepaid data packs validity */}
        <ChartCard title="Prepaid Data Packs by Validity">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={validityChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a2744" />
              <XAxis dataKey="name" tick={{ fill: '#7a8baa', fontSize: 11 }} />
              <YAxis tick={{ fill: '#7a8baa', fontSize: 11 }} />
              <Tooltip contentStyle={tipStyle} />
              <Bar dataKey="value" name="Plans" radius={[3, 3, 0, 0]}>
                {validityChart.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Prepaid Voice & SMS rates */}
      <ChartCard title="Prepaid Voice & SMS Rates" onClick={() => onDetail({
        title: 'Prepaid Voice & SMS Tariff',
        data: prepaidVoice.map(r => ({ 'Call Type': r.call_type, Timing: r.timing, 'Tariff (Nu.)': r.tariff_nu }))
      })}>
        <div className="overflow-x-auto max-h-64">
          <table className="w-full text-xs">
            <thead className="sticky top-0 bg-[#0c1425]">
              <tr className="border-b border-[#1a2744] text-slate-500">
                <th className="text-left py-2 pr-4">Call Type</th>
                <th className="text-left py-2 pr-4">Timing</th>
                <th className="text-right py-2">Tariff (Nu.)</th>
              </tr>
            </thead>
            <tbody>
              {prepaidVoice.map((r, i) => (
                <tr key={i} className="border-b border-[#1a2744]/50 hover:bg-white/[0.02]">
                  <td className="py-2 pr-4 text-slate-300 font-medium">{r.call_type}</td>
                  <td className="py-2 pr-4 text-slate-400">{r.timing}</td>
                  <td className="py-2 text-right text-green-400 font-mono">{r.tariff_nu}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartCard>

      {/* Prepaid data packs table */}
      <ChartCard title="Prepaid Data Packs" onClick={() => onDetail({
        title: 'Prepaid Data Pack Details',
        data: prepaid.map(p => ({
          Pack: p.data_pack, 'Rate (Nu.)': p.rate, 'Quota (MB)': p.quota_mb, 'Validity (days)': p.validity_days,
        }))
      })}>
        <div className="overflow-x-auto max-h-64">
          <table className="w-full text-xs">
            <thead className="sticky top-0 bg-[#0c1425]">
              <tr className="border-b border-[#1a2744] text-slate-500">
                <th className="text-left py-2 pr-4">Data Pack</th>
                <th className="text-right py-2 pr-4">Rate (Nu.)</th>
                <th className="text-right py-2 pr-4">Quota (MB)</th>
                <th className="text-right py-2">Validity (days)</th>
              </tr>
            </thead>
            <tbody>
              {prepaid.map((p, i) => (
                <tr key={i} className="border-b border-[#1a2744]/50 hover:bg-white/[0.02]">
                  <td className="py-2 pr-4 text-slate-300 font-medium">{p.data_pack}</td>
                  <td className="py-2 pr-4 text-right text-green-400 font-mono">{p.rate}</td>
                  <td className="py-2 pr-4 text-right text-slate-300 font-mono">{(+p.quota_mb).toFixed(0)}</td>
                  <td className="py-2 text-right text-cyan-400 font-mono">{p.validity_days}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartCard>
    </>
  )
}
