'use client'

import { MapContainer, TileLayer, Marker, Popup, CircleMarker, Polyline, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useState, useEffect } from 'react'
import type { InfraAsset } from '../data/infrastructure'
import { infrastructureAssets, typeColors } from '../data/infrastructure'
import { fetchBTTowerDetails, towersByRegion } from '../lib/bt-api'
import type { BTCellTowerDetail, TowerRegion } from '../lib/bt-api'
import { fetchPassengerTraffic, aggregatePaxByRoute } from '../lib/drukair-api'

// Bhutan dzongkhag (district) centroids [lat, lng]
const dzongkhagCoords: Record<string, [number, number]> = {
  'Bumthang':          [27.549, 90.736],
  'Chhukha':           [27.042, 89.584],
  'Dagana':            [27.099, 89.906],
  'Gasa':              [27.895, 89.725],
  'Haa':               [27.383, 89.273],
  'Lhuentse':          [27.668, 91.184],
  'Mongar':            [27.274, 91.235],
  'Paro':              [27.431, 89.420],
  'Pema Gatshel':      [26.953, 91.420],
  'Punakha':           [27.604, 89.862],
  'Samdrupjongkhar':   [26.793, 91.504],
  'Samtse':            [26.906, 89.117],
  'Sarpang':           [26.869, 90.270],
  'Thimphu':           [27.467, 89.642],
  'Trashigang':        [27.325, 91.555],
  'Trashiyangtse':     [27.619, 91.751],
  'Trongsa':           [27.502, 90.508],
  'Tsirang':           [27.009, 90.120],
  'Wangdi Phodrang':   [27.467, 89.904],
  'Wangdi ':           [27.467, 89.904],  // handle trailing-space variant from API
  'Zhemgang':          [27.235, 90.659],
}

// Airport IATA code → [lat, lng]  (covers all codes seen in live passenger_traffic API)
const airportCoords: Record<string, [number, number]> = {
  PBH: [27.4032, 89.4246],   // Paro International, Bhutan
  DEL: [28.5562, 77.1000],   // Indira Gandhi, Delhi
  BKK: [13.6900, 100.7501],  // Suvarnabhumi, Bangkok
  KTM: [27.6966, 85.3591],   // Tribhuvan, Kathmandu
  CCU: [22.6520, 88.4463],   // Netaji Subhas, Kolkata
  DAC: [23.8432, 90.3984],   // Hazrat Shahjalal, Dhaka
  SIN: [1.3644,  103.9915],  // Changi, Singapore
  GAU: [26.1061, 91.5859],   // Lokpriya Gopinath Bordoloi, Guwahati
  BUT: [27.562,  90.747],    // Bathpalathang, Bumthang
  YON: [27.256,  91.515],    // Yonphula, Bhutan
  DXB: [25.2532, 55.3657],   // Dubai International
  GAY: [24.7443, 84.9512],   // Gaya, India
  GLU: [26.862,  90.492],    // Gelephu, Bhutan
  IXB: [26.6812, 88.3286],   // Bagdogra, Siliguri
}

// Airport code → display name
const airportNames: Record<string, string> = {
  PBH: 'Paro',      DEL: 'Delhi',     BKK: 'Bangkok',  KTM: 'Kathmandu',
  CCU: 'Kolkata',   DAC: 'Dhaka',     SIN: 'Singapore', GAU: 'Guwahati',
  BUT: 'Bumthang',  YON: 'Yonphula', DXB: 'Dubai',    GAY: 'Gaya',
  GLU: 'Gelephu',   IXB: 'Bagdogra',
}

// BT region code → geographic centroid [lat, lng]
const regionCentroids: Record<string, [number, number]> = {
  WR:  [27.55, 89.60],   // Western Region  (Thimphu / Paro)
  CR:  [27.55, 90.50],   // Central Region  (Trongsa / Bumthang)
  ER:  [27.30, 91.55],   // Eastern Region  (Trashigang)
  SWR: [26.85, 89.88],   // South-Western Region (Sarpang / Gelephu)
}

const regionFullNames: Record<string, string> = {
  WR:  'Western Region',
  CR:  'Central Region',
  ER:  'Eastern Region',
  SWR: 'South-Western Region',
}

function regionTechColor(r: TowerRegion): string {
  if (r.has5g  > 0)                   return '#d500f9'
  if (r.lte4g  / r.count > 0.2)       return '#00e676'
  if (r.has3g  / r.count > 0.2)       return '#ffab00'
  return '#00e5ff'
}

export type { InfraAsset }

const typeIcons: Record<string, string> = {
  hydropower: `<svg width="28" height="28" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="14" r="12" fill="#00e5ff" fill-opacity="0.15" stroke="#00e5ff" stroke-width="1.5"/><path d="M14 7v6l4 3" stroke="#00e5ff" stroke-width="2" stroke-linecap="round"/><path d="M10 17h8" stroke="#00e5ff" stroke-width="2" stroke-linecap="round"/><path d="M12 20h4" stroke="#00e5ff" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  telecom: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="4" fill="#00e676" fill-opacity="0.8"/><circle cx="10" cy="10" r="8" stroke="#00e676" stroke-width="1" stroke-opacity="0.3"/></svg>`,
  airline: `<svg width="28" height="28" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="14" r="12" fill="#ffab00" fill-opacity="0.15" stroke="#ffab00" stroke-width="1.5"/><path d="M14 8l3 6H11l3-6z" fill="#ffab00"/><path d="M10 16h8" stroke="#ffab00" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  mining: `<svg width="28" height="28" viewBox="0 0 28 28" fill="none"><rect x="4" y="4" width="20" height="20" rx="4" fill="#ff1744" fill-opacity="0.15" stroke="#ff1744" stroke-width="1.5"/><path d="M10 18l4-10 4 10" stroke="#ff1744" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  solar: `<svg width="28" height="28" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="14" r="12" fill="#ffd600" fill-opacity="0.15" stroke="#ffd600" stroke-width="1.5"/><circle cx="14" cy="14" r="4" fill="#ffd600" fill-opacity="0.6"/><line x1="14" y1="4" x2="14" y2="8" stroke="#ffd600" stroke-width="1.5"/><line x1="14" y1="20" x2="14" y2="24" stroke="#ffd600" stroke-width="1.5"/><line x1="4" y1="14" x2="8" y2="14" stroke="#ffd600" stroke-width="1.5"/><line x1="20" y1="14" x2="24" y2="14" stroke="#ffd600" stroke-width="1.5"/></svg>`,
  substation: `<svg width="28" height="28" viewBox="0 0 28 28" fill="none"><rect x="6" y="6" width="16" height="16" rx="2" fill="#d500f9" fill-opacity="0.15" stroke="#d500f9" stroke-width="1.5"/><circle cx="14" cy="14" r="4" stroke="#d500f9" stroke-width="1.5"/><path d="M14 10v8M10 14h8" stroke="#d500f9" stroke-width="1.5"/></svg>`,
  wind: `<svg width="28" height="28" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="14" r="12" fill="#00bfa5" fill-opacity="0.15" stroke="#00bfa5" stroke-width="1.5"/><path d="M14 8v12M14 14l-5-3M14 14l5-3M14 14l-5 3M14 14l5 3" stroke="#00bfa5" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  financial: `<svg width="28" height="28" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="14" r="12" fill="#2979ff" fill-opacity="0.15" stroke="#2979ff" stroke-width="1.5"/><rect x="8" y="11" width="12" height="9" rx="1.5" stroke="#2979ff" stroke-width="1.5"/><path d="M11 11V9a3 3 0 0 1 6 0v2" stroke="#2979ff" stroke-width="1.5" stroke-linecap="round"/><path d="M14 15v2" stroke="#2979ff" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  tech: `<svg width="28" height="28" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="14" r="12" fill="#00e5ff" fill-opacity="0.15" stroke="#00e5ff" stroke-width="1.5"/><rect x="7" y="9" width="14" height="9" rx="1.5" stroke="#00e5ff" stroke-width="1.5"/><path d="M11 21h6M14 18v3" stroke="#00e5ff" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  industrial: `<svg width="28" height="28" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="14" r="12" fill="#ff6d00" fill-opacity="0.15" stroke="#ff6d00" stroke-width="1.5"/><path d="M7 21V13l4-3v3l4-3v3l4-3v9H7z" stroke="#ff6d00" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
}

function makeIcon(type: string) {
  const html = typeIcons[type] || typeIcons.telecom
  const size = type === 'telecom' ? 20 : 28
  return L.divIcon({
    className: '',
    html: `<div style="filter: drop-shadow(0 0 6px ${typeColors[type]}40);">${html}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  })
}

interface NetworkMapProps {
  onAssetClick: (asset: InfraAsset) => void
  selectedAsset: InfraAsset | null
  activeFilters: string[]
}

function ResetViewControl({ bounds }: { bounds: [[number, number], [number, number]] }) {
  const map = useMap()
  return (
    <button
      onClick={() => map.flyToBounds(bounds, { padding: [10, 10], duration: 0.8 })}
      title="Reset map view"
      className="absolute z-[1000] flex items-center gap-1.5 glass-panel rounded-lg px-2.5 py-1.5 text-[10px] font-medium text-slate-400 hover:text-cyan-400 transition-colors"
      style={{ top: '80px', left: '10px' }}
    >
      <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round">
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <path d="M3 3v5h5" />
      </svg>
      Reset View
    </button>
  )
}

export default function NetworkMap({ onAssetClick, selectedAsset, activeFilters }: NetworkMapProps) {
  const [selectedAirport, setSelectedAirport] = useState<InfraAsset | null>(null)
  const [btTowers, setBtTowers] = useState<BTCellTowerDetail[]>([])
  const [liveRoutes, setLiveRoutes] = useState<{ route: string; pax: number; revenue: number; dom_int: string }[]>([])
  const [fiveGSites, setFiveGSites] = useState<{ name: string; lat: number; lng: number; region: string }[]>([])
  const [dzongkhagComplaints, setDzongkhagComplaints] = useState<{ name: string; count: number; pos: [number, number] }[]>([])

  useEffect(() => {
    fetchBTTowerDetails(5000)
      .then(towers => setBtTowers(towers.filter(t => t.latitude && t.longitude)))
      .catch(() => {/* silently fall back to empty */})
    fetchPassengerTraffic(1, 10000)
      .then(res => setLiveRoutes(aggregatePaxByRoute(res.data, 20)))
      .catch(() => {})

    // 5G sites: filter cell_tower_details where network_5g is set
    fetch('/api/bhutan_telecom/cell_tower_details?limit=5000')
      .then(r => r.json())
      .then(d => {
        const sites = (d.data ?? [])
          .filter((t: { network_5g: string | null; latitude: number | null; longitude: number | null }) =>
            t.network_5g && t.latitude && t.longitude)
          .map((t: { site_name_: string; regions: string; latitude: number; longitude: number }) => ({
            name: t.site_name_,
            lat: t.latitude,
            lng: t.longitude,
            region: t.regions,
          }))
        setFiveGSites(sites)
      })
      .catch(() => {})

    // Complaints: aggregate by dzongkhag
    fetch('/api/bhutan_telecom/customer_complaints?limit=5000')
      .then(r => r.json())
      .then(d => {
        const counts: Record<string, number> = {}
        for (const row of (d.data ?? [])) {
          const dz = (row.dzongkhag ?? '').trim()
          if (dz) counts[dz] = (counts[dz] ?? 0) + 1
        }
        const result = Object.entries(counts)
          .map(([name, count]) => {
            const pos = dzongkhagCoords[name] ?? dzongkhagCoords[name.trim()]
            return pos ? { name, count, pos } : null
          })
          .filter(Boolean) as { name: string; count: number; pos: [number, number] }[]
        setDzongkhagComplaints(result)
      })
      .catch(() => {})
  }, [])

  const bhutanBounds: [[number, number], [number, number]] = [
    [26.7, 88.75],
    [28.35, 92.15]
  ]

  const filteredAssets = infrastructureAssets.filter(a => activeFilters.includes(a.type))

  const regionBubbles = towersByRegion(btTowers)
  const maxRegionCount = Math.max(...regionBubbles.map(r => r.count), 1)

  const handleAssetClick = (asset: InfraAsset) => {
    onAssetClick(asset)
    if (asset.type === 'airline') {
      setSelectedAirport(prev => prev?.id === asset.id ? null : asset)
    } else {
      setSelectedAirport(null)
    }
  }

  // Derive IATA code for the selected airport from its IATA detail or known coords match
  const selectedIATA: string | null = selectedAirport
    ? (selectedAirport.details?.IATA ??
        Object.entries(airportCoords).find(
          ([, pos]) => pos[0] === selectedAirport.position[0] && pos[1] === selectedAirport.position[1]
        )?.[0] ?? null)
    : null

  // Build active routes — merge both directions (PBH-BKK + BKK-PBH) into one entry per destination
  const activeRoutes: { dest: string; destPos: [number, number]; originPos: [number, number]; pax: number; label: string; dom_int: string }[] =
    selectedAirport && selectedIATA
      ? (() => {
          const merged = new Map<string, { destPos: [number, number]; pax: number; label: string; dom_int: string }>()
          for (const r of liveRoutes) {
            const [orig, dest] = r.route.split('-')
            if (orig !== selectedIATA && dest !== selectedIATA) continue
            const otherCode = orig === selectedIATA ? dest : orig
            const otherPos  = airportCoords[otherCode]
            if (!otherPos) continue
            const existing = merged.get(otherCode)
            if (existing) {
              existing.pax += r.pax
            } else {
              merged.set(otherCode, {
                destPos:  otherPos,
                pax:      r.pax,
                label:    airportNames[otherCode] ?? otherCode,
                dom_int:  r.dom_int,
              })
            }
          }
          return Array.from(merged.entries())
            .map(([dest, v]) => ({ dest, originPos: selectedAirport.position, ...v }))
            .sort((a, b) => b.pax - a.pax)
        })()
      : []

  return (
    <div className="w-full h-full relative">
      <MapContainer
        bounds={bhutanBounds}
        boundsOptions={{ padding: [10, 10] }}
        minZoom={3}
        maxZoom={14}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
        zoomControl={true}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        <ResetViewControl bounds={bhutanBounds} />

        {/* BT Network region bubble glows */}
        {activeFilters.includes('telecom') && regionBubbles.map((r) => {
          const pos = regionCentroids[r.region]
          if (!pos) return null
          const color  = regionTechColor(r)
          const radius = 14 + (r.count / maxRegionCount) * 18
          return (
            <CircleMarker
              key={`rglow-${r.region}`}
              center={pos}
              radius={radius + 12}
              pathOptions={{ color, fillColor: color, fillOpacity: 0.06, weight: 0.5, opacity: 0.15 }}
            />
          )
        })}

        {/* BT Network region bubbles */}
        {activeFilters.includes('telecom') && regionBubbles.map((r) => {
          const pos = regionCentroids[r.region]
          if (!pos) return null
          const color  = regionTechColor(r)
          const radius = 14 + (r.count / maxRegionCount) * 18
          return (
            <CircleMarker
              key={`rbub-${r.region}`}
              center={pos}
              radius={radius}
              pathOptions={{ color, fillColor: color, fillOpacity: 0.22, weight: 2, opacity: 0.85 }}
            >
              <Popup>
                <div className="min-w-[210px]">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: color }} />
                    <span className="text-xs font-bold uppercase tracking-wider" style={{ color }}>
                      BT Network · {regionFullNames[r.region] ?? r.region}
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-white mb-2">{r.count} Cell Sites</h3>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs border-t border-slate-700 pt-2">
                    {r.has5g  > 0 && <><span className="text-slate-500">5G Sites</span><span className="text-purple-400 font-mono">{r.has5g}</span></>}
                    {r.lte4g  > 0 && <><span className="text-slate-500">4G / LTE</span><span className="text-green-400 font-mono">{r.lte4g}</span></>}
                    {r.has3g  > 0 && <><span className="text-slate-500">3G Sites</span><span className="text-amber-400 font-mono">{r.has3g}</span></>}
                    {r.has2g  > 0 && <><span className="text-slate-500">2G Sites</span><span className="text-cyan-400 font-mono">{r.has2g}</span></>}
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          )
        })}

        {/* ── 5G Sites layer ─────────────────────────────────────────── */}
        {activeFilters.includes('5g') && fiveGSites.map((site, i) => (
          <CircleMarker
            key={`5g-${i}`}
            center={[site.lat, site.lng]}
            radius={4}
            pathOptions={{ color: '#d500f9', fillColor: '#d500f9', fillOpacity: 0.75, weight: 1, opacity: 0.9 }}
          >
            <Popup>
              <div className="min-w-[180px]">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-purple-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-400">5G Site · {site.region}</span>
                </div>
                <h3 className="font-bold text-sm text-white">{site.name}</h3>
              </div>
            </Popup>
          </CircleMarker>
        ))}

        {/* ── Complaints by Dzongkhag layer ──────────────────────────── */}
        {activeFilters.includes('complaints') && (() => {
          const maxCount = Math.max(...dzongkhagComplaints.map(d => d.count), 1)
          return dzongkhagComplaints.map((dz) => {
            const radius = 7 + (dz.count / maxCount) * 20
            // interpolate color: low=amber, high=red
            const intensity = dz.count / maxCount
            const r = Math.round(255)
            const g = Math.round(109 - intensity * 109)  // 109→0
            const b = 0
            const color = `rgb(${r},${g},${b})`
            return (
              <CircleMarker
                key={`dz-${dz.name}`}
                center={dz.pos}
                radius={radius}
                pathOptions={{ color, fillColor: color, fillOpacity: 0.25, weight: 1.5, opacity: 0.7 }}
              >
                <Popup>
                  <div className="min-w-[180px]">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                      <span className="text-xs font-bold uppercase tracking-wider" style={{ color }}>
                        BT Complaints · {dz.name}
                      </span>
                    </div>
                    <h3 className="font-bold text-xl text-white mb-1">{dz.count.toLocaleString()}</h3>
                    <p className="text-xs text-slate-400">Complaints logged (2025)</p>
                  </div>
                </Popup>
              </CircleMarker>
            )
          })
        })()}

        {/* Non-telecom asset markers (hydro, airline, etc.) */}
        {filteredAssets.filter(a => a.type !== 'telecom').map((asset) => (
          <Marker
            key={asset.id}
            position={asset.position}
            icon={makeIcon(asset.type)}
            eventHandlers={{
              click: () => handleAssetClick(asset),
            }}
          >
            <Popup>
              <div className="min-w-[200px]">
                {asset.type === 'hydropower' ? (
                  <>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full" style={{ background: typeColors[asset.type] }} />
                      <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: typeColors[asset.type] }}>
                        Hydropower
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-white mb-2">{asset.name}</h3>
                    <div className="flex items-center gap-2 text-xs mb-2">
                      <span className={`inline-block w-1.5 h-1.5 rounded-full ${
                        asset.status === 'operational' ? 'bg-green-400' :
                        asset.status === 'maintenance' ? 'bg-amber-400' : 'bg-red-400'
                      }`} />
                      <span className="text-slate-400 capitalize">{asset.status.replace('_', ' ')}</span>
                    </div>
                    <div className="space-y-1 text-xs border-t border-slate-700 pt-2">
                      {asset.capacity && (
                        <div className="flex justify-between gap-4">
                          <span className="text-slate-500">Installed Capacity</span>
                          <span className="text-slate-200 font-medium">{asset.capacity}</span>
                        </div>
                      )}
                      {asset.output && (
                        <div className="flex justify-between gap-4">
                          <span className="text-slate-500">Annual Output</span>
                          <span className="text-slate-200 font-medium">{asset.output}</span>
                        </div>
                      )}
                      {asset.details?.River && (
                        <div className="flex justify-between gap-4">
                          <span className="text-slate-500">River</span>
                          <span className="text-slate-200">{asset.details.River}</span>
                        </div>
                      )}
                      {asset.details?.Type && (
                        <div className="flex justify-between gap-4">
                          <span className="text-slate-500">Type</span>
                          <span className="text-slate-200">{asset.details.Type}</span>
                        </div>
                      )}
                      {asset.details?.District && (
                        <div className="flex justify-between gap-4">
                          <span className="text-slate-500">District</span>
                          <span className="text-slate-200">{asset.details.District}</span>
                        </div>
                      )}
                      {asset.details?.Commissioned && (
                        <div className="flex justify-between gap-4">
                          <span className="text-slate-500">Commissioned</span>
                          <span className="text-slate-200">{asset.details.Commissioned}</span>
                        </div>
                      )}
                      {asset.details?.Company && (
                        <div className="flex justify-between gap-4">
                          <span className="text-slate-500">Operator</span>
                          <span className="text-slate-200">{asset.details.Company}</span>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full" style={{ background: typeColors[asset.type] }} />
                      <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: typeColors[asset.type] }}>
                        {({'hydropower':'Hydropower','telecom':'Telecom','airline':'Airport','substation':'Power Grid','mining':'Mining','industrial':'Industrial','tech':'Technology','financial':'Finance','wind':'Wind','solar':'Solar'} as Record<string,string>)[asset.type] ?? asset.type}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-white mb-2">{asset.name}</h3>
                    <div className="flex items-center gap-2 text-xs mb-2">
                      <span className={`inline-block w-1.5 h-1.5 rounded-full ${
                        asset.status === 'operational' ? 'bg-green-400' :
                        asset.status === 'maintenance' ? 'bg-amber-400' :
                        asset.status === 'under_construction' ? 'bg-purple-400' : 'bg-red-400'
                      }`} />
                      <span className="text-slate-400 capitalize">{asset.status.replace('_', ' ')}</span>
                    </div>
                    <div className="space-y-1 text-xs border-t border-slate-700 pt-2">
                      {asset.capacity && (
                        <div className="flex justify-between gap-4">
                          <span className="text-slate-500">Capacity</span>
                          <span className="text-slate-200 font-medium">{asset.capacity}</span>
                        </div>
                      )}
                      {asset.details && Object.entries(asset.details).map(([k, v]) => (
                        <div key={k} className="flex justify-between gap-4">
                          <span className="text-slate-500">{k}</span>
                          <span className="text-slate-200 text-right max-w-[130px]">{v}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Flight route lines when an airport is selected */}
        {activeRoutes.map((route, i) => {
          const maxPax = Math.max(...activeRoutes.map(r => r.pax), 1)
          const weight = route.pax > 0 ? 1 + (route.pax / maxPax) * 3 : 1.5
          const isInt  = route.dom_int === 'INT'
          return (
            <Polyline
              key={`route-${i}`}
              positions={[route.originPos, route.destPos]}
              pathOptions={{
                color: isInt ? '#ffab00' : '#00e5ff',
                weight,
                opacity: 0.65,
                dashArray: isInt ? undefined : '8 6',
              }}
            />
          )
        })}

        {/* Destination markers for active routes */}
        {activeRoutes.map((route, i) => (
          <CircleMarker
            key={`dest-${i}`}
            center={route.destPos}
            radius={5}
            pathOptions={{
              color: route.dom_int === 'INT' ? '#ffab00' : '#00e5ff',
              fillColor: route.dom_int === 'INT' ? '#ffab00' : '#00e5ff',
              fillOpacity: 0.85,
              weight: 1.5,
            }}
          >
            <Popup>
              <div className="min-w-[160px]">
                <h3 className="font-bold text-sm text-white mb-1">{route.label}</h3>
                <div className="space-y-1 text-xs pt-1 border-t border-slate-700">
                  <div className="flex justify-between gap-4"><span className="text-slate-500">Passengers</span><span className="text-slate-200 font-mono">{route.pax.toLocaleString()}</span></div>
                  <div className="flex justify-between gap-4"><span className="text-slate-500">Type</span><span className={route.dom_int === 'INT' ? 'text-amber-400' : 'text-cyan-400'}>{route.dom_int}</span></div>
                </div>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>

      {/* BT Region bubble legend */}
      {activeFilters.includes('telecom') && btTowers.length > 0 && (
        <div className="absolute bottom-4 left-4 z-[1000] glass-panel rounded-lg p-3">
          <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500 block mb-2">
            BT Infrastructure · {btTowers.length.toLocaleString()} Sites
          </span>
          <div className="flex flex-col gap-1.5">
            {regionBubbles.map(r => {
              const color = regionTechColor(r)
              return (
                <div key={r.region} className="flex items-center gap-2 text-[10px]">
                  <span className="rounded-full flex-shrink-0 border-2" style={{
                    width: '10px', height: '10px',
                    borderColor: color,
                    background: `${color}30`,
                  }} />
                  <span className="text-slate-300 font-medium">{regionFullNames[r.region] ?? r.region}</span>
                  <span className="text-slate-500 ml-auto pl-3 font-mono">{r.count}</span>
                </div>
              )
            })}
          </div>
          <div className="flex gap-3 mt-2 pt-2 border-t border-slate-700 text-[9px]">
            {[['#d500f9','5G'],['#00e676','4G'],['#ffab00','3G'],['#00e5ff','2G']].map(([c, l]) => (
              <div key={l} className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: c }} />
                <span className="text-slate-500">{l}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5G sites legend */}
      {activeFilters.includes('5g') && fiveGSites.length > 0 && !activeFilters.includes('telecom') && (
        <div className="absolute bottom-4 left-4 z-[1000] glass-panel rounded-lg p-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500 flex-shrink-0" />
            <span className="text-[10px] font-bold text-purple-400">5G Sites · {fiveGSites.length} deployed</span>
          </div>
        </div>
      )}

      {/* Complaints legend */}
      {activeFilters.includes('complaints') && dzongkhagComplaints.length > 0 && (
        <div className={`absolute z-[1000] glass-panel rounded-lg p-3 ${activeFilters.includes('telecom') || (activeFilters.includes('5g') && !activeFilters.includes('telecom')) ? 'bottom-[120px] left-4' : 'bottom-4 left-4'}`}>
          <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500 block mb-1.5">
            BT Complaints · By Dzongkhag
          </span>
          <div className="flex items-center gap-3 text-[9px] text-slate-500">
            <div className="flex items-center gap-1.5">
              <span className="rounded-full border border-amber-500" style={{ width:8,height:8,display:'inline-block',background:'rgba(255,109,0,0.2)' }} />
              Low
            </div>
            <div className="flex items-center gap-1.5">
              <span className="rounded-full border border-red-500" style={{ width:12,height:12,display:'inline-block',background:'rgba(255,0,0,0.2)' }} />
              High
            </div>
          </div>
        </div>
      )}

      {/* Route legend when airport is selected */}
      {selectedAirport && activeRoutes.length > 0 && (
        <div className="absolute bottom-4 right-4 z-[1000] glass-panel rounded-lg p-3 max-w-[220px]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
              Routes from {selectedAirport.name.replace(/ (International |Domestic |Mindfulness City )?Airport/, '')}
            </span>
            <button onClick={() => setSelectedAirport(null)} className="text-slate-600 hover:text-slate-300 ml-2">
              <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div className="space-y-1">
            {activeRoutes.map((route, i) => (
              <div key={i} className="flex items-center gap-2 text-[11px]">
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${route.dom_int === 'INT' ? 'bg-amber-400' : 'bg-cyan-400'}`} />
                <span className="text-slate-300">{route.label}</span>
                {route.pax > 0 && <span className="text-slate-600 ml-auto text-[10px]">{route.pax.toLocaleString()} pax</span>}
              </div>
            ))}
          </div>
          <div className="flex gap-3 mt-2 pt-2 border-t border-slate-700 text-[9px] text-slate-500">
            <span><span className="text-amber-400">—</span> International</span>
            <span><span className="text-cyan-400">- -</span> Domestic</span>
          </div>
        </div>
      )}
    </div>
  )
}
