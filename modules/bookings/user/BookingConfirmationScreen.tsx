'use client';

import { demoEvents } from '@/demo';
import { Card, Button } from '@/modules/common/shared-ui';
import { useRouter, useSearchParams } from 'next/navigation';

export default function BookingConfirmationScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventId = searchParams.get('eventId');
  const numberOfTickets = parseInt(searchParams.get('tickets') || '1');
  
  const event = demoEvents.find((e) => e.id === eventId);

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Booking Not Found</h2>
          <Button onClick={() => router.push('/events/list')}>Browse Events</Button>
        </div>
      </div>
    );
  }

  const totalAmount = event.price * numberOfTickets;
  const bookingId = `BK-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card className="p-8 text-center">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">✓</span>
          </div>
          
          <h1 className="text-3xl font-bold mb-3 text-gray-900 dark:text-white">
            Booking Confirmed!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Your tickets have been successfully booked. Check your email for confirmation details.
          </p>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-6 text-left">
            <div className="mb-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">Booking ID</span>
              <p className="text-lg font-mono font-bold text-gray-900 dark:text-white">{bookingId}</p>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h3 className="font-bold text-lg mb-3 text-gray-900 dark:text-white">{event.title}</h3>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <p>📅 {new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
                <p>🕐 {event.time}</p>
                <p>📍 {event.venue}, {event.location}</p>
                <p className="pt-2 border-t border-gray-200 dark:border-gray-700">
                  🎫 {numberOfTickets} {numberOfTickets === 1 ? 'Ticket' : 'Tickets'}
                </p>
                <p className="font-bold text-lg text-blue-600">Total: ${totalAmount}</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => router.push('/profile/overview')}
              className="w-full"
              size="lg"
            >
              View My Bookings
            </Button>
            <Button
              onClick={() => router.push('/events/list')}
              variant="outline"
              className="w-full"
            >
              Browse More Events
            </Button>
          </div>

          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              📧 A confirmation email has been sent to your registered email address with your e-tickets.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
