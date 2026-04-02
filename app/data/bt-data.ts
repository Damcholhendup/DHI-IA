// Bhutan Telecom (BT) Data - Realistic data based on Bhutan's telecom landscape

// ============ CALL DETAIL RECORDS ============
export interface CDRRecord {
  month: string
  dataGB: number       // Data usage in GB (thousands)
  voiceMinutes: number // Voice minutes (millions)
  smsCount: number     // SMS count (millions)
  prepaidData: number
  postpaidData: number
  prepaidVoice: number
  postpaidVoice: number
  prepaidSMS: number
  postpaidSMS: number
}

export const callDetailRecords: CDRRecord[] = [
  { month: 'Jan 2024', dataGB: 1420, voiceMinutes: 28.5, smsCount: 4.2, prepaidData: 980, postpaidData: 440, prepaidVoice: 19.8, postpaidVoice: 8.7, prepaidSMS: 2.9, postpaidSMS: 1.3 },
  { month: 'Feb 2024', dataGB: 1385, voiceMinutes: 27.1, smsCount: 3.9, prepaidData: 955, postpaidData: 430, prepaidVoice: 18.9, postpaidVoice: 8.2, prepaidSMS: 2.7, postpaidSMS: 1.2 },
  { month: 'Mar 2024', dataGB: 1510, voiceMinutes: 29.3, smsCount: 4.5, prepaidData: 1040, postpaidData: 470, prepaidVoice: 20.4, postpaidVoice: 8.9, prepaidSMS: 3.1, postpaidSMS: 1.4 },
  { month: 'Apr 2024', dataGB: 1580, voiceMinutes: 30.1, smsCount: 4.3, prepaidData: 1090, postpaidData: 490, prepaidVoice: 21.0, postpaidVoice: 9.1, prepaidSMS: 2.9, postpaidSMS: 1.4 },
  { month: 'May 2024', dataGB: 1620, voiceMinutes: 30.8, smsCount: 4.1, prepaidData: 1118, postpaidData: 502, prepaidVoice: 21.5, postpaidVoice: 9.3, prepaidSMS: 2.8, postpaidSMS: 1.3 },
  { month: 'Jun 2024', dataGB: 1695, voiceMinutes: 31.2, smsCount: 4.0, prepaidData: 1170, postpaidData: 525, prepaidVoice: 21.8, postpaidVoice: 9.4, prepaidSMS: 2.7, postpaidSMS: 1.3 },
  { month: 'Jul 2024', dataGB: 1780, voiceMinutes: 32.5, smsCount: 4.4, prepaidData: 1228, postpaidData: 552, prepaidVoice: 22.7, postpaidVoice: 9.8, prepaidSMS: 3.0, postpaidSMS: 1.4 },
  { month: 'Aug 2024', dataGB: 1850, voiceMinutes: 33.1, smsCount: 4.6, prepaidData: 1276, postpaidData: 574, prepaidVoice: 23.1, postpaidVoice: 10.0, prepaidSMS: 3.2, postpaidSMS: 1.4 },
  { month: 'Sep 2024', dataGB: 1920, voiceMinutes: 33.8, smsCount: 4.5, prepaidData: 1324, postpaidData: 596, prepaidVoice: 23.6, postpaidVoice: 10.2, prepaidSMS: 3.1, postpaidSMS: 1.4 },
  { month: 'Oct 2024', dataGB: 1985, voiceMinutes: 34.2, smsCount: 4.3, prepaidData: 1370, postpaidData: 615, prepaidVoice: 23.9, postpaidVoice: 10.3, prepaidSMS: 2.9, postpaidSMS: 1.4 },
  { month: 'Nov 2024', dataGB: 2050, voiceMinutes: 34.8, smsCount: 4.2, prepaidData: 1415, postpaidData: 635, prepaidVoice: 24.3, postpaidVoice: 10.5, prepaidSMS: 2.8, postpaidSMS: 1.4 },
  { month: 'Dec 2024', dataGB: 2180, voiceMinutes: 36.5, smsCount: 4.8, prepaidData: 1504, postpaidData: 676, prepaidVoice: 25.5, postpaidVoice: 11.0, prepaidSMS: 3.3, postpaidSMS: 1.5 },
]

// ============ CUSTOMER COMPLAINTS ============
export interface ComplaintRecord {
  month: string
  networkIssue: number
  billingDispute: number
  serviceQuality: number
  deviceSupport: number
  coverage: number
  other: number
  resolved: number
  pending: number
  avgResolutionDays: number
}

export const customerComplaints: ComplaintRecord[] = [
  { month: 'Jan 2024', networkIssue: 342, billingDispute: 128, serviceQuality: 89, deviceSupport: 67, coverage: 156, other: 45, resolved: 748, pending: 79, avgResolutionDays: 2.3 },
  { month: 'Feb 2024', networkIssue: 298, billingDispute: 115, serviceQuality: 94, deviceSupport: 72, coverage: 143, other: 38, resolved: 691, pending: 69, avgResolutionDays: 2.1 },
  { month: 'Mar 2024', networkIssue: 365, billingDispute: 132, serviceQuality: 101, deviceSupport: 58, coverage: 178, other: 52, resolved: 798, pending: 88, avgResolutionDays: 2.5 },
  { month: 'Apr 2024', networkIssue: 310, billingDispute: 108, serviceQuality: 76, deviceSupport: 63, coverage: 168, other: 41, resolved: 698, pending: 68, avgResolutionDays: 2.2 },
  { month: 'May 2024', networkIssue: 285, billingDispute: 98, serviceQuality: 82, deviceSupport: 55, coverage: 134, other: 36, resolved: 628, pending: 62, avgResolutionDays: 1.9 },
  { month: 'Jun 2024', networkIssue: 420, billingDispute: 142, serviceQuality: 118, deviceSupport: 78, coverage: 210, other: 58, resolved: 912, pending: 114, avgResolutionDays: 3.1 },
  { month: 'Jul 2024', networkIssue: 456, billingDispute: 151, serviceQuality: 125, deviceSupport: 82, coverage: 228, other: 63, resolved: 978, pending: 127, avgResolutionDays: 3.4 },
  { month: 'Aug 2024', networkIssue: 398, billingDispute: 135, serviceQuality: 108, deviceSupport: 71, coverage: 195, other: 49, resolved: 862, pending: 94, avgResolutionDays: 2.8 },
  { month: 'Sep 2024', networkIssue: 325, billingDispute: 119, serviceQuality: 92, deviceSupport: 65, coverage: 162, other: 43, resolved: 738, pending: 68, avgResolutionDays: 2.4 },
  { month: 'Oct 2024', networkIssue: 290, billingDispute: 105, serviceQuality: 78, deviceSupport: 59, coverage: 148, other: 37, resolved: 658, pending: 59, avgResolutionDays: 2.0 },
  { month: 'Nov 2024', networkIssue: 275, billingDispute: 96, serviceQuality: 71, deviceSupport: 52, coverage: 131, other: 34, resolved: 608, pending: 51, avgResolutionDays: 1.8 },
  { month: 'Dec 2024', networkIssue: 358, billingDispute: 138, serviceQuality: 105, deviceSupport: 74, coverage: 185, other: 56, resolved: 832, pending: 84, avgResolutionDays: 2.6 },
]

// ============ CELL TOWER DATA ============
export interface CellTower {
  id: string
  siteName: string
  region: string
  dzongkhag: string
  latitude: number
  longitude: number
  towerType: '2G' | '3G' | '4G' | '5G'
  height: number       // meters
  status: 'active' | 'maintenance' | 'planned'
  subscribers: number
  avgTrafficGB: number
  backhaul: 'Fiber' | 'Microwave' | 'Satellite'
}

export const cellTowers: CellTower[] = [
  { id: 'BT-THP-001', siteName: 'Thimphu Central', region: 'Western', dzongkhag: 'Thimphu', latitude: 27.4728, longitude: 89.6393, towerType: '5G', height: 45, status: 'active', subscribers: 18500, avgTrafficGB: 4200, backhaul: 'Fiber' },
  { id: 'BT-THP-002', siteName: 'Motithang', region: 'Western', dzongkhag: 'Thimphu', latitude: 27.4892, longitude: 89.6281, towerType: '4G', height: 35, status: 'active', subscribers: 12300, avgTrafficGB: 2800, backhaul: 'Fiber' },
  { id: 'BT-THP-003', siteName: 'Changzamtog', region: 'Western', dzongkhag: 'Thimphu', latitude: 27.4615, longitude: 89.6452, towerType: '4G', height: 40, status: 'active', subscribers: 15200, avgTrafficGB: 3500, backhaul: 'Fiber' },
  { id: 'BT-THP-004', siteName: 'Babesa', region: 'Western', dzongkhag: 'Thimphu', latitude: 27.4312, longitude: 89.6518, towerType: '4G', height: 38, status: 'active', subscribers: 9800, avgTrafficGB: 2200, backhaul: 'Fiber' },
  { id: 'BT-THP-005', siteName: 'Lungtenphu', region: 'Western', dzongkhag: 'Thimphu', latitude: 27.4485, longitude: 89.6635, towerType: '4G', height: 42, status: 'active', subscribers: 11400, avgTrafficGB: 2600, backhaul: 'Fiber' },
  { id: 'BT-PAR-001', siteName: 'Paro Town', region: 'Western', dzongkhag: 'Paro', latitude: 27.4287, longitude: 89.4164, towerType: '4G', height: 35, status: 'active', subscribers: 8900, avgTrafficGB: 1950, backhaul: 'Fiber' },
  { id: 'BT-PAR-002', siteName: 'Bondey', region: 'Western', dzongkhag: 'Paro', latitude: 27.3951, longitude: 89.3892, towerType: '3G', height: 30, status: 'active', subscribers: 3200, avgTrafficGB: 680, backhaul: 'Microwave' },
  { id: 'BT-PUN-001', siteName: 'Punakha Dzong', region: 'Western', dzongkhag: 'Punakha', latitude: 27.5911, longitude: 89.8640, towerType: '4G', height: 38, status: 'active', subscribers: 6500, avgTrafficGB: 1420, backhaul: 'Fiber' },
  { id: 'BT-WDP-001', siteName: 'Wangdue Phodrang', region: 'Western', dzongkhag: 'Wangdue Phodrang', latitude: 27.4880, longitude: 89.9010, towerType: '4G', height: 36, status: 'active', subscribers: 7200, avgTrafficGB: 1580, backhaul: 'Fiber' },
  { id: 'BT-HAA-001', siteName: 'Haa Town', region: 'Western', dzongkhag: 'Haa', latitude: 27.3806, longitude: 89.2864, towerType: '3G', height: 32, status: 'maintenance', subscribers: 2800, avgTrafficGB: 520, backhaul: 'Microwave' },
  { id: 'BT-PHU-001', siteName: 'Phuentsholing Central', region: 'Southern', dzongkhag: 'Chhukha', latitude: 26.8626, longitude: 89.3929, towerType: '5G', height: 48, status: 'active', subscribers: 22100, avgTrafficGB: 5100, backhaul: 'Fiber' },
  { id: 'BT-PHU-002', siteName: 'Phuentsholing East', region: 'Southern', dzongkhag: 'Chhukha', latitude: 26.8580, longitude: 89.4105, towerType: '4G', height: 40, status: 'active', subscribers: 14600, avgTrafficGB: 3300, backhaul: 'Fiber' },
  { id: 'BT-GEL-001', siteName: 'Gelephu Town', region: 'Southern', dzongkhag: 'Sarpang', latitude: 26.8620, longitude: 90.4920, towerType: '4G', height: 42, status: 'active', subscribers: 11200, avgTrafficGB: 2450, backhaul: 'Fiber' },
  { id: 'BT-SAM-001', siteName: 'Samtse Town', region: 'Southern', dzongkhag: 'Samtse', latitude: 26.9000, longitude: 89.1000, towerType: '4G', height: 35, status: 'active', subscribers: 7800, avgTrafficGB: 1650, backhaul: 'Fiber' },
  { id: 'BT-SJK-001', siteName: 'Samdrup Jongkhar', region: 'Eastern', dzongkhag: 'Samdrup Jongkhar', latitude: 26.8010, longitude: 91.5140, towerType: '4G', height: 38, status: 'active', subscribers: 9100, avgTrafficGB: 1980, backhaul: 'Fiber' },
  { id: 'BT-MON-001', siteName: 'Mongar Town', region: 'Eastern', dzongkhag: 'Mongar', latitude: 27.2747, longitude: 91.2395, towerType: '4G', height: 36, status: 'active', subscribers: 6800, avgTrafficGB: 1480, backhaul: 'Microwave' },
  { id: 'BT-TRG-001', siteName: 'Trashigang', region: 'Eastern', dzongkhag: 'Trashigang', latitude: 27.3333, longitude: 91.5547, towerType: '4G', height: 34, status: 'active', subscribers: 5400, avgTrafficGB: 1150, backhaul: 'Microwave' },
  { id: 'BT-BMT-001', siteName: 'Bumthang Valley', region: 'Central', dzongkhag: 'Bumthang', latitude: 27.5512, longitude: 90.7389, towerType: '4G', height: 38, status: 'active', subscribers: 4900, avgTrafficGB: 1050, backhaul: 'Fiber' },
  { id: 'BT-TRO-001', siteName: 'Trongsa Town', region: 'Central', dzongkhag: 'Trongsa', latitude: 27.5030, longitude: 90.5090, towerType: '4G', height: 34, status: 'active', subscribers: 3800, avgTrafficGB: 820, backhaul: 'Microwave' },
  { id: 'BT-ZHE-001', siteName: 'Zhemgang', region: 'Central', dzongkhag: 'Zhemgang', latitude: 27.2170, longitude: 90.6580, towerType: '3G', height: 30, status: 'active', subscribers: 2400, avgTrafficGB: 420, backhaul: 'Satellite' },
  { id: 'BT-LHU-001', siteName: 'Lhuntse', region: 'Eastern', dzongkhag: 'Lhuntse', latitude: 27.6670, longitude: 91.1820, towerType: '3G', height: 28, status: 'active', subscribers: 2100, avgTrafficGB: 380, backhaul: 'Satellite' },
  { id: 'BT-PEM-001', siteName: 'Pemagatshel', region: 'Eastern', dzongkhag: 'Pemagatshel', latitude: 27.0380, longitude: 91.4030, towerType: '3G', height: 30, status: 'active', subscribers: 2600, avgTrafficGB: 450, backhaul: 'Microwave' },
  { id: 'BT-TSI-001', siteName: 'Tsirang', region: 'Central', dzongkhag: 'Tsirang', latitude: 27.0220, longitude: 90.1180, towerType: '3G', height: 32, status: 'active', subscribers: 3100, avgTrafficGB: 560, backhaul: 'Microwave' },
  { id: 'BT-DAG-001', siteName: 'Dagana', region: 'Western', dzongkhag: 'Dagana', latitude: 27.0770, longitude: 89.8730, towerType: '3G', height: 30, status: 'active', subscribers: 2900, avgTrafficGB: 490, backhaul: 'Microwave' },
  { id: 'BT-GAS-001', siteName: 'Gasa', region: 'Western', dzongkhag: 'Gasa', latitude: 27.8970, longitude: 89.7260, towerType: '3G', height: 25, status: 'maintenance', subscribers: 850, avgTrafficGB: 120, backhaul: 'Satellite' },
  { id: 'BT-TYG-001', siteName: 'Trashi Yangtse', region: 'Eastern', dzongkhag: 'Trashi Yangtse', latitude: 27.6160, longitude: 91.4970, towerType: '3G', height: 28, status: 'active', subscribers: 1900, avgTrafficGB: 310, backhaul: 'Satellite' },
]

// ============ MONTHLY REVENUE ============
export interface RevenueRecord {
  month: string
  dataRevenue: number    // in millions Nu.
  voiceRevenue: number
  smsRevenue: number
  totalRevenue: number
  broadband: number      // Fixed broadband revenue
  enterprise: number     // Enterprise/corporate services
  roaming: number
}

export const monthlyRevenue: RevenueRecord[] = [
  { month: 'Jan 2024', dataRevenue: 285.4, voiceRevenue: 142.8, smsRevenue: 18.5, totalRevenue: 512.3, broadband: 38.2, enterprise: 24.8, roaming: 2.6 },
  { month: 'Feb 2024', dataRevenue: 278.1, voiceRevenue: 138.5, smsRevenue: 17.2, totalRevenue: 497.6, broadband: 37.8, enterprise: 23.5, roaming: 2.5 },
  { month: 'Mar 2024', dataRevenue: 302.5, voiceRevenue: 148.6, smsRevenue: 19.8, totalRevenue: 539.2, broadband: 39.1, enterprise: 26.2, roaming: 3.0 },
  { month: 'Apr 2024', dataRevenue: 318.2, voiceRevenue: 152.3, smsRevenue: 18.9, totalRevenue: 558.8, broadband: 40.5, enterprise: 25.8, roaming: 3.1 },
  { month: 'May 2024', dataRevenue: 326.8, voiceRevenue: 155.1, smsRevenue: 18.0, totalRevenue: 568.5, broadband: 41.2, enterprise: 24.6, roaming: 2.8 },
  { month: 'Jun 2024', dataRevenue: 342.5, voiceRevenue: 158.4, smsRevenue: 17.6, totalRevenue: 589.1, broadband: 42.8, enterprise: 25.1, roaming: 2.7 },
  { month: 'Jul 2024', dataRevenue: 358.1, voiceRevenue: 163.2, smsRevenue: 19.3, totalRevenue: 614.8, broadband: 43.5, enterprise: 27.5, roaming: 3.2 },
  { month: 'Aug 2024', dataRevenue: 372.4, voiceRevenue: 167.8, smsRevenue: 20.1, totalRevenue: 636.5, broadband: 44.2, enterprise: 28.8, roaming: 3.2 },
  { month: 'Sep 2024', dataRevenue: 385.6, voiceRevenue: 171.2, smsRevenue: 19.8, totalRevenue: 653.2, broadband: 45.1, enterprise: 28.2, roaming: 3.3 },
  { month: 'Oct 2024', dataRevenue: 398.2, voiceRevenue: 174.5, smsRevenue: 18.9, totalRevenue: 668.8, broadband: 46.3, enterprise: 27.6, roaming: 3.3 },
  { month: 'Nov 2024', dataRevenue: 412.8, voiceRevenue: 178.3, smsRevenue: 18.5, totalRevenue: 688.4, broadband: 47.8, enterprise: 28.1, roaming: 2.9 },
  { month: 'Dec 2024', dataRevenue: 438.5, voiceRevenue: 185.6, smsRevenue: 21.2, totalRevenue: 728.1, broadband: 49.2, enterprise: 30.1, roaming: 3.5 },
]

// ============ PREPAID TARIFF ============
export interface TariffPlan {
  name: string
  type: 'prepaid' | 'postpaid'
  dataAllowance: string
  voiceMinutes: string
  smsCount: string
  validity: string
  price: number          // Nu.
  subscribers: number
  popularity: number     // percentage
}

export const prepaidTariffs: TariffPlan[] = [
  { name: 'BT Daily Pack', type: 'prepaid', dataAllowance: '200 MB', voiceMinutes: '30 min', smsCount: '20', validity: '1 day', price: 29, subscribers: 45200, popularity: 18.2 },
  { name: 'BT Weekly Basic', type: 'prepaid', dataAllowance: '1 GB', voiceMinutes: '100 min', smsCount: '50', validity: '7 days', price: 99, subscribers: 62400, popularity: 25.1 },
  { name: 'BT Weekly Plus', type: 'prepaid', dataAllowance: '3 GB', voiceMinutes: '200 min', smsCount: '100', validity: '7 days', price: 199, subscribers: 38900, popularity: 15.7 },
  { name: 'BT Monthly Lite', type: 'prepaid', dataAllowance: '5 GB', voiceMinutes: '300 min', smsCount: '150', validity: '30 days', price: 349, subscribers: 52100, popularity: 21.0 },
  { name: 'BT Monthly Standard', type: 'prepaid', dataAllowance: '15 GB', voiceMinutes: '500 min', smsCount: '200', validity: '30 days', price: 599, subscribers: 31800, popularity: 12.8 },
  { name: 'BT Monthly Premium', type: 'prepaid', dataAllowance: '30 GB', voiceMinutes: 'Unlimited', smsCount: '500', validity: '30 days', price: 999, subscribers: 12200, popularity: 4.9 },
  { name: 'BT Data Only', type: 'prepaid', dataAllowance: '10 GB', voiceMinutes: '-', smsCount: '-', validity: '30 days', price: 449, subscribers: 5700, popularity: 2.3 },
]

// ============ POSTPAID TARIFF ============
export const postpaidTariffs: TariffPlan[] = [
  { name: 'BT Postpaid Basic', type: 'postpaid', dataAllowance: '10 GB', voiceMinutes: '500 min', smsCount: '200', validity: 'Monthly', price: 499, subscribers: 18500, popularity: 22.5 },
  { name: 'BT Postpaid Standard', type: 'postpaid', dataAllowance: '25 GB', voiceMinutes: '1000 min', smsCount: '500', validity: 'Monthly', price: 799, subscribers: 28200, popularity: 34.3 },
  { name: 'BT Postpaid Premium', type: 'postpaid', dataAllowance: '50 GB', voiceMinutes: 'Unlimited', smsCount: 'Unlimited', validity: 'Monthly', price: 1299, subscribers: 15800, popularity: 19.2 },
  { name: 'BT Postpaid Executive', type: 'postpaid', dataAllowance: '100 GB', voiceMinutes: 'Unlimited', smsCount: 'Unlimited', validity: 'Monthly', price: 1999, subscribers: 8900, popularity: 10.8 },
  { name: 'BT Enterprise', type: 'postpaid', dataAllowance: '200 GB', voiceMinutes: 'Unlimited', smsCount: 'Unlimited', validity: 'Monthly', price: 3499, subscribers: 5200, popularity: 6.3 },
  { name: 'BT Corporate Pool', type: 'postpaid', dataAllowance: '500 GB', voiceMinutes: 'Unlimited', smsCount: 'Unlimited', validity: 'Monthly', price: 7999, subscribers: 5600, popularity: 6.8 },
]

// ============ SUBSCRIBER SUMMARY ============
export const subscriberSummary = {
  totalSubscribers: 498200,
  prepaidSubscribers: 378600,
  postpaidSubscribers: 82200,
  broadbandSubscribers: 37400,
  activeSubscribers: 462100,
  networkCoverage: 97.2,     // % of population
  geographicCoverage: 78.5,  // % of land area
  totalTowers: 486,
  towers4G: 312,
  towers3G: 142,
  towers5G: 32,
}
