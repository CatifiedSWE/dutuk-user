'use client';

import React from 'react';
import Link from 'next/link';
import { Instagram, Linkedin, Facebook } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="w-full bg-gradient-to-r from-[#7C2A2A] to-[#1B0F11] pt-16 pb-8 px-4 md:px-8 lg:px-20 text-white">
            <div className="max-w-[1440px] mx-auto flex flex-col gap-12">
                {/* Top Section: Logo */}
                <div className="flex justify-center md:justify-start">
                    <div className="bg-[#FDF5E6] px-8 py-2 border border-[#FDF5E6]">
                        <span className="font-poppins font-semibold text-2xl text-[#4F0000]">
                            DUTUK
                        </span>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-x-8 md:gap-y-12 border-b border-white/20 pb-12">

                    {/* Column 1: Social & Newsletter */}
                    <div className="flex flex-col gap-8">
                        <div className="flex items-center gap-4">
                            <a href="#" className="p-2 hover:bg-white/10 rounded-full transition-colors"><Instagram className="w-6 h-6" /></a>
                            <a href="#" className="p-2 hover:bg-white/10 rounded-full transition-colors"><Linkedin className="w-6 h-6" /></a>
                            <a href="#" className="p-2 hover:bg-white/10 rounded-full transition-colors"><Facebook className="w-6 h-6" /></a>
                        </div>

                        <div className="flex flex-col gap-4">
                            <h3 className="font-poppins font-medium text-lg">Newsletter Subscriptions</h3>
                            <div className="flex flex-col gap-3">
                                <input
                                    type="email"
                                    placeholder="example@mail.com"
                                    className="bg-[#FDF5E6] text-[#381718]/80 placeholder:text-[#381718]/50 px-4 py-2.5 rounded-lg outline-none font-poppins font-medium"
                                />
                                <button className="border border-[#FDF5E6] text-[#FDF5E6] hover:bg-[#FDF5E6] hover:text-[#4F0000] px-4 py-2.5 rounded-lg transition-all font-poppins font-medium">
                                    Submit
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Column 2: Company */}
                    <div className="flex flex-col gap-4">
                        <h4 className="font-poppins font-semibold text-lg">Company</h4>
                        <div className="flex flex-col gap-3">
                            {['About Us', 'Why Choose DUTUK', 'Our Promise', 'Careers / Join Our Team', 'Contact Us'].map((link) => (
                                <Link key={link} href="#" className="text-white/80 hover:text-white transition-colors font-poppins font-light">
                                    {link}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Column 3: Services */}
                    <div className="flex flex-col gap-4">
                        <h4 className="font-poppins font-semibold text-lg">Services</h4>
                        <div className="flex flex-col gap-3">
                            {['Vendors', 'Events', 'Packages', 'Premium Planning', 'Bundle Services'].map((link) => (
                                <Link key={link} href="#" className="text-white/80 hover:text-white transition-colors font-poppins font-light">
                                    {link}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Column 4: Legal */}
                    <div className="flex flex-col gap-4">
                        <h4 className="font-poppins font-semibold text-lg">Legal</h4>
                        <div className="flex flex-col gap-3">
                            {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Refund Policy'].map((link) => (
                                <Link key={link} href="#" className="text-white/80 hover:text-white transition-colors font-poppins font-light">
                                    {link}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Section: Copyright */}
                <div className="text-center">
                    <p className="text-white/60 font-poppins font-light text-sm">
                        © {new Date().getFullYear()} DUTUK. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
