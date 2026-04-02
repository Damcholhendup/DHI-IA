'use client'

import { useState } from 'react'
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ComposedChart
} from 'recharts'
import {
  flightOpsData, passengerTrafficData, loadFactorData, fleetData,
  routePerformance, cargoData, rotaryOpsData, flightCountSummary, annualSummary
} from '../data/drukair-data'

const COLORS = ['#00e5ff', '#ffab00', '#00e676', '#ff1744', '#d500f9', '#ffd600', '#00bfa5', '#ff6e40']
const subtabs = ['Flight Ops', 'Passenger Traffic', 'Flight Count', 'Load Factor', 'Capacity & Fleet', 'Cargo', 'Rotary Ops']

function shortMonth(m: string) { return m.replace(' 2024', '').slice(0, 3) }

export default function DrukAirDashboard() {
  const [activeSubTab, setActiveSubTab] = useState('Flight Ops')
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
                  : 'text-slate-500 hover:text-slate-300 border border-transparent hover:bg-white/[0.02]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content — split layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: charts */}
        <div className={`overflow-y-auto p-6 space-y-6 transition-all ${detailPanel ? 'w-[60%]' : 'w-full'}`}>
          {activeSubTab === 'Flight Ops' && <FlightOpsView onDetail={setDetailPanel} />}
          {activeSubTab === 'Passenger Traffic' && <PassengerView onDetail={setDetailPanel} />}
          {activeSubTab === 'Flight Count' && <FlightCountView onDetail={setDetailPanel} />}
          {activeSubTab === 'Load Factor' && <LoadFactorView onDetail={setDetailPanel} />}
          {activeSubTab === 'Capacity & Fleet' && <FleetView onDetail={setDetailPanel} />}
          {activeSubTab === 'Cargo' && <CargoView onDetail={setDetailPanel} />}
          {activeSubTab === 'Rotary Ops' && <RotaryView onDetail={setDetailPanel} />}
        </div>

        {/* Right: detail panel */}
        {detailPanel && (
          <div className="w-[40%] border-l border-[#1a2744] overflow-y-auto p-5 animate-fade-in-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-amber-400">{detailPanel.title}</h3>
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

type DetailSetter = (detail: { title: string; data: Array<Record<string, string | number>> } | null) => void

function StatCard({ label, value, sub, color = '#ffab00' }: { label: string; value: string; sub?: string; color?: string }) {
  return (
    <div className="rounded-xl bg-[#0c1425] border border-[#1a2744] p-4 hover:border-opacity-60 transition-all" style={{ borderColor: `${color}20` }}>
      <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600 block mb-1">{label}</span>
      <span className="text-xl font-bold block" style={{ color }}>{value}</span>
      {sub && <span className="text-[10px] text-slate-500 mt-1 block">{sub}</span>}
    </div>
  )
}

function ChartCard({ title, children, onClick }: { title: string; children: React.ReactNode; onClick?: () => void }) {
  return (
    <div
      className={`rounded-xl bg-[#0c1425] border border-[#1a2744] p-5 ${onClick ? 'cursor-pointer hover:border-amber-500/30 transition-colors group' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">{title}</h3>
        {onClick && <span className="text-[9px] text-slate-600 group-hover:text-amber-400 transition-colors">Click for details &rarr;</span>}
      </div>
      {children}
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
                  <td className="py-2.5 pr-4 text-slate-400">{r.aircraft}</td>
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
                  <td className="py-2.5 pr-4 text-slate-400">{f.type}</td>
                  <td className="py-2.5 pr-4 text-right text-slate-300">{f.totalSeats}</td>
                  <td className="py-2.5 pr-4 text-right text-slate-400">{f.range}</td>
                  <td className="py-2.5 pr-4 text-right text-cyan-400">{f.avgUtilization}</td>
                  <td className="py-2.5 pr-4 text-right text-slate-400">{f.fuelEfficiency} L/seat/100km</td>
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

// ====== CARGO ======
function CargoView({ onDetail }: { onDetail: DetailSetter }) {
  const cargoChart = cargoData.map(r => ({
    month: shortMonth(r.month),
    Inbound: r.inboundCargoKg / 1000,
    Outbound: r.outboundCargoKg / 1000,
  }))

  const typeChart = cargoData.map(r => ({
    month: shortMonth(r.month),
    General: r.generalKg / 1000,
    Perishable: r.perishableKg / 1000,
    Valuable: r.valuableKg / 1000,
    Mail: r.mailKg / 1000,
  }))

  const latest = cargoData[cargoData.length - 1]
  const totalAnnual = cargoData.reduce((s, r) => s + r.totalCargoKg, 0)

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Dec Cargo" value={`${(latest.totalCargoKg / 1000).toFixed(1)} tons`} />
        <StatCard label="Annual Cargo" value={`${(totalAnnual / 1000).toFixed(0)} tons`} sub="2024" color="#00e5ff" />
        <StatCard label="Dec Revenue" value={`Nu. ${(latest.revenueNu / 1000).toFixed(1)}M`} color="#00e676" />
        <StatCard label="Rate/kg" value={`Nu. ${latest.avgRatePerKg}`} sub="Dec 2024" color="#d500f9" />
      </div>

      <ChartCard title="Cargo Volume — Inbound vs Outbound (Tons)" onClick={() => onDetail({
        title: 'Cargo Details — All Months',
        data: cargoData.map(r => ({
          Month: shortMonth(r.month),
          'Total (kg)': r.totalCargoKg,
          Inbound: r.inboundCargoKg,
          Outbound: r.outboundCargoKg,
          'Revenue (K)': r.revenueNu,
          'Rate/kg': r.avgRatePerKg,
        }))
      })}>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={cargoChart}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1a2744" />
            <XAxis dataKey="month" tick={{ fill: '#7a8baa', fontSize: 11 }} />
            <YAxis tick={{ fill: '#7a8baa', fontSize: 11 }} />
            <Tooltip contentStyle={{ background: '#0f1a2e', border: '1px solid #1a2744', borderRadius: 8, color: '#e8edf5' }} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Area type="monotone" dataKey="Inbound" stroke="#00e5ff" fill="#00e5ff" fillOpacity={0.15} strokeWidth={2} />
            <Area type="monotone" dataKey="Outbound" stroke="#ffab00" fill="#ffab00" fillOpacity={0.15} strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Cargo by Type (Tons)">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={typeChart}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1a2744" />
            <XAxis dataKey="month" tick={{ fill: '#7a8baa', fontSize: 11 }} />
            <YAxis tick={{ fill: '#7a8baa', fontSize: 11 }} />
            <Tooltip contentStyle={{ background: '#0f1a2e', border: '1px solid #1a2744', borderRadius: 8, color: '#e8edf5' }} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="General" stackId="a" fill="#00e5ff" />
            <Bar dataKey="Perishable" stackId="a" fill="#00e676" />
            <Bar dataKey="Valuable" stackId="a" fill="#ffab00" />
            <Bar dataKey="Mail" stackId="a" fill="#d500f9" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </>
  )
}

// ====== ROTARY OPS ======
function RotaryView({ onDetail }: { onDetail: DetailSetter }) {
  const rotaryChart = rotaryOpsData.map(r => ({
    month: shortMonth(r.month),
    Charter: r.charterFlights,
    Emergency: r.emergencyFlights,
    VIP: r.vipFlights,
    Survey: r.surveyFlights,
  }))

  const utilizationChart = rotaryOpsData.map(r => ({
    month: shortMonth(r.month),
    'Utilization %': r.utilizationRate,
    'Flight Hours': r.flightHours,
  }))

  const latest = rotaryOpsData[rotaryOpsData.length - 1]

  const typePie = [
    { name: 'Charter', value: rotaryOpsData.reduce((s, r) => s + r.charterFlights, 0) },
    { name: 'Emergency', value: rotaryOpsData.reduce((s, r) => s + r.emergencyFlights, 0) },
    { name: 'VIP', value: rotaryOpsData.reduce((s, r) => s + r.vipFlights, 0) },
    { name: 'Survey', value: rotaryOpsData.reduce((s, r) => s + r.surveyFlights, 0) },
  ]

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Annual Rotary Flights" value={annualSummary.rotaryFlights.toString()} sub="2024" />
        <StatCard label="Flight Hours" value={annualSummary.rotaryHours.toFixed(0)} sub="2024 total" color="#00e5ff" />
        <StatCard label="Dec Flights" value={latest.totalFlights.toString()} sub={`${latest.passengers} passengers`} color="#00e676" />
        <StatCard label="Utilization" value={`${latest.utilizationRate}%`} sub="Dec 2024" color="#d500f9" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Mission Type Distribution — 2024">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={typePie} cx="50%" cy="50%" outerRadius={100} innerRadius={45} dataKey="value" label={({ name, percent }: any) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}>
                {typePie.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#0f1a2e', border: '1px solid #1a2744', borderRadius: 8, color: '#e8edf5' }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Utilization & Flight Hours">
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={utilizationChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a2744" />
              <XAxis dataKey="month" tick={{ fill: '#7a8baa', fontSize: 11 }} />
              <YAxis yAxisId="left" tick={{ fill: '#7a8baa', fontSize: 11 }} domain={[0, 100]} />
              <YAxis yAxisId="right" orientation="right" tick={{ fill: '#7a8baa', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: '#0f1a2e', border: '1px solid #1a2744', borderRadius: 8, color: '#e8edf5' }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line yAxisId="left" type="monotone" dataKey="Utilization %" stroke="#ffab00" strokeWidth={2.5} dot={{ r: 3, fill: '#ffab00' }} />
              <Bar yAxisId="right" dataKey="Flight Hours" fill="#00e5ff" fillOpacity={0.3} radius={[2, 2, 0, 0]} />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <ChartCard title="Monthly Flights by Mission Type">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={rotaryChart}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1a2744" />
            <XAxis dataKey="month" tick={{ fill: '#7a8baa', fontSize: 11 }} />
            <YAxis tick={{ fill: '#7a8baa', fontSize: 11 }} />
            <Tooltip contentStyle={{ background: '#0f1a2e', border: '1px solid #1a2744', borderRadius: 8, color: '#e8edf5' }} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="Charter" fill="#00e5ff" radius={[2, 2, 0, 0]} />
            <Bar dataKey="Emergency" fill="#ff1744" radius={[2, 2, 0, 0]} />
            <Bar dataKey="VIP" fill="#ffab00" radius={[2, 2, 0, 0]} />
            <Bar dataKey="Survey" fill="#00e676" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </>
  )
}
