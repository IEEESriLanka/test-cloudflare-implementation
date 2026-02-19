import { CollectionConfig } from 'payload';
import { hideIfProjectStaff, isYPSLAdmin } from '../access/checkRole';

export const Organizers: CollectionConfig = {
  slug: 'organizers',
  labels: {
    singular: 'Organizer',
    plural: 'Organizers',
  },
  admin: {
    useAsTitle: 'name',
    group: '3. Programs & Events',
    hidden: ({ user }) => {
      if (user?.role === 'project-admin' || user?.role === 'project-manager') return true;
      return false;
    },
  },
  access: {
    read: () => true,
    create: isYPSLAdmin,
    update: isYPSLAdmin,
    delete: isYPSLAdmin,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Organizer Name',
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Organizer Logo',
    },
    {
      name: 'website',
      type: 'text',
      label: 'Organizer Website/Social Link',
    },
  ],
};
