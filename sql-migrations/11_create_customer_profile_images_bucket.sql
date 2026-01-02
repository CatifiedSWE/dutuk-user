-- =====================================================
-- Migration: Create Customer Profile Images Storage Bucket
-- Description: Creates a Supabase Storage bucket for customer profile photos
--              with proper RLS policies for security
-- Date: 2025
-- =====================================================

-- Note: Storage buckets are created through Supabase Storage API or Dashboard
-- This file documents the required configuration

-- ====================
-- BUCKET CONFIGURATION
-- ====================
-- Bucket Name: customer-profile-images
-- Public: true (allow public read access for profile images)
-- File Size Limit: 5MB
-- Allowed MIME Types: image/jpeg, image/jpg, image/png, image/webp, image/gif

-- ====================
-- MANUAL STEPS REQUIRED
-- ====================
-- Execute these steps in Supabase Dashboard -> Storage:
--
-- 1. Create new bucket:
--    - Name: customer-profile-images
--    - Public: YES (check the box)
--    - File size limit: 5242880 (5MB in bytes)
--    - Allowed MIME types: image/jpeg,image/jpg,image/png,image/webp,image/gif
--
-- 2. Apply RLS Policies (copy-paste in SQL Editor):

-- ====================
-- RLS POLICIES
-- ====================

-- Policy 1: Allow authenticated users to upload their own profile images
CREATE POLICY "Users can upload their own profile images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'customer-profile-images' AND
  (storage.foldername(name))[1] = 'profile-photos' AND
  auth.uid()::text = (storage.foldername(name))[2]
);

-- Policy 2: Allow authenticated users to update their own profile images
CREATE POLICY "Users can update their own profile images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'customer-profile-images' AND
  (storage.foldername(name))[1] = 'profile-photos' AND
  auth.uid()::text = (storage.foldername(name))[2]
)
WITH CHECK (
  bucket_id = 'customer-profile-images' AND
  (storage.foldername(name))[1] = 'profile-photos' AND
  auth.uid()::text = (storage.foldername(name))[2]
);

-- Policy 3: Allow authenticated users to delete their own profile images
CREATE POLICY "Users can delete their own profile images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'customer-profile-images' AND
  (storage.foldername(name))[1] = 'profile-photos' AND
  auth.uid()::text = (storage.foldername(name))[2]
);

-- Policy 4: Allow public read access to all profile images
CREATE POLICY "Public users can view profile images"
ON storage.objects
FOR SELECT
TO public
USING (
  bucket_id = 'customer-profile-images'
);

-- ====================
-- FILE PATH STRUCTURE
-- ====================
-- Files will be stored as:
-- customer-profile-images/profile-photos/{user_id}/{filename}
--
-- Example:
-- customer-profile-images/profile-photos/a1b2c3d4-e5f6-7890-abcd-ef1234567890/1234567890.jpg
--
-- This structure ensures:
-- - Easy organization by user
-- - RLS policies can validate ownership
-- - Users can only access their own folder

-- ====================
-- TESTING QUERIES
-- ====================
-- After creating the bucket, test with these queries:

-- Check if bucket exists:
-- SELECT * FROM storage.buckets WHERE name = 'customer-profile-images';

-- List all policies for the bucket:
-- SELECT * FROM pg_policies WHERE tablename = 'objects' AND policyname LIKE '%profile images%';

-- Check uploaded files:
-- SELECT * FROM storage.objects WHERE bucket_id = 'customer-profile-images' LIMIT 10;

-- ====================
-- ROLLBACK (if needed)
-- ====================
-- DROP POLICY IF EXISTS "Users can upload their own profile images" ON storage.objects;
-- DROP POLICY IF EXISTS "Users can update their own profile images" ON storage.objects;
-- DROP POLICY IF EXISTS "Users can delete their own profile images" ON storage.objects;
-- DROP POLICY IF EXISTS "Public users can view profile images" ON storage.objects;
-- -- Then delete bucket from Supabase Dashboard
