'use client';

import React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Settings, LogOut, LogIn, ChevronRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { signOut } from '@/lib/auth/customer-auth';
import { useRouter } from 'next/navigation';

interface MobileProfileMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function MobileProfileMenu({ isOpen, onClose }: MobileProfileMenuProps) {
    const { user, isAuthenticated, loading } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await signOut();
            onClose();
            router.push('/home');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                        onClick={onClose}
                    />

                    {/* Menu */}
                    <motion.div
                        initial={{ y: '100%', opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: '100%', opacity: 0 }}
                        transition={{
                            type: 'spring',
                            damping: 30,
                            stiffness: 300,
                            opacity: { duration: 0.2 }
                        }}
                        className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-[2rem] shadow-2xl overflow-hidden"
                    >
                        {/* Drag Handle */}
                        <div className="flex justify-center pt-4 pb-3">
                            <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
                        </div>

                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-5 right-5 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors z-10"
                            aria-label="Close menu"
                        >
                            <X className="w-5 h-5 text-gray-700" />
                        </button>

                        {/* Menu Content */}
                        <div className="px-5 pb-safe pt-2" style={{ paddingBottom: 'max(2rem, env(safe-area-inset-bottom))' }}>
                            {loading ? (
                                <div className="py-12 text-center">
                                    <div className="inline-block w-8 h-8 border-4 border-[#7C2A2A] border-t-transparent rounded-full animate-spin"></div>
                                    <p className="mt-3 text-gray-500 text-sm">Loading...</p>
                                </div>
                            ) : isAuthenticated ? (
                                <>
                                    {/* User Info Card */}
                                    <div className="bg-gradient-to-br from-[#7C2A2A] to-[#4F0000] rounded-2xl p-5 mb-6 shadow-lg">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center ring-4 ring-white/30">
                                                <User className="w-8 h-8 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-bold text-lg text-white mb-0.5">
                                                    {user?.user_metadata?.full_name || 'User'}
                                                </h3>
                                                <p className="text-sm text-white/80">{user?.email}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Menu Items */}
                                    <div className="space-y-2 mb-4">
                                        <Link
                                            href="/profile/overview"
                                            onClick={onClose}
                                            className="flex items-center justify-between py-4 px-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all duration-200 group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-[#7C2A2A]/10 flex items-center justify-center">
                                                    <User className="w-5 h-5 text-[#7C2A2A]" />
                                                </div>
                                                <span className="text-base font-semibold text-gray-800">My Profile</span>
                                            </div>
                                            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#7C2A2A] transition-colors" />
                                        </Link>

                                        <Link
                                            href="/bookings"
                                            onClick={onClose}
                                            className="flex items-center justify-between py-4 px-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all duration-200 group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-[#7C2A2A]/10 flex items-center justify-center">
                                                    <svg className="w-5 h-5 text-[#7C2A2A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                                <span className="text-base font-semibold text-gray-800">My Bookings</span>
                                            </div>
                                            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#7C2A2A] transition-colors" />
                                        </Link>

                                        <Link
                                            href="/profile/settings"
                                            onClick={onClose}
                                            className="flex items-center justify-between py-4 px-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all duration-200 group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-[#7C2A2A]/10 flex items-center justify-center">
                                                    <Settings className="w-5 h-5 text-[#7C2A2A]" />
                                                </div>
                                                <span className="text-base font-semibold text-gray-800">Settings</span>
                                            </div>
                                            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#7C2A2A] transition-colors" />
                                        </Link>
                                    </div>

                                    {/* Logout Button */}
                                    <button
                                        onClick={handleLogout}
                                        className="w-full mt-2 flex items-center justify-center gap-3 py-4 px-4 bg-red-50 text-red-600 font-semibold rounded-xl hover:bg-red-100 active:scale-[0.98] transition-all duration-200"
                                    >
                                        <LogOut className="w-5 h-5" />
                                        <span>Log out</span>
                                    </button>
                                </>
                            ) : (
                                <>
                                    {/* Guest User */}
                                    <div className="py-8 text-center pb-16">
                                        <div className="w-24 h-24 mx-auto mb-5 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                            <User className="w-12 h-12 text-gray-400" />
                                        </div>
                                        <h3 className="font-bold text-xl text-[#4F0000] mb-2">
                                            Welcome to Dutuk!
                                        </h3>
                                        <p className="text-sm text-gray-600 mb-8 px-4">
                                            Sign in to access your profile, bookings, and exclusive features
                                        </p>
                                        <Link
                                            href="/login"
                                            onClick={onClose}
                                            className="inline-flex items-center justify-center gap-3 py-4 px-10 bg-gradient-to-r from-[#7C2A2A] to-[#4F0000] text-white font-bold rounded-xl hover:shadow-xl active:scale-[0.98] transition-all duration-200"
                                        >
                                            <LogIn className="w-5 h-5" />
                                            <span>Login / Sign Up</span>
                                        </Link>
                                    </div>
                                </>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
