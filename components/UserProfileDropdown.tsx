'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Calendar, LogOut, ChevronDown } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';
import { getCustomerProfile, signOut } from '@/lib/auth/customer-auth';

interface UserProfileDropdownProps {
    isScrolled?: boolean;
    variant?: 'glassmorphic' | 'solid';
}

export default function UserProfileDropdown({ isScrolled, variant }: UserProfileDropdownProps) {
    const router = useRouter();
    const { user } = useAuth();
    const [profileAvatar, setProfileAvatar] = useState<string | null>(null);
    const [fullName, setFullName] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const profile = await getCustomerProfile();
                setProfileAvatar(profile?.avatar_url || null);
                setFullName(profile?.full_name || null);
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };

        if (user) {
            fetchProfile();
        }
    }, [user]);

    const handleLogout = async () => {
        try {
            await signOut();
            router.push('/home');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    // Priority: Google Auth avatar > uploaded avatar
    const displayAvatar = user?.user_metadata?.avatar_url || profileAvatar;

    // Priority: Customer profile name > Google auth name > email
    const displayName = fullName || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';

    // Get initials for fallback
    const initials = displayName
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    const textColor = isScrolled || variant === 'solid' ? 'text-[#4F0000]' : 'text-white';
    const hoverBg = isScrolled || variant === 'solid' ? 'hover:bg-[#4F0000]/5' : 'hover:bg-white/10';

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    className={`hidden md:flex items-center gap-2 py-1.5 px-3 rounded-full ${hoverBg} transition-all duration-200 group`}
                >
                    <Avatar className="h-9 w-9 ring-2 ring-white/20 group-hover:ring-white/40 transition-all duration-200">
                        {displayAvatar ? (
                            <AvatarImage src={displayAvatar} alt={displayName} className="object-cover" />
                        ) : null}
                        <AvatarFallback className="bg-gradient-to-br from-[#7C2A2A] to-[#4F0000] text-white text-sm font-semibold">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                    <ChevronDown className={`w-4 h-4 ${textColor} transition-transform group-data-[state=open]:rotate-180 duration-200`} />
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                className="w-64 bg-white/95 backdrop-blur-xl border-gray-200/50 shadow-2xl rounded-2xl p-2"
                align="end"
                sideOffset={8}
            >
                {/* User Info Header */}
                <DropdownMenuLabel className="p-3">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12 ring-2 ring-[#7C2A2A]/20">
                            {displayAvatar ? (
                                <AvatarImage src={displayAvatar} alt={displayName} className="object-cover" />
                            ) : null}
                            <AvatarFallback className="bg-gradient-to-br from-[#7C2A2A] to-[#4F0000] text-white font-semibold">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <p className="font-display text-sm font-bold text-gray-900 truncate">
                                {displayName}
                            </p>
                            <p className="font-poppins text-xs text-gray-500 truncate">
                                {user?.email}
                            </p>
                        </div>
                    </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator className="bg-gray-200/70" />

                {/* Menu Items */}
                <div className="py-1">
                    <DropdownMenuItem asChild className="cursor-pointer rounded-lg px-3 py-2.5 hover:bg-[#7C2A2A]/5 focus:bg-[#7C2A2A]/5 transition-colors">
                        <Link href="/profile/overview" className="flex items-center gap-2">
                            <User className="w-4 h-4 text-[#7C2A2A]" />
                            <span className="font-poppins text-sm font-medium text-gray-700">My Profile</span>
                        </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild className="cursor-pointer rounded-lg px-3 py-2.5 hover:bg-[#7C2A2A]/5 focus:bg-[#7C2A2A]/5 transition-colors">
                        <Link href="/bookings" className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-[#7C2A2A]" />
                            <span className="font-poppins text-sm font-medium text-gray-700">My Bookings</span>
                        </Link>
                    </DropdownMenuItem>
                </div>

                <DropdownMenuSeparator className="bg-gray-200/70" />

                {/* Logout */}
                <div className="py-1">
                    <DropdownMenuItem
                        onClick={handleLogout}
                        className="cursor-pointer rounded-lg px-3 py-2.5 hover:bg-red-50 focus:bg-red-50 transition-colors flex items-center gap-2"
                    >
                        <LogOut className="w-4 h-4 text-red-600" />
                        <span className="font-poppins text-sm font-medium text-red-600">Log Out</span>
                    </DropdownMenuItem>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
