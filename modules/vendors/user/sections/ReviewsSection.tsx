'use client';

import React from 'react';
import { Review } from '@/domain/vendor';
import { Star } from 'lucide-react';

interface ReviewsSectionProps {
  reviews?: Review[];
  averageRating: number;
}

export function ReviewsSection({ reviews = [], averageRating }: ReviewsSectionProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`w-3.5 h-3.5 ${
          index < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 fill-gray-300'
        }`}
      />
    ));
  };

  if (reviews.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-3xl shadow-card p-6 border border-gray-100">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-display text-xl font-bold text-gray-900">Reviews</h2>
        <span className="flex items-center text-sm font-bold text-gray-900 bg-yellow-50 px-2 py-1 rounded-lg border border-yellow-100">
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 mr-1" />
          {averageRating}
        </span>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.map((review, index) => (
          <div
            key={review.id}
            className={`border-b border-gray-50 pb-6 last:border-0 last:pb-0`}
          >
            {/* Reviewer Info */}
            <div className="flex items-start gap-3 mb-3">
              {review.reviewerAvatar ? (
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  <img
                    src={review.reviewerAvatar}
                    alt={review.reviewerName}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 text-gray-500 font-bold text-xs">
                  {review.reviewerInitials}
                </div>
              )}
              <div className="flex-grow">
                <h4 className="font-bold text-gray-900 text-sm">{review.reviewerName}</h4>
                <div className="flex gap-0.5 mt-0.5">
                  {renderStars(review.rating)}
                </div>
              </div>
              <span className="ml-auto text-xs text-gray-400">{review.reviewDate}</span>
            </div>

            {/* Review Title */}
            {review.reviewTitle && (
              <h5 className="font-semibold text-gray-800 text-sm mb-1">{review.reviewTitle}</h5>
            )}

            {/* Review Text */}
            <p className="text-gray-500 text-xs leading-relaxed mb-3">{review.reviewText}</p>

            {/* Review Photos */}
            {review.reviewPhotos && review.reviewPhotos.length > 0 && (
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                {review.reviewPhotos.map((photo, photoIndex) => (
                  <img
                    key={photoIndex}
                    src={photo}
                    alt={`Review Photo ${photoIndex + 1}`}
                    className="w-12 h-12 rounded-lg object-cover flex-shrink-0 border border-gray-100"
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Read All Button */}
      <button className="w-full mt-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:border-gray-300 hover:text-gray-900 transition-colors">
        Read all reviews
      </button>
    </div>
  );
}