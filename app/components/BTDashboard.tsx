'use client'

import { useState } from 'react'
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts'
import {
  callDetailRecords, customerComplaints, cellTowers, monthlyRevenue,
  prepaidTariffs, postpaidTariffs, subscriberSummary
} from '../data/bt-data'

const COLORS = ['#00e5ff', '#00e676', '#ffab00', '#ff1744', '#d500f9', '#ffd600']
const subtabs = ['Call Records', 'Complaints', 'Cell Towers', 'Revenue', 'Prepaid Tariff', 'Postpaid Tariff']

function shortMonth(m: string) { return m.replace(' 2024', '').slice(0, 3) }

export default function BTDashboard() {
  const [activeSubTab, setActiveSubTab] = useState('Call Records')
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
      </div>

      {/* Content — split layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: charts */}
        <div className={`overflow-y-auto p-6 space-y-6 transition-all ${detailPanel ? 'w-[60%]' : 'w-full'}`}>
          {activeSubTab === 'Call Records' && <CallRecordsView onDetail={setDetailPanel} />}
          {activeSubTab === 'Complaints' && <ComplaintsView onDetail={setDetailPanel} />}
          {activeSubTab === 'Cell Towers' && <CellTowerView onDetail={setDetailPanel} />}
          {activeSubTab === 'Revenue' && <RevenueView onDetail={setDetailPanel} />}
          {activeSubTab === 'Prepaid Tariff' && <PrepaidTariffView onDetail={setDetailPanel} />}
          {activeSubTab === 'Postpaid Tariff' && <PostpaidTariffView onDetail={setDetailPanel} />}
        </div>

        {/* Right: detail panel */}
        {detailPanel && (
          <div className="w-[40%] border-l border-[#1a2744] overflow-y-auto p-5 animate-fade-in-up">
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

type DetailSetter = (detail: { title: string; data: Array<Record<string, string | number>> } | null) => void

function StatCard({ label, value, sub, color = '#00e676' }: { label: string; value: string; sub?: string; color?: string }) {
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
      className={`rounded-xl bg-[#0c1425] border border-[#1a2744] p-5 ${onClick ? 'cursor-pointer hover:border-green-500/30 transition-colors group' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">{title}</h3>
        {onClick && <span className="text-[9px] text-slate-600 group-hover:text-green-400 transition-colors">Click for details &rarr;</span>}
      </div>
      {children}
    </div>
  )
}

// ====== CALL DETAIL RECORDS ======
function CallRecordsView({ onDetail }: { onDetail: DetailSetter }) {
  const cdrChart = callDetailRecords.map(r => ({
    month: shortMonth(r.month),
    'Data (TB)': +(r.dataGB / 1000).toFixed(1),
    'Voice (M min)': r.voiceMinutes,
    'SMS (M)': r.smsCount,
  }))

  const prepaidVsPostpaid = callDetailRecords.map(r => ({
    month: shortMonth(r.month),
    'Prepaid Data': r.prepaidData,
    'Postpaid Data': r.postpaidData,
    'Prepaid Voice': r.prepaidVoice,
    'Postpaid Voice': r.postpaidVoice,
  }))

  const latest = callDetailRecords[callDetailRecords.length - 1]

  return (
    <>
      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Data Usage" value={`${(latest.dataGB / 1000).toFixed(1)} TB`} sub="Dec 2024" />
        <StatCard label="Voice Minutes" value={`${latest.voiceMinutes}M`} sub="Dec 2024" color="#ffab00" />
        <StatCard label="SMS Count" value={`${latest.smsCount}M`} sub="Dec 2024" color="#d500f9" />
        <StatCard label="Prepaid Ratio" value={`${((latest.prepaidData / latest.dataGB) * 100).toFixed(0)}%`} sub="Data traffic" color="#00e5ff" />
      </div>

      {/* Data/Voice/SMS trend */}
      <ChartCard title="Monthly CDR Trends — Data, Voice & SMS" onClick={() => onDetail({
        title: 'Monthly CDR Breakdown',
        data: callDetailRecords.map(r => ({
          Month: shortMonth(r.month),
          'Data (TB)': +(r.dataGB / 1000).toFixed(1),
          'Voice (M min)': r.voiceMinutes,
          'SMS (M)': r.smsCount,
          'Prepaid Data': r.prepaidData,
          'Postpaid Data': r.postpaidData,
        }))
      })}>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={cdrChart}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1a2744" />
            <XAxis dataKey="month" tick={{ fill: '#7a8baa', fontSize: 11 }} />
            <YAxis tick={{ fill: '#7a8baa', fontSize: 11 }} />
            <Tooltip contentStyle={{ background: '#0f1a2e', border: '1px solid #1a2744', borderRadius: 8, color: '#e8edf5' }} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Area type="monotone" dataKey="Data (TB)" stroke="#00e5ff" fill="#00e5ff" fillOpacity={0.1} strokeWidth={2} />
            <Area type="monotone" dataKey="Voice (M min)" stroke="#ffab00" fill="#ffab00" fillOpacity={0.1} strokeWidth={2} />
            <Area type="monotone" dataKey="SMS (M)" stroke="#d500f9" fill="#d500f9" fillOpacity={0.1} strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Prepaid vs Postpaid */}
      <ChartCard title="Prepaid vs Postpaid — Data Usage (GB thousands)" onClick={() => onDetail({
        title: 'Prepaid vs Postpaid Details',
        data: callDetailRecords.map(r => ({
          Month: shortMonth(r.month),
          'Prepaid Data': r.prepaidData,
          'Postpaid Data': r.postpaidData,
          'Prepaid Voice': r.prepaidVoice,
          'Postpaid Voice': r.postpaidVoice,
        }))
      })}>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={prepaidVsPostpaid}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1a2744" />
            <XAxis dataKey="month" tick={{ fill: '#7a8baa', fontSize: 11 }} />
            <YAxis tick={{ fill: '#7a8baa', fontSize: 11 }} />
            <Tooltip contentStyle={{ background: '#0f1a2e', border: '1px solid #1a2744', borderRadius: 8, color: '#e8edf5' }} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="Prepaid Data" fill="#00e676" radius={[2, 2, 0, 0]} />
            <Bar dataKey="Postpaid Data" fill="#00e5ff" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </>
  )
}

// ====== CUSTOMER COMPLAINTS ======
function ComplaintsView({ onDetail }: { onDetail: DetailSetter }) {
  const complaintsTrend = customerComplaints.map(r => ({
    month: shortMonth(r.month),
    'Network': r.networkIssue,
    'Billing': r.billingDispute,
    'Quality': r.serviceQuality,
    'Coverage': r.coverage,
    'Device': r.deviceSupport,
    'Other': r.other,
  }))

  const latest = customerComplaints[customerComplaints.length - 1]
  const totalLatest = latest.networkIssue + latest.billingDispute + latest.serviceQuality + latest.deviceSupport + latest.coverage + latest.other

  const pieData = [
    { name: 'Network', value: latest.networkIssue },
    { name: 'Billing', value: latest.billingDispute },
    { name: 'Quality', value: latest.serviceQuality },
    { name: 'Coverage', value: latest.coverage },
    { name: 'Device', value: latest.deviceSupport },
    { name: 'Other', value: latest.other },
  ]

  const resolutionData = customerComplaints.map(r => ({
    month: shortMonth(r.month),
    'Resolved': r.resolved,
    'Pending': r.pending,
    'Avg Days': r.avgResolutionDays,
  }))

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Complaints" value={totalLatest.toLocaleString()} sub="Dec 2024" color="#ff1744" />
        <StatCard label="Resolved" value={latest.resolved.toLocaleString()} sub={`${((latest.resolved / totalLatest) * 100).toFixed(1)}% rate`} />
        <StatCard label="Pending" value={latest.pending.toLocaleString()} sub="Dec 2024" color="#ffab00" />
        <StatCard label="Avg Resolution" value={`${latest.avgResolutionDays} days`} sub="Dec 2024" color="#00e5ff" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Complaints by Category — Dec 2024" onClick={() => onDetail({
          title: 'Complaints by Category — All Months',
          data: customerComplaints.map(r => ({
            Month: shortMonth(r.month),
            Network: r.networkIssue,
            Billing: r.billingDispute,
            Quality: r.serviceQuality,
            Coverage: r.coverage,
            Device: r.deviceSupport,
            Other: r.other,
          }))
        })}>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" outerRadius={100} innerRadius={50} dataKey="value" label={({ name, percent }: any) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}>
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#0f1a2e', border: '1px solid #1a2744', borderRadius: 8, color: '#e8edf5' }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Resolution Performance" onClick={() => onDetail({
          title: 'Resolution Performance Details',
          data: customerComplaints.map(r => ({
            Month: shortMonth(r.month),
            Resolved: r.resolved,
            Pending: r.pending,
            'Avg Days': r.avgResolutionDays,
          }))
        })}>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={resolutionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a2744" />
              <XAxis dataKey="month" tick={{ fill: '#7a8baa', fontSize: 11 }} />
              <YAxis tick={{ fill: '#7a8baa', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: '#0f1a2e', border: '1px solid #1a2744', borderRadius: 8, color: '#e8edf5' }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="Resolved" fill="#00e676" radius={[2, 2, 0, 0]} />
              <Bar dataKey="Pending" fill="#ff1744" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <ChartCard title="Complaint Categories — Monthly Trend">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={complaintsTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1a2744" />
            <XAxis dataKey="month" tick={{ fill: '#7a8baa', fontSize: 11 }} />
            <YAxis tick={{ fill: '#7a8baa', fontSize: 11 }} />
            <Tooltip contentStyle={{ background: '#0f1a2e', border: '1px solid #1a2744', borderRadius: 8, color: '#e8edf5' }} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line type="monotone" dataKey="Network" stroke="#ff1744" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="Coverage" stroke="#ffab00" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="Billing" stroke="#00e5ff" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="Quality" stroke="#d500f9" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="Device" stroke="#00e676" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
    </>
  )
}

// ====== CELL TOWER VIEW ======
function CellTowerView({ onDetail }: { onDetail: DetailSetter }) {
  const regionGrouped = cellTowers.reduce((acc, t) => {
    acc[t.region] = (acc[t.region] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const regionData = Object.entries(regionGrouped).map(([name, value]) => ({ name, value }))

  const towerTypeData = cellTowers.reduce((acc, t) => {
    acc[t.towerType] = (acc[t.towerType] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  const towerTypePie = Object.entries(towerTypeData).map(([name, value]) => ({ name, value }))

  const backhaulData = cellTowers.reduce((acc, t) => {
    acc[t.backhaul] = (acc[t.backhaul] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  const backhaulPie = Object.entries(backhaulData).map(([name, value]) => ({ name, value }))

  const totalSubs = cellTowers.reduce((s, t) => s + t.subscribers, 0)
  const totalTraffic = cellTowers.reduce((s, t) => s + t.avgTrafficGB, 0)
  const activeTowers = cellTowers.filter(t => t.status === 'active').length

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Towers (sample)" value={cellTowers.length.toString()} sub={`${activeTowers} active`} />
        <StatCard label="BT Total Towers" value={subscriberSummary.totalTowers.toString()} sub={`5G: ${subscriberSummary.towers5G} | 4G: ${subscriberSummary.towers4G}`} color="#00e5ff" />
        <StatCard label="Subscribers (sample)" value={(totalSubs / 1000).toFixed(1) + 'K'} color="#ffab00" />
        <StatCard label="Avg Traffic" value={(totalTraffic / cellTowers.length).toFixed(0) + ' GB'} sub="Per tower/month" color="#d500f9" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartCard title="Towers by Region" onClick={() => onDetail({
          title: 'Tower Details by Region',
          data: cellTowers.map(t => ({
            'Site': t.id,
            Name: t.siteName,
            Dzongkhag: t.dzongkhag,
            Type: t.towerType,
            Subscribers: t.subscribers,
            'Traffic GB': t.avgTrafficGB,
            Status: t.status,
          }))
        })}>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={regionData} cx="50%" cy="50%" outerRadius={90} innerRadius={40} dataKey="value" label={({ name, value }: any) => `${name}: ${value}`}>
                {regionData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#0f1a2e', border: '1px solid #1a2744', borderRadius: 8, color: '#e8edf5' }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Network Generation">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={towerTypePie} cx="50%" cy="50%" outerRadius={90} innerRadius={40} dataKey="value" label={({ name, value }: any) => `${name}: ${value}`}>
                {towerTypePie.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#0f1a2e', border: '1px solid #1a2744', borderRadius: 8, color: '#e8edf5' }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Backhaul Type">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={backhaulPie} cx="50%" cy="50%" outerRadius={90} innerRadius={40} dataKey="value" label={({ name, value }: any) => `${name}: ${value}`}>
                {backhaulPie.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#0f1a2e', border: '1px solid #1a2744', borderRadius: 8, color: '#e8edf5' }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Tower table */}
      <ChartCard title="Cell Tower Details">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#1a2744] text-slate-500">
                <th className="text-left py-2 pr-4">Site ID</th>
                <th className="text-left py-2 pr-4">Site Name</th>
                <th className="text-left py-2 pr-4">Dzongkhag</th>
                <th className="text-left py-2 pr-4">Type</th>
                <th className="text-right py-2 pr-4">Subscribers</th>
                <th className="text-right py-2 pr-4">Traffic (GB)</th>
                <th className="text-left py-2 pr-4">Backhaul</th>
                <th className="text-left py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {cellTowers.map(t => (
                <tr key={t.id} className="border-b border-[#1a2744]/50 hover:bg-white/[0.02] transition-colors">
                  <td className="py-2 pr-4 font-mono text-cyan-400">{t.id}</td>
                  <td className="py-2 pr-4 text-slate-300">{t.siteName}</td>
                  <td className="py-2 pr-4 text-slate-400">{t.dzongkhag}</td>
                  <td className="py-2 pr-4">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      t.towerType === '5G' ? 'bg-cyan-500/15 text-cyan-400' :
                      t.towerType === '4G' ? 'bg-green-500/15 text-green-400' :
                      'bg-amber-500/15 text-amber-400'
                    }`}>{t.towerType}</span>
                  </td>
                  <td className="py-2 pr-4 text-right text-slate-300">{t.subscribers.toLocaleString()}</td>
                  <td className="py-2 pr-4 text-right text-slate-300">{t.avgTrafficGB.toLocaleString()}</td>
                  <td className="py-2 pr-4 text-slate-400">{t.backhaul}</td>
                  <td className="py-2">
                    <span className={`inline-flex items-center gap-1 text-[10px] ${
                      t.status === 'active' ? 'text-green-400' : t.status === 'maintenance' ? 'text-amber-400' : 'text-slate-500'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        t.status === 'active' ? 'bg-green-400' : t.status === 'maintenance' ? 'bg-amber-400' : 'bg-slate-500'
                      }`} />
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartCard>
    </>
  )
}

// ====== REVENUE VIEW ======
function RevenueView({ onDetail }: { onDetail: DetailSetter }) {
  const revChart = monthlyRevenue.map(r => ({
    month: shortMonth(r.month),
    'Data': r.dataRevenue,
    'Voice': r.voiceRevenue,
    'SMS': r.smsRevenue,
    'Broadband': r.broadband,
    'Enterprise': r.enterprise,
  }))

  const latest = monthlyRevenue[monthlyRevenue.length - 1]
  const prev = monthlyRevenue[monthlyRevenue.length - 2]
  const growthPct = ((latest.totalRevenue - prev.totalRevenue) / prev.totalRevenue * 100).toFixed(1)

  const revenueBreakdown = [
    { name: 'Mobile Data', value: latest.dataRevenue },
    { name: 'Voice', value: latest.voiceRevenue },
    { name: 'SMS', value: latest.smsRevenue },
    { name: 'Broadband', value: latest.broadband },
    { name: 'Enterprise', value: latest.enterprise },
    { name: 'Roaming', value: latest.roaming },
  ]

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Revenue" value={`Nu. ${latest.totalRevenue.toFixed(0)}M`} sub={`${growthPct}% MoM growth`} />
        <StatCard label="Data Revenue" value={`Nu. ${latest.dataRevenue.toFixed(0)}M`} sub={`${((latest.dataRevenue / latest.totalRevenue) * 100).toFixed(0)}% of total`} color="#00e5ff" />
        <StatCard label="Voice Revenue" value={`Nu. ${latest.voiceRevenue.toFixed(0)}M`} sub="Dec 2024" color="#ffab00" />
        <StatCard label="Annual Revenue" value={`Nu. ${(monthlyRevenue.reduce((s, r) => s + r.totalRevenue, 0) / 1000).toFixed(1)}B`} sub="FY 2024" color="#d500f9" />
      </div>

      <ChartCard title="Monthly Revenue Breakdown (Millions Nu.)" onClick={() => onDetail({
        title: 'Revenue Breakdown — All Months',
        data: monthlyRevenue.map(r => ({
          Month: shortMonth(r.month),
          Data: r.dataRevenue.toFixed(1),
          Voice: r.voiceRevenue.toFixed(1),
          SMS: r.smsRevenue.toFixed(1),
          Broadband: r.broadband.toFixed(1),
          Enterprise: r.enterprise.toFixed(1),
          Total: r.totalRevenue.toFixed(1),
        }))
      })}>
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={revChart}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1a2744" />
            <XAxis dataKey="month" tick={{ fill: '#7a8baa', fontSize: 11 }} />
            <YAxis tick={{ fill: '#7a8baa', fontSize: 11 }} />
            <Tooltip contentStyle={{ background: '#0f1a2e', border: '1px solid #1a2744', borderRadius: 8, color: '#e8edf5' }} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Area type="monotone" dataKey="Data" stackId="1" stroke="#00e5ff" fill="#00e5ff" fillOpacity={0.2} />
            <Area type="monotone" dataKey="Voice" stackId="1" stroke="#ffab00" fill="#ffab00" fillOpacity={0.2} />
            <Area type="monotone" dataKey="SMS" stackId="1" stroke="#d500f9" fill="#d500f9" fillOpacity={0.2} />
            <Area type="monotone" dataKey="Broadband" stackId="1" stroke="#00e676" fill="#00e676" fillOpacity={0.2} />
            <Area type="monotone" dataKey="Enterprise" stackId="1" stroke="#ffd600" fill="#ffd600" fillOpacity={0.2} />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Revenue Mix — Dec 2024" onClick={() => onDetail({
          title: 'Revenue Mix Details',
          data: monthlyRevenue.map(r => ({
            Month: shortMonth(r.month),
            'Mobile Data': r.dataRevenue.toFixed(1),
            Voice: r.voiceRevenue.toFixed(1),
            SMS: r.smsRevenue.toFixed(1),
            Broadband: r.broadband.toFixed(1),
            Enterprise: r.enterprise.toFixed(1),
            Roaming: r.roaming.toFixed(1),
          }))
        })}>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={revenueBreakdown} cx="50%" cy="50%" outerRadius={100} innerRadius={45} dataKey="value" label={({ name, percent }: any) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}>
                {revenueBreakdown.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#0f1a2e', border: '1px solid #1a2744', borderRadius: 8, color: '#e8edf5' }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Data vs Voice Revenue Trend">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={revChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a2744" />
              <XAxis dataKey="month" tick={{ fill: '#7a8baa', fontSize: 11 }} />
              <YAxis tick={{ fill: '#7a8baa', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: '#0f1a2e', border: '1px solid #1a2744', borderRadius: 8, color: '#e8edf5' }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="Data" stroke="#00e5ff" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="Voice" stroke="#ffab00" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </>
  )
}

// ====== PREPAID TARIFF VIEW ======
function PrepaidTariffView({ onDetail }: { onDetail: DetailSetter }) {
  const totalSubs = prepaidTariffs.reduce((s, t) => s + t.subscribers, 0)

  const popularityData = prepaidTariffs.map(t => ({
    name: t.name.replace('BT ', ''),
    subscribers: t.subscribers,
    popularity: t.popularity,
  }))

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard label="Total Prepaid Plans" value={prepaidTariffs.length.toString()} />
        <StatCard label="Total Prepaid Subscribers" value={(totalSubs / 1000).toFixed(0) + 'K'} color="#00e5ff" />
        <StatCard label="Most Popular" value={prepaidTariffs.sort((a, b) => b.popularity - a.popularity)[0].name.replace('BT ', '')} sub={`${prepaidTariffs.sort((a, b) => b.popularity - a.popularity)[0].popularity}% share`} color="#ffab00" />
      </div>

      <ChartCard title="Prepaid Plan Subscribers" onClick={() => onDetail({
        title: 'Prepaid Plan Details',
        data: prepaidTariffs.map(t => ({
          Plan: t.name,
          'Price (Nu.)': t.price,
          Data: t.dataAllowance,
          Voice: t.voiceMinutes,
          SMS: t.smsCount,
          Validity: t.validity,
          Subscribers: t.subscribers,
          'Share %': t.popularity,
        }))
      })}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={popularityData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#1a2744" />
            <XAxis type="number" tick={{ fill: '#7a8baa', fontSize: 11 }} />
            <YAxis type="category" dataKey="name" tick={{ fill: '#7a8baa', fontSize: 10 }} width={120} />
            <Tooltip contentStyle={{ background: '#0f1a2e', border: '1px solid #1a2744', borderRadius: 8, color: '#e8edf5' }} />
            <Bar dataKey="subscribers" fill="#00e676" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Tariff table */}
      <ChartCard title="Prepaid Tariff Plans">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#1a2744] text-slate-500">
                <th className="text-left py-2 pr-4">Plan</th>
                <th className="text-right py-2 pr-4">Price (Nu.)</th>
                <th className="text-left py-2 pr-4">Data</th>
                <th className="text-left py-2 pr-4">Voice</th>
                <th className="text-left py-2 pr-4">SMS</th>
                <th className="text-left py-2 pr-4">Validity</th>
                <th className="text-right py-2 pr-4">Subscribers</th>
                <th className="text-right py-2">Share %</th>
              </tr>
            </thead>
            <tbody>
              {prepaidTariffs.map(t => (
                <tr key={t.name} className="border-b border-[#1a2744]/50 hover:bg-white/[0.02] transition-colors">
                  <td className="py-2.5 pr-4 text-slate-300 font-medium">{t.name}</td>
                  <td className="py-2.5 pr-4 text-right text-green-400 font-mono">{t.price}</td>
                  <td className="py-2.5 pr-4 text-slate-400">{t.dataAllowance}</td>
                  <td className="py-2.5 pr-4 text-slate-400">{t.voiceMinutes}</td>
                  <td className="py-2.5 pr-4 text-slate-400">{t.smsCount}</td>
                  <td className="py-2.5 pr-4 text-slate-400">{t.validity}</td>
                  <td className="py-2.5 pr-4 text-right text-slate-300">{t.subscribers.toLocaleString()}</td>
                  <td className="py-2.5 text-right text-cyan-400">{t.popularity}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartCard>
    </>
  )
}

// ====== POSTPAID TARIFF VIEW ======
function PostpaidTariffView({ onDetail }: { onDetail: DetailSetter }) {
  const totalSubs = postpaidTariffs.reduce((s, t) => s + t.subscribers, 0)

  const subData = postpaidTariffs.map(t => ({
    name: t.name.replace('BT ', ''),
    subscribers: t.subscribers,
    revenue: t.subscribers * t.price / 1000000, // approx revenue in millions
  }))

  const radarData = postpaidTariffs.map(t => ({
    plan: t.name.replace('BT Postpaid ', '').replace('BT ', ''),
    Subscribers: (t.subscribers / 28200) * 100,
    Revenue: (t.price / 7999) * 100,
    Popularity: t.popularity * 3,
  }))

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard label="Total Postpaid Plans" value={postpaidTariffs.length.toString()} />
        <StatCard label="Total Postpaid Subscribers" value={(totalSubs / 1000).toFixed(0) + 'K'} color="#00e5ff" />
        <StatCard label="Avg Revenue/Sub" value={`Nu. ${(postpaidTariffs.reduce((s, t) => s + t.price * t.subscribers, 0) / totalSubs).toFixed(0)}`} sub="Monthly ARPU" color="#ffab00" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Subscribers by Plan" onClick={() => onDetail({
          title: 'Postpaid Plan Details',
          data: postpaidTariffs.map(t => ({
            Plan: t.name,
            'Price (Nu.)': t.price,
            Data: t.dataAllowance,
            Voice: t.voiceMinutes,
            SMS: t.smsCount,
            Subscribers: t.subscribers,
            'Share %': t.popularity,
          }))
        })}>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={subData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a2744" />
              <XAxis dataKey="name" tick={{ fill: '#7a8baa', fontSize: 10 }} />
              <YAxis tick={{ fill: '#7a8baa', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: '#0f1a2e', border: '1px solid #1a2744', borderRadius: 8, color: '#e8edf5' }} />
              <Bar dataKey="subscribers" fill="#d500f9" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Plan Comparison Radar">
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#1a2744" />
              <PolarAngleAxis dataKey="plan" tick={{ fill: '#7a8baa', fontSize: 10 }} />
              <PolarRadiusAxis tick={false} />
              <Radar name="Subscribers" dataKey="Subscribers" stroke="#00e5ff" fill="#00e5ff" fillOpacity={0.15} />
              <Radar name="Revenue" dataKey="Revenue" stroke="#ffab00" fill="#ffab00" fillOpacity={0.15} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </RadarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Tariff table */}
      <ChartCard title="Postpaid Tariff Plans">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#1a2744] text-slate-500">
                <th className="text-left py-2 pr-4">Plan</th>
                <th className="text-right py-2 pr-4">Price (Nu.)</th>
                <th className="text-left py-2 pr-4">Data</th>
                <th className="text-left py-2 pr-4">Voice</th>
                <th className="text-left py-2 pr-4">SMS</th>
                <th className="text-right py-2 pr-4">Subscribers</th>
                <th className="text-right py-2">Share %</th>
              </tr>
            </thead>
            <tbody>
              {postpaidTariffs.map(t => (
                <tr key={t.name} className="border-b border-[#1a2744]/50 hover:bg-white/[0.02] transition-colors">
                  <td className="py-2.5 pr-4 text-slate-300 font-medium">{t.name}</td>
                  <td className="py-2.5 pr-4 text-right text-green-400 font-mono">{t.price.toLocaleString()}</td>
                  <td className="py-2.5 pr-4 text-slate-400">{t.dataAllowance}</td>
                  <td className="py-2.5 pr-4 text-slate-400">{t.voiceMinutes}</td>
                  <td className="py-2.5 pr-4 text-slate-400">{t.smsCount}</td>
                  <td className="py-2.5 pr-4 text-right text-slate-300">{t.subscribers.toLocaleString()}</td>
                  <td className="py-2.5 text-right text-cyan-400">{t.popularity}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartCard>
    </>
  )
}
