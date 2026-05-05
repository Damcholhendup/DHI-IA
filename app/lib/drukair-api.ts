// DrukAir API client — proxied through Next.js rewrites to avoid CORS
// Direct Tailscale IP: http://100.85.189.71:8000 (server-side only)
// Browser calls go to /api/drukair/* → proxied server-side to the Tailscale IP
const BASE_URL = '/api'

// ── Response types ──────────────────────────────────────────────────────────

export interface ProfitLossItem {
  date: string | null
  category: string | null          // "Income" | "Expenses" | "Tax" | "Other Comprehensive Income" | null
  particulars: string | null
  note: string | null
  amount: number | null            // BTN — negative = expense/tax, positive = income
}

export interface BalanceSheetItem {
  date: string | null
  category: string | null          // "Assets" | "Liabilities"
  subcategory: string | null       // "Equity" for equity items
  particulars: string | null
  note: number | null
  amount: number | null            // BTN
}

export interface CashFlowItem {
  date: string                     // "DD.MM.YYYY"
  category: string                 // "Cash flow from operating activities" | financing | investing | opening/closing
  particulars: string
  amount: number                   // BTN
}

export interface PassengerTrafficItem {
  mnth: string                     // "2025-03-01T00:00:00"
  zone: string
  ftda: string                     // flight date ISO
  orac: string                     // origin airport code
  dstc: string                     // destination airport code
  carr: string                     // carrier ("KB" = Drukair)
  ftnr: string                     // flight number
  imma: string                     // aircraft registration
  fare_type: string                // "AD" | "CH" | "GR"
  cpvf: number
  npax: number                     // number of passengers on this coupon
  dom_int: string                  // "INT" | "DOM"
  fltp: string
  own_oa: string
  gl_post_date: string | null
  gl_status: string | null
  emis_cutp: string                // emission currency
  tpax: string                     // "A" | "C"
  yq: number                       // fuel surcharge
  tmff: number                     // total fare
  cpvf_no_vat: number
  vat_amount: number
  pxnm: string                     // passenger name
}

export interface MasterDataItem {
  flight_type: string              // e.g. "SCH-A319" | "ADD-A319" | "SCH-ATR-42"
  sector: string                   // e.g. "PBH-DEL" | "BKK-CCU-PBH"
  distance: number | null          // km
  mins: number | null              // duration minutes
  block_time: number | null        // hours
  seat_allocation: number | null
  seat_available: number | null
  no_of_flts: number | null
  total_pax: number | null
  ask: number                      // Available Seat Kilometres
  rpk: number                      // Revenue Passenger Kilometres
  bh_month: number                 // block hours per month
  capacity_produced: number
  year: number
}

interface ApiResponse<T> {
  data: T[]
  pagination?: {
    page: number
    limit: number
    total_rows: number
    total_pages: number
  }
}

// ── Core fetch helper ────────────────────────────────────────────────────────

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, { cache: 'no-store' })
  if (!res.ok) throw new Error(`API ${res.status}: ${path}`)
  return res.json() as Promise<T>
}

// ── Public API functions ─────────────────────────────────────────────────────

export async function fetchProfitLoss(): Promise<ProfitLossItem[]> {
  const r = await apiFetch<ApiResponse<ProfitLossItem>>('/drukair/profit_loss')
  return r.data
}

export async function fetchBalanceSheet(): Promise<BalanceSheetItem[]> {
  const r = await apiFetch<ApiResponse<BalanceSheetItem>>('/drukair/balance_sheet')
  return r.data
}

export async function fetchCashFlow(): Promise<CashFlowItem[]> {
  const r = await apiFetch<ApiResponse<CashFlowItem>>('/drukair/cash_flow')
  return r.data
}

export async function fetchPassengerTraffic(
  page = 1,
  limit = 1000
): Promise<{ data: PassengerTrafficItem[]; total: number }> {
  const r = await apiFetch<ApiResponse<PassengerTrafficItem>>(
    `/drukair/passenger_traffic?page=${page}&limit=${limit}`
  )
  return { data: r.data, total: r.pagination?.total_rows ?? 0 }
}

/**
 * Fetches master_data across multiple pages (in parallel after page 1).
 * Default cap: 2000 rows to keep load reasonable.
 */
export async function fetchMasterData(maxRows = 4000, year?: number): Promise<MasterDataItem[]> {
  const limit = 1000
  const yearParam = year ? `&year=${year}` : ''
  const first = await apiFetch<ApiResponse<MasterDataItem>>(
    `/drukair/master_data?page=1&limit=${limit}${yearParam}`
  )
  const rows: MasterDataItem[] = first.data
  const totalPages = first.pagination?.total_pages ?? 1
  const pagesToFetch = Math.min(Math.ceil(maxRows / limit) - 1, totalPages - 1)

  if (pagesToFetch > 0) {
    const rest = await Promise.all(
      Array.from({ length: pagesToFetch }, (_, i) => i + 2).map(p =>
        apiFetch<ApiResponse<MasterDataItem>>(`/drukair/master_data?page=${p}&limit=${limit}${yearParam}`)
      )
    )
    rows.push(...rest.flatMap(r => r.data))
  }
  return rows.slice(0, maxRows)
}

// ── Aggregation helpers (used by dashboard views) ────────────────────────────

/** Parse "DD.MM.YYYY" → Date */
export function parseDMY(s: string): Date {
  const [d, m, y] = s.split('.')
  return new Date(parseInt(y), parseInt(m) - 1, parseInt(d))
}

/** "28.02.2025" → "Feb '25" */
export function fmtPeriod(s: string): string {
  const dt = parseDMY(s)
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  return `${months[dt.getMonth()]} '${String(dt.getFullYear()).slice(2)}`
}

/** Format BTN amount with suffix (B/M/K) */
export function fmtBTN(n: number, dec = 1): string {
  const sign = n < 0 ? '-' : ''
  const abs = Math.abs(n)
  if (abs >= 1e9) return `${sign}Nu.${(abs / 1e9).toFixed(dec)}B`
  if (abs >= 1e6) return `${sign}Nu.${(abs / 1e6).toFixed(dec)}M`
  if (abs >= 1e3) return `${sign}Nu.${(abs / 1e3).toFixed(dec)}K`
  return `${sign}Nu.${abs.toFixed(0)}`
}

/** Aggregate P&L items by date → array of period summaries sorted by date */
export function aggregatePL(items: ProfitLossItem[]) {
  const dates = Array.from(new Set(items.filter(i => i.date).map(i => i.date!)))
    .sort((a, b) => parseDMY(a).getTime() - parseDMY(b).getTime())
  return dates.map(date => {
    const row = items.filter(i => i.date === date)
    const income  = row.filter(i => i.category === 'Income').reduce((s, i) => s + (i.amount ?? 0), 0)
    const expenses = row.filter(i => i.category === 'Expenses').reduce((s, i) => s + (i.amount ?? 0), 0)
    const tax     = row.filter(i => i.category === 'Tax').reduce((s, i) => s + (i.amount ?? 0), 0)
    const oci     = row.filter(i => i.category === 'Other Comprehensive Income').reduce((s, i) => s + (i.amount ?? 0), 0)
    const profit  = income + expenses + tax + oci
    return {
      date,
      label: fmtPeriod(date),
      income,
      expenses: Math.abs(expenses),
      tax: Math.abs(tax),
      oci,
      profit,
    }
  })
}

/** Aggregate Balance Sheet by date → sorted period summaries */
export function aggregateBS(items: BalanceSheetItem[]) {
  const dates = Array.from(new Set(items.filter(i => i.date).map(i => i.date!)))
    .sort((a, b) => parseDMY(a).getTime() - parseDMY(b).getTime())
  return dates.map(date => {
    const row = items.filter(i => i.date === date && i.amount !== null)
    const totalAssets = row
      .filter(i => i.category === 'Assets')
      .reduce((s, i) => s + Math.abs(i.amount ?? 0), 0)
    const totalLiabilities = row
      .filter(i => i.category === 'Liabilities' && !i.subcategory)
      .reduce((s, i) => s + Math.abs(i.amount ?? 0), 0)
    const equity = totalAssets - totalLiabilities
    return { date, label: fmtPeriod(date), totalAssets, totalLiabilities, equity }
  })
}

/** Aggregate Cash Flow by date → sorted period summaries */
export function aggregateCF(items: CashFlowItem[]) {
  const dates = Array.from(new Set(items.map(i => i.date)))
    .sort((a, b) => parseDMY(a).getTime() - parseDMY(b).getTime())
  return dates.map(date => {
    const row = items.filter(i => i.date === date)
    const operating = row
      .filter(i => i.category === 'Cash flow from operating activities')
      .reduce((s, i) => s + i.amount, 0)
    const investing = row
      .filter(i => i.category === 'Cash flow from investing activities')
      .reduce((s, i) => s + i.amount, 0)
    const financing = row
      .filter(i => i.category === 'Cash flow from financing activities')
      .reduce((s, i) => s + i.amount, 0)
    const fx = row
      .filter(i => i.category === 'Effect of changes in foreign exchange rate')
      .reduce((s, i) => s + i.amount, 0)
    const opening = row.find(i => i.category.includes('beginning'))?.amount ?? 0
    const closing  = row.find(i => i.category.includes('end'))?.amount ?? 0
    return { date, label: fmtPeriod(date), operating, investing, financing, fx, net: operating + investing + financing + fx, opening, closing }
  })
}

/** Aggregate master_data by year */
export function aggregateMasterByYear(items: MasterDataItem[]) {
  const map = new Map<number, { pax: number; ask: number; rpk: number; flights: number; bhours: number; sectors: Set<string> }>()
  for (const d of items) {
    const y = d.year
    const prev = map.get(y) ?? { pax: 0, ask: 0, rpk: 0, flights: 0, bhours: 0, sectors: new Set<string>() }
    map.set(y, {
      pax: prev.pax + (d.total_pax ?? 0),
      ask: prev.ask + d.ask,
      rpk: prev.rpk + d.rpk,
      flights: prev.flights + (d.no_of_flts ?? 0),
      bhours: prev.bhours + d.bh_month,
      sectors: new Set(Array.from(prev.sectors).concat(d.sector)),
    })
  }
  return Array.from(map.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([year, v]) => ({
      year,
      pax: Math.round(v.pax),
      ask: Math.round(v.ask),
      rpk: Math.round(v.rpk),
      flights: Math.round(v.flights),
      bhours: Math.round(v.bhours),
      sectors: v.sectors.size,
      loadFactor: v.ask > 0 ? parseFloat((v.rpk / v.ask * 100).toFixed(1)) : 0,
    }))
}

/** Top sectors by total pax */
export function aggregateMasterBySector(items: MasterDataItem[], topN = 12) {
  const map = new Map<string, { pax: number; ask: number; rpk: number; flights: number }>()
  for (const d of items) {
    const s = d.sector
    const prev = map.get(s) ?? { pax: 0, ask: 0, rpk: 0, flights: 0 }
    map.set(s, {
      pax: prev.pax + (d.total_pax ?? 0),
      ask: prev.ask + d.ask,
      rpk: prev.rpk + d.rpk,
      flights: prev.flights + (d.no_of_flts ?? 0),
    })
  }
  return Array.from(map.entries())
    .map(([sector, v]) => ({ sector, ...v, loadFactor: v.ask > 0 ? parseFloat((v.rpk / v.ask * 100).toFixed(1)) : 0 }))
    .sort((a, b) => b.pax - a.pax)
    .slice(0, topN)
}

/** Aggregate passenger_traffic by month */
export function aggregatePaxByMonth(items: PassengerTrafficItem[]) {
  const map = new Map<string, { pax: number; dom: number; intl: number; revenue: number }>()
  for (const d of items) {
    const mKey = d.mnth.slice(0, 7) // "2025-03"
    const prev = map.get(mKey) ?? { pax: 0, dom: 0, intl: 0, revenue: 0 }
    map.set(mKey, {
      pax:     prev.pax + (d.npax || 1),
      dom:     prev.dom + (d.dom_int === 'DOM' ? (d.npax || 1) : 0),
      intl:    prev.intl + (d.dom_int === 'INT' ? (d.npax || 1) : 0),
      revenue: prev.revenue + (d.tmff || 0),
    })
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, v]) => ({ month, label: month, ...v }))
}

/** Aggregate passenger_traffic by route */
export function aggregatePaxByRoute(items: PassengerTrafficItem[], topN = 10) {
  const map = new Map<string, { pax: number; revenue: number; dom_int: string }>()
  for (const d of items) {
    const route = `${d.orac}-${d.dstc}`
    const prev = map.get(route) ?? { pax: 0, revenue: 0, dom_int: d.dom_int }
    map.set(route, {
      pax: prev.pax + (d.npax || 1),
      revenue: prev.revenue + (d.tmff || 0),
      dom_int: d.dom_int,
    })
  }
  return Array.from(map.entries())
    .map(([route, v]) => ({ route, ...v }))
    .sort((a, b) => b.pax - a.pax)
    .slice(0, topN)
}
