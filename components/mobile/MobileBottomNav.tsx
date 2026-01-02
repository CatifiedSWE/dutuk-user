'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, MessageCircle } from 'lucide-react';

export default function MobileBottomNav() {
    const pathname = usePathname();

    const navItems = [
        {
            name: 'Home',
            href: '/home',
            icon: Home,
            isActive: pathname === '/home' || pathname === '/'
        },
        {
            name: 'Explore',
            href: '/explore',
            icon: Search,
            isActive: pathname === '/explore'
        },
        {
            name: 'Chat',
            href: '/chat',
            icon: MessageCircle,
            isActive: pathname === '/chat'
        }
    ];

    return (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200">
            <div className="flex items-center justify-around px-2 py-3">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="flex flex-col items-center justify-center gap-1 py-2 px-6 transition-all duration-200"
                        >
                            <Icon 
                                className={`w-6 h-6 ${
                                    item.isActive
                                        ? 'text-[#7C2A2A]'
                                        : 'text-gray-400'
                                }`}
                                strokeWidth={item.isActive ? 2.5 : 2}
                            />
                            <span className={`text-xs ${
                                item.isActive
                                    ? 'text-[#7C2A2A] font-semibold'
                                    : 'text-gray-500 font-medium'
                            }`}>
                                {item.name}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
