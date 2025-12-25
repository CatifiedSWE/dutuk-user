'use client';

import { Suspense } from 'react';
import { BookingCheckoutScreen } from '@/modules/bookings/user';
import DesktopNavbar from '@/modules/layouts/user/desktop/Navbar';
import DesktopFooter from '@/modules/layouts/user/desktop/Footer';
import MobileTopbar from '@/modules/layouts/user/mobile/Topbar';
import MobileBottomNav from '@/modules/layouts/user/mobile/BottomNav';

export default function BookingCheckoutPage() {
  return (
    <div>
      <DesktopNavbar />
      <MobileTopbar />
      <main className="pb-16 lg:pb-0">
        <Suspense fallback={<div className="h-screen w-full flex items-center justify-center">Loading...</div>}>
          <BookingCheckoutScreen />
        </Suspense>
      </main>
      <DesktopFooter />
      <MobileBottomNav />
    </div>
  );
}
