export interface Vendor {
  id: string;
  name: string;
  email: string;
  phone: string;
  description: string;
  logo: string;
  rating: number;
  totalEvents: number;
  verified: boolean;
  specialties: string[];
  location: string;
  joinedDate: string;
}

export interface VendorStats {
  totalEvents: number;
  totalBookings: number;
  totalRevenue: number;
  averageRating: number;
}
