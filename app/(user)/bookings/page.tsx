'use client';

import { Suspense } from 'react';
import { useEffect, useState } from 'react';
import { useUserOrders, Order } from '@/hooks/useOrders';
import { Calendar, Clock, CheckCircle2, XCircle, AlertCircle, ChevronRight, RefreshCw } from 'lucide-react';
import Link from 'next/link';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

function BookingsPageContent() {
    const { orders, loading, error, refetch } = useUserOrders();
    const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

    // Fetch orders on mount
    useEffect(() => {
        refetch();
    }, [refetch]);

    // Split orders into upcoming and past based on event_date
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcomingOrders = orders.filter((order) => {
        const eventDate = new Date(order.event_date);
        return eventDate >= today;
    });

    const pastOrders = orders.filter((order) => {
        const eventDate = new Date(order.event_date);
        return eventDate < today;
    });

    const displayedOrders = activeTab === 'upcoming' ? upcomingOrders : pastOrders;

    const getStatusIcon = (status: Order['status']) => {
        switch (status) {
            case 'approved':
                return <CheckCircle2 className="w-4 h-4 text-green-500" />;
            case 'rejected':
                return <XCircle className="w-4 h-4 text-red-500" />;
            case 'pending':
                return <Clock className="w-4 h-4 text-amber-500" />;
            case 'completed':
                return <CheckCircle2 className="w-4 h-4 text-blue-500" />;
            default:
                return <AlertCircle className="w-4 h-4 text-gray-500" />;
        }
    };

    const getStatusColor = (status: Order['status']) => {
        switch (status) {
            case 'approved':
                return 'bg-green-50 text-green-700 border-green-200';
            case 'rejected':
                return 'bg-red-50 text-red-700 border-red-200';
            case 'pending':
                return 'bg-amber-50 text-amber-700 border-amber-200';
            case 'completed':
                return 'bg-blue-50 text-blue-700 border-blue-200';
            default:
                return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    const getStatusLabel = (status: Order['status']) => {
        switch (status) {
            case 'approved':
                return 'Approved';
            case 'rejected':
                return 'Rejected';
            case 'pending':
                return 'Pending';
            case 'completed':
                return 'Completed';
            default:
                return status;
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#FDF5E6] to-white">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#7C2A2A] to-[#A84444] px-6 py-8">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold text-white font-serif">My Bookings</h1>
                    <p className="text-white/80 mt-2">Track and manage your event bookings</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-6">
                {/* Tabs */}
                <div className="flex space-x-2 mb-6">
                    <button
                        onClick={() => setActiveTab('upcoming')}
                        className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${activeTab === 'upcoming'
                                ? 'bg-[#7C2A2A] text-white shadow-lg shadow-[#7C2A2A]/25'
                                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                            }`}
                    >
                        Upcoming ({upcomingOrders.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('past')}
                        className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${activeTab === 'past'
                                ? 'bg-[#7C2A2A] text-white shadow-lg shadow-[#7C2A2A]/25'
                                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                            }`}
                    >
                        Past ({pastOrders.length})
                    </button>
                </div>

                {/* Refresh Button */}
                <div className="flex justify-end mb-4">
                    <button
                        onClick={() => refetch()}
                        disabled={loading}
                        className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#7C2A2A] transition-colors"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                </div>

                {/* Loading State */}
                {loading && orders.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16">
                        <div className="w-12 h-12 border-3 border-[#7C2A2A] border-t-transparent rounded-full animate-spin" />
                        <p className="text-gray-500 mt-4">Loading your bookings...</p>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                        <div className="flex items-center gap-2 text-red-700">
                            <AlertCircle className="w-5 h-5" />
                            <span>{error}</span>
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {!loading && displayedOrders.length === 0 && (
                    <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Calendar className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">
                            {activeTab === 'upcoming' ? 'No Upcoming Bookings' : 'No Past Bookings'}
                        </h3>
                        <p className="text-gray-500 mb-4">
                            {activeTab === 'upcoming'
                                ? "You don't have any upcoming bookings yet."
                                : "You don't have any completed bookings yet."}
                        </p>
                        {activeTab === 'upcoming' && (
                            <Link
                                href="/explore"
                                className="inline-flex items-center gap-2 bg-[#7C2A2A] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#5A1F1F] transition-colors"
                            >
                                Explore Vendors
                                <ChevronRight className="w-4 h-4" />
                            </Link>
                        )}
                    </div>
                )}

                {/* Orders List */}
                <div className="space-y-4">
                    {displayedOrders.map((order) => (
                        <div
                            key={order.id}
                            className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-gray-800">{order.title}</h3>

                                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="w-4 h-4" />
                                            <span>{formatDate(order.event_date)}</span>
                                        </div>
                                        {order.package_type && (
                                            <span className="text-gray-400">• {order.package_type}</span>
                                        )}
                                    </div>

                                    {order.notes && (
                                        <p className="text-sm text-gray-500 mt-3 line-clamp-2">{order.notes}</p>
                                    )}
                                </div>

                                <div className="flex flex-col items-end gap-2">
                                    <span
                                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${getStatusColor(
                                            order.status
                                        )}`}
                                    >
                                        {getStatusIcon(order.status)}
                                        {getStatusLabel(order.status)}
                                    </span>

                                    {order.amount && (
                                        <span className="text-lg font-bold text-[#7C2A2A]">
                                            ₹{order.amount.toLocaleString()}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Status-specific messages */}
                            {order.status === 'pending' && (
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <p className="text-sm text-amber-600 flex items-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        Waiting for vendor to accept your booking request
                                    </p>
                                </div>
                            )}

                            {order.status === 'approved' && activeTab === 'upcoming' && (
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <Link
                                        href={`/chat?vendorId=${order.vendor_id}`}
                                        className="text-sm text-[#7C2A2A] font-medium flex items-center gap-2 hover:underline"
                                    >
                                        Chat with vendor
                                        <ChevronRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            )}

                            {order.status === 'rejected' && (
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <p className="text-sm text-red-600 flex items-center gap-2">
                                        <XCircle className="w-4 h-4" />
                                        This booking request was declined by the vendor
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function BookingsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#FDF5E6] to-white">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <div className="w-16 h-16 border-4 border-[#7C2A2A]/20 border-t-[#7C2A2A] rounded-full animate-spin"></div>
          <p className="text-sm text-[#4F0000]/60">Loading bookings...</p>
        </div>
      </div>
    }>
      <BookingsPageContent />
    </Suspense>
  );
}
