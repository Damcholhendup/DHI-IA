'use client'

import { MapContainer, TileLayer, Marker, Popup, CircleMarker, Polyline } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import type { InfraAsset } from '../data/infrastructure'
import { infrastructureAssets, typeColors } from '../data/infrastructure'

export type { InfraAsset }

const typeIcons: Record<string, string> = {
  hydropower: `<svg width="28" height="28" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="14" r="12" fill="#00e5ff" fill-opacity="0.15" stroke="#00e5ff" stroke-width="1.5"/><path d="M14 7v6l4 3" stroke="#00e5ff" stroke-width="2" stroke-linecap="round"/><path d="M10 17h8" stroke="#00e5ff" stroke-width="2" stroke-linecap="round"/><path d="M12 20h4" stroke="#00e5ff" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  telecom: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="4" fill="#00e676" fill-opacity="0.8"/><circle cx="10" cy="10" r="8" stroke="#00e676" stroke-width="1" stroke-opacity="0.3"/></svg>`,
  airline: `<svg width="28" height="28" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="14" r="12" fill="#ffab00" fill-opacity="0.15" stroke="#ffab00" stroke-width="1.5"/><path d="M14 8l3 6H11l3-6z" fill="#ffab00"/><path d="M10 16h8" stroke="#ffab00" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  mining: `<svg width="28" height="28" viewBox="0 0 28 28" fill="none"><rect x="4" y="4" width="20" height="20" rx="4" fill="#ff1744" fill-opacity="0.15" stroke="#ff1744" stroke-width="1.5"/><path d="M10 18l4-10 4 10" stroke="#ff1744" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  solar: `<svg width="28" height="28" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="14" r="12" fill="#ffd600" fill-opacity="0.15" stroke="#ffd600" stroke-width="1.5"/><circle cx="14" cy="14" r="4" fill="#ffd600" fill-opacity="0.6"/><line x1="14" y1="4" x2="14" y2="8" stroke="#ffd600" stroke-width="1.5"/><line x1="14" y1="20" x2="14" y2="24" stroke="#ffd600" stroke-width="1.5"/><line x1="4" y1="14" x2="8" y2="14" stroke="#ffd600" stroke-width="1.5"/><line x1="20" y1="14" x2="24" y2="14" stroke="#ffd600" stroke-width="1.5"/></svg>`,
  substation: `<svg width="28" height="28" viewBox="0 0 28 28" fill="none"><rect x="6" y="6" width="16" height="16" rx="2" fill="#d500f9" fill-opacity="0.15" stroke="#d500f9" stroke-width="1.5"/><circle cx="14" cy="14" r="4" stroke="#d500f9" stroke-width="1.5"/><path d="M14 10v8M10 14h8" stroke="#d500f9" stroke-width="1.5"/></svg>`,
  wind: `<svg width="28" height="28" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="14" r="12" fill="#00bfa5" fill-opacity="0.15" stroke="#00bfa5" stroke-width="1.5"/><path d="M14 8v12M14 14l-5-3M14 14l5-3M14 14l-5 3M14 14l5 3" stroke="#00bfa5" stroke-width="1.5" stroke-linecap="round"/></svg>`,
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

// Transmission lines connecting substations to power plants
const transmissionLines: Array<{ from: [number, number]; to: [number, number]; type: 'high' | 'medium' }> = [
  { from: [27.45, 90.08], to: [27.03, 90.12], type: 'high' },
  { from: [27.09, 89.56], to: [27.44, 89.68], type: 'high' },
  { from: [27.07, 89.55], to: [27.44, 89.68], type: 'high' },
  { from: [27.44, 89.68], to: [27.03, 90.12], type: 'medium' },
  { from: [27.03, 90.12], to: [26.86, 90.47], type: 'high' },
  { from: [27.57, 91.12], to: [27.03, 90.12], type: 'medium' },
  { from: [27.48, 89.91], to: [27.44, 89.68], type: 'medium' },
  { from: [26.87, 90.49], to: [26.86, 90.47], type: 'medium' },
]

interface NetworkMapProps {
  onAssetClick: (asset: InfraAsset) => void
  selectedAsset: InfraAsset | null
  activeFilters: string[]
}

export default function NetworkMap({ onAssetClick, selectedAsset, activeFilters }: NetworkMapProps) {
  const center: [number, number] = [27.4, 90.4]
  const bhutanBounds: [[number, number], [number, number]] = [
    [26.5, 88.5],
    [28.5, 92.3]
  ]

  const filteredAssets = infrastructureAssets.filter(a => activeFilters.includes(a.type))

  return (
    <div className="w-full h-full relative">
      <MapContainer
        center={center}
        zoom={8}
        minZoom={7}
        maxZoom={14}
        maxBounds={bhutanBounds}
        maxBoundsViscosity={1.0}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
        zoomControl={true}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {/* Transmission lines */}
        {activeFilters.includes('hydropower') && transmissionLines.map((line, i) => (
          <Polyline
            key={`line-${i}`}
            positions={[line.from, line.to]}
            pathOptions={{
              color: line.type === 'high' ? '#00e5ff' : '#d500f9',
              weight: line.type === 'high' ? 1.5 : 1,
              opacity: 0.25,
              dashArray: line.type === 'medium' ? '6 4' : undefined,
            }}
          />
        ))}

        {/* Telecom coverage dots */}
        {filteredAssets.filter(a => a.type === 'telecom').map((asset) => (
          <CircleMarker
            key={`coverage-${asset.id}`}
            center={asset.position}
            radius={30}
            pathOptions={{
              color: typeColors[asset.type],
              fillColor: typeColors[asset.type],
              fillOpacity: 0.04,
              weight: 0.5,
              opacity: 0.15,
            }}
          />
        ))}

        {/* Asset markers */}
        {filteredAssets.map((asset) => (
          <Marker
            key={asset.id}
            position={asset.position}
            icon={makeIcon(asset.type)}
            eventHandlers={{
              click: () => onAssetClick(asset),
            }}
          >
            <Popup>
              <div className="min-w-[180px]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: typeColors[asset.type] }} />
                  <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: typeColors[asset.type] }}>
                    {asset.type}
                  </span>
                </div>
                <h3 className="font-bold text-sm text-white mb-1">{asset.name}</h3>
                <div className="flex items-center gap-2 text-xs">
                  <span className={`inline-block w-1.5 h-1.5 rounded-full ${
                    asset.status === 'operational' ? 'bg-green-400' : 
                    asset.status === 'maintenance' ? 'bg-amber-400' : 'bg-red-400'
                  }`} />
                  <span className="text-slate-400 capitalize">{asset.status}</span>
                </div>
                {asset.capacity && (
                  <p className="text-xs text-slate-400 mt-1">Capacity: {asset.capacity}</p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
