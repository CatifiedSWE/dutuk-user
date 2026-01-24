'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, MapPin, Calendar, Edit2, Camera, X, Sparkles, TrendingUp, Heart } from 'lucide-react';
import { getCurrentUser, getCustomerProfile, updateCustomerProfile } from '@/lib/auth/customer-auth';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';
import { motion } from 'framer-motion';

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
  const [googleAvatar, setGoogleAvatar] = useState<string | null>(null);
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
        // Get Google Auth avatar if available
        if (user.user_metadata?.avatar_url) {
          setGoogleAvatar(user.user_metadata.avatar_url);
        }
      }

      const profileData = await getCustomerProfile();
      setProfile(profileData);
    } catch (err: any) {
      setError(err.message || 'Failed to load profile');
    } finally {
      setLoading(false);
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
      if (profile?.avatar_url) {
        try {
          const oldPath = profile.avatar_url.split('/customer-profile-images/')[1];
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
      await updateCustomerProfile({ avatar_url: publicUrl });

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
      <div className="min-h-screen bg-gradient-to-br from-[#FDF5E6] via-[#FFF8F0] to-[#FDF5E6] flex items-center justify-center">
        <motion.div
          className="relative"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-16 h-16 border-4 border-[#7C2A2A]/20 border-t-[#7C2A2A] rounded-full"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-amber-500/40 rounded-full animate-ping"></div>
        </motion.div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FDF5E6] via-[#FFF8F0] to-[#FDF5E6] flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-red-600 mb-6 font-poppins text-lg">{error || 'Profile not found'}</p>
          <button
            onClick={() => router.push('/home')}
            className="px-8 py-3 bg-gradient-to-r from-[#7C2A2A] to-[#4F0000] text-white rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 font-poppins font-semibold"
          >
            Go to Home
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDF5E6] via-[#FFF8F0] to-[#FDF5E6] py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-display text-5xl font-bold bg-gradient-to-r from-[#4F0000] via-[#7C2A2A] to-[#4F0000] bg-clip-text text-transparent mb-3">
            My Profile
          </h1>
          <p className="text-gray-600 font-poppins text-lg">Manage your account information and preferences</p>
        </motion.div>

        {/* Main Profile Card */}
        <motion.div
          className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/50 mb-8"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          {/* Enhanced Cover with Mesh Pattern */}
          <div className="h-40 bg-gradient-to-r from-[#7C2A2A] via-[#5C1A1A] to-[#4F0000] relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE4YzMuMzEzIDAgNiAyLjY4NiA2IDZzLTIuNjg3IDYtNiA2LTYtMi42ODYtNi02IDIuNjg3LTYgNi02ek0yNCA2YzMuMzEzIDAgNiAyLjY4NiA2IDZzLTIuNjg3IDYtNiA2LTYtMi42ODYtNi02IDIuNjg3LTYgNi02eiIvPjwvZz48L2c+PC9zdmc+')] opacity-40"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10"></div>
            {/* Floating particles */}
            <div className="absolute top-4 right-4 w-2 h-2 bg-white/30 rounded-full animate-pulse"></div>
            <div className="absolute top-10 right-20 w-1 h-1 bg-amber-300/40 rounded-full animate-ping"></div>
            <div className="absolute bottom-6 left-10 w-1.5 h-1.5 bg-white/20 rounded-full animate-pulse delay-100"></div>
          </div>

          {/* Profile Content */}
          <div className="px-8 pb-10">
            {/* Profile Photo & Name with Enhanced Glassmorphism */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-20 mb-8">
              <div className="flex flex-col md:flex-row md:items-end gap-5">
                <motion.div
                  className="relative w-36 h-36 rounded-3xl border-4 border-white shadow-2xl overflow-hidden bg-gradient-to-br from-[#7C2A2A]/10 to-white group"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {(profile.avatar_url || googleAvatar) ? (
                    <Image
                      src={profile.avatar_url || googleAvatar || ''}
                      alt={profile.full_name || 'Profile'}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#7C2A2A]/20 to-[#4F0000]/20">
                      <User className="w-20 h-20 text-[#7C2A2A]" />
                    </div>
                  )}
                  {/* Camera overlay with glassmorphism */}
                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer"
                  >
                    <Camera className="w-10 h-10 text-white mb-2" />
                    <span className="text-white text-xs font-poppins font-medium">Change Photo</span>
                  </button>
                </motion.div>
                <div className="mb-2">
                  <h2 className="font-display text-4xl font-bold text-gray-900 mb-2">
                    {profile.full_name || 'User'}
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 text-emerald-700 rounded-full font-poppins text-sm font-medium border border-emerald-500/20">
                      ✓ Verified Account
                    </span>
                  </div>
                </div>
              </div>
              <motion.button
                onClick={() => router.push('/profile/settings')}
                className="flex items-center gap-2 px-7 py-3 bg-gradient-to-r from-[#7C2A2A] to-[#4F0000] text-white rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 font-poppins font-semibold shadow-lg group"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Edit2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                Edit Profile
              </motion.button>
            </div>

            {/* Enhanced Info Grid with Gradient Borders */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
              {/* Email */}
              <motion.div
                className="relative p-5 bg-gradient-to-br from-white to-gray-50/50 rounded-2xl border-2 border-transparent hover:border-[#7C2A2A]/20 transition-all duration-300 group overflow-hidden"
                whileHover={{ y: -4 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#7C2A2A]/0 to-[#7C2A2A]/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7C2A2A]/20 to-[#4F0000]/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Mail className="w-6 h-6 text-[#7C2A2A]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 font-poppins mb-1.5 uppercase tracking-wide">Email Address</p>
                    <p className="text-gray-900 font-poppins font-semibold text-sm">{userEmail}</p>
                  </div>
                </div>
              </motion.div>

              {/* Phone */}
              <motion.div
                className="relative p-5 bg-gradient-to-br from-white to-gray-50/50 rounded-2xl border-2 border-transparent hover:border-amber-500/20 transition-all duration-300 group overflow-hidden"
                whileHover={{ y: -4 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-amber-700 text-2xl">phone</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 font-poppins mb-1.5 uppercase tracking-wide">Phone Number</p>
                    <p className="text-gray-900 font-poppins font-semibold text-sm">
                      {profile.phone || 'Not provided'}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Location */}
              <motion.div
                className="relative p-5 bg-gradient-to-br from-white to-gray-50/50 rounded-2xl border-2 border-transparent hover:border-blue-500/20 transition-all duration-300 group overflow-hidden"
                whileHover={{ y: -4 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <MapPin className="w-6 h-6 text-blue-700" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 font-poppins mb-1.5 uppercase tracking-wide">Location</p>
                    <p className="text-gray-900 font-poppins font-semibold text-sm">
                      {profile.city && profile.state
                        ? `${profile.city}, ${profile.state}`
                        : profile.city || profile.state || 'Not provided'}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Member Since */}
              <motion.div
                className="relative p-5 bg-gradient-to-br from-white to-gray-50/50 rounded-2xl border-2 border-transparent hover:border-purple-500/20 transition-all duration-300 group overflow-hidden"
                whileHover={{ y: -4 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Calendar className="w-6 h-6 text-purple-700" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 font-poppins mb-1.5 uppercase tracking-wide">Member Since</p>
                    <p className="text-gray-900 font-poppins font-semibold text-sm">
                      {formatDate(profile.created_at)}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Address Section with Premium Style */}
            {profile.address && (
              <motion.div
                className="p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl border-2 border-gray-100 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <p className="text-xs text-gray-500 font-poppins mb-3 uppercase tracking-wide flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Full Address
                </p>
                <p className="text-gray-900 font-poppins font-medium leading-relaxed">
                  {profile.address}
                  {profile.city && `, ${profile.city}`}
                  {profile.state && `, ${profile.state}`}
                  {profile.postal_code && ` ${profile.postal_code}`}
                  {profile.country && `, ${profile.country}`}
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <motion.div
            className="p-6 bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 hover:shadow-2xl hover:scale-105 transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold font-display text-gray-900">0</p>
                <p className="text-sm text-gray-600 font-poppins">Total Bookings</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="p-6 bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 hover:shadow-2xl hover:scale-105 transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold font-display text-gray-900">0</p>
                <p className="text-sm text-gray-600 font-poppins">Reviews Given</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="p-6 bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 hover:shadow-2xl hover:scale-105 transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center shadow-lg">
                <Heart className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold font-display text-gray-900">0</p>
                <p className="text-sm text-gray-600 font-poppins">Favorites</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Upload Photo Modal - Enhanced */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <motion.div
            className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-[#7C2A2A]/5 to-transparent">
              <h3 className="font-display text-2xl font-bold text-gray-900">Update Profile Photo</h3>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setPreview(null);
                  setSelectedFile(null);
                  setUploadError('');
                }}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {uploadError && (
                <div className="mb-4 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
                  <p className="text-sm text-red-600 font-poppins">{uploadError}</p>
                </div>
              )}

              <div className="space-y-4">
                {preview ? (
                  <div className="relative w-full h-72 border-2 border-gray-200 rounded-2xl overflow-hidden">
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        setPreview(null);
                        setSelectedFile(null);
                      }}
                      className="absolute top-3 right-3 bg-red-500 text-white rounded-full p-2.5 hover:bg-red-600 transition-all shadow-lg hover:scale-110"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <label
                    className="flex flex-col items-center justify-center w-full h-72 border-2 border-[#7C2A2A]/20 border-dashed rounded-2xl cursor-pointer bg-gradient-to-br from-[#7C2A2A]/5 to-transparent hover:from-[#7C2A2A]/10 hover:border-[#7C2A2A]/40 transition-all duration-300 group"
                    htmlFor="photo-upload"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <div className="w-20 h-20 rounded-2xl bg-white flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Camera className="w-10 h-10 text-[#7C2A2A] group-hover:text-[#4F0000] transition-colors" />
                      </div>
                      <p className="mb-2 text-sm text-gray-600 text-center font-poppins">
                        <span className="font-semibold text-[#7C2A2A]">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-400 font-poppins">PNG, JPG, WebP or GIF (MAX. 5MB)</p>
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
            <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setPreview(null);
                  setSelectedFile(null);
                  setUploadError('');
                }}
                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-all font-poppins font-semibold"
                disabled={uploading}
              >
                Cancel
              </button>
              <button
                onClick={handleUploadPhoto}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-[#7C2A2A] to-[#4F0000] text-white rounded-xl hover:shadow-2xl hover:scale-105 transition-all font-poppins font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                disabled={uploading || !selectedFile}
              >
                {uploading ? 'Uploading...' : 'Upload Photo'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
