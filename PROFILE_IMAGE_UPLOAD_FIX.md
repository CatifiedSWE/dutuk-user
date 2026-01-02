# Profile Image Upload Fix - Implementation Guide

## 📋 Overview

This document describes the fixes implemented for the profile image upload error during onboarding and the addition of profile image update functionality.

---

## 🐛 Issues Fixed

### 1. **Onboarding Photo Upload Error**
- **Problem**: Users encountered errors when uploading photos during onboarding
- **Root Cause**: The code was trying to upload to a bucket called `customer-uploads` which didn't exist in Supabase
- **Solution**: Created new bucket `customer-profile-images` and updated the upload code

### 2. **Missing Profile Photo Update Feature**
- **Problem**: Users could not update their profile photo after onboarding
- **Solution**: Added image upload functionality to the profile page with a modal interface

---

## ✅ What Was Changed

### 1. **SQL Migration File Created**
- **File**: `/app/sql-migrations/11_create_customer_profile_images_bucket.sql`
- **Purpose**: Contains instructions to create the storage bucket and RLS policies

### 2. **Onboarding Photo Screen Updated**
- **File**: `/app/modules/auth/screens/onboarding/PhotoUploadScreen.tsx`
- **Changes**:
  - Changed bucket name from `customer-uploads` to `customer-profile-images`
  - Added file size validation (max 5MB)
  - Added file type validation (JPEG, PNG, WebP, GIF only)
  - Improved error handling and error messages
  - Updated file path structure: `profile-photos/{user_id}/{timestamp}.{ext}`

### 3. **Profile Overview Screen Enhanced**
- **File**: `/app/modules/profile/user/ProfileOverviewScreen.tsx`
- **Changes**:
  - Added camera icon overlay on profile photo (shows on hover)
  - Created upload modal with drag-and-drop functionality
  - Added image preview before upload
  - Automatic deletion of old photo when uploading new one
  - Real-time profile refresh after upload

---

## 🚀 Setup Instructions

### Step 1: Create Storage Bucket in Supabase

You need to create the storage bucket manually in your Supabase dashboard:

1. **Go to Supabase Dashboard**: https://app.supabase.com
2. **Navigate to**: Your Project → Storage
3. **Click**: "Create a new bucket"
4. **Configure**:
   - **Bucket Name**: `customer-profile-images`
   - **Public bucket**: ✅ **YES** (check this box)
   - **File size limit**: `5242880` (5MB in bytes)
   - **Allowed MIME types**: `image/jpeg,image/jpg,image/png,image/webp,image/gif`
5. **Click**: "Create bucket"

### Step 2: Apply RLS Policies

After creating the bucket, apply the Row Level Security policies:

1. **Go to**: SQL Editor in Supabase Dashboard
2. **Copy and paste** the following policies one by one:

```sql
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
```

3. **Click**: "Run" to execute each policy

### Step 3: Verify Setup

Test if the bucket was created correctly:

```sql
-- Check if bucket exists
SELECT * FROM storage.buckets WHERE name = 'customer-profile-images';

-- List all policies
SELECT * FROM pg_policies WHERE tablename = 'objects' AND policyname LIKE '%profile images%';
```

---

## 📁 File Storage Structure

Images are stored with the following path structure:

```
customer-profile-images/
└── profile-photos/
    └── {user_id}/
        └── {timestamp}.{ext}
```

**Example**:
```
customer-profile-images/profile-photos/a1b2c3d4-e5f6-7890-abcd-ef1234567890/1704067200000.jpg
```

This structure ensures:
- ✅ Easy organization by user
- ✅ RLS policies can validate ownership
- ✅ Users can only access their own folder
- ✅ Automatic cleanup when user deletes old photos

---

## 🎨 New Features

### 1. **Onboarding Photo Upload**
- File size limit: 5MB
- Allowed formats: JPEG, JPG, PNG, WebP, GIF
- Real-time preview before upload
- Clear error messages
- Drag and drop support
- Option to skip

### 2. **Profile Photo Update**
- Camera icon appears on hover over profile photo
- Click to open upload modal
- Drag and drop or click to select
- Image preview before uploading
- Automatic deletion of old photo
- Real-time profile refresh
- Loading states during upload

---

## 🧪 Testing Guide

### Test Onboarding Flow:
1. Create a new account (sign up)
2. Complete name and location steps
3. On photo upload screen:
   - Try uploading a large file (> 5MB) → Should show error
   - Try uploading a non-image file → Should show error
   - Upload a valid image → Should succeed and redirect to home

### Test Profile Photo Update:
1. Log in to an existing account
2. Go to Profile → Overview
3. Hover over profile photo → Camera icon should appear
4. Click camera icon → Modal should open
5. Upload a new image → Should replace old image
6. Refresh page → New image should persist

---

## 🔒 Security Features

### RLS Policies Ensure:
- ✅ Users can only upload to their own folder (`profile-photos/{their_user_id}/`)
- ✅ Users can only update/delete their own images
- ✅ Public can view all profile images (for display on vendor profiles, reviews, etc.)
- ✅ Anonymous users cannot upload images

### File Validation:
- ✅ Maximum file size: 5MB
- ✅ Allowed file types: JPEG, JPG, PNG, WebP, GIF
- ✅ File type validation on client-side
- ✅ Additional server-side validation by Supabase

---

## 🐛 Troubleshooting

### Issue: "Failed to upload photo"

**Possible causes**:
1. Bucket doesn't exist → Create bucket in Supabase Dashboard
2. RLS policies not applied → Run the SQL policies from Step 2
3. File too large → Check file size (must be < 5MB)
4. Invalid file type → Use JPEG, PNG, WebP, or GIF only

**How to debug**:
1. Check browser console for detailed error messages
2. Verify bucket exists: `SELECT * FROM storage.buckets WHERE name = 'customer-profile-images';`
3. Check RLS policies: `SELECT * FROM pg_policies WHERE tablename = 'objects';`
4. Test with a small test image (< 1MB)

### Issue: "Old photo not deleted"

This is a minor issue and won't affect functionality. The app tries to delete the old photo but continues even if deletion fails.

### Issue: "Image not showing after upload"

1. Clear browser cache
2. Check if image URL is correct in `customer_profiles` table:
   ```sql
   SELECT user_id, full_name, profile_photo_url 
   FROM customer_profiles 
   WHERE user_id = 'YOUR_USER_ID';
   ```
3. Verify bucket is set to public in Supabase Dashboard

---

## 📊 Database Changes

### Table: `customer_profiles`

The `profile_photo_url` field stores the public URL of the uploaded image:

```sql
-- Example profile_photo_url value
https://unqpmwlzyaqrryzyrslf.supabase.co/storage/v1/object/public/customer-profile-images/profile-photos/a1b2c3d4-e5f6-7890-abcd-ef1234567890/1704067200000.jpg
```

No schema changes required - the field already exists.

---

## ✨ Next Steps

After completing the setup:

1. ✅ Test onboarding with photo upload
2. ✅ Test profile photo update
3. ✅ Verify images are stored correctly in Supabase Storage
4. ✅ Confirm old images are deleted when uploading new ones
5. ✅ Test on different browsers and devices

---

## 📞 Support

If you encounter any issues:

1. Check the browser console for error messages
2. Verify Supabase configuration in `.env.local`
3. Ensure bucket and policies are correctly set up
4. Check Supabase Dashboard → Storage → customer-profile-images for uploaded files

---

**✅ Implementation Complete!**

The photo upload error has been fixed and profile image update functionality has been added. Follow the setup instructions above to complete the configuration in Supabase.
