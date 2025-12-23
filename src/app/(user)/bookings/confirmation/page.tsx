'use client';

import { BookingConfirmationScreen } from '@/modules/bookings/user';
import DesktopNavbar from '@/modules/layouts/user/desktop/Navbar';
import DesktopFooter from '@/modules/layouts/user/desktop/Footer';
import MobileTopbar from '@/modules/layouts/user/mobile/Topbar';
import MobileBottomNav from '@/modules/layouts/user/mobile/BottomNav';

export default function BookingConfirmationPage() {
  return (
    <div>
      <DesktopNavbar />
      <MobileTopbar />
      <main className="pb-16 lg:pb-0">
        <BookingConfirmationScreen />
      </main>
      <DesktopFooter />
      <MobileBottomNav />
    </div>
  );
}
