'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Search, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import VendorDropdown from './VendorDropdown';

interface HeaderProps {
    variant?: 'glassmorphic' | 'solid';
}

export default function Header({ variant = 'solid' }: HeaderProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Conditional styling based on variant - Optimized for performance
    const headerStyles = variant === 'glassmorphic'
        ? 'bg-[#270100]/80 backdrop-blur-md shadow-lg'
        : 'bg-[#270100] shadow-md';

    return (
        <header className={`top-0 w-full z-50 px-4 md:px-8 py-3 transition-all duration-300 navbar-gradient-border ${headerStyles}`}>
            <div className="relative max-w-[1440px] mx-auto flex items-center justify-between h-14">
                {/* Left Section: Logo & Location */}
                <div className="flex items-center gap-4 md:gap-8">
                    {/* Logo */}
                    <Link href="/home" className="flex items-center justify-center border border-[#FDF5E6] bg-[#FDF5E6] px-4 py-1">
                        <span className="font-poppins font-semibold text-lg md:text-xl text-[#4F0000] tracking-wide">
                            DUTUK
                        </span>
                    </Link>

                    {/* Location Selector (Desktop) */}
                    <div className="hidden md:flex items-center gap-3 pl-4 border-l border-white/20">
                        <MapPin className="text-[#FFC13C] w-6 h-6" />
                        <div className="flex flex-col leading-none">
                            <span className="font-poppins font-semibold text-xs text-white">Chennai</span>
                            <span className="font-poppins font-medium text-xs text-stone-300">Tamil Nadu</span>
                        </div>
                    </div>
                </div>

                {/* Desktop Navigation & Actions */}
                <div className="hidden lg:flex items-center gap-8">
                    {/* Nav Links */}
                    <nav className="flex items-center gap-6">
                        <VendorDropdown />
                        <NavLink href="/explore">Explore</NavLink>
                        <NavLink href="/events/list">Events</NavLink>
                        <NavLink href="#">Packages</NavLink>
                    </nav>

                    {/* Search Bar with Glassmorphism - Optimized */}
                    <div className="relative flex items-center bg-white/95 rounded-full px-4 py-1.5 w-64 shadow-lg border border-white/20 transition-all focus-within:ring-2 focus-within:ring-[#FFC13C]/50 focus-within:scale-[1.02]">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="flex-1 bg-transparent border-none outline-none text-sm text-[#1B0F11] placeholder:text-gray-500 font-poppins px-1"
                        />
                        <button className="bg-[#270100] p-1.5 rounded-full hover:bg-[#4F0000] transition-colors">
                            <Search className="w-3.5 h-3.5 text-white" />
                        </button>
                    </div>

                    {/* Login / Profile */}
                    <Link href="/login" className="font-poppins font-medium text-sm text-white hover:text-[#FFC13C] transition-colors relative group">
                        Login / Sign in
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#FFC13C] transition-all group-hover:w-full" />
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="lg:hidden p-2 text-white hover:bg-white/10 rounded-full transition-colors"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <AnimatePresence mode="wait">
                        {isMenuOpen ? (
                            <motion.div
                                key="close"
                                initial={{ rotate: -90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: 90, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <X />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="menu"
                                initial={{ rotate: 90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: -90, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Menu />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </button>
            </div>

            {/* Mobile Menu Dropdown */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="absolute top-full left-0 w-full bg-[#270100]/95 backdrop-blur-md border-t border-white/10 lg:hidden overflow-hidden"
                    >
                        <div className="flex flex-col p-4 gap-2">
                            <MobileNavLink href="#">Vendors</MobileNavLink>
                            <MobileNavLink href="/explore">Explore</MobileNavLink>
                            <MobileNavLink href="/events/list">Events</MobileNavLink>
                            <MobileNavLink href="#">Packages</MobileNavLink>
                            <div className="h-px bg-white/10 my-2" />
                            <div className="flex items-center gap-3 px-4 py-2">
                                <MapPin className="text-[#FFC13C] w-5 h-5" />
                                <div className="flex flex-col leading-none">
                                    <span className="font-poppins font-semibold text-xs text-white">Chennai</span>
                                    <span className="font-poppins font-medium text-xs text-stone-300">Tamil Nadu</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <Link href={href} className="relative font-poppins font-medium text-sm text-white transition-colors group py-2">
            <span className="group-hover:text-[#FFC13C] transition-colors">{children}</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FFC13C] transition-all duration-300 ease-out group-hover:w-full" />
        </Link>
    );
}

function MobileNavLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <Link href={href} className="text-white py-3 px-4 hover:bg-white/10 rounded-lg transition-colors font-poppins font-medium">
            {children}
        </Link>
    );
}
