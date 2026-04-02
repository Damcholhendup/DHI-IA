// DHI (Druk Holding & Investments) Group Data
// DHI is the commercial arm of the Royal Government of Bhutan

export interface DHICompany {
  id: string
  name: string
  shortName: string
  sector: string
  sectorColor: string
  logo?: string
  description: string
  established: number
  employees: number
  annualRevenue: number     // millions Nu.
  netProfit: number         // millions Nu.
  totalAssets: number       // millions Nu.
  ownership: number         // % DHI ownership
  status: 'profitable' | 'breakeven' | 'loss'
  keyMetrics: Record<string, string | number>
  quarterlyRevenue: { quarter: string; revenue: number; profit: number }[]
}

export const dhiCompanies: DHICompany[] = [
  {
    id: 'bt',
    name: 'Bhutan Telecom',
    shortName: 'BT',
    sector: 'Telecom',
    sectorColor: '#00e676',
    description: 'National telecom operator providing mobile, broadband, and enterprise connectivity across Bhutan.',
    established: 2000,
    employees: 892,
    annualRevenue: 6840,
    netProfit: 1120,
    totalAssets: 12800,
    ownership: 100,
    status: 'profitable',
    keyMetrics: { 'Subscribers': '498K', 'Towers': 486, 'Coverage': '97.2%', '5G Towers': 32 },
    quarterlyRevenue: [
      { quarter: 'Q1 2024', revenue: 1549, profit: 248 },
      { quarter: 'Q2 2024', revenue: 1725, profit: 285 },
      { quarter: 'Q3 2024', revenue: 1802, profit: 302 },
      { quarter: 'Q4 2024', revenue: 1764, profit: 285 },
    ],
  },
  {
    id: 'drukair',
    name: 'Drukair Corporation',
    shortName: 'Drukair',
    sector: 'Aviation',
    sectorColor: '#ffab00',
    description: 'Royal Bhutan Airlines â€” the national flag carrier connecting Bhutan to 9 international and domestic destinations.',
    established: 1981,
    employees: 680,
    annualRevenue: 4850,
    netProfit: 385,
    totalAssets: 9200,
    ownership: 100,
    status: 'profitable',
    keyMetrics: { 'Fleet Size': 5, 'Destinations': 9, 'Passengers': '193.6K', 'On-time': '74.5%' },
    quarterlyRevenue: [
      { quarter: 'Q1 2024', revenue: 1025, profit: 72 },
      { quarter: 'Q2 2024', revenue: 1340, profit: 118 },
      { quarter: 'Q3 2024', revenue: 1180, profit: 85 },
      { quarter: 'Q4 2024', revenue: 1305, profit: 110 },
    ],
  },
  {
    id: 'dgpc',
    name: 'Druk Green Power Corporation Ltd.',
    shortName: 'DGPC',
    sector: 'Energy',
    sectorColor: '#00e5ff',
    description: 'Largest power utility managing hydropower plants across Bhutan. Generates and exports clean energy to India.',
    established: 2008,
    employees: 1245,
    annualRevenue: 18420,
    netProfit: 6280,
    totalAssets: 185600,
    ownership: 100,
    status: 'profitable',
    keyMetrics: { 'Installed Capacity': '2,326 MW', 'Plants Operated': 5, 'Energy Exported': '78%', 'Generation (GWh)': 10284 },
    quarterlyRevenue: [
      { quarter: 'Q1 2024', revenue: 3850, profit: 1320 },
      { quarter: 'Q2 2024', revenue: 5240, profit: 1820 },
      { quarter: 'Q3 2024', revenue: 5180, profit: 1780 },
      { quarter: 'Q4 2024', revenue: 4150, profit: 1360 },
    ],
  },
  {
    id: 'bpc',
    name: 'Bhutan Power Corporation Ltd.',
    shortName: 'BPC',
    sector: 'Energy',
    sectorColor: '#00b0ff',
    description: 'Domestic electricity distribution utility ensuring reliable power supply across all 20 dzongkhags.',
    established: 2002,
    employees: 1580,
    annualRevenue: 5620,
    netProfit: 820,
    totalAssets: 28500,
    ownership: 100,
    status: 'profitable',
    keyMetrics: { 'Customers': '198K', 'Electrification': '99.9%', 'T&D Loss': '8.2%', 'Grid Length': '18,200 km' },
    quarterlyRevenue: [
      { quarter: 'Q1 2024', revenue: 1480, profit: 215 },
      { quarter: 'Q2 2024', revenue: 1320, profit: 185 },
      { quarter: 'Q3 2024', revenue: 1350, profit: 195 },
      { quarter: 'Q4 2024', revenue: 1470, profit: 225 },
    ],
  },
  {
    id: 'nrdc',
    name: 'Natural Resources Development Corporation',
    shortName: 'NRDC',
    sector: 'Natural Resources',
    sectorColor: '#26c6da',
    description: 'State enterprise managing and developing natural resources including minerals, forests, and land for sustainable national development.',
    established: 1990,
    employees: 560,
    annualRevenue: 2840,
    netProfit: 310,
    totalAssets: 6400,
    ownership: 100,
    status: 'profitable',
    keyMetrics: { 'Resource Zones': 12, 'Active Sites': 8, 'Export Share': '45%', 'Revenue Growth': '6.2%' },
    quarterlyRevenue: [
      { quarter: 'Q1 2024', revenue: 640, profit: 68 },
      { quarter: 'Q2 2024', revenue: 740, profit: 82 },
      { quarter: 'Q3 2024', revenue: 780, profit: 88 },
      { quarter: 'Q4 2024', revenue: 680, profit: 72 },
    ],
  },
  {
    id: 'smc',
    name: 'State Mining Corporation Ltd',
    shortName: 'SMC',
    sector: 'Mining',
    sectorColor: '#ff1744',
    description: 'Mining entity responsible for coal, gypsum, and dolomite extraction across Bhutan.',
    established: 1975,
    employees: 410,
    annualRevenue: 1850,
    netProfit: 220,
    totalAssets: 3400,
    ownership: 100,
    status: 'profitable',
    keyMetrics: { 'Active Mines': 8, 'Coal (MT)': '85K', 'Gypsum (MT)': '120K', 'Dolomite (MT)': '95K' },
    quarterlyRevenue: [
      { quarter: 'Q1 2024', revenue: 420, profit: 48 },
      { quarter: 'Q2 2024', revenue: 490, profit: 62 },
      { quarter: 'Q3 2024', revenue: 480, profit: 58 },
      { quarter: 'Q4 2024', revenue: 460, profit: 52 },
    ],
  },
  {
    id: 'cdcl',
    name: 'Construction Development Corporation Ltd',
    shortName: 'CDCL',
    sector: 'Construction',
    sectorColor: '#e040fb',
    description: 'Leading construction company executing mega infrastructure projects across Bhutan.',
    established: 1999,
    employees: 1850,
    annualRevenue: 3680,
    netProfit: 245,
    totalAssets: 7200,
    ownership: 51,
    status: 'profitable',
    keyMetrics: { 'Active Projects': 15, 'Completed': 120, 'Equipment': 280, 'Workforce': '1,850' },
    quarterlyRevenue: [
      { quarter: 'Q1 2024', revenue: 820, profit: 48 },
      { quarter: 'Q2 2024', revenue: 985, profit: 72 },
      { quarter: 'Q3 2024', revenue: 960, profit: 65 },
      { quarter: 'Q4 2024', revenue: 915, profit: 60 },
    ],
  },
  {
    id: 'ttp',
    name: 'Thimphu TechPark Ltd',
    shortName: 'TTP',
    sector: 'Technology',
    sectorColor: '#448aff',
    description: 'Bhutan\'s premier technology park providing world-class IT infrastructure, co-working spaces, and enabling the digital economy.',
    established: 2012,
    employees: 180,
    annualRevenue: 980,
    netProfit: 120,
    totalAssets: 3800,
    ownership: 100,
    status: 'profitable',
    keyMetrics: { 'Tenants': 48, 'IT Companies': 32, 'Floor Space': '45K sqft', 'Jobs Created': '1,200+' },
    quarterlyRevenue: [
      { quarter: 'Q1 2024', revenue: 230, profit: 28 },
      { quarter: 'Q2 2024', revenue: 255, profit: 32 },
      { quarter: 'Q3 2024', revenue: 260, profit: 32 },
      { quarter: 'Q4 2024', revenue: 235, profit: 28 },
    ],
  },
  {
    id: 'stcb',
    name: 'State Trading Corporation of Bhutan Ltd',
    shortName: 'STCB',
    sector: 'Trading',
    sectorColor: '#7c4dff',
    description: 'Government trading corporation handling import/export of essential commodities and petroleum products.',
    established: 1972,
    employees: 320,
    annualRevenue: 4520,
    netProfit: 185,
    totalAssets: 2800,
    ownership: 100,
    status: 'profitable',
    keyMetrics: { 'Fuel Depots': 12, 'Imports (MT)': '145K', 'Exports (MT)': '38K', 'Products': 85 },
    quarterlyRevenue: [
      { quarter: 'Q1 2024', revenue: 1080, profit: 42 },
      { quarter: 'Q2 2024', revenue: 1180, profit: 52 },
      { quarter: 'Q3 2024', revenue: 1150, profit: 48 },
      { quarter: 'Q4 2024', revenue: 1110, profit: 43 },
    ],
  },
  {
    id: 'dpl',
    name: 'Dungsam Polymers Limited',
    shortName: 'DPL',
    sector: 'Manufacturing',
    sectorColor: '#ff6d00',
    description: 'Polymer manufacturing company producing PVC pipes, fittings, and packaging materials for construction and industrial use.',
    established: 2005,
    employees: 290,
    annualRevenue: 1240,
    netProfit: 85,
    totalAssets: 2600,
    ownership: 100,
    status: 'profitable',
    keyMetrics: { 'Product Lines': 6, 'Capacity (MT)': '12K', 'Utilization': '72%', 'Export Partners': 4 },
    quarterlyRevenue: [
      { quarter: 'Q1 2024', revenue: 285, profit: 18 },
      { quarter: 'Q2 2024', revenue: 330, profit: 24 },
      { quarter: 'Q3 2024', revenue: 335, profit: 25 },
      { quarter: 'Q4 2024', revenue: 290, profit: 18 },
    ],
  },
  {
    id: 'abhl',
    name: 'Azista Bhutan Healthcare Limited',
    shortName: 'ABHL',
    sector: 'Healthcare',
    sectorColor: '#f06292',
    description: 'Joint venture healthcare company manufacturing pharmaceuticals and medical supplies to support Bhutan\'s healthcare system.',
    established: 2018,
    employees: 145,
    annualRevenue: 620,
    netProfit: 42,
    totalAssets: 1850,
    ownership: 51,
    status: 'profitable',
    keyMetrics: { 'Products': 38, 'Hospitals Served': 28, 'Export Markets': 3, 'GMP Certified': 'Yes' },
    quarterlyRevenue: [
      { quarter: 'Q1 2024', revenue: 142, profit: 8 },
      { quarter: 'Q2 2024', revenue: 165, profit: 12 },
      { quarter: 'Q3 2024', revenue: 168, profit: 12 },
      { quarter: 'Q4 2024', revenue: 145, profit: 10 },
    ],
  },
  {
    id: 'kil',
    name: 'Koufuku International Limited',
    shortName: 'KIL',
    sector: 'Manufacturing',
    sectorColor: '#ffd600',
    description: 'Food processing and manufacturing JV producing packaged foods, beverages, and agricultural products for domestic and regional markets.',
    established: 2015,
    employees: 210,
    annualRevenue: 890,
    netProfit: 55,
    totalAssets: 1600,
    ownership: 60,
    status: 'profitable',
    keyMetrics: { 'Product SKUs': 24, 'Distribution Points': 180, 'Export Share': '18%', 'Capacity Util.': '65%' },
    quarterlyRevenue: [
      { quarter: 'Q1 2024', revenue: 205, profit: 12 },
      { quarter: 'Q2 2024', revenue: 235, profit: 15 },
      { quarter: 'Q3 2024', revenue: 240, profit: 16 },
      { quarter: 'Q4 2024', revenue: 210, profit: 12 },
    ],
  },
  {
    id: 'bbpl',
    name: 'Bhutan Board Products Limited',
    shortName: 'BBPL',
    sector: 'Manufacturing',
    sectorColor: '#ff6d00',
    description: 'Manufacturer of particle board and wood-based panel products for construction and furniture industries.',
    established: 1982,
    employees: 245,
    annualRevenue: 680,
    netProfit: -45,
    totalAssets: 1200,
    ownership: 100,
    status: 'loss',
    keyMetrics: { 'Capacity': '30K mÂ³/yr', 'Production': '18K mÂ³', 'Utilization': '60%', 'Products': 4 },
    quarterlyRevenue: [
      { quarter: 'Q1 2024', revenue: 155, profit: -18 },
      { quarter: 'Q2 2024', revenue: 185, profit: -5 },
      { quarter: 'Q3 2024', revenue: 180, profit: -8 },
      { quarter: 'Q4 2024', revenue: 160, profit: -14 },
    ],
  },
]

// ============ GROUP SUMMARY ============
export const groupSummary = {
  totalCompanies: 13,
  totalEmployees: dhiCompanies.reduce((sum, c) => sum + c.employees, 0),
  totalRevenue: dhiCompanies.reduce((sum, c) => sum + c.annualRevenue, 0),
  totalProfit: dhiCompanies.reduce((sum, c) => sum + c.netProfit, 0),
  totalAssets: dhiCompanies.reduce((sum, c) => sum + c.totalAssets, 0),
  profitableCount: dhiCompanies.filter(c => c.status === 'profitable').length,
  lossCount: dhiCompanies.filter(c => c.status === 'loss').length,
}

// ============ SECTOR BREAKDOWN ============
export const sectorBreakdown = (() => {
  const sectors: Record<string, { revenue: number; profit: number; employees: number; companies: number; color: string }> = {}
  dhiCompanies.forEach(c => {
    if (!sectors[c.sector]) {
      sectors[c.sector] = { revenue: 0, profit: 0, employees: 0, companies: 0, color: c.sectorColor }
    }
    sectors[c.sector].revenue += c.annualRevenue
    sectors[c.sector].profit += c.netProfit
    sectors[c.sector].employees += c.employees
    sectors[c.sector].companies += 1
  })
  return Object.entries(sectors).map(([name, data]) => ({ name, ...data }))
})()

// ============ QUARTERLY GROUP REVENUE ============
export const groupQuarterlyRevenue = ['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024'].map(quarter => {
  const data: Record<string, number> = { quarter } as any
  let totalRevenue = 0
  let totalProfit = 0
  dhiCompanies.forEach(c => {
    const q = c.quarterlyRevenue.find(r => r.quarter === quarter)
    if (q) {
      totalRevenue += q.revenue
      totalProfit += q.profit
    }
  })
  data.revenue = totalRevenue
  data.profit = totalProfit
  return data
})

// ============ TOP PERFORMERS (by revenue) ============
export const topPerformers = [...dhiCompanies]
  .sort((a, b) => b.annualRevenue - a.annualRevenue)
  .slice(0, 5)
