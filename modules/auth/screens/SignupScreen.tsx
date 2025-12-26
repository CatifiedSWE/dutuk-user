'use client';

import React from 'react';
import GradientBackground from '@/components/GradientBackground';

export default function SignupScreen() {
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
                                    <span className="material-icons">verified_user</span>
                                </div>
                                <h3 className="font-display font-bold text-xl text-gray-900 mb-2">Premium Access</h3>
                                <p className="text-xs text-gray-500 font-sans leading-relaxed">Securely manage your account with our professional dashboard.</p>
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10">
                        <p className="text-sm text-gray-500 font-medium">Trusted by professionals worldwide.</p>
                        <div className="flex gap-1 mt-2">
                            <div className="w-2 h-2 rounded-full bg-[#8B0000]"></div>
                            <div className="w-2 h-2 rounded-full bg-[#8B0000]/40"></div>
                            <div className="w-2 h-2 rounded-full bg-[#8B0000]/20"></div>
                        </div>
                    </div>
                </div>

                {/* Right side - signup form */}
                <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-white relative">
                    <div className="mb-10">
                        <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-2">Create Account</h1>
                        <p className="text-[#6B7280]">Please enter your details to sign up.</p>
                    </div>

                    <form action="#" className="space-y-5">
                        {/* Username field */}
                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700" htmlFor="username">
                                Username
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="material-icons text-gray-400 group-focus-within:text-[#8B0000] transition-colors text-xl">
                                        person_outline
                                    </span>
                                </div>
                                <input
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg bg-[#F3F4F6] text-[#111827] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8B0000]/20 focus:border-[#8B0000] transition-all duration-200"
                                    id="username"
                                    name="username"
                                    placeholder="Enter your username"
                                    type="text"
                                />
                            </div>
                        </div>

                        {/* Password field */}
                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700" htmlFor="password">
                                Password
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="material-icons text-gray-400 group-focus-within:text-[#8B0000] transition-colors text-xl">
                                        lock_outline
                                    </span>
                                </div>
                                <input
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg bg-[#F3F4F6] text-[#111827] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8B0000]/20 focus:border-[#8B0000] transition-all duration-200"
                                    id="password"
                                    name="password"
                                    placeholder="••••••••"
                                    type="password"
                                />
                            </div>
                        </div>

                        {/* Remember me & Forgot password */}
                        <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center">
                                <input
                                    className="h-4 w-4 text-[#8B0000] focus:ring-[#8B0000] border-gray-300 rounded cursor-pointer transition-colors"
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                />
                                <label className="ml-2 block text-sm text-gray-600 select-none cursor-pointer" htmlFor="remember-me">
                                    Remember me
                                </label>
                            </div>
                            <div className="text-sm">
                                <a className="font-medium text-[#8B0000] hover:text-[#660000] hover:underline transition-colors" href="#">
                                    Forgot password?
                                </a>
                            </div>
                        </div>

                        {/* Sign up button */}
                        <div className="pt-2">
                            <button
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md shadow-[#8B0000]/20 text-sm font-semibold text-white bg-[#8B0000] hover:bg-[#660000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B0000] transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
                                type="submit"
                            >
                                Sign Up
                            </button>
                        </div>
                    </form>

                    {/* Divider */}
                    <div className="mt-8 relative">
                        <div aria-hidden="true" className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-100"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-gray-400 uppercase tracking-wider font-medium text-xs">
                                or continue with
                            </span>
                        </div>
                    </div>

                    {/* Google signup button */}
                    <div className="mt-6">
                        <button
                            className="w-full inline-flex justify-center items-center py-3 px-4 border border-gray-200 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-all duration-200"
                            type="button"
                        >
                            <svg aria-hidden="true" className="h-5 w-5 mr-3" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                            </svg>
                            <span>Sign up with Google</span>
                        </button>
                    </div>

                    {/* Login link */}
                    <p className="mt-8 text-center text-sm text-gray-500">
                        Already have an account?{' '}
                        <a className="font-semibold text-[#8B0000] hover:text-[#660000] hover:underline transition-colors" href="#">
                            Sign in
                        </a>
                    </p>
                </div>
            </div>
        </GradientBackground>
    );
}
