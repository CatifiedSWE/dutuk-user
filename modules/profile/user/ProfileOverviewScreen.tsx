'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, MapPin, Calendar, Edit2, LogOut, Camera, X } from 'lucide-react';
import { getCurrentUser, getCustomerProfile, signOut, updateCustomerProfile } from '@/lib/auth/customer-auth';
import { createClient } from '@/lib/supabase/client';
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
  avatar_url: string | null;
  created_at: string;
}

export default function ProfileOverviewScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');
  const [error, setError] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setUploadError('File size must be less than 5MB');
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setUploadError('Please upload a valid image file (JPEG, PNG, WebP, or GIF)');
      return;
    }

    setUploadError('');
    setSelectedFile(file);

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadPhoto = async () => {
    if (!selectedFile) {
      setUploadError('Please select a photo');
      return;
    }

    setUploading(true);
    setUploadError('');

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('Not authenticated');

      // Delete old photo if exists
      if (profile?.profile_photo_url) {
        try {
          const oldPath = profile.profile_photo_url.split('/customer-profile-images/')[1];
          if (oldPath) {
            await supabase.storage
              .from('customer-profile-images')
              .remove([oldPath]);
          }
        } catch (deleteErr) {
          console.log('Could not delete old photo:', deleteErr);
        }
      }

      // Upload new photo
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `profile-photos/${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('customer-profile-images')
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error(uploadError.message || 'Failed to upload photo');
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('customer-profile-images')
        .getPublicUrl(filePath);

      // Update profile with photo URL
      await updateCustomerProfile({ profile_photo_url: publicUrl });

      // Refresh profile data
      await fetchProfileData();

      // Close modal and reset state
      setShowUploadModal(false);
      setPreview(null);
      setSelectedFile(null);
    } catch (err: any) {
      console.error('Error uploading photo:', err);
      setUploadError(err.message || 'Failed to upload photo. Please try again.');
    } finally {
      setUploading(false);
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
                <div className="relative w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-100 group">
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
                  {/* Camera overlay on hover */}
                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                  >
                    <Camera className="w-8 h-8 text-white" />
                  </button>
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

      {/* Upload Photo Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="font-display text-2xl font-bold text-gray-900">Update Profile Photo</h3>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setPreview(null);
                  setSelectedFile(null);
                  setUploadError('');
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {uploadError && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{uploadError}</p>
                </div>
              )}

              <div className="space-y-4">
                {preview ? (
                  <div className="relative w-full h-64 border-2 border-gray-200 rounded-lg overflow-hidden">
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        setPreview(null);
                        setSelectedFile(null);
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label
                    className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-200 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-[#7C2A2A]/5 hover:border-[#7C2A2A] transition-all duration-300 group"
                    htmlFor="photo-upload"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform duration-300">
                        <Camera className="w-8 h-8 text-gray-400 group-hover:text-[#7C2A2A] transition-colors" />
                      </div>
                      <p className="mb-2 text-sm text-gray-500 text-center">
                        <span className="font-semibold text-[#7C2A2A]">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-400">PNG, JPG, WebP or GIF (MAX. 5MB)</p>
                    </div>
                    <input
                      id="photo-upload"
                      type="file"
                      className="hidden"
                      accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                      onChange={handleFileChange}
                      disabled={uploading}
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setPreview(null);
                  setSelectedFile(null);
                  setUploadError('');
                }}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-poppins font-medium"
                disabled={uploading}
              >
                Cancel
              </button>
              <button
                onClick={handleUploadPhoto}
                className="flex-1 px-4 py-2.5 bg-[#7C2A2A] text-white rounded-lg hover:bg-[#5C1A1A] transition-colors font-poppins font-medium shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={uploading || !selectedFile}
              >
                {uploading ? 'Uploading...' : 'Upload Photo'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
