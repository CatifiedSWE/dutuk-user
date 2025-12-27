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

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (isMenuOpen) {
            const scrollY = window.scrollY;
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';
            document.body.style.overflow = 'hidden';
        } else {
            const scrollY = document.body.style.top;
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            document.body.style.overflow = '';
            if (scrollY) {
                window.scrollTo(0, parseInt(scrollY || '0') * -1);
            }
        }
    }, [isMenuOpen]);

    // Conditional styling based on variant and scroll state
    const headerStyles = isScrolled
        ? 'bg-white/95 backdrop-blur-md shadow-lg'
        : variant === 'glassmorphic'
            ? 'bg-transparent'
            : 'bg-white shadow-md';

    return (
        <header className={`sticky top-0 w-full z-50 px-4 md:px-8 py-3 transition-all duration-300 ${headerStyles}`}>
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

            {/* Mobile Menu Dropdown - Full Screen */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 15, scale: 0.95, filter: 'blur(5px)' }}
                        animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, y: 15, scale: 0.95, filter: 'blur(5px)' }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        className="fixed inset-0 bg-white/90 backdrop-blur-xl lg:hidden z-40 overflow-hidden"
                    >
                        {/* Close Button */}
                        <div className="absolute top-6 right-6">
                            <button
                                onClick={() => setIsMenuOpen(false)}
                                className="p-3 rounded-full bg-[#4F0000]/10 hover:bg-[#4F0000]/20 transition-colors"
                                aria-label="Close menu"
                            >
                                <X className="w-6 h-6 text-[#4F0000]" />
                            </button>
                        </div>

                        <div className="flex flex-col p-8 gap-4 pt-24">
                            <MobileNavLink href="#" onClick={() => setIsMenuOpen(false)}>Vendors</MobileNavLink>
                            <MobileNavLink href="/explore" onClick={() => setIsMenuOpen(false)}>Explore</MobileNavLink>
                            <MobileNavLink href="/events/list" onClick={() => setIsMenuOpen(false)}>Events</MobileNavLink>
                            <MobileNavLink href="/chat" onClick={() => setIsMenuOpen(false)}>Chat</MobileNavLink>
                            <MobileNavLink href="#" onClick={() => setIsMenuOpen(false)}>Packages</MobileNavLink>
                            <div className="h-px bg-gray-200 my-4" />
                            <div className="flex items-center gap-3 px-4 py-3">
                                <MapPin className="text-[#A0522D] w-5 h-5" />
                                <div className="flex flex-col leading-none">
                                    <span className="font-poppins font-semibold text-sm text-[#4F0000]">Chennai</span>
                                    <span className="font-poppins font-medium text-sm text-gray-600">Tamil Nadu</span>
                                </div>
                            </div>
                            <div className="mt-4">
                                <Link
                                    href="/auth/sign-in"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="block text-center w-full py-3 px-6 bg-[#4F0000] text-white font-poppins font-medium text-base rounded-lg hover:bg-[#660000] transition-colors"
                                >
                                    Login / Sign Up
                                </Link>
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

function MobileNavLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick?: () => void }) {
    return (
        <Link href={href} onClick={onClick} className="text-[#4F0000] py-4 px-6 hover:bg-gray-100 rounded-xl transition-colors font-poppins font-medium text-lg">
            {children}
        </Link>
    );
}
