import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ExploreScreen } from '@/modules/explore/user';

export default function ExplorePage() {
  return (
    <>
      <Header variant="glassmorphic" />
      <ExploreScreen />
      <Footer />
    </>
  );
}
