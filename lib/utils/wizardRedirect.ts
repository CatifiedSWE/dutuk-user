/**
 * Wizard Redirect Utilities
 * Manages redirect state for auth-gated wizard flows
 */

const WIZARD_RETURN_KEY = 'dutuk-wizard-return-path';
const WIZARD_RETURN_STEP_KEY = 'dutuk-wizard-return-step';

/**
 * Save wizard return path before redirecting to auth
 */
export function saveWizardReturnPath(path: string, step?: number): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(WIZARD_RETURN_KEY, path);
    if (step !== undefined) {
      localStorage.setItem(WIZARD_RETURN_STEP_KEY, step.toString());
    }
  } catch (error) {
    console.error('Failed to save wizard return path:', error);
  }
}

/**
 * Get saved wizard return path
 */
export function getWizardReturnPath(): { path: string | null; step: number | null } {
  if (typeof window === 'undefined') return { path: null, step: null };
  
  try {
    const path = localStorage.getItem(WIZARD_RETURN_KEY);
    const stepStr = localStorage.getItem(WIZARD_RETURN_STEP_KEY);
    const step = stepStr ? parseInt(stepStr, 10) : null;
    
    return { path, step };
  } catch (error) {
    console.error('Failed to get wizard return path:', error);
    return { path: null, step: null };
  }
}

/**
 * Clear wizard return path after successful restoration
 */
export function clearWizardReturnPath(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(WIZARD_RETURN_KEY);
    localStorage.removeItem(WIZARD_RETURN_STEP_KEY);
  } catch (error) {
    console.error('Failed to clear wizard return path:', error);
  }
}

/**
 * Build wizard URL with return parameters
 */
export function buildWizardReturnUrl(basePath: string, step: number): string {
  return `${basePath}?step=${step}&returning=true`;
}

/**
 * Check if current page load is a return from auth
 */
export function isReturningFromAuth(searchParams: URLSearchParams): boolean {
  return searchParams.get('returning') === 'true';
}

/**
 * Get step from URL parameters
 */
export function getStepFromUrl(searchParams: URLSearchParams): number | null {
  const step = searchParams.get('step');
  return step ? parseInt(step, 10) : null;
}