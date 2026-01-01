/**
 * Unit Tests for Contact Information Filter
 * Tests all detection patterns to ensure comprehensive filtering
 * 
 * Run with: npm test contactInfoFilter.test.ts
 */

import {
  detectContactInfo,
  containsContactInfo,
  extractContactInfo,
  validateMessage,
  maskContactInfo,
  ContactInfoType,
} from './contactInfoFilter';

describe('Contact Information Filter', () => {
  
  // =====================================================
  // PHONE NUMBER DETECTION TESTS
  // =====================================================
  
  describe('Phone Number Detection', () => {
    test('detects US phone number with dashes', () => {
      const result = detectContactInfo('Call me at 123-456-7890');
      expect(result.hasContactInfo).toBe(true);
      expect(result.types).toContain(ContactInfoType.PHONE);
    });

    test('detects US phone number with parentheses', () => {
      const result = detectContactInfo('My number is (123) 456-7890');
      expect(result.hasContactInfo).toBe(true);
      expect(result.types).toContain(ContactInfoType.PHONE);
    });

    test('detects 10-digit phone number', () => {
      const result = detectContactInfo('Text me 1234567890');
      expect(result.hasContactInfo).toBe(true);
      expect(result.types).toContain(ContactInfoType.PHONE);
    });

    test('detects international phone with country code', () => {
      const result = detectContactInfo('Reach me at +1-234-567-8900');
      expect(result.hasContactInfo).toBe(true);
      expect(result.types).toContain(ContactInfoType.PHONE);
    });

    test('detects phone with spaces', () => {
      const result = detectContactInfo('123 456 7890');
      expect(result.hasContactInfo).toBe(true);
      expect(result.types).toContain(ContactInfoType.PHONE);
    });

    test('detects phone with dots', () => {
      const result = detectContactInfo('123.456.7890');
      expect(result.hasContactInfo).toBe(true);
      expect(result.types).toContain(ContactInfoType.PHONE);
    });

    test('does not flag short numbers (not phone numbers)', () => {
      const result = detectContactInfo('I have 123 items');
      expect(result.hasContactInfo).toBe(false);
    });
  });

  // =====================================================
  // EMAIL DETECTION TESTS
  // =====================================================
  
  describe('Email Address Detection', () => {
    test('detects standard email', () => {
      const result = detectContactInfo('Email me at john@example.com');
      expect(result.hasContactInfo).toBe(true);
      expect(result.types).toContain(ContactInfoType.EMAIL);
    });

    test('detects email with dots', () => {
      const result = detectContactInfo('john.doe@company.co.uk');
      expect(result.hasContactInfo).toBe(true);
      expect(result.types).toContain(ContactInfoType.EMAIL);
    });

    test('detects email with numbers', () => {
      const result = detectContactInfo('user123@test.org');
      expect(result.hasContactInfo).toBe(true);
      expect(result.types).toContain(ContactInfoType.EMAIL);
    });

    test('detects email with underscores', () => {
      const result = detectContactInfo('first_last@domain.io');
      expect(result.hasContactInfo).toBe(true);
      expect(result.types).toContain(ContactInfoType.EMAIL);
    });
  });

  // =====================================================
  // URL DETECTION TESTS
  // =====================================================
  
  describe('URL Detection', () => {
    test('detects https URL', () => {
      const result = detectContactInfo('Check out https://mywebsite.com');
      expect(result.hasContactInfo).toBe(true);
      expect(result.types).toContain(ContactInfoType.URL);
    });

    test('detects http URL', () => {
      const result = detectContactInfo('Visit http://example.com');
      expect(result.hasContactInfo).toBe(true);
      expect(result.types).toContain(ContactInfoType.URL);
    });

    test('detects www URL', () => {
      const result = detectContactInfo('Go to www.mysite.com');
      expect(result.hasContactInfo).toBe(true);
      expect(result.types).toContain(ContactInfoType.URL);
    });

    test('detects domain without protocol', () => {
      const result = detectContactInfo('Check mywebsite.com');
      expect(result.hasContactInfo).toBe(true);
      expect(result.types).toContain(ContactInfoType.URL);
    });

    test('detects various TLDs', () => {
      expect(containsContactInfo('site.io')).toBe(true);
      expect(containsContactInfo('page.net')).toBe(true);
      expect(containsContactInfo('domain.org')).toBe(true);
      expect(containsContactInfo('app.co')).toBe(true);
    });
  });

  // =====================================================
  // SOCIAL MEDIA DETECTION TESTS
  // =====================================================
  
  describe('Social Media Detection', () => {
    test('detects @ handles', () => {
      const result = detectContactInfo('Follow me @johndoe');
      expect(result.hasContactInfo).toBe(true);
      expect(result.types).toContain(ContactInfoType.SOCIAL_HANDLE);
    });

    test('detects Facebook profile link', () => {
      const result = detectContactInfo('facebook.com/myprofile');
      expect(result.hasContactInfo).toBe(true);
      expect(result.types).toContain(ContactInfoType.SOCIAL_PROFILE);
    });

    test('detects Instagram profile', () => {
      const result = detectContactInfo('instagram.com/username');
      expect(result.hasContactInfo).toBe(true);
      expect(result.types).toContain(ContactInfoType.SOCIAL_PROFILE);
    });

    test('detects Twitter link', () => {
      const result = detectContactInfo('twitter.com/handle');
      expect(result.hasContactInfo).toBe(true);
      expect(result.types).toContain(ContactInfoType.SOCIAL_PROFILE);
    });

    test('detects LinkedIn profile', () => {
      const result = detectContactInfo('linkedin.com/in/profile');
      expect(result.hasContactInfo).toBe(true);
      expect(result.types).toContain(ContactInfoType.SOCIAL_PROFILE);
    });
  });

  // =====================================================
  // MESSAGING APP DETECTION TESTS
  // =====================================================
  
  describe('Messaging App Detection', () => {
    test('detects WhatsApp mention', () => {
      const result = detectContactInfo('Message me on WhatsApp');
      expect(result.hasContactInfo).toBe(true);
      expect(result.types).toContain(ContactInfoType.MESSAGING_APP);
    });

    test('detects wa.me link', () => {
      const result = detectContactInfo('wa.me/1234567890');
      expect(result.hasContactInfo).toBe(true);
      expect(result.types).toContain(ContactInfoType.MESSAGING_APP);
    });

    test('detects Telegram mention', () => {
      const result = detectContactInfo('Add me on Telegram');
      expect(result.hasContactInfo).toBe(true);
      expect(result.types).toContain(ContactInfoType.MESSAGING_APP);
    });

    test('detects Signal mention', () => {
      const result = detectContactInfo('Let\'s use Signal');
      expect(result.hasContactInfo).toBe(true);
      expect(result.types).toContain(ContactInfoType.MESSAGING_APP);
    });

    test('detects Discord mention', () => {
      const result = detectContactInfo('Join my Discord');
      expect(result.hasContactInfo).toBe(true);
      expect(result.types).toContain(ContactInfoType.MESSAGING_APP);
    });
  });

  // =====================================================
  // BYPASS ATTEMPT DETECTION TESTS
  // =====================================================
  
  describe('Bypass Attempt Detection', () => {
    test('detects "call me" phrase', () => {
      const result = detectContactInfo('Please call me');
      expect(result.hasContactInfo).toBe(true);
      expect(result.types).toContain(ContactInfoType.BYPASS_ATTEMPT);
    });

    test('detects "text me" phrase', () => {
      const result = detectContactInfo('Just text me');
      expect(result.hasContactInfo).toBe(true);
      expect(result.types).toContain(ContactInfoType.BYPASS_ATTEMPT);
    });

    test('detects "my number" phrase', () => {
      const result = detectContactInfo('Here is my number');
      expect(result.hasContactInfo).toBe(true);
      expect(result.types).toContain(ContactInfoType.BYPASS_ATTEMPT);
    });

    test('detects "email me" phrase', () => {
      const result = detectContactInfo('Just email me');
      expect(result.hasContactInfo).toBe(true);
      expect(result.types).toContain(ContactInfoType.BYPASS_ATTEMPT);
    });

    test('detects "contact me at" phrase', () => {
      const result = detectContactInfo('You can contact me at');
      expect(result.hasContactInfo).toBe(true);
      expect(result.types).toContain(ContactInfoType.BYPASS_ATTEMPT);
    });
  });

  // =====================================================
  // PAYMENT GATE TESTS
  // =====================================================
  
  describe('Payment Gate Override', () => {
    test('allows contact info after payment', () => {
      const result = detectContactInfo('Call me at 123-456-7890', true);
      expect(result.hasContactInfo).toBe(false);
    });

    test('allows email after payment', () => {
      const result = detectContactInfo('Email me at john@example.com', true);
      expect(result.hasContactInfo).toBe(false);
    });

    test('blocks contact info before payment', () => {
      const result = detectContactInfo('Call me at 123-456-7890', false);
      expect(result.hasContactInfo).toBe(true);
    });
  });

  // =====================================================
  // CLEAN TEXT TESTS (Should NOT detect)
  // =====================================================
  
  describe('Clean Text (No Contact Info)', () => {
    test('allows normal conversation', () => {
      const result = detectContactInfo('Hi! I\'m interested in booking your services.');
      expect(result.hasContactInfo).toBe(false);
    });

    test('allows questions', () => {
      const result = detectContactInfo('What is your availability for next weekend?');
      expect(result.hasContactInfo).toBe(false);
    });

    test('allows event details', () => {
      const result = detectContactInfo('I need a DJ for 50 people on Saturday night.');
      expect(result.hasContactInfo).toBe(false);
    });

    test('allows pricing discussion', () => {
      const result = detectContactInfo('What is your rate for a 4-hour event?');
      expect(result.hasContactInfo).toBe(false);
    });
  });

  // =====================================================
  // MULTIPLE DETECTION TESTS
  // =====================================================
  
  describe('Multiple Contact Types', () => {
    test('detects phone and email together', () => {
      const result = detectContactInfo('Call 123-456-7890 or email john@test.com');
      expect(result.hasContactInfo).toBe(true);
      expect(result.types).toContain(ContactInfoType.PHONE);
      expect(result.types).toContain(ContactInfoType.EMAIL);
    });

    test('detects URL and social handle', () => {
      const result = detectContactInfo('Visit mysite.com or follow @myhandle');
      expect(result.hasContactInfo).toBe(true);
      expect(result.types).toContain(ContactInfoType.URL);
      expect(result.types).toContain(ContactInfoType.SOCIAL_HANDLE);
    });
  });

  // =====================================================
  // UTILITY FUNCTION TESTS
  // =====================================================
  
  describe('Utility Functions', () => {
    test('containsContactInfo returns boolean', () => {
      expect(containsContactInfo('Call 123-456-7890')).toBe(true);
      expect(containsContactInfo('Normal message')).toBe(false);
    });

    test('extractContactInfo returns matches', () => {
      const matches = extractContactInfo('Email john@test.com or call 123-456-7890');
      expect(matches.length).toBeGreaterThan(0);
    });

    test('maskContactInfo masks sensitive data', () => {
      const masked = maskContactInfo('Call 123-456-7890 or email john@test.com');
      expect(masked).not.toContain('123-456-7890');
      expect(masked).not.toContain('john@test.com');
      expect(masked).toContain('[phone]');
      expect(masked).toContain('[email]');
    });

    test('validateMessage returns error for invalid', () => {
      const validation = validateMessage('Call 123-456-7890', false);
      expect(validation.isValid).toBe(false);
      expect(validation.error).toBeDefined();
    });

    test('validateMessage allows valid text', () => {
      const validation = validateMessage('Hi, interested in your services', false);
      expect(validation.isValid).toBe(true);
      expect(validation.error).toBeUndefined();
    });
  });

  // =====================================================
  // ERROR MESSAGE TESTS
  // =====================================================
  
  describe('Error Messages', () => {
    test('returns phone-specific error', () => {
      const result = detectContactInfo('123-456-7890');
      expect(result.message).toContain('Phone numbers');
    });

    test('returns email-specific error', () => {
      const result = detectContactInfo('john@test.com');
      expect(result.message).toContain('Email addresses');
    });

    test('returns URL-specific error', () => {
      const result = detectContactInfo('mywebsite.com');
      expect(result.message).toContain('Website links');
    });

    test('returns social media error', () => {
      const result = detectContactInfo('@myhandle');
      expect(result.message).toContain('Social media');
    });

    test('returns generic error for multiple types', () => {
      const result = detectContactInfo('Call 123-456-7890 or email john@test.com');
      expect(result.message).toContain('Contact information');
    });
  });
});
