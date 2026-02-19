import { getPayload } from 'payload';
import configPromise from '@/payload.config';
import EventsFilterList from '@/components/EventsFilterList';
import Breadcrumbs from '@/components/Breadcrumbs';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function EventsYearPage({ params }: { params: Promise<{ year: string }> }) {
    const { year } = await params;
    const payload = await getPayload({ config: configPromise });

    // Fetch all events (filtering will be handled by the client component, but we pass the default year)
    const events = await payload.find({
        collection: 'events',
        sort: '-startDate',
        limit: 1000, 
        depth: 2,
    });

    return (
        <main className="min-h-screen py-8">
            <div className="container">
                <Breadcrumbs />
                
                <EventsFilterList initialEvents={events.docs} defaultYear={year} />
            </div>
        </main>
    );
}
