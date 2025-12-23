export interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  time: string;
  location: string;
  venue: string;
  price: number;
  currency: string;
  capacity: number;
  availableSeats: number;
  vendorId: string;
  vendorName: string;
  imageUrl: string;
  tags: string[];
  featured: boolean;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
}

export interface EventCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
}
