'use client';

import React from 'react';
import { SocialLinks } from '@/domain/vendor';

interface SocialLinksSectionProps {
  socialLinks?: SocialLinks;
}

export function SocialLinksSection({ socialLinks }: SocialLinksSectionProps) {
  if (!socialLinks) {
    return null;
  }

  return (
    <div className="flex justify-center gap-4">
      {socialLinks.facebook && (
        <a
          href={socialLinks.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-500 hover:text-primary hover:border-primary transition-all"
        >
          <svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
              clipRule="evenodd"
            />
          </svg>
        </a>
      )}
      {socialLinks.instagram && (
        <a
          href={socialLinks.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-500 hover:text-primary hover:border-primary transition-all"
        >
          <svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772 4.902 4.902 0 011.772-1.153c.636-.247 1.363-.416 2.427-.465C9.673 2.013 10.03 2 12.48 2h-.165zm-3.77 1.795c-.95.043-1.463.245-1.808.378-.482.189-.834.413-1.202.78-.367.368-.59.72-.78 1.202-.133.345-.335.858-.378 1.808-.043 1.013-.055 1.317-.055 4.088s.012 3.075.055 4.088c.043.95.245 1.463.378 1.808.189.482.413.834.78 1.202.368.367.72.59 1.202.78.345.133.858.335 1.808.378 1.013.043 1.317.055 4.088.055s3.075-.012 4.088-.055c.95-.043 1.463-.245 1.808-.378.482-.189.834-.413 1.202-.78.367-.368.59-.72.78-1.202.133-.345.335-.858.378-1.808.043-1.013.055-1.317.055-4.088s-.012-3.075-.055-4.088c-.043-.95-.245-1.463-.378-1.808-.189-.482-.413-.834-.78-1.202-.368-.367-.72-.59-1.202-.78-.345-.133-.858-.335-1.808-.378-1.013-.043-1.317-.055-4.088-.055-2.771 0-3.075.012-4.088.055zm6.24 3.407a1.096 1.096 0 110 2.192 1.096 1.096 0 010-2.192zm-3.975 1.516a5.759 5.759 0 100 11.518 5.759 5.759 0 000-11.518zm0 1.968a3.791 3.791 0 110 7.582 3.791 3.791 0 010-7.582z"
              clipRule="evenodd"
            />
          </svg>
        </a>
      )}
    </div>
  );
}