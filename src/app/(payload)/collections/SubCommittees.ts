import { CollectionConfig } from 'payload';
import { hideIfProjectStaff, isYPSLAdmin } from '../access/checkRole';

export const SubCommittees: CollectionConfig = {
  slug: 'sub-committees',
  labels: {
    singular: 'Standing Committee',
    plural: 'Standing Committees',
  },
  admin: {
    useAsTitle: 'fullName',
    group: '2. About Us',
    hidden: hideIfProjectStaff,
    defaultColumns: ['fullName', 'pillar', 'position', 'category', 'committee'],
  },
  access: {
    read: () => true,
    create: isYPSLAdmin,
    update: isYPSLAdmin,
    delete: isYPSLAdmin,
  },
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (data && (data.firstName || data.lastName)) {
          data.fullName = `${data.firstName || ''} ${data.lastName || ''}`.trim();
        }
        return data;
      },
    ],
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'firstName',
          type: 'text',
          required: true,
        },
        {
          name: 'lastName',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'fullName',
      type: 'text',
      admin: {
        hidden: true,
      },
    },
    {
      name: 'pillar',
      type: 'select',
      required: true,
      options: [
        { label: 'Program Management', value: 'program-management' },
        { label: 'Finance and Partnership', value: 'finance-partnership' },
        { label: 'People Management', value: 'people-management' },
        { label: 'Public Visibility', value: 'public-visibility' },
      ],
    },
    {
      name: 'position',
      type: 'select',
      required: true,
      options: [
        { label: 'Chair', value: 'chair' },
        { label: 'Member', value: 'member' },
      ],
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Program Management', value: 'program-management' },
        { label: 'Event Management', value: 'event-management' },
        { label: 'Finance and Partnership', value: 'finance-partnership' },
        { label: 'Industry Engagements', value: 'industry-engagements' },
        { label: 'Collaboration', value: 'collaboration' },
        { label: 'People Management', value: 'people-management' },
        { label: 'Member Benefits and Opportunities', value: 'member-benefits-and-opportunities' },
        { label: 'Volunteer Engagement', value: 'volunteer-engagement' },
        { label: 'Membership Development', value: 'membership-development' },
        { label: 'Volunteer Training and Development', value: 'volunteer-training-and-development' },
        { label: 'Marketing and Communication', value: 'marketing-and-communication' },
        { label: 'Editorial', value: 'editorial' },
        { label: 'Environmental Social Governance', value: 'environmental-social-governance' },
      ],
    },
    {
      name: 'committee',
      type: 'relationship',
      relationTo: 'committees',
      required: true,
      label: 'Year/Committee',
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
  ],
};
