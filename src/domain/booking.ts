export interface Booking {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  userEmail: string;
  numberOfTickets: number;
  totalAmount: number;
  currency: string;
  bookingDate: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  eventDetails?: {
    title: string;
    date: string;
    time: string;
    location: string;
  };
}

export interface BookingCheckout {
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  numberOfTickets: number;
  pricePerTicket: number;
  totalAmount: number;
}
