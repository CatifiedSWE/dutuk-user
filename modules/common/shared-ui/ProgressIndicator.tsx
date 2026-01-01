'use client';

import React from 'react';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressIndicator({ currentStep, totalSteps }: ProgressIndicatorProps) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div
          key={index}
          className={`w-2 h-2 rounded-full transition-all duration-300 ${
            index + 1 === currentStep
              ? 'bg-[#8B0000]'
              : index + 1 < currentStep
              ? 'bg-[#8B0000]/40'
              : 'bg-[#8B0000]/20'
          }`}
        />
      ))}
    </div>
  );
}
