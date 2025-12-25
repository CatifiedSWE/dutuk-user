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
    image: 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800&h=600&fit=crop&q=75',
    premium: true
  },
  {
    title: 'ITC Grand Chola - All Events',
    location: 'Chennai, Egmore',
    price: '₹ 2,80,000 - ₹ 7,00,000',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop&q=75',
    premium: true
  },
  {
    title: 'Sterling Ooty Resort - Events',
    location: 'Chennai, Egmore',
    price: '₹ 2,00,000 - ₹ 4,00,000',
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop&q=75',
    premium: true
  },
  {
    title: 'Leela Palace Grand Ball',
    location: 'Chennai, MRC Nagar',
    price: '₹ 5,00,000 - ₹ 12,00,000',
    image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&h=600&fit=crop&q=75',
    premium: true
  },
];
