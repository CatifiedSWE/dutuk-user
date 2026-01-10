'use client';

import React from 'react';
import Link from 'next/link';
import { useSavedVendors } from '@/hooks/useSavedVendors';
import { Heart, MapPin, ArrowLeft, RefreshCw, Star } from 'lucide-react';

export default function SavedVendorsPage() {
    const { savedVendors, loading, error, refetch } = useSavedVendors();

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                            <Link
                                href="/"
                                className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </Link>
                            <div>
                                <h1 className="text-xl font-semibold text-gray-900">Saved Vendors</h1>
                                <p className="text-sm text-gray-500">Your favorite event professionals</p>
                            </div>
                        </div>
                        <button
                            onClick={() => refetch()}
                            disabled={loading}
                            className={`p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors ${loading ? 'animate-spin' : ''}`}
                        >
                            <RefreshCw className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Loading State */}
                {loading && (
                    <div className="flex items-center justify-center py-20">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-gray-500">Loading saved vendors...</p>
                        </div>
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                        <p className="text-red-600 font-medium">Error loading saved vendors</p>
                        <p className="text-red-500 text-sm mt-1">{error}</p>
                        <button
                            onClick={() => refetch()}
                            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && savedVendors.length === 0 && (
                    <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
                        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Heart className="w-10 h-10 text-red-400" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">No saved vendors yet</h2>
                        <p className="text-gray-500 max-w-md mx-auto mb-6">
                            Browse vendors and tap the heart icon to save your favorites. They&apos;ll appear here for easy access.
                        </p>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary-hover transition-colors"
                        >
                            Browse Vendors
                        </Link>
                    </div>
                )}

                {/* Saved Vendors Grid */}
                {!loading && !error && savedVendors.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {savedVendors.map((saved) => (
                            <Link
                                key={saved.id}
                                href={`/vendors/${saved.vendor_id}`}
                                className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
                            >
                                {/* Vendor Image */}
                                <div className="relative h-40 bg-gradient-to-br from-primary/20 to-primary/5">
                                    {saved.vendor?.logo_url ? (
                                        <img
                                            src={saved.vendor.logo_url}
                                            alt={saved.vendor?.company || 'Vendor'}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <span className="text-5xl font-bold text-primary/30">
                                                {saved.vendor?.company?.charAt(0)?.toUpperCase() || 'V'}
                                            </span>
                                        </div>
                                    )}

                                    {/* Heart Badge */}
                                    <div className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm">
                                        <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                                    </div>
                                </div>

                                {/* Vendor Info */}
                                <div className="p-5">
                                    <h3 className="font-semibold text-gray-900 text-lg group-hover:text-primary transition-colors">
                                        {saved.vendor?.company || 'Unknown Vendor'}
                                    </h3>

                                    {saved.vendor?.address && (
                                        <div className="flex items-center gap-1.5 text-gray-500 text-sm mt-2">
                                            <MapPin className="w-4 h-4" />
                                            <span className="truncate">{saved.vendor.address}</span>
                                        </div>
                                    )}

                                    {saved.vendor?.description && (
                                        <p className="text-gray-600 text-sm mt-3 line-clamp-2">
                                            {saved.vendor.description}
                                        </p>
                                    )}

                                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
                                        <span className="text-xs text-gray-400">
                                            Saved {new Date(saved.created_at).toLocaleDateString()}
                                        </span>
                                        <span className="text-sm font-medium text-primary group-hover:underline">
                                            View Profile →
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
