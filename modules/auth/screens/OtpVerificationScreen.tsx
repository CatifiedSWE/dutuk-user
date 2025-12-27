'use client';

import React from 'react';
import GradientBackground from '@/components/GradientBackground';

export default function OtpVerificationScreen() {
    return (
        <GradientBackground className="flex items-center justify-center p-4 font-sans">
            {/* Main card */}
            <div className="w-full max-w-5xl bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] grid grid-cols-1 lg:grid-cols-2 overflow-hidden z-10 relative border border-gray-100">

                {/* Left side - decorative panel (hidden on mobile) */}
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
                                    <span className="material-symbols-outlined">lock_person</span>
                                </div>
                                <h3 className="font-display font-bold text-xl text-gray-900 mb-2">Secure Verification</h3>
                                <p className="text-xs text-gray-500 font-sans leading-relaxed">Protecting your account with industry standard multi-factor authentication.</p>
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

                {/* Right side - OTP verification form */}
                <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-white relative">
                    <div className="mb-8">
                        <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-6 text-[#8B0000]">
                            <span className="material-symbols-outlined">mark_email_read</span>
                        </div>
                        <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-3">Verification Code</h1>
                        <p className="text-[#6B7280] leading-relaxed">
                            We have sent a verification code to your email <br />
                            <span className="font-semibold text-gray-900">alex******@example.com</span>.
                        </p>
                    </div>

                    <form action="#" className="space-y-8">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-4" htmlFor="otp-1">
                                Enter the 6-digit code
                            </label>
                            <div className="flex justify-between gap-2 md:gap-3">
                                <input
                                    className="w-10 h-12 md:w-14 md:h-14 text-center text-xl font-bold border border-gray-200 rounded-lg bg-[#F3F4F6] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#8B0000]/20 focus:border-[#8B0000] transition-all duration-200 shadow-sm"
                                    id="otp-1"
                                    inputMode="numeric"
                                    maxLength={1}
                                    name="otp-1"
                                    type="text"
                                />
                                <input
                                    className="w-10 h-12 md:w-14 md:h-14 text-center text-xl font-bold border border-gray-200 rounded-lg bg-[#F3F4F6] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#8B0000]/20 focus:border-[#8B0000] transition-all duration-200 shadow-sm"
                                    inputMode="numeric"
                                    maxLength={1}
                                    name="otp-2"
                                    type="text"
                                />
                                <input
                                    className="w-10 h-12 md:w-14 md:h-14 text-center text-xl font-bold border border-gray-200 rounded-lg bg-[#F3F4F6] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#8B0000]/20 focus:border-[#8B0000] transition-all duration-200 shadow-sm"
                                    inputMode="numeric"
                                    maxLength={1}
                                    name="otp-3"
                                    type="text"
                                />
                                <input
                                    className="w-10 h-12 md:w-14 md:h-14 text-center text-xl font-bold border border-gray-200 rounded-lg bg-[#F3F4F6] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#8B0000]/20 focus:border-[#8B0000] transition-all duration-200 shadow-sm"
                                    inputMode="numeric"
                                    maxLength={1}
                                    name="otp-4"
                                    type="text"
                                />
                                <input
                                    className="w-10 h-12 md:w-14 md:h-14 text-center text-xl font-bold border border-gray-200 rounded-lg bg-[#F3F4F6] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#8B0000]/20 focus:border-[#8B0000] transition-all duration-200 shadow-sm"
                                    inputMode="numeric"
                                    maxLength={1}
                                    name="otp-5"
                                    type="text"
                                />
                                <input
                                    className="w-10 h-12 md:w-14 md:h-14 text-center text-xl font-bold border border-gray-200 rounded-lg bg-[#F3F4F6] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#8B0000]/20 focus:border-[#8B0000] transition-all duration-200 shadow-sm"
                                    inputMode="numeric"
                                    maxLength={1}
                                    name="otp-6"
                                    type="text"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-center text-sm">
                            <span className="text-gray-500 mr-2">Code expires in:</span>
                            <span className="font-semibold text-[#8B0000]">04:59</span>
                        </div>

                        <div className="pt-2">
                            <button
                                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-lg shadow-md shadow-[#8B0000]/20 text-sm font-semibold text-white bg-[#8B0000] hover:bg-[#660000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B0000] transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
                                type="submit"
                            >
                                Verify Account
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 relative">
                        <div aria-hidden="true" className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-100"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-gray-400 font-medium text-xs">I didn't receive a code</span>
                        </div>
                    </div>

                    <div className="mt-6 text-center">
                        <button
                            className="inline-flex items-center justify-center text-sm font-semibold text-[#8B0000] hover:text-[#660000] transition-colors group"
                            type="button"
                        >
                            <span className="material-symbols-outlined text-lg mr-2 group-hover:-rotate-12 transition-transform duration-300">refresh</span>
                            Resend Code
                        </button>
                    </div>
                </div>
            </div>
        </GradientBackground>
    );
}
