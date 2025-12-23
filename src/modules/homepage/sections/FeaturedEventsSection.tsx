import { demoEvents } from '@/demo';
import { Card } from '@/modules/common/shared-ui';
import Link from 'next/link';

export default function FeaturedEventsSection() {
  const featuredEvents = demoEvents.filter((event) => event.featured).slice(0, 3);

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
          Featured Events
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {featuredEvents.map((event) => (
            <Link href={`/events/details/${event.id}`} key={event.id}>
              <Card hover className="overflow-hidden cursor-pointer h-full">
                <div className="relative h-48">
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 right-3 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    ⭐ Featured
                  </span>
                </div>
                <div className="p-5">
                  <span className="text-sm bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">
                    {event.category}
                  </span>
                  <h3 className="text-xl font-bold mt-3 mb-2 text-gray-900 dark:text-white">
                    {event.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                    {event.description}
                  </p>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-2xl font-bold text-blue-600">${event.price}</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
