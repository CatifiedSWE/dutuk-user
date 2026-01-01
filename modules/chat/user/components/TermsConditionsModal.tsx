/**
 * Terms & Conditions Modal
 * Displays T&C alert before user sends first message to a vendor
 * Enforces Dutuk's policy on contact information sharing
 */

'use client';

import React from 'react';
import { X } from 'lucide-react';

interface TermsConditionsModalProps {
  isOpen: boolean;
  vendorName: string;
  onAccept: () => void;
  onDecline: () => void;
  onClose: () => void;
}

export default function TermsConditionsModal({
  isOpen,
  vendorName,
  onAccept,
  onDecline,
  onClose,
}: TermsConditionsModalProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div 
          className="bg-white rounded-2xl shadow-2xl max-w-lg w-full pointer-events-auto animate-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative px-6 pt-6 pb-4 border-b border-gray-100">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Warning Icon */}
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                <svg 
                  className="w-6 h-6 text-amber-600" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" 
                    clipRule="evenodd" 
                  />
                </svg>
              </div>
              
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Terms & Conditions Alert
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  Before messaging {vendorName}
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-5">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5">
              <p className="text-gray-800 leading-relaxed">
                According to <span className="font-semibold">Dutuk Terms and Conditions</span>, you're not allowed to share any kind of contact information like <span className="font-semibold">phone number, email, social media handles, or messaging apps</span> through chat until payment is completed.
              </p>
            </div>

            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start gap-2">
                <div className="flex-shrink-0 w-5 h-5 bg-[#7C2A2A]/10 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-[#7C2A2A] text-xs">✓</span>
                </div>
                <p>All communication must remain within Dutuk platform</p>
              </div>
              
              <div className="flex items-start gap-2">
                <div className="flex-shrink-0 w-5 h-5 bg-[#7C2A2A]/10 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-[#7C2A2A] text-xs">✓</span>
                </div>
                <p>Contact sharing is enabled after booking payment</p>
              </div>
              
              <div className="flex items-start gap-2">
                <div className="flex-shrink-0 w-5 h-5 bg-[#7C2A2A]/10 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-[#7C2A2A] text-xs">✓</span>
                </div>
                <p>This protects both customers and vendors</p>
              </div>
            </div>

            {/* Terms Link */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <a
                href="#" // TODO: Replace with actual T&C page when ready
                onClick={(e) => {
                  e.preventDefault();
                  // Placeholder for T&C page navigation
                  alert('Terms & Conditions page coming soon!');
                }}
                className="text-[#7C2A2A] hover:text-[#5A1F1F] font-medium text-sm underline transition-colors"
              >
                Read our full Terms & Conditions
              </a>
            </div>
          </div>

          {/* Footer - Action Buttons */}
          <div className="px-6 py-4 bg-gray-50 rounded-b-2xl flex gap-3">
            <button
              onClick={onDecline}
              className="flex-1 px-4 py-2.5 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all"
            >
              Decline
            </button>
            
            <button
              onClick={onAccept}
              className="flex-1 px-4 py-2.5 bg-[#7C2A2A] text-white font-semibold rounded-xl hover:bg-[#5A1F1F] transition-all shadow-md hover:shadow-lg"
            >
              Accept & Continue
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
