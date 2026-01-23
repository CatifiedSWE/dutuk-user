'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Lock, ArrowRight, Sparkles } from 'lucide-react';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';

interface AuthRequiredModalProps {
  open: boolean;
  onClose: () => void;
  currentStep?: number;
  wizardPath?: string;
}

export default function AuthRequiredModal({
  open,
  onClose,
  currentStep,
  wizardPath = '/events/plan'
}: AuthRequiredModalProps) {
  const { redirectToLogin, redirectToSignup } = useAuthRedirect();

  const handleSignIn = () => {
    // The hook automatically captures the current location
    redirectToLogin();
  };

  const handleSignUp = () => {
    // The hook automatically captures the current location
    redirectToSignup();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          {/* Icon */}
          <div className="mx-auto mb-4 w-16 h-16 rounded-2xl bg-[#4F0000] flex items-center justify-center shadow-lg">
            <Lock className="w-8 h-8 text-white" />
          </div>
          
          <DialogTitle className="text-2xl font-['Playfair_Display'] font-bold text-[#4F0000]">
            Almost There!
          </DialogTitle>
          
          <DialogDescription className="text-base text-gray-600 font-poppins mt-3">
            Sign in or create an account to complete your event planning.
          </DialogDescription>
        </DialogHeader>

        {/* Progress Saved Message */}
        <div className="mt-4 p-4 bg-[#FDF5E6] rounded-xl border border-[#FFC13C]/30">
          <div className="flex items-start gap-3">
            <div className="mt-0.5">
              <Sparkles className="w-5 h-5 text-[#FFC13C]" />
            </div>
            <div>
              <p className="font-poppins text-sm font-semibold text-[#4F0000] mb-1">
                Your progress is saved
              </p>
              <p className="font-poppins text-xs text-gray-600 leading-relaxed">
                You'll be redirected back here after signing in or creating an account. All your event details will be waiting for you.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 space-y-3">
          <Button
            onClick={handleSignIn}
            className="w-full bg-[#4F0000] hover:bg-[#3A0000] text-white font-poppins font-semibold py-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 group"
          >
            <span>Sign In to Continue</span>
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
          
          <Button
            onClick={handleSignUp}
            variant="outline"
            className="w-full border-2 border-[#4F0000] text-[#4F0000] hover:bg-[#FDF5E6] font-poppins font-semibold py-6 rounded-xl transition-all duration-200"
          >
            Create New Account
          </Button>
        </div>

        {/* Trust Badge */}
        <p className="mt-4 text-center text-xs text-gray-500 font-poppins">
          🔒 Your data is secure and never shared
        </p>
      </DialogContent>
    </Dialog>
  );
}