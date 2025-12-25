// Premium Event Planning Data
export interface PremiumEvent {
  title: string;
  location: string;
  price: string;
  image: string;
  premium: boolean;
}

export const premiumEventsData: PremiumEvent[] = [
  {
    title: 'ECR Beach House Wedding',
    location: 'Chennai, Egmore',
    price: '₹ 2,00,000 - ₹ 5,00,000',
    image: '/events/beach-house.jpg',
    premium: true
  },
  {
    title: 'ITC Grand Chola - All Events',
    location: 'Chennai, Egmore',
    price: '₹ 2,80,000 - ₹ 7,00,000',
    image: '/events/itc-grand.jpg',
    premium: true
  },
  {
    title: 'Sterling Ooty Resort - Events',
    location: 'Chennai, Egmore',
    price: '₹ 2,00,000 - ₹ 4,00,000',
    image: '/events/sterling-ooty.jpg',
    premium: true
  },
  {
    title: 'Leela Palace Grand Ball',
    location: 'Chennai, MRC Nagar',
    price: '₹ 5,00,000 - ₹ 12,00,000',
    image: '/events/leela-palace.jpg',
    premium: true
  },
];
