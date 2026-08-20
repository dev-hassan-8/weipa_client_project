import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
  bookingToken?: string | null;
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

interface IntakeState {
  isAuthenticated: boolean;
  adminUser: { name: string; email: string } | null;
  quotes: QuoteIntake[];
  bookings: BookingIntake[];
  enquiries: ContactIntake[];
  
  // Actions
  loginAdmin: (email: string) => void;
  logoutAdmin: () => void;
  addQuote: (quote: Omit<QuoteIntake, 'id' | 'createdAt' | 'status'>) => QuoteIntake;
  updateQuoteStatus: (id: string, status: QuoteIntake['status'], note?: string, price?: number) => void;
  addBooking: (booking: Omit<BookingIntake, 'id' | 'createdAt' | 'status'>) => BookingIntake;
  updateBookingStatus: (id: string, status: BookingIntake['status']) => void;
  addEnquiry: (enquiry: Omit<ContactIntake, 'id' | 'createdAt' | 'status'>) => ContactIntake;
  updateEnquiryStatus: (id: string, status: ContactIntake['status']) => void;
}

const initialQuotes: QuoteIntake[] = [];
const initialBookings: BookingIntake[] = [];
const initialEnquiries: ContactIntake[] = [];

export const useIntakeStore = create<IntakeState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      adminUser: null,
      quotes: initialQuotes,
      bookings: initialBookings,
      enquiries: initialEnquiries,

      loginAdmin: (email: string) => {
        set({
          isAuthenticated: true,
          adminUser: { name: 'Chris (Weipa Tint)', email: email || 'weipatint@gmail.com' },
        });
      },

      logoutAdmin: () => {
        set({ isAuthenticated: false, adminUser: null });
      },

      addQuote: (data) => {
        const newQuote: QuoteIntake = {
          ...data,
          id: 'QT-' + Math.floor(10000 + Math.random() * 90000),
          status: 'NEW',
          createdAt: new Date().toISOString(),
          notes: ['Submitted via website Quote form.'],
        };
        set((state) => ({ quotes: [newQuote, ...state.quotes] }));
        return newQuote;
      },

      updateQuoteStatus: (id, status, note, price) => {
        set((state) => ({
          quotes: state.quotes.map((q) => {
            if (q.id === id) {
              const updatedNotes = q.notes ? [...q.notes] : [];
              if (note) {
                updatedNotes.push(`[${new Date().toLocaleTimeString()}] ${note}`);
              }
              return {
                ...q,
                status,
                estimatedPrice: price !== undefined ? price : q.estimatedPrice,
                notes: updatedNotes,
              };
            }
            return q;
          }),
        }));
      },

      addBooking: (data) => {
        const newBooking: BookingIntake = {
          ...data,
          id: 'BK-' + Math.floor(1000 + Math.random() * 9000),
          status: 'PENDING',
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ bookings: [newBooking, ...state.bookings] }));
        return newBooking;
      },

      updateBookingStatus: (id, status) => {
        set((state) => ({
          bookings: state.bookings.map((b) => (b.id === id ? { ...b, status } : b)),
        }));
      },

      addEnquiry: (data) => {
        const newEnquiry: ContactIntake = {
          ...data,
          id: 'ENQ-' + Math.floor(7000 + Math.random() * 9000),
          status: 'UNREAD',
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ enquiries: [newEnquiry, ...state.enquiries] }));
        return newEnquiry;
      },

      updateEnquiryStatus: (id, status) => {
        set((state) => ({
          enquiries: state.enquiries.map((e) => (e.id === id ? { ...e, status } : e)),
        }));
      },
    }),
    {
      name: 'weipa-intake-storage',
    }
  )
);
