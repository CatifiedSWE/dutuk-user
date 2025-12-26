import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GradientBackground from '@/components/GradientBackground';
import { EventDetailScreen } from '@/modules/events/user';
import { getEventById } from '@/demo/eventsData';

interface EventDetailPageProps {
  params: Promise<{
    eventId: string;
  }>;
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { eventId } = await params;
  const event = getEventById(eventId);

  // If event not found, show 404
  if (!event) {
    notFound();
  }

  return (
    <GradientBackground>
      <Header variant="glassmorphic" />
      <EventDetailScreen event={event} />
      <Footer />
    </GradientBackground>
  );
}

// Optional: Generate metadata for SEO
export async function generateMetadata({ params }: EventDetailPageProps) {
  const { eventId } = await params;
  const event = getEventById(eventId);

  if (!event) {
    return {
      title: 'Event Not Found',
    };
  }

  return {
    title: `${event.title} | Dutuk Events`,
    description: event.description,
  };
}
