// Vendor Categories Data
export interface VendorCategory {
  name: string;
  price: string;
  image: string;
}

export const vendorCategoriesData: VendorCategory[] = [
  { name: 'Disc Jockey (DJ)', price: '₹ 10,000 - ₹ 60,000', image: '/vendors/dj.jpg' },
  { name: 'Photographer', price: '₹ 10,000 - ₹ 1,00,000', image: '/vendors/photographer.jpg' },
  { name: 'Decorators', price: '₹ 30,000 - ₹ 1,50,000', image: '/vendors/decorators.jpg' },
  { name: 'Decorators', price: '₹ 30,000 - ₹ 1,50,000', image: '/vendors/decorators.jpg' },
  { name: 'Catering', price: '₹ 15,000 - ₹ 1,00,000', image: '/vendors/catering.jpg' },
  { name: 'Music / Entertainment', price: '₹ 30,000 - ₹ 1,50,000', image: '/vendors/entertainment.jpg' },
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
