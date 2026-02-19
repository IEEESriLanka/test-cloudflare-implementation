import type { CollectionConfig } from 'payload'
import { isYPSLAdmin, hideIfProjectStaff } from '../access/checkRole'

export const Merchants: CollectionConfig = {
  slug: 'merchants',
  admin: {
    useAsTitle: 'merchantName',
    defaultColumns: ['merchantName', 'category', 'price', 'availability'],
    group: '5. Merchants',
    hidden: hideIfProjectStaff,
  },
  access: {
    read: () => true, // Everyone can see merch
    create: isYPSLAdmin,
    update: isYPSLAdmin,
    delete: isYPSLAdmin,
  },
  fields: [
    {
      name: 'merchantID',
      type: 'text',
      label: 'Merchant ID (Unique)',
      unique: true,
      required: true,
      admin: {
        description: 'A unique identifier for this item (e.g., YPSL-TSHIRT-001)',
      },
    },
    {
      name: 'merchantName',
      type: 'text',
      label: 'Item Name',
      required: true,
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'merch-categories',
      required: true,
      label: 'Product Category',
    },
    {
      name: 'price',
      type: 'number',
      label: 'Price (LKR)',
      required: true,
      min: 0,
    },
    {
        name: 'discountTag',
        type: 'text',
        label: 'Discount Tag (e.g., "10% OFF")',
    },
    {
      name: 'statusTag',
      type: 'select',
      options: [
        { label: 'Available', value: 'available' },
        { label: 'Out of Stock', value: 'out-of-stock' },
        { label: 'Limited Stock', value: 'limited' },
      ],
      defaultValue: 'available',
      required: true,
    },
    {
      name: 'availability',
      type: 'select',
      options: [
        { label: 'Available (Public)', value: 'available' },
        { label: 'Closed (Hidden)', value: 'closed' },
      ],
      defaultValue: 'available',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'sizes',
      type: 'select',
      label: 'Available Sizes',
      hasMany: true,
      options: [
        { label: 'XS', value: 'XS' },
        { label: 'S', value: 'S' },
        { label: 'M', value: 'M' },
        { label: 'L', value: 'L' },
        { label: 'XL', value: 'XL' },
        { label: 'XXL', value: 'XXL' },
        { label: 'XXXL', value: 'XXXL' },
        { label: 'Free Size', value: 'Free Size' },
      ],
    },
    {
      name: 'images',
      type: 'array',
      label: 'Product Images (First one is main)',
      minRows: 1,
      maxRows: 4,
      required: true,
      labels: {
        singular: 'Image',
        plural: 'Images',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
    },
  ],
}
