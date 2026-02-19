import type { CollectionConfig } from 'payload'
import { isYPSLAdmin, hideIfProjectStaff } from '../access/checkRole'

export const MerchCategories: CollectionConfig = {
  slug: 'merch-categories',
  admin: {
    useAsTitle: 'name',
    group: '5. Merchants',
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
      name: 'name',
      type: 'text',
      label: 'Category Name',
      required: true,
      unique: true,
    },
    {
      name: 'slug',
      type: 'text',
      label: 'Slug',
      required: true,
      unique: true,
      admin: {
        description: 'Used for filtering (e.g., t-shirt, hoodie)',
      },
    },
  ],
}
