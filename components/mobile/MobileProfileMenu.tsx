'use client';

import React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Settings, LogOut, LogIn } from 'lucide-react';
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
                        transition={{ duration: 0.2 }}
                        className="lg:hidden fixed inset-0 bg-black/50 z-40"
                        onClick={onClose}
                    />

                    {/* Menu */}
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl"
                    >
                        {/* Handle Bar */}
                        <div className="flex justify-center pt-3 pb-2">
                            <div className="w-12 h-1 bg-gray-300 rounded-full" />
                        </div>

                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
                            aria-label="Close menu"
                        >
                            <X className="w-5 h-5 text-gray-600" />
                        </button>

                        {/* Menu Content */}
                        <div className="px-6 pb-8 pt-4">
                            {loading ? (
                                <div className="py-8 text-center text-gray-500">Loading...</div>
                            ) : isAuthenticated ? (
                                <>
                                    {/* User Info */}
                                    <div className="flex items-center gap-4 pb-6 border-b border-gray-200">
                                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#7C2A2A] to-[#4F0000] flex items-center justify-center">
                                            <User className="w-8 h-8 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-lg text-[#4F0000]">
                                                {user?.user_metadata?.full_name || 'User'}
                                            </h3>
                                            <p className="text-sm text-gray-600">{user?.email}</p>
                                        </div>
                                    </div>

                                    {/* Menu Items */}
                                    <div className="py-4 space-y-2">
                                        <Link
                                            href="/profile/overview"
                                            onClick={onClose}
                                            className="flex items-center gap-4 py-3 px-4 rounded-xl hover:bg-gray-100 transition-colors"
                                        >
                                            <User className="w-5 h-5 text-[#7C2A2A]" />
                                            <span className="text-base font-medium text-gray-800">Profile</span>
                                        </Link>
                                        <Link
                                            href="/profile/settings"
                                            onClick={onClose}
                                            className="flex items-center gap-4 py-3 px-4 rounded-xl hover:bg-gray-100 transition-colors"
                                        >
                                            <Settings className="w-5 h-5 text-[#7C2A2A]" />
                                            <span className="text-base font-medium text-gray-800">Settings</span>
                                        </Link>
                                    </div>

                                    {/* Logout Button */}
                                    <button
                                        onClick={handleLogout}
                                        className="w-full mt-2 flex items-center justify-center gap-3 py-3 px-4 bg-red-50 text-red-600 font-medium rounded-xl hover:bg-red-100 transition-colors"
                                    >
                                        <LogOut className="w-5 h-5" />
                                        <span>Log out</span>
                                    </button>
                                </>
                            ) : (
                                <>
                                    {/* Guest User */}
                                    <div className="py-6 text-center">
                                        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-200 flex items-center justify-center">
                                            <User className="w-10 h-10 text-gray-400" />
                                        </div>
                                        <h3 className="font-semibold text-lg text-[#4F0000] mb-2">
                                            Welcome to Dutuk!
                                        </h3>
                                        <p className="text-sm text-gray-600 mb-6">
                                            Sign in to access your profile and bookings
                                        </p>
                                        <Link
                                            href="/login"
                                            onClick={onClose}
                                            className="inline-flex items-center justify-center gap-3 py-3 px-8 bg-gradient-to-r from-[#7C2A2A] to-[#4F0000] text-white font-semibold rounded-xl hover:shadow-lg transition-all"
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
