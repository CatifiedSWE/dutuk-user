'use client';

import React from 'react';
import { Search, Building2, Calendar, Package } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HeroSection() {
    return (
        <section className="relative w-full min-h-[700px] lg:min-h-[800px] -mt-20 md:-mt-24 flex items-center justify-center overflow-hidden">
            {/* Background Image with Overlay */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: "linear-gradient(0deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/hero-bg.jpg')",
                }}
            />

            <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: { opacity: 0 },
                    visible: {
                        opacity: 1,
                        transition: {
                            staggerChildren: 0.2,
                            delayChildren: 0.3
                        }
                    }
                }}
                className="relative z-10 container mx-auto px-4 flex flex-col items-center justify-center gap-8 md:gap-10 pt-32 md:pt-40"
            >
                {/* Main Text Content */}
                <motion.div
                    variants={{
                        hidden: { opacity: 0, y: 30 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
                    }}
                    className="flex flex-col items-center gap-6 max-w-2xl text-center"
                >
                    <h1 className="font-poppins font-semibold text-3xl md:text-5xl lg:text-[56px] leading-tight md:leading-[1.2] text-white">
                        Let's make your next celebration unforgettable.
                    </h1>
                    <p className="font-urbanist font-medium text-lg md:text-xl text-stone-200 max-w-xl">
                        Explore work from the most talented and accomplished designers ready to take on your next project.
                    </p>
                </motion.div>

                {/* Search Bar - Floating Style */}
                <motion.div
                    variants={{
                        hidden: { opacity: 0, y: 30 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
                    }}
                    className="w-full max-w-[600px] relative group"
                >
                    <div className="relative flex items-center bg-white rounded-full p-2 pl-6 shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)]">
                        <input
                            type="text"
                            placeholder="What type of vendor you want?"
                            className="flex-1 bg-transparent border-none outline-none text-base md:text-lg text-[#4F0000] placeholder:text-gray-400 font-urbanist"
                        />
                        <button className="bg-[#7C2A2A] hover:bg-[#963e3e] text-white p-4 rounded-full transition-all duration-300 shadow-md transform group-hover:rotate-[-10deg] group-hover:scale-110 active:scale-95">
                            <Search className="w-6 h-6" />
                        </button>
                    </div>
                </motion.div>

                {/* Category Actions */}
                <motion.div
                    variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
                    }}
                    className="flex flex-wrap items-center justify-center gap-4"
                >
                    <ActionButton icon={Building2} label="Vendors" primary />
                    <ActionButton icon={Calendar} label="Events" />
                    <ActionButton icon={Package} label="Packages" />
                </motion.div>
            </motion.div>
        </section>
    );
}

function ActionButton({ icon: Icon, label, primary }: { icon: any, label: string, primary?: boolean }) {
    return (
        <motion.button
            whileHover={{ y: -5, scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center gap-3 px-6 py-3 rounded-full font-urbanist font-medium text-base shadow-lg transition-all ${primary
                    ? 'bg-white text-[#4F0000]'
                    : 'bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20'
                }`}
        >
            <Icon className="w-5 h-5" />
            {label}
        </motion.button>
    );
}
