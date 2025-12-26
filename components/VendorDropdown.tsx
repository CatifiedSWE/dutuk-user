'use client';

import React, { useState, useRef } from 'react';
import { ChevronDown, Camera, Video, Utensils, Palette, MapPin, Music, Brush, Disc } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const vendorCategories = [
    { name: 'Photographers', href: '/vendors/photographers', icon: Camera },
    { name: 'Videographers', href: '/vendors/videographers', icon: Video },
    { name: 'Caterers', href: '/vendors/caterers', icon: Utensils },
    { name: 'Decorators', href: '/vendors/decorators', icon: Palette },
    { name: 'Venues', href: '/vendors/venues', icon: MapPin },
    { name: 'Musicians', href: '/vendors/musicians', icon: Music },
    { name: 'Makeup Artists', href: '/vendors/makeup-artists', icon: Brush },
    { name: 'DJs', href: '/vendors/djs', icon: Disc },
];

export default function VendorDropdown({ isScrolled }: { isScrolled: boolean }) {
    const [isOpen, setIsOpen] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleMouseEnter = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setIsOpen(true);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setIsOpen(false);
        }, 150); // Small delay to prevent flickering
    };

    return (
        <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Trigger Button */}
            <button
                className={`flex items-center gap-1.5 transition-colors group py-2 ${isScrolled ? 'text-[#4F0000] hover:text-[#A0522D]' : 'text-white hover:text-white/80'}`}
                aria-expanded={isOpen}
            >
                <span className="font-poppins font-medium text-sm">Vendors</span>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <ChevronDown className="w-4 h-4" />
                </motion.div>
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 15, scale: 0.95, filter: 'blur(5px)' }}
                        animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, y: 15, scale: 0.95, filter: 'blur(5px)' }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        className="absolute top-full left-0 mt-0 w-64 bg-white/90 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-200/50 overflow-hidden z-50 p-2"
                    >
                        <div className="grid gap-1">
                            {vendorCategories.map((category, index) => (
                                <Link
                                    key={category.name}
                                    href={category.href}
                                    className="block"
                                >
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{
                                            duration: 0.3,
                                            delay: index * 0.05,
                                            type: 'spring',
                                            stiffness: 300,
                                            damping: 25
                                        }}
                                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#4F0000] hover:bg-[#FDF5E6] hover:text-[#7C2A2A] transition-all group"
                                    >
                                        <div className="p-1.5 rounded-md bg-[#4F0000]/5 group-hover:bg-[#FFC13C]/20 transition-colors">
                                            <category.icon className="w-4 h-4" />
                                        </div>
                                        <span className="font-poppins text-sm font-medium">{category.name}</span>
                                    </motion.div>
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
