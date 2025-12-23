import Link from 'next/link';
import { Button } from '@/modules/common/shared-ui';

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 text-white py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl">
          <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
            Discover & Book Amazing Events
          </h1>
          <p className="text-xl lg:text-2xl mb-8 opacity-90">
            From concerts to conferences, find and book the perfect events near you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/events/list">
              <Button size="lg" className="w-full sm:w-auto bg-white text-blue-600 hover:bg-gray-100">
                Browse Events
              </Button>
            </Link>
            <Link href="/vendors/list">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white/10">
                View Organizers
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 right-0 opacity-10">
        <span className="text-9xl">🎉</span>
      </div>
    </section>
  );
}
