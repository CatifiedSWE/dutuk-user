'use client';

import { EventListScreen } from '@/modules/events/user';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function EventsListPage() {
  return (
    <div className="min-h-screen bg-[#FDF5E6]">
      <Header />
      <main>
        <EventListScreen />
      </main>
      <Footer />
    </div>
  );
}
