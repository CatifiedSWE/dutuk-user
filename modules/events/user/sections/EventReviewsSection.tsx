'use client';

import React from 'react';
import Image from 'next/image';
import { EventReview } from '@/domain/event';

interface EventReviewsSectionProps {
  reviews: EventReview[];
  rating: number;
  reviewCount: number;
}

export default function EventReviewsSection({ reviews, rating, reviewCount }: EventReviewsSectionProps) {
  // Helper function to render star icons
  const renderStars = (rating: number, size: 'small' | 'large' = 'large') => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const textSize = size === 'small' ? 'text-[16px]' : 'text-2xl';

    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={`full-${i}`} className={`material-symbols-outlined ${textSize} fill-1`}>
          star
        </span>
      );
    }

    // Half star
    if (hasHalfStar) {
      stars.push(
        <span key="half" className={`material-symbols-outlined ${textSize} fill-1 relative overflow-hidden`}>
          star_half
        </span>
      );
    }

    // Empty stars
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <span key={`empty-${i}`} className={`material-symbols-outlined ${textSize}`}>
          star
        </span>
      );
    }

    return stars;
  };

  return (
    <div className="bg-white rounded-[32px] shadow-lg shadow-[#4F0000]/5 p-6 md:p-10 border border-white/50">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div>
          <h3 className="font-serif text-xl font-bold text-[#4F0000] mb-2">Reviews</h3>
          <p className="text-[#4F0000]/60 text-sm">See what other couples have to say</p>
        </div>
        <button className="bg-[#7C2A2A] hover:bg-[#5A1F1F] text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-colors shadow-lg shadow-[#7C2A2A]/20">
          Write a review
        </button>
      </div>

      {/* Overall Rating */}
      <div className="flex items-center gap-4 mb-8">
        <span className="text-[#4F0000]/70 font-medium">Overall rating</span>
        <div className="flex text-amber-400">
          {renderStars(rating, 'large')}
        </div>
        <span className="font-bold text-[#4F0000]">{rating} Star</span>
      </div>

      {/* Individual Reviews */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
            <div className="flex items-start gap-4">
              {/* Reviewer Avatar */}
              {review.reviewerAvatar ? (
                <Image
                  src={review.reviewerAvatar}
                  alt={review.reviewerName}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-[#7C2A2A] text-white flex items-center justify-center font-bold text-sm border-2 border-white shadow-sm">
                  {review.reviewerInitials}
                </div>
              )}

              {/* Review Content */}
              <div className="flex-1">
                {/* Reviewer Name and Date */}
                <div className="flex justify-between items-center mb-1">
                  <h5 className="font-bold text-[#4F0000]">{review.reviewerName}</h5>
                  <span className="text-xs text-[#4F0000]/60">{review.reviewDate}</span>
                </div>

                {/* Star Rating */}
                <div className="flex text-amber-400 mb-2">
                  {renderStars(review.rating, 'small')}
                </div>

                {/* Review Title (if exists) */}
                {review.reviewTitle && (
                  <h6 className="font-semibold text-[#4F0000] mb-1">{review.reviewTitle}</h6>
                )}

                {/* Review Text */}
                <p className="text-[#4F0000]/70 text-sm leading-relaxed mb-3">
                  {review.reviewText}
                </p>

                {/* Review Photos (if exist) */}
                {review.reviewPhotos && review.reviewPhotos.length > 0 && (
                  <div className="flex gap-2 mt-3">
                    {review.reviewPhotos.map((photo, index) => (
                      <div key={index} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                        <Image
                          src={photo}
                          alt={`Review photo ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
