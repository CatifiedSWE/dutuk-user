'use client';

import { EventDetailsScreen } from '@/modules/events/user';
import DesktopNavbar from '@/modules/layouts/user/desktop/Navbar';
import DesktopFooter from '@/modules/layouts/user/desktop/Footer';
import MobileTopbar from '@/modules/layouts/user/mobile/Topbar';
import MobileBottomNav from '@/modules/layouts/user/mobile/BottomNav';
import { useParams } from 'next/navigation';

export default function EventDetailsPage() {
  const params = useParams();
  const eventId = params.eventId as string;

  return (
    <div>
      <DesktopNavbar />
      <MobileTopbar />
      <main className="pb-16 lg:pb-0">
        <EventDetailsScreen eventId={eventId} />
      </main>
      <DesktopFooter />
      <MobileBottomNav />
    </div>
  );
}
