import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { cookies } from 'next/headers';

/**
 * OAuth Callback Route Handler
 * Handles OAuth callbacks from providers like Google, OTP verification, and password resets
 * 
 * Flow:
 * 1. Extract auth code from URL
 * 2. Exchange code for session
 * 3. Create customer profile if doesn't exist
 * 4. Check onboarding status
 * 5. Redirect to appropriate page
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') || '/home';

  if (code) {
    const cookieStore = await cookies();
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // The `setAll` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing user sessions.
            }
          },
        },
      }
    );

    // Exchange the code for a session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('Error exchanging code for session:', error);
      // Redirect to login with error
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(error.message)}`, requestUrl.origin)
      );
    }

    if (data.user) {
      // Check if customer profile exists, create if not
      const { data: existingProfile } = await supabase
        .from('customer_profiles')
        .select('user_id, full_name, city')
        .eq('user_id', data.user.id)
        .maybeSingle();

      // Create profile if it doesn't exist (for OAuth/OTP users)
      if (!existingProfile) {
        const { error: profileError } = await supabase
          .from('customer_profiles')
          .insert({
            user_id: data.user.id,
            email: data.user.email,
          });

        if (profileError) {
          console.error('Error creating customer profile:', profileError);
          // Continue anyway - middleware will handle it
        }

        // New user - redirect to onboarding
        return NextResponse.redirect(new URL('/onboarding/name', requestUrl.origin));
      }

      // Check if onboarding is complete
      const onboardingComplete = !!(existingProfile.full_name && existingProfile.city);

      if (onboardingComplete) {
        // Redirect to home or the 'next' parameter
        return NextResponse.redirect(new URL(next, requestUrl.origin));
      } else {
        // Redirect to onboarding
        return NextResponse.redirect(new URL('/onboarding/name', requestUrl.origin));
      }
    }
  }

  // If no code or something went wrong, redirect to home
  return NextResponse.redirect(new URL('/home', requestUrl.origin));
}
