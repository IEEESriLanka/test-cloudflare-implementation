import { CollectionConfig, CollectionBeforeValidateHook } from 'payload';
import { PROJECTS } from '../access/constants';
import { filterByProject, isAdmin, isProjectStaff } from '../access/checkRole';
import { TIMEZONES } from '../constants/timezones';

/**
 * Hook to ensure Project staff can only create events for their own project.
 */
const validateEventProject: CollectionBeforeValidateHook = async ({ data, req: { user } }) => {
  if (user?.role === 'admin' || user?.role === 'manager') return data;

  if (user?.project && data) {
    // Force project to match the user's project
    data.project = user.project;
  }

  return data;
};

// Hook to auto-generate slug from title if not provided
const formatSlug = (val: string): string =>
  val
    .trim()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/-+/g, '-')
    .toLowerCase();

const formatSlugHook: CollectionBeforeValidateHook = async ({ data }) => {
  if (data?.title && !data.slug) {
    data.slug = formatSlug(data.title);
  } else if (data?.slug) {
    data.slug = formatSlug(data.slug);
  }
  return data;
};

export const Events: CollectionConfig = {
  slug: 'events',
  labels: {
    singular: 'Event',
    plural: 'Events',
  },
  admin: {
    useAsTitle: 'title',
    group: '3. Programs & Events',
    hidden: ({ user }) => {
      if (user?.role === 'project-manager') return true;
      return false;
    },
    defaultColumns: ['title', 'project', 'startDate', 'statusBadge', 'eventStatus'],
    preview: (doc) => {
      const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';
      const year = doc?.startDate ? new Date(doc.startDate as string).getFullYear() : new Date().getFullYear();
      return doc?.slug ? `${BASE_URL}/events/${year}/${doc.slug}` : null;
    },
    livePreview: {
      url: ({ data }) => {
        const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';
        const year = data?.startDate ? new Date(data.startDate as string).getFullYear() : new Date().getFullYear();
        return `${BASE_URL}/events/${year}/${data.slug}`;
      },
    },
  },
  versions: {
    drafts: true,
  },
  access: {
    read: (args) => {
      const user = args.req.user;
      if (isAdmin(user)) return true;
      if (isProjectStaff(user)) return filterByProject(args);
      // Public can only read published events
      return {
        _status: {
          equals: 'published',
        },
      };
    },
    create: filterByProject,
    update: filterByProject,
    delete: filterByProject,
  },
  hooks: {
    beforeValidate: [validateEventProject, formatSlugHook],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Event Title',
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      required: true,
      label: 'Slug (auto-generated if empty)',
    },
    {
      name: 'project',
      type: 'select',
      options: PROJECTS,
      required: true,
      admin: {
        condition: (data, siblingData, { user }) => {
          return user?.role === 'admin' || user?.role === 'manager';
        },
      },
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Description',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'startDate',
          type: 'date',
          required: true,
          label: 'Start Date',
          admin: {
            width: '50%',
          },
        },
        {
          name: 'endDate',
          type: 'date',
          label: 'End Date (Optional)',
          admin: {
            width: '50%',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'startTime',
          type: 'date',
          label: 'Start Time',
          admin: {
            width: '50%',
            date: {
              pickerAppearance: 'timeOnly',
              displayFormat: 'h:mm a',
            },
          },
        },
        {
          name: 'endTime',
          type: 'date',
          label: 'End Time',
          admin: {
            width: '50%',
            date: {
              pickerAppearance: 'timeOnly',
              displayFormat: 'h:mm a',
            },
          },
        },
      ],
    },
    {
      name: 'timezone',
      type: 'select',
      defaultValue: 'Asia/Colombo',
      options: TIMEZONES,
      label: 'Timezone',
      admin: {
        description: 'Select the primary timezone for this event. Defaults to Sri Lanka (Asia/Colombo).',
      },
    },
    {
      name: 'eventType',
      type: 'select',
      required: true,
      defaultValue: 'physical',
      options: [
        { label: 'Physical Event', value: 'physical' },
        { label: 'Online Event', value: 'online' },
        { label: 'Hybrid Event', value: 'hybrid' },
      ],
      label: 'Event Type',
    },
    {
      name: 'venueLocation',
      type: 'text',
      label: 'Venue Location',
      admin: {
        condition: (data) => data.eventType === 'physical' || data.eventType === 'hybrid',
      },
    },
    {
      name: 'onlinePlatform',
      type: 'select',
      label: 'Online Platform',
      options: [
        { label: 'Google Meet', value: 'google-meet' },
        { label: 'Zoom', value: 'zoom' },
        { label: 'Other', value: 'other' },
      ],
      admin: {
        condition: (data) => data.eventType === 'online' || data.eventType === 'hybrid',
      },
    },
    {
      name: 'organizers',
      type: 'relationship',
      relationTo: 'organizers',
      hasMany: true,
      label: 'Event Organizers',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Event Banner',
    },
    {
      name: 'registrationUrl',
      type: 'text',
      label: 'Registration Link',
    },
    {
      name: 'statusBadge',
      type: 'ui',
      label: 'Status',
      admin: {
        components: {
          Cell: '@/components/StatusBadges#StatusBadge',
        },
      },
    },
    {
      name: 'eventStatus',
      type: 'ui',
      label: 'Event Life',
      admin: {
        components: {
          Cell: '@/components/StatusBadges#EventStatusBadge',
        },
      },
    },
    {
      name: 'hashtags',
      type: 'text',
      label: 'Hashtags (#ieee #ypsl)',
    },
  ],
};