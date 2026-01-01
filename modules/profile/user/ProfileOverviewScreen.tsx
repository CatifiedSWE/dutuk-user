'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, MapPin, Calendar, Edit2, LogOut } from 'lucide-react';
import { getCurrentUser, getCustomerProfile, signOut } from '@/lib/auth/customer-auth';
import Image from 'next/image';

interface CustomerProfile {
  user_id: string;
  full_name: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
  profile_photo_url: string | null;
  created_at: string;
}

export default function ProfileOverviewScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const user = await getCurrentUser();
      if (user && user.email) {
        setUserEmail(user.email);
      }
      
      const profileData = await getCustomerProfile();
      setProfile(profileData);
    } catch (err: any) {
      setError(err.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/home');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDF5E6] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7C2A2A]"></div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-[#FDF5E6] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Profile not found'}</p>
          <button
            onClick={() => router.push('/home')}
            className="px-6 py-2 bg-[#7C2A2A] text-white rounded-lg hover:bg-[#5C1A1A] transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDF5E6] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-4xl font-bold text-[#4F0000] mb-2">My Profile</h1>
          <p className="text-gray-600 font-poppins">Manage your account information</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
          {/* Cover Image */}
          <div className="h-32 bg-gradient-to-r from-[#7C2A2A] to-[#5C1A1A]"></div>

          {/* Profile Content */}
          <div className="px-8 pb-8">
            {/* Profile Photo & Name */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-16 mb-6">
              <div className="flex flex-col md:flex-row md:items-end gap-4">
                <div className="relative w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-100">
                  {profile.profile_photo_url ? (
                    <Image
                      src={profile.profile_photo_url}
                      alt={profile.full_name || 'Profile'}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#7C2A2A]/10">
                      <User className="w-16 h-16 text-[#7C2A2A]" />
                    </div>
                  )}
                </div>
                <div className="mb-4">
                  <h2 className="font-display text-3xl font-bold text-gray-900">
                    {profile.full_name || 'User'}
                  </h2>
                  <p className="text-gray-500 font-poppins">Customer Account</p>
                </div>
              </div>
              <button
                onClick={() => router.push('/profile/settings')}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#7C2A2A] text-white rounded-lg hover:bg-[#5C1A1A] transition-colors font-poppins font-medium shadow-md"
              >
                <Edit2 className="w-4 h-4" />
                Edit Profile
              </button>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email */}
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-[#7C2A2A]/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-[#7C2A2A]" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-poppins mb-1">Email Address</p>
                  <p className="text-gray-900 font-poppins font-medium">{userEmail}</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-[#7C2A2A]/10 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-[#7C2A2A]">phone</span>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-poppins mb-1">Phone Number</p>
                  <p className="text-gray-900 font-poppins font-medium">
                    {profile.phone || 'Not provided'}
                  </p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-[#7C2A2A]/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-[#7C2A2A]" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-poppins mb-1">Location</p>
                  <p className="text-gray-900 font-poppins font-medium">
                    {profile.city && profile.state
                      ? `${profile.city}, ${profile.state}`
                      : profile.city || profile.state || 'Not provided'}
                  </p>
                </div>
              </div>

              {/* Member Since */}
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-[#7C2A2A]/10 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 text-[#7C2A2A]" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-poppins mb-1">Member Since</p>
                  <p className="text-gray-900 font-poppins font-medium">
                    {formatDate(profile.created_at)}
                  </p>
                </div>
              </div>
            </div>

            {/* Address Section */}
            {profile.address && (
              <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-500 font-poppins mb-2">Full Address</p>
                <p className="text-gray-900 font-poppins">
                  {profile.address}
                  {profile.city && `, ${profile.city}`}
                  {profile.state && `, ${profile.state}`}
                  {profile.postal_code && ` ${profile.postal_code}`}
                  {profile.country && `, ${profile.country}`}
                </p>
              </div>
            )}

            {/* Logout Button */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-600 hover:text-red-700 font-poppins font-medium transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Logout from Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
