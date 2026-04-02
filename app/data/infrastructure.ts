// Infrastructure asset types and data for the Command Center

export interface InfraAsset {
  id: number
  name: string
  type: 'hydropower' | 'telecom' | 'airline' | 'mining' | 'solar' | 'substation' | 'wind'
  position: [number, number]
  status: 'operational' | 'maintenance' | 'offline'
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
}

export const infrastructureAssets: InfraAsset[] = [
  // Hydropower Plants
  { id: 1, name: 'Mangdechhu Hydroelectric Plant', type: 'hydropower', position: [27.45, 90.08], status: 'operational', capacity: '720 MW', output: '3,000 GWh/yr', details: { 'River': 'Mangdechhu', 'Commissioned': '2019', 'Type': 'Run-of-river' } },
  { id: 2, name: 'Tala Hydropower Station', type: 'hydropower', position: [27.09, 89.56], status: 'operational', capacity: '1,020 MW', output: '4,865 GWh/yr', details: { 'River': 'Wangchu', 'Commissioned': '2007', 'Type': 'Run-of-river' } },
  { id: 3, name: 'Chhukha Hydropower Plant', type: 'hydropower', position: [27.07, 89.55], status: 'operational', capacity: '336 MW', output: '1,800 GWh/yr', details: { 'River': 'Wangchu', 'Commissioned': '1988', 'Type': 'Run-of-river' } },
  { id: 4, name: 'Punatsangchhu-I', type: 'hydropower', position: [27.53, 89.82], status: 'maintenance', capacity: '1,200 MW', output: '5,500 GWh/yr', details: { 'River': 'Punatsangchhu', 'Target': '2025', 'Type': 'Run-of-river' } },
  { id: 5, name: 'Punatsangchhu-II', type: 'hydropower', position: [27.45, 89.78], status: 'maintenance', capacity: '1,020 MW', output: '4,340 GWh/yr', details: { 'River': 'Punatsangchhu', 'Target': '2026', 'Type': 'Run-of-river' } },
  { id: 6, name: 'Kurichhu Hydropower Plant', type: 'hydropower', position: [27.57, 91.12], status: 'operational', capacity: '60 MW', output: '399 GWh/yr', details: { 'River': 'Kurichhu', 'Commissioned': '2002', 'Type': 'Run-of-river' } },
  { id: 7, name: 'Basochhu Hydropower Plant', type: 'hydropower', position: [27.43, 89.67], status: 'operational', capacity: '64 MW', output: '270 GWh/yr', details: { 'River': 'Basochhu', 'Commissioned': '2005', 'Type': 'Run-of-river' } },

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

  // Airlines / Airport
  { id: 50, name: 'Paro International Airport', type: 'airline', position: [27.4032, 89.4246], status: 'operational', capacity: 'Runway 2,265m', details: { 'IATA': 'PBH', 'Airlines': 'Druk Air, Bhutan Airlines', 'Elevation': '2,235m' } },
  { id: 51, name: 'Gelephu Mindfulness City Airport', type: 'airline', position: [26.88, 90.46], status: 'maintenance', capacity: 'Under Construction', details: { 'Project': 'Greenfield', 'Target': '2027', 'Type': 'Domestic + International' } },
  { id: 52, name: 'Yonphula Domestic Airport', type: 'airline', position: [27.256, 91.515], status: 'offline', capacity: 'Runway 1,200m', details: { 'IATA': 'YON', 'Status': 'Limited Operations', 'Elevation': '2,743m' } },
  { id: 53, name: 'Bathpalathang Airport', type: 'airline', position: [27.562, 90.747], status: 'operational', capacity: 'Runway 1,200m', details: { 'IATA': 'BUT', 'Airlines': 'Druk Air', 'Elevation': '2,580m' } },

  // Mining Operations
  { id: 60, name: 'Penden Cement Plant', type: 'mining', position: [26.87, 89.38], status: 'operational', capacity: '1,500 TPD', details: { 'Type': 'Limestone/Cement', 'Location': 'Phuentsholing' } },
  { id: 61, name: 'Dungsam Cement Plant', type: 'mining', position: [26.81, 91.50], status: 'operational', capacity: '1,000 TPD', details: { 'Type': 'Cement', 'Location': 'Samdrup Jongkhar' } },
  { id: 62, name: 'Lhaki Cement Plant', type: 'mining', position: [26.88, 89.40], status: 'operational', capacity: '600 TPD', details: { 'Type': 'Cement', 'Location': 'Phuentsholing' } },

  // Solar Plants
  { id: 70, name: 'Rubesa Solar Farm', type: 'solar', position: [27.48, 89.91], status: 'operational', capacity: '30 MW', output: '45 GWh/yr', details: { 'Type': 'Ground-mounted PV', 'Area': '50 hectares' } },
  { id: 71, name: 'Gelephu Solar Project', type: 'solar', position: [26.87, 90.49], status: 'maintenance', capacity: '17 MW', output: '23 GWh/yr', details: { 'Type': 'Ground-mounted PV', 'Area': '30 hectares' } },
  { id: 72, name: 'Tengchholing Solar Farm', type: 'solar', position: [27.50, 89.87], status: 'operational', capacity: '6 MW', output: '8.5 GWh/yr', details: { 'Type': 'Ground-mounted PV', 'Area': '12 hectares' } },

  // Substations
  { id: 80, name: 'Semtokha Substation', type: 'substation', position: [27.44, 89.68], status: 'operational', capacity: '220 kV', details: { 'Type': 'Grid Substation', 'Feeds': 'Thimphu Region' } },
  { id: 81, name: 'Tsirang Substation', type: 'substation', position: [27.03, 90.12], status: 'operational', capacity: '132 kV', details: { 'Type': 'Grid Substation', 'Feeds': 'Central Region' } },
  { id: 82, name: 'Jigmeling Substation', type: 'substation', position: [26.86, 90.47], status: 'operational', capacity: '400 kV', details: { 'Type': 'Export Substation', 'Feeds': 'India Grid' } },
]
