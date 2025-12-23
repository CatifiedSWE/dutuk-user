import { Booking } from '@/domain/booking';

export const demoBookings: Booking[] = [
  {
    id: 'bk-001',
    eventId: 'evt-001',
    userId: 'usr-001',
    userName: 'John Doe',
    userEmail: 'john.doe@example.com',
    numberOfTickets: 2,
    totalAmount: 598,
    currency: 'USD',
    bookingDate: '2025-06-10',
    status: 'confirmed',
    paymentStatus: 'paid',
    eventDetails: {
      title: 'Tech Innovation Summit 2025',
      date: '2025-07-15',
      time: '09:00 AM',
      location: 'San Francisco, CA',
    },
  },
  {
    id: 'bk-002',
    eventId: 'evt-003',
    userId: 'usr-001',
    userName: 'John Doe',
    userEmail: 'john.doe@example.com',
    numberOfTickets: 1,
    totalAmount: 89,
    currency: 'USD',
    bookingDate: '2025-06-15',
    status: 'confirmed',
    paymentStatus: 'paid',
    eventDetails: {
      title: 'Summer Music Festival',
      date: '2025-08-05',
      time: '04:00 PM',
      location: 'Los Angeles, CA',
    },
  },
];
