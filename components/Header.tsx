'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Search, ChevronDown, MapPin } from 'lucide-react';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 w-full z-50 px-4 md:px-8 py-3 transition-all duration-300 navbar-gradient-border">
            {/* Glassmorphism Background */}
            <div className="absolute inset-0 bg-[#270100]/40 backdrop-blur-xl backdrop-saturate-150 -z-10" />

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
                        <button className="flex items-center gap-1.5 text-white hover:text-[#FFC13C] transition-colors group">
                            <span className="font-poppins font-medium text-sm">Vendors</span>
                            <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform" />
                        </button>
                        <Link href="#" className="font-poppins font-medium text-sm text-white hover:text-[#FFC13C] transition-colors">
                            Events
                        </Link>
                        <Link href="#" className="font-poppins font-medium text-sm text-white hover:text-[#FFC13C] transition-colors">
                            Packages
                        </Link>
                    </nav>

                    {/* Search Bar with Glassmorphism */}
                    <div className="relative flex items-center bg-white/90 backdrop-blur-md rounded-full px-4 py-1.5 w-64 shadow-xl border border-white/20">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="flex-1 bg-transparent border-none outline-none text-sm text-[#1B0F11] placeholder:text-gray-400 font-poppins"
                        />
                        <button className="bg-[#270100] p-1.5 rounded-full hover:bg-[#4F0000] transition-colors">
                            <Search className="w-3.5 h-3.5 text-white" />
                        </button>
                    </div>

                    {/* Login / Profile */}
                    <Link href="/login" className="font-poppins font-medium text-sm text-white hover:text-[#FFC13C] transition-colors">
                        Login / Sign in
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="lg:hidden p-2 text-white"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMenuOpen && (
                <div className="absolute top-full left-0 w-full bg-[#270100]/95 backdrop-blur-xl border-t border-white/10 lg:hidden flex flex-col p-4 gap-4 animate-in slide-in-from-top-2">
                    <Link href="#" className="text-white py-2 px-4 hover:bg-white/10 rounded-lg">Vendors</Link>
                    <Link href="#" className="text-white py-2 px-4 hover:bg-white/10 rounded-lg">Events</Link>
                    <Link href="#" className="text-white py-2 px-4 hover:bg-white/10 rounded-lg">Packages</Link>
                    <div className="h-px bg-white/20 my-2" />
                    <div className="flex items-center gap-3 px-4 py-2">
                        <MapPin className="text-[#FFC13C] w-5 h-5" />
                        <div className="flex flex-col leading-none">
                            <span className="font-poppins font-semibold text-xs text-white">Chennai</span>
                            <span className="font-poppins font-medium text-xs text-stone-300">Tamil Nadu</span>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
