import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';
import { createServerClient } from '@supabase/ssr';

/**
 * Middleware for route protection and authentication
 * Handles routing based on authentication and onboarding status
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Update session with Supabase
  const supabaseResponse = await updateSession(request);
  
  // Create Supabase client for auth checks
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuthenticated = !!user;

  // Define route categories
  const publicRoutes = [
    '/home',
    '/login',
    '/signup',
    '/otp',
    '/forgot-password',
    '/reset-link-sent',
    '/vendor-login',
  ];

  const authRoutes = ['/login', '/signup', '/otp', '/forgot-password', '/reset-link-sent', '/vendor-login'];
  const onboardingRoutes = ['/onboarding/name', '/onboarding/location', '/onboarding/photo'];

  // Check if current path is public
  const isPublicRoute = publicRoutes.some((route) => pathname === route || pathname.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => pathname === route || pathname.startsWith(route));
  const isOnboardingRoute = onboardingRoutes.some((route) => pathname === route || pathname.startsWith(route));

  // Root path handling
  if (pathname === '/') {
    if (isAuthenticated) {
      // Check onboarding status
      const { data: profile } = await supabase
        .from('customer_profiles')
        .select('full_name, city')
        .eq('user_id', user.id)
        .single();

      const onboardingComplete = !!(profile?.full_name && profile?.city);

      if (onboardingComplete) {
        return NextResponse.redirect(new URL('/home', request.url));
      } else {
        return NextResponse.redirect(new URL('/onboarding/name', request.url));
      }
    } else {
      return NextResponse.redirect(new URL('/home', request.url));
    }
  }

  // If user is authenticated and tries to access auth routes (login/signup)
  if (isAuthenticated && isAuthRoute) {
    // Check onboarding status
    const { data: profile } = await supabase
      .from('customer_profiles')
      .select('full_name, city')
      .eq('user_id', user.id)
      .single();

    const onboardingComplete = !!(profile?.full_name && profile?.city);

    if (onboardingComplete) {
      return NextResponse.redirect(new URL('/home', request.url));
    } else {
      return NextResponse.redirect(new URL('/onboarding/name', request.url));
    }
  }

  // If user is authenticated
  if (isAuthenticated) {
    // Check onboarding status
    const { data: profile } = await supabase
      .from('customer_profiles')
      .select('full_name, city')
      .eq('user_id', user.id)
      .single();

    const onboardingComplete = !!(profile?.full_name && profile?.city);

    // If onboarding is incomplete and trying to access protected routes
    if (!onboardingComplete && !isOnboardingRoute && !isPublicRoute) {
      return NextResponse.redirect(new URL('/onboarding/name', request.url));
    }

    // If onboarding is complete and trying to access onboarding routes
    if (onboardingComplete && isOnboardingRoute) {
      return NextResponse.redirect(new URL('/home', request.url));
    }
  }

  // If user is not authenticated and tries to access protected routes
  if (!isAuthenticated && !isPublicRoute) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
