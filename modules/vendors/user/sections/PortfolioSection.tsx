'use client';

import React, { useState } from 'react';
import { Portfolio } from '@/domain/vendor';
import { ArrowRight, Image as ImageIcon } from 'lucide-react';

interface PortfolioSectionProps {
  portfolio?: Portfolio;
}

type TabType = 'photos' | 'videos' | 'events';

export function PortfolioSection({ portfolio }: PortfolioSectionProps) {
  const [activeTab, setActiveTab] = useState<TabType>('photos');

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

  return (
    <div className="bg-white rounded-3xl shadow-card p-6 md:p-8">
      {/* Header with Tabs */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="font-display text-2xl font-bold text-gray-900">Portfolio</h2>
        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('photos')}
            className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeTab === 'photos'
                ? 'bg-white shadow-sm text-gray-900'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Photos
          </button>
          <button
            onClick={() => setActiveTab('videos')}
            className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeTab === 'videos'
                ? 'bg-white shadow-sm text-gray-900'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Videos
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeTab === 'events'
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
            {activeContent.map((item, index) => (
              <div
                key={index}
                className="aspect-square rounded-2xl overflow-hidden relative group cursor-pointer"
              >
                <img
                  src={item}
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
              </div>
            ))}
          </div>

          {/* View All Link */}
          <div className="mt-6 text-center">
            <button className="text-sm font-semibold text-primary hover:text-primary-hover flex items-center justify-center gap-1 mx-auto group">
              View All {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </>
      ) : (
        <div className="text-center py-12 text-gray-400">
          <ImageIcon className="w-12 h-12 mx-auto mb-2" />
          <p>No {activeTab} available</p>
        </div>
      )}
    </div>
  );
}