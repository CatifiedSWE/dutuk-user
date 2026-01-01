import { createClient } from '@/lib/supabase/client';

export interface SignUpData {
  email: string;
  password?: string;
}

export interface SignInData {
  email: string;
  password?: string;
}

/**
 * Sign up with email and password
 */
export async function signUpWithPassword(email: string, password: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        role: 'customer'
      }
    }
  });
  
  if (error) throw error;
  
  // Create customer profile
  if (data.user) {
    await supabase
      .from('customer_profiles')
      .insert({
        user_id: data.user.id,
        email: data.user.email
      });
  }
  
  return data;
}

/**
 * Send OTP to email for signup
 */
export async function signUpWithOTP(email: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/otp`,
      data: {
        role: 'customer'
      }
    }
  });
  
  if (error) throw error;
  return data;
}

/**
 * Sign in with email and password
 */
export async function signInWithPassword(email: string, password: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  return data;
}

/**
 * Send OTP to email for login
 */
export async function signInWithOTP(email: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/otp`,
    }
  });
  
  if (error) throw error;
  return data;
}

/**
 * Verify OTP code
 */
export async function verifyOTP(email: string, token: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'email'
  });
  
  if (error) throw error;
  
  // Create customer profile if it doesn't exist
  if (data.user) {
    const { data: existingProfile } = await supabase
      .from('customer_profiles')
      .select('user_id')
      .eq('user_id', data.user.id)
      .single();
    
    if (!existingProfile) {
      await supabase
        .from('customer_profiles')
        .insert({
          user_id: data.user.id,
          email: data.user.email
        });
    }
  }
  
  return data;
}

/**
 * Sign in with Google OAuth
 */
export async function signInWithGoogle() {
  const supabase = createClient();
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/onboarding/name`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      }
    }
  });
  
  if (error) throw error;
  return data;
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(email: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/otp?type=recovery`,
  });
  
  if (error) throw error;
  return data;
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

/**
 * Get customer profile
 */
export async function getCustomerProfile() {
  const supabase = createClient();
  const user = await getCurrentUser();
  
  if (!user) throw new Error('Not authenticated');
  
  const { data, error } = await supabase
    .from('customer_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();
  
  if (error) throw error;
  return data;
}

/**
 * Update customer profile
 */
export async function updateCustomerProfile(updates: Partial<{
  full_name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  profile_photo_url: string;
}>) {
  const supabase = createClient();
  const user = await getCurrentUser();
  
  if (!user) throw new Error('Not authenticated');
  
  const { data, error } = await supabase
    .from('customer_profiles')
    .update(updates)
    .eq('user_id', user.id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

/**
 * Check if onboarding is complete
 * Onboarding is complete if both name and location (city) exist
 */
export async function isOnboardingComplete() {
  try {
    const profile = await getCustomerProfile();
    return !!(profile.full_name && profile.city);
  } catch {
    return false;
  }
}
