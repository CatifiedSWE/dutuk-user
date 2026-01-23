'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import GradientBackground from '@/components/GradientBackground';
import { signUpWithPassword, signInWithGoogle, checkCustomerExists } from '@/lib/auth/customer-auth';
import { validateEmail, validatePassword, validatePasswordMatch } from '@/lib/validation';
import ValidationHint from '@/components/ui/ValidationHint';
import FormError from '@/components/ui/FormError';
import InfoMessage from '@/components/ui/InfoMessage';

export default function SignupScreen() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [infoMessage, setInfoMessage] = useState('');
    
    // Validation states
    const [emailTouched, setEmailTouched] = useState(false);
    const [passwordTouched, setPasswordTouched] = useState(false);
    const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [passwordValidation, setPasswordValidation] = useState(validatePassword(''));
    const [confirmPasswordError, setConfirmPasswordError] = useState('');

    // Get redirect parameter from URL
    const redirectUrl = searchParams.get('redirect');

    // Validate email on change
    useEffect(() => {
        if (emailTouched && email) {
            if (!validateEmail(email)) {
                setEmailError('Please enter a valid email address');
            } else {
                setEmailError('');
            }
        } else if (emailTouched && !email) {
            setEmailError('Email is required');
        }
    }, [email, emailTouched]);

    // Validate password on change
    useEffect(() => {
        if (password) {
            const validation = validatePassword(password);
            setPasswordValidation(validation);
        }
    }, [password]);

    // Validate confirm password on change
    useEffect(() => {
        if (confirmPasswordTouched && confirmPassword) {
            if (!validatePasswordMatch(password, confirmPassword)) {
                setConfirmPasswordError('Passwords do not match');
            } else {
                setConfirmPasswordError('');
            }
        }
    }, [password, confirmPassword, confirmPasswordTouched]);

    const handleEmailSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setInfoMessage('');

        // Mark all fields as touched
        setEmailTouched(true);
        setPasswordTouched(true);
        setConfirmPasswordTouched(true);

        // Validate email
        if (!email || !validateEmail(email)) {
            setError('Please enter a valid email address');
            setLoading(false);
            return;
        }

        // Validate password
        const passwordValidationResult = validatePassword(password);
        if (!passwordValidationResult.isValid) {
            setError(passwordValidationResult.errors[0]);
            setLoading(false);
            return;
        }

        // Validate passwords match
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            // CRITICAL: Check if email already exists in customer_profiles
            const customerCheck = await checkCustomerExists(email);
            
            if (customerCheck.exists) {
                // Email already registered as a customer
                setError('This email is already registered. Please login instead.');
                setInfoMessage('You already have an account. Redirecting to login...');
                
                // Redirect to login after 2 seconds, preserve redirect URL
                setTimeout(() => {
                    if (redirectUrl) {
                        router.push(`/login?redirect=${encodeURIComponent(redirectUrl)}`);
                    } else {
                        router.push('/login');
                    }
                }, 2000);
                
                setLoading(false);
                return;
            }

            // Email doesn't exist in customer_profiles, proceed with signup
            await signUpWithPassword(email, password);
            
            // After signup, check if we have a redirect URL
            if (redirectUrl) {
                // For wizard flow, redirect to onboarding first, then to wizard
                // Store redirect URL for after onboarding
                sessionStorage.setItem('post-onboarding-redirect', redirectUrl);
                router.push('/onboarding/name');
            } else {
                // Default onboarding flow
                router.push('/onboarding/name');
            }
        } catch (err: any) {
            // Handle Supabase auth errors
            if (err.message?.includes('already registered') || err.message?.includes('already exists')) {
                // This means the email exists in auth.users (could be a vendor)
                setError('This email is already registered as a vendor. Please login to access the user platform.');
                setInfoMessage('Redirecting to login...');
                
                setTimeout(() => {
                    if (redirectUrl) {
                        router.push(`/login?redirect=${encodeURIComponent(redirectUrl)}`);
                    } else {
                        router.push('/login');
                    }
                }, 2000);
            } else {
                setError(err.message || 'Failed to create account. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignup = async () => {
        setLoading(true);
        setError('');

        try {
            await signInWithGoogle();
        } catch (err: any) {
            setError(err.message || 'Failed to sign up with Google');
            setLoading(false);
        }
    };

    return (
        <GradientBackground className="flex items-center justify-center p-4 font-sans">
            {/* Main card */}
            <div className="w-full max-w-5xl bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] grid grid-cols-1 lg:grid-cols-2 overflow-hidden z-10 relative border border-gray-100">

                {/* Left side - decorative panel (hidden on mobile) */}
                <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-red-50 via-white to-red-50 p-12 relative overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#8B0000]/5 rounded-full blur-2xl"></div>

                    <div className="relative z-10">
                        <h2 className="font-display text-2xl font-bold text-[#8B0000] tracking-wide">DUIUK</h2>
                    </div>

                    <div className="relative z-10 flex-grow flex items-center justify-center py-12">
                        <div className="relative w-64 h-80">
                            <div className="absolute inset-0 bg-white/40 backdrop-blur-sm border border-white/60 rounded-2xl shadow-lg transform -rotate-6 transition-transform duration-700 hover:-rotate-3"></div>
                            <div className="absolute inset-0 bg-white/80 backdrop-blur-md border border-white/80 rounded-2xl shadow-xl transform rotate-3 flex flex-col items-center justify-center p-8 text-center transition-transform duration-700 hover:rotate-0">
                                <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4 text-[#8B0000]">
                                    <span className="material-symbols-outlined">verified_user</span>
                                </div>
                                <h3 className="font-display font-bold text-xl text-gray-900 mb-2">Premium Access</h3>
                                <p className="text-xs text-gray-500 font-sans leading-relaxed">Securely manage your account with our professional dashboard.</p>
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10">
                        <p className="text-sm text-gray-500 font-medium">Secured by industry standards.</p>
                        <div className="flex gap-1 mt-2">
                            <div className="w-2 h-2 rounded-full bg-[#8B0000]"></div>
                            <div className="w-2 h-2 rounded-full bg-[#8B0000]/40"></div>
                            <div className="w-2 h-2 rounded-full bg-[#8B0000]/20"></div>
                        </div>
                    </div>
                </div>

                {/* Right side - signup form */}
                <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-white relative">
                    <div className="mb-8">
                        <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-6 text-[#8B0000]">
                            <span className="material-symbols-outlined">person_add</span>
                        </div>
                        <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-3">Create Account</h1>
                        <p className="text-[#6B7280] leading-relaxed">
                            Enter your email to get started with Dutuk.
                        </p>
                    </div>

                    {error && (
                        <FormError message={error} />
                    )}

                    {infoMessage && (
                        <InfoMessage message={infoMessage} variant="info" />
                    )}

                    <form onSubmit={handleEmailSignup} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-4" htmlFor="email">
                                Email Address
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="material-symbols-outlined text-gray-400 group-focus-within:text-[#8B0000] transition-colors text-xl">
                                        mail_outline
                                    </span>
                                </div>
                                <input
                                    className={`block w-full pl-10 pr-4 py-3.5 border rounded-lg bg-[#F3F4F6] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 shadow-sm ${
                                        emailError
                                            ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500'
                                            : 'border-gray-200 focus:ring-[#8B0000]/20 focus:border-[#8B0000]'
                                    }`}
                                    id="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onBlur={() => setEmailTouched(true)}
                                    required
                                    disabled={loading}
                                />
                            </div>
                            {emailError && emailTouched && (
                                <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-xs">error</span>
                                    {emailError}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-4" htmlFor="password">
                                Password
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="material-symbols-outlined text-gray-400 group-focus-within:text-[#8B0000] transition-colors text-xl">
                                        lock_outline
                                    </span>
                                </div>
                                <input
                                    className={`block w-full pl-10 pr-12 py-3.5 border rounded-lg bg-[#F3F4F6] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 shadow-sm ${
                                        !passwordValidation.isValid && passwordTouched
                                            ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500'
                                            : 'border-gray-200 focus:ring-[#8B0000]/20 focus:border-[#8B0000]'
                                    }`}
                                    id="password"
                                    name="password"
                                    placeholder="Create a password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onBlur={() => setPasswordTouched(true)}
                                    required
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                                >
                                    <span className="material-symbols-outlined text-gray-400 hover:text-[#8B0000] transition-colors text-xl">
                                        {showPassword ? 'visibility_off' : 'visibility'}
                                    </span>
                                </button>
                            </div>
                            {password && (
                                <ValidationHint validation={passwordValidation} />
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-4" htmlFor="confirmPassword">
                                Confirm Password
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="material-symbols-outlined text-gray-400 group-focus-within:text-[#8B0000] transition-colors text-xl">
                                        lock_outline
                                    </span>
                                </div>
                                <input
                                    className={`block w-full pl-10 pr-12 py-3.5 border rounded-lg bg-[#F3F4F6] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 shadow-sm ${
                                        confirmPasswordError && confirmPasswordTouched
                                            ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500'
                                            : 'border-gray-200 focus:ring-[#8B0000]/20 focus:border-[#8B0000]'
                                    }`}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    placeholder="Confirm your password"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    onBlur={() => setConfirmPasswordTouched(true)}
                                    required
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                                >
                                    <span className="material-symbols-outlined text-gray-400 hover:text-[#8B0000] transition-colors text-xl">
                                        {showConfirmPassword ? 'visibility_off' : 'visibility'}
                                    </span>
                                </button>
                            </div>
                            {confirmPasswordError && confirmPasswordTouched && (
                                <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-xs">error</span>
                                    {confirmPasswordError}
                                </p>
                            )}
                        </div>

                        <div className="pt-2">
                            <button
                                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-lg shadow-md shadow-[#8B0000]/20 text-sm font-semibold text-white bg-[#8B0000] hover:bg-[#660000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B0000] transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? 'Creating Account...' : 'Create Account'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 relative">
                        <div aria-hidden="true" className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-100"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-gray-400 font-medium text-xs">OR CONTINUE WITH</span>
                        </div>
                    </div>

                    <div className="mt-6">
                        <button
                            className="w-full inline-flex justify-center items-center py-3 px-4 border border-gray-200 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            type="button"
                            onClick={handleGoogleSignup}
                            disabled={loading}
                        >
                            <svg aria-hidden="true" className="h-5 w-5 mr-3" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                            </svg>
                            <span>Sign up with Google</span>
                        </button>
                    </div>

                    <p className="mt-6 text-center text-sm text-gray-500">
                        Already have an account?{' '}
                        <a className="font-semibold text-[#8B0000] hover:text-[#660000] hover:underline transition-colors" href="/login">
                            Sign in
                        </a>
                    </p>
                </div>
            </div>
        </GradientBackground>
    );
}
