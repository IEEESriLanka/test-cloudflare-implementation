import { CollectionConfig } from 'payload';
import { hideIfProjectStaff, isYPSLAdmin } from '../access/checkRole';

export const Awards: CollectionConfig = {
  slug: 'awards',
  labels: {
// ...
  },
  admin: {
    useAsTitle: 'awardName',
    group: '1. Home Page',
    hidden: hideIfProjectStaff,
  },
  access: {
    read: () => true,
    create: isYPSLAdmin,
    update: isYPSLAdmin,
    delete: isYPSLAdmin,
  },
  fields: [
    {
      name: 'awardName',
      type: 'text',
      required: true,
      label: 'Award Name',
    },
    {
      name: 'awardImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Award Badge Image',
    },
    {
      name: 'awardCategory',
      type: 'text',
      label: 'Award Category',
    },
    {
      name: 'year',
      type: 'text',
      label: 'Year',
    },
    {
      name: 'winnerName',
      type: 'text',
      required: true,
      label: 'Winner Name',
    },
    {
      name: 'ouName',
      type: 'text',
      label: 'OU Name (Optional)',
    },
  ],
};
