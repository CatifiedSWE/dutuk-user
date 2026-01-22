'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, Calendar, Users, Clock, CheckCircle2, XCircle,
    AlertCircle, RefreshCw, MessageSquare, Phone, Star, Loader2, Search
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { PlannedEvent, EventInquiryItem, InquiryStatus } from '@/types/events';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { toast } from 'sonner';

export default function EventDashboardPage() {
    const params = useParams();
    const router = useRouter();
    const eventId = params.id as string;

    const [event, setEvent] = useState<PlannedEvent | null>(null);
    const [items, setItems] = useState<EventInquiryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedItemForRepair, setSelectedItemForRepair] = useState<EventInquiryItem | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [availableVendors, setAvailableVendors] = useState<any[]>([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [replacingVendor, setReplacingVendor] = useState(false);

    const supabase = createClient();

    // Fetch event and items
    useEffect(() => {
        async function fetchEventData() {
            setLoading(true);
            try {
                // Fetch parent event
                const { data: eventData, error: eventError } = await supabase
                    .from('planned_events')
                    .select('*')
                    .eq('id', eventId)
                    .single();

                if (eventError) throw eventError;
                setEvent(eventData);

                // Fetch inquiry items
                const { data: itemsData, error: itemsError } = await supabase
                    .from('event_inquiry_items')
                    .select('*')
                    .eq('event_id', eventId);

                if (itemsError) throw itemsError;

                // Get vendor user_ids from user_profiles to join with companies
                const vendorProfileIds = itemsData?.map(item => item.vendor_id) || [];

                // First get user_profiles to get the auth user_id
                const { data: profilesData } = await supabase
                    .from('user_profiles')
                    .select('id, user_id')
                    .in('id', vendorProfileIds);

                // Then get companies using the auth user_ids
                const authUserIds = profilesData?.map(p => p.user_id) || [];
                const { data: companiesData } = await supabase
                    .from('companies')
                    .select('user_id, company, logo_url, description')
                    .in('user_id', authUserIds);

                // Create a map: profile_id -> company data
                const vendorMap = new Map();
                profilesData?.forEach(profile => {
                    const company = companiesData?.find(c => c.user_id === profile.user_id);
                    vendorMap.set(profile.id, company || { company: 'Vendor', description: 'No description' });
                });

                // Merge company data into items
                const enrichedItems = itemsData?.map(item => ({
                    ...item,
                    vendor: vendorMap.get(item.vendor_id) || null
                })) || [];

                setItems(enrichedItems);
            } catch (error) {
                console.error('Error fetching event:', error);
                toast.error('Failed to load event details');
            } finally {
                setLoading(false);
            }
        }

        if (eventId) {
            fetchEventData();
        }
    }, [eventId, supabase]);

    // Group items by status
    const confirmedItems = items.filter(i => i.status === 'CONFIRMED' || i.status === 'ACCEPTED');
    const pendingItems = items.filter(i => i.status === 'PENDING');
    const rejectedItems = items.filter(i => i.status === 'REJECTED');

    // Calculate progress
    const totalItems = items.length;
    const confirmedCount = confirmedItems.length;
    const progress = totalItems > 0 ? (confirmedCount / totalItems) * 100 : 0;

    // Search available vendors when repair sheet opens or query changes
    useEffect(() => {
        async function searchVendors() {
            if (!selectedItemForRepair || !event) return;

            setSearchLoading(true);
            try {
                // Get all vendor companies
                const { data: companies, error } = await supabase
                    .from('companies')
                    .select('user_id, company, logo_url, description, location')
                    .ilike('company', `%${searchQuery}%`);

                if (error) throw error;

                // Filter out vendors already in this event
                const existingVendorIds = items.map(i => i.vendor_id);
                const filteredCompanies = (companies || []).filter(
                    c => !existingVendorIds.includes(c.user_id)
                );

                // Check availability for each vendor on event date
                const eventDate = event.event_date.split('T')[0];
                const { data: unavailableDates } = await supabase
                    .from('dates')
                    .select('user_id, date, status')
                    .in('user_id', filteredCompanies.map(c => c.user_id))
                    .eq('date', eventDate)
                    .eq('status', 'unavailable');

                const unavailableVendorIds = new Set((unavailableDates || []).map(d => d.user_id));

                // Mark availability on each vendor
                const vendorsWithAvailability = filteredCompanies.map(vendor => ({
                    ...vendor,
                    isAvailable: !unavailableVendorIds.has(vendor.user_id)
                }));

                // Sort: available first
                vendorsWithAvailability.sort((a, b) => (b.isAvailable ? 1 : 0) - (a.isAvailable ? 1 : 0));

                setAvailableVendors(vendorsWithAvailability);
            } catch (error) {
                console.error('Error searching vendors:', error);
                toast.error('Failed to search vendors');
            } finally {
                setSearchLoading(false);
            }
        }

        const debounce = setTimeout(searchVendors, 300);
        return () => clearTimeout(debounce);
    }, [selectedItemForRepair, searchQuery, event, items, supabase]);

    // Handle replacing a vendor in the event
    async function handleReplaceVendor(newVendorUserId: string, newVendorCompany: any) {
        if (!selectedItemForRepair || !event) return;

        setReplacingVendor(true);
        try {
            // Get the user_profile id for this vendor
            const { data: profileData, error: profileError } = await supabase
                .from('user_profiles')
                .select('id')
                .eq('user_id', newVendorUserId)
                .single();

            if (profileError || !profileData) {
                throw new Error('Vendor profile not found');
            }

            // Update the inquiry item with new vendor
            const { error: updateError } = await supabase
                .from('event_inquiry_items')
                .update({
                    vendor_id: profileData.id,
                    status: 'PENDING',
                    quoted_price: null,
                    response_date: null,
                    notes: `Replacement for declined vendor`
                })
                .eq('id', selectedItemForRepair.id);

            if (updateError) throw updateError;

            // Refresh items
            const { data: updatedItems, error: itemsError } = await supabase
                .from('event_inquiry_items')
                .select('*')
                .eq('event_id', eventId);

            if (!itemsError && updatedItems) {
                // Re-enrich with vendor data
                const vendorProfileIds = updatedItems.map(item => item.vendor_id);
                const { data: profilesData } = await supabase
                    .from('user_profiles')
                    .select('id, user_id')
                    .in('id', vendorProfileIds);

                const authUserIds = profilesData?.map(p => p.user_id) || [];
                const { data: companiesData } = await supabase
                    .from('companies')
                    .select('user_id, company, logo_url, description')
                    .in('user_id', authUserIds);

                const vendorMap = new Map();
                profilesData?.forEach(profile => {
                    const company = companiesData?.find(c => c.user_id === profile.user_id);
                    vendorMap.set(profile.id, company || { company: 'Vendor', description: 'No description' });
                });

                const enrichedItems = updatedItems.map(item => ({
                    ...item,
                    vendor: vendorMap.get(item.vendor_id) || null
                }));

                setItems(enrichedItems);
            }

            toast.success(`Replaced with ${newVendorCompany.company}`);
            setSelectedItemForRepair(null);
            setSearchQuery('');
        } catch (error) {
            console.error('Error replacing vendor:', error);
            toast.error('Failed to replace vendor');
        } finally {
            setReplacingVendor(false);
        }
    }

    const getStatusColor = (status: InquiryStatus) => {
        switch (status) {
            case 'CONFIRMED':
            case 'ACCEPTED':
                return 'bg-emerald-50 border-emerald-200 text-emerald-700';
            case 'PENDING':
                return 'bg-amber-50 border-amber-200 text-amber-700';
            case 'REJECTED':
                return 'bg-red-50 border-red-200 text-red-700';
            default:
                return 'bg-gray-50 border-gray-200 text-gray-700';
        }
    };

    const getStatusIcon = (status: InquiryStatus) => {
        switch (status) {
            case 'CONFIRMED':
            case 'ACCEPTED':
                return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
            case 'PENDING':
                return <Clock className="w-5 h-5 text-amber-500" />;
            case 'REJECTED':
                return <XCircle className="w-5 h-5 text-red-500" />;
            default:
                return <AlertCircle className="w-5 h-5 text-gray-500" />;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 animate-spin text-[#4F0000]" />
                    <p className="text-gray-600">Loading event details...</p>
                </div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Event Not Found</h1>
                    <p className="text-gray-600 mb-4">This event doesn't exist or you don't have access.</p>
                    <Button onClick={() => router.push('/events')} className="bg-[#4F0000]">
                        Go Back
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-100 sticky top-0 z-40">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.push('/events')}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <div className="flex-1">
                            <h1 className="text-xl font-bold text-gray-800">{event.title}</h1>
                            <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    {new Date(event.event_date).toLocaleDateString('en-IN', {
                                        weekday: 'short',
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric'
                                    })}
                                </span>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${event.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-700' :
                                    event.status === 'PLANNING' ? 'bg-amber-100 text-amber-700' :
                                        event.status === 'COMPLETED' ? 'bg-blue-100 text-blue-700' :
                                            'bg-gray-100 text-gray-700'
                                    }`}>
                                    {event.status}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-6 max-w-4xl">
                {/* Progress Card */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="font-semibold text-gray-800">Team Assembly Progress</h2>
                        <span className="text-sm text-gray-500">{confirmedCount}/{totalItems} confirmed</span>
                    </div>
                    <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5 }}
                            className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full"
                        />
                    </div>

                    {rejectedItems.length > 0 && (
                        <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-100 flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                            <p className="text-sm text-red-700">
                                {rejectedItems.length} vendor(s) declined. Select replacements to complete your team.
                            </p>
                        </div>
                    )}
                </div>

                {/* Vendor Cards by Status */}
                <div className="space-y-6">
                    {/* Rejected Items - Show First */}
                    {rejectedItems.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold text-red-700 mb-3 flex items-center gap-2">
                                <XCircle className="w-5 h-5" />
                                Needs Replacement ({rejectedItems.length})
                            </h3>
                            <div className="space-y-3">
                                {rejectedItems.map((item) => (
                                    <VendorCard
                                        key={item.id}
                                        item={item}
                                        onRepair={() => setSelectedItemForRepair(item)}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Pending Items */}
                    {pendingItems.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold text-amber-700 mb-3 flex items-center gap-2">
                                <Clock className="w-5 h-5" />
                                Awaiting Response ({pendingItems.length})
                            </h3>
                            <div className="space-y-3">
                                {pendingItems.map((item) => (
                                    <VendorCard key={item.id} item={item} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Confirmed Items */}
                    {confirmedItems.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold text-emerald-700 mb-3 flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5" />
                                Confirmed ({confirmedItems.length})
                            </h3>
                            <div className="space-y-3">
                                {confirmedItems.map((item) => (
                                    <VendorCard key={item.id} item={item} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Empty State */}
                    {items.length === 0 && (
                        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
                            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">No vendors yet</h3>
                            <p className="text-gray-600 mb-6">Start building your team by browsing available vendors</p>
                            <Button
                                onClick={() => router.push('/explore?type=vendors')}
                                className="bg-[#4F0000] hover:bg-[#3A0000]"
                            >
                                Browse Vendors
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Repair Sheet */}
            <Sheet open={!!selectedItemForRepair} onOpenChange={(open) => !open && setSelectedItemForRepair(null)}>
                <SheetContent className="w-full sm:max-w-lg">
                    <SheetHeader>
                        <SheetTitle className="flex items-center gap-2">
                            <RefreshCw className="w-5 h-5 text-[#4F0000]" />
                            Find Replacement Vendor
                        </SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                        <div className="bg-red-50 border border-red-100 rounded-lg p-4 mb-6">
                            <p className="text-sm text-red-700">
                                The original vendor declined this booking. Select a new vendor to take their place.
                            </p>
                        </div>

                        <div className="relative mb-4">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search available vendors..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4F0000] focus:border-transparent"
                            />
                        </div>

                        {/* Vendor Results */}
                        <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                            {searchLoading ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="w-6 h-6 animate-spin text-[#4F0000]" />
                                    <span className="ml-2 text-gray-500">Searching vendors...</span>
                                </div>
                            ) : availableVendors.length === 0 ? (
                                <div className="text-center text-gray-500 py-8">
                                    <p>No vendors found</p>
                                    <p className="text-sm mt-1">Try a different search term</p>
                                </div>
                            ) : (
                                availableVendors.map((vendor) => (
                                    <div
                                        key={vendor.user_id}
                                        className={`p-4 bg-white rounded-xl border ${vendor.isAvailable
                                            ? 'border-gray-200 hover:border-[#4F0000]/50'
                                            : 'border-gray-100 opacity-60'
                                            } transition-all`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#4F0000] to-[#8B0000] flex items-center justify-center text-white font-bold flex-shrink-0">
                                                {vendor.company?.[0] || 'V'}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-semibold text-gray-800 truncate">{vendor.company}</h4>
                                                    {vendor.isAvailable ? (
                                                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs rounded-full">
                                                            Available
                                                        </span>
                                                    ) : (
                                                        <span className="px-2 py-0.5 bg-red-50 text-red-700 text-xs rounded-full">
                                                            Unavailable
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-500 truncate">{vendor.description || vendor.location || 'No description'}</p>
                                            </div>
                                            <Button
                                                size="sm"
                                                disabled={!vendor.isAvailable || replacingVendor}
                                                onClick={() => handleReplaceVendor(vendor.user_id, vendor)}
                                                className="bg-[#4F0000] hover:bg-[#3a0000] disabled:opacity-50 flex-shrink-0"
                                            >
                                                {replacingVendor ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    'Select'
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}

interface VendorCardProps {
    item: EventInquiryItem;
    onRepair?: () => void;
}

function VendorCard({ item, onRepair }: VendorCardProps) {
    const getStatusStyles = (status: InquiryStatus) => {
        switch (status) {
            case 'CONFIRMED':
            case 'ACCEPTED':
                return 'border-l-emerald-500 bg-emerald-50/50';
            case 'PENDING':
                return 'border-l-amber-500 bg-amber-50/50';
            case 'REJECTED':
                return 'border-l-red-500 bg-red-50/50';
            default:
                return 'border-l-gray-500 bg-gray-50/50';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-white rounded-xl border border-gray-100 border-l-4 ${getStatusStyles(item.status)} p-4`}
        >
            <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#4F0000] to-[#8B0000] flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {(item.vendor as any)?.company?.[0] || 'V'}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-800 truncate">
                        {(item.vendor as any)?.company || 'Vendor'}
                    </h4>
                    <p className="text-sm text-gray-500 truncate">
                        {(item.vendor as any)?.description || 'No description'}
                    </p>
                    {item.quoted_price && (
                        <p className="text-sm font-medium text-[#4F0000] mt-1">
                            ₹{Number(item.quoted_price).toLocaleString('en-IN')}
                        </p>
                    )}
                </div>

                {/* Status & Actions */}
                <div className="flex flex-col items-end gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.status === 'CONFIRMED' || item.status === 'ACCEPTED'
                        ? 'bg-emerald-100 text-emerald-700'
                        : item.status === 'PENDING'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                        {item.status}
                    </span>

                    {item.status === 'REJECTED' && onRepair && (
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={onRepair}
                            className="text-xs gap-1 border-red-200 text-red-700 hover:bg-red-50"
                        >
                            <RefreshCw className="w-3 h-3" />
                            Replace
                        </Button>
                    )}

                    {item.conversation_id && (
                        <Button
                            size="sm"
                            variant="ghost"
                            className="text-xs gap-1"
                        >
                            <MessageSquare className="w-3 h-3" />
                            Chat
                        </Button>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
