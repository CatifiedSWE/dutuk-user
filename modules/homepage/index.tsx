import HeroSection from './sections/HeroSection';
import EventCategories from './sections/EventCategories';
import VendorCategories from './sections/VendorCategories';
import BundleServices from './sections/BundleServices';
import PremiumEventPlanning from './sections/PremiumEventPlanning';
import PremiumPackagesBanner from './sections/PremiumPackagesBanner';

export default function HomePageScreen() {
  return (
    <div className="min-h-screen bg-[#FDF5E6] overflow-x-hidden font-poppins selection:bg-[#7C2A2A] selection:text-white">
      <main className="flex flex-col gap-12 sm:gap-16 lg:gap-24 pb-20">
        {/* Hero Section */}
        <HeroSection />

        {/* Decorative Background Elements - Wrapper for relative positioning */}
        <div className="relative w-full max-w-[1440px] mx-auto">
          {/* Decorative Circles */}
          <div className="absolute -left-20 top-0 w-40 h-40 bg-[#4F0000] rounded-full blur-[71px] opacity-20 pointer-events-none" />
          <div className="absolute right-0 top-[400px] w-40 h-40 bg-[#4F0000] rounded-full blur-[71px] opacity-20 pointer-events-none" />

          <div className="flex flex-col gap-16 lg:gap-32 w-full px-4 md:px-8 lg:px-12">
            {/* Event Categories Section */}
            <EventCategories />

            {/* Vendor Categories Section */}
            <VendorCategories />

            {/* Bundle Services Section */}
            <BundleServices />

            {/* Premium Event Planning Section */}
            <PremiumEventPlanning />

            {/* Premium Packages Banner */}
            <PremiumPackagesBanner />
          </div>
        </div>
      </main>
    </div>
  );
}
