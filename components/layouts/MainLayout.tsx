'use client';

import React from 'react';
import Header from '@/components/Header';
import MobileTopNav from '@/components/mobile/MobileTopNav';
import MobileBottomNav from '@/components/mobile/MobileBottomNav';
import Footer from '@/components/Footer';
import GradientBackground from '@/components/GradientBackground';

interface MainLayoutProps {
    children: React.ReactNode;
    variant?: 'glassmorphic' | 'solid';
    showFooter?: boolean;
}

export default function MainLayout({ 
    children, 
    variant = 'solid',
    showFooter = true 
}: MainLayoutProps) {
    return (
        <GradientBackground>
            {/* Desktop Header */}
            <div className="fixed top-0 left-0 right-0 z-50">
                <Header variant={variant} />
            </div>

            {/* Mobile Top Navigation */}
            <MobileTopNav />

            {/* Main Content with proper padding for mobile */}
            <main className="lg:pt-0 pt-16 pb-20 lg:pb-0">
                {children}
            </main>

            {/* Footer */}
            {showFooter && <Footer />}

            {/* Mobile Bottom Navigation */}
            <MobileBottomNav />
        </GradientBackground>
    );
}
