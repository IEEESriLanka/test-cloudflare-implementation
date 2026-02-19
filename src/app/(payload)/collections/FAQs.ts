import { CollectionConfig } from 'payload';
import { hideIfProjectStaff, isYPSLAdmin } from '../access/checkRole';

export const FAQs: CollectionConfig = {
  slug: 'faqs',
  labels: {
// ...
  },
  admin: {
    useAsTitle: 'question',
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
      name: 'question',
      type: 'text',
      required: true,
      label: 'Question',
    },
    {
      name: 'answer',
      type: 'textarea',
      required: true,
      label: 'Answer',
    },
  ],
};
