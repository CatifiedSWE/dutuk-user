'use client';

import { ProfileOverviewScreen } from '@/modules/profile/user';
import DesktopNavbar from '@/modules/layouts/user/desktop/Navbar';
import DesktopFooter from '@/modules/layouts/user/desktop/Footer';
import MobileTopbar from '@/modules/layouts/user/mobile/Topbar';
import MobileBottomNav from '@/modules/layouts/user/mobile/BottomNav';

export default function ProfileOverviewPage() {
  return (
    <div>
      <DesktopNavbar />
      <MobileTopbar />
      <main className="pb-16 lg:pb-0">
        <ProfileOverviewScreen />
      </main>
      <DesktopFooter />
      <MobileBottomNav />
    </div>
  );
}
