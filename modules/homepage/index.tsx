import HeroSection from './sections/HeroSection';
import EventCategories from './sections/EventCategories';
import VendorCategories from './sections/VendorCategories';
import BundleServices from './sections/BundleServices';
import PremiumEventPlanning from './sections/PremiumEventPlanning';
import PremiumPackagesBanner from './sections/PremiumPackagesBanner';

export default function HomePageScreen() {
  return (
    <div className="font-poppins selection:bg-primary selection:text-white">
      <main className="relative z-10 flex flex-col gap-12 sm:gap-16 lg:gap-24 pb-20">
        {/* Hero Section - Priority loading */}
        <HeroSection />

        {/* Decorative Background Elements - Wrapper for relative positioning */}
        <div className="relative w-full max-w-[1440px] mx-auto">

          <div className="flex flex-col gap-16 lg:gap-32 w-full px-4 md:px-8 lg:px-12">
            {/* Event Categories Section */}
            <EventCategories />

            {/* Vendor Categories Section */}
            <VendorCategories />

            {/* Bundle Services Section */}
            <BundleServices />

            {/* Premium Packages Banner */}
            <PremiumPackagesBanner />

            {/* Premium Event Planning Section */}
            <PremiumEventPlanning />
          </div>
        </div>
      </main>
    </div>
  );
}
