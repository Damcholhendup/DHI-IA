'use client'

import Link from 'next/link'
import Image from 'next/image'

const features = [
  {
    icon: (
      <svg width="24" height="24" fill="none" stroke="#00e5ff" strokeWidth="1.8" strokeLinecap="round" viewBox="0 0 24 24">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M9 21V9" />
      </svg>
    ),
    color: '#00e5ff',
    title: 'Unified Data Lake',
    desc: 'Centralised repository aggregating operational data from all DHI subsidiaries — telecom, aviation, energy, and more.',
  },
  {
    icon: (
      <svg width="24" height="24" fill="none" stroke="#00e676" strokeWidth="1.8" strokeLinecap="round" viewBox="0 0 24 24">
        <path d="M18 20V10M12 20V4M6 20v-6" />
      </svg>
    ),
    color: '#00e676',
    title: 'Advanced Analytics',
    desc: 'Real-time dashboards, KPI tracking, trend analysis, and performance benchmarking across the entire DHI portfolio.',
  },
  {
    icon: (
      <svg width="24" height="24" fill="none" stroke="#ffab00" strokeWidth="1.8" strokeLinecap="round" viewBox="0 0 24 24">
        <path d="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4z" /><path d="M8 2v16" /><path d="M16 6v16" />
      </svg>
    ),
    color: '#ffab00',
    title: 'Infrastructure Map',
    desc: "Live geospatial view of Bhutan's national infrastructure — hydropower plants, telecom towers, and airports plotted in real time.",
  },
  {
    icon: (
      <svg width="24" height="24" fill="none" stroke="#d500f9" strokeWidth="1.8" strokeLinecap="round" viewBox="0 0 24 24">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        <path d="M8 10h8M8 14h5" />
      </svg>
    ),
    color: '#d500f9',
    title: 'AI Chatbot',
    desc: 'Natural-language interface for querying data, generating reports, and surfacing insights — powered by DHI Intelligence AI.',
    badge: 'Coming Soon',
  },
]

const pilots = [
  {
    id: 'bt',
    name: 'Bhutan Telecom',
    short: 'BT',
    sector: 'Telecom',
    color: '#00e676',
    stat: '498K subscribers',
    desc: 'National telecom operator providing mobile, broadband, and enterprise connectivity across all 20 dzongkhags.',
  },
  {
    id: 'drukair',
    name: 'Drukair Corporation',
    short: 'DA',
    sector: 'Aviation',
    color: '#ffab00',
    stat: '193K passengers/yr',
    desc: 'Royal Bhutan Airlines — the national flag carrier connecting Bhutan to 9 international and domestic destinations.',
  },
]

const stats = [
  { value: '2', label: 'Pilot Companies', color: '#00e5ff' },
  { value: '500K+', label: 'Data Records', color: '#00e676' },
  { value: '4', label: 'Analytics Modules', color: '#ffab00' },
  { value: '100%', label: 'DHI Ownership', color: '#d500f9' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen w-full" style={{ background: '#060b18', color: '#e8edf5' }}>
      {/* ── Ambient background ── */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 10% 20%, rgba(0,229,255,0.05) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 90% 80%, rgba(100,60,255,0.05) 0%, transparent 60%)',
        }}
      />
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,229,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.6) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* ── Nav ── */}
      <nav
        className="sticky top-0 z-50 flex items-center justify-between px-8 h-14 border-b border-[#1a2744]"
        style={{ background: 'rgba(6,11,24,0.85)', backdropFilter: 'blur(20px)' }}
      >
        <div className="flex items-center gap-2.5">
          <Image
            src="/images/logos/DHI.webp"
            alt="DHI Logo"
            width={32}
            height={32}
            className="rounded-lg"
          />
          <span className="text-sm font-bold text-white tracking-tight">DHI Data Lake</span>
        </div>
        <Link
          href="/login"
          className="px-5 py-2 rounded-lg text-xs font-semibold text-white transition-all"
          style={{
            background: 'linear-gradient(135deg, #00c8e0, #0062cc)',
            boxShadow: '0 0 16px rgba(0,229,255,0.2)',
          }}
        >
          Sign In
        </Link>
      </nav>

      {/* ── Hero ── */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 pt-28 pb-20">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/5 text-[11px] text-cyan-400 tracking-widest uppercase mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          Pilot Programme · 2026
        </div>

        {/* DHI Logo large */}
        <div className="mb-6">
          <Image
            src="/images/logos/DHI.webp"
            alt="DHI Logo"
            width={72}
            height={72}
            className="rounded-2xl mx-auto shadow-lg shadow-cyan-500/10"
          />
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white max-w-3xl leading-tight mb-5">
          DHI{' '}
          <span
            style={{
              background: 'linear-gradient(90deg, #00e5ff, #448aff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Data Lake
          </span>
        </h1>

        <p className="text-slate-400 text-base max-w-2xl leading-relaxed mb-10">
          A unified data intelligence platform for Druk Holding &amp; Investments — bringing together
          fragmented business data from multiple sources into a single, intelligent system that enables
          real-time analytics, AI-driven insights, and data-driven decision-making across Bhutan&apos;s national enterprises.
        </p>

        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            href="/login"
            className="px-7 py-3 rounded-xl text-sm font-semibold text-white transition-all"
            style={{
              background: 'linear-gradient(135deg, #00c8e0, #0062cc)',
              boxShadow: '0 0 24px rgba(0,229,255,0.25)',
            }}
          >
            Access Platform
          </Link>
          <a
            href="#features"
            className="px-7 py-3 rounded-xl text-sm font-semibold text-slate-300 border border-[#1a2744] hover:border-cyan-500/30 hover:text-white transition-all"
            style={{ background: 'rgba(12,20,37,0.6)' }}
          >
            Learn More
          </a>
        </div>
      </section>

      {/* ── Problem & Solution ── */}
      <section className="px-6 pb-20">
        <div className="max-w-5xl mx-auto">
          {/* Problem */}
          <div
            className="rounded-2xl border border-red-500/15 p-8 mb-5 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, rgba(255,23,68,0.04), rgba(12,20,37,0.9))' }}
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: 'rgba(255,23,68,0.1)', border: '1px solid rgba(255,23,68,0.2)' }}>
                <svg width="18" height="18" fill="none" stroke="#ff1744" strokeWidth="1.8" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white mb-2">The Problem</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Companies in Bhutan store their business data — financial records, sales figures, and performance metrics — across
                  different systems and locations, making it difficult to see the bigger picture or make informed decisions.
                  Analysing this data manually is slow, error-prone, and often misses critical patterns.
                  Without a unified solution, organisations are unable to forecast where they are headed, financial risks go undetected,
                  and growth is left to guesswork rather than data-driven prediction.
                </p>
              </div>
            </div>
          </div>

          {/* Solution */}
          <div
            className="rounded-2xl border border-cyan-500/15 p-8 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, rgba(0,229,255,0.04), rgba(12,20,37,0.9))' }}
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: 'rgba(0,229,255,0.1)', border: '1px solid rgba(0,229,255,0.2)' }}>
                <svg width="18" height="18" fill="none" stroke="#00e5ff" strokeWidth="1.8" viewBox="0 0 24 24">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white mb-2">Our Solution</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  A smart analytics platform that brings all data together in one place, analyses it automatically, and presents
                  clear insights through an easy-to-use dashboard — turning days of manual work into minutes.
                </p>
              </div>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { color: '#00e5ff', title: 'Data Lake', desc: 'Central storage bringing together data from all DHI subsidiaries and external vendors into one accessible system.' },
                { color: '#00e676', title: 'AI Analytics', desc: 'Intelligent system that automatically analyses data, identifies trends, and generates insights without manual effort.' },
                { color: '#ffab00', title: 'Dashboard', desc: 'Simple web interface where leaders can view reports, charts, and predictions in an easy-to-understand format.' },
              ].map(s => (
                <div key={s.title} className="rounded-xl p-4 border" style={{ background: `${s.color}08`, borderColor: `${s.color}20` }}>
                  <div className="text-xs font-bold mb-1.5" style={{ color: s.color }}>{s.title}</div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="px-6 pb-16">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map(s => (
            <div
              key={s.label}
              className="rounded-xl border border-[#1a2744] p-5 text-center"
              style={{ background: 'rgba(12,20,37,0.7)' }}
            >
              <div className="text-2xl font-extrabold mb-1" style={{ color: s.color }}>{s.value}</div>
              <div className="text-[11px] text-slate-500 uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="px-6 pb-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-white mb-3">Platform Capabilities</h2>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              Everything leadership needs to monitor, analyse, and act on operational data across the DHI group.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {features.map(f => (
              <div
                key={f.title}
                className="rounded-2xl border border-[#1a2744] p-6 hover:border-opacity-60 transition-all"
                style={{ background: 'rgba(12,20,37,0.7)' }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${f.color}15`, border: `1px solid ${f.color}25` }}
                >
                  {f.icon}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-sm font-bold text-white">{f.title}</h3>
                  {f.badge && (
                    <span
                      className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                      style={{ background: `${f.color}15`, color: f.color, border: `1px solid ${f.color}30` }}
                    >
                      {f.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pilot companies ── */}
      <section className="px-6 pb-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-white mb-3">Pilot Companies</h2>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              Phase 1 of DHI IA is live with two subsidiaries. More companies will be onboarded as APIs are integrated.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {pilots.map(p => (
              <div
                key={p.id}
                className="rounded-2xl border p-6 relative overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${p.color}08, rgba(12,20,37,0.9))`,
                  borderColor: `${p.color}25`,
                }}
              >
                <div
                  className="absolute top-4 right-4 flex items-center gap-1.5 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full"
                  style={{ background: `${p.color}15`, color: p.color }}
                >
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: p.color }} />
                  Live
                </div>
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-extrabold mb-4"
                  style={{ background: `${p.color}20`, color: p.color }}
                >
                  {p.short}
                </div>
                <h3 className="text-base font-bold text-white mb-0.5">{p.name}</h3>
                <p className="text-[11px] uppercase tracking-widest mb-3" style={{ color: p.color }}>{p.sector}</p>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">{p.desc}</p>
                <div
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg"
                  style={{ background: `${p.color}10`, color: p.color }}
                >
                  {p.stat}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-6 pb-24">
        <div
          className="max-w-2xl mx-auto rounded-3xl border border-[#1a2744] p-12 text-center relative overflow-hidden"
          style={{ background: 'rgba(12,20,37,0.8)' }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(0,229,255,0.04) 0%, transparent 70%)',
            }}
          />
          <h2 className="text-2xl font-bold text-white mb-3 relative">Ready to get started?</h2>
          <p className="text-sm text-slate-500 mb-8 relative">
            Sign in with your credentials to access the DHI Data Lake platform. Contact your system
            administrator if you need an account.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-semibold text-white transition-all relative"
            style={{
              background: 'linear-gradient(135deg, #00c8e0, #0062cc)',
              boxShadow: '0 0 28px rgba(0,229,255,0.25)',
            }}
          >
            Sign In to Platform
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-[#1a2744] px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Image src="/images/logos/DHI.webp" alt="DHI" width={20} height={20} className="rounded" />
          <span className="text-xs text-slate-600">DHI Data Lake · Pilot 2026</span>
        </div>
        <span className="text-xs text-slate-700">Druk Holding &amp; Investments · Royal Government of Bhutan</span>
      </footer>
    </div>
  )
}
