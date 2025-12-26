import { EventDetail } from '@/domain/event';

export const eventsData: EventDetail[] = [
  // Regular Events from exploreData
  {
    id: '3',
    title: 'outReach ECR DJ Party',
    subtitle: 'DJ, Decoration, Sound System, Lighting',
    description: 'Experience an unforgettable night at ECR with premium DJ entertainment, stunning beach decorations, professional sound system, and dynamic lighting. Perfect for party enthusiasts looking for an electrifying atmosphere.',
    coverImage: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&h=600&fit=crop&q=80',
    price: '₹ 1,00,000 - ₹ 3,00,000',
    priceNote: '+GST and Platform fee',
    location: 'ECR, Chennai',
    dateRange: 'Oct 15, 2025 - Oct 18, 2025',
    vendorName: 'MickyMov DJ',
    vendorAvatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=100&h=100&fit=crop&q=75',
    vendorId: 'vnd-001',
    rating: 4.9,
    reviewCount: 87,
    type: 'concert',
    services: [
      {
        id: 'svc-1',
        name: 'DJ & Sound',
        icon: 'music_note',
        priceRange: '₹ 50,000 - ₹ 1.5L'
      },
      {
        id: 'svc-2',
        name: 'Lighting',
        icon: 'lightbulb',
        priceRange: '₹ 30,000 - ₹ 80,000'
      },
      {
        id: 'svc-3',
        name: 'Decoration',
        icon: 'interests',
        priceRange: '₹ 20,000 - ₹ 60,000'
      },
      {
        id: 'svc-4',
        name: 'Security',
        icon: 'security',
        priceRange: 'Included'
      }
    ],
    reviews: [
      {
        id: 'rev-3-1',
        reviewerName: 'Arjun & Friends',
        reviewerInitials: 'AF',
        reviewerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&q=75',
        rating: 5,
        reviewTitle: 'Best Party Ever!',
        reviewText: 'The DJ absolutely killed it! The sound quality was phenomenal and the lighting setup created an amazing atmosphere. MickyMov really knows how to keep the crowd energized all night long.',
        reviewDate: '1 week ago',
        reviewPhotos: [
          'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&h=200&fit=crop&q=75',
          'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&h=200&fit=crop&q=75'
        ]
      },
      {
        id: 'rev-3-2',
        reviewerName: 'Priya K.',
        reviewerInitials: 'PK',
        rating: 5,
        reviewText: 'Amazing beach party experience! The decoration and lighting were stunning. Great value for money.',
        reviewDate: '3 weeks ago'
      },
      {
        id: 'rev-3-3',
        reviewerName: 'Rohit M.',
        reviewerInitials: 'RM',
        rating: 4,
        reviewText: 'Fantastic event overall. The only minor issue was parking, but the party itself was incredible.',
        reviewDate: '1 month ago'
      }
    ]
  },
  {
    id: '7',
    title: 'Beach Resort Wedding',
    subtitle: 'Photography, Videography, Catering, Decoration, Venue',
    description: 'Host your dream wedding at a stunning beach resort with complete wedding planning services. Includes professional photography and videography, gourmet catering, elegant decorations, and full venue access with ocean views.',
    coverImage: 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=1200&h=600&fit=crop&q=80',
    price: '₹ 3,00,000 - ₹ 8,00,000',
    priceNote: '+GST and Platform fee',
    location: 'ECR, Chennai',
    dateRange: 'Dec 20, 2025 - Dec 22, 2025',
    vendorName: 'Elite Event Planners',
    vendorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&q=75',
    vendorId: 'vnd-002',
    rating: 4.9,
    reviewCount: 142,
    type: 'wedding',
    services: [
      {
        id: 'svc-5',
        name: 'Photography',
        icon: 'photo_camera',
        priceRange: '₹ 80,000 - ₹ 2L'
      },
      {
        id: 'svc-6',
        name: 'Videography',
        icon: 'videocam',
        priceRange: '₹ 1L - ₹ 2.5L'
      },
      {
        id: 'svc-7',
        name: 'Catering',
        icon: 'restaurant',
        priceRange: '₹ 800/person'
      },
      {
        id: 'svc-8',
        name: 'Decoration',
        icon: 'interests',
        priceRange: '₹ 1L - ₹ 3L'
      }
    ],
    reviews: [
      {
        id: 'rev-7-1',
        reviewerName: 'Ananya & Karthik',
        reviewerInitials: 'AK',
        reviewerAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&q=75',
        rating: 5,
        reviewTitle: 'Dream Wedding Come True',
        reviewText: 'Elite Event Planners made our beach wedding absolutely magical! The decorations were breathtaking, the food was exceptional, and the photography team captured every precious moment beautifully.',
        reviewDate: '2 weeks ago',
        reviewPhotos: [
          'https://images.unsplash.com/photo-1519741497674-611481863552?w=300&h=200&fit=crop&q=75'
        ]
      },
      {
        id: 'rev-7-2',
        reviewerName: 'Rajesh S.',
        reviewerInitials: 'RS',
        rating: 5,
        reviewText: 'Professional team, stunning venue, and flawless execution. Highly recommend for destination weddings!',
        reviewDate: '1 month ago'
      }
    ]
  },
  // Premium Events
  {
    id: 'p1',
    title: 'ITC Grand Chola - Premium Venue',
    subtitle: 'Grand Ballroom, Catering, Photography, Decoration, Entertainment',
    description: 'Experience luxury at its finest at ITC Grand Chola\'s magnificent Grand Ballroom. Perfect for grand weddings and corporate events with world-class amenities, gourmet catering by award-winning chefs, and comprehensive event management services.',
    coverImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=600&fit=crop&q=80',
    price: '₹ 5,00,000 - ₹ 15,00,000',
    priceNote: '+GST and Platform fee',
    location: 'Guindy, Chennai',
    dateRange: 'Jan 15, 2026 - Jan 17, 2026',
    vendorName: 'ITC Hotels',
    vendorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&q=75',
    vendorId: 'vnd-002',
    rating: 5.0,
    reviewCount: 256,
    type: 'wedding',
    services: [
      {
        id: 'svc-9',
        name: 'Grand Ballroom',
        icon: 'event',
        priceRange: '₹ 2L - ₹ 5L'
      },
      {
        id: 'svc-10',
        name: 'Gourmet Catering',
        icon: 'restaurant',
        priceRange: '₹ 1500/person'
      },
      {
        id: 'svc-11',
        name: 'Photography',
        icon: 'photo_camera',
        priceRange: '₹ 1.5L - ₹ 3L'
      },
      {
        id: 'svc-12',
        name: 'Decoration',
        icon: 'interests',
        priceRange: '₹ 2L - ₹ 6L'
      }
    ],
    reviews: [
      {
        id: 'rev-p1-1',
        reviewerName: 'Divya & Arun',
        reviewerInitials: 'DA',
        reviewerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&q=75',
        rating: 5,
        reviewTitle: 'Absolutely Spectacular!',
        reviewText: 'ITC Grand Chola exceeded all our expectations. The Grand Ballroom was stunning, the staff was impeccable, and the food was restaurant-quality. Worth every penny for our special day!',
        reviewDate: '1 week ago',
        reviewPhotos: [
          'https://images.unsplash.com/photo-1519167758481-83f29da8ae8d?w=300&h=200&fit=crop&q=75',
          'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=300&h=200&fit=crop&q=75'
        ]
      },
      {
        id: 'rev-p1-2',
        reviewerName: 'Vikram & Sneha',
        reviewerInitials: 'VS',
        rating: 5,
        reviewText: 'Luxury at its best! The event coordination was flawless and the venue is truly world-class.',
        reviewDate: '3 weeks ago'
      }
    ]
  },
  {
    id: 'p4',
    title: 'Leela Palace Grand Ballroom',
    subtitle: 'Luxury Venue, Premium Catering, Full Service Event Planning',
    description: 'Host an unforgettable event at The Leela Palace\'s exquisite Grand Ballroom. Features stunning architecture, premium decor, gourmet multi-cuisine catering, and dedicated event planning team for a seamless experience.',
    coverImage: 'https://images.unsplash.com/photo-1519167758481-83f29da8ae8d?w=1200&h=600&fit=crop&q=80',
    price: '₹ 6,00,000 - ₹ 18,00,000',
    priceNote: '+GST and Platform fee',
    location: 'MRC Nagar, Chennai',
    dateRange: 'Feb 10, 2026 - Feb 12, 2026',
    vendorName: 'Leela Hotels',
    vendorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&q=75',
    vendorId: 'vnd-002',
    rating: 5.0,
    reviewCount: 198,
    type: 'wedding',
    services: [
      {
        id: 'svc-13',
        name: 'Grand Ballroom',
        icon: 'event',
        priceRange: '₹ 3L - ₹ 7L'
      },
      {
        id: 'svc-14',
        name: 'Premium Catering',
        icon: 'restaurant',
        priceRange: '₹ 1800/person'
      },
      {
        id: 'svc-15',
        name: 'Videography',
        icon: 'videocam',
        priceRange: '₹ 2L - ₹ 4L'
      },
      {
        id: 'svc-16',
        name: 'Floral Decoration',
        icon: 'local_florist',
        priceRange: '₹ 2L - ₹ 5L'
      }
    ],
    reviews: [
      {
        id: 'rev-p4-1',
        reviewerName: 'Meera & Sameer',
        reviewerInitials: 'MS',
        reviewerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&q=75',
        rating: 5,
        reviewTitle: 'Royal Treatment',
        reviewText: 'The Leela Palace made us feel like royalty! The ballroom is magnificent, the service is impeccable, and the attention to detail is extraordinary. Our guests are still talking about it!',
        reviewDate: '2 weeks ago',
        reviewPhotos: [
          'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=300&h=200&fit=crop&q=75'
        ]
      },
      {
        id: 'rev-p4-2',
        reviewerName: 'Arjun T.',
        reviewerInitials: 'AT',
        rating: 5,
        reviewText: 'Premium venue with exceptional service. The food quality and presentation were outstanding!',
        reviewDate: '1 month ago'
      }
    ]
  },
  // Additional regular events to complete the dataset
  {
    id: '2',
    title: 'Complete Birthday Bash Package',
    subtitle: 'Decoration, Catering, Entertainment, Photography',
    description: 'Celebrate your special day with our complete birthday package. Includes themed decorations, delicious catering menu, entertainment options, and professional photography to capture all the fun moments.',
    coverImage: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1200&h=600&fit=crop&q=80',
    price: '₹ 35,000 - ₹ 80,000',
    priceNote: '+GST and Platform fee',
    location: 'Chennai, Anna Nagar',
    dateRange: 'Available on request',
    vendorName: 'Party Perfect Events',
    vendorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&q=75',
    vendorId: 'vnd-003',
    rating: 4.6,
    reviewCount: 78,
    type: 'birthday',
    services: [
      {
        id: 'svc-17',
        name: 'Decoration',
        icon: 'interests',
        priceRange: '₹ 15,000 - ₹ 35,000'
      },
      {
        id: 'svc-18',
        name: 'Catering',
        icon: 'restaurant',
        priceRange: '₹ 300/person'
      },
      {
        id: 'svc-19',
        name: 'Entertainment',
        icon: 'celebration',
        priceRange: '₹ 10,000 - ₹ 25,000'
      },
      {
        id: 'svc-20',
        name: 'Photography',
        icon: 'photo_camera',
        priceRange: '₹ 8,000 - ₹ 15,000'
      }
    ],
    reviews: [
      {
        id: 'rev-2-1',
        reviewerName: 'Priya M.',
        reviewerInitials: 'PM',
        rating: 5,
        reviewText: 'Perfect birthday party for my daughter! The decorations were beautiful and the kids had a blast.',
        reviewDate: '2 weeks ago'
      },
      {
        id: 'rev-2-2',
        reviewerName: 'Ravi K.',
        reviewerInitials: 'RK',
        rating: 4,
        reviewText: 'Good value for money. The team was professional and everything went smoothly.',
        reviewDate: '1 month ago'
      }
    ]
  },
  {
    id: '5',
    title: 'Grand Wedding Package',
    subtitle: 'Complete Wedding Planning, Decoration, Catering, Photography',
    description: 'Make your wedding day extraordinary with our grand wedding package. Comprehensive planning services including venue decoration, multi-cuisine catering, professional photography and videography, and complete event coordination.',
    coverImage: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&h=600&fit=crop&q=80',
    price: '₹ 2,50,000 - ₹ 6,00,000',
    priceNote: '+GST and Platform fee',
    location: 'Chennai, Velachery',
    dateRange: 'Available year-round',
    vendorName: 'Dream Weddings',
    vendorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&q=75',
    vendorId: 'vnd-002',
    rating: 4.9,
    reviewCount: 165,
    type: 'wedding',
    services: [
      {
        id: 'svc-21',
        name: 'Photography',
        icon: 'photo_camera',
        priceRange: '₹ 60,000 - ₹ 1.5L'
      },
      {
        id: 'svc-22',
        name: 'Videography',
        icon: 'videocam',
        priceRange: '₹ 80,000 - ₹ 2L'
      },
      {
        id: 'svc-23',
        name: 'Catering',
        icon: 'restaurant',
        priceRange: '₹ 600/person'
      },
      {
        id: 'svc-24',
        name: 'Decoration',
        icon: 'interests',
        priceRange: '₹ 80,000 - ₹ 2L'
      }
    ],
    reviews: [
      {
        id: 'rev-5-1',
        reviewerName: 'Lakshmi & Aditya',
        reviewerInitials: 'LA',
        reviewerAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&q=75',
        rating: 5,
        reviewTitle: 'Perfect Wedding Day',
        reviewText: 'Dream Weddings team made our special day truly magical. Every detail was taken care of perfectly!',
        reviewDate: '3 weeks ago',
        reviewPhotos: [
          'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=300&h=200&fit=crop&q=75'
        ]
      },
      {
        id: 'rev-5-2',
        reviewerName: 'Ramesh S.',
        reviewerInitials: 'RS',
        rating: 5,
        reviewText: 'Excellent service and great value. Highly recommended for traditional weddings!',
        reviewDate: '2 months ago'
      }
    ]
  },
  {
    id: '9',
    title: 'Complete Anniversary Package',
    subtitle: 'Romantic Setup, Dinner, Photography, Entertainment',
    description: 'Celebrate your love story with our exclusive anniversary package. Features romantic venue decoration, candlelight dinner, live music entertainment, and professional photography to capture your special moments together.',
    coverImage: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&h=600&fit=crop&q=80',
    price: '₹ 45,000 - ₹ 1,00,000',
    priceNote: '+GST and Platform fee',
    location: 'Chennai, Besant Nagar',
    dateRange: 'Flexible dates',
    vendorName: 'Celebrate Love Events',
    vendorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&q=75',
    vendorId: 'vnd-004',
    rating: 4.6,
    reviewCount: 54,
    type: 'other',
    services: [
      {
        id: 'svc-25',
        name: 'Decoration',
        icon: 'interests',
        priceRange: '₹ 15,000 - ₹ 30,000'
      },
      {
        id: 'svc-26',
        name: 'Catering',
        icon: 'restaurant',
        priceRange: '₹ 20,000 - ₹ 40,000'
      },
      {
        id: 'svc-27',
        name: 'Photography',
        icon: 'photo_camera',
        priceRange: '₹ 10,000 - ₹ 20,000'
      },
      {
        id: 'svc-28',
        name: 'Live Music',
        icon: 'music_note',
        priceRange: '₹ 8,000 - ₹ 15,000'
      }
    ],
    reviews: [
      {
        id: 'rev-9-1',
        reviewerName: 'Kavya & Ashwin',
        reviewerInitials: 'KA',
        rating: 5,
        reviewText: 'Beautiful romantic setup! The team made our 10th anniversary truly memorable. Thank you!',
        reviewDate: '1 week ago'
      },
      {
        id: 'rev-9-2',
        reviewerName: 'Sanjay R.',
        reviewerInitials: 'SR',
        rating: 4,
        reviewText: 'Lovely experience overall. The food was excellent and the decoration was elegant.',
        reviewDate: '3 weeks ago'
      }
    ]
  },
  {
    id: 'p2',
    title: 'Celebrity Wedding Planners',
    subtitle: 'Luxury Wedding Planning, High-End Vendors, Premium Services',
    description: 'Experience celebrity-style wedding planning with access to the finest vendors and venues. Our premium team handles everything from concept to execution, ensuring a flawless and unforgettable celebration.',
    coverImage: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&h=600&fit=crop&q=80',
    price: '₹ 3,00,000 - ₹ 10,00,000',
    priceNote: '+GST and Platform fee',
    location: 'Chennai, Alwarpet',
    dateRange: 'Customized planning',
    vendorName: 'Luxury Events Co',
    vendorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&q=75',
    vendorId: 'vnd-001',
    rating: 5.0,
    reviewCount: 89,
    type: 'wedding',
    services: [
      {
        id: 'svc-29',
        name: 'Wedding Planning',
        icon: 'event_available',
        priceRange: '₹ 1L - ₹ 3L'
      },
      {
        id: 'svc-30',
        name: 'Premium Vendors',
        icon: 'workspace_premium',
        priceRange: 'Customized'
      },
      {
        id: 'svc-31',
        name: 'Photography',
        icon: 'photo_camera',
        priceRange: '₹ 2L - ₹ 5L'
      },
      {
        id: 'svc-32',
        name: 'Luxury Catering',
        icon: 'restaurant',
        priceRange: '₹ 2000/person'
      }
    ],
    reviews: [
      {
        id: 'rev-p2-1',
        reviewerName: 'Nithya & Karan',
        reviewerInitials: 'NK',
        reviewerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&q=75',
        rating: 5,
        reviewTitle: 'Beyond Perfect!',
        reviewText: 'Celebrity Wedding Planners made our wedding look like it was straight out of a magazine. Every vendor was top-notch and the coordination was flawless!',
        reviewDate: '1 week ago',
        reviewPhotos: [
          'https://images.unsplash.com/photo-1519741497674-611481863552?w=300&h=200&fit=crop&q=75',
          'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=300&h=200&fit=crop&q=75'
        ]
      },
      {
        id: 'rev-p2-2',
        reviewerName: 'Deepak M.',
        reviewerInitials: 'DM',
        rating: 5,
        reviewText: 'Worth every rupee! Professional team with excellent taste and execution. Highly recommend!',
        reviewDate: '2 weeks ago'
      }
    ]
  },
  {
    id: 'p3',
    title: 'Royal Wedding Complete Package',
    subtitle: 'Multi-Day Events, Premium Venues, Full Service Planning',
    description: 'The ultimate luxury wedding experience across multiple premium venues in Chennai. Includes comprehensive planning for all pre-wedding and wedding day events, featuring world-class vendors and personalized service.',
    coverImage: 'https://images.unsplash.com/photo-1460978812857-470ed1c77af0?w=1200&h=600&fit=crop&q=80',
    price: '₹ 10,00,000 - ₹ 25,00,000',
    priceNote: '+GST and Platform fee',
    location: 'Chennai, Multiple Locations',
    dateRange: 'Multi-day customized',
    vendorName: 'Royal Events',
    vendorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&q=75',
    vendorId: 'vnd-002',
    rating: 5.0,
    reviewCount: 67,
    type: 'wedding',
    services: [
      {
        id: 'svc-33',
        name: 'Multi-Venue Events',
        icon: 'event',
        priceRange: '₹ 4L - ₹ 10L'
      },
      {
        id: 'svc-34',
        name: 'Premium Catering',
        icon: 'restaurant',
        priceRange: '₹ 2500/person'
      },
      {
        id: 'svc-35',
        name: 'Cinematic Video',
        icon: 'videocam',
        priceRange: '₹ 3L - ₹ 6L'
      },
      {
        id: 'svc-36',
        name: 'Designer Decor',
        icon: 'interests',
        priceRange: '₹ 4L - ₹ 10L'
      }
    ],
    reviews: [
      {
        id: 'rev-p3-1',
        reviewerName: 'Shreya & Varun',
        reviewerInitials: 'SV',
        reviewerAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&q=75',
        rating: 5,
        reviewTitle: 'Truly Royal Experience',
        reviewText: 'Royal Events lived up to their name! Every single event was executed perfectly across three days. The attention to detail and luxury was unmatched. Our guests are still raving about it!',
        reviewDate: '2 weeks ago',
        reviewPhotos: [
          'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=300&h=200&fit=crop&q=75',
          'https://images.unsplash.com/photo-1519167758481-83f29da8ae8d?w=300&h=200&fit=crop&q=75'
        ]
      },
      {
        id: 'rev-p3-2',
        reviewerName: 'Arjun K.',
        reviewerInitials: 'AK',
        rating: 5,
        reviewText: 'The most spectacular wedding we\'ve ever attended! Worth the investment for such a grand celebration.',
        reviewDate: '1 month ago'
      }
    ]
  }
];

// Helper function to get event by ID
export const getEventById = (id: string): EventDetail | undefined => {
  return eventsData.find(event => event.id === id);
};
