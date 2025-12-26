'use client';

import React from 'react';

interface SectionHeaderProps {
    label: string;
    titleMain: string;
    titleAccent: string;
    subtitle?: string;
    className?: string;
    align?: 'left' | 'center';
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
    label,
    titleMain,
    titleAccent,
    subtitle,
    className = '',
    align = 'left',
}) => {
    return (
        <div className={`flex flex-col gap-3 ${align === 'center' ? 'items-center text-center' : 'items-start'} ${className}`}>
            {/* Label with Line */}
            <div className="flex items-center gap-3">
                <div className="w-8 h-0.5 bg-[#8B0000]"></div>
                <span className="font-urbanist font-semibold text-xs uppercase tracking-wider text-[#8B0000]">
                    {label}
                </span>
            </div>

            {/* Main Two-Tone Title */}
            <h2 className="font-['Playfair_Display'] font-bold text-3xl md:text-4xl leading-tight">
                <span className="text-[#3D2817]">{titleMain} </span>
                <span className="text-[#8B0000]">{titleAccent}</span>
            </h2>

            {/* Optional Subtitle */}
            {subtitle && (
                <p className="font-urbanist text-gray-600 text-base md:text-lg max-w-2xl leading-relaxed">
                    {subtitle}
                </p>
            )}
        </div>
    );
};

export default SectionHeader;
