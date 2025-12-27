import { redirect } from 'next/navigation';

// Events list page - redirecting to explore page which shows vendors, packages, and events
export default function EventsListPage() {
  redirect('/explore');
}
