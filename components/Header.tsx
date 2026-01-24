'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, MapPin, User, LogOut, Bell, MessageCircle, CheckCircle, XCircle } from 'lucide-react';
import VendorDropdown from './VendorDropdown';
import { useAuth } from '@/hooks/useAuth';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';
import { signOut } from '@/lib/auth/customer-auth';
import { useRouter } from 'next/navigation';
import { useNotifications } from '@/hooks/useNotifications';

interface HeaderProps {
    variant?: 'glassmorphic' | 'solid';
}

export default function Header({ variant = 'solid' }: HeaderProps) {
    const [isScrolled, setIsScrolled] = useState(false);
    const { user, loading, isAuthenticated } = useAuth();
    const { redirectToLogin } = useAuthRedirect();
    const router = useRouter();
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
    const [showNotifications, setShowNotifications] = useState(false);
    const notificationRef = useRef<HTMLDivElement>(null);

    // Click outside handler
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setShowNotifications(false);
            }
        }

        if (showNotifications) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showNotifications]);

    // Handle logout
    const handleLogout = async () => {
        try {
            await signOut();
            router.push('/home');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

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
        <header className={`hidden lg:block sticky top-0 w-full z-50 px-4 md:px-8 py-3 transition-all duration-300 ${headerStyles}`}>
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
                        <NavLink href="/events" isScrolled={isScrolled || variant === 'solid'}>Events</NavLink>
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
                    {!loading && (
                        <>
                            {isAuthenticated ? (
                                <div className="flex items-center gap-3">
                                    {/* Notification Bell */}
                                    <div className="relative" ref={notificationRef}>
                                        <button
                                            onClick={() => setShowNotifications(!showNotifications)}
                                            className={`relative p-2 rounded-full transition-colors hover:bg-black/10 ${isScrolled || variant === 'solid' ? 'text-[#4F0000]' : 'text-white'}`}
                                        >
                                            <Bell className="w-5 h-5" />
                                            {unreadCount > 0 && (
                                                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold text-white bg-red-500 rounded-full px-1">
                                                    {unreadCount > 9 ? '9+' : unreadCount}
                                                </span>
                                            )}
                                        </button>

                                        {/* Notification Dropdown */}
                                        {showNotifications && (
                                            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                                                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                                                    <h3 className="font-semibold text-gray-800">Notifications</h3>
                                                    {unreadCount > 0 && (
                                                        <button
                                                            onClick={() => markAllAsRead()}
                                                            className="text-xs text-[#7C2A2A] hover:underline"
                                                        >
                                                            Mark all as read
                                                        </button>
                                                    )}
                                                </div>
                                                <div className="max-h-[300px] overflow-y-auto">
                                                    {notifications.length === 0 ? (
                                                        <div className="p-6 text-center text-gray-500">
                                                            <Bell className="w-8 h-8 mx-auto mb-2 opacity-40" />
                                                            <p className="text-sm">No notifications yet</p>
                                                        </div>
                                                    ) : (
                                                        notifications.slice(0, 5).map((notif) => (
                                                            <Link
                                                                key={notif.id}
                                                                href={notif.link || '#'}
                                                                onClick={() => {
                                                                    markAsRead(notif.id);
                                                                    setShowNotifications(false);
                                                                }}
                                                                className={`block p-4 hover:bg-gray-50 border-b border-gray-50 transition-colors ${!notif.read ? 'bg-amber-50/50' : ''}`}
                                                            >
                                                                <div className="flex items-start gap-3">
                                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${notif.type === 'message' ? 'bg-blue-100 text-blue-600' :
                                                                        notif.type === 'booking_accepted' ? 'bg-green-100 text-green-600' :
                                                                            'bg-red-100 text-red-600'
                                                                        }`}>
                                                                        {notif.type === 'message' ? <MessageCircle className="w-4 h-4" /> :
                                                                            notif.type === 'booking_accepted' ? <CheckCircle className="w-4 h-4" /> :
                                                                                <XCircle className="w-4 h-4" />}
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <p className="text-sm font-medium text-gray-800 truncate">{notif.title}</p>
                                                                        <p className="text-xs text-gray-500 line-clamp-2">{notif.message}</p>
                                                                    </div>
                                                                    {!notif.read && (
                                                                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                                                                    )}
                                                                </div>
                                                            </Link>
                                                        ))
                                                    )}
                                                </div>
                                                {notifications.length > 5 && (
                                                    <Link
                                                        href="/chat"
                                                        onClick={() => setShowNotifications(false)}
                                                        className="block p-3 text-center text-sm text-[#7C2A2A] hover:bg-gray-50 border-t border-gray-100"
                                                    >
                                                        View all messages
                                                    </Link>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <Link
                                        href="/profile/overview"
                                        className={`hidden md:flex items-center gap-2 font-poppins font-medium text-sm transition-colors hover:opacity-80 ${isScrolled || variant === 'solid' ? 'text-[#4F0000]' : 'text-white'}`}
                                    >
                                        <User className="w-4 h-4" />
                                        Profile
                                    </Link>
                                    <Link
                                        href="/bookings"
                                        className={`hidden md:flex items-center gap-2 font-poppins font-medium text-sm transition-colors hover:opacity-80 ${isScrolled || variant === 'solid' ? 'text-[#4F0000]' : 'text-white'}`}
                                    >
                                        My Bookings
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className={`hidden md:flex items-center gap-2 font-poppins font-medium text-sm transition-colors hover:opacity-80 ${isScrolled || variant === 'solid' ? 'text-[#4F0000]' : 'text-white'}`}
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={redirectToLogin}
                                    className={`hidden md:block font-poppins font-medium text-sm transition-colors hover:opacity-80 cursor-pointer ${isScrolled || variant === 'solid' ? 'text-[#4F0000]' : 'text-white'}`}
                                >
                                    Login / Sign Up
                                </button>
                            )}
                        </>
                    )}
                </div>

            </div>
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
