/**
 * Generalized Auth Redirect Utilities
 * Manages post-authentication redirects for the entire application
 * Works with any page, not just specific flows
 */

const POST_AUTH_REDIRECT_KEY = 'dutuk-post-auth-redirect';
const REDIRECT_TIMESTAMP_KEY = 'dutuk-redirect-timestamp';
const REDIRECT_EXPIRY_MS = 30 * 60 * 1000; // 30 minutes

// Pages that should NOT be used as redirect targets
const EXCLUDED_PATHS = [
  '/login',
  '/signup',
  '/otp',
  '/forgot-password',
  '/reset-password',
];

/**
 * Check if a path is valid for redirect
 */
function isValidRedirectPath(path: string): boolean {
  try {
    // Must be a relative path (internal URL)
    if (!path.startsWith('/')) return false;
    
    // Check if path is in excluded list
    const pathWithoutQuery = path.split('?')[0];
    if (EXCLUDED_PATHS.some(excluded => pathWithoutQuery.startsWith(excluded))) {
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error validating redirect path:', error);
    return false;
  }
}

/**
 * Check if saved redirect has expired
 */
function isRedirectExpired(): boolean {
  if (typeof window === 'undefined') return true;
  
  try {
    const timestamp = localStorage.getItem(REDIRECT_TIMESTAMP_KEY);
    if (!timestamp) return true;
    
    const savedTime = parseInt(timestamp, 10);
    const now = Date.now();
    
    return (now - savedTime) > REDIRECT_EXPIRY_MS;
  } catch (error) {
    console.error('Error checking redirect expiry:', error);
    return true;
  }
}

/**
 * Save the current page location for post-auth redirect
 * Captures: pathname + query params + hash
 */
export function savePostAuthRedirect(customPath?: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    // Use custom path or current location
    const path = customPath || window.location.pathname + window.location.search + window.location.hash;
    
    // Validate the path
    if (!isValidRedirectPath(path)) {
      console.warn('Invalid redirect path, not saving:', path);
      return;
    }
    
    // Save to localStorage
    localStorage.setItem(POST_AUTH_REDIRECT_KEY, path);
    localStorage.setItem(REDIRECT_TIMESTAMP_KEY, Date.now().toString());
    
    console.log('📍 Saved post-auth redirect:', path);
  } catch (error) {
    console.error('Failed to save post-auth redirect:', error);
  }
}

/**
 * Get the saved post-auth redirect path
 * Returns null if no valid redirect is saved or if expired
 */
export function getPostAuthRedirect(): string | null {
  if (typeof window === 'undefined') return null;
  
  try {
    // Check if expired first
    if (isRedirectExpired()) {
      clearPostAuthRedirect();
      return null;
    }
    
    const savedPath = localStorage.getItem(POST_AUTH_REDIRECT_KEY);
    
    // Validate the saved path
    if (savedPath && isValidRedirectPath(savedPath)) {
      console.log('✅ Retrieved post-auth redirect:', savedPath);
      return savedPath;
    }
    
    return null;
  } catch (error) {
    console.error('Failed to get post-auth redirect:', error);
    return null;
  }
}

/**
 * Clear the saved post-auth redirect
 * Call this after successfully redirecting the user
 */
export function clearPostAuthRedirect(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(POST_AUTH_REDIRECT_KEY);
    localStorage.removeItem(REDIRECT_TIMESTAMP_KEY);
    console.log('🧹 Cleared post-auth redirect');
  } catch (error) {
    console.error('Failed to clear post-auth redirect:', error);
  }
}

/**
 * Build a login URL with the current page as redirect target
 */
export function buildLoginUrl(customReturnPath?: string): string {
  const returnPath = customReturnPath || 
    (typeof window !== 'undefined' 
      ? window.location.pathname + window.location.search + window.location.hash 
      : '/');
  
  if (!isValidRedirectPath(returnPath)) {
    return '/login';
  }
  
  return `/login?redirect=${encodeURIComponent(returnPath)}`;
}

/**
 * Build a signup URL with the current page as redirect target
 */
export function buildSignupUrl(customReturnPath?: string): string {
  const returnPath = customReturnPath || 
    (typeof window !== 'undefined' 
      ? window.location.pathname + window.location.search + window.location.hash 
      : '/');
  
  if (!isValidRedirectPath(returnPath)) {
    return '/signup';
  }
  
  return `/signup?redirect=${encodeURIComponent(returnPath)}`;
}

/**
 * Check if we should handle post-auth redirect
 * Use this in pages after successful authentication
 */
export function shouldHandlePostAuthRedirect(): boolean {
  const savedRedirect = getPostAuthRedirect();
  return savedRedirect !== null;
}

/**
 * Get redirect or fallback to default
 */
export function getRedirectOrDefault(defaultPath: string = '/'): string {
  const savedRedirect = getPostAuthRedirect();
  return savedRedirect || defaultPath;
}