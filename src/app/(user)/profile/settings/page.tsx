'use client';

import { ProfileSettingsScreen } from '@/modules/profile/user';
import DesktopNavbar from '@/modules/layouts/user/desktop/Navbar';
import DesktopFooter from '@/modules/layouts/user/desktop/Footer';
import MobileTopbar from '@/modules/layouts/user/mobile/Topbar';
import MobileBottomNav from '@/modules/layouts/user/mobile/BottomNav';

export default function ProfileSettingsPage() {
  return (
    <div>
      <DesktopNavbar />
      <MobileTopbar />
      <main className="pb-16 lg:pb-0">
        <ProfileSettingsScreen />
      </main>
      <DesktopFooter />
      <MobileBottomNav />
    </div>
  );
}
