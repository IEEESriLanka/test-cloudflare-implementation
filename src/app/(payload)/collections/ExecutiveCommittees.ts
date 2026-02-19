import { CollectionConfig } from 'payload';
import { isYPSLAdmin, hideIfNotAdmin } from '../access/checkRole';

export const ExecutiveCommittees: CollectionConfig = {
  slug: 'executive-committees',
  labels: {
    singular: 'Executive Committee',
    plural: 'Executive Committees',
  },
  admin: {
    useAsTitle: 'lastName',
    group: '2. About Us',
    defaultColumns: ['firstName', 'lastName', 'position', 'year'],
    hidden: hideIfNotAdmin,
  },
  access: {
    create: isYPSLAdmin,
    update: isYPSLAdmin,
    delete: isYPSLAdmin,
    read: () => true, // Public can read committee members
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'firstName',
          type: 'text',
          required: true,
          admin: {
            width: '50%',
          },
        },
        {
          name: 'lastName',
          type: 'text',
          required: true,
          admin: {
            width: '50%',
          },
        },
      ],
    },
    {
      name: 'position',
      type: 'text',
      required: true,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'rowNumber',
          type: 'number',
          required: true,
          min: 1,
          admin: {
            width: '50%',
            description: 'Row placement (1 is top)',
          },
        },
        {
          name: 'positionNumber',
          type: 'number',
          required: true,
          min: 1,
          admin: {
            width: '50%',
            description: 'Order within the row (1 is left)',
          },
        },
      ],
    },
    {
      name: 'committee',
      type: 'relationship',
      relationTo: 'committees',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'email',
      type: 'email',
    },
    {
      name: 'linkedin',
      type: 'text',
      label: 'LinkedIn URL',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Used for URL path (e.g., first-last)',
      },
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
  ],
};
