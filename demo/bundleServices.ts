// Bundle Services Data
export interface BundleService {
  title: string;
  price: string;
  image: string;
}

export const bundleServicesData: BundleService[] = [
  {
    title: 'Birthday Party for 100 people',
    price: '₹ 2,00,000 - ₹ 5,00,000',
    image: '/bundles/birthday.jpg'
  },
  {
    title: 'Wedding Bundle for 300 people',
    price: '₹ 2,80,000 - ₹ 7,00,000',
    image: '/bundles/wedding.jpg'
  },
  {
    title: 'Corporate event for 300 people',
    price: '₹ 2,00,000 - ₹ 4,00,000',
    image: '/bundles/corporate.jpg'
  },
  {
    title: 'Engagement Party',
    price: '₹ 1,50,000 - ₹ 3,00,000',
    image: '/bundles/engagement.jpg'
  },
];
