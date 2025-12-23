'use client';

import { demoEvents } from '@/demo';
import { Card, Button } from '@/modules/common/shared-ui';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function BookingCheckoutScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventId = searchParams.get('eventId');
  
  const event = demoEvents.find((e) => e.id === eventId);
  const [numberOfTickets, setNumberOfTickets] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Event Not Found</h2>
          <p className="text-gray-600 mb-4">Please select an event to book.</p>
          <Button onClick={() => router.push('/events/list')}>Browse Events</Button>
        </div>
      </div>
    );
  }

  const totalAmount = event.price * numberOfTickets;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would process payment
    router.push(`/bookings/confirmation?eventId=${eventId}&tickets=${numberOfTickets}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Complete Your Booking</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <Card className="p-6 mb-6">
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Contact Information</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </form>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Number of Tickets</h2>
              <div className="flex items-center gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setNumberOfTickets(Math.max(1, numberOfTickets - 1))}
                  disabled={numberOfTickets <= 1}
                >
                  -
                </Button>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">{numberOfTickets}</span>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setNumberOfTickets(Math.min(event.availableSeats, numberOfTickets + 1))}
                  disabled={numberOfTickets >= event.availableSeats}
                >
                  +
                </Button>
                <span className="text-sm text-gray-600 dark:text-gray-400 ml-4">
                  (Max: {event.availableSeats} available)
                </span>
              </div>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-4">
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Order Summary</h2>
              
              <div className="mb-4">
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="w-full h-32 object-cover rounded-lg mb-3"
                />
                <h3 className="font-semibold text-gray-900 dark:text-white">{event.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {event.time} • {event.location}
                </p>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Price per ticket</span>
                  <span className="font-semibold text-gray-900 dark:text-white">${event.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Number of tickets</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{numberOfTickets}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t border-gray-200 dark:border-gray-700 pt-3">
                  <span className="text-gray-900 dark:text-white">Total</span>
                  <span className="text-blue-600">${totalAmount}</span>
                </div>
              </div>

              <Button
                onClick={handleSubmit}
                className="w-full mt-6"
                size="lg"
              >
                Complete Booking
              </Button>

              <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
                By completing this booking, you agree to our terms and conditions
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
