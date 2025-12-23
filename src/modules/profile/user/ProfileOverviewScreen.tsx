'use client';

import { demoBookings } from '@/demo';
import { Card, Button } from '@/modules/common/shared-ui';
import { useRouter } from 'next/navigation';

export default function ProfileOverviewScreen() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">My Profile</h1>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile Info */}
          <Card className="p-6">
            <div className="text-center">
              <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">👤</span>
              </div>
              <h2 className="text-xl font-bold mb-1 text-gray-900 dark:text-white">John Doe</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">john.doe@example.com</p>
              <Button onClick={() => router.push('/profile/settings')} variant="outline" className="w-full">
                Edit Profile
              </Button>
            </div>
          </Card>

          {/* My Bookings */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">My Bookings</h2>
            <div className="space-y-4">
              {demoBookings.map((booking) => (
                <Card key={booking.id} className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                        {booking.eventDetails?.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Booking ID: {booking.id}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      booking.status === 'confirmed'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                        : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                    }`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Date</p>
                      <p>{booking.eventDetails?.date ? new Date(booking.eventDetails.date).toLocaleDateString() : 'N/A'}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Time</p>
                      <p>{booking.eventDetails?.time || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Tickets</p>
                      <p>{booking.numberOfTickets}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Total</p>
                      <p className="text-blue-600 font-bold">${booking.totalAmount}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => router.push(`/events/details/${booking.eventId}`)}>
                      View Event
                    </Button>
                  </div>
                </Card>
              ))}

              {demoBookings.length === 0 && (
                <Card className="p-8 text-center">
                  <p className="text-gray-600 dark:text-gray-400 mb-4">No bookings yet</p>
                  <Button onClick={() => router.push('/events/list')}>Browse Events</Button>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
