'use client';

import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface TermsConditionsModalProps {
  isOpen: boolean;
  onAccept: () => void;
  onDecline: () => void;
  onClose: () => void;
}

export default function TermsConditionsModal({
  isOpen,
  onAccept,
  onDecline,
  onClose,
}: TermsConditionsModalProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] animate-in fade-in duration-200"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
        <div 
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>

          {/* Warning Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-amber-600" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">
            Terms & Conditions Alert
          </h2>

          {/* Message */}
          <p className="text-gray-600 text-center mb-6 leading-relaxed">
            According to Dutuk Terms and Conditions, you are <strong>not allowed</strong> to share any kind of contact information like phone number, email, social media handles, etc., through chat or call until payment is completed.
          </p>

          {/* Why Section */}
          <div className="bg-[#FDF5E6] border border-[#FFC13C]/20 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-700 leading-relaxed">
              <strong className="text-[#7C2A2A]">Why?</strong> This protects both parties and ensures all transactions are secure through the Dutuk platform. Once payment is completed, you can freely share contact information.
            </p>
          </div>

          {/* T&C Link */}
          <div className="text-center mb-6">
            <a
              href="/terms-and-conditions"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#7C2A2A] hover:text-[#5e0000] font-medium underline text-sm"
            >
              Read our Terms & Conditions
            </a>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onDecline}
              className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors"
            >
              Decline
            </button>
            <button
              onClick={onAccept}
              className="flex-1 px-6 py-3 bg-[#7C2A2A] hover:bg-[#5e0000] text-white font-medium rounded-xl transition-colors shadow-lg shadow-[#7C2A2A]/20"
            >
              Accept & Continue
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
