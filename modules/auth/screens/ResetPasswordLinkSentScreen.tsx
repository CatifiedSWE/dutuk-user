'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import GradientBackground from '@/components/GradientBackground';

export default function ResetPasswordLinkSentScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');

    useEffect(() => {
        const resetEmail = sessionStorage.getItem('reset_email');
        setEmail(resetEmail || '');
    }, []);

    const maskEmail = (email: string) => {
        if (!email) return '';
        const [localPart, domain] = email.split('@');
        if (localPart.length <= 2) return email;
        return `${localPart.substring(0, 2)}${'*'.repeat(localPart.length - 2)}@${domain}`;
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
                                    <span className="material-symbols-outlined">mail_lock</span>
                                </div>
                                <h3 className="font-display font-bold text-xl text-gray-900 mb-2">Check Your Email</h3>
                                <p className="text-xs text-gray-500 font-sans leading-relaxed">We've sent you a secure link to reset your password.</p>
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

                {/* Right side - confirmation */}
                <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-white relative">
                    <div className="mb-8">
                        <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-6 text-[#8B0000]">
                            <span className="material-symbols-outlined">mark_email_read</span>
                        </div>
                        <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-3">Reset Link Sent</h1>
                        <p className="text-[#6B7280] leading-relaxed">
                            We've sent a password reset link to your email <br />
                            <span className="font-semibold text-gray-900">{maskEmail(email)}</span>.
                        </p>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                        <div className="flex items-start">
                            <span className="material-symbols-outlined text-blue-600 mr-3 flex-shrink-0">info</span>
                            <div>
                                <h3 className="font-semibold text-blue-900 mb-1">Next Steps</h3>
                                <ul className="text-sm text-blue-700 space-y-1">
                                    <li>• Check your email inbox</li>
                                    <li>• Click the reset link in the email</li>
                                    <li>• The link expires in 1 hour</li>
                                    <li>• Check your spam folder if you don't see it</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => router.push('/login')}
                        className="w-full flex justify-center py-3.5 px-4 border border-gray-200 rounded-lg shadow-sm text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-all duration-200"
                    >
                        Back to Login
                    </button>

                    <div className="mt-8 relative">
                        <div aria-hidden="true" className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-100"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-gray-400 font-medium text-xs">Didn't receive an email?</span>
                        </div>
                    </div>

                    <div className="mt-6 text-center">
                        <button
                            onClick={() => router.push('/auth/forgot-password')}
                            className="inline-flex items-center justify-center text-sm font-semibold text-[#8B0000] hover:text-[#660000] transition-colors group"
                            type="button"
                        >
                            <span className="material-symbols-outlined text-lg mr-2 group-hover:-rotate-12 transition-transform duration-300">refresh</span>
                            Resend Link
                        </button>
                    </div>
                </div>
            </div>
        </GradientBackground>
    );
}
