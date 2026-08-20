export interface QuoteIntake {
  id: string;
  name: string;
  phone: string;
  email: string;
  carMake: string;
  yearModel: string;
  tintType: string;
  filmTier?: 'BUDGET' | 'PREMIUM';
  oldTintRemoval: 'YES' | 'NO';
  windowVisors: 'YES' | 'NO';
  preferredDate?: string;
  comments?: string;
  status: 'NEW' | 'CONTACTED' | 'QUOTED' | 'BOOKED' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  notes?: string[];
  estimatedPrice?: number;
  quoteNotes?: string | null;
  bookingHours?: number | null;
  bookingLink?: string | null;
}

export interface BookingIntake {
  id: string;
  name: string;
  phone: string;
  email: string;
  service: string;
  vehicleDetails: string;
  preferredDate: string;
  preferredTime: string;
  notes?: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
}

export interface ContactIntake {
  id: string;
  name: string;
  phone: string;
  email: string;
  service: string;
  message: string;
  status: 'UNREAD' | 'READ' | 'REPLIED' | 'ARCHIVED';
  createdAt: string;
}

// In-memory persistent state (with rich initial demonstration data)
let quoteIntakes: QuoteIntake[] = [
  {
    id: 'QT-90412',
    name: 'Harrison Forde',
    phone: '0412 345 678',
    email: 'harrison@weipamining.com',
    carMake: 'Toyota',
    yearModel: 'Landcruiser 300 Series 2024',
    tintType: 'Black Armor',
    oldTintRemoval: 'NO',
    windowVisors: 'YES',
    preferredDate: '2026-07-28',
    comments: 'Need maximum heat rejection for site driving in Weipa. Please call after 3pm.',
    status: 'NEW',
    createdAt: '2026-07-23T08:15:00Z',
    notes: ['Initial website submission.'],
    estimatedPrice: 550,
  },
  {
    id: 'QT-90411',
    name: 'Sarah Jenkins',
    phone: '0499 888 777',
    email: 'sarah.j@gmail.com',
    carMake: 'Ford',
    yearModel: 'Ranger Wildtrak 2023',
    tintType: 'CC Extreme Nanocarbon',
    oldTintRemoval: 'YES',
    windowVisors: 'NO',
    preferredDate: '2026-07-26',
    comments: 'Old tint is bubbling on rear window, needs removal before new dark carbon tint.',
    status: 'CONTACTED',
    createdAt: '2026-07-22T14:30:00Z',
    notes: ['Called customer at 4pm. Confirmed old tint removal requirement.'],
    estimatedPrice: 420,
  },
  {
    id: 'QT-90410',
    name: 'Michael Ross',
    phone: '0421 999 111',
    email: 'm.ross@capeyorktransport.com',
    carMake: 'Isuzu',
    yearModel: 'D-Max Dual Cab 2022',
    tintType: 'Black Armor',
    oldTintRemoval: 'NO',
    windowVisors: 'YES',
    preferredDate: '2026-07-25',
    comments: 'Commercial fleet vehicle. Interested in invoice billing.',
    status: 'QUOTED',
    createdAt: '2026-07-21T10:00:00Z',
    notes: ['Sent formal PDF quote of $490.'],
    estimatedPrice: 490,
  },
  {
    id: 'QT-90409',
    name: 'David Vance',
    phone: '0400 123 987',
    email: 'dvance@gmail.com',
    carMake: 'Tesla',
    yearModel: 'Model 3 Performance 2024',
    tintType: 'Black Armor',
    oldTintRemoval: 'NO',
    windowVisors: 'NO',
    preferredDate: '2026-07-24',
    comments: 'Ceramic tint on all side windows and rear glass.',
    status: 'BOOKED',
    createdAt: '2026-07-20T16:20:00Z',
    notes: ['Booked for Friday 8:30am workshop slot.'],
    estimatedPrice: 580,
  },
  {
    id: 'QT-90408',
    name: 'Amanda Taylor',
    phone: '0488 444 333',
    email: 'amanda.t@weipaschool.edu.au',
    carMake: 'Hyundai',
    yearModel: 'Tucson 2021',
    tintType: 'CC Extreme Nanocarbon',
    oldTintRemoval: 'NO',
    windowVisors: 'NO',
    preferredDate: '2026-07-18',
    comments: 'Standard full vehicle tinting.',
    status: 'COMPLETED',
    createdAt: '2026-07-18T09:00:00Z',
    notes: ['Job finished and vehicle handed over.'],
    estimatedPrice: 380,
  },
];

let bookingIntakes: BookingIntake[] = [
  {
    id: 'BK-1002',
    name: 'David Vance',
    phone: '0400 123 987',
    email: 'dvance@gmail.com',
    service: 'Automotive Tinting',
    vehicleDetails: '2024 Tesla Model 3 Performance',
    preferredDate: '2026-07-24',
    preferredTime: 'Morning (8am - 12pm)',
    notes: 'Black Armor appointment.',
    status: 'CONFIRMED',
    createdAt: '2026-07-20T16:25:00Z',
  },
  {
    id: 'BK-1001',
    name: 'Peter Sterling',
    phone: '0411 222 333',
    email: 'peter@rockypoint.com',
    service: 'Residential Tinting',
    vehicleDetails: '4 Bedroom Waterfront Residence',
    preferredDate: '2026-07-27',
    preferredTime: 'Afternoon (12pm - 4:30pm)',
    notes: 'On-site home tint inspection and consultation.',
    status: 'PENDING',
    createdAt: '2026-07-22T11:00:00Z',
  },
];

let contactIntakes: ContactIntake[] = [
  {
    id: 'ENQ-7001',
    name: 'Chloe Bennett',
    phone: '0455 666 777',
    email: 'chloe.b@outlook.com',
    service: 'Residential Tinting',
    message: 'Hi Chris, do you do mobile tinting for home sliding glass doors in Rocky Point? Thanks!',
    status: 'UNREAD',
    createdAt: '2026-07-23T07:45:00Z',
  },
  {
    id: 'ENQ-7000',
    name: 'Mark Miller',
    phone: '0477 888 999',
    email: 'mark@weiparetail.com',
    service: 'Commercial Tinting',
    message: 'Looking for a quote on tinting 6 large shopfront display windows to reduce heat and glare for customers.',
    status: 'READ',
    createdAt: '2026-07-22T13:10:00Z',
  },
];

// Getter & Setter utilities
export function getQuoteIntakes() {
  return quoteIntakes;
}

export function addQuoteIntake(data: Omit<QuoteIntake, 'id' | 'createdAt' | 'status'>) {
  const newQuote: QuoteIntake = {
    ...data,
    id: 'QT-' + Math.floor(10000 + Math.random() * 90000),
    status: 'NEW',
    createdAt: new Date().toISOString(),
    notes: ['Submitted via website Quote Request form.'],
  };
  quoteIntakes = [newQuote, ...quoteIntakes];
  return newQuote;
}

export function updateQuoteStatus(id: string, status: QuoteIntake['status'], note?: string, price?: number) {
  const quote = quoteIntakes.find(q => q.id === id);
  if (quote) {
    quote.status = status;
    if (price !== undefined) quote.estimatedPrice = price;
    if (note) {
      if (!quote.notes) quote.notes = [];
      quote.notes.push(`[${new Date().toLocaleTimeString()}] ${note}`);
    }
    return quote;
  }
  return null;
}

export function getBookingIntakes() {
  return bookingIntakes;
}

export function addBookingIntake(data: Omit<BookingIntake, 'id' | 'createdAt' | 'status'>) {
  const newBooking: BookingIntake = {
    ...data,
    id: 'BK-' + Math.floor(1000 + Math.random() * 9000),
    status: 'PENDING',
    createdAt: new Date().toISOString(),
  };
  bookingIntakes = [newBooking, ...bookingIntakes];
  return newBooking;
}

export function updateBookingStatus(id: string, status: BookingIntake['status']) {
  const booking = bookingIntakes.find(b => b.id === id);
  if (booking) {
    booking.status = status;
    return booking;
  }
  return null;
}

export function getContactIntakes() {
  return contactIntakes;
}

export function addContactIntake(data: Omit<ContactIntake, 'id' | 'createdAt' | 'status'>) {
  const newEnquiry: ContactIntake = {
    ...data,
    id: 'ENQ-' + Math.floor(7000 + Math.random() * 9000),
    status: 'UNREAD',
    createdAt: new Date().toISOString(),
  };
  contactIntakes = [newEnquiry, ...contactIntakes];
  return newEnquiry;
}

export function updateContactStatus(id: string, status: ContactIntake['status']) {
  const enquiry = contactIntakes.find(e => e.id === id);
  if (enquiry) {
    enquiry.status = status;
    return enquiry;
  }
  return null;
}
