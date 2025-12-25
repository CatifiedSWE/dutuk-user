'use client';

import { Heart, MapPin, Star } from 'lucide-react';
import { useState } from 'react';

// Demo vendor data matching the design
const vendors = [
  {
    id: '1',
    name: "Johnny's DJ",
    rating: 4.5,
    location: 'Chennai, TN',
    priceRange: '₹10,000 - ₹30,000',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=600&fit=crop',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop',
    isPremium: false,
  },
  {
    id: '2',
    name: "Johnny's DJ",
    rating: 4.5,
    location: 'Chennai, TN',
    priceRange: '₹10,000 - ₹30,000',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&h=600&fit=crop',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop',
    isPremium: false,
  },
  {
    id: '3',
    name: "Johnny's DJ",
    rating: 4.5,
    location: 'Chennai, TN',
    priceRange: '₹10,000 - ₹30,000',
    image: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800&h=600&fit=crop',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    isPremium: false,
  },
  {
    id: '4',
    name: "Johnny's DJ",
    rating: 4.5,
    location: 'Chennai, TN',
    priceRange: '₹10,000 - ₹30,000',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
    isPremium: false,
  },
  {
    id: '5',
    name: "Johnny's DJ",
    rating: 4.5,
    location: 'Chennai, TN',
    priceRange: '₹10,000 - ₹30,000',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
    isPremium: false,
  },
  {
    id: '6',
    name: "Johnny's DJ",
    rating: 4.5,
    location: 'Chennai, TN',
    priceRange: '₹10,000 - ₹30,000',
    image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&h=600&fit=crop',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
    isPremium: false,
  },
  {
    id: '7',
    name: "Johnny's DJ",
    rating: 4.5,
    location: 'Chennai, TN',
    priceRange: '₹10,000 - ₹30,000',
    image: 'https://images.unsplash.com/photo-1483821838526-8d9756a6e1ed?w=800&h=600&fit=crop',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop',
    isPremium: false,
  },
  {
    id: '8',
    name: "Johnny's DJ",
    rating: 4.5,
    location: 'Chennai, TN',
    priceRange: '₹10,000 - ₹30,000',
    image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800&h=600&fit=crop',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop',
    isPremium: false,
  },
];

export default function EventsListSection() {
  const [favorites, setFavorites] = useState<string[]>([]);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    );
  };

  return (
    <div className="w-full bg-[#FDF5E6] py-12">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12">
        {/* Vendors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {vendors.map((vendor) => (
            <div
              key={vendor.id}
              className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              {/* Image Container */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={vendor.image}
                  alt={vendor.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                
                {/* Heart Icon */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(vendor.id);
                  }}
                  className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md hover:scale-110 transition-transform"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      favorites.includes(vendor.id)
                        ? 'fill-red-500 text-red-500'
                        : 'text-gray-600'
                    }`}
                  />
                </button>

                {/* Vendor Avatar - Overlapping */}
                <div className="absolute -bottom-6 left-4">
                  <div className="w-12 h-12 rounded-full border-4 border-white overflow-hidden shadow-lg">
                    <img
                      src={vendor.avatar}
                      alt={vendor.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 pt-8">
                {/* Name and Rating */}
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-poppins font-semibold text-base text-gray-800">
                    {vendor.name}
                  </h3>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-[#FFC13C] text-[#FFC13C]" />
                    <span className="font-poppins text-sm font-medium text-gray-700">
                      {vendor.rating}
                    </span>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center gap-1 mb-3">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="font-poppins text-sm text-gray-600">
                    {vendor.location}
                  </span>
                </div>

                {/* Price Range */}
                <div className="font-poppins font-bold text-base text-gray-800">
                  {vendor.priceRange}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
