'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import {
  savePostAuthRedirect,
  buildLoginUrl,
  buildSignupUrl,
  clearPostAuthRedirect,
  getPostAuthRedirect
} from '@/lib/utils/authRedirect';

/**
 * Hook for handling authentication redirects
 * Provides utilities to capture location and redirect to auth
 */
export function useAuthRedirect() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  /**
   * Get the current full path (pathname + query + hash)
   */
  const getCurrentPath = useCallback(() => {
    if (typeof window === 'undefined') return pathname;
    return window.location.pathname + window.location.search + window.location.hash;
  }, [pathname]);

  /**
   * Redirect to login while preserving current location
   */
  const redirectToLogin = useCallback(() => {
    const currentPath = getCurrentPath();
    savePostAuthRedirect(currentPath);
    const loginUrl = buildLoginUrl(currentPath);
    router.push(loginUrl);
  }, [getCurrentPath, router]);

  /**
   * Redirect to signup while preserving current location
   */
  const redirectToSignup = useCallback(() => {
    const currentPath = getCurrentPath();
    savePostAuthRedirect(currentPath);
    const signupUrl = buildSignupUrl(currentPath);
    router.push(signupUrl);
  }, [getCurrentPath, router]);

  /**
   * Clear saved redirect after successful auth and navigation
   */
  const clearRedirect = useCallback(() => {
    clearPostAuthRedirect();
  }, []);

  /**
   * Get saved redirect path
   */
  const getSavedRedirect = useCallback(() => {
    return getPostAuthRedirect();
  }, []);

  /**
   * Handle post-auth redirect
   * Call this after successful authentication
   */
  const handlePostAuthRedirect = useCallback(() => {
    const savedRedirect = getPostAuthRedirect();
    if (savedRedirect) {
      clearPostAuthRedirect();
      router.push(savedRedirect);
      return true;
    }
    return false;
  }, [router]);

  return {
    redirectToLogin,
    redirectToSignup,
    clearRedirect,
    getSavedRedirect,
    handlePostAuthRedirect,
    getCurrentPath,
  };
}