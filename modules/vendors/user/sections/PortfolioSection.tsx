'use client';

import React, { useState } from 'react';
import { Portfolio } from '@/domain/vendor';
import { ArrowRight, Image as ImageIcon, X, ChevronLeft, ChevronRight, Play } from 'lucide-react';

interface PortfolioSectionProps {
  portfolio?: Portfolio;
}

type TabType = 'photos' | 'videos' | 'events';

const INITIAL_ITEMS = 6;
const LOAD_MORE_COUNT = 20;

export function PortfolioSection({ portfolio }: PortfolioSectionProps) {
  const [activeTab, setActiveTab] = useState<TabType>('photos');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [visibleCounts, setVisibleCounts] = useState({
    photos: INITIAL_ITEMS,
    videos: INITIAL_ITEMS,
    events: INITIAL_ITEMS,
  });

  if (!portfolio) {
    return null;
  }

  const getActiveContent = () => {
    switch (activeTab) {
      case 'photos':
        return portfolio.photos || [];
      case 'videos':
        return portfolio.videos || [];
      case 'events':
        return portfolio.events || [];
      default:
        return [];
    }
  };

  const activeContent = getActiveContent();
  const visibleCount = visibleCounts[activeTab];
  const displayedContent = activeContent.slice(0, visibleCount);
  const hasMore = activeContent.length > visibleCount;

  const loadMore = () => {
    setVisibleCounts(prev => ({
      ...prev,
      [activeTab]: Math.min(prev[activeTab] + LOAD_MORE_COUNT, activeContent.length)
    }));
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
    // Prevent body scroll when lightbox is open
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = 'auto';
  };

  const goToPrevious = () => {
    setLightboxIndex((prev) => (prev === 0 ? activeContent.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setLightboxIndex((prev) => (prev === activeContent.length - 1 ? 0 : prev + 1));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') goToPrevious();
    if (e.key === 'ArrowRight') goToNext();
  };

  const isVideo = (url: string) => {
    return url.match(/\.(mp4|webm|ogg|mov)$/i) || url.includes('youtube') || url.includes('vimeo');
  };

  return (
    <>
      <div className="bg-white rounded-3xl shadow-card p-6 md:p-8">
        {/* Header with Tabs */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="font-display text-2xl font-bold text-gray-900">Portfolio</h2>
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('photos')}
              className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${activeTab === 'photos'
                ? 'bg-white shadow-sm text-gray-900'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              Photos
            </button>
            <button
              onClick={() => setActiveTab('videos')}
              className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${activeTab === 'videos'
                ? 'bg-white shadow-sm text-gray-900'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              Videos
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${activeTab === 'events'
                ? 'bg-white shadow-sm text-gray-900'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              Events
            </button>
          </div>
        </div>

        {/* Gallery Grid */}
        {activeContent.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              {displayedContent.map((item, index) => (
                <div
                  key={index}
                  className="aspect-square rounded-2xl overflow-hidden relative group cursor-pointer"
                  onClick={() => openLightbox(index)}
                >
                  {isVideo(item) ? (
                    <>
                      <video
                        src={item}
                        className="w-full h-full object-cover"
                        muted
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                        <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                          <Play className="w-5 h-5 text-gray-900 ml-0.5" fill="currentColor" />
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <img
                        src={item}
                        alt={`Gallery ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* View All / Load More Button */}
            {hasMore && (
              <div className="mt-6 text-center">
                <button
                  onClick={loadMore}
                  className="text-sm font-semibold text-primary hover:text-primary-hover flex items-center justify-center gap-1 mx-auto group"
                >
                  View All {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} ({activeContent.length})
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 text-gray-400">
            <ImageIcon className="w-12 h-12 mx-auto mb-2" />
            <p>No {activeTab} available</p>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && activeContent[lightboxIndex] && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          {/* Close Button */}
          <button
            className="absolute top-4 right-4 z-10 text-white/80 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            onClick={closeLightbox}
          >
            <X className="w-6 h-6" />
          </button>

          {/* Image Counter */}
          <div className="absolute top-4 left-4 text-white/80 text-sm font-medium">
            {lightboxIndex + 1} / {activeContent.length}
          </div>

          {/* Previous Button */}
          {activeContent.length > 1 && (
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* Media Content */}
          <div
            className="max-w-5xl max-h-[85vh] px-16"
            onClick={(e) => e.stopPropagation()}
          >
            {isVideo(activeContent[lightboxIndex]) ? (
              <video
                src={activeContent[lightboxIndex]}
                controls
                autoPlay
                className="max-w-full max-h-[85vh] rounded-lg"
              />
            ) : (
              <img
                src={activeContent[lightboxIndex]}
                alt={`Gallery ${lightboxIndex + 1}`}
                className="max-w-full max-h-[85vh] object-contain rounded-lg"
              />
            )}
          </div>

          {/* Next Button */}
          {activeContent.length > 1 && (
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}
        </div>
      )}
    </>
  );
}
