'use client';

import { demoEvents, demoVendors } from '@/demo';
import { Event } from '@/domain/event';
import { Card, Button } from '@/modules/common/shared-ui';
import { useRouter } from 'next/navigation';

interface EventDetailsScreenProps {
  eventId: string;
}

export default function EventDetailsScreen({ eventId }: EventDetailsScreenProps) {
  const router = useRouter();
  const event = demoEvents.find((e) => e.id === eventId);
  const vendor = event ? demoVendors.find((v) => v.id === event.vendorId) : null;

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Event Not Found</h2>
          <p className="text-gray-600 mb-4">The event you're looking for doesn't exist.</p>
          <Button onClick={() => router.push('/events/list')}>Browse Events</Button>
        </div>
      </div>
    );
  }

  const handleBookNow = () => {
    router.push(`/bookings/checkout?eventId=${event.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Image */}
      <div className="relative h-96 overflow-hidden">
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        {event.featured && (
          <span className="absolute top-6 right-6 bg-yellow-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
            ⭐ Featured Event
          </span>
        )}
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-lg text-sm font-medium">
                  {event.category}
                </span>
                <span className={`px-3 py-1 rounded-lg text-sm font-medium ${
                  event.status === 'upcoming' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : ''
                }`}>
                  {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                </span>
              </div>
              <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                {event.title}
              </h1>
            </div>

            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">About This Event</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {event.description}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {event.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Date & Location</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">📅</span>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Date & Time</p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {new Date(event.date).toLocaleDateString('en-US', { 
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">{event.time}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">📍</span>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Venue</p>
                    <p className="text-gray-600 dark:text-gray-400">{event.venue}</p>
                    <p className="text-gray-600 dark:text-gray-400">{event.location}</p>
                  </div>
                </div>
              </div>
            </Card>

            {vendor && (
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Organized By</h2>
                <div className="flex items-center gap-4">
                  <img
                    src={vendor.logo}
                    alt={vendor.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{vendor.name}</h3>
                      {vendor.verified && (
                        <span className="text-blue-500" title="Verified">✓</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      ⭐ {vendor.rating} • {vendor.totalEvents} events organized
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-gray-700 dark:text-gray-300">{vendor.description}</p>
              </Card>
            )}
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-4">
              <div className="mb-6">
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  ${event.price}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">per ticket</p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Capacity:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{event.capacity} people</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Available:</span>
                  <span className="font-semibold text-green-600">{event.availableSeats} seats</span>
                </div>
              </div>

              <Button
                onClick={handleBookNow}
                className="w-full"
                size="lg"
                disabled={event.availableSeats === 0}
              >
                {event.availableSeats > 0 ? 'Book Now' : 'Sold Out'}
              </Button>

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                  🎫 Instant confirmation<br />
                  💯 Secure payment<br />
                  📱 Mobile tickets
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
