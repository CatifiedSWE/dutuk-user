'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Bell, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import MobileProfileMenu from './MobileProfileMenu';

export default function MobileTopNav() {
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const { user, isAuthenticated } = useAuth();

    return (
        <>
            {/* Top Navigation */}
            <nav className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
                <div className="flex items-center justify-between px-4 py-3">
                    {/* Profile Icon */}
                    <button
                        onClick={() => setIsProfileMenuOpen(true)}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                        aria-label="Profile"
                    >
                        {isAuthenticated ? (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7C2A2A] to-[#4F0000] flex items-center justify-center">
                                <User className="w-5 h-5 text-white" />
                            </div>
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                <User className="w-5 h-5 text-gray-600" />
                            </div>
                        )}
                    </button>

                    {/* Logo */}
                    <Link href="/home" className="flex items-center justify-center">
                        <div className="relative w-20 h-7">
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
                        </div>
                    </Link>

                    {/* Notifications Icon */}
                    <button
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors relative"
                        aria-label="Notifications"
                    >
                        <Bell className="w-6 h-6 text-[#4F0000]" />
                        {/* Notification Badge */}
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FFC13C] rounded-full border border-white"></span>
                    </button>
                </div>
            </nav>

            {/* Mobile Profile Menu */}
            <MobileProfileMenu
                isOpen={isProfileMenuOpen}
                onClose={() => setIsProfileMenuOpen(false)}
            />
        </>
    );
}
