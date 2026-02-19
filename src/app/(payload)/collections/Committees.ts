import { CollectionConfig } from 'payload';
import { isYPSLAdmin, hideIfProjectStaff } from '../access/checkRole';

export const Committees: CollectionConfig = {
  slug: 'committees',
  labels: {
    singular: 'Committee Year',
    plural: 'Committee Years',
  },
  admin: {
    useAsTitle: 'year',
    group: '2. About Us',
    hidden: hideIfProjectStaff,
    defaultColumns: ['year', 'theme'],
  },
  access: {
    create: isYPSLAdmin,
    update: isYPSLAdmin,
    delete: isYPSLAdmin,
    read: () => true,
  },
  fields: [
    {
      name: 'year',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        placeholder: 'e.g. 2026',
      },
    },
    {
      name: 'theme',
      type: 'text',
      label: 'Year Theme',
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
  ],
};
