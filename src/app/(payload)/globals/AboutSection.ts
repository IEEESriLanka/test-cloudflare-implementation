import { GlobalConfig } from 'payload';
import { hideIfProjectStaff, isYPSLAdmin } from '../access/checkRole';

export const AboutSection: GlobalConfig = {
  slug: 'about-section',
  label: 'About Section',
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
      name: 'description',
      type: 'textarea',
      required: true,
      label: 'About Us Description',
    },
    {
      name: 'stats',
      type: 'group',
      label: 'Editable Stats',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'volunteers',
              type: 'number',
              required: true,
              defaultValue: 0,
            },
            {
              name: 'projects',
              type: 'number',
              required: true,
              defaultValue: 0,
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'awards',
              type: 'number',
              required: true,
              defaultValue: 0,
            },
            {
              name: 'audience',
              type: 'number',
              required: true,
              defaultValue: 0,
            },
          ],
        },
      ],
    },
  ],
};
