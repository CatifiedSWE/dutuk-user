export interface Review {
  id: string;
  reviewerName: string;
  reviewerAvatar?: string;
  reviewerInitials: string;
  rating: number;
  reviewTitle?: string;
  reviewText: string;
  reviewDate: string;
  reviewPhotos?: string[];
}

export interface Portfolio {
  photos: string[];
  videos: string[];
  events: string[];
}

export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  website?: string;
}

export interface Vendor {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  description: string;
  logo: string;
  coverImage: string;
  profileImage: string;
  rating: number;
  totalEvents: number;
  reviewCount: number;
  verified: boolean;
  specialties: string[];
  musicGenres?: string[];
  location: string;
  joinedDate: string;
  joinedYear: string;
  portfolio?: Portfolio;
  reviews?: Review[];
  socialLinks?: SocialLinks;
  isOnline?: boolean;
}

export interface VendorStats {
  totalEvents: number;
  totalBookings: number;
  totalRevenue: number;
  averageRating: number;
}
