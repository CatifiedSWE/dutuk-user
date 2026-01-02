'use client';

import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Edit2, Calendar as CalendarIcon } from 'lucide-react';

interface BookingConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBookingComplete?: () => void;
  vendorName?: string;
  eventTitle?: string;
}

export function BookingConfirmationModal({
  open,
  onOpenChange,
  onBookingComplete,
  vendorName,
  eventTitle,
}: BookingConfirmationModalProps) {
  const [date, setDate] = useState<Date | undefined>(() => {
    // Default to August 1, 2025
    return new Date(2025, 7, 1);
  });
  const [bookingNotes, setBookingNotes] = useState(
    'Mostly Bollywood + Tamil dance tracks, with some trending EDM for later when everyone is hyped.'
  );

  const handleEditBooking = () => {
    // Mock booking completion
    if (onBookingComplete) {
      onBookingComplete();
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl bg-white/95 backdrop-blur-xl border-[#7C2A2A]/20 rounded-3xl p-8 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-2xl font-bold text-[#7C2A2A] font-serif">
            Booking Confirmation
          </DialogTitle>
          {(vendorName || eventTitle) && (
            <p className="text-gray-600 text-sm mt-2">
              {vendorName || eventTitle}
            </p>
          )}
        </DialogHeader>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Event Description */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-2">
                Words about your booking/event
              </label>
              <textarea
                value={bookingNotes}
                onChange={(e) => setBookingNotes(e.target.value)}
                className="w-full h-40 px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#7C2A2A] focus:border-transparent resize-none text-[#7C2A2A] font-medium text-base"
                placeholder="Add notes about your event..."
              />
            </div>

            {/* Edit Booking Button */}
            <button
              onClick={handleEditBooking}
              className="flex items-center justify-center gap-2 w-full px-6 py-3.5 bg-[#7C2A2A] hover:bg-[#5A1F1F] text-white font-semibold rounded-xl transition-all shadow-lg shadow-[#7C2A2A]/20 active:scale-95"
            >
              <Edit2 className="w-5 h-5" />
              Edit booking
            </button>
          </div>

          {/* Right Column - Calendar */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-4 py-3 bg-[#FDF5E6] rounded-2xl">
              <div className="flex items-center gap-3">
                <span className="text-lg font-semibold text-[#7C2A2A]">
                  {date?.toLocaleDateString('en-US', { month: 'long' })}
                </span>
                <span className="text-lg font-semibold text-[#7C2A2A]">
                  {date?.getFullYear()}
                </span>
              </div>
              <CalendarIcon className="w-5 h-5 text-[#7C2A2A]" />
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-4">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                defaultMonth={new Date(2025, 7, 1)}
                className="w-full"
                classNames={{
                  months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
                  month: 'space-y-4',
                  caption: 'flex justify-center pt-1 relative items-center',
                  caption_label: 'text-sm font-medium hidden',
                  nav: 'space-x-1 flex items-center',
                  nav_button: 'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
                  table: 'w-full border-collapse space-y-1',
                  head_row: 'flex justify-between',
                  head_cell: 'text-gray-500 rounded-md w-9 font-normal text-[0.8rem] flex-1 text-center',
                  row: 'flex w-full mt-2 justify-between',
                  cell: 'text-center text-sm p-0 relative flex-1 [&:has([aria-selected])]:bg-[#7C2A2A] [&:has([aria-selected])]:text-white rounded-full first:[&:has([aria-selected])]:rounded-l-full last:[&:has([aria-selected])]:rounded-r-full focus-within:relative focus-within:z-20',
                  day: 'h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-[#FDF5E6] rounded-full mx-auto',
                  day_selected: 'bg-[#7C2A2A] text-white hover:bg-[#5A1F1F] hover:text-white focus:bg-[#7C2A2A] focus:text-white rounded-full',
                  day_today: 'bg-[#FFC13C] text-[#7C2A2A] font-semibold',
                  day_outside: 'text-gray-400 opacity-50',
                  day_disabled: 'text-gray-400 opacity-50',
                  day_hidden: 'invisible',
                }}
              />
            </div>

            <p className="text-xs text-gray-500 text-center">
              Selected date: {date?.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
