import { GlobalConfig } from 'payload';
import { hideIfProjectStaff, isYPSLAdmin } from '../access/checkRole';

export const OverviewPage: GlobalConfig = {
  slug: 'overview-page',
  label: 'Overview Page',
  admin: {
    group: '2. About Us',
    hidden: hideIfProjectStaff,
  },
  access: {
    read: () => true,
    update: isYPSLAdmin,
  },
  fields: [
    // Hero Section
    {
      type: 'collapsible',
      label: '1. Hero Section',
      fields: [
        {
          name: 'heroTitle',
          type: 'text',
          label: 'Hero Title',
          required: true,
          defaultValue: 'About IEEE Young Professionals Sri Lanka',
        },
        {
          name: 'heroSubtitle',
          type: 'text',
          label: 'Hero Subtitle',
          required: true,
          defaultValue: 'Empowering early-career professionals through innovation, leadership, and impact.',
        },
      ],
    },

    // Who We Are Section
    {
      type: 'collapsible',
      label: '2. Who We Are',
      fields: [
        {
          name: 'whoWeAreHeading',
          type: 'text',
          label: 'Section Heading',
          defaultValue: 'Who We Are',
        },
        {
          name: 'whoWeAreContent',
          type: 'richText',
          label: 'Content',
          required: true,
        },
        {
          name: 'whoWeAreImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Side Image (Optional)',
        },
      ],
    },

    // Vision & Mission Cards
    {
      type: 'collapsible',
      label: '3. Vision & Mission Cards',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'visionTitle',
              type: 'text',
              label: 'Vision Title',
              defaultValue: 'Vision',
              admin: { width: '50%' },
            },
            {
              name: 'visionIcon',
              type: 'text',
              label: 'Vision Icon (emoji or text)',
              defaultValue: '👁',
              admin: { width: '50%' },
            },
          ],
        },
        {
          name: 'visionText',
          type: 'textarea',
          label: 'Vision Statement',
          required: true,
          defaultValue: 'Be the leading professional organization for young professionals and industries in Sri Lanka.',
        },
        {
          type: 'row',
          fields: [
            {
              name: 'missionTitle',
              type: 'text',
              label: 'Mission Title',
              defaultValue: 'Mission',
              admin: { width: '50%' },
            },
            {
              name: 'missionIcon',
              type: 'text',
              label: 'Mission Icon (emoji or text)',
              defaultValue: '🎯',
              admin: { width: '50%' },
            },
          ],
        },
        {
          name: 'missionText',
          type: 'textarea',
          label: 'Mission Statement',
          required: true,
          defaultValue: 'Increasing the industry members\' involvement and enhancing recognition among industries to attract and benefit fresh graduates.',
        },
      ],
    },

    // What We Do Section
    {
      type: 'collapsible',
      label: '4. What We Do',
      fields: [
        {
          name: 'whatWeDoHeading',
          type: 'text',
          label: 'Section Heading',
          defaultValue: 'What We Do',
        },
        {
          name: 'whatWeDoItems',
          type: 'array',
          label: 'What We Do Items',
          minRows: 2,
          maxRows: 6,
          fields: [
            {
              name: 'icon',
              type: 'text',
              label: 'Icon (emoji or text)',
              required: true,
            },
            {
              name: 'title',
              type: 'text',
              label: 'Title',
              required: true,
            },
            {
              name: 'description',
              type: 'text',
              label: 'One-line Description',
              required: true,
            },
          ],
        },
      ],
    },

    // Flagship Initiatives Section
    {
      type: 'collapsible',
      label: '5. Flagship Initiatives',
      fields: [
        {
          name: 'initiativesHeading',
          type: 'text',
          label: 'Section Heading',
          defaultValue: 'Our Flagship Initiatives',
        },
        {
          name: 'initiatives',
          type: 'array',
          label: 'Initiatives',
          fields: [
            {
              name: 'logo',
              type: 'upload',
              relationTo: 'media',
              label: 'Project Logo',
              required: true,
            },
            {
              name: 'name',
              type: 'text',
              label: 'Project Name',
              required: true,
            },
            {
              name: 'description',
              type: 'text',
              label: 'One-line Description',
              required: true,
            },
            {
              name: 'tag',
              type: 'select',
              label: 'Category Tag',
              options: [
                { label: 'AI', value: 'ai' },
                { label: 'Career', value: 'career' },
                { label: 'Innovation', value: 'innovation' },
                { label: 'Education', value: 'education' },
                { label: 'Community', value: 'community' },
              ],
            },
            {
              name: 'link',
              type: 'text',
              label: 'Project Link (Optional)',
            },
          ],
        },
      ],
    },

    // Impact & Stats Section
    {
      type: 'collapsible',
      label: '6. Impact & Stats',
      fields: [
        {
          name: 'statsHeading',
          type: 'text',
          label: 'Section Heading (Optional)',
          defaultValue: 'Our Impact',
        },
        {
          name: 'stats',
          type: 'array',
          label: 'Statistics',
          minRows: 2,
          maxRows: 6,
          fields: [
            {
              name: 'value',
              type: 'text',
              label: 'Value (e.g., 10+, 1000+)',
              required: true,
            },
            {
              name: 'label',
              type: 'text',
              label: 'Label',
              required: true,
            },
            {
              name: 'icon',
              type: 'text',
              label: 'Icon (emoji, optional)',
            },
          ],
        },
      ],
    },

    // Global Presence Section
    {
      type: 'collapsible',
      label: '7. IEEE YP Worldwide',
      fields: [
        {
          name: 'globalHeading',
          type: 'text',
          label: 'Section Heading',
          defaultValue: 'IEEE Young Professionals Worldwide',
        },
        {
          name: 'globalIntro',
          type: 'textarea',
          label: 'Introduction Text',
          defaultValue: 'IEEE Young Professionals is a global community spanning over 100 countries.',
        },
        {
          name: 'globalVideoUrl',
          type: 'text',
          label: 'YouTube Video URL',
          admin: {
            description: 'Full YouTube URL (e.g., https://www.youtube.com/watch?v=...)',
          },
        },
        {
          name: 'globalMapImage',
          type: 'upload',
          relationTo: 'media',
          label: 'World Map Illustration (Optional)',
        },
      ],
    },

    // Call to Action Section
    {
      type: 'collapsible',
      label: '8. Call to Action',
      fields: [
        {
          name: 'ctaHeading',
          type: 'text',
          label: 'CTA Heading',
          defaultValue: 'Want to be part of IEEE YPSL?',
        },
        {
          name: 'ctaSubtext',
          type: 'textarea',
          label: 'CTA Subtext (Optional)',
        },
        {
          name: 'ctaButtons',
          type: 'array',
          label: 'CTA Buttons',
          minRows: 1,
          maxRows: 4,
          fields: [
            {
              name: 'label',
              type: 'text',
              label: 'Button Label',
              required: true,
            },
            {
              name: 'url',
              type: 'text',
              label: 'Button URL',
              required: true,
            },
            {
              name: 'style',
              type: 'select',
              label: 'Button Style',
              options: [
                { label: 'Primary', value: 'primary' },
                { label: 'Secondary', value: 'secondary' },
                { label: 'Outline', value: 'outline' },
              ],
              defaultValue: 'primary',
            },
          ],
        },
      ],
    },
  ],
};
