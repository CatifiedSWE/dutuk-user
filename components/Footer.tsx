'use client';

import React from 'react';
import Link from 'next/link';
import { Instagram, Linkedin, Facebook, ArrowRight, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Footer() {
    return (
        <footer className="w-full bg-gradient-to-br from-[#4F0000] via-[#3D0000] to-[#2B0000] pt-20 pb-10 px-4 md:px-8 lg:px-20 text-white relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FFC13C] via-[#FDF5E6] to-[#FFC13C]" />
            <div className="absolute -top-[200px] -right-[200px] w-[500px] h-[500px] bg-[#7C2A2A]/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-[20%] left-[10%] w-[300px] h-[300px] bg-[#FFC13C]/10 rounded-full blur-3xl pointer-events-none" />

            {/* Concentric Arcs - Top Right */}
            <div className="absolute -top-40 -right-40 w-[600px] h-[600px] pointer-events-none opacity-5">
                <div className="absolute inset-0 rounded-full border-2 border-[#A0522D]"></div>
                <div className="absolute inset-8 rounded-full border-2 border-[#A0522D]"></div>
                <div className="absolute inset-16 rounded-full border-2 border-[#A0522D]"></div>
                <div className="absolute inset-24 rounded-full border-2 border-[#A0522D]"></div>
                <div className="absolute inset-32 rounded-full border-2 border-[#A0522D]"></div>
            </div>

            {/* Concentric Arcs - Bottom Left */}
            <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] pointer-events-none opacity-5">
                <div className="absolute inset-0 rounded-full border-2 border-[#A0522D]"></div>
                <div className="absolute inset-8 rounded-full border-2 border-[#A0522D]"></div>
                <div className="absolute inset-16 rounded-full border-2 border-[#A0522D]"></div>
                <div className="absolute inset-24 rounded-full border-2 border-[#A0522D]"></div>
            </div>

            {/* Concentric Arcs - Middle Right */}
            <div className="absolute top-1/2 -right-20 w-[400px] h-[400px] pointer-events-none opacity-5">
                <div className="absolute inset-0 rounded-full border-2 border-[#A0522D]"></div>
                <div className="absolute inset-6 rounded-full border-2 border-[#A0522D]"></div>
                <div className="absolute inset-12 rounded-full border-2 border-[#A0522D]"></div>
                <div className="absolute inset-18 rounded-full border-2 border-[#A0522D]"></div>
            </div>

            <div className="max-w-[1440px] mx-auto flex flex-col gap-16 relative z-10">

                {/* Top Section: CTA & Newsletter */}
                <div className="flex flex-col lg:flex-row items-center justify-between gap-10 border-b border-white/10 pb-16">
                    <div className="flex flex-col gap-4 text-center lg:text-left max-w-xl">
                        <h2 className="font-poppins font-semibold text-3xl md:text-4xl leading-tight">
                            Stay correctly updated.
                        </h2>
                        <p className="font-urbanist text-white/80 text-lg">
                            Join our community to get the latest updates, event tips, and exclusive offers delivered to your inbox.
                        </p>
                    </div>

                    <div className="w-full max-w-md">
                        <div className="relative flex items-center">
                            <Mail className="absolute left-4 text-[#7C2A2A] w-5 h-5 z-20" />
                            <input
                                type="email"
                                placeholder="Enter your email address"
                                className="w-full bg-[#FDF5E6] text-[#270100] placeholder:text-[#270100]/50 pl-12 pr-14 py-4 rounded-full outline-none font-poppins font-medium shadow-lg focus:ring-2 focus:ring-[#FFC13C]/50 transition-all"
                            />
                            <button className="absolute right-2 bg-[#7C2A2A] hover:bg-[#5e1e1e] p-2.5 rounded-full transition-colors text-white shadow-md group">
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">

                    {/* Brand Column */}
                    <div className="lg:col-span-4 flex flex-col gap-6">
                        <div className="flex items-start">
                            <div className="bg-[#FDF5E6] px-6 py-1.5 transform -skew-x-12">
                                <span className="block font-poppins font-bold text-2xl text-[#4F0000] transform skew-x-12 tracking-wider">
                                    DUTUK
                                </span>
                            </div>
                        </div>
                        <p className="font-urbanist text-white/70 text-base leading-relaxed max-w-sm">
                            Your premier platform for planning unforgettable events. Connect with top-tier vendors and manage everything in one place.
                        </p>

                        {/* Social Icons */}
                        <div className="flex items-center gap-3">
                            <SocialIcon icon={Instagram} href="#" />
                            <SocialIcon icon={Facebook} href="#" />
                            <SocialIcon icon={Linkedin} href="#" />
                            <a href="#" className="p-2.5 bg-white/10 hover:bg-[#FFC13C] hover:text-[#270100] rounded-full transition-all duration-300 group">
                                <svg className="w-5 h-5 text-white group-hover:text-[#270100]" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        <h4 className="font-poppins font-semibold text-lg text-[#FFC13C]">Company</h4>
                        <div className="flex flex-col gap-3">
                            <FooterLink href="#">About Us</FooterLink>
                            <FooterLink href="#">Why Choose DUTUK</FooterLink>
                            <FooterLink href="#">Our Promise</FooterLink>
                            <FooterLink href="#">Careers</FooterLink>
                            <FooterLink href="#">Contact Us</FooterLink>
                        </div>
                    </div>

                    <div className="lg:col-span-3 flex flex-col gap-6">
                        <h4 className="font-poppins font-semibold text-lg text-[#FFC13C]">Services</h4>
                        <div className="flex flex-col gap-3">
                            <FooterLink href="#">Event Planning</FooterLink>
                            <FooterLink href="#">Vendor Partners</FooterLink>
                            <FooterLink href="#">Wedding Events</FooterLink>
                            <FooterLink href="#">Birthday Parties</FooterLink>
                            <FooterLink href="#">Corporate Events</FooterLink>
                        </div>
                    </div>

                    {/* Download App Column */}
                    <div className="lg:col-span-3 flex flex-col gap-6">
                        <h4 className="font-poppins font-semibold text-lg text-[#FFC13C]">Get the App</h4>
                        <p className="font-urbanist text-white/70 text-sm">
                            Manage your events on the go. Available for iOS and Android.
                        </p>
                        <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
                            <button className="flex items-center gap-3 bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 rounded-xl transition-all group w-44">
                                <div className="p-1">
                                    <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24"><path d="M17.523 15.3414C17.5146 12.3529 19.9866 10.9666 20.0988 10.916C18.9806 9.3094 17.26 9.06554 16.6348 9.03964C15.1118 8.88726 13.6266 9.93291 12.8398 9.93291C12.0531 9.93291 10.8354 9.04944 9.57863 9.07364C7.94902 9.09624 6.45263 10.012 5.61862 11.4497C3.89662 14.4168 5.19662 18.8234 6.84863 21.1961C7.65343 22.3523 8.62544 23.6395 9.89783 23.5959C11.139 23.5523 11.6094 22.8123 13.0646 22.8123C14.5198 22.8123 14.9334 23.5959 16.2414 23.5733C17.575 23.5312 18.4214 22.3733 19.2086 21.2203C20.1086 19.9144 20.4846 18.6652 20.5054 18.6006C20.4894 18.5957 18.1718 17.7122 18.1886 15.0215M13.0134 6.74681C13.6694 5.95292 14.1086 4.85108 13.9882 3.75354C13.0478 3.79153 11.9134 4.38092 11.2382 5.16812C10.6358 5.86412 10.1118 6.98372 10.2526 8.06452C11.3134 8.14692 12.3582 7.53492 13.0134 6.74681Z" /></svg>
                                </div>
                                <div className="text-left">
                                    <div className="text-[10px] font-medium text-white/90 leading-none">Download on the</div>
                                    <div className="text-sm font-semibold text-white">App Store</div>
                                </div>
                            </button>
                            <button className="flex items-center gap-3 bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 rounded-xl transition-all group w-44">
                                <div className="p-1">
                                    <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24"><path d="M3.609 1.814L13.792 12 3.982 21.81C3.864 21.87 3.731 21.906 3.589 21.906C3.12 21.906 2.733 21.517 2.733 21.048V2.952C2.733 2.417 3.09 1.968 3.609 1.814ZM14.191 12.39L14.2 12.4 18.3 16.5 19.141 15.659 14.191 12.39ZM13.385 11.59L3.999 2.2 13.385 11.59ZM19.539 15.261L20.803 13.997C21.168 13.632 21.168 13.042 20.803 12.677L18.69 10.564 14.599 14.659 19.539 15.261Z" /></svg>
                                </div>
                                <div className="text-left">
                                    <div className="text-[10px] font-medium text-white/90 leading-none">GET IT ON</div>
                                    <div className="text-sm font-semibold text-white">Google Play</div>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="text-center pt-8 border-t border-white/10">
                    <p className="font-poppins text-xs md:text-sm text-white/50 leading-relaxed">
                        © {new Date().getFullYear()} Dutuk™ Ltd. All rights reserved. • Privacy Policy • Terms of Service
                    </p>
                </div>
            </div>
        </footer>
    );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <Link href={href} className="group flex items-center gap-2">
            <span className="w-0 h-0.5 bg-[#FFC13C] transition-all group-hover:w-3" />
            <span className="font-urbanist text-white/80 group-hover:text-white transition-colors">{children}</span>
        </Link>
    );
}

function SocialIcon({ icon: Icon, href }: { icon: any, href: string }) {
    return (
        <a href={href} className="p-2.5 bg-white/10 hover:bg-[#FFC13C] hover:text-[#270100] rounded-full transition-all duration-300 group">
            <Icon className="w-5 h-5 text-white group-hover:text-[#270100]" />
        </a>
    );
}
