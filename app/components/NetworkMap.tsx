'use client'

import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix for default marker icons in react-leaflet
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

// Custom tower icon
const towerIcon = L.divIcon({
  className: 'custom-tower-icon',
  html: `<div style="background: #10b981; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8]
})

const maintenanceIcon = L.divIcon({
  className: 'custom-maintenance-icon',
  html: `<div style="background: #f97316; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8]
})

interface NetworkMapProps {
  darkMode?: boolean
}

export default function NetworkMap({ darkMode = false }: NetworkMapProps) {
  // Cell tower locations across Bhutan
  const cellTowers = [
    // Thimphu region
    { id: 1, name: 'Thimphu Central Tower', position: [27.4728, 89.6393] as [number, number], status: 'active', coverage: 15, traffic: '2.3M' },
    { id: 2, name: 'Thimphu North', position: [27.5128, 89.6493] as [number, number], status: 'active', coverage: 12, traffic: '1.8M' },
    { id: 3, name: 'Thimphu South', position: [27.4328, 89.6293] as [number, number], status: 'active', coverage: 14, traffic: '2.1M' },
    
    // Paro region
    { id: 4, name: 'Paro Airport Tower', position: [27.4287, 89.4164] as [number, number], status: 'active', coverage: 18, traffic: '3.5M' },
    { id: 5, name: 'Paro Town', position: [27.4387, 89.4264] as [number, number], status: 'maintenance', coverage: 10, traffic: '1.2M' },
    
    // Punakha region
    { id: 6, name: 'Punakha Valley', position: [27.5911, 89.8640] as [number, number], status: 'active', coverage: 16, traffic: '1.9M' },
    { id: 7, name: 'Punakha North', position: [27.6211, 89.8840] as [number, number], status: 'active', coverage: 13, traffic: '1.5M' },
    
    // Bumthang region
    { id: 8, name: 'Bumthang Central', position: [27.5512, 90.7389] as [number, number], status: 'active', coverage: 20, traffic: '2.8M' },
    { id: 9, name: 'Jakar Town', position: [27.5712, 90.7589] as [number, number], status: 'active', coverage: 11, traffic: '1.4M' },
    
    // Phuentsholing region
    { id: 10, name: 'Phuentsholing Border', position: [26.8626, 89.3929] as [number, number], status: 'active', coverage: 17, traffic: '4.2M' },
    { id: 11, name: 'Phuentsholing Central', position: [26.8726, 89.4029] as [number, number], status: 'active', coverage: 15, traffic: '3.8M' },
    
    // Eastern region
    { id: 12, name: 'Mongar Tower', position: [27.2747, 91.2395] as [number, number], status: 'active', coverage: 19, traffic: '2.5M' },
    { id: 13, name: 'Trashigang Hub', position: [27.3333, 91.5547] as [number, number], status: 'active', coverage: 21, traffic: '3.1M' },
    
    // Western region
    { id: 14, name: 'Haa Valley', position: [27.3806, 89.2864] as [number, number], status: 'maintenance', coverage: 14, traffic: '1.1M' },
    { id: 15, name: 'Samtse Region', position: [26.9000, 89.1000] as [number, number], status: 'active', coverage: 16, traffic: '2.0M' },
  ]

  // Center of Bhutan
  const center: [number, number] = [27.5142, 90.4336]
  
  // Bhutan's geographical boundaries
  const bhutanBounds: [[number, number], [number, number]] = [
    [26.7, 88.8],  // Southwest corner
    [28.3, 92.1]   // Northeast corner
  ]

  return (
    <div className="w-full h-full relative">
      <MapContainer
        center={center}
        zoom={8}
        minZoom={7}
        maxZoom={13}
        maxBounds={bhutanBounds}
        maxBoundsViscosity={1.0}
        style={{ height: '100%', width: '100%', borderRadius: '0.75rem' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url={
            darkMode
              ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
              : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          }
        />
        
        {cellTowers.map((tower) => (
          <div key={tower.id}>
            <Marker
              position={tower.position}
              icon={tower.status === 'maintenance' ? maintenanceIcon : towerIcon}
            >
              <Popup>
                <div className="text-sm">
                  <h3 className="font-bold text-slate-800">{tower.name}</h3>
                  <div className="mt-2 space-y-1 text-xs">
                    <p>
                      <span className="font-semibold">Status:</span>{' '}
                      <span className={tower.status === 'active' ? 'text-emerald-600' : 'text-orange-600'}>
                        {tower.status === 'active' ? 'Active' : 'Maintenance'}
                      </span>
                    </p>
                    <p>
                      <span className="font-semibold">Coverage:</span> {tower.coverage}km radius
                    </p>
                    <p>
                      <span className="font-semibold">Traffic:</span> {tower.traffic} requests/day
                    </p>
                  </div>
                </div>
              </Popup>
            </Marker>
            
            {/* Coverage circle */}
            <Circle
              center={tower.position}
              radius={tower.coverage * 1000} // Convert km to meters
              pathOptions={{
                color: tower.status === 'maintenance' ? '#f97316' : '#10b981',
                fillColor: tower.status === 'maintenance' ? '#f97316' : '#10b981',
                fillOpacity: 0.1,
                weight: 1,
              }}
            />
          </div>
        ))}
      </MapContainer>
    </div>
  )
}
