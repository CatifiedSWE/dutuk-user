import Link from 'next/link';

export default function MobileTopbar() {
  return (
    <div className="lg:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
      <div className="flex items-center justify-between h-16 px-4">
        <Link href="/home" className="text-xl font-bold text-blue-600">
          EventHub
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-gray-700 dark:text-gray-300">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
