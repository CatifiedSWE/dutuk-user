'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Search, Sparkles, Users, Calendar, ArrowRight, Wand2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function EventsEntryPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-amber-50">
            {/* Header */}
            <div className="container mx-auto px-4 pt-8 pb-4">
                <div className="text-center mb-8">
                    <h1 className="font-['Playfair_Display'] text-4xl md:text-5xl lg:text-6xl font-bold text-[#4F0000] mb-4">
                        Plan Your Perfect Event
                    </h1>
                    <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
                        Whether you want to explore vendors yourself or let us curate the perfect team for you
                    </p>
                </div>
            </div>

            {/* Split View Cards */}
            <div className="container mx-auto px-4 pb-16">
                <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-6xl mx-auto">

                    {/* Option 1: Browse Manually */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="group"
                    >
                        <div
                            onClick={() => router.push('/explore?type=vendors')}
                            className="relative h-full min-h-[400px] rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl border border-gray-200 bg-white"
                        >
                            {/* Background Pattern */}
                            <div className="absolute inset-0 opacity-5">
                                <div className="absolute inset-0" style={{
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234F0000' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                                }} />
                            </div>

                            <div className="relative z-10 p-8 lg:p-10 h-full flex flex-col">
                                {/* Icon */}
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#4F0000] to-[#8B0000] flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                    <Search className="w-8 h-8 text-white" />
                                </div>

                                {/* Content */}
                                <h2 className="text-2xl lg:text-3xl font-bold text-[#4F0000] mb-4">
                                    Browse Vendors Manually
                                </h2>
                                <p className="text-gray-600 mb-6 flex-grow">
                                    Take your time exploring our curated collection of vendors. Filter by category,
                                    location, and ratings. Compare prices and portfolios at your own pace.
                                </p>

                                {/* Features */}
                                <div className="space-y-3 mb-8">
                                    <FeatureItem icon={Users} text="Explore 500+ verified vendors" />
                                    <FeatureItem icon={Search} text="Advanced filters & search" />
                                    <FeatureItem icon={Sparkles} text="View portfolios & reviews" />
                                </div>

                                {/* CTA */}
                                <div className="flex items-center gap-2 text-[#4F0000] font-semibold group-hover:gap-4 transition-all duration-300">
                                    <span>Start Exploring</span>
                                    <ArrowRight className="w-5 h-5" />
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Option 2: Plan My Event (Wizard) */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="group"
                    >
                        <div
                            onClick={() => router.push('/events/plan')}
                            className="relative h-full min-h-[400px] rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl bg-gradient-to-br from-[#4F0000] via-[#6B0000] to-[#8B0000]"
                        >
                            {/* Decorative Elements */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

                            {/* Sparkle Effects */}
                            <div className="absolute top-20 right-20 w-2 h-2 bg-yellow-300 rounded-full animate-pulse" />
                            <div className="absolute top-40 right-10 w-1.5 h-1.5 bg-yellow-200 rounded-full animate-pulse delay-300" />
                            <div className="absolute bottom-32 right-24 w-1 h-1 bg-yellow-100 rounded-full animate-pulse delay-500" />

                            <div className="relative z-10 p-8 lg:p-10 h-full flex flex-col">
                                {/* Icon */}
                                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300 border border-white/30">
                                    <Wand2 className="w-8 h-8 text-white" />
                                </div>

                                {/* Badge */}
                                <div className="inline-flex items-center gap-2 bg-yellow-400/20 text-yellow-200 text-sm font-medium px-3 py-1 rounded-full w-fit mb-4 border border-yellow-400/30">
                                    <Sparkles className="w-4 h-4" />
                                    Recommended
                                </div>

                                {/* Content */}
                                <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">
                                    Plan My Event
                                </h2>
                                <p className="text-rose-100 mb-6 flex-grow">
                                    Tell us about your event, and we'll instantly match you with the best available
                                    vendors that fit your budget and date. Build your dream team in minutes!
                                </p>

                                {/* Features */}
                                <div className="space-y-3 mb-8">
                                    <FeatureItem icon={Calendar} text="Check real-time availability" light />
                                    <FeatureItem icon={Sparkles} text="AI-powered recommendations" light />
                                    <FeatureItem icon={Users} text="One-click bundle booking" light />
                                </div>

                                {/* CTA */}
                                <div className="flex items-center gap-2 text-white font-semibold group-hover:gap-4 transition-all duration-300">
                                    <span>Start Planning</span>
                                    <ArrowRight className="w-5 h-5" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Bottom Info */}
                <div className="text-center mt-12 text-gray-500">
                    <p>Not sure? You can always switch between approaches anytime.</p>
                </div>
            </div>
        </div>
    );
}

function FeatureItem({ icon: Icon, text, light }: { icon: any; text: string; light?: boolean }) {
    return (
        <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${light ? 'bg-white/10' : 'bg-[#4F0000]/10'
                }`}>
                <Icon className={`w-4 h-4 ${light ? 'text-rose-200' : 'text-[#4F0000]'}`} />
            </div>
            <span className={light ? 'text-rose-100' : 'text-gray-600'}>{text}</span>
        </div>
    );
}
