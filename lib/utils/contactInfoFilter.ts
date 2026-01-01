/**
 * Contact Information Filter Utility
 * Prevents users from sharing contact details in chat before payment is completed
 * 
 * This enforces Dutuk's Terms & Conditions by blocking:
 * - Phone numbers (all international formats)
 * - Email addresses
 * - URLs and website links
 * - Social media handles
 * - Messaging app mentions (WhatsApp, Telegram, etc.)
 * 
 * @module contactInfoFilter
 */

// =====================================================
// REGEX PATTERNS FOR CONTACT DETECTION
// =====================================================

/**
 * Detects phone numbers in various formats:
 * - International: +1-234-567-8900, +91 98765 43210
 * - US: (123) 456-7890, 123-456-7890, 1234567890
 * - With spaces: 123 456 7890
 * - With dots: 123.456.7890
 */
const PHONE_PATTERNS = [
  // International format with country code
  /(\+?\d{1,4}[\s.-]?)?\(?\d{1,4}\)?[\s.-]?\d{1,4}[\s.-]?\d{1,9}/g,
  
  // 10 digit numbers (catches basic phone numbers)
  /\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/g,
  
  // Numbers with parentheses
  /\(\d{3}\)\s*\d{3}[-.\s]?\d{4}/g,
  
  // Just 10+ consecutive digits
  /\b\d{10,}\b/g,
];

/**
 * Detects email addresses
 * Matches: user@example.com, name.surname@company.co.uk
 */
const EMAIL_PATTERN = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/gi;

/**
 * Detects URLs and website links
 * Matches: https://example.com, www.site.com, example.com/page
 */
const URL_PATTERNS = [
  // Full URLs with protocol
  /https?:\/\/[^\s]+/gi,
  
  // www. URLs
  /www\.[^\s]+/gi,
  
  // Domain patterns (word.com, word.net, etc.)
  /\b[a-zA-Z0-9-]+\.(com|net|org|io|co|in|uk|us|info|biz|me|app|dev|tech|online|site|store|shop|cloud|ai|xyz)[^\s]*/gi,
];

/**
 * Detects social media handles and mentions
 * Matches: @username, @user_name, @user.name
 */
const SOCIAL_HANDLE_PATTERN = /@[a-zA-Z0-9_.]{2,}/g;

/**
 * Detects social media profile links
 * Matches: facebook.com/profile, instagram.com/user, twitter.com/handle
 */
const SOCIAL_PROFILE_PATTERNS = [
  /facebook\.com\/[^\s]+/gi,
  /fb\.com\/[^\s]+/gi,
  /instagram\.com\/[^\s]+/gi,
  /twitter\.com\/[^\s]+/gi,
  /linkedin\.com\/[^\s]+/gi,
  /tiktok\.com\/@[^\s]+/gi,
  /snapchat\.com\/[^\s]+/gi,
  /youtube\.com\/[^\s]+/gi,
];

/**
 * Detects messaging app mentions
 * Matches: WhatsApp, Telegram, Signal, WeChat, etc.
 */
const MESSAGING_APP_PATTERNS = [
  /whatsapp/gi,
  /wa\.me/gi,
  /watsapp/gi, // Common misspelling
  /telegram/gi,
  /t\.me/gi,
  /signal/gi,
  /wechat/gi,
  /line\s+app/gi,
  /discord/gi,
  /skype/gi,
  /messenger/gi,
  /viber/gi,
];

/**
 * Detects attempts to bypass filters with creative spellings
 * Matches: "call me", "my number is", "email me at", etc.
 */
const BYPASS_ATTEMPT_PATTERNS = [
  /\bcall\s+me\b/gi,
  /\btext\s+me\b/gi,
  /\bmy\s+(phone|number|mobile|cell)\b/gi,
  /\b(phone|mobile|cell)\s+number\s*:?\s*\d/gi,
  /\bemail\s+me\b/gi,
  /\bmy\s+email\b/gi,
  /\bcontact\s+me\s+(at|on)\b/gi,
  /\breach\s+me\s+(at|on)\b/gi,
];

// =====================================================
// DETECTION TYPE ENUM
// =====================================================

export enum ContactInfoType {
  PHONE = 'phone',
  EMAIL = 'email',
  URL = 'url',
  SOCIAL_HANDLE = 'social_handle',
  SOCIAL_PROFILE = 'social_profile',
  MESSAGING_APP = 'messaging_app',
  BYPASS_ATTEMPT = 'bypass_attempt',
}

// =====================================================
// DETECTION RESULT INTERFACE
// =====================================================

export interface ContactDetectionResult {
  hasContactInfo: boolean;
  types: ContactInfoType[];
  matches: string[];
  message: string;
}

// =====================================================
// MAIN DETECTION FUNCTIONS
// =====================================================

/**
 * Checks if text contains any contact information
 * 
 * @param text - The message text to check
 * @param allowedAfterPayment - If true, allows contact info (payment completed)
 * @returns Detection result with details about found contact info
 * 
 * @example
 * const result = detectContactInfo("Call me at 123-456-7890");
 * if (result.hasContactInfo) {
 *   console.log(result.message); // "Phone numbers cannot be shared"
 * }
 */
export function detectContactInfo(
  text: string,
  allowedAfterPayment: boolean = false
): ContactDetectionResult {
  // If payment completed, allow all contact info
  if (allowedAfterPayment) {
    return {
      hasContactInfo: false,
      types: [],
      matches: [],
      message: '',
    };
  }

  const detectedTypes: ContactInfoType[] = [];
  const matches: string[] = [];

  // Check for phone numbers
  for (const pattern of PHONE_PATTERNS) {
    const phoneMatches = text.match(pattern);
    if (phoneMatches) {
      // Filter out false positives (like dates, IDs)
      const validPhones = phoneMatches.filter(match => {
        const digitsOnly = match.replace(/\D/g, '');
        return digitsOnly.length >= 10; // At least 10 digits for valid phone
      });
      
      if (validPhones.length > 0) {
        detectedTypes.push(ContactInfoType.PHONE);
        matches.push(...validPhones);
        break;
      }
    }
  }

  // Check for emails
  const emailMatches = text.match(EMAIL_PATTERN);
  if (emailMatches) {
    detectedTypes.push(ContactInfoType.EMAIL);
    matches.push(...emailMatches);
  }

  // Check for URLs
  for (const pattern of URL_PATTERNS) {
    const urlMatches = text.match(pattern);
    if (urlMatches) {
      detectedTypes.push(ContactInfoType.URL);
      matches.push(...urlMatches);
      break;
    }
  }

  // Check for social media handles
  const handleMatches = text.match(SOCIAL_HANDLE_PATTERN);
  if (handleMatches) {
    detectedTypes.push(ContactInfoType.SOCIAL_HANDLE);
    matches.push(...handleMatches);
  }

  // Check for social media profile links
  for (const pattern of SOCIAL_PROFILE_PATTERNS) {
    const profileMatches = text.match(pattern);
    if (profileMatches) {
      detectedTypes.push(ContactInfoType.SOCIAL_PROFILE);
      matches.push(...profileMatches);
      break;
    }
  }

  // Check for messaging apps
  for (const pattern of MESSAGING_APP_PATTERNS) {
    const appMatches = text.match(pattern);
    if (appMatches) {
      detectedTypes.push(ContactInfoType.MESSAGING_APP);
      matches.push(...appMatches);
      break;
    }
  }

  // Check for bypass attempts
  for (const pattern of BYPASS_ATTEMPT_PATTERNS) {
    const bypassMatches = text.match(pattern);
    if (bypassMatches) {
      detectedTypes.push(ContactInfoType.BYPASS_ATTEMPT);
      matches.push(...bypassMatches);
      break;
    }
  }

  // Build result
  const hasContactInfo = detectedTypes.length > 0;
  const message = hasContactInfo ? buildErrorMessage(detectedTypes) : '';

  return {
    hasContactInfo,
    types: detectedTypes,
    matches,
    message,
  };
}

/**
 * Simple boolean check - does text contain contact info?
 * 
 * @param text - The message text to check
 * @param allowedAfterPayment - If true, returns false (payment completed)
 * @returns true if contact info detected, false otherwise
 */
export function containsContactInfo(
  text: string,
  allowedAfterPayment: boolean = false
): boolean {
  return detectContactInfo(text, allowedAfterPayment).hasContactInfo;
}

/**
 * Extract all contact information from text (for debugging/admin)
 * 
 * @param text - The message text to extract from
 * @returns Array of extracted contact information
 */
export function extractContactInfo(text: string): string[] {
  const result = detectContactInfo(text, false);
  return result.matches;
}

// =====================================================
// ERROR MESSAGE BUILDER
// =====================================================

/**
 * Builds a user-friendly error message based on detected contact types
 * 
 * @param types - Array of detected contact info types
 * @returns User-friendly error message
 */
function buildErrorMessage(types: ContactInfoType[]): string {
  const uniqueTypes = Array.from(new Set(types));

  // If multiple types detected, use generic message
  if (uniqueTypes.length > 1) {
    return '❌ Contact information cannot be shared in chat until payment is completed. This includes phone numbers, emails, social media handles, and website links.';
  }

  // Specific messages for single type
  const type = uniqueTypes[0];
  
  switch (type) {
    case ContactInfoType.PHONE:
      return '❌ Phone numbers cannot be shared in chat until payment is completed. This protects both parties and ensures transactions go through Dutuk.';
    
    case ContactInfoType.EMAIL:
      return '❌ Email addresses cannot be shared in chat until payment is completed. Please communicate through Dutuk messaging.';
    
    case ContactInfoType.URL:
      return '❌ Website links cannot be shared in chat until payment is completed. Please keep all communication within Dutuk.';
    
    case ContactInfoType.SOCIAL_HANDLE:
    case ContactInfoType.SOCIAL_PROFILE:
      return '❌ Social media profiles and handles cannot be shared until payment is completed. Please use Dutuk for all communication.';
    
    case ContactInfoType.MESSAGING_APP:
      return '❌ References to external messaging apps (WhatsApp, Telegram, etc.) are not allowed until payment is completed.';
    
    case ContactInfoType.BYPASS_ATTEMPT:
      return '❌ Please do not attempt to share contact information. All communication must remain within Dutuk until payment is completed.';
    
    default:
      return '❌ Contact information cannot be shared in chat until payment is completed.';
  }
}

// =====================================================
// UTILITY FUNCTIONS
// =====================================================

/**
 * Sanitizes text by masking detected contact information
 * (Optional - can be used for logging/display purposes)
 * 
 * @param text - Original text
 * @returns Text with contact info masked
 */
export function maskContactInfo(text: string): string {
  let masked = text;

  // Mask emails
  masked = masked.replace(EMAIL_PATTERN, '[email]');

  // Mask phone numbers
  for (const pattern of PHONE_PATTERNS) {
    masked = masked.replace(pattern, '[phone]');
  }

  // Mask URLs
  for (const pattern of URL_PATTERNS) {
    masked = masked.replace(pattern, '[link]');
  }

  // Mask social handles
  masked = masked.replace(SOCIAL_HANDLE_PATTERN, '[social]');

  return masked;
}

/**
 * Validates text and returns sanitized version or error
 * 
 * @param text - Message text to validate
 * @param paymentCompleted - Whether payment has been completed
 * @returns Object with isValid flag and sanitized text or error message
 */
export function validateMessage(
  text: string,
  paymentCompleted: boolean = false
): { isValid: boolean; message: string; error?: string } {
  const detection = detectContactInfo(text, paymentCompleted);

  if (detection.hasContactInfo) {
    return {
      isValid: false,
      message: text,
      error: detection.message,
    };
  }

  return {
    isValid: true,
    message: text,
  };
}
