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
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${baseUrl}/auth/callback`,
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
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${baseUrl}/auth/callback`,
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
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${baseUrl}/auth/callback`,
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
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${baseUrl}/auth/callback?next=/reset-password`,
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

/**
 * Check if email exists in customer_profiles table
 * This is the source of truth for customer existence
 * @param email - Email to check
 * @returns Object with exists flag and user_id if found
 */
export async function checkCustomerExists(email: string): Promise<{
  exists: boolean;
  userId?: string;
  profile?: any;
}> {
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase
      .from('customer_profiles')
      .select('user_id, email, full_name')
      .eq('email', email)
      .maybeSingle();
    
    if (error) {
      console.error('Error checking customer existence:', error);
      return { exists: false };
    }
    
    if (data) {
      return {
        exists: true,
        userId: data.user_id,
        profile: data,
      };
    }
    
    return { exists: false };
  } catch (err) {
    console.error('Exception checking customer existence:', err);
    return { exists: false };
  }
}

/**
 * Check if user is a vendor (has entry in companies table)
 * @param userId - User ID to check
 * @returns true if user is a vendor
 */
export async function isVendor(userId: string): Promise<boolean> {
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase
      .from('companies')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (error) {
      console.error('Error checking vendor status:', error);
      return false;
    }
    
    return !!data;
  } catch (err) {
    console.error('Exception checking vendor status:', err);
    return false;
  }
}

/**
 * Get user role from user_profiles table
 * @param userId - User ID to check
 * @returns User role: 'customer' or 'vendor' or null
 */
export async function getUserRole(userId: string): Promise<'customer' | 'vendor' | null> {
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (error) {
      console.error('Error getting user role:', error);
      return null;
    }
    
    return data?.role || null;
  } catch (err) {
    console.error('Exception getting user role:', err);
    return null;
  }
}

/**
 * Check if email exists in Supabase Auth (auth.users)
 * This is used to detect if a vendor email is trying to sign up
 * @param email - Email to check
 * @returns Object with exists flag and user info if found
 */
export async function checkEmailInAuth(email: string): Promise<{
  exists: boolean;
  userId?: string;
  isVendor?: boolean;
}> {
  const supabase = createClient();
  
  try {
    // Try to sign in to check if email exists
    // Note: This will not actually sign the user in, just check existence
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: 'dummy-password-for-check', // This will fail but tell us if email exists
    });
    
    // If error is about invalid credentials, email exists
    if (error && error.message.includes('Invalid login credentials')) {
      // Email exists, now check if they're a vendor
      // We need to get the user_id somehow - we'll use a different approach
      return { exists: true };
    }
    
    return { exists: false };
  } catch (err) {
    console.error('Exception checking email in auth:', err);
    return { exists: false };
  }
}

/**
 * Create customer profile for existing auth user
 * Used when vendors want to access the user app
 * @param userId - User ID
 * @param email - User email
 */
export async function createCustomerProfileForUser(userId: string, email: string) {
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase
      .from('customer_profiles')
      .insert({
        user_id: userId,
        email: email,
      })
      .select()
      .single();
    
    if (error) {
      // If error is duplicate, that's okay - profile already exists
      if (error.code === '23505') {
        console.log('Customer profile already exists for user:', userId);
        return;
      }
      throw error;
    }
    
    return data;
  } catch (err) {
    console.error('Error creating customer profile:', err);
    throw err;
  }
}
