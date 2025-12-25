'use client';

import React from 'react';
import Link from 'next/link';
import { eventCategoriesData } from '@/demo';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function EventCategories() {
    return (
        <section className="w-full flex flex-col gap-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="flex flex-col gap-2">
                    <h2 className="font-poppins font-semibold text-3xl md:text-4xl text-[#4F0000]">
                        Event categories
                    </h2>
                    <p className="font-urbanist text-[#4F0000]/70 text-lg">
                        Discover the perfect setting for your celebration
                    </p>
                </div>
                <Link
                    href="#"
                    className="group flex items-center gap-2 font-urbanist font-medium text-lg text-[#4F0000] hover:text-[#7C2A2A] transition-colors"
                >
                    <span>See all categories</span>
                    <div className="bg-[#4F0000]/10 p-2 rounded-full group-hover:bg-[#4F0000] group-hover:text-white transition-all">
                        <ArrowRight className="w-5 h-5" />
                    </div>
                </Link>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-12 justify-items-center">
                {eventCategoriesData.map((category, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        className="flex flex-col items-center gap-5 w-full max-w-[180px]"
                    >
                        <Link href="#" className="flex flex-col items-center gap-5 group cursor-pointer w-full">
                            <div className="relative w-full aspect-square rounded-full overflow-hidden shadow-xl shadow-[#4F0000]/10 group-hover:shadow-2xl group-hover:shadow-[#4F0000]/20 transition-all duration-500 group-hover:-translate-y-2 border-[5px] border-white">
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                    style={{ backgroundImage: `url(${category.image})` }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent group-hover:opacity-0 transition-opacity duration-300" />
                            </div>
                            <span className="font-poppins font-medium text-xl text-[#4F0000] text-center group-hover:text-[#7C2A2A] transition-colors">
                                {category.name}
                            </span>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
