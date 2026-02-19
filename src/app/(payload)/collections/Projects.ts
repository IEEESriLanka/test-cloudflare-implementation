import { CollectionConfig } from 'payload';
import { hideIfProjectStaff } from '../access/checkRole';

export const IEEEProjects: CollectionConfig = {
  slug: 'ieee-projects',
  labels: {
    singular: 'YPSL Project',
    plural: 'YPSL Projects',
  },
  admin: {
    useAsTitle: 'name',
    group: '1. Home Page',
    hidden: hideIfProjectStaff,
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Project Name',
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      label: 'Small Description',
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Project Logo',
    },
    {
      name: 'websiteUrl',
      type: 'text',
      label: 'Project Website Link',
    },
  ],
};
