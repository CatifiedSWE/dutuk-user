'use client';

import HomePageScreen from '@/modules/homepage';
import DesktopNavbar from '@/modules/layouts/user/desktop/Navbar';
import DesktopFooter from '@/modules/layouts/user/desktop/Footer';
import MobileTopbar from '@/modules/layouts/user/mobile/Topbar';
import MobileBottomNav from '@/modules/layouts/user/mobile/BottomNav';

export default function HomePage() {
  return (
    <div>
      <DesktopNavbar />
      <MobileTopbar />
      <main className="pb-16 lg:pb-0">
        <HomePageScreen />
      </main>
      <DesktopFooter />
      <MobileBottomNav />
    </div>
  );
}
