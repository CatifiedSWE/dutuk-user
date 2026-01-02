import { notFound } from 'next/navigation';
import MainLayout from '@/components/layouts/MainLayout';
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
    <MainLayout variant="solid">
      <EventDetailScreen event={event} />
    </MainLayout>
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
