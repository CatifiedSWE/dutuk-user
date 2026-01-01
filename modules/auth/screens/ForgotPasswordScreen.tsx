'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import GradientBackground from '@/components/GradientBackground';
import { sendPasswordResetEmail } from '@/lib/auth/customer-auth';

export default function ForgotPasswordScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await sendPasswordResetEmail(email);
            // Store email for the confirmation page
            sessionStorage.setItem('reset_email', email);
            router.push('/reset-link-sent');
        } catch (err: any) {
            setError(err.message || 'Failed to send reset link');
        } finally {
            setLoading(false);
        }
    };

    return (
        <GradientBackground className="flex items-center justify-center p-4 font-sans">
            <div className="w-full max-w-5xl bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] grid grid-cols-1 lg:grid-cols-2 overflow-hidden z-10 relative border border-gray-100">
                
                {/* Left side - decorative panel */}
                <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-red-50 via-white to-red-50 p-12 relative overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#8B0000]/5 rounded-full blur-2xl"></div>

                    <div className="relative z-10">
                        <h2 className="font-display text-2xl font-bold text-[#8B0000] tracking-wide">DUIUK</h2>
                    </div>

                    <div className="relative z-10 flex-grow flex items-center justify-center py-12">
                        <div className="relative w-64 h-80">
                            <div className="absolute inset-0 bg-white/40 backdrop-blur-sm border border-white/60 rounded-2xl shadow-lg transform -rotate-6 transition-transform duration-700 hover:-rotate-3"></div>
                            <div className="absolute inset-0 bg-white/80 backdrop-blur-md border border-white/80 rounded-2xl shadow-xl transform rotate-3 flex flex-col items-center justify-center p-8 text-center transition-transform duration-700 hover:rotate-0">
                                <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4 text-[#8B0000]">
                                    <span className="material-symbols-outlined">lock_reset</span>
                                </div>
                                <h3 className="font-display font-bold text-xl text-gray-900 mb-2">Password Recovery</h3>
                                <p className="text-xs text-gray-500 font-sans leading-relaxed">We'll help you regain access to your account securely.</p>
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10">
                        <p className="text-sm text-gray-500 font-medium">Secured by industry standards.</p>
                        <div className="flex gap-1 mt-2">
                            <div className="w-2 h-2 rounded-full bg-[#8B0000]"></div>
                            <div className="w-2 h-2 rounded-full bg-[#8B0000]/40"></div>
                            <div className="w-2 h-2 rounded-full bg-[#8B0000]/20"></div>
                        </div>
                    </div>
                </div>

                {/* Right side - form */}
                <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-white relative">
                    <div className="mb-8">
                        <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-6 text-[#8B0000]">
                            <span className="material-symbols-outlined">key</span>
                        </div>
                        <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-3">Forgot Password</h1>
                        <p className="text-[#6B7280] leading-relaxed">
                            Enter your email address and we'll send you a link to reset your password.
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-4" htmlFor="email">
                                Email Address
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="material-symbols-outlined text-gray-400 group-focus-within:text-[#8B0000] transition-colors text-xl">
                                        mail_outline
                                    </span>
                                </div>
                                <input
                                    className="block w-full pl-10 pr-4 py-3.5 border border-gray-200 rounded-lg bg-[#F3F4F6] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8B0000]/20 focus:border-[#8B0000] transition-all duration-200 shadow-sm"
                                    id="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-lg shadow-md shadow-[#8B0000]/20 text-sm font-semibold text-white bg-[#8B0000] hover:bg-[#660000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B0000] transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? 'Sending...' : 'Send Reset Link'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 text-center">
                        <button
                            onClick={() => router.push('/login')}
                            className="inline-flex items-center justify-center text-sm font-semibold text-gray-500 hover:text-[#8B0000] transition-colors group"
                            type="button"
                        >
                            <span className="material-symbols-outlined text-lg mr-2">arrow_back</span>
                            Back to Login
                        </button>
                    </div>
                </div>
            </div>
        </GradientBackground>
    );
}
