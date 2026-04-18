const BASE_URL = '/api'

// ─── Types ────────────────────────────────────────────────────────────────────
export type BTRevenueVoice = { month: string; revenue: number; usage_duration_minutes: number }
export type BTRevenueData  = { month: string; revenue: number; internet_data_gb: number }
export type BTRevenueSMS   = { month: string; revenue: number; usage: number }

export type BTCellTowerKPI = {
  parameters: string; technology: string; benchmark: string; year: number
  january: number | null; february: number | null; march: number | null
  april: number | null; may: number | null; june: number | null
  july: number | null; august: number | null; september: number | null
  october: number | null; november: number | null; december: number | null
}

export type BTComplaint = {
  ticket_id: string; caller_id: string; dzongkhag: string
  complaint_type: string; service: string; status: string
  assigned_to: string | null; shift: string; mode_type: string; year: number
}

export type BTCellTowerDetail = {
  regions: string; site_name_: string; site_id: string
  lte_1800: string | null; lte_700_: string | null; lte_850: string | null
  tdd_2300: string | null; lte_900: string | null
  network_2g: string | null; network_3g: string | null
  network_5g: string | null; nokia: string | null
  latitude: number | null; longitude: number | null
}

export type BTDataTraffic = {
  regions: string; year: number
  january: number | null; february: number | null; march: number | null
  april: number | null; may: number | null; june: number | null
  july: number | null; august: number | null; september: number | null
  october: number | null; november: number | null; december: number | null
}

export type BTVoiceTraffic = {
  year: number; month: string
  voice_3g: number; voice_2g: number; volte: number; total_voice: number
}

export type BTCDRVoice = {
  s_p_number_address: string; o_p_number_address: string
  starttime: string; receiveddate: string
  rated_flat_amount: number; tariff_info_sncode: number; rated_volume: number
}

export type BTCDRData = { request_date: string; msisdn: string; apn: string; total_usage_mb: number }

export type BTPostpaidTariff = { plans: string; price: number | null; data_quota_mb: number | null; validity: string | null }
export type BTPrepaidTariff  = { data_pack: string; rate: string; quota_mb: string; validity_days: string }

// ─── Internal helper ──────────────────────────────────────────────────────────
async function btGet<T>(endpoint: string, params: Record<string, string | number> = {}): Promise<T[]> {
  const qs = new URLSearchParams(Object.entries(params).map(([k, v]) => [k, String(v)])).toString()
  const res = await fetch(`${BASE_URL}/bhutan_telecom/${endpoint}${qs ? '?' + qs : ''}`)
  if (!res.ok) throw new Error(`BT API ${res.status}: ${endpoint}`)
  const json = await res.json()
  return json.data ?? json
}

// ─── Fetch functions ──────────────────────────────────────────────────────────
export const fetchBTRevenueVoice   = (limit = 500)  => btGet<BTRevenueVoice>('monthly_revenue_voice', { limit })
export const fetchBTRevenueData    = (limit = 500)  => btGet<BTRevenueData>('monthly_revenue_data', { limit })
export const fetchBTRevenueSMS     = (limit = 500)  => btGet<BTRevenueSMS>('monthly_revenue_sms', { limit })
export const fetchBTCellTowerKPI   = (limit = 500)  => btGet<BTCellTowerKPI>('cell_tower_kpi', { limit })
export const fetchBTComplaints     = (limit = 5000) => btGet<BTComplaint>('customer_complaints', { limit })
export const fetchBTTowerDetails   = (limit = 5000) => btGet<BTCellTowerDetail>('cell_tower_details', { limit })
export const fetchBTDataTraffic    = (limit = 500)  => btGet<BTDataTraffic>('cell_tower_data_traffic_summary', { limit })
export const fetchBTVoiceTraffic   = (limit = 1000) => btGet<BTVoiceTraffic>('cell_tower_voice_traffic', { limit })
export const fetchBTCDRVoice       = (limit = 3000) => btGet<BTCDRVoice>('cdr_postpaid_voice', { limit })
export const fetchBTCDRData        = (limit = 3000) => btGet<BTCDRData>('cdr_prepaid_data', { limit })
export const fetchBTPostpaidTariff = (limit = 500)  => btGet<BTPostpaidTariff>('postpaid_tariff_monthly', { limit })
export const fetchBTPrepaidTariff  = (limit = 500)  => btGet<BTPrepaidTariff>('prepaid_tariff_data_plan', { limit })

// ─── Utilities ────────────────────────────────────────────────────────────────
export function fmtBTN(n: number): string {
  if (n >= 1e9) return `Nu. ${(n / 1e9).toFixed(2)}B`
  if (n >= 1e6) return `Nu. ${(n / 1e6).toFixed(1)}M`
  if (n >= 1e3) return `Nu. ${(n / 1e3).toFixed(0)}K`
  return `Nu. ${n.toFixed(0)}`
}

export function fmtISOMonth(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
}

export const KPI_MONTHS = ['january','february','march','april','may','june','july','august','september','october','november','december'] as const
export const KPI_LABELS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

// ─── Aggregators ──────────────────────────────────────────────────────────────
export type CombinedRevenue = {
  month: string; iso: string
  voice: number; data: number; sms: number; total: number
  voiceMin: number; dataGB: number; smsUsage: number
}

export function combinedRevenue(
  voice: BTRevenueVoice[],
  data: BTRevenueData[],
  sms: BTRevenueSMS[]
): CombinedRevenue[] {
  const map = new Map<string, CombinedRevenue>()
  const ensure = (iso: string) => {
    if (!map.has(iso)) map.set(iso, { month: fmtISOMonth(iso), iso, voice: 0, data: 0, sms: 0, total: 0, voiceMin: 0, dataGB: 0, smsUsage: 0 })
    return map.get(iso)!
  }
  voice.forEach(r => { const e = ensure(r.month); e.voice = r.revenue; e.voiceMin = r.usage_duration_minutes })
  data.forEach(r  => { const e = ensure(r.month); e.data  = r.revenue; e.dataGB   = r.internet_data_gb })
  sms.forEach(r   => { const e = ensure(r.month); e.sms   = r.revenue; e.smsUsage = r.usage })
  const out = [...map.values()]
  out.forEach(r => { r.total = r.voice + r.data + r.sms })
  return out.sort((a, b) => a.iso.localeCompare(b.iso))
}

export function groupBy<T>(items: T[], key: keyof T, topN?: number): { name: string; value: number }[] {
  const map = new Map<string, number>()
  items.forEach(i => { const k = String(i[key] ?? 'Unknown'); map.set(k, (map.get(k) ?? 0) + 1) })
  const arr = [...map.entries()].map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value)
  return topN ? arr.slice(0, topN) : arr
}

export type CDRVoiceMonth = { month: string; calls: number; duration_min: number; revenue: number }
export function aggregateCDRVoice(records: BTCDRVoice[]): CDRVoiceMonth[] {
  const map = new Map<string, CDRVoiceMonth>()
  records.forEach(r => {
    const ym = (r.starttime ?? '').slice(0, 7); if (!ym) return
    const e = map.get(ym) ?? (() => { const n = { month: ym, calls: 0, duration_min: 0, revenue: 0 }; map.set(ym, n); return n })()
    e.calls++; e.duration_min += r.rated_volume / 60; e.revenue += r.rated_flat_amount
  })
  return [...map.values()].sort((a, b) => a.month.localeCompare(b.month))
}

export type CDRDataMonth = { month: string; requests: number; usage_gb: number }
export function aggregateCDRData(records: BTCDRData[]): CDRDataMonth[] {
  const map = new Map<string, CDRDataMonth>()
  records.forEach(r => {
    const ym = (r.request_date ?? '').slice(0, 7); if (!ym) return
    const e = map.get(ym) ?? (() => { const n = { month: ym, requests: 0, usage_gb: 0 }; map.set(ym, n); return n })()
    e.requests++; e.usage_gb += r.total_usage_mb / 1024
  })
  return [...map.values()].sort((a, b) => a.month.localeCompare(b.month))
}

export type TowerRegion = { region: string; count: number; lte4g: number; has2g: number; has3g: number; has5g: number }
export function towersByRegion(towers: BTCellTowerDetail[]): TowerRegion[] {
  const map = new Map<string, TowerRegion>()
  towers.forEach(t => {
    const r = t.regions || 'Unknown'
    const e = map.get(r) ?? (() => { const n = { region: r, count: 0, lte4g: 0, has2g: 0, has3g: 0, has5g: 0 }; map.set(r, n); return n })()
    e.count++
    if (t.lte_1800 || t.lte_700_ || t.lte_850 || t.lte_900 || t.tdd_2300) e.lte4g++
    if (t.network_2g) e.has2g++
    if (t.network_3g) e.has3g++
    if (t.network_5g) e.has5g++
  })
  return [...map.values()].sort((a, b) => b.count - a.count)
}

// ─── New types (9 additional endpoints) ──────────────────────────────────────

/** CDR postpaid data sessions (same wire shape as BTCDRVoice) */
export type BTCDRPostpaidData = {
  s_p_number_address: string; o_p_number_address: string
  starttime: string; receiveddate: string
  rated_flat_amount: number; tariff_info_sncode: number; rated_volume: number
}

/** CDR postpaid SMS (same wire shape as BTCDRVoice; rated_volume = sms count) */
export type BTCDRPostpaidSMS = {
  s_p_number_address: string; o_p_number_address: string
  starttime: string; receiveddate: string
  rated_flat_amount: number; tariff_info_sncode: number; rated_volume: number
}

/** Detailed cell tower data traffic — LTE / 3G / 5G split per month */
export type BTCellDataTraffic = {
  year: number; months: string
  lte: number; data_3g: number; data_5g: number; total_data: number
}

/** Core-area KPI report — PS drop/success rate + throughput */
export type BTKPIReport = {
  location_of_core_areas: string
  ps_drop_rate: number; ps_success_rate: number; dl_user_throughput_mbps: number
}

export type BTPostpaidBooster     = { plans: number; price: number; data_quota_mb: number; validity: string }
export type BTPostpaidSMSTariff   = { call_type: string; standard_4am_12_midnight: string; midnight_12_midnight_4am: string }
export type BTPostpaidVoiceTariff = {
  call_type_1_unit_15_sec: string
  off_peak_hour_6am_3pm: string; peak_hour_3pm_10pm: string
  economy_hour_4am_6am: string; late_night_12am_4am: string
}
export type BTPrepaidAirFibre  = {
  package_name: string; rate_nu: number; bw_mbps: string
  data_volume_gb: number; cost_gb: number; fair_usage: string; validity: string
}
export type BTPrepaidVoiceSMS  = { call_type: string; timing: string; tariff_nu: number }

// ─── New fetch functions ──────────────────────────────────────────────────────
export const fetchBTCDRPostpaidData  = (limit = 5000) => btGet<BTCDRPostpaidData>('cdr_postpaid_data', { limit })
export const fetchBTCDRPostpaidSMS   = (limit = 5000) => btGet<BTCDRPostpaidSMS>('cdr_postpaid_sms', { limit })
export const fetchBTCellDataTraffic  = (limit = 500)  => btGet<BTCellDataTraffic>('cell_tower_data_traffic', { limit })
export const fetchBTKPIReport        = (limit = 500)  => btGet<BTKPIReport>('cell_tower_kpi_report', { limit })
export const fetchBTPostpaidBooster  = (limit = 100)  => btGet<BTPostpaidBooster>('postpaid_tariff_booster', { limit })
export const fetchBTPostpaidSMSTariff   = (limit = 100) => btGet<BTPostpaidSMSTariff>('postpaid_tariff_sms', { limit })
export const fetchBTPostpaidVoiceTariff = (limit = 100) => btGet<BTPostpaidVoiceTariff>('postpaid_tariff_voice', { limit })
export const fetchBTPrepaidAirFibre  = (limit = 100)  => btGet<BTPrepaidAirFibre>('prepaid_tariff_air_fibre', { limit })
export const fetchBTPrepaidVoiceSMS  = (limit = 100)  => btGet<BTPrepaidVoiceSMS>('prepaid_tariff_voice_sms', { limit })

// ─── New aggregators ──────────────────────────────────────────────────────────

/** Monthly postpaid DATA session CDR aggregation */
export type CDRPostpaidDataMonth = { month: string; sessions: number; volume_mb: number; revenue: number }
export function aggregateCDRPostpaidData(records: BTCDRPostpaidData[]): CDRPostpaidDataMonth[] {
  const map = new Map<string, CDRPostpaidDataMonth>()
  records.forEach(r => {
    const ym = (r.starttime ?? '').slice(0, 7); if (!ym) return
    const e = map.get(ym) ?? (() => { const n = { month: ym, sessions: 0, volume_mb: 0, revenue: 0 }; map.set(ym, n); return n })()
    e.sessions++; e.volume_mb += r.rated_volume / 1024; e.revenue += r.rated_flat_amount
  })
  return [...map.values()].sort((a, b) => a.month.localeCompare(b.month))
}

/** Monthly postpaid SMS CDR aggregation */
export type CDRSMSMonth = { month: string; sms_count: number; revenue: number }
export function aggregateCDRSMS(records: BTCDRPostpaidSMS[]): CDRSMSMonth[] {
  const map = new Map<string, CDRSMSMonth>()
  records.forEach(r => {
    const ym = (r.starttime ?? '').slice(0, 7); if (!ym) return
    const e = map.get(ym) ?? (() => { const n = { month: ym, sms_count: 0, revenue: 0 }; map.set(ym, n); return n })()
    e.sms_count += r.rated_volume; e.revenue += r.rated_flat_amount
  })
  return [...map.values()].sort((a, b) => a.month.localeCompare(b.month))
}

/** Sort cell_tower_data_traffic into chronological order */
const MONTH_ORDER: Record<string, number> = {
  january:1, february:2, march:3, april:4, may:5, june:6,
  july:7, august:8, september:9, october:10, november:11, december:12,
}
export function sortCellDataTraffic(rows: BTCellDataTraffic[]): BTCellDataTraffic[] {
  return [...rows].sort((a, b) =>
    a.year !== b.year ? a.year - b.year
    : (MONTH_ORDER[a.months.toLowerCase()] ?? 13) - (MONTH_ORDER[b.months.toLowerCase()] ?? 13)
  )
}
