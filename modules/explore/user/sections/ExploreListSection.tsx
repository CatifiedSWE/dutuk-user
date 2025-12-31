'use client';

import React, { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Star, Heart, Calendar } from 'lucide-react';
import SectionHeader from '@/components/SectionHeader';
import { useVendors } from '@/hooks/useVendors';
import { useVendorServices } from '@/hooks/useVendorServices';
import { useEvents } from '@/hooks/useEvents';
import { LoadingGrid, LoadingEventCard } from '@/components/LoadingCard';
import { ErrorMessage, EmptyState } from '@/components/ErrorMessage';

interface ExploreListSectionProps {
    selectedFilter: 'All' | 'Vendors' | 'Events' | 'Packages';
    searchQuery: string;
}

export default function ExploreListSection({ selectedFilter, searchQuery }: ExploreListSectionProps) {
    // Fetch vendors from Supabase
    const { vendors, loading: vendorsLoading, error: vendorsError } = useVendors({ 
        searchQuery: searchQuery || undefined 
    });
    
    // Fetch services/packages from Supabase
    const { services, loading: servicesLoading, error: servicesError } = useVendorServices({ 
        serviceType: selectedFilter === 'Packages' ? 'package' : undefined 
    });
    
    // Fetch events from Supabase - NEW
    const { events, loading: eventsLoading, error: eventsError } = useEvents({
        searchQuery: searchQuery || undefined
    });
    
    const loading = vendorsLoading || servicesLoading || eventsLoading;
    const error = vendorsError || servicesError || eventsError;
    
    // Filter data based on selected filter
    const filteredData = useMemo(() => {
        const results: any[] = [];
        
        // Add vendors if filter matches
        if (selectedFilter === 'All' || selectedFilter === 'Vendors') {
            const vendorItems = vendors.map(vendor => ({
                id: vendor.id,
                type: 'vendor',
                name: vendor.company,
                location: vendor.service_area || 'Chennai',
                rating: vendor.avg_rating || 4.5,
                image: vendor.logo_url || 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=600&h=600&fit=crop&q=75',
                vendorId: vendor.id,
                vendorAvatar: vendor.logo_url,
                category: vendor.category
            }));
            results.push(...vendorItems);
        }
        
        // Add packages/services if filter matches
        if (selectedFilter === 'All' || selectedFilter === 'Packages') {
            const serviceItems = services
                .filter(service => service.price_type === 'fixed') // Treat fixed-price services as packages
                .map(service => ({
                    id: service.id,
                    type: 'package',
                    name: service.service_name,
                    location: 'Chennai', // Default location
                    rating: 4.5, // Default rating
                    price: `₹ ${service.base_price.toLocaleString()}`,
                    image: service.featured_image || 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&h=600&fit=crop&q=75',
                    serviceId: service.id
                }));
            results.push(...serviceItems);
        }
        
        // Add events if filter matches - NEW
        if (selectedFilter === 'All' || selectedFilter === 'Events') {
            const eventItems = events.map(event => ({
                id: event.id,
                type: 'event',
                name: event.event, // 'event' field is the event name/title in Supabase
                location: 'Chennai', // Default location
                description: event.description,
                companyName: event.company_name,
                dates: event.date, // Array of dates
                startDate: event.start_date,
                endDate: event.end_date,
                price: event.payment > 0 ? `₹ ${event.payment.toLocaleString()}` : 'Contact for pricing',
                status: event.status,
                image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&h=600&fit=crop&q=75', // Default event image
                rating: 4.5 // Default rating
            }));
            results.push(...eventItems);
        }
        
        return results;
    }, [selectedFilter, vendors, services, events]);
    
    // Get display text for filter
    const filterDisplayText = selectedFilter === 'All' ? 'Results' : selectedFilter;
    
    // Show loading state
    if (loading) {
        return (
            <section className="w-full flex flex-col gap-10">
                <SectionHeader
                    label="CURATED SELECTION"
                    titleMain="Discover"
                    titleAccent={filterDisplayText}
                    subtitle={`Browse through our curated selection of ${filterDisplayText.toLowerCase()}`}
                />
                <LoadingGrid count={8} />
            </section>
        );
    }
    
    // Show error state
    if (error) {
        return (
            <section className="w-full flex flex-col gap-10">
                <SectionHeader
                    label="CURATED SELECTION"
                    titleMain="Discover"
                    titleAccent={filterDisplayText}
                    subtitle={`Browse through our curated selection of ${filterDisplayText.toLowerCase()}`}
                />
                <ErrorMessage message="Failed to load data. Please try again later." />
            </section>
        );
    }

    return (
        <section className="w-full flex flex-col gap-10">
            {/* Header */}
            <SectionHeader
                label="CURATED SELECTION"
                titleMain="Discover"
                titleAccent={filterDisplayText}
                subtitle={`Browse through our curated selection of ${filterDisplayText.toLowerCase()}`}
            />

            {/* Items Grid */}
            {filteredData.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {filteredData.map((item, index) => (
                        item.type === 'event' ? (
                            // Event Card Design (keeping original design for events)
                            <Link
                                href={`/events/details/${item.id}`}
                                key={item.id}
                                className="flex flex-col bg-white rounded-3xl shadow-lg shadow-[#4F0000]/5 hover:shadow-xl hover:shadow-[#4F0000]/10 transition-all duration-300 cursor-pointer animate-fadeInUp overflow-hidden"
                                style={{ animationDelay: `${index * 0.05}s` }}
                            >
                                <div className="relative h-64 overflow-hidden">
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        className="object-cover"
                                        loading="lazy"
                                    />
                                    <button className="absolute top-4 right-4 bg-white p-2.5 rounded-full shadow-lg hover:scale-110 transition-transform">
                                        <Heart className="w-5 h-5 text-[#7C2A2A]" />
                                    </button>
                                </div>
                                <div className="p-5 flex flex-col gap-4">
                                    <h3 className="font-poppins font-bold text-xl text-[#4F0000]">
                                        {item.name}
                                    </h3>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-[#4F0000]/70">
                                            <MapPin className="w-4 h-4" />
                                            <span className="font-urbanist text-sm">{item.location}</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ) : (
                            // Vendor/Package Card Design
                            <Link
                                href={item.type === 'vendor' ? `/vendors/profile/${item.vendorId || item.id}` : '#'}
                                key={item.id}
                                className="flex flex-col bg-white rounded-[32px] shadow-lg shadow-[#4F0000]/5 hover:shadow-xl hover:shadow-[#4F0000]/10 transition-all duration-300 cursor-pointer animate-fadeInUp overflow-hidden"
                                style={{ animationDelay: `${index * 0.05}s` }}
                            >
                                {/* Vendor Image with Avatar Overlay */}
                                <div className="relative h-72 overflow-hidden">
                                    <div className="absolute inset-0 m-4">
                                        <div className="relative w-full h-full rounded-[28px] overflow-hidden">
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                                className="object-cover"
                                                loading="lazy"
                                            />
                                        </div>
                                    </div>
                                    {/* Heart Icon */}
                                    <button className="absolute top-6 right-6 bg-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform z-10">
                                        <Heart className="w-5 h-5 text-[#7C2A2A] fill-[#7C2A2A]" />
                                    </button>
                                    {/* Vendor Avatar Overlay (only for vendors) */}
                                    {item.type === 'vendor' && item.vendorAvatar && (
                                        <div className="absolute bottom-2 left-6 w-32 h-32 rounded-full overflow-hidden border-[6px] border-white z-10">
                                            <Image
                                                src={item.vendorAvatar}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Vendor Details */}
                                <div className="px-6 pb-6 pt-2 flex flex-col gap-2">
                                    {/* Vendor Name and Rating */}
                                    <div className="flex items-start justify-between gap-2">
                                        <h3 className="font-poppins font-bold text-2xl text-[#4F0000] leading-tight">
                                            {item.name}
                                        </h3>
                                        <div className="flex items-center gap-1 flex-shrink-0">
                                            <Star className="w-6 h-6 fill-[#FFC13C] text-[#FFC13C]" />
                                            <span className="font-urbanist font-bold text-xl text-[#4F0000]">{item.rating.toFixed(1)}</span>
                                        </div>
                                    </div>

                                    {/* Location */}
                                    <div className="flex items-center gap-2 text-[#4F0000]/60 mt-1">
                                        <MapPin className="w-5 h-5" />
                                        <span className="font-urbanist text-base">{item.location}</span>
                                    </div>

                                    {/* Price/Category */}
                                    <div className="font-poppins font-bold text-xl text-[#4F0000] mt-3">
                                        {item.price || item.category || 'Contact for pricing'}
                                    </div>
                                </div>
                            </Link>
                        )
                    ))}
                </div>
            ) : (
                <EmptyState message={`No ${filterDisplayText.toLowerCase()} found. Try a different filter or search term.`} />
            )}
        </section>
    );
}
