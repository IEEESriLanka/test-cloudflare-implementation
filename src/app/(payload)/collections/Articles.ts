import { CollectionConfig, CollectionBeforeValidateHook } from 'payload';
import { PROJECTS } from '../access/constants';
import { filterByProject, isAdmin, isProjectStaff } from '../access/checkRole';

/**
 * Hook to ensure Project staff can only create/edit articles for their own project.
 */
const validateArticleProject: CollectionBeforeValidateHook = async ({ data, req: { user } }) => {
  if (user?.role === 'admin' || user?.role === 'manager') return data;

  if (user?.project && data) {
    // Force project to match the user's project
    data.project = user.project;
  }

  return data;
};

export const Articles: CollectionConfig = {
  slug: 'articles',
  labels: {
    singular: 'Article',
    plural: 'Articles',
  },
  admin: {
    useAsTitle: 'title',
    group: '4. Blogs',
    defaultColumns: ['title', 'project', 'publishDate', 'statusBadge'],
    preview: (doc) => {
      const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';
      const year = doc?.publishDate ? new Date(doc.publishDate as string).getFullYear() : new Date().getFullYear();
      return doc?.slug ? `${BASE_URL}/blogs/${year}/${doc.slug}` : null;
    },
    livePreview: {
      url: ({ data }) => {
        const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';
        const year = data?.publishDate ? new Date(data.publishDate as string).getFullYear() : new Date().getFullYear();
        return `${BASE_URL}/blogs/${year}/${data.slug}`;
      },
    },
  },
  versions: {
    drafts: true,
  },
  access: {
    read: (args) => {
      const user = args.req.user;
      if (isAdmin(user)) return true;
      if (isProjectStaff(user)) return filterByProject(args);
      // Public can only read published articles
      return {
        _status: {
          equals: 'published',
        },
      };
    },
    create: filterByProject,
    update: filterByProject,
    delete: filterByProject,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      required: true,
      label: 'Slug (auto-generated if empty)',
    },
    {
      name: 'project',
      type: 'select',
      options: PROJECTS,
      label: 'Related Project',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'authors',
      required: true,
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'publishDate',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
      defaultValue: () => new Date(),
    },
    {
      name: 'statusBadge',
      type: 'ui',
      label: 'Status',
      admin: {
        components: {
          Cell: '@/components/StatusBadges#StatusBadge',
        },
      },
    },
  ],
  hooks: {
    beforeValidate: [
      validateArticleProject,
      ({ data }) => {
        const formatSlug = (val: string): string =>
          val
            .trim()
            .replace(/ /g, '-')
            .replace(/[^\w-]+/g, '')
            .replace(/-+/g, '-')
            .toLowerCase();

        if (data?.title && !data.slug) {
          data.slug = formatSlug(data.title);
        } else if (data?.slug) {
          data.slug = formatSlug(data.slug);
        }
        return data;
      },
    ],
  },
};
