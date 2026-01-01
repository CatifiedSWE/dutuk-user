'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function ProfileSettingsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#FDF5E6] flex items-center justify-center py-12 px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-[#7C2A2A]/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="material-symbols-outlined text-[#7C2A2A] text-5xl">construction</span>
        </div>
        <h1 className="font-display text-3xl font-bold text-[#4F0000] mb-4">Coming Soon</h1>
        <p className="text-gray-600 font-poppins mb-8">
          Profile settings page is under construction. You'll be able to edit your profile information here soon.
        </p>
        <button
          onClick={() => router.push('/profile/overview')}
          className="px-6 py-3 bg-[#7C2A2A] text-white rounded-lg hover:bg-[#5C1A1A] transition-colors font-poppins font-medium"
        >
          Back to Profile
        </button>
      </div>
    </div>
  );
}
