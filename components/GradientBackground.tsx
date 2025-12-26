import React from 'react';

interface GradientBackgroundProps {
    children?: React.ReactNode;
    className?: string;
}

export default function GradientBackground({ children, className = '' }: GradientBackgroundProps) {
    return (
        <div className={`min-h-screen bg-gray-50 relative overflow-hidden ${className}`}>
            {/* Beige gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-50/30 via-transparent to-amber-50/20 pointer-events-none z-0"></div>

            {/* Background decorations */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-grid-pattern pattern-grid"></div>
                <div className="absolute top-0 left-0 w-[40rem] h-[40rem] bg-red-100 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 opacity-60"></div>
                <div className="absolute bottom-0 right-0 w-[40rem] h-[40rem] bg-orange-50 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 opacity-60"></div>
            </div>

            {/* Content with proper z-index */}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
}
