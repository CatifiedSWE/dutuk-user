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
            <div className="flex items-center justify-around px-2 py-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex flex-col items-center justify-center gap-1 py-2 px-6 rounded-xl transition-all duration-200 ${
                                item.isActive
                                    ? 'bg-[#7C2A2A] text-white'
                                    : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            <Icon className="w-6 h-6" strokeWidth={item.isActive ? 2.5 : 2} />
                            <span className={`text-xs font-medium ${
                                item.isActive ? 'font-semibold' : ''
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
