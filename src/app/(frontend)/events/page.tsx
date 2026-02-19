import { getPayload } from 'payload';
import configPromise from '@/payload.config';
import EventsFilterList from '@/components/EventsFilterList';

import Breadcrumbs from '@/components/Breadcrumbs';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function EventsPage() {
    const payload = await getPayload({ config: configPromise });

    // Fetch all events
    const events = await payload.find({
        collection: 'events',
        sort: '-startDate', // Newest first by start date
        limit: 1000, 
        depth: 2,
    });

    return (
        <main className="min-h-screen py-8">
            <div className="container">
                <Breadcrumbs />
                
                <EventsFilterList initialEvents={events.docs} />
            </div>
        </main>
    );
}