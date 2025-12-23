import HeroSection from './sections/HeroSection';
import CategoriesSection from './sections/CategoriesSection';
import FeaturedEventsSection from './sections/FeaturedEventsSection';

export default function HomePageScreen() {
  return (
    <div>
      <HeroSection />
      <CategoriesSection />
      <FeaturedEventsSection />
    </div>
  );
}
