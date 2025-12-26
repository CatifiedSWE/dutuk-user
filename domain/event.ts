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

// Event Detail Page Interfaces
export interface EventService {
  id: string;
  name: string;
  icon: string; // Material icon name
  priceRange: string;
}

export interface EventReview {
  id: string;
  reviewerName: string;
  reviewerAvatar?: string;
  reviewerInitials: string;
  rating: number; // 1-5
  reviewTitle?: string;
  reviewText: string;
  reviewDate: string; // e.g., "2 weeks ago"
  reviewPhotos?: string[];
}

export interface EventDetail {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  coverImage: string;
  price: string;
  priceNote: string; // e.g., "+GST and Platform fee"
  location: string;
  dateRange: string;
  vendorName: string;
  vendorAvatar: string;
  vendorId: string;
  rating: number;
  reviewCount: number;
  services: EventService[];
  reviews: EventReview[];
  type: 'wedding' | 'birthday' | 'corporate' | 'concert' | 'festival' | 'other';
}
