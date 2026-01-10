'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Calendar as CalendarIcon, Send, CheckCircle2, AlertCircle, Clock, Edit3, Loader2 } from 'lucide-react';
import { useCreateOrder } from '@/hooks/useOrders';
import { useVendorAvailability } from '@/hooks/useVendorAvailability';
import { toast } from 'sonner';

interface BookingConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBookingComplete?: () => void;
  vendorId?: string;
  vendorName?: string;
  eventTitle?: string;
}

export function BookingConfirmationModal({
  open,
  onOpenChange,
  onBookingComplete,
  vendorId,
  vendorName,
  eventTitle,
}: BookingConfirmationModalProps) {
  const router = useRouter();
  const { createOrder, loading: creatingOrder } = useCreateOrder();
  const {
    blockedDates,
    availableDates,
    loading: loadingAvailability,
    isDateBlocked,
    getBlockReason,
    getBlockedDateObjects
  } = useVendorAvailability(vendorId);

  // Set default date to tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const [date, setDate] = useState<Date | undefined>(tomorrow);
  const [customEventTitle, setCustomEventTitle] = useState('');
  const [bookingNotes, setBookingNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Max title length to prevent UI overflow
  const MAX_TITLE_LENGTH = 50;

  // Get today's date at midnight for comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Compute disabled dates: past dates + vendor blocked dates
  const disabledDates = useMemo(() => {
    const blockedDateObjects = getBlockedDateObjects();
    return [
      { before: today }, // Disable past dates
      ...blockedDateObjects, // Disable vendor blocked dates
    ];
  }, [today, getBlockedDateObjects]);

  // Handle date selection with availability check
  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate && isDateBlocked(selectedDate)) {
      const reason = getBlockReason(selectedDate);
      if (reason === 'booked') {
        toast.error('This date is already booked');
      } else {
        toast.error('Vendor is unavailable on this date');
      }
      return;
    }
    setDate(selectedDate);
  };

  const handleConfirmBooking = async () => {
    if (!date) {
      toast.error('Please select a date for your booking');
      return;
    }

    // Double-check availability
    if (isDateBlocked(date)) {
      toast.error('This date is not available. Please select another date.');
      return;
    }

    if (!vendorId) {
      toast.error('Unable to process booking. Please try again.');
      console.error('No vendorId provided to BookingConfirmationModal');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create order (NOT conversation) - vendor must accept first
      // Use custom title if provided, otherwise use a descriptive default
      const orderTitle = customEventTitle.trim() || `Event on ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;

      const result = await createOrder({
        vendorId,
        eventDate: date,
        notes: bookingNotes || undefined,
        title: orderTitle,
      });

      if (!result.success) {
        throw new Error(result.error || 'Failed to create booking');
      }

      // Call the completion callback
      if (onBookingComplete) {
        onBookingComplete();
      }

      // Close the modal
      onOpenChange(false);

      // Show success message
      toast.success('Booking request sent!', {
        description: `${vendorName || 'Vendor'} will review your request and accept or decline. You'll be notified when they respond!`,
        icon: <Clock className="w-5 h-5 text-amber-500" />,
        duration: 6000,
      });

      // Stay on current page (don't navigate away) - vendor profile is still useful
      // The user can check their bookings later from the profile/orders page
    } catch (error: any) {
      console.error('Error creating booking:', error);
      toast.error(error.message || 'Failed to send booking request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl bg-white/98 backdrop-blur-2xl border-[#7C2A2A]/10 rounded-3xl p-0 max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-[#7C2A2A] to-[#A84444] px-8 py-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white font-serif">
              Book {vendorName || 'Vendor'}
            </DialogTitle>
            {eventTitle && (
              <p className="text-white/80 text-sm mt-1">
                {eventTitle}
              </p>
            )}
          </DialogHeader>
        </div>

        <div className="p-8 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Two-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Event Details */}
            <div className="space-y-6">
              {/* Event Title Input - NEW */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  <Edit3 className="w-4 h-4 inline mr-2" />
                  Event Title
                </label>
                <input
                  type="text"
                  value={customEventTitle}
                  onChange={(e) => setCustomEventTitle(e.target.value.slice(0, MAX_TITLE_LENGTH))}
                  className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#7C2A2A] focus:border-transparent text-gray-700 text-base transition-all placeholder:text-gray-400 hover:border-gray-300"
                  placeholder="e.g., Wedding Reception, Birthday Party..."
                  maxLength={MAX_TITLE_LENGTH}
                />
                <p className="text-xs text-gray-400 mt-2 flex justify-between">
                  <span>A short title to help the vendor identify your booking</span>
                  <span className={customEventTitle.length >= MAX_TITLE_LENGTH - 5 ? 'text-amber-500' : ''}>
                    {customEventTitle.length}/{MAX_TITLE_LENGTH}
                  </span>
                </p>
              </div>

              {/* Event Notes */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Tell us about your event
                </label>
                <textarea
                  value={bookingNotes}
                  onChange={(e) => setBookingNotes(e.target.value)}
                  className="w-full h-36 px-5 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#7C2A2A] focus:border-transparent resize-none text-gray-700 text-base leading-relaxed transition-all placeholder:text-gray-400 hover:border-gray-300"
                  placeholder="Share details about your event: music preferences, special requirements, budget range, expected guest count, etc."
                />
                <p className="text-xs text-gray-400 mt-2">
                  This helps the vendor understand your needs better
                </p>
              </div>

              {/* Info Card - Updated messaging */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/50 rounded-2xl p-5">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-800">How it works</p>
                    <ul className="text-xs text-amber-700 mt-2 space-y-1 leading-relaxed">
                      <li>1. Your booking request will be sent to {vendorName || 'the vendor'}</li>
                      <li>2. Wait for them to accept your request</li>
                      <li>3. Once accepted, you can chat to finalize details</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Confirm Booking Button */}
              <button
                onClick={handleConfirmBooking}
                disabled={isSubmitting || creatingOrder || !date}
                className="flex items-center justify-center gap-3 w-full px-6 py-4 bg-gradient-to-r from-[#7C2A2A] to-[#A84444] hover:from-[#5A1F1F] hover:to-[#7C2A2A] text-white font-semibold rounded-2xl transition-all shadow-lg shadow-[#7C2A2A]/25 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100"
              >
                {isSubmitting || creatingOrder ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending Request...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Booking Request
                  </>
                )}
              </button>
            </div>

            {/* Right Column - Enhanced Calendar */}
            <div className="space-y-4">
              {/* Month/Year Header */}
              <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-[#FDF5E6] to-[#FEF3E2] rounded-2xl border border-[#F5E6D3]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <CalendarIcon className="w-5 h-5 text-[#7C2A2A]" />
                  </div>
                  <div>
                    <span className="text-lg font-bold text-[#7C2A2A]">
                      {date?.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) || 'Select a date'}
                    </span>
                    <p className="text-xs text-[#7C2A2A]/60">Choose your event date</p>
                  </div>
                </div>
              </div>

              {/* Calendar Container */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                {loadingAvailability ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-6 h-6 animate-spin text-[#7C2A2A]" />
                    <span className="ml-2 text-gray-500">Loading availability...</span>
                  </div>
                ) : (
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateSelect}
                    defaultMonth={date}
                    disabled={disabledDates}
                    modifiers={{
                      available: availableDates.map(d => new Date(d + 'T00:00:00')),
                      blocked: blockedDates.map(b => new Date(b.date + 'T00:00:00')),
                    }}
                    modifiersClassNames={{
                      available: 'ring-2 ring-green-400 ring-inset bg-green-50 text-green-700 font-semibold',
                      blocked: 'bg-red-100 text-red-400 line-through',
                    }}
                    className="w-full"
                    classNames={{
                      months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
                      month: 'space-y-4 w-full',
                      caption: 'flex justify-center pt-1 relative items-center',
                      caption_label: 'text-sm font-semibold text-gray-700',
                      nav: 'space-x-1 flex items-center',
                      button_previous: 'h-8 w-8 bg-gray-100 hover:bg-gray-200 rounded-lg p-0 opacity-70 hover:opacity-100 transition-all',
                      button_next: 'h-8 w-8 bg-gray-100 hover:bg-gray-200 rounded-lg p-0 opacity-70 hover:opacity-100 transition-all',
                      table: 'w-full border-collapse',
                      weekdays: 'flex justify-between mb-2',
                      weekday: 'text-gray-400 rounded-md w-10 font-medium text-[0.75rem] uppercase tracking-wide flex-1 text-center',
                      week: 'flex w-full mt-1 justify-between',
                      day: 'text-center text-sm p-0 relative flex-1 [&:has([aria-selected])]:bg-[#7C2A2A]/10 rounded-xl',
                      range_start: 'day-range-start',
                      range_end: 'day-range-end',
                      selected: 'bg-[#7C2A2A] text-white hover:bg-[#5A1F1F] hover:text-white focus:bg-[#7C2A2A] focus:text-white rounded-xl font-semibold shadow-lg shadow-[#7C2A2A]/30',
                      today: 'bg-[#FFC13C]/20 text-[#7C2A2A] font-bold ring-2 ring-[#FFC13C] ring-inset rounded-xl',
                      outside: 'text-gray-300 opacity-50',
                      disabled: 'text-gray-300 opacity-40 cursor-not-allowed hover:bg-transparent',
                      hidden: 'invisible',
                    }}
                  />
                )}
              </div>

              {/* Selected Date Display */}
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Selected date:</span>
                  <span className="text-sm font-semibold text-[#7C2A2A]">
                    {date?.toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) || 'No date selected'}
                  </span>
                </div>
              </div>

              {/* Calendar Legend */}
              <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-green-50 ring-2 ring-green-400 ring-inset"></div>
                  <span>Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-red-100"></div>
                  <span>Unavailable</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-[#7C2A2A]"></div>
                  <span>Selected</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
