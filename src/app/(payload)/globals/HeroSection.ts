import { GlobalConfig } from 'payload';
import { hideIfProjectStaff, isYPSLAdmin } from '../access/checkRole';

export const HeroSection: GlobalConfig = {
  slug: 'hero-section',
  label: 'Hero Section',
  admin: {
    group: '1. Home Page',
    description: 'Manage the About Us description and stats on the Home Page',
    hidden: hideIfProjectStaff,
  },
  access: {
    read: () => true,
    update: isYPSLAdmin,
  },
  fields: [
    {
      name: 'mainHeading',
      type: 'text',
      label: 'Main Hero Heading',
      required: true,
      defaultValue: 'State-of-the-Art Innovation',
    },
    {
      name: 'subHeading',
      type: 'textarea',
      label: 'Main Hero Description',
      required: true,
      defaultValue: 'Connect, grow, and lead with the global community of IEEE Young Professionals in Sri Lanka.',
    },
    {
      name: 'banners',
      type: 'array',
      label: 'Hero Banners',
      minRows: 1,
      maxRows: 5,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'title',
          type: 'text',
          label: 'Banner Title (Optional)',
        },
      ],
    },
  ],
};
