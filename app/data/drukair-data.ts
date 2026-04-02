// Druk Air (Royal Bhutan Airlines) Data - Realistic data based on Bhutan's aviation

// ============ FLIGHT OPERATIONS ============
export interface FlightOpsRecord {
  month: string
  scheduledFlights: number
  completedFlights: number
  cancelledFlights: number
  delayedFlights: number
  onTimePercentage: number
  avgDelayMinutes: number
  domesticFlights: number
  internationalFlights: number
}

export const flightOpsData: FlightOpsRecord[] = [
  { month: 'Jan 2024', scheduledFlights: 186, completedFlights: 172, cancelledFlights: 14, delayedFlights: 38, onTimePercentage: 72.1, avgDelayMinutes: 42, domesticFlights: 48, internationalFlights: 124 },
  { month: 'Feb 2024', scheduledFlights: 174, completedFlights: 165, cancelledFlights: 9, delayedFlights: 32, onTimePercentage: 76.4, avgDelayMinutes: 35, domesticFlights: 44, internationalFlights: 121 },
  { month: 'Mar 2024', scheduledFlights: 210, completedFlights: 198, cancelledFlights: 12, delayedFlights: 41, onTimePercentage: 74.7, avgDelayMinutes: 38, domesticFlights: 56, internationalFlights: 142 },
  { month: 'Apr 2024', scheduledFlights: 228, completedFlights: 218, cancelledFlights: 10, delayedFlights: 35, onTimePercentage: 78.4, avgDelayMinutes: 31, domesticFlights: 62, internationalFlights: 156 },
  { month: 'May 2024', scheduledFlights: 234, completedFlights: 222, cancelledFlights: 12, delayedFlights: 42, onTimePercentage: 73.9, avgDelayMinutes: 40, domesticFlights: 64, internationalFlights: 158 },
  { month: 'Jun 2024', scheduledFlights: 198, completedFlights: 182, cancelledFlights: 16, delayedFlights: 52, onTimePercentage: 65.9, avgDelayMinutes: 55, domesticFlights: 52, internationalFlights: 130 },
  { month: 'Jul 2024', scheduledFlights: 192, completedFlights: 175, cancelledFlights: 17, delayedFlights: 48, onTimePercentage: 66.3, avgDelayMinutes: 51, domesticFlights: 48, internationalFlights: 127 },
  { month: 'Aug 2024', scheduledFlights: 204, completedFlights: 189, cancelledFlights: 15, delayedFlights: 45, onTimePercentage: 68.8, avgDelayMinutes: 47, domesticFlights: 54, internationalFlights: 135 },
  { month: 'Sep 2024', scheduledFlights: 222, completedFlights: 212, cancelledFlights: 10, delayedFlights: 36, onTimePercentage: 77.4, avgDelayMinutes: 33, domesticFlights: 60, internationalFlights: 152 },
  { month: 'Oct 2024', scheduledFlights: 240, completedFlights: 232, cancelledFlights: 8, delayedFlights: 30, onTimePercentage: 82.8, avgDelayMinutes: 28, domesticFlights: 66, internationalFlights: 166 },
  { month: 'Nov 2024', scheduledFlights: 232, completedFlights: 224, cancelledFlights: 8, delayedFlights: 28, onTimePercentage: 83.9, avgDelayMinutes: 26, domesticFlights: 64, internationalFlights: 160 },
  { month: 'Dec 2024', scheduledFlights: 248, completedFlights: 236, cancelledFlights: 12, delayedFlights: 38, onTimePercentage: 79.7, avgDelayMinutes: 34, domesticFlights: 68, internationalFlights: 168 },
]

// ============ PASSENGER TRAFFIC ============
export interface PassengerRecord {
  month: string
  totalPassengers: number
  inbound: number
  outbound: number
  transit: number
  tourists: number
  nationals: number
  diplomats: number
  businessClass: number
  economyClass: number
}

export const passengerTrafficData: PassengerRecord[] = [
  { month: 'Jan 2024', totalPassengers: 12850, inbound: 6420, outbound: 6180, transit: 250, tourists: 4850, nationals: 7200, diplomats: 180, businessClass: 1540, economyClass: 11310 },
  { month: 'Feb 2024', totalPassengers: 11920, inbound: 5980, outbound: 5690, transit: 250, tourists: 4320, nationals: 6900, diplomats: 165, businessClass: 1430, economyClass: 10490 },
  { month: 'Mar 2024', totalPassengers: 15680, inbound: 7890, outbound: 7480, transit: 310, tourists: 6820, nationals: 8100, diplomats: 210, businessClass: 1880, economyClass: 13800 },
  { month: 'Apr 2024', totalPassengers: 18450, inbound: 9380, outbound: 8720, transit: 350, tourists: 9150, nationals: 8400, diplomats: 240, businessClass: 2210, economyClass: 16240 },
  { month: 'May 2024', totalPassengers: 17820, inbound: 8950, outbound: 8520, transit: 350, tourists: 8650, nationals: 8320, diplomats: 225, businessClass: 2140, economyClass: 15680 },
  { month: 'Jun 2024', totalPassengers: 13950, inbound: 6980, outbound: 6720, transit: 250, tourists: 5280, nationals: 7850, diplomats: 195, businessClass: 1670, economyClass: 12280 },
  { month: 'Jul 2024', totalPassengers: 13200, inbound: 6620, outbound: 6330, transit: 250, tourists: 4920, nationals: 7480, diplomats: 180, businessClass: 1580, economyClass: 11620 },
  { month: 'Aug 2024', totalPassengers: 14580, inbound: 7310, outbound: 6980, transit: 290, tourists: 5580, nationals: 8150, diplomats: 200, businessClass: 1750, economyClass: 12830 },
  { month: 'Sep 2024', totalPassengers: 17250, inbound: 8680, outbound: 8220, transit: 350, tourists: 8120, nationals: 8280, diplomats: 230, businessClass: 2070, economyClass: 15180 },
  { month: 'Oct 2024', totalPassengers: 21350, inbound: 10820, outbound: 10180, transit: 350, tourists: 11450, nationals: 8950, diplomats: 280, businessClass: 2560, economyClass: 18790 },
  { month: 'Nov 2024', totalPassengers: 19680, inbound: 9920, outbound: 9410, transit: 350, tourists: 10280, nationals: 8520, diplomats: 260, businessClass: 2360, economyClass: 17320 },
  { month: 'Dec 2024', totalPassengers: 16920, inbound: 8520, outbound: 8050, transit: 350, tourists: 7450, nationals: 8620, diplomats: 225, businessClass: 2030, economyClass: 14890 },
]

// ============ PASSENGER LOAD FACTOR ============
export interface LoadFactorRecord {
  month: string
  avgLoadFactor: number     // percentage
  businessLoadFactor: number
  economyLoadFactor: number
  peakLoadFactor: number
  offPeakLoadFactor: number
  seatsAvailable: number
  seatsSold: number
  revenuePerSeat: number    // Nu.
}

export const loadFactorData: LoadFactorRecord[] = [
  { month: 'Jan 2024', avgLoadFactor: 68.5, businessLoadFactor: 52.3, economyLoadFactor: 71.8, peakLoadFactor: 82.1, offPeakLoadFactor: 54.9, seatsAvailable: 18760, seatsSold: 12850, revenuePerSeat: 28500 },
  { month: 'Feb 2024', avgLoadFactor: 65.2, businessLoadFactor: 48.5, economyLoadFactor: 68.6, peakLoadFactor: 78.4, offPeakLoadFactor: 51.8, seatsAvailable: 18200, seatsSold: 11920, revenuePerSeat: 27200 },
  { month: 'Mar 2024', avgLoadFactor: 78.4, businessLoadFactor: 62.1, economyLoadFactor: 81.2, peakLoadFactor: 91.5, offPeakLoadFactor: 65.8, seatsAvailable: 20020, seatsSold: 15680, revenuePerSeat: 31500 },
  { month: 'Apr 2024', avgLoadFactor: 85.2, businessLoadFactor: 71.8, economyLoadFactor: 87.5, peakLoadFactor: 96.2, offPeakLoadFactor: 74.1, seatsAvailable: 21660, seatsSold: 18450, revenuePerSeat: 34800 },
  { month: 'May 2024', avgLoadFactor: 82.8, businessLoadFactor: 68.5, economyLoadFactor: 85.4, peakLoadFactor: 94.1, offPeakLoadFactor: 71.5, seatsAvailable: 21520, seatsSold: 17820, revenuePerSeat: 33200 },
  { month: 'Jun 2024', avgLoadFactor: 71.2, businessLoadFactor: 55.8, economyLoadFactor: 74.5, peakLoadFactor: 84.2, offPeakLoadFactor: 58.1, seatsAvailable: 19580, seatsSold: 13950, revenuePerSeat: 29100 },
  { month: 'Jul 2024', avgLoadFactor: 69.8, businessLoadFactor: 53.2, economyLoadFactor: 73.1, peakLoadFactor: 82.5, offPeakLoadFactor: 57.1, seatsAvailable: 18920, seatsSold: 13200, revenuePerSeat: 28400 },
  { month: 'Aug 2024', avgLoadFactor: 73.5, businessLoadFactor: 58.4, economyLoadFactor: 76.8, peakLoadFactor: 86.2, offPeakLoadFactor: 60.8, seatsAvailable: 19820, seatsSold: 14580, revenuePerSeat: 30200 },
  { month: 'Sep 2024', avgLoadFactor: 81.5, businessLoadFactor: 67.2, economyLoadFactor: 84.2, peakLoadFactor: 93.8, offPeakLoadFactor: 69.1, seatsAvailable: 21180, seatsSold: 17250, revenuePerSeat: 32800 },
  { month: 'Oct 2024', avgLoadFactor: 89.8, businessLoadFactor: 78.5, economyLoadFactor: 92.1, peakLoadFactor: 98.2, offPeakLoadFactor: 81.5, seatsAvailable: 23780, seatsSold: 21350, revenuePerSeat: 36500 },
  { month: 'Nov 2024', avgLoadFactor: 86.5, businessLoadFactor: 74.2, economyLoadFactor: 89.1, peakLoadFactor: 95.8, offPeakLoadFactor: 77.1, seatsAvailable: 22740, seatsSold: 19680, revenuePerSeat: 35200 },
  { month: 'Dec 2024', avgLoadFactor: 79.2, businessLoadFactor: 64.8, economyLoadFactor: 82.5, peakLoadFactor: 91.2, offPeakLoadFactor: 67.2, seatsAvailable: 21360, seatsSold: 16920, revenuePerSeat: 32100 },
]

// ============ CAPACITY & EFFICIENCY ============
export interface CapacityRecord {
  aircraft: string
  type: string
  registration: string
  totalSeats: number
  businessSeats: number
  economySeats: number
  range: string
  avgUtilization: number  // hours per day
  status: 'active' | 'maintenance' | 'reserved'
  ageYears: number
  fuelEfficiency: number  // liters per seat per 100km
}

export const fleetData: CapacityRecord[] = [
  { aircraft: 'Airbus A319', type: 'Narrow-body', registration: 'A5-JSW', totalSeats: 118, businessSeats: 8, economySeats: 110, range: '6,950 km', avgUtilization: 8.2, status: 'active', ageYears: 12, fuelEfficiency: 3.8 },
  { aircraft: 'Airbus A319', type: 'Narrow-body', registration: 'A5-RGF', totalSeats: 118, businessSeats: 8, economySeats: 110, range: '6,950 km', avgUtilization: 7.8, status: 'active', ageYears: 10, fuelEfficiency: 3.7 },
  { aircraft: 'Airbus A320neo', type: 'Narrow-body', registration: 'A5-JKW', totalSeats: 140, businessSeats: 8, economySeats: 132, range: '6,300 km', avgUtilization: 9.5, status: 'active', ageYears: 3, fuelEfficiency: 2.9 },
  { aircraft: 'Airbus A320neo', type: 'Narrow-body', registration: 'A5-DKR', totalSeats: 140, businessSeats: 8, economySeats: 132, range: '6,300 km', avgUtilization: 9.1, status: 'active', ageYears: 2, fuelEfficiency: 2.8 },
  { aircraft: 'ATR 42-600', type: 'Turboprop', registration: 'A5-BAB', totalSeats: 48, businessSeats: 0, economySeats: 48, range: '1,326 km', avgUtilization: 5.5, status: 'active', ageYears: 5, fuelEfficiency: 4.2 },
]

// ============ ROUTE PERFORMANCE ============
export interface RouteRecord {
  route: string
  origin: string
  destination: string
  frequency: string
  avgPassengers: number
  loadFactor: number
  avgFare: number     // Nu.
  flightTime: string
  distance: string
  revenue: number     // millions Nu. per month
}

export const routePerformance: RouteRecord[] = [
  { route: 'PBH-DEL', origin: 'Paro', destination: 'Delhi', frequency: 'Daily', avgPassengers: 108, loadFactor: 82.5, avgFare: 22500, flightTime: '2h 30m', distance: '1,236 km', revenue: 72.9 },
  { route: 'PBH-BKK', origin: 'Paro', destination: 'Bangkok', frequency: '5x/week', avgPassengers: 115, loadFactor: 87.1, avgFare: 28500, flightTime: '4h 15m', distance: '2,580 km', revenue: 49.1 },
  { route: 'PBH-KTM', origin: 'Paro', destination: 'Kathmandu', frequency: '4x/week', avgPassengers: 95, loadFactor: 72.3, avgFare: 18200, flightTime: '1h 30m', distance: '678 km', revenue: 27.6 },
  { route: 'PBH-CCU', origin: 'Paro', destination: 'Kolkata', frequency: 'Daily', avgPassengers: 102, loadFactor: 77.8, avgFare: 15800, flightTime: '1h 20m', distance: '542 km', revenue: 48.4 },
  { route: 'PBH-DAC', origin: 'Paro', destination: 'Dhaka', frequency: '3x/week', avgPassengers: 88, loadFactor: 66.8, avgFare: 19500, flightTime: '1h 45m', distance: '812 km', revenue: 22.3 },
  { route: 'PBH-SIN', origin: 'Paro', destination: 'Singapore', frequency: '3x/week', avgPassengers: 125, loadFactor: 89.3, avgFare: 35200, flightTime: '5h 30m', distance: '3,420 km', revenue: 56.8 },
  { route: 'PBH-GAU', origin: 'Paro', destination: 'Guwahati', frequency: '4x/week', avgPassengers: 72, loadFactor: 61.5, avgFare: 12500, flightTime: '0h 55m', distance: '385 km', revenue: 14.4 },
  { route: 'PBH-BOM', origin: 'Paro', destination: 'Mumbai', frequency: '3x/week', avgPassengers: 98, loadFactor: 74.2, avgFare: 26800, flightTime: '3h 10m', distance: '1,892 km', revenue: 33.9 },
  { route: 'PBH-BUT', origin: 'Paro', destination: 'Bumthang', frequency: '3x/week', avgPassengers: 32, loadFactor: 66.7, avgFare: 8500, flightTime: '0h 35m', distance: '175 km', revenue: 3.5 },
]

// ============ CARGO PERFORMANCE ============
export interface CargoRecord {
  month: string
  totalCargoKg: number
  inboundCargoKg: number
  outboundCargoKg: number
  mailKg: number
  perishableKg: number
  generalKg: number
  valuableKg: number
  revenueNu: number       // in thousands
  avgRatePerKg: number    // Nu.
}

export const cargoData: CargoRecord[] = [
  { month: 'Jan 2024', totalCargoKg: 42500, inboundCargoKg: 28200, outboundCargoKg: 14300, mailKg: 3800, perishableKg: 8500, generalKg: 26200, valuableKg: 4000, revenueNu: 4250, avgRatePerKg: 100 },
  { month: 'Feb 2024', totalCargoKg: 39800, inboundCargoKg: 26500, outboundCargoKg: 13300, mailKg: 3500, perishableKg: 7800, generalKg: 24800, valuableKg: 3700, revenueNu: 3980, avgRatePerKg: 100 },
  { month: 'Mar 2024', totalCargoKg: 48200, inboundCargoKg: 31500, outboundCargoKg: 16700, mailKg: 4200, perishableKg: 10500, generalKg: 29100, valuableKg: 4400, revenueNu: 5060, avgRatePerKg: 105 },
  { month: 'Apr 2024', totalCargoKg: 52800, inboundCargoKg: 34200, outboundCargoKg: 18600, mailKg: 4500, perishableKg: 12200, generalKg: 31200, valuableKg: 4900, revenueNu: 5544, avgRatePerKg: 105 },
  { month: 'May 2024', totalCargoKg: 51200, inboundCargoKg: 33100, outboundCargoKg: 18100, mailKg: 4300, perishableKg: 11800, generalKg: 30500, valuableKg: 4600, revenueNu: 5376, avgRatePerKg: 105 },
  { month: 'Jun 2024', totalCargoKg: 44500, inboundCargoKg: 29800, outboundCargoKg: 14700, mailKg: 3900, perishableKg: 9200, generalKg: 27500, valuableKg: 3900, revenueNu: 4450, avgRatePerKg: 100 },
  { month: 'Jul 2024', totalCargoKg: 43200, inboundCargoKg: 28900, outboundCargoKg: 14300, mailKg: 3800, perishableKg: 8800, generalKg: 26800, valuableKg: 3800, revenueNu: 4320, avgRatePerKg: 100 },
  { month: 'Aug 2024', totalCargoKg: 46800, inboundCargoKg: 31200, outboundCargoKg: 15600, mailKg: 4100, perishableKg: 9800, generalKg: 28500, valuableKg: 4400, revenueNu: 4914, avgRatePerKg: 105 },
  { month: 'Sep 2024', totalCargoKg: 50500, inboundCargoKg: 33200, outboundCargoKg: 17300, mailKg: 4400, perishableKg: 11200, generalKg: 30800, valuableKg: 4100, revenueNu: 5302, avgRatePerKg: 105 },
  { month: 'Oct 2024', totalCargoKg: 56200, inboundCargoKg: 36800, outboundCargoKg: 19400, mailKg: 4800, perishableKg: 13500, generalKg: 33200, valuableKg: 4700, revenueNu: 6182, avgRatePerKg: 110 },
  { month: 'Nov 2024', totalCargoKg: 53800, inboundCargoKg: 35200, outboundCargoKg: 18600, mailKg: 4600, perishableKg: 12800, generalKg: 32100, valuableKg: 4300, revenueNu: 5918, avgRatePerKg: 110 },
  { month: 'Dec 2024', totalCargoKg: 58500, inboundCargoKg: 38200, outboundCargoKg: 20300, mailKg: 5200, perishableKg: 14200, generalKg: 34100, valuableKg: 5000, revenueNu: 6435, avgRatePerKg: 110 },
]

// ============ ROTARY OPERATIONS (Helicopter) ============
export interface RotaryRecord {
  month: string
  totalFlights: number
  charterFlights: number
  emergencyFlights: number
  vipFlights: number
  surveyFlights: number
  flightHours: number
  passengers: number
  revenue: number        // thousands Nu.
  utilizationRate: number // percentage
}

export const rotaryOpsData: RotaryRecord[] = [
  { month: 'Jan 2024', totalFlights: 38, charterFlights: 18, emergencyFlights: 8, vipFlights: 6, surveyFlights: 6, flightHours: 62.5, passengers: 142, revenue: 3850, utilizationRate: 52.1 },
  { month: 'Feb 2024', totalFlights: 35, charterFlights: 16, emergencyFlights: 7, vipFlights: 5, surveyFlights: 7, flightHours: 57.8, passengers: 128, revenue: 3520, utilizationRate: 48.3 },
  { month: 'Mar 2024', totalFlights: 45, charterFlights: 22, emergencyFlights: 9, vipFlights: 7, surveyFlights: 7, flightHours: 74.2, passengers: 168, revenue: 4650, utilizationRate: 61.8 },
  { month: 'Apr 2024', totalFlights: 52, charterFlights: 25, emergencyFlights: 10, vipFlights: 9, surveyFlights: 8, flightHours: 85.6, passengers: 198, revenue: 5380, utilizationRate: 71.3 },
  { month: 'May 2024', totalFlights: 48, charterFlights: 23, emergencyFlights: 9, vipFlights: 8, surveyFlights: 8, flightHours: 79.1, passengers: 182, revenue: 4960, utilizationRate: 65.9 },
  { month: 'Jun 2024', totalFlights: 42, charterFlights: 19, emergencyFlights: 11, vipFlights: 5, surveyFlights: 7, flightHours: 69.3, passengers: 155, revenue: 4280, utilizationRate: 57.8 },
  { month: 'Jul 2024', totalFlights: 40, charterFlights: 18, emergencyFlights: 12, vipFlights: 4, surveyFlights: 6, flightHours: 66.0, passengers: 148, revenue: 4080, utilizationRate: 55.0 },
  { month: 'Aug 2024', totalFlights: 44, charterFlights: 20, emergencyFlights: 10, vipFlights: 6, surveyFlights: 8, flightHours: 72.5, passengers: 165, revenue: 4520, utilizationRate: 60.4 },
  { month: 'Sep 2024', totalFlights: 50, charterFlights: 24, emergencyFlights: 9, vipFlights: 8, surveyFlights: 9, flightHours: 82.4, passengers: 190, revenue: 5180, utilizationRate: 68.7 },
  { month: 'Oct 2024', totalFlights: 58, charterFlights: 28, emergencyFlights: 11, vipFlights: 10, surveyFlights: 9, flightHours: 95.5, passengers: 222, revenue: 6020, utilizationRate: 79.6 },
  { month: 'Nov 2024', totalFlights: 55, charterFlights: 26, emergencyFlights: 10, vipFlights: 9, surveyFlights: 10, flightHours: 90.6, passengers: 210, revenue: 5720, utilizationRate: 75.5 },
  { month: 'Dec 2024', totalFlights: 50, charterFlights: 24, emergencyFlights: 8, vipFlights: 10, surveyFlights: 8, flightHours: 82.4, passengers: 192, revenue: 5280, utilizationRate: 68.7 },
]

// ============ TOTAL FLIGHT COUNT SUMMARY ============
export interface FlightCountSummary {
  route: string
  weekly: number
  monthly: number
  annual: number
  aircraft: string
}

export const flightCountSummary: FlightCountSummary[] = [
  { route: 'Paro - Delhi', weekly: 7, monthly: 30, annual: 365, aircraft: 'A320neo / A319' },
  { route: 'Paro - Bangkok', weekly: 5, monthly: 22, annual: 260, aircraft: 'A320neo' },
  { route: 'Paro - Kolkata', weekly: 7, monthly: 30, annual: 365, aircraft: 'A319' },
  { route: 'Paro - Kathmandu', weekly: 4, monthly: 17, annual: 208, aircraft: 'A319' },
  { route: 'Paro - Singapore', weekly: 3, monthly: 13, annual: 156, aircraft: 'A320neo' },
  { route: 'Paro - Dhaka', weekly: 3, monthly: 13, annual: 156, aircraft: 'A319' },
  { route: 'Paro - Mumbai', weekly: 3, monthly: 13, annual: 156, aircraft: 'A320neo' },
  { route: 'Paro - Guwahati', weekly: 4, monthly: 17, annual: 208, aircraft: 'ATR 42-600' },
  { route: 'Paro - Bumthang', weekly: 3, monthly: 13, annual: 156, aircraft: 'ATR 42-600' },
]

// ============ ANNUAL SUMMARY ============
export const annualSummary = {
  totalFlights2024: 2568,
  totalPassengers2024: 193650,
  avgLoadFactor: 77.6,
  totalCargo: 587200,       // kg
  totalRevenue: 4850,       // millions Nu.
  fleetSize: 5,
  destinations: 9,
  countries: 6,
  onTimePerformance: 74.5,
  customerSatisfaction: 4.2, // out of 5
  rotaryFlights: 557,
  rotaryHours: 917.5,
}
