'use client'

import { useState, useEffect } from 'react'
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ComposedChart
} from 'recharts'
import {
  flightOpsData, passengerTrafficData, loadFactorData, fleetData,
  routePerformance, flightCountSummary, annualSummary
} from '../data/drukair-data'
import {
  fetchProfitLoss, fetchBalanceSheet, fetchCashFlow,
  fetchPassengerTraffic, fetchMasterData,
  aggregatePL, aggregateBS, aggregateCF,
  aggregateMasterByYear, aggregateMasterBySector,
  aggregatePaxByMonth, aggregatePaxByRoute,
  fmtBTN,
  type ProfitLossItem, type BalanceSheetItem, type CashFlowItem,
  type PassengerTrafficItem, type MasterDataItem,
} from '../lib/drukair-api'

const COLORS = ['#00e5ff', '#ffab00', '#00e676', '#ff1744', '#d500f9', '#ffd600', '#00bfa5', '#ff6e40']
const subtabs = ['Customers', 'P&L', 'Balance Sheet', 'Cash Flow', 'Fleet & Ops']

const tabDescriptions: Record<string, string> = {
  'Customers':      'Passenger volumes, route traffic and seat utilisation — the customer view of Drukair operations. Showing recent years. ASK (Available Seat Kilometres) = total capacity offered. RPK (Revenue Passenger Kilometres) = capacity actually sold. Load Factor = RPK ÷ ASK × 100%.',
  'P&L':            'Revenue, expenses and net profit/loss — Drukair\'s financial performance across fiscal reporting periods. Nu. (BTN) = Bhutanese Ngultrum, Bhutan\'s national currency. Figures shown in billions (B) or millions (M).',
  'Balance Sheet':  'Total assets, liabilities and shareholders\' equity — a financial position snapshot at each period end. Assets = what the company owns; Liabilities = what it owes; Equity = owners\' net stake.',
  'Cash Flow':      'How cash actually moves through the business — distinct from accounting profit. Operating = day-to-day business; Investing = planes & infrastructure; Financing = loans & dividends.',
  'Fleet & Ops':    'Block hours, route sectors and aircraft utilisation — the operational efficiency story. Block hours = total time from aircraft pushback to engine shutdown, the key metric for maintenance scheduling.',
}

const tipStyle = { background: '#0f1a2e', border: '1px solid #1a2744', borderRadius: 8, color: '#e8edf5' }

function shortMonth(m: string) { return m.replace(' 2024', '').slice(0, 3) }

export default function DrukAirDashboard() {
  const [activeSubTab, setActiveSubTab] = useState('Customers')
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
                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                  : 'text-slate-300 hover:text-slate-300 border border-transparent hover:bg-white/[0.02]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        {tabDescriptions[activeSubTab] && (
          <p className="text-[11px] text-slate-300 mt-2 pl-0.5 leading-relaxed">{tabDescriptions[activeSubTab]}</p>
        )}
      </div>

      {/* Content — split layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: charts */}
        <div className={`overflow-y-auto p-6 space-y-6 transition-all ${detailPanel ? 'w-[60%]' : 'w-full'}`}>
          {activeSubTab === 'Customers'     && <PassengersView onDetail={setDetailPanel} />}
          {activeSubTab === 'P&L'           && <PLView onDetail={setDetailPanel} />}
          {activeSubTab === 'Balance Sheet' && <BalanceSheetView onDetail={setDetailPanel} />}
          {activeSubTab === 'Cash Flow'     && <CashFlowView onDetail={setDetailPanel} />}
          {activeSubTab === 'Fleet & Ops'   && <FleetOpsView onDetail={setDetailPanel} />}

        </div>

        {/* Right: detail panel */}
        {detailPanel && (
          <div className="w-[40%] border-l border-[#1a2744] overflow-y-auto p-5 animate-fade-in-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-amber-400">{detailPanel.title}</h3>
              <button onClick={() => setDetailPanel(null)} className="p-1 rounded-md text-slate-300 hover:text-slate-300 hover:bg-[#1a2744] transition-colors">
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
                        <td key={j} className={`py-2 px-3 ${j === 0 ? 'text-slate-300 font-medium' : 'text-slate-300 font-mono'}`}>
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

type DetailSetter = (detail: { title: string; data: Array<Record<string, string | number>> } | null) => void

/** Format date coverage for chips as explicit snapshot/range labels. */
function fmtPeriod(dates: (string | null | undefined)[]): string {
  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  const MONTH_INDEX: Record<string, number> = {
    jan: 0, january: 0,
    feb: 1, february: 1,
    mar: 2, march: 2,
    apr: 3, april: 3,
    may: 4,
    jun: 5, june: 5,
    jul: 6, july: 6,
    aug: 7, august: 7,
    sep: 8, sept: 8, september: 8,
    oct: 9, october: 9,
    nov: 10, november: 10,
    dec: 11, december: 11,
  }
  const parsed: Date[] = []
  for (const d of dates) {
    if (!d) continue
    const s = String(d)
    const isoM = s.match(/^(\d{4})-(\d{2})/)
    if (isoM) { parsed.push(new Date(+isoM[1], +isoM[2] - 1)); continue }
    const dmy = s.match(/^(\d{2})\.(\d{2})\.(\d{4})/)
    if (dmy) { parsed.push(new Date(+dmy[3], +dmy[2] - 1)); continue }
    const mmy = s.match(/^(\d{1,2})\/(\d{4})$/)
    if (mmy) { parsed.push(new Date(+mmy[2], +mmy[1] - 1)); continue }
    const monY = s.match(/^([A-Za-z]{3,9})\s+(\d{4})$/)
    if (monY) {
      const m = MONTH_INDEX[monY[1].toLowerCase()]
      if (m != null) {
        parsed.push(new Date(+monY[2], m))
        continue
      }
    }
    const yr = s.match(/^(\d{4})$/)
    if (yr) { parsed.push(new Date(+yr[1], 0)); continue }
  }
  if (!parsed.length) return ''
  parsed.sort((a, b) => a.getTime() - b.getTime())
  const fmt = (d: Date) => `${MONTHS[d.getMonth()]} ${d.getFullYear()}`
  const lo = fmt(parsed[0]), hi = fmt(parsed[parsed.length - 1])
  return lo === hi ? `As of ${lo}` : `Data period: ${lo} to ${hi}`
}

function fmtYearPeriod(years: (number | null | undefined)[]): string {
  const valid = years.filter((y): y is number => typeof y === 'number' && Number.isFinite(y))
  if (!valid.length) return ''
  const min = Math.min(...valid)
  const max = Math.max(...valid)
  return min === max ? `As of ${min}` : `Data period: ${min} to ${max}`
}

function StatCard({ label, value, sub, period, color = '#ffab00' }: { label: string; value: string; sub?: string; period?: string; color?: string }) {
  return (
    <div className="rounded-xl bg-[#0c1425] border border-[#1a2744] p-4 hover:border-opacity-60 transition-all" style={{ borderColor: `${color}20` }}>
      <div className="flex items-start justify-between gap-1 mb-1">
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600">{label}</span>
        {period && <span className="text-[9px] text-slate-700 font-mono whitespace-nowrap flex-shrink-0">{period}</span>}
      </div>
      <span className="text-xl font-bold block" style={{ color }}>{value}</span>
      {sub && <span className="text-[10px] text-slate-300 mt-1 block">{sub}</span>}
    </div>
  )
}

function ChartCard({ title, period, children, onClick }: { title: string; period?: string; children: React.ReactNode; onClick?: () => void }) {
  return (
    <div
      className={`rounded-xl bg-[#0c1425] border border-[#1a2744] p-5 ${onClick ? 'cursor-pointer hover:border-amber-500/30 transition-colors group' : ''}`}
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
        {onClick && <span className="text-[9px] text-slate-600 group-hover:text-amber-400 transition-colors flex-shrink-0 ml-2">Click for details &rarr;</span>}
      </div>
      {children}
    </div>
  )
}

function InsightBanner({ insights }: { insights: string[] }) {
  if (insights.length === 0) return null
  return (
    <div className="rounded-xl border border-amber-500/15 bg-amber-500/[0.04] p-4 flex gap-3">
      <div className="flex-shrink-0 mt-0.5">
        <svg width="15" height="15" fill="none" stroke="#ffab00" viewBox="0 0 24 24" strokeWidth="2">
          <circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" />
        </svg>
      </div>
      <ul className="space-y-2 flex-1">
        {insights.map((text, i) => (
          <li key={i} className="text-[11px] text-slate-300 leading-relaxed">
            <span className="text-amber-500/60 mr-1">›</span>{text}
          </li>
        ))}
      </ul>
    </div>
  )
}

// ====== FLIGHT OPS ======
function FlightOpsView({ onDetail }: { onDetail: DetailSetter }) {
  const opsChart = flightOpsData.map(r => ({
    month: shortMonth(r.month),
    'Completed': r.completedFlights,
    'Cancelled': r.cancelledFlights,
    'Delayed': r.delayedFlights,
    'On-Time %': r.onTimePercentage,
  }))

  const latest = flightOpsData[flightOpsData.length - 1]
  const totalCompleted = flightOpsData.reduce((s, r) => s + r.completedFlights, 0)

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Dec Flights" value={latest.completedFlights.toString()} sub={`of ${latest.scheduledFlights} scheduled`} />
        <StatCard label="On-Time Rate" value={`${latest.onTimePercentage}%`} sub="Dec 2024" color="#00e676" />
        <StatCard label="Cancellations" value={latest.cancelledFlights.toString()} sub={`${((latest.cancelledFlights / latest.scheduledFlights) * 100).toFixed(1)}% rate`} color="#ff1744" />
        <StatCard label="Annual Flights" value={totalCompleted.toLocaleString()} sub="2024 total" color="#00e5ff" />
      </div>

      <ChartCard title="Flight Operations — Monthly" onClick={() => onDetail({
        title: 'Flight Operations — All Months',
        data: flightOpsData.map(r => ({
          Month: shortMonth(r.month),
          Scheduled: r.scheduledFlights,
          Completed: r.completedFlights,
          Cancelled: r.cancelledFlights,
          Delayed: r.delayedFlights,
          'On-Time %': r.onTimePercentage,
          'Avg Delay': r.avgDelayMinutes + 'm',
        }))
      })}>
        <ResponsiveContainer width="100%" height={320}>
          <ComposedChart data={opsChart}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1a2744" />
            <XAxis dataKey="month" tick={{ fill: '#7a8baa', fontSize: 11 }} />
            <YAxis yAxisId="left" tick={{ fill: '#7a8baa', fontSize: 11 }} />
            <YAxis yAxisId="right" orientation="right" tick={{ fill: '#7a8baa', fontSize: 11 }} domain={[50, 100]} />
            <Tooltip contentStyle={{ background: '#0f1a2e', border: '1px solid #1a2744', borderRadius: 8, color: '#e8edf5' }} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar yAxisId="left" dataKey="Completed" fill="#00e676" radius={[2, 2, 0, 0]} />
            <Bar yAxisId="left" dataKey="Cancelled" fill="#ff1744" radius={[2, 2, 0, 0]} />
            <Line yAxisId="right" type="monotone" dataKey="On-Time %" stroke="#ffab00" strokeWidth={2.5} dot={{ r: 3, fill: '#ffab00' }} />
          </ComposedChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Domestic vs International Flights" onClick={() => onDetail({
        title: 'Domestic vs International — Monthly',
        data: flightOpsData.map(r => ({
          Month: shortMonth(r.month),
          Domestic: r.domesticFlights,
          International: r.internationalFlights,
          Total: r.completedFlights,
        }))
      })}>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={flightOpsData.map(r => ({
            month: shortMonth(r.month),
            Domestic: r.domesticFlights,
            International: r.internationalFlights,
          }))}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1a2744" />
            <XAxis dataKey="month" tick={{ fill: '#7a8baa', fontSize: 11 }} />
            <YAxis tick={{ fill: '#7a8baa', fontSize: 11 }} />
            <Tooltip contentStyle={{ background: '#0f1a2e', border: '1px solid #1a2744', borderRadius: 8, color: '#e8edf5' }} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="International" fill="#00e5ff" radius={[2, 2, 0, 0]} />
            <Bar dataKey="Domestic" fill="#d500f9" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </>
  )
}

// ====== PASSENGER TRAFFIC ======
function PassengerView({ onDetail }: { onDetail: DetailSetter }) {
  const paxChart = passengerTrafficData.map(r => ({
    month: shortMonth(r.month),
    Inbound: r.inbound,
    Outbound: r.outbound,
    Transit: r.transit,
  }))

  const classChart = passengerTrafficData.map(r => ({
    month: shortMonth(r.month),
    Business: r.businessClass,
    Economy: r.economyClass,
  }))

  const latest = passengerTrafficData[passengerTrafficData.length - 1]
  const peakMonth = passengerTrafficData.reduce((max, r) => r.totalPassengers > max.totalPassengers ? r : max)

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Dec Passengers" value={latest.totalPassengers.toLocaleString()} />
        <StatCard label="Tourists" value={latest.tourists.toLocaleString()} sub={`${((latest.tourists / latest.totalPassengers) * 100).toFixed(0)}% of total`} color="#00e5ff" />
        <StatCard label="Peak Month" value={peakMonth.month.replace(' 2024', '')} sub={`${peakMonth.totalPassengers.toLocaleString()} pax`} color="#00e676" />
        <StatCard label="Annual Total" value={annualSummary.totalPassengers2024.toLocaleString()} sub="2024" color="#d500f9" />
      </div>

      <ChartCard title="Passenger Traffic — Inbound vs Outbound" onClick={() => onDetail({
        title: 'Passenger Traffic — All Months',
        data: passengerTrafficData.map(r => ({
          Month: shortMonth(r.month),
          Total: r.totalPassengers,
          Inbound: r.inbound,
          Outbound: r.outbound,
          Transit: r.transit,
          Tourists: r.tourists,
          Nationals: r.nationals,
        }))
      })}>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={paxChart}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1a2744" />
            <XAxis dataKey="month" tick={{ fill: '#7a8baa', fontSize: 11 }} />
            <YAxis tick={{ fill: '#7a8baa', fontSize: 11 }} />
            <Tooltip contentStyle={{ background: '#0f1a2e', border: '1px solid #1a2744', borderRadius: 8, color: '#e8edf5' }} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Area type="monotone" dataKey="Inbound" stroke="#00e5ff" fill="#00e5ff" fillOpacity={0.15} strokeWidth={2} />
            <Area type="monotone" dataKey="Outbound" stroke="#ffab00" fill="#ffab00" fillOpacity={0.15} strokeWidth={2} />
            <Area type="monotone" dataKey="Transit" stroke="#d500f9" fill="#d500f9" fillOpacity={0.15} strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Passenger Type — Dec 2024">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={[
                { name: 'Tourists', value: latest.tourists },
                { name: 'Nationals', value: latest.nationals },
                { name: 'Diplomats', value: latest.diplomats },
              ]} cx="50%" cy="50%" outerRadius={95} innerRadius={45} dataKey="value" label={({ name, percent }: any) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}>
                {[0, 1, 2].map(i => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#0f1a2e', border: '1px solid #1a2744', borderRadius: 8, color: '#e8edf5' }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Business vs Economy Class">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={classChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a2744" />
              <XAxis dataKey="month" tick={{ fill: '#7a8baa', fontSize: 11 }} />
              <YAxis tick={{ fill: '#7a8baa', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: '#0f1a2e', border: '1px solid #1a2744', borderRadius: 8, color: '#e8edf5' }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="Business" fill="#ffab00" radius={[2, 2, 0, 0]} />
              <Bar dataKey="Economy" fill="#00e5ff" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </>
  )
}

// ====== FLIGHT COUNT ======
function FlightCountView({ onDetail }: { onDetail: DetailSetter }) {
  const weeklyChart = flightCountSummary.map(r => ({
    route: r.route.replace('Paro - ', ''),
    Weekly: r.weekly,
  }))

  const annualChart = flightCountSummary.map(r => ({
    route: r.route.replace('Paro - ', ''),
    Annual: r.annual,
  }))

  const totalWeekly = flightCountSummary.reduce((s, r) => s + r.weekly, 0)
  const totalAnnual = flightCountSummary.reduce((s, r) => s + r.annual, 0)

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Routes" value={flightCountSummary.length.toString()} />
        <StatCard label="Weekly Flights" value={totalWeekly.toString()} color="#00e5ff" />
        <StatCard label="Monthly Flights" value={flightCountSummary.reduce((s, r) => s + r.monthly, 0).toString()} color="#00e676" />
        <StatCard label="Annual Flights" value={totalAnnual.toLocaleString()} color="#d500f9" />
      </div>

      <ChartCard title="Weekly Frequency by Route" onClick={() => onDetail({
        title: 'Flight Count — All Routes',
        data: flightCountSummary.map(r => ({
          Route: r.route,
          Aircraft: r.aircraft,
          Weekly: r.weekly,
          Monthly: r.monthly,
          Annual: r.annual,
        }))
      })}>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={weeklyChart} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#1a2744" />
            <XAxis type="number" tick={{ fill: '#7a8baa', fontSize: 11 }} />
            <YAxis type="category" dataKey="route" tick={{ fill: '#7a8baa', fontSize: 11 }} width={100} />
            <Tooltip contentStyle={{ background: '#0f1a2e', border: '1px solid #1a2744', borderRadius: 8, color: '#e8edf5' }} />
            <Bar dataKey="Weekly" fill="#ffab00" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Route details table */}
      <ChartCard title="Flight Schedule Details">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#1a2744] text-slate-500">
                <th className="text-left py-2 pr-4">Route</th>
                <th className="text-left py-2 pr-4">Aircraft</th>
                <th className="text-right py-2 pr-4">Weekly</th>
                <th className="text-right py-2 pr-4">Monthly</th>
                <th className="text-right py-2">Annual</th>
              </tr>
            </thead>
            <tbody>
              {flightCountSummary.map(r => (
                <tr key={r.route} className="border-b border-[#1a2744]/50 hover:bg-white/[0.02] transition-colors">
                  <td className="py-2.5 pr-4 text-slate-300 font-medium">{r.route}</td>
                  <td className="py-2.5 pr-4 text-slate-300">{r.aircraft}</td>
                  <td className="py-2.5 pr-4 text-right text-amber-400 font-mono">{r.weekly}</td>
                  <td className="py-2.5 pr-4 text-right text-slate-300">{r.monthly}</td>
                  <td className="py-2.5 text-right text-cyan-400 font-mono">{r.annual}</td>
                </tr>
              ))}
              <tr className="border-t-2 border-[#1a2744] font-bold">
                <td className="py-2.5 pr-4 text-slate-200" colSpan={2}>Total</td>
                <td className="py-2.5 pr-4 text-right text-amber-400 font-mono">{totalWeekly}</td>
                <td className="py-2.5 pr-4 text-right text-slate-200">{flightCountSummary.reduce((s, r) => s + r.monthly, 0)}</td>
                <td className="py-2.5 text-right text-cyan-400 font-mono">{totalAnnual}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </ChartCard>
    </>
  )
}

// ====== LOAD FACTOR ======
function LoadFactorView({ onDetail }: { onDetail: DetailSetter }) {
  const lfChart = loadFactorData.map(r => ({
    month: shortMonth(r.month),
    Average: r.avgLoadFactor,
    Business: r.businessLoadFactor,
    Economy: r.economyLoadFactor,
    Peak: r.peakLoadFactor,
  }))

  const latest = loadFactorData[loadFactorData.length - 1]
  const avgLF = (loadFactorData.reduce((s, r) => s + r.avgLoadFactor, 0) / 12).toFixed(1)

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Avg Load Factor" value={`${avgLF}%`} sub="2024 average" />
        <StatCard label="Peak Month LF" value={`${loadFactorData.reduce((max, r) => r.avgLoadFactor > max ? r.avgLoadFactor : max, 0)}%`} sub="Oct 2024" color="#00e676" />
        <StatCard label="Revenue/Seat" value={`Nu. ${(latest.revenuePerSeat / 1000).toFixed(1)}K`} sub="Dec 2024" color="#00e5ff" />
        <StatCard label="Seats Sold" value={latest.seatsSold.toLocaleString()} sub={`of ${latest.seatsAvailable.toLocaleString()} available`} color="#d500f9" />
      </div>

      <ChartCard title="Load Factor — Monthly Trend" onClick={() => onDetail({
        title: 'Load Factor — All Months',
        data: loadFactorData.map(r => ({
          Month: shortMonth(r.month),
          'Avg %': r.avgLoadFactor,
          'Business %': r.businessLoadFactor,
          'Economy %': r.economyLoadFactor,
          'Peak %': r.peakLoadFactor,
          'Seats Sold': r.seatsSold,
          'Revenue/Seat': r.revenuePerSeat,
        }))
      })}>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={lfChart}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1a2744" />
            <XAxis dataKey="month" tick={{ fill: '#7a8baa', fontSize: 11 }} />
            <YAxis tick={{ fill: '#7a8baa', fontSize: 11 }} domain={[40, 100]} />
            <Tooltip contentStyle={{ background: '#0f1a2e', border: '1px solid #1a2744', borderRadius: 8, color: '#e8edf5' }} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line type="monotone" dataKey="Average" stroke="#ffab00" strokeWidth={2.5} dot={{ r: 3, fill: '#ffab00' }} />
            <Line type="monotone" dataKey="Business" stroke="#d500f9" strokeWidth={2} dot={false} strokeDasharray="5 3" />
            <Line type="monotone" dataKey="Economy" stroke="#00e5ff" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="Peak" stroke="#ff1744" strokeWidth={1.5} dot={false} strokeDasharray="3 3" />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Seats Offered vs Sold">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={loadFactorData.map(r => ({
            month: shortMonth(r.month),
            Available: r.seatsAvailable,
            Sold: r.seatsSold,
          }))}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1a2744" />
            <XAxis dataKey="month" tick={{ fill: '#7a8baa', fontSize: 11 }} />
            <YAxis tick={{ fill: '#7a8baa', fontSize: 11 }} />
            <Tooltip contentStyle={{ background: '#0f1a2e', border: '1px solid #1a2744', borderRadius: 8, color: '#e8edf5' }} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="Available" fill="#1a2744" radius={[2, 2, 0, 0]} />
            <Bar dataKey="Sold" fill="#00e676" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </>
  )
}

// ====== FLEET / CAPACITY ======
function FleetView({ onDetail }: { onDetail: DetailSetter }) {
  const fleetRadar = fleetData.map(f => ({
    name: f.registration,
    Utilization: (f.avgUtilization / 10) * 100,
    Efficiency: ((5 - f.fuelEfficiency) / 5) * 100,
    Seats: (f.totalSeats / 140) * 100,
    Age: ((15 - f.ageYears) / 15) * 100,
  }))

  const routeRevChart = routePerformance.map(r => ({
    route: r.destination,
    Revenue: r.revenue,
    'Load %': r.loadFactor,
    Passengers: r.avgPassengers,
  }))

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Fleet Size" value={annualSummary.fleetSize.toString()} sub="Aircraft" />
        <StatCard label="Destinations" value={annualSummary.destinations.toString()} sub={`${annualSummary.countries} countries`} color="#00e5ff" />
        <StatCard label="Total Seats" value={fleetData.reduce((s, f) => s + f.totalSeats, 0).toString()} sub="Fleet capacity" color="#00e676" />
        <StatCard label="Avg Utilization" value={`${(fleetData.reduce((s, f) => s + f.avgUtilization, 0) / fleetData.length).toFixed(1)} hrs/day`} color="#d500f9" />
      </div>

      {/* Fleet table */}
      <ChartCard title="Fleet Details">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#1a2744] text-slate-500">
                <th className="text-left py-2 pr-4">Aircraft</th>
                <th className="text-left py-2 pr-4">Reg.</th>
                <th className="text-left py-2 pr-4">Type</th>
                <th className="text-right py-2 pr-4">Seats</th>
                <th className="text-right py-2 pr-4">Range</th>
                <th className="text-right py-2 pr-4">Util. (hrs/day)</th>
                <th className="text-right py-2 pr-4">Fuel Eff.</th>
                <th className="text-left py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {fleetData.map(f => (
                <tr key={f.registration} className="border-b border-[#1a2744]/50 hover:bg-white/[0.02] transition-colors">
                  <td className="py-2.5 pr-4 text-slate-300 font-medium">{f.aircraft}</td>
                  <td className="py-2.5 pr-4 font-mono text-amber-400">{f.registration}</td>
                  <td className="py-2.5 pr-4 text-slate-300">{f.type}</td>
                  <td className="py-2.5 pr-4 text-right text-slate-300">{f.totalSeats}</td>
                  <td className="py-2.5 pr-4 text-right text-slate-300">{f.range}</td>
                  <td className="py-2.5 pr-4 text-right text-cyan-400">{f.avgUtilization}</td>
                  <td className="py-2.5 pr-4 text-right text-slate-300">{f.fuelEfficiency} L/seat/100km</td>
                  <td className="py-2.5">
                    <span className="inline-flex items-center gap-1 text-[10px] text-green-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                      {f.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Fleet Comparison Radar">
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={fleetRadar}>
              <PolarGrid stroke="#1a2744" />
              <PolarAngleAxis dataKey="name" tick={{ fill: '#7a8baa', fontSize: 10 }} />
              <PolarRadiusAxis tick={false} />
              <Radar name="Utilization" dataKey="Utilization" stroke="#ffab00" fill="#ffab00" fillOpacity={0.1} />
              <Radar name="Efficiency" dataKey="Efficiency" stroke="#00e676" fill="#00e676" fillOpacity={0.1} />
              <Radar name="Capacity" dataKey="Seats" stroke="#00e5ff" fill="#00e5ff" fillOpacity={0.1} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </RadarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Route Revenue (Millions Nu.)" onClick={() => onDetail({
          title: 'Route Performance Details',
          data: routePerformance.map(r => ({
            Route: r.route,
            Destination: r.destination,
            Frequency: r.frequency,
            'Passengers': r.avgPassengers,
            'Load %': r.loadFactor,
            'Fare (Nu.)': r.avgFare,
            'Revenue (M)': r.revenue,
          }))
        })}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={routeRevChart} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#1a2744" />
              <XAxis type="number" tick={{ fill: '#7a8baa', fontSize: 11 }} />
              <YAxis type="category" dataKey="route" tick={{ fill: '#7a8baa', fontSize: 10 }} width={90} />
              <Tooltip contentStyle={{ background: '#0f1a2e', border: '1px solid #1a2744', borderRadius: 8, color: '#e8edf5' }} />
              <Bar dataKey="Revenue" fill="#ffab00" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </>
  )
}

// ====== LOADING / ERROR STATES ======
function LoadingState({ msg = 'Loading data from API...' }: { msg?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div className="w-8 h-8 rounded-full border-2 border-amber-500/30 border-t-amber-500 animate-spin" />
      <span className="text-xs text-slate-300">{msg}</span>
    </div>
  )
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-3">
      <svg viewBox="0 0 24 24" className="w-10 h-10 text-red-500/60" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeWidth={1.5} d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>
      <span className="text-xs font-medium text-red-400">API Unreachable</span>
      <span className="text-[11px] text-slate-300 max-w-xs text-center">{message}</span>
      <span className="text-[10px] text-slate-600 text-center">Ensure Tailscale is active — API at 100.85.189.71:8000</span>
    </div>
  )
}

// ====== P&L ======
function PLView({ onDetail }: { onDetail: DetailSetter }) {
  const [data, setData] = useState<ProfitLossItem[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true); setError(null)
    fetchProfitLoss()
      .then(d => { if (!cancelled) { setData(d); setLoading(false) } })
      .catch(e => { if (!cancelled) { setError(String(e.message)); setLoading(false) } })
    return () => { cancelled = true }
  }, [])

  if (loading) return <LoadingState msg="Fetching P&L data..." />
  if (error) return <ErrorState message={error} />
  if (!data || data.length === 0) return <LoadingState msg="No data returned" />

  const periods = aggregatePL(data)
  const recent = periods.slice(-10)
  const latest = periods[periods.length - 1]
  const plPeriod = fmtPeriod(data.map(d => d.date))

  const latestIncome = data.filter(i => i.date === latest?.date && i.category === 'Income' && i.amount)
  const incomeBreakdown = latestIncome.map(i => ({ name: i.particulars ?? 'Other', value: Math.abs(i.amount ?? 0) }))

  const latestExpenses = data.filter(i => i.date === latest?.date && i.category === 'Expenses' && i.amount)
  const expenseBreakdown = latestExpenses.map(i => ({ name: (i.particulars ?? 'Other').slice(0, 30), value: Math.abs(i.amount ?? 0) }))

  const plInsights: string[] = []
  if (latest) {
    const profitable = (latest.profit ?? 0) >= 0
    const margin = latest.income > 0 ? ((latest.profit / latest.income) * 100).toFixed(1) : '0'
    plInsights.push(
      `${profitable ? 'Profitable period' : 'Loss-making period'} — ${latest.label}: Revenue of ${fmtBTN(latest.income)} vs expenses of ${fmtBTN(latest.expenses)}, giving a ${profitable ? 'net profit' : 'net loss'} of ${fmtBTN(Math.abs(latest.profit))} (${margin}% margin).`
    )
    const topExpense = [...expenseBreakdown].sort((a, b) => b.value - a.value)[0]
    if (topExpense && latest.expenses > 0) {
      plInsights.push(
        `Largest cost driver: "${topExpense.name}" at ${fmtBTN(topExpense.value)} — ${((topExpense.value / latest.expenses) * 100).toFixed(0)}% of total operating costs. Employee costs and fuel are typically the two biggest cost lines in aviation.`
      )
    }
    if (periods.length >= 2) {
      const prev = periods[periods.length - 2]
      if (prev.income > 0) {
        const pct = ((latest.income - prev.income) / prev.income * 100)
        plInsights.push(
          `Revenue ${pct >= 0 ? 'grew' : 'declined'} ${Math.abs(pct).toFixed(1)}% vs ${prev.label}. ${periods.length} fiscal periods are available — click the chart to view the full historical breakdown.`
        )
      }
    }
  }

  return (
    <>
      <InsightBanner insights={plInsights} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Revenue" value={fmtBTN(latest?.income ?? 0)} sub={latest?.label} color="#00e676" period={plPeriod} />
        <StatCard label="Total Expenses" value={fmtBTN(latest?.expenses ?? 0)} sub="Operating expenses" color="#ff1744" period={plPeriod} />
        <StatCard label="Net Profit/Loss" value={fmtBTN(latest?.profit ?? 0)} sub={latest?.label} color={(latest?.profit ?? 0) >= 0 ? '#00e676' : '#ff6e40'} period={plPeriod} />
        <StatCard label="Periods Available" value={String(periods.length)} sub="Fiscal periods" color="#00e5ff" period={plPeriod} />
      </div>

      <ChartCard title="Revenue vs Expenses (BTN Billions)" period={plPeriod} onClick={() => onDetail({
        title: 'P&L — All Periods',
        data: periods.map(p => ({
          Period: p.label,
          'Revenue (M)': Math.round(p.income / 1e6),
          'Expenses (M)': Math.round(p.expenses / 1e6),
          'Net Profit (M)': Math.round(p.profit / 1e6),
        }))
      })}>
        <ResponsiveContainer width="100%" height={320}>
          <ComposedChart data={recent}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1a2744" />
            <XAxis dataKey="label" tick={{ fill: '#7a8baa', fontSize: 10 }} />
            <YAxis yAxisId="left" tick={{ fill: '#7a8baa', fontSize: 10 }} tickFormatter={v => `${(Number(v) / 1e9).toFixed(1)}B`} />
            <YAxis yAxisId="right" orientation="right" tick={{ fill: '#7a8baa', fontSize: 10 }} tickFormatter={v => `${(Number(v) / 1e9).toFixed(1)}B`} />
            <Tooltip contentStyle={tipStyle} formatter={(v, n) => [fmtBTN(Number(v)), String(n)]} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar yAxisId="left" dataKey="income" name="Revenue" fill="#00e676" fillOpacity={0.8} radius={[2, 2, 0, 0]} />
            <Bar yAxisId="left" dataKey="expenses" name="Expenses" fill="#ff1744" fillOpacity={0.7} radius={[2, 2, 0, 0]} />
            <Line yAxisId="right" type="monotone" dataKey="profit" name="Net Profit" stroke="#ffab00" strokeWidth={2.5} dot={{ r: 3, fill: '#ffab00' }} />
          </ComposedChart>
        </ResponsiveContainer>
      </ChartCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title={`Income Breakdown — ${latest?.label ?? ''}`} period={plPeriod}>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={incomeBreakdown} cx="50%" cy="50%" outerRadius={95} innerRadius={40} dataKey="value"
                label={({ percent }: any) => (percent ?? 0) > 0.05 ? `${((percent ?? 0) * 100).toFixed(0)}%` : ''}>
                {incomeBreakdown.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={tipStyle} formatter={(v) => [fmtBTN(Number(v)), 'Amount']} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title={`Top Expense Lines — ${latest?.label ?? ''}`} period={plPeriod} onClick={() => onDetail({
          title: 'Expense Breakdown',
          data: expenseBreakdown.map(e => ({ Particular: e.name, 'Amount (M Nu.)': Math.round(e.value / 1e6) }))
        })}>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={expenseBreakdown.slice(0, 8)} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#1a2744" />
              <XAxis type="number" tick={{ fill: '#7a8baa', fontSize: 10 }} tickFormatter={v => `${(Number(v) / 1e6).toFixed(0)}M`} />
              <YAxis type="category" dataKey="name" tick={{ fill: '#7a8baa', fontSize: 9 }} width={130} />
              <Tooltip contentStyle={tipStyle} formatter={(v) => [fmtBTN(Number(v)), 'Amount']} />
              <Bar dataKey="value" name="Amount" fill="#ff6e40" fillOpacity={0.8} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </>
  )
}

// ====== BALANCE SHEET ======
function BalanceSheetView({ onDetail }: { onDetail: DetailSetter }) {
  const [data, setData] = useState<BalanceSheetItem[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true); setError(null)
    fetchBalanceSheet()
      .then(d => { if (!cancelled) { setData(d); setLoading(false) } })
      .catch(e => { if (!cancelled) { setError(String(e.message)); setLoading(false) } })
    return () => { cancelled = true }
  }, [])

  if (loading) return <LoadingState msg="Fetching Balance Sheet data..." />
  if (error) return <ErrorState message={error} />
  if (!data || data.length === 0) return <LoadingState msg="No data returned" />

  const periods = aggregateBS(data)
  const recent = periods.slice(-10)
  const latest = periods[periods.length - 1]
  const bsPeriod = fmtPeriod(data.map(d => d.date))

  const latestAssets = data.filter(i => i.date === latest?.date && i.category === 'Assets' && i.amount)
  const assetPie = latestAssets
    .map(i => ({ name: (i.particulars ?? 'Other').replace('(Current)', '').replace('(Non-Current)', 'NC').trim(), value: Math.abs(i.amount ?? 0) }))
    .sort((a, b) => b.value - a.value).slice(0, 8)

  const equityItems = data.filter(i => i.date === latest?.date && i.subcategory === 'Equity' && i.amount)

  const bsInsights: string[] = []
  if (latest) {
    const equityPct = latest.totalAssets > 0 ? ((latest.equity / latest.totalAssets) * 100).toFixed(0) : '0'
    const liabPct = latest.totalAssets > 0 ? ((latest.totalLiabilities / latest.totalAssets) * 100).toFixed(0) : '0'
    const dte = latest.equity > 0 ? (latest.totalLiabilities / latest.equity).toFixed(2) : 'N/A'
    bsInsights.push(
      `${latest.label}: Total assets of ${fmtBTN(latest.totalAssets)} — funded ${equityPct}% by shareholders' equity and ${liabPct}% by liabilities. Debt-to-equity ratio: ${dte} (below 2.0 is generally considered healthy for aviation).`
    )
    const topAsset = assetPie[0]
    if (topAsset && latest.totalAssets > 0) {
      bsInsights.push(
        `Largest asset: "${topAsset.name}" at ${fmtBTN(topAsset.value)} (${((topAsset.value / latest.totalAssets) * 100).toFixed(0)}% of total assets). Aircraft, property and equipment typically dominate an airline's asset base.`
      )
    }
    if (periods.length >= 2) {
      const first = periods[0]
      const growth = first.totalAssets > 0 ? ((latest.totalAssets - first.totalAssets) / first.totalAssets * 100).toFixed(0) : '0'
      bsInsights.push(
        `Total assets ${Number(growth) >= 0 ? 'grew' : 'contracted'} ${Math.abs(Number(growth))}% from ${first.label} to ${latest.label}, reflecting ${Number(growth) >= 0 ? 'ongoing fleet and infrastructure investment' : 'asset disposal or accumulated depreciation'}.`
      )
    }
  }

  return (
    <>
      <InsightBanner insights={bsInsights} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Assets" value={fmtBTN(latest?.totalAssets ?? 0)} sub={latest?.label} color="#00e5ff" period={bsPeriod} />
        <StatCard label="Total Liabilities" value={fmtBTN(latest?.totalLiabilities ?? 0)} sub="Non-equity" color="#ff6e40" period={bsPeriod} />
        <StatCard label="Net Equity" value={fmtBTN(latest?.equity ?? 0)} sub={latest?.label} color="#00e676" period={bsPeriod} />
        <StatCard label="Periods" value={String(periods.length)} sub="Balance sheet snapshots" period={bsPeriod} />
      </div>

      <ChartCard title="Assets vs Liabilities Trend (BTN Billions)" period={bsPeriod} onClick={() => onDetail({
        title: 'Balance Sheet — All Periods',
        data: periods.map(p => ({
          Period: p.label,
          'Total Assets (M)': Math.round(p.totalAssets / 1e6),
          'Total Liabilities (M)': Math.round(p.totalLiabilities / 1e6),
          'Equity (M)': Math.round(p.equity / 1e6),
        }))
      })}>
        <ResponsiveContainer width="100%" height={320}>
          <ComposedChart data={recent}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1a2744" />
            <XAxis dataKey="label" tick={{ fill: '#7a8baa', fontSize: 10 }} />
            <YAxis tick={{ fill: '#7a8baa', fontSize: 10 }} tickFormatter={v => `${(Number(v) / 1e9).toFixed(1)}B`} />
            <Tooltip contentStyle={tipStyle} formatter={(v, n) => [fmtBTN(Number(v)), String(n)]} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="totalAssets" name="Total Assets" fill="#00e5ff" fillOpacity={0.6} radius={[2, 2, 0, 0]} />
            <Bar dataKey="totalLiabilities" name="Liabilities" fill="#ff6e40" fillOpacity={0.6} radius={[2, 2, 0, 0]} />
            <Line type="monotone" dataKey="equity" name="Net Equity" stroke="#00e676" strokeWidth={2.5} dot={{ r: 3, fill: '#00e676' }} />
          </ComposedChart>
        </ResponsiveContainer>
      </ChartCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title={`Asset Composition — ${latest?.label ?? ''}`} period={bsPeriod}>
          <ResponsiveContainer width="100%" height={290}>
            <PieChart>
              <Pie data={assetPie} cx="50%" cy="50%" outerRadius={95} innerRadius={40} dataKey="value"
                label={({ percent }: any) => (percent ?? 0) > 0.06 ? `${((percent ?? 0) * 100).toFixed(0)}%` : ''}>
                {assetPie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={tipStyle} formatter={(v) => [fmtBTN(Number(v)), 'Amount']} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title={`Equity Components — ${latest?.label ?? ''}`} period={bsPeriod} onClick={() => onDetail({
          title: 'Equity Detail',
          data: equityItems.map(i => ({ Component: i.particulars ?? '—', 'Amount (M Nu.)': Math.round(Math.abs(i.amount ?? 0) / 1e6) }))
        })}>
          <ResponsiveContainer width="100%" height={290}>
            <BarChart data={equityItems.map(i => ({ name: (i.particulars ?? 'Other').slice(0, 22), value: Math.abs(i.amount ?? 0) }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a2744" />
              <XAxis dataKey="name" tick={{ fill: '#7a8baa', fontSize: 9 }} />
              <YAxis tick={{ fill: '#7a8baa', fontSize: 10 }} tickFormatter={v => `${(Number(v) / 1e9).toFixed(1)}B`} />
              <Tooltip contentStyle={tipStyle} formatter={(v) => [fmtBTN(Number(v)), 'Amount']} />
              <Bar dataKey="value" name="Amount" fill="#00e676" fillOpacity={0.8} radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </>
  )
}

// ====== CASH FLOW ======
function CashFlowView({ onDetail }: { onDetail: DetailSetter }) {
  const [data, setData] = useState<CashFlowItem[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true); setError(null)
    fetchCashFlow()
      .then(d => { if (!cancelled) { setData(d); setLoading(false) } })
      .catch(e => { if (!cancelled) { setError(String(e.message)); setLoading(false) } })
    return () => { cancelled = true }
  }, [])

  if (loading) return <LoadingState msg="Fetching Cash Flow data..." />
  if (error) return <ErrorState message={error} />
  if (!data || data.length === 0) return <LoadingState msg="No data returned" />

  const periods = aggregateCF(data)
  const recent = periods.slice(-10)
  const latest = periods[periods.length - 1]
  const cfPeriod = fmtPeriod(data.map(d => d.date))

  const cfInsights: string[] = []
  if (latest) {
    const ocfPositive = (latest.operating ?? 0) >= 0
    cfInsights.push(
      `Operating activities ${ocfPositive ? 'generated' : 'consumed'} ${fmtBTN(Math.abs(latest.operating ?? 0))} — ${ocfPositive ? 'the core aviation business is generating real cash, a strong signal of operational health' : 'operating costs are exceeding cash inflows, which warrants attention on cost efficiency'}.`
    )
    const netChange = (latest.closing ?? 0) - (latest.opening ?? 0)
    cfInsights.push(
      `Cash position ${netChange >= 0 ? 'improved' : 'declined'} by ${fmtBTN(Math.abs(netChange))} in ${latest.label}, closing at ${fmtBTN(latest.closing ?? 0)}. ${netChange >= 0 ? 'A growing cash reserve strengthens resilience for fleet maintenance and expansion.' : 'A declining balance requires liquidity planning to ensure operational continuity.'}`
    )
    cfInsights.push(
      `Investing outflow of ${fmtBTN(Math.abs(latest.investing ?? 0))} typically reflects capital expenditure on aircraft, engines or ground infrastructure. Negative investing CF is normal and expected for a growing airline.`
    )
  }

  return (
    <>
      <InsightBanner insights={cfInsights} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Operating CF" value={fmtBTN(latest?.operating ?? 0)} sub={latest?.label} color={(latest?.operating ?? 0) >= 0 ? '#00e676' : '#ff6e40'} period={cfPeriod} />
        <StatCard label="Investing CF" value={fmtBTN(latest?.investing ?? 0)} sub="Capex / investments" color={(latest?.investing ?? 0) >= 0 ? '#00e5ff' : '#ff6e40'} period={cfPeriod} />
        <StatCard label="Financing CF" value={fmtBTN(latest?.financing ?? 0)} sub="Debt / dividends" color="#d500f9" period={cfPeriod} />
        <StatCard label="Closing Cash" value={fmtBTN(latest?.closing ?? 0)} sub={`Opening: ${fmtBTN(latest?.opening ?? 0)}`} color="#ffab00" period={cfPeriod} />
      </div>

      <ChartCard title="Cash Flow by Activity (BTN Billions)" period={cfPeriod} onClick={() => onDetail({
        title: 'Cash Flow — All Periods',
        data: periods.map(p => ({
          Period: p.label,
          'Operating (M)': Math.round(p.operating / 1e6),
          'Investing (M)': Math.round(p.investing / 1e6),
          'Financing (M)': Math.round(p.financing / 1e6),
          'Net (M)': Math.round(p.net / 1e6),
        }))
      })}>
        <ResponsiveContainer width="100%" height={320}>
          <ComposedChart data={recent}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1a2744" />
            <XAxis dataKey="label" tick={{ fill: '#7a8baa', fontSize: 10 }} />
            <YAxis tick={{ fill: '#7a8baa', fontSize: 10 }} tickFormatter={v => `${(Number(v) / 1e9).toFixed(1)}B`} />
            <Tooltip contentStyle={tipStyle} formatter={(v, n) => [fmtBTN(Number(v)), String(n)]} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="operating" name="Operating" fill="#00e676" fillOpacity={0.7} radius={[2, 2, 0, 0]} />
            <Bar dataKey="investing" name="Investing" fill="#ff1744" fillOpacity={0.7} radius={[2, 2, 0, 0]} />
            <Bar dataKey="financing" name="Financing" fill="#d500f9" fillOpacity={0.7} radius={[2, 2, 0, 0]} />
            <Line type="monotone" dataKey="net" name="Net Change" stroke="#ffab00" strokeWidth={2.5} dot={{ r: 3, fill: '#ffab00' }} />
          </ComposedChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Cash Balance Trend (BTN Billions)" period={cfPeriod} onClick={() => onDetail({
        title: 'Cash Position — All Periods',
        data: periods.map(p => ({
          Period: p.label,
          'Opening (M)': Math.round(p.opening / 1e6),
          'Closing (M)': Math.round(p.closing / 1e6),
          'Change (M)': Math.round((p.closing - p.opening) / 1e6),
        }))
      })}>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={recent}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1a2744" />
            <XAxis dataKey="label" tick={{ fill: '#7a8baa', fontSize: 10 }} />
            <YAxis tick={{ fill: '#7a8baa', fontSize: 10 }} tickFormatter={v => `${(Number(v) / 1e9).toFixed(1)}B`} />
            <Tooltip contentStyle={tipStyle} formatter={(v, n) => [fmtBTN(Number(v)), String(n)]} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Area type="monotone" dataKey="opening" name="Opening Cash" stroke="#7a8baa" fill="#7a8baa" fillOpacity={0.1} strokeWidth={1.5} strokeDasharray="4 2" />
            <Area type="monotone" dataKey="closing" name="Closing Cash" stroke="#ffab00" fill="#ffab00" fillOpacity={0.15} strokeWidth={2.5} />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>
    </>
  )
}

const MASTER_DATA_YEARS = [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018] // available for data explorer

// ====== PASSENGERS ======
function PassengersView({ onDetail }: { onDetail: DetailSetter }) {
  const [masterData, setMasterData] = useState<MasterDataItem[] | null>(null)
  const [paxData, setPaxData] = useState<PassengerTrafficItem[] | null>(null)
  const [paxTotal, setPaxTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true); setError(null)
    Promise.all([fetchMasterData(4000, 2025), fetchPassengerTraffic(1, 1000)])
      .then(([md, pt]) => {
        if (!cancelled) {
          setMasterData(md); setPaxData(pt.data); setPaxTotal(pt.total); setLoading(false)
        }
      })
      .catch(e => { if (!cancelled) { setError(String(e.message)); setLoading(false) } })
    return () => { cancelled = true }
  }, [])

  if (loading) return <LoadingState msg="Fetching passenger data..." />
  if (error) return <ErrorState message={error} />
  if (!masterData) return <LoadingState msg="No data returned" />

  const yearlyStats = aggregateMasterByYear(masterData)
  const recentYearly = yearlyStats.filter(y => y.year === 2025)
  const byMonth = paxData ? aggregatePaxByMonth(paxData) : []
  const byRoute = paxData ? aggregatePaxByRoute(paxData, 10) : []
  const latest = yearlyStats.find(y => y.year === 2025) ?? yearlyStats[yearlyStats.length - 1]
  const masterPeriod = 'As of 2025'
  const paxPeriod = fmtPeriod(paxData ? paxData.map(d => d.mnth) : [])

  const paxInsights: string[] = []
  if (yearlyStats.length > 0 && latest) {
    const benchmark = 75
    const status = latest.loadFactor >= benchmark ? 'above' : 'below'
    paxInsights.push(
      `In ${latest.year}, Drukair carried ${latest.pax.toLocaleString()} passengers across ${latest.sectors} sectors with a load factor of ${latest.loadFactor}% — ${status} the ~${benchmark}% industry efficiency benchmark. Load factor = RPK ÷ ASK (revenue seat-km ÷ available seat-km).`
    )
    const peak = yearlyStats.reduce((b, y) => y.pax > b.pax ? y : b, yearlyStats[0])
    if (peak.year !== latest.year) {
      paxInsights.push(
        `Peak traffic was recorded in ${peak.year} with ${peak.pax.toLocaleString()} passengers. ${latest.year} volume is ${((latest.pax / peak.pax) * 100).toFixed(0)}% of that peak — reflecting post-pandemic recovery in Bhutan's international aviation market.`
      )
    }
    const avgLF = (yearlyStats.reduce((s, y) => s + y.loadFactor, 0) / yearlyStats.length).toFixed(1)
    paxInsights.push(
      `ASK (Available Seat Kilometres) = capacity offered; RPK (Revenue Passenger Kilometres) = capacity sold. Average load factor across all ${yearlyStats.length} data years: ${avgLF}%. Route charts below show a sample — click for full detail.`
    )
  }

  return (
    <>
      <InsightBanner insights={paxInsights} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label={`Passengers (${latest?.year ?? ''})`} value={latest ? `${Math.round(latest.pax / 1000)}K` : '—'} sub="Annual total from master data" period={masterPeriod} />
        <StatCard label="ASK" value={latest ? `${(latest.ask / 1e6).toFixed(0)}M SKm` : '—'} sub={`${latest?.year ?? ''}`} color="#00e5ff" period={masterPeriod} />
        <StatCard label="RPK" value={latest ? `${(latest.rpk / 1e6).toFixed(0)}M PKm` : '—'} sub={`${latest?.year ?? ''}`} color="#00e676" period={masterPeriod} />
        <StatCard label="Load Factor" value={`${latest?.loadFactor ?? '—'}%`} sub={`${latest?.year ?? ''} RPK/ASK`} color="#ffab00" period={masterPeriod} />
      </div>

      <ChartCard title="Passenger Overview — 2025" period={masterPeriod} onClick={() => onDetail({
        title: 'Annual Passenger Data — All Years',
        data: yearlyStats.map(y => ({
          Year: y.year, Passengers: y.pax, Flights: y.flights, 'Load %': y.loadFactor, Sectors: y.sectors,
        }))
      })}>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={recentYearly}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1a2744" />
            <XAxis dataKey="year" tick={{ fill: '#7a8baa', fontSize: 11 }} />
            <YAxis yAxisId="left" tick={{ fill: '#7a8baa', fontSize: 11 }} tickFormatter={v => `${(Number(v) / 1000).toFixed(0)}K`} />
            <YAxis yAxisId="right" orientation="right" tick={{ fill: '#7a8baa', fontSize: 11 }} domain={[0, 100]} />
            <Tooltip contentStyle={tipStyle} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar yAxisId="left" dataKey="pax" name="Passengers" fill="#00e5ff" fillOpacity={0.7} radius={[2, 2, 0, 0]} />
            <Line yAxisId="right" type="monotone" dataKey="loadFactor" name="Load Factor %" stroke="#ffab00" strokeWidth={2.5} dot={{ r: 3 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="ASK vs RPK — 2025" period={masterPeriod}>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={recentYearly}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1a2744" />
            <XAxis dataKey="year" tick={{ fill: '#7a8baa', fontSize: 11 }} />
            <YAxis tick={{ fill: '#7a8baa', fontSize: 11 }} tickFormatter={v => `${(Number(v) / 1e6).toFixed(0)}M`} />
            <Tooltip contentStyle={tipStyle} formatter={(v, n) => [`${(Number(v) / 1e6).toFixed(1)}M km`, String(n)]} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Area type="monotone" dataKey="ask" name="ASK" stroke="#00e5ff" fill="#00e5ff" fillOpacity={0.15} strokeWidth={2} />
            <Area type="monotone" dataKey="rpk" name="RPK" stroke="#00e676" fill="#00e676" fillOpacity={0.15} strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      {(byRoute.length > 0 || byMonth.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {byRoute.length > 0 && (
            <ChartCard title={`Top Routes — Sample (${paxData?.length ?? 0} tickets)`} period={paxPeriod} onClick={() => onDetail({
              title: 'Top Routes — Passenger Traffic Sample',
              data: byRoute.map(r => ({ Route: r.route, Passengers: r.pax, 'Revenue (Nu.)': Math.round(r.revenue), Type: r.dom_int }))
            })}>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={byRoute} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a2744" />
                  <XAxis type="number" tick={{ fill: '#7a8baa', fontSize: 10 }} />
                  <YAxis type="category" dataKey="route" tick={{ fill: '#7a8baa', fontSize: 10 }} width={80} />
                  <Tooltip contentStyle={tipStyle} />
                  <Bar dataKey="pax" name="Passengers" fill="#00e676" fillOpacity={0.8} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          )}
          {byMonth.length > 0 && (
            <ChartCard title="Monthly DOM vs INT (Sample Page)" period={paxPeriod}>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={byMonth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a2744" />
                  <XAxis dataKey="label" tick={{ fill: '#7a8baa', fontSize: 10 }} />
                  <YAxis tick={{ fill: '#7a8baa', fontSize: 10 }} />
                  <Tooltip contentStyle={tipStyle} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="intl" name="International" fill="#00e5ff" fillOpacity={0.8} stackId="a" />
                  <Bar dataKey="dom" name="Domestic" fill="#d500f9" fillOpacity={0.8} stackId="a" />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          )}
        </div>
      )}

      {paxTotal > 0 && (
        <div className="text-[10px] text-slate-600 text-center">
          Route &amp; monthly charts show a sample of {paxData?.length ?? 0} tickets from {paxTotal.toLocaleString()} total records.
        </div>
      )}
    </>
  )
}

// ====== FLEET & OPS ======
function FleetOpsView({ onDetail }: { onDetail: DetailSetter }) {
  const [data, setData] = useState<MasterDataItem[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true); setError(null)
    fetchMasterData(4000, 2025)
      .then(d => { if (!cancelled) { setData(d); setLoading(false) } })
      .catch(e => { if (!cancelled) { setError(String(e.message)); setLoading(false) } })
    return () => { cancelled = true }
  }, [])

  if (loading) return <LoadingState msg="Fetching fleet & operations data..." />
  if (error) return <ErrorState message={error} />
  if (!data || data.length === 0) return <LoadingState msg="No data returned" />

  const yearlyStats = aggregateMasterByYear(data)
  const sectorStats = aggregateMasterBySector(data, 12)
  const latest = yearlyStats[yearlyStats.length - 1]
  const fleetPeriod = (() => {
    return fmtYearPeriod(yearlyStats.map(y => y.year))
  })()

  const flightTypeMap = new Map<string, { pax: number; flights: number }>()
  for (const d of data) {
    const ft = d.flight_type
    const prev = flightTypeMap.get(ft) ?? { pax: 0, flights: 0 }
    flightTypeMap.set(ft, { pax: prev.pax + (d.total_pax ?? 0), flights: prev.flights + (d.no_of_flts ?? 0) })
  }
  const flightTypeSummary = Array.from(flightTypeMap.entries())
    .map(([type, v]) => ({ type, ...v })).sort((a, b) => b.pax - a.pax)

  const fleetInsights: string[] = []
  if (latest) {
    fleetInsights.push(
      `In ${latest.year}, Drukair operated ${latest.flights.toLocaleString()} flights across ${latest.sectors} active sectors, logging ${latest.bhours.toLocaleString()} block hours. Block hours are the primary metric for fleet utilisation and maintenance interval scheduling.`
    )
    const topSector = sectorStats[0]
    if (topSector) {
      fleetInsights.push(
        `Busiest route sector: "${topSector.sector}" with ${topSector.pax.toLocaleString()} passengers and a load factor of ${topSector.loadFactor}% — ${topSector.loadFactor >= 75 ? 'performing above the 75% efficiency benchmark' : 'operating below the 75% benchmark, with room to optimise seat fill'}.`
      )
    }
    fleetInsights.push(
      `Flight types: SCH (scheduled) and ADD (additional/charter) services operated on A319 jets and ATR-42 turboprops. The pie chart below shows how passenger volume is distributed across fleet and service types.`
    )
  }

  return (
    <>
      <InsightBanner insights={fleetInsights} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label={`Block Hours (${latest?.year ?? ''})`} value={latest ? latest.bhours.toLocaleString() : '—'} sub="Total block hours" period={fleetPeriod} />
        <StatCard label="Active Sectors" value={latest ? String(latest.sectors) : '—'} sub={`${latest?.year ?? ''}`} color="#00e5ff" period={fleetPeriod} />
        <StatCard label="Total Flights" value={latest ? latest.flights.toLocaleString() : '—'} sub={`${latest?.year ?? ''}`} color="#00e676" period={fleetPeriod} />
        <StatCard label="Load Factor" value={`${latest?.loadFactor ?? '—'}%`} sub={`${latest?.year ?? ''}`} color="#ffab00" period={fleetPeriod} />
      </div>

      <ChartCard title="Block Hours & Load Factor by Year" period={fleetPeriod} onClick={() => onDetail({
        title: 'Fleet Operations — Annual Summary',
        data: yearlyStats.map(y => ({
          Year: y.year, Flights: y.flights, 'Block Hrs': y.bhours,
          'ASK (M)': Math.round(y.ask / 1e6), 'RPK (M)': Math.round(y.rpk / 1e6),
          'Load %': y.loadFactor, Sectors: y.sectors,
        }))
      })}>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={yearlyStats}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1a2744" />
            <XAxis dataKey="year" tick={{ fill: '#7a8baa', fontSize: 11 }} />
            <YAxis yAxisId="left" tick={{ fill: '#7a8baa', fontSize: 11 }} />
            <YAxis yAxisId="right" orientation="right" tick={{ fill: '#7a8baa', fontSize: 11 }} domain={[0, 100]} />
            <Tooltip contentStyle={tipStyle} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar yAxisId="left" dataKey="bhours" name="Block Hours" fill="#00e5ff" fillOpacity={0.65} radius={[2, 2, 0, 0]} />
            <Bar yAxisId="left" dataKey="flights" name="Flights" fill="#d500f9" fillOpacity={0.65} radius={[2, 2, 0, 0]} />
            <Line yAxisId="right" type="monotone" dataKey="loadFactor" name="Load Factor %" stroke="#ffab00" strokeWidth={2.5} dot={{ r: 3 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Top Sectors by Passengers" period={fleetPeriod} onClick={() => onDetail({
        title: 'Sector Performance',
        data: sectorStats.map(s => ({ Sector: s.sector, Passengers: s.pax, Flights: s.flights, 'Load %': s.loadFactor }))
      })}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={sectorStats} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#1a2744" />
            <XAxis type="number" tick={{ fill: '#7a8baa', fontSize: 10 }} tickFormatter={v => `${(Number(v) / 1000).toFixed(0)}K`} />
            <YAxis type="category" dataKey="sector" tick={{ fill: '#7a8baa', fontSize: 9 }} width={120} />
            <Tooltip contentStyle={tipStyle} />
            <Bar dataKey="pax" name="Passengers" fill="#ffab00" fillOpacity={0.8} radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Passengers by Flight Type" period={fleetPeriod}>
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie data={flightTypeSummary} cx="50%" cy="50%" outerRadius={90} innerRadius={40}
              dataKey="pax" nameKey="type"
              label={({ name, percent }: any) => (percent ?? 0) > 0.05 ? String(name ?? '').split('-')[0] : ''}>
              {flightTypeSummary.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip contentStyle={tipStyle} formatter={(v) => [`${Number(v).toLocaleString()} pax`, 'Passengers']} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>
    </>
  )
}
