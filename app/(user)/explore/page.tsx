import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GradientBackground from '@/components/GradientBackground';
import { ExploreScreen } from '@/modules/explore/user';

export default function ExplorePage() {
  return (
    <GradientBackground>
      <Header variant="glassmorphic" />
      <ExploreScreen />
      <Footer />
    </GradientBackground>
  );
}
