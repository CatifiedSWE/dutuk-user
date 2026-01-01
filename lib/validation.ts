/**
 * Validation utilities for form inputs
 */

/**
 * Validates email format using regex
 * @param email - Email address to validate
 * @returns true if valid email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates password strength
 * Requirements:
 * - Minimum 6 characters
 * - At least 1 number
 * - At least 1 special character
 */
export interface PasswordValidation {
  isValid: boolean;
  errors: string[];
  checks: {
    minLength: boolean;
    hasNumber: boolean;
    hasSpecialChar: boolean;
  };
}

/**
 * Validates password and returns detailed validation result
 * @param password - Password to validate
 * @returns Validation result with checks and errors
 */
export function validatePassword(password: string): PasswordValidation {
  const checks = {
    minLength: password.length >= 6,
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  };

  const errors: string[] = [];
  
  if (!checks.minLength) {
    errors.push('Password must be at least 6 characters');
  }
  if (!checks.hasNumber) {
    errors.push('Password must contain at least 1 number');
  }
  if (!checks.hasSpecialChar) {
    errors.push('Password must contain at least 1 special character');
  }

  return {
    isValid: checks.minLength && checks.hasNumber && checks.hasSpecialChar,
    errors,
    checks,
  };
}

/**
 * Gets password strength level
 * @param password - Password to check
 * @returns Strength level: 'weak', 'medium', 'strong'
 */
export function getPasswordStrength(password: string): 'weak' | 'medium' | 'strong' {
  const validation = validatePassword(password);
  
  if (validation.isValid && password.length >= 12) {
    return 'strong';
  } else if (validation.isValid) {
    return 'medium';
  }
  return 'weak';
}

/**
 * Validates if two passwords match
 * @param password - First password
 * @param confirmPassword - Second password to compare
 * @returns true if passwords match
 */
export function validatePasswordMatch(password: string, confirmPassword: string): boolean {
  return password === confirmPassword && password.length > 0;
}
