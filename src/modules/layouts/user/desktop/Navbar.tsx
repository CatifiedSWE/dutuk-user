import Link from 'next/link';
import { Button } from '@/modules/common/shared-ui';

export default function DesktopNavbar() {
  return (
    <nav className="hidden lg:block bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/home" className="text-2xl font-bold text-blue-600">
            EventHub
          </Link>
          
          <div className="flex items-center gap-6">
            <Link href="/events/list" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors">
              Events
            </Link>
            <Link href="/vendors/list" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors">
              Organizers
            </Link>
            <Link href="/profile/overview" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors">
              My Bookings
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
