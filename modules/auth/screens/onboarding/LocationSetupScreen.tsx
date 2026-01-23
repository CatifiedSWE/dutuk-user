'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProgressIndicator } from '@/modules/common/shared-ui/ProgressIndicator';
import { updateCustomerProfile } from '@/lib/auth/customer-auth';

export function LocationSetupScreen() {
  const router = useRouter();
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Check auth status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { getCurrentUser } = await import('@/lib/auth/customer-auth');
        const user = await getCurrentUser();
        if (!user) {
          setError('Session expired. Please log in again.');
          setTimeout(() => router.push('/login'), 2000);
        }
      } catch (err) {
        setError('Session expired. Please log in again.');
        setTimeout(() => router.push('/login'), 2000);
      } finally {
        setIsCheckingAuth(false);
      }
    };
    checkAuth();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await updateCustomerProfile({ 
        address,
        city,
        postal_code: postalCode
      });
      router.push('/onboarding/photo');
    } catch (err: any) {
      if (err.message?.includes('Not authenticated') || err.message?.includes('session')) {
        setError('Session expired. Please log in again.');
        setTimeout(() => router.push('/login'), 2000);
      } else {
        setError(err.message || 'Failed to save location');
      }
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while checking auth
  if (isCheckingAuth) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#8B0000] border-r-transparent"></div>
          <p className="mt-4 text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(#8B0000_0.5px,transparent_0.5px)] [background-size:24px_24px] opacity-5"></div>
        <div className="absolute top-0 left-0 w-[40rem] h-[40rem] bg-red-100 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 opacity-60"></div>
        <div className="absolute bottom-0 right-0 w-[40rem] h-[40rem] bg-orange-50 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 opacity-60"></div>
      </div>

      {/* Main card */}
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] grid grid-cols-1 lg:grid-cols-2 overflow-hidden z-10 relative border border-gray-100">
        {/* Left decorative panel */}
        <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-red-50 via-white to-red-50 p-12 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#8B0000]/5 rounded-full blur-2xl"></div>
          
          <div className="relative z-10">
            <h2 className="font-['Playfair_Display'] text-2xl font-bold text-[#8B0000] tracking-wide">DUIUK</h2>
          </div>

          <div className="relative z-10 flex-grow flex items-center justify-center py-12">
            <div className="relative w-64 h-80">
              <div className="absolute inset-0 bg-white/40 backdrop-blur-sm border border-white/60 rounded-2xl shadow-lg transform -rotate-6 transition-transform duration-700 hover:-rotate-3"></div>
              <div className="absolute inset-0 bg-white/80 backdrop-blur-md border border-white/80 rounded-2xl shadow-xl transform rotate-3 flex flex-col items-center justify-center p-8 text-center transition-transform duration-700 hover:rotate-0">
                <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4 text-[#8B0000]">
                  <span className="material-symbols-outlined">place</span>
                </div>
                <h3 className="font-['Playfair_Display'] font-bold text-xl text-gray-900 mb-2">Location Services</h3>
                <p className="text-xs text-gray-500 font-sans leading-relaxed">Enable location services to get personalized recommendations and connect with people near you.</p>
              </div>
            </div>
          </div>

          <div className="relative z-10">
            <p className="text-sm text-gray-500 font-medium">Your privacy is protected.</p>
            <ProgressIndicator currentStep={2} totalSteps={3} />
          </div>
        </div>

        {/* Right form panel */}
        <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-white relative">
          <div className="mb-8">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-6 text-[#8B0000]">
              <span className="material-symbols-outlined">add_location_alt</span>
            </div>
            <h1 className="font-['Playfair_Display'] text-3xl md:text-4xl font-bold text-gray-900 mb-3">Location Setup</h1>
            <p className="text-[#6B7280] leading-relaxed">
              Please provide your location to customize your <br />
              <span className="font-semibold text-gray-900">local experience</span>.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="address">
                Address Line
              </label>
              <input
                className="w-full h-12 px-4 border border-gray-200 rounded-lg bg-[#F3F4F6] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#8B0000]/20 focus:border-[#8B0000] transition-all duration-200 shadow-sm"
                id="address"
                name="address"
                placeholder="123 Main St"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="city">
                  City
                </label>
                <input
                  className="w-full h-12 px-4 border border-gray-200 rounded-lg bg-[#F3F4F6] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#8B0000]/20 focus:border-[#8B0000] transition-all duration-200 shadow-sm"
                  id="city"
                  name="city"
                  placeholder="City"
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="zip">
                  Zip Code
                </label>
                <input
                  className="w-full h-12 px-4 border border-gray-200 rounded-lg bg-[#F3F4F6] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#8B0000]/20 focus:border-[#8B0000] transition-all duration-200 shadow-sm"
                  id="zip"
                  name="zip"
                  placeholder="Zip Code"
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-lg shadow-md shadow-[#8B0000]/20 text-sm font-semibold text-white bg-[#8B0000] hover:bg-[#660000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B0000] transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Location'}
              </button>
            </div>
          </form>

          <div className="mt-8 relative">
            <div aria-hidden="true" className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-400 font-medium text-xs">Step 2 of 3</span>
            </div>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => router.push('/onboarding/photo')}
              className="inline-flex items-center justify-center text-sm font-semibold text-gray-500 hover:text-[#8B0000] transition-colors group"
              type="button"
            >
              Skip for now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
