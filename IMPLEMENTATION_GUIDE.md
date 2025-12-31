# 🚀 Dutuk Backend Integration - Step-by-Step Implementation Guide

## Overview
This guide provides **exact steps** to integrate the unified Supabase backend for both the Vendor App (React Native) and User Website (Next.js).

---

## 📋 Prerequisites Checklist

- [x] Supabase project created
- [x] Supabase credentials available
- [x] Vendor app repository cloned: `/app/vendor-app`
- [x] User website repository cloned: `/app/user-website`
- [x] Existing vendor app database schema documented
- [x] No existing users (safe to modify schema)

---

## 🗂️ Phase 1: Database Schema Updates

### Step 1.1: Backup Current Database (Optional but Recommended)

```bash
# In Supabase Dashboard:
# 1. Go to Database → Backups
# 2. Create manual backup before changes
```

### Step 1.2: Execute SQL Migrations

**Execute in Order** via Supabase SQL Editor:

1. **Existing tables** (Already done ✅)
   - `01_create_tables.sql` - Core tables
   - `02_create_rls_policies.sql` - Security policies
   - `03_create_functions.sql` - Helper functions
   - `04_seed_data.sql` - Initial data

2. **New extensions** (Execute now 👇)
   
   ```sql
   -- File: 05_extend_schema_for_users.sql
   -- Creates: vendor_services, categories, customer_profiles, favorites, notifications
   -- Extends: companies, reviews
   ```

3. **New RLS policies**
   
   ```sql
   -- File: 06_create_rls_for_new_tables.sql
   -- Creates security policies for all new tables
   ```

4. **Seed categories**
   
   ```sql
   -- File: 07_seed_categories.sql
   -- Populates categories table
   ```

### Step 1.3: Verify Schema

```sql
-- Check all tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Expected output should include:
-- categories
-- companies
-- customer_profiles
-- dates
-- earnings
-- events
-- favorites
-- notifications
-- orders
-- payments
-- requests
-- reviews
-- user_profiles
-- vendor_services

-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- All should show rowsecurity = true
```

---

## 🌐 Phase 2: User Website Backend Integration

### Step 2.1: Environment Configuration

**File:** `/app/user-website/.env.local`

```bash
# Create or update this file
cd /app/user-website

cat > .env.local << 'EOF'
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://unqpmwlzyaqrryzyrslf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVucXBtd2x6eWFxcnJ5enlyc2xmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2MTI5ODUsImV4cCI6MjA2NDE4ODk4NX0.RwDqMBy9ctQzxG9CuVzaUlriK6M5cGycPhQviNQfcxw

# Application
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# CORS
CORS_ORIGINS=*
EOF
```

### Step 2.2: Update Supabase Client

**File:** `/app/user-website/lib/supabase/client.ts`

Already configured ✅ - No changes needed!

```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
}
```

### Step 2.3: Create Authentication Module

**File:** `/app/user-website/lib/auth/customer-auth.ts`

```typescript
import { createClient } from '@/lib/supabase/client';

export interface SignUpData {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

/**
 * Register a new customer
 */
export async function signUpCustomer(data: SignUpData) {
  const supabase = createClient();
  
  // 1. Create auth user with metadata
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        full_name: data.fullName,
        role: 'customer'
      }
    }
  });
  
  if (authError) throw authError;
  
  // 2. Create customer profile
  if (authData.user) {
    const { error: profileError } = await supabase
      .from('customer_profiles')
      .insert({
        user_id: authData.user.id,
        full_name: data.fullName,
        phone: data.phone
      });
    
    if (profileError) {
      console.error('Profile creation error:', profileError);
    }
  }
  
  return authData;
}

/**
 * Sign in existing customer
 */
export async function signInCustomer(data: SignInData) {
  const supabase = createClient();
  
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password
  });
  
  if (authError) throw authError;
  
  // Verify user has customer role
  const { data: profile, error: profileError } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('user_id', authData.user.id)
    .single();
  
  if (profileError) throw profileError;
  
  if (profile.role !== 'customer') {
    await supabase.auth.signOut();
    throw new Error('This account is not registered as a customer');
  }
  
  return authData;
}

/**
 * Sign out current user
 */
export async function signOut() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

/**
 * Get current authenticated user
 */
export async function getCurrentUser() {
  const supabase = createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error) throw error;
  return user;
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated() {
  try {
    const user = await getCurrentUser();
    return !!user;
  } catch {
    return false;
  }
}
```

### Step 2.4: Create Data Hooks

**File:** `/app/user-website/hooks/useVendors.ts`

```typescript
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export interface VendorData {
  id: string;
  user_id: string;
  company: string;
  description: string | null;
  logo_url: string | null;
  category: string | null;
  service_area: string | null;
  avg_rating: number;
  total_reviews: number;
  is_active: boolean;
}

export function useVendors(category?: string, searchQuery?: string) {
  const [vendors, setVendors] = useState<VendorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    async function fetchVendors() {
      try {
        setLoading(true);
        const supabase = createClient();
        
        let query = supabase
          .from('companies')
          .select('*')
          .eq('is_active', true)
          .order('avg_rating', { ascending: false });
        
        if (category) {
          query = query.eq('category', category);
        }
        
        if (searchQuery) {
          query = query.ilike('company', `%${searchQuery}%`);
        }
        
        const { data, error: fetchError } = await query;
        
        if (fetchError) throw fetchError;
        
        setVendors(data || []);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchVendors();
  }, [category, searchQuery]);
  
  return { vendors, loading, error };
}
```

**File:** `/app/user-website/hooks/useVendorServices.ts`

```typescript
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export interface ServiceData {
  id: string;
  vendor_id: string;
  company_id: string;
  service_name: string;
  service_type: string;
  description: string | null;
  base_price: number;
  price_type: string;
  currency: string;
  featured_image: string | null;
  gallery_images: string[] | null;
  tags: string[] | null;
  category: string;
  is_active: boolean;
}

export function useVendorServices(vendorId?: string, category?: string) {
  const [services, setServices] = useState<ServiceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    async function fetchServices() {
      try {
        setLoading(true);
        const supabase = createClient();
        
        let query = supabase
          .from('vendor_services')
          .select('*')
          .eq('is_active', true);
        
        if (vendorId) {
          query = query.eq('vendor_id', vendorId);
        }
        
        if (category) {
          query = query.eq('category', category);
        }
        
        const { data, error: fetchError } = await query;
        
        if (fetchError) throw fetchError;
        
        setServices(data || []);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchServices();
  }, [vendorId, category]);
  
  return { services, loading, error };
}
```

**File:** `/app/user-website/hooks/useBookingRequest.ts`

```typescript
'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export interface BookingRequestData {
  companyName: string;
  vendorId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  eventType: string;
  description: string;
  dates: string[];
  estimatedBudget: number;
}

export function useBookingRequest() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  async function createRequest(requestData: BookingRequestData) {
    try {
      setLoading(true);
      setError(null);
      
      const supabase = createClient();
      
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error('Not authenticated');
      
      // Insert request
      const { data, error: insertError } = await supabase
        .from('requests')
        .insert({
          customer_id: user.id,
          customer_name: requestData.customerName,
          customer_email: requestData.customerEmail,
          customer_phone: requestData.customerPhone,
          company_name: requestData.companyName,
          event: requestData.eventType,
          description: requestData.description,
          date: requestData.dates,
          payment: requestData.estimatedBudget,
          status: 'pending'
        })
        .select()
        .single();
      
      if (insertError) throw insertError;
      
      // Create notification for vendor
      await supabase
        .from('notifications')
        .insert({
          user_id: requestData.vendorId,
          type: 'booking_request',
          title: 'New Booking Request',
          message: `${requestData.customerName} sent a booking request for ${requestData.eventType}`,
          data: { request_id: data.id }
        });
      
      return data;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }
  
  return { createRequest, loading, error };
}
```

### Step 2.5: Update Domain Models (TypeScript Types)

**File:** `/app/user-website/domain/vendor.ts` (Add)

```typescript
// Add to existing file

export interface VendorService {
  id: string;
  vendor_id: string;
  company_id: string;
  service_name: string;
  service_type: string;
  description: string | null;
  short_description: string | null;
  base_price: number;
  price_type: 'fixed' | 'per_person' | 'per_hour' | 'per_day' | 'custom';
  currency: string;
  is_active: boolean;
  featured_image: string | null;
  gallery_images: string[] | null;
  tags: string[] | null;
  category: string;
  subcategory: string | null;
  created_at: string;
}
```

### Step 2.6: Update Authentication Screens

**File:** `/app/user-website/modules/auth/screens/SignupScreen.tsx`

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signUpCustomer, type SignUpData } from '@/lib/auth/customer-auth';

export function SignupScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState<SignUpData>({
    email: '',
    password: '',
    fullName: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await signUpCustomer(formData);
      router.push('/login?message=Please check your email to verify your account');
    } catch (err: any) {
      setError(err.message || 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
        <h1 className="text-3xl font-bold">Sign Up</h1>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded">{error}</div>
        )}
        
        <input
          type="text"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={(e) => setFormData({...formData, fullName: e.target.value})}
          required
          className="w-full p-3 border rounded"
        />
        
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          required
          className="w-full p-3 border rounded"
        />
        
        <input
          type="tel"
          placeholder="Phone (optional)"
          value={formData.phone}
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
          className="w-full p-3 border rounded"
        />
        
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          required
          minLength={6}
          className="w-full p-3 border rounded"
        />
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
}
```

**Similar updates needed for:**
- `/app/user-website/modules/auth/screens/LoginScreen.tsx`

---

## 📱 Phase 3: Vendor App Updates

### Step 3.1: No Environment Changes Needed ✅

Vendor app already has correct Supabase credentials in:
- `/app/vendor-app/utils/supabase.ts`

### Step 3.2: Add Vendor Services Management (Optional)

**New File:** `/app/vendor-app/hooks/useVendorServices.ts`

```typescript
import { supabase } from '@/utils/supabase';

export interface VendorServiceData {
  service_name: string;
  service_type: string;
  description: string;
  short_description?: string;
  base_price: number;
  price_type: 'fixed' | 'per_person' | 'per_hour' | 'per_day' | 'custom';
  category: string;
  subcategory?: string;
  tags?: string[];
  featured_image?: string;
  gallery_images?: string[];
  max_bookings_per_day?: number;
}

export async function createVendorService(serviceData: VendorServiceData) {
  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) throw new Error('Not authenticated');
    
    // Get user's company
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .select('id')
      .eq('user_id', user.id)
      .single();
    
    if (companyError || !company) throw new Error('Company profile not found');
    
    // Insert service
    const { data, error } = await supabase
      .from('vendor_services')
      .insert({
        vendor_id: user.id,
        company_id: company.id,
        ...serviceData,
        is_active: true
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error };
  }
}

export async function getVendorServices() {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) throw new Error('Not authenticated');
    
    const { data, error } = await supabase
      .from('vendor_services')
      .select('*')
      .eq('vendor_id', user.id)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error };
  }
}
```

---

## 🧪 Phase 4: Testing

### Step 4.1: Test Database Access

```typescript
// Test script - run in browser console or Node.js

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://unqpmwlzyaqrryzyrslf.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
);

// Test 1: Public vendor browsing
const { data: vendors } = await supabase
  .from('companies')
  .select('*')
  .eq('is_active', true);

console.log('Vendors:', vendors);

// Test 2: Categories
const { data: categories } = await supabase
  .from('categories')
  .select('*')
  .eq('is_active', true);

console.log('Categories:', categories);
```

### Step 4.2: Test Authentication Flow

1. **Customer Signup**
   - Go to user website signup page
   - Register new customer
   - Verify email sent
   - Check `user_profiles` table has role='customer'

2. **Customer Login**
   - Login with customer credentials
   - Verify redirected to dashboard
   - Check session persists

3. **Vendor Login (Mobile)**
   - Login via vendor app
   - Verify role='vendor'
   - Check company profile access

### Step 4.3: Test Booking Flow

1. **Customer browses vendors**
   ```typescript
   const { data } = await supabase.from('companies').select('*');
   ```

2. **Customer sends request**
   ```typescript
   const { data } = await supabase.from('requests').insert({...});
   ```

3. **Vendor receives notification**
   ```typescript
   const { data } = await supabase
     .from('notifications')
     .select('*')
     .eq('user_id', vendorId)
     .eq('is_read', false);
   ```

---

## 📊 Phase 5: Monitoring & Optimization

### Step 5.1: Monitor Query Performance

```sql
-- Check slow queries
SELECT 
    query,
    calls,
    total_time,
    mean_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
```

### Step 5.2: Verify RLS Policies

```sql
-- Test as anonymous user
SET ROLE anon;
SELECT * FROM vendor_services; -- Should work
SELECT * FROM customer_profiles; -- Should fail
RESET ROLE;
```

### Step 5.3: Database Size Monitoring

```sql
-- Check table sizes
SELECT
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

---

## ✅ Final Checklist

### Database
- [ ] All SQL migrations executed successfully
- [ ] RLS policies verified working
- [ ] Categories seeded
- [ ] Test data created (optional)

### User Website
- [ ] Environment variables configured
- [ ] Authentication working (signup/login/logout)
- [ ] Vendor browsing working
- [ ] Booking request creation working
- [ ] Profile management working

### Vendor App
- [ ] Existing features still working ✅
- [ ] Receives booking requests ✅
- [ ] Vendor services management (optional)

### Security
- [ ] All tables have RLS enabled
- [ ] Anonymous users can only read public data
- [ ] Customers can't access vendor-only data
- [ ] Vendors can't access other vendors' data

### Performance
- [ ] Indexes created on frequently queried columns
- [ ] Query performance acceptable (<100ms)
- [ ] No N+1 query issues

---

## 🚨 Troubleshooting

### Issue: "relation does not exist"
**Solution:** Execute SQL migrations in correct order

### Issue: "permission denied for table"
**Solution:** Check RLS policies and GRANT statements

### Issue: "auth user not found"
**Solution:** Ensure user is authenticated before querying

### Issue: "role mismatch"
**Solution:** Check `user_profiles.role` is set correctly

---

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Next.js + Supabase](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [React Native + Supabase](https://supabase.com/docs/guides/getting-started/quickstarts/react-native)

---

**Status:** Ready for implementation 🚀  
**Estimated Time:** 2-3 days  
**Risk Level:** Low
