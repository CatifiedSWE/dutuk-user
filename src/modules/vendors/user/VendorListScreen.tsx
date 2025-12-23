'use client';

import { demoVendors } from '@/demo';
import { Card } from '@/modules/common/shared-ui';

export default function VendorListScreen() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Event Organizers</h1>
          <p className="text-lg opacity-90">Trusted vendors bringing amazing events to life</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {demoVendors.map((vendor) => (
            <Card key={vendor.id} hover className="p-6">
              <div className="flex items-start gap-4">
                <img
                  src={vendor.logo}
                  alt={vendor.name}
                  className="w-20 h-20 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {vendor.name}
                    </h3>
                    {vendor.verified && (
                      <span className="text-blue-500 text-xl" title="Verified Vendor">✓</span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 mb-3 text-sm text-gray-600 dark:text-gray-400">
                    <span>⭐ {vendor.rating}</span>
                    <span>📍 {vendor.location}</span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    {vendor.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {vendor.specialties.map((specialty) => (
                      <span
                        key={specialty}
                        className="bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full text-sm"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      <strong className="text-gray-900 dark:text-white">{vendor.totalEvents}</strong> Events Organized
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
