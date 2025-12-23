'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Search, ChevronDown, MapPin } from 'lucide-react';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="fixed top-0 w-full z-50 px-4 md:px-8 py-3 transition-all duration-300">
            <div className="absolute inset-0 bg-[#270100]/30 backdrop-blur-md" />

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

                    {/* Search Bar */}
                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2">
                        <Search className="w-4 h-4 text-white/70" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="bg-transparent border-none outline-none text-sm text-white placeholder:text-white/50 w-32"
                        />
                    </div>

                    {/* Auth Buttons */}
                    <div className="flex items-center gap-3">
                        <Link
                            href="/login"
                            className="font-poppins font-medium text-sm text-white hover:text-[#FFC13C] transition-colors"
                        >
                            Login
                        </Link>
                        <Link
                            href="/signup"
                            className="bg-[#FFC13C] text-[#4F0000] px-6 py-2 rounded-full font-poppins font-semibold text-sm hover:bg-[#e6ac34] transition-colors shadow-md"
                        >
                            Sign Up
                        </Link>
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="lg:hidden p-2 text-white hover:text-[#FFC13C] transition-colors"
                >
                    {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="lg:hidden absolute top-full left-0 right-0 mt-2 mx-4 bg-[#270100]/95 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden">
                    <nav className="flex flex-col p-4">
                        <Link href="#" className="font-poppins font-medium text-sm text-white hover:text-[#FFC13C] transition-colors py-3 border-b border-white/10">
                            Vendors
                        </Link>
                        <Link href="#" className="font-poppins font-medium text-sm text-white hover:text-[#FFC13C] transition-colors py-3 border-b border-white/10">
                            Events
                        </Link>
                        <Link href="#" className="font-poppins font-medium text-sm text-white hover:text-[#FFC13C] transition-colors py-3 border-b border-white/10">
                            Packages
                        </Link>
                        <Link href="/login" className="font-poppins font-medium text-sm text-white hover:text-[#FFC13C] transition-colors py-3 border-b border-white/10">
                            Login
                        </Link>
                        <Link href="/signup" className="font-poppins font-medium text-sm text-[#FFC13C] hover:text-white transition-colors py-3">
                            Sign Up
                        </Link>
                    </nav>
                </div>
            )}
        </header>
    );
}
