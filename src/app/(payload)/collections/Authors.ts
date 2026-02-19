import { CollectionConfig, CollectionBeforeValidateHook } from 'payload';
import { filterByProject, isProjectStaff, isAdmin } from '../access/checkRole';
import { PROJECTS } from '../access/constants';

const validateAuthorProject: CollectionBeforeValidateHook = async ({ data, req: { user } }) => {
  if (user?.role === 'admin' || user?.role === 'manager') return data;

  if (user?.project && data) {
    data.project = user.project;
  }
  return data;
};

export const Authors: CollectionConfig = {
  slug: 'authors',
  labels: {
    singular: 'Author',
    plural: 'Authors',
  },
  admin: {
    useAsTitle: 'name',
    group: '4. Blogs',
  },
  access: {
    read: (args) => {
      if (isAdmin(args.req.user)) return true;
      if (isProjectStaff(args.req.user)) return filterByProject(args);
      return true;
    },
    create: filterByProject,
    update: filterByProject,
    delete: filterByProject,
  },
  hooks: {
    beforeValidate: [validateAuthorProject],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'project',
      type: 'select',
      options: PROJECTS,
      admin: {
        condition: (data, siblingData, { user }) => {
          return user?.role === 'admin' || user?.role === 'manager';
        },
      },
    },
    {
      name: 'role',
      type: 'text',
      label: 'Role / Designation',
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'bio',
      type: 'textarea',
    },
  ],
};
