// Vendor Categories Data
export interface VendorCategory {
  name: string;
  price: string;
  image: string;
}

export const vendorCategoriesData: VendorCategory[] = [
  { name: 'Disc Jockey (DJ)', price: '₹ 10,000 - ₹ 60,000', image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&h=600&fit=crop&q=75' },
  { name: 'Photographer', price: '₹ 10,000 - ₹ 1,00,000', image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=600&h=600&fit=crop&q=75' },
  { name: 'Decorators', price: '₹ 30,000 - ₹ 1,50,000', image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&h=600&fit=crop&q=75' },
  { name: 'Entertainment', price: '₹ 30,000 - ₹ 1,50,000', image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&h=600&fit=crop&q=75' },
  { name: 'Catering', price: '₹ 15,000 - ₹ 1,00,000', image: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=600&h=600&fit=crop&q=75' },
  { name: 'Music / Entertainment', price: '₹ 30,000 - ₹ 1,50,000', image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&h=600&fit=crop&q=75' },
];

export const vendorTabs: string[] = [
  'Discover',
  'Event Planner',
  'DJ',
  'Catering',
  'Photographer',
  'Decoration',
  'Printmaker'
];
