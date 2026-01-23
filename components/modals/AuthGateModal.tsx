'use client';

import React from 'react';
import { LogIn, UserPlus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';

interface AuthGateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthGateModal({ open, onOpenChange }: AuthGateModalProps) {
  const { redirectToLogin, redirectToSignup } = useAuthRedirect();

  const handleLogin = () => {
    onOpenChange(false);
    redirectToLogin();
  };

  const handleSignup = () => {
    onOpenChange(false);
    redirectToSignup();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-xl border-[#7C2A2A]/20 rounded-3xl">
        <DialogHeader className="space-y-4">
          <DialogTitle className="text-2xl font-bold text-[#7C2A2A] text-center font-serif">
            Sign in to Continue
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600 text-base">
            Please sign in or create an account to book this event.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-3 mt-6">
          {/* Sign In Button */}
          <button
            onClick={handleLogin}
            className="flex items-center justify-center gap-3 w-full px-6 py-3.5 bg-[#7C2A2A] hover:bg-[#5A1F1F] text-white font-semibold rounded-xl transition-all shadow-lg shadow-[#7C2A2A]/20 active:scale-95"
          >
            <LogIn className="w-5 h-5" />
            Sign In
          </button>

          {/* Sign Up Button */}
          <button
            onClick={handleSignup}
            className="flex items-center justify-center gap-3 w-full px-6 py-3.5 bg-white hover:bg-gray-50 text-[#7C2A2A] font-semibold rounded-xl border-2 border-[#7C2A2A] transition-all active:scale-95"
          >
            <UserPlus className="w-5 h-5" />
            Create Account
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-4">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </DialogContent>
    </Dialog>
  );
}
