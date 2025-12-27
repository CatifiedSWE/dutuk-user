'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Search, Building2, Calendar, Package } from 'lucide-react';

export default function HeroSection() {
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();

    // Handle search - redirect to explore page with search query
    const handleSearch = () => {
        if (searchQuery.trim()) {
            // Redirect to explore page with search parameter
            router.push(`/explore?search=${encodeURIComponent(searchQuery.trim())}`);
        } else {
            // If no search query, just go to explore page
            router.push('/explore');
        }
    };

    // Handle Enter key press
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    // Handle category button click - redirect to explore with filter
    const handleCategoryClick = (category: 'Vendors' | 'Events' | 'Packages') => {
        router.push(`/explore?filter=${category}`);
    };

    return (
        <section className="relative w-full min-h-[700px] lg:min-h-[800px] -mt-20 md:-mt-24 flex items-center justify-center overflow-hidden">
            {/* Background Video with Overlay - Progressive loading for mobile */}
            <div className="absolute inset-0 z-0">
                {/* Mobile: Show blur placeholder first, then video (hidden on desktop) */}
                <div className="block md:hidden">
                    <MobileHeroBackground />
                </div>
                {/* Desktop: Show video directly (hidden on mobile) */}
                <div className="hidden md:block">
                    <HeroVideoBackground />
                </div>
                <div className="absolute inset-0 bg-black/85" />
            </div>

            <div className="relative z-10 container mx-auto px-4 flex flex-col items-center justify-center gap-8 md:gap-10 pt-32 md:pt-40 animate-fadeInUp">
                {/* Main Text Content */}
                <div className="flex flex-col items-center gap-6 max-w-4xl text-center">
                    <h1 className="font-['Playfair_Display'] font-bold text-4xl md:text-6xl lg:text-[72px] leading-tight md:leading-[1.1] text-white drop-shadow-lg">
                        Let's make your next <br className="hidden md:block" /> celebration unforgettable.
                    </h1>
                    <p className="font-urbanist font-medium text-lg md:text-xl max-w-2xl bg-gradient-to-r from-white via-rose-100 to-rose-200/90 bg-clip-text text-transparent drop-shadow-sm">
                        Explore work from the most talented and accomplished designers ready to take on your next project.
                    </p>
                </div>

                {/* Search Bar - Floating Style */}
                <div className="w-full max-w-[600px] relative group">
                    <div className="relative flex items-center bg-white rounded-full p-2 pl-6 shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)]">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Search for vendors, events, packages..."
                            className="flex-1 bg-transparent border-none outline-none text-base md:text-lg text-[#4F0000] placeholder:text-gray-400 font-urbanist"
                        />
                        <button 
                            onClick={handleSearch}
                            className="btn-gradient text-white p-4 rounded-full transition-all duration-300 shadow-md transform group-hover:rotate-[-10deg] group-hover:scale-110 active:scale-95"
                        >
                            <Search className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Category Actions */}
                <div className="flex flex-wrap items-center justify-center gap-4">
                    <ActionButton icon={Building2} label="Vendors" primary onClick={() => handleCategoryClick('Vendors')} />
                    <ActionButton icon={Calendar} label="Events" onClick={() => handleCategoryClick('Events')} />
                    <ActionButton icon={Package} label="Packages" onClick={() => handleCategoryClick('Packages')} />
                </div>
            </div>
        </section>
    );
}

function ActionButton({ icon: Icon, label, primary, onClick }: { icon: any, label: string, primary?: boolean, onClick?: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-3 px-6 py-3 rounded-full font-urbanist font-medium text-base shadow-lg transition-all duration-300 hover:-translate-y-1 hover:scale-105 active:scale-95 ${primary
                ? 'bg-white text-[#4F0000]'
                : 'bg-white/15 border border-white/20 text-white hover:bg-white/25'
                }`}
        >
            <Icon className="w-5 h-5" />
            {label}
        </button>
    );
}

/**
 * Mobile Hero Background with Progressive Loading
 * Shows a tiny blurred placeholder image instantly, then crossfades to video when ready
 */
function MobileHeroBackground() {
    const [videoLoaded, setVideoLoaded] = useState(false);
    const [activeVideo, setActiveVideo] = useState(0);
    const video1Ref = React.useRef<HTMLVideoElement>(null);
    const video2Ref = React.useRef<HTMLVideoElement>(null);
    
    const videos = [
        '/hero/hero-video-1.mp4',
        '/hero/hero-video-2.mp4'
    ];

    // Handle video ready to play
    const handleCanPlayThrough = () => {
        setVideoLoaded(true);
    };

    const handleVideo1End = () => {
        if (video2Ref.current) {
            video2Ref.current.currentTime = 0;
            video2Ref.current.play();
            setActiveVideo(1);
        }
    };

    const handleVideo2End = () => {
        if (video1Ref.current) {
            video1Ref.current.currentTime = 0;
            video1Ref.current.play();
            setActiveVideo(0);
        }
    };

    return (
        <>
            {/* Blurred Placeholder - Shows instantly (only ~400 bytes!) */}
            <div 
                className={`absolute inset-0 z-0 transition-opacity duration-1000 ease-out ${
                    videoLoaded ? 'opacity-0' : 'opacity-100'
                }`}
            >
                {/* Tiny blurred image scaled up with CSS blur for smooth effect */}
                <Image
                    src="/hero/hero-placeholder-blur.jpg"
                    alt="Loading..."
                    fill
                    priority
                    className="object-cover blur-xl scale-110"
                    sizes="100vw"
                />
            </div>

            {/* Video Layer - Fades in when ready */}
            <div 
                className={`absolute inset-0 z-10 transition-opacity duration-1000 ease-out ${
                    videoLoaded ? 'opacity-100' : 'opacity-0'
                }`}
            >
                {/* Video 1 */}
                <video
                    ref={video1Ref}
                    autoPlay
                    muted
                    playsInline
                    onCanPlayThrough={handleCanPlayThrough}
                    onEnded={handleVideo1End}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                        activeVideo === 0 ? 'opacity-100 z-10' : 'opacity-0 z-0'
                    }`}
                >
                    <source src={videos[0]} type="video/mp4" />
                </video>
                
                {/* Video 2 */}
                <video
                    ref={video2Ref}
                    muted
                    playsInline
                    preload="auto"
                    onEnded={handleVideo2End}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                        activeVideo === 1 ? 'opacity-100 z-10' : 'opacity-0 z-0'
                    }`}
                >
                    <source src={videos[1]} type="video/mp4" />
                </video>
            </div>
        </>
    );
}

/**
 * Desktop Hero Video Background - Original implementation
 */
function HeroVideoBackground() {
    const [activeVideo, setActiveVideo] = React.useState(0);
    const video1Ref = React.useRef<HTMLVideoElement>(null);
    const video2Ref = React.useRef<HTMLVideoElement>(null);
    
    const videos = [
        '/hero/hero-video-1.mp4',
        '/hero/hero-video-2.mp4'
    ];

    const handleVideo1End = () => {
        if (video2Ref.current) {
            video2Ref.current.currentTime = 0;
            video2Ref.current.play();
            setActiveVideo(1);
        }
    };

    const handleVideo2End = () => {
        if (video1Ref.current) {
            video1Ref.current.currentTime = 0;
            video1Ref.current.play();
            setActiveVideo(0);
        }
    };

    return (
        <>
            {/* Video 1 */}
            <video
                ref={video1Ref}
                autoPlay
                muted
                playsInline
                onEnded={handleVideo1End}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${activeVideo === 0 ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            >
                <source src={videos[0]} type="video/mp4" />
            </video>
            
            {/* Video 2 */}
            <video
                ref={video2Ref}
                muted
                playsInline
                preload="auto"
                onEnded={handleVideo2End}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${activeVideo === 1 ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            >
                <source src={videos[1]} type="video/mp4" />
            </video>
        </>
    );
}
