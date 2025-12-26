'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Search, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import VendorDropdown from './VendorDropdown';

interface HeaderProps {
    variant?: 'glassmorphic' | 'solid';
}

export default function Header({ variant = 'solid' }: HeaderProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    // Scroll detection
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Conditional styling based on variant and scroll state
    const headerStyles = isScrolled
        ? 'bg-white/95 backdrop-blur-md shadow-lg'
        : variant === 'glassmorphic'
            ? 'bg-transparent'
            : 'bg-white shadow-md';

    return (
        <header className={`top-0 w-full z-50 px-4 md:px-8 py-3 transition-all duration-300 ${headerStyles}`}>
            <div className="relative max-w-[1440px] mx-auto flex items-center justify-between h-14">
                {/* Left Section: Logo & Location */}
                <div className="flex items-center gap-4 md:gap-8">
                    {/* Logo */}
                    <Link href="/home" className="flex items-center justify-center">
                        <div className="relative w-24 h-8 md:w-28 md:h-10">
                            {isScrolled || variant === 'solid' ? (
                                <div
                                    className="w-full h-full bg-[#4F0000]"
                                    style={{
                                        maskImage: 'url(/Vector.svg)',
                                        maskSize: 'contain',
                                        maskRepeat: 'no-repeat',
                                        maskPosition: 'center',
                                        WebkitMaskImage: 'url(/Vector.svg)',
                                        WebkitMaskSize: 'contain',
                                        WebkitMaskRepeat: 'no-repeat',
                                        WebkitMaskPosition: 'center'
                                    }}
                                />
                            ) : (
                                <Image
                                    src="/Vector.svg"
                                    alt="DUTUK Logo"
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            )}
                        </div>
                    </Link>

                    {/* Location Selector (Desktop) */}
                    <div className="hidden md:flex items-center gap-3 pl-4 border-l border-gray-200">
                        <MapPin className={`w-6 h-6 transition-colors ${isScrolled || variant === 'solid' ? 'text-[#A0522D]' : 'text-white'}`} />
                        <div className="flex flex-col leading-none">
                            <span className={`font-poppins font-semibold text-xs transition-colors ${isScrolled || variant === 'solid' ? 'text-[#4F0000]' : 'text-white'}`}>Chennai</span>
                            <span className={`font-poppins font-medium text-xs transition-colors ${isScrolled || variant === 'solid' ? 'text-gray-600' : 'text-white/80'}`}>Tamil Nadu</span>
                        </div>
                    </div>
                </div>

                {/* Desktop Navigation & Actions */}
                <div className="hidden lg:flex items-center gap-8">
                    {/* Nav Links */}
                    <nav className="flex items-center gap-6">
                        <VendorDropdown isScrolled={isScrolled || variant === 'solid'} />
                        <NavLink href="/explore" isScrolled={isScrolled || variant === 'solid'}>Explore</NavLink>
                        <NavLink href="/events/list" isScrolled={isScrolled || variant === 'solid'}>Events</NavLink>
                        <NavLink href="/chat" isScrolled={isScrolled || variant === 'solid'}>Chat</NavLink>
                        <NavLink href="#" isScrolled={isScrolled || variant === 'solid'}>Packages</NavLink>
                    </nav>

                    {/* Search Bar with Glassmorphism - Optimized */}
                    <div className="relative flex items-center bg-gray-50 rounded-full px-4 py-1.5 w-64 shadow-sm border border-gray-200 transition-all focus-within:ring-2 focus-within:ring-[#A0522D]/30 focus-within:scale-[1.02]">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="flex-1 bg-transparent border-none outline-none text-sm text-[#4F0000] placeholder:text-gray-500 font-poppins px-1"
                        />
                        <button className="btn-gradient p-1.5 rounded-full transition-colors">
                            <Search className="w-3.5 h-3.5 text-white" />
                        </button>
                    </div>

                    {/* Login Link */}
                    <Link
                        href="/auth/sign-in"
                        className={`hidden md:block font-poppins font-medium text-sm transition-colors hover:opacity-80 ${isScrolled || variant === 'solid' ? 'text-[#4F0000]' : 'text-white'}`}
                    >
                        Login / Sign Up
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className={`md:hidden p-2 -mr-2 transition-colors ${isScrolled || variant === 'solid' ? 'text-[#4F0000]' : 'text-white'}`}
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
                        className="absolute top-full left-0 w-full bg-white/98 backdrop-blur-md border-t border-gray-200 lg:hidden overflow-hidden shadow-lg"
                    >
                        <div className="flex flex-col p-4 gap-2">
                            <MobileNavLink href="#">Vendors</MobileNavLink>
                            <MobileNavLink href="/explore">Explore</MobileNavLink>
                            <MobileNavLink href="/events/list">Events</MobileNavLink>
                            <MobileNavLink href="/chat">Chat</MobileNavLink>
                            <MobileNavLink href="#">Packages</MobileNavLink>
                            <div className="h-px bg-gray-200 my-2" />
                            <div className="flex items-center gap-3 px-4 py-2">
                                <MapPin className="text-[#A0522D] w-5 h-5" />
                                <div className="flex flex-col leading-none">
                                    <span className="font-poppins font-semibold text-xs text-[#4F0000]">Chennai</span>
                                    <span className="font-poppins font-medium text-xs text-gray-600">Tamil Nadu</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}

function NavLink({ href, children, isScrolled }: { href: string; children: React.ReactNode; isScrolled: boolean }) {
    return (
        <Link href={href} className="relative font-poppins font-medium text-sm transition-colors group py-2">
            <span className={`transition-colors ${isScrolled ? 'text-[#4F0000] group-hover:text-[#A0522D]' : 'text-white group-hover:text-white/80'}`}>{children}</span>
            <span className={`absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 ease-out group-hover:w-full ${isScrolled ? 'bg-[#A0522D]' : 'bg-white'}`} />
        </Link>
    );
}

function MobileNavLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <Link href={href} className="text-[#4F0000] py-3 px-4 hover:bg-gray-100 rounded-lg transition-colors font-poppins font-medium">
            {children}
        </Link>
    );
}
