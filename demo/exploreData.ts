// Explore Page Data - Mix of Vendors, Packages, and Events

export interface ExploreItem {
  id: string;
  name: string;
  type: 'vendor' | 'package' | 'event';
  location: string;
  price: string;
  rating: number;
  image: string;
  premium: boolean;
  // Event specific fields
  dateRange?: string;
  vendorName?: string;
  vendorAvatar?: string;
  pricePerPerson?: string;
}

export const exploreData: ExploreItem[] = [
  {
    id: '1',
    name: 'Elite Wedding Photographers',
    type: 'vendor',
    location: 'Chennai, T Nagar',
    price: '₹ 50,000 - ₹ 1,50,000',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=600&h=600&fit=crop&q=75',
    premium: false,
    vendorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&q=75'
  },
  {
    id: '2',
    name: 'Complete Birthday Bash Package',
    type: 'package',
    location: 'Chennai, Anna Nagar',
    price: '₹ 35,000 - ₹ 80,000',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&h=600&fit=crop&q=75',
    premium: false
  },
  {
    id: '3',
    name: 'outReach ECR DJ Party',
    type: 'event',
    location: 'ECR, Chennai',
    price: '₹ 1,00,000 - ₹ 3,00,000',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&h=600&fit=crop&q=75',
    premium: false,
    dateRange: 'Oct 15, 2025 - Oct 18, 2025',
    vendorName: 'MickyMov DJ',
    vendorAvatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=100&h=100&fit=crop&q=75',
    pricePerPerson: '5000/person'
  },
  {
    id: '4',
    name: 'Professional DJ Services',
    type: 'vendor',
    location: 'Chennai, Adyar',
    price: '₹ 20,000 - ₹ 60,000',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&h=600&fit=crop&q=75',
    premium: false,
    vendorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&q=75'
  },
  {
    id: '5',
    name: 'Grand Wedding Package',
    type: 'package',
    location: 'Chennai, Velachery',
    price: '₹ 2,50,000 - ₹ 6,00,000',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&h=600&fit=crop&q=75',
    premium: false
  },
  {
    id: '6',
    name: 'Luxury Catering Services',
    type: 'vendor',
    location: 'Chennai, Mylapore',
    price: '₹ 40,000 - ₹ 1,20,000',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=600&h=600&fit=crop&q=75',
    premium: false,
    vendorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&q=75'
  },
  {
    id: '7',
    name: 'Beach Resort Wedding',
    type: 'event',
    location: 'ECR, Chennai',
    price: '₹ 3,00,000 - ₹ 8,00,000',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=600&h=600&fit=crop&q=75',
    premium: false,
    dateRange: 'Dec 20, 2025 - Dec 22, 2025',
    vendorName: 'Elite Event Planners',
    vendorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&q=75',
    pricePerPerson: '8000/person'
  },
  {
    id: '8',
    name: 'Premium Decoration Studio',
    type: 'vendor',
    location: 'Chennai, Nungambakkam',
    price: '₹ 60,000 - ₹ 2,00,000',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1519167758481-83f29da8ae8d?w=600&h=600&fit=crop&q=75',
    premium: false,
    vendorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&q=75'
  },
  {
    id: '9',
    name: 'Complete Anniversary Package',
    type: 'package',
    location: 'Chennai, Besant Nagar',
    price: '₹ 45,000 - ₹ 1,00,000',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&h=600&fit=crop&q=75',
    premium: false
  }
];

export const premiumExploreData: ExploreItem[] = [
  {
    id: 'p1',
    name: 'ITC Grand Chola - Premium Venue',
    type: 'event',
    location: 'Guindy, Chennai',
    price: '₹ 5,00,000 - ₹ 15,00,000',
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop&q=75',
    premium: true,
    dateRange: 'Jan 15, 2026 - Jan 17, 2026',
    vendorName: 'ITC Hotels',
    vendorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&q=75',
    pricePerPerson: '15000/person'
  },
  {
    id: 'p2',
    name: 'Celebrity Wedding Planners',
    type: 'vendor',
    location: 'Chennai, Alwarpet',
    price: '₹ 3,00,000 - ₹ 10,00,000',
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop&q=75',
    premium: true,
    vendorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&q=75'
  },
  {
    id: 'p3',
    name: 'Royal Wedding Complete Package',
    type: 'package',
    location: 'Chennai, Multiple Locations',
    price: '₹ 10,00,000 - ₹ 25,00,000',
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1460978812857-470ed1c77af0?w=800&h=600&fit=crop&q=75',
    premium: true
  },
  {
    id: 'p4',
    name: 'Leela Palace Grand Ballroom',
    type: 'event',
    location: 'MRC Nagar, Chennai',
    price: '₹ 6,00,000 - ₹ 18,00,000',
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1519167758481-83f29da8ae8d?w=800&h=600&fit=crop&q=75',
    premium: true,
    dateRange: 'Feb 10, 2026 - Feb 12, 2026',
    vendorName: 'Leela Hotels',
    vendorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&q=75',
    pricePerPerson: '18000/person'
  }
];

export const filterOptions = ['Vendors', 'Events', 'Packages'];
