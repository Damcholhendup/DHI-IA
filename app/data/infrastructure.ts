// Infrastructure asset types and data for the Command Center

export interface InfraAsset {
  id: number
  name: string
  type: 'hydropower' | 'telecom' | 'airline' | 'mining' | 'solar' | 'substation' | 'wind' | 'financial' | 'tech' | 'industrial'
  position: [number, number]
  status: 'operational' | 'maintenance' | 'offline' | 'under_construction'
  capacity?: string
  output?: string
  details?: Record<string, string>
}

export const typeColors: Record<string, string> = {
  hydropower: '#00e5ff',
  telecom: '#00e676',
  airline: '#ffab00',
  mining: '#ff1744',
  solar: '#ffd600',
  substation: '#d500f9',
  wind: '#00bfa5',
  financial: '#2979ff',
  tech: '#00e5ff',
  industrial: '#ff6d00',
}

export const infrastructureAssets: InfraAsset[] = [
  // ── DGPC Operational Hydropower Plants (all 7) ──────────────────────────
  // Source: drukgreen.bt/dgpc-hydropower/
  { id: 1, name: 'Chhukha Hydropower Plant', type: 'hydropower', position: [27.07, 89.55], status: 'operational', capacity: '336 MW', output: '1,800 GWh/yr', details: { 'Company': 'DGPC', 'River': 'Wangchu', 'Commissioned': '1988', 'Type': 'Run-of-river', 'District': 'Chhukha' } },
  { id: 2, name: 'Basochhu Hydropower Plant', type: 'hydropower', position: [27.43, 89.67], status: 'operational', capacity: '64 MW', output: '270 GWh/yr', details: { 'Company': 'DGPC', 'River': 'Basochhu', 'Commissioned': '2001/2005', 'Type': 'Run-of-river', 'District': 'Wangdue Phodrang' } },
  { id: 3, name: 'Kurichhu Hydropower Plant', type: 'hydropower', position: [27.57, 91.12], status: 'operational', capacity: '60 MW', output: '399 GWh/yr', details: { 'Company': 'DGPC', 'River': 'Kurichhu', 'Commissioned': '2002', 'Type': 'Run-of-river', 'District': 'Mongar' } },
  { id: 4, name: 'Tala Hydropower Station', type: 'hydropower', position: [27.09, 89.56], status: 'operational', capacity: '1,020 MW', output: '4,865 GWh/yr', details: { 'Company': 'DGPC', 'River': 'Wangchu', 'Commissioned': '2007', 'Type': 'Run-of-river', 'District': 'Chhukha' } },
  { id: 5, name: 'Dagachhu Hydropower Plant', type: 'hydropower', position: [27.04, 89.90], status: 'operational', capacity: '126 MW', output: '515 GWh/yr', details: { 'Company': 'DGPC', 'River': 'Dagachhu', 'Commissioned': '2015', 'Type': 'Run-of-river', 'District': 'Dagana' } },
  { id: 6, name: 'Mangdechhu Hydroelectric Plant', type: 'hydropower', position: [27.45, 90.08], status: 'operational', capacity: '720 MW', output: '3,000 GWh/yr', details: { 'Company': 'DGPC', 'River': 'Mangdechhu', 'Commissioned': '2019', 'Type': 'Run-of-river', 'District': 'Trongsa' } },
  { id: 7, name: 'Nikachhu Hydropower Plant', type: 'hydropower', position: [27.46, 90.37], status: 'operational', capacity: '118 MW', output: '493 GWh/yr', details: { 'Company': 'DGPC (Tangsibji Hydro Energy)', 'River': 'Nikachhu', 'Commissioned': '2024', 'Type': 'Run-of-river', 'District': 'Trongsa' } },

  // ── Non-DGPC Hydropower (PHPA — Bhutan-India joint project) ─────────────
  { id: 8, name: 'Punatsangchhu-I HEP', type: 'hydropower', position: [27.53, 89.82], status: 'under_construction', capacity: '1,200 MW', output: '5,500 GWh/yr', details: { 'Company': 'PHPA-I', 'River': 'Punatsangchhu', 'Type': 'Run-of-river', 'Note': 'Under construction — geological challenges', 'District': 'Wangdue' } },
  { id: 9, name: 'Punatsangchhu-II HEP', type: 'hydropower', position: [27.45, 89.78], status: 'under_construction', capacity: '1,020 MW', output: '4,340 GWh/yr', details: { 'Company': 'PHPA-II', 'River': 'Punatsangchhu', 'Type': 'Run-of-river', 'Note': 'Under construction', 'District': 'Wangdue' } },

  // Telecom Towers
  { id: 20, name: 'Thimphu Central Tower', type: 'telecom', position: [27.4728, 89.6393], status: 'operational', details: { 'Network': '4G/5G', 'Coverage': '15km' } },
  { id: 21, name: 'Thimphu North Tower', type: 'telecom', position: [27.512, 89.649], status: 'operational', details: { 'Network': '4G', 'Coverage': '12km' } },
  { id: 22, name: 'Thimphu South Tower', type: 'telecom', position: [27.432, 89.629], status: 'operational', details: { 'Network': '4G', 'Coverage': '14km' } },
  { id: 23, name: 'Paro Airport Tower', type: 'telecom', position: [27.4287, 89.4164], status: 'operational', details: { 'Network': '4G/5G', 'Coverage': '18km' } },
  { id: 24, name: 'Paro Town Tower', type: 'telecom', position: [27.438, 89.426], status: 'maintenance', details: { 'Network': '4G', 'Coverage': '10km' } },
  { id: 25, name: 'Punakha Valley Tower', type: 'telecom', position: [27.5911, 89.864], status: 'operational', details: { 'Network': '4G', 'Coverage': '16km' } },
  { id: 26, name: 'Bumthang Central Tower', type: 'telecom', position: [27.5512, 90.7389], status: 'operational', details: { 'Network': '4G', 'Coverage': '20km' } },
  { id: 27, name: 'Phuentsholing Border Tower', type: 'telecom', position: [26.8626, 89.3929], status: 'operational', details: { 'Network': '4G/5G', 'Coverage': '17km' } },
  { id: 28, name: 'Mongar Tower', type: 'telecom', position: [27.2747, 91.2395], status: 'operational', details: { 'Network': '4G', 'Coverage': '19km' } },
  { id: 29, name: 'Trashigang Hub', type: 'telecom', position: [27.3333, 91.5547], status: 'operational', details: { 'Network': '4G', 'Coverage': '21km' } },
  { id: 30, name: 'Haa Valley Tower', type: 'telecom', position: [27.3806, 89.2864], status: 'maintenance', details: { 'Network': '3G/4G', 'Coverage': '14km' } },
  { id: 31, name: 'Samtse Tower', type: 'telecom', position: [26.9, 89.1], status: 'operational', details: { 'Network': '4G', 'Coverage': '16km' } },
  { id: 32, name: 'Wangdue Tower', type: 'telecom', position: [27.488, 89.901], status: 'operational', details: { 'Network': '4G', 'Coverage': '15km' } },
  { id: 33, name: 'Trongsa Tower', type: 'telecom', position: [27.503, 90.509], status: 'operational', details: { 'Network': '4G', 'Coverage': '13km' } },
  { id: 34, name: 'Zhemgang Tower', type: 'telecom', position: [27.217, 90.658], status: 'operational', details: { 'Network': '3G/4G', 'Coverage': '11km' } },
  { id: 35, name: 'Sarpang Tower', type: 'telecom', position: [26.862, 90.267], status: 'operational', details: { 'Network': '4G', 'Coverage': '14km' } },
  { id: 36, name: 'Dagana Tower', type: 'telecom', position: [27.077, 89.873], status: 'operational', details: { 'Network': '3G', 'Coverage': '10km' } },
  { id: 37, name: 'Lhuntse Tower', type: 'telecom', position: [27.667, 91.182], status: 'operational', details: { 'Network': '3G/4G', 'Coverage': '12km' } },
  { id: 38, name: 'Samdrup Jongkhar Tower', type: 'telecom', position: [26.801, 91.514], status: 'operational', details: { 'Network': '4G', 'Coverage': '15km' } },
  { id: 39, name: 'Gelephu Tower', type: 'telecom', position: [26.862, 90.492], status: 'operational', details: { 'Network': '4G/5G', 'Coverage': '18km' } },
  { id: 40, name: 'Trashi Yangtse Tower', type: 'telecom', position: [27.616, 91.497], status: 'operational', details: { 'Network': '3G', 'Coverage': '10km' } },
  { id: 41, name: 'Pemagatshel Tower', type: 'telecom', position: [27.038, 91.403], status: 'operational', details: { 'Network': '3G/4G', 'Coverage': '11km' } },
  { id: 42, name: 'Gasa Tower', type: 'telecom', position: [27.897, 89.726], status: 'maintenance', details: { 'Network': '3G', 'Coverage': '8km' } },
  { id: 43, name: 'Tsirang Tower', type: 'telecom', position: [27.022, 90.118], status: 'operational', details: { 'Network': '3G/4G', 'Coverage': '12km' } },

  // ── Airlines / Airport ──────────────────────────────────────────────────
  { id: 50, name: 'Paro International Airport', type: 'airline', position: [27.4032, 89.4246], status: 'operational', capacity: 'Runway 2,265m', details: { 'IATA': 'PBH', 'Airlines': 'Druk Air, Bhutan Airlines', 'Elevation': '2,235m' } },
  { id: 51, name: 'Gelephu Mindfulness City Airport', type: 'airline', position: [26.88, 90.46], status: 'under_construction', capacity: 'Under Construction', details: { 'Project': 'Greenfield', 'Target': '2027', 'Type': 'Domestic + International' } },
  { id: 52, name: 'Yonphula Domestic Airport', type: 'airline', position: [27.256, 91.515], status: 'offline', capacity: 'Runway 1,200m', details: { 'IATA': 'YON', 'Status': 'Limited Operations', 'Elevation': '2,743m' } },
  { id: 53, name: 'Bathpalathang Airport', type: 'airline', position: [27.562, 90.747], status: 'operational', capacity: 'Runway 1,200m', details: { 'IATA': 'BUT', 'Airlines': 'Druk Air', 'Elevation': '2,580m' } },
]
