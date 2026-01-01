/**
 * InfoMessage Component
 * Displays informational messages with different variants
 */

import React from 'react';

interface InfoMessageProps {
  message: string;
  variant?: 'info' | 'warning' | 'success';
  show?: boolean;
  icon?: string;
}

export default function InfoMessage({
  message,
  variant = 'info',
  show = true,
  icon,
}: InfoMessageProps) {
  if (!show || !message) return null;

  const styles = {
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-700',
      iconColor: 'text-blue-500',
      defaultIcon: 'info',
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      iconColor: 'text-yellow-500',
      defaultIcon: 'warning',
    },
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-700',
      iconColor: 'text-green-500',
      defaultIcon: 'check_circle',
    },
  };

  const style = styles[variant];

  return (
    <div
      className={`flex items-start gap-2 p-3 ${style.bg} border ${style.border} rounded-lg`}
    >
      <span className={`material-symbols-outlined ${style.iconColor} text-lg mt-0.5`}>
        {icon || style.defaultIcon}
      </span>
      <p className={`text-sm ${style.text} flex-1`}>{message}</p>
    </div>
  );
}
