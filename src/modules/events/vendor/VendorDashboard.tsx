'use client';

import { Card } from '@/modules/common/shared-ui';

export default function VendorDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Vendor Dashboard</h1>
        <Card className="p-8 text-center">
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            🚧 Vendor Portal Coming Soon 🚧
          </p>
          <p className="text-gray-500 dark:text-gray-500 mt-4">
            This section is under development and will include event management, booking tracking, and analytics.
          </p>
        </Card>
      </div>
    </div>
  );
}
