import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function MobileBottomNav() {
  const pathname = usePathname();

  const navItems = [
    { href: '/home', icon: '🏠', label: 'Home' },
    { href: '/events/list', icon: '🎟️', label: 'Events' },
    { href: '/vendors/list', icon: '🏪', label: 'Vendors' },
    { href: '/profile/overview', icon: '👤', label: 'Profile' },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-50">
      <div className="grid grid-cols-4 h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 ${
                isActive
                  ? 'text-blue-600'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-xs">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
