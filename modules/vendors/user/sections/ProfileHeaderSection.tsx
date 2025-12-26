'use client';

import React from 'react';
import Link from 'next/link';
import { Vendor } from '@/domain/vendor';
import { Calendar, MapPin, Music, Star, MessageCircle, Share2 } from 'lucide-react';

interface ProfileHeaderSectionProps {
  vendor: Vendor;
}

export function ProfileHeaderSection({ vendor }: ProfileHeaderSectionProps) {
  return (
    <div className="relative group">
      {/* Cover Image */}
      <div className="relative w-full h-64 md:h-80 lg:h-96 rounded-3xl overflow-hidden shadow-sm">
        <div className="absolute inset-0 bg-gray-900"></div>
        <img
          src={vendor.coverImage}
          alt="Cover"
          className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
      </div>

      {/* Profile Card */}
      <div className="relative -mt-24 px-4 sm:px-6 pb-6">
        <div className="bg-white rounded-3xl shadow-soft p-6 md:p-8 border border-gray-100 relative overflow-hidden">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
            {/* Profile Picture */}
            <div className="flex-shrink-0 relative mx-auto md:mx-0">
              <div className="w-36 h-36 md:w-44 md:h-44 rounded-full border-4 border-white shadow-lg overflow-hidden relative z-10 ring-1 ring-gray-100">
                <img
                  src={vendor.profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              {vendor.isOnline && (
                <div
                  className="absolute bottom-2 right-2 z-20 bg-green-500 w-5 h-5 rounded-full border-2 border-white"
                  title="Online"
                ></div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-grow w-full text-center md:text-left space-y-4">
              {/* Name and Rating */}
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                <div>
                  <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                    {vendor.name}
                  </h1>
                  <p className="text-primary font-medium mt-1">{vendor.username}</p>
                </div>
                <div className="inline-flex items-center gap-1.5 bg-gray-50 px-4 py-1.5 rounded-full border border-gray-100 self-center md:self-start">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <span className="font-bold text-gray-900 text-sm">{vendor.rating}</span>
                  <span className="text-gray-400 text-xs mx-1">•</span>
                  <span className="text-xs text-gray-500 underline decoration-gray-300 underline-offset-2 cursor-pointer hover:text-primary">
                    {vendor.reviewCount} Reviews
                  </span>
                </div>
              </div>

              {/* Location and Details */}
              <div className="flex flex-wrap justify-center md:justify-start gap-y-2 gap-x-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  {vendor.location}
                </div>
                {vendor.musicGenres && vendor.musicGenres.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Music className="w-5 h-5 text-gray-400" />
                    {vendor.musicGenres.join(', ')}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  Joined {vendor.joinedYear}
                </div>
              </div>

              {/* About Description */}
              <p className="text-gray-600 leading-relaxed max-w-3xl mx-auto md:mx-0 text-sm md:text-base">
                {vendor.description}
              </p>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                <button className="group flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary-hover shadow-lg shadow-primary/25 transition-all active:scale-95">
                  <Calendar className="w-5 h-5" />
                  Book Now
                </button>
                <button className="group flex items-center justify-center gap-2 px-8 py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:border-primary hover:text-primary hover:bg-red-50/50 transition-all active:scale-95">
                  <MessageCircle className="w-5 h-5" />
                  Message
                </button>
                <button className="p-3 rounded-xl border border-gray-200 text-gray-500 hover:text-primary hover:border-primary transition-colors flex items-center justify-center">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}