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
