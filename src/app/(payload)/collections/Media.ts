import { CollectionConfig, CollectionBeforeValidateHook, Where } from 'payload';
import { isYPSLAdmin, hideIfNotAdmin, filterByProject, isProjectStaff, isAdmin } from '../access/checkRole';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Categories/Folders for Media Library
 */
const MEDIA_CATEGORIES = [
  { label: 'YPSL (Hero, Overview, Awards & Others)', value: 'ypsl' },
  { label: 'Executive Committees', value: 'executive-committees' },
  { label: 'Standing Committees', value: 'standing-committees' },
  { label: 'AI Driven Sri Lanka', value: 'ai-driven-sri-lanka' },
  { label: 'SL Inspire', value: 'sl-inspire' },
  { label: 'Let’s Talk', value: 'lets-talk' },
  { label: 'INSL', value: 'insl' },
  { label: 'StudPro', value: 'studpro' },
  { label: 'Y2NPro', value: 'y2npro' },
  { label: 'Merch Payslips', value: 'merch-payslips' },
  { label: 'Others', value: 'others' },
  { label: 'Merchants', value: 'merchants' },
  { label: 'IEEE Projects', value: 'ieee-projects' },
  { label: 'Events', value: 'events' },
];

/**
 * Hook to auto-populate Alt text from filename if empty
 */
const autoPopulateAlt: CollectionBeforeValidateHook = async ({ data, req }) => {
  if (req.file && (!data?.alt || data.alt === '')) {
    const filename = req.file.name;
    // Remove extension and replace dashes/underscores with spaces, then capitalize
    const nameWithoutExtension = filename.split('.').slice(0, -1).join('.');
    const formattedName = nameWithoutExtension
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
    
    if (data) data.alt = formattedName;
  }
  return data;
};

/**
 * Hook to ensure Project staff can only upload to their assigned category/project.
 */
const validateMediaCategory: CollectionBeforeValidateHook = async ({ data, req: { user } }) => {
  if (user?.role === 'admin' || user?.role === 'manager') return data;

  if (user?.project && data) {
    // If project staff is uploading, force the category to match their project
    data.category = user.project;
  }
  return data;
};

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    group: '7. Media',
    useAsTitle: 'alt',
    defaultColumns: ['alt', 'category', 'url', 'createdAt'],
    description: 'Max media upload size: 1MB. Please optimize your images before uploading.',
    components: {
      beforeListTable: ['@/components/MediaFolders#MediaFolders'],
    },
  },
  access: {
    read: (args) => {
      const user = args?.req?.user;
      
      // Fully hide merch-payslips from the CMS
      const baseFilter: any = {
        category: {
          not_in: ['merch-payslips'],
        },
      };

      if (!user) return baseFilter;
      if (isAdmin(user)) return baseFilter;
      
      if (isProjectStaff(user)) {
        return {
          and: [
            baseFilter,
            {
              category: {
                equals: user.project,
              },
            },
          ],
        };
      }
      return baseFilter;
    },
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => isAdmin(user),
  },
  hooks: {
    beforeValidate: [validateMediaCategory, autoPopulateAlt],
    beforeChange: [
      async ({ data, req, operation }) => {
        if (req.file && req.file.data) {
          try {
            const categoryFolder = data.category || 'others';
            const cloudinaryFolder = `ieeeypsl/${categoryFolder}`;
            console.log(`[Media Hook] Uploading to Cloudinary: folder=${cloudinaryFolder}, name=${req.file!.name}`);
            
            const result = await new Promise<any>((resolve, reject) => {
              const uploadStream = cloudinary.uploader.upload_stream(
                {
                  folder: cloudinaryFolder,
                  use_filename: true,
                  unique_filename: false, // Respect our custom Order ID names
                  resource_type: 'auto',
                  public_id: req.file!.name.split('.').slice(0, -1).join('.'), // Force the ID to match our filename
                },
                (error, result) => {
                  if (error) reject(error);
                  else resolve(result);
                }
              );
              uploadStream.end(req.file!.data);
            });

            if (result) {
              data.cloudinaryUrl = result.secure_url;
              data.cloudinaryPublicId = result.public_id;
              data.url = result.secure_url;
            }
          } catch (error) {
            console.error('[Media] manual upload error:', error);
          }
        }
        return data;
      },
    ],
    afterRead: [
      ({ doc }) => {
        const cloudinaryUrl = doc.cloudinaryUrl || doc.cloudinary_url;
        if (cloudinaryUrl) {
          doc.url = cloudinaryUrl;
          if (doc.cloudinaryPublicId) {
            const baseUrl = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`;
            const publicId = doc.cloudinaryPublicId;
            if (!doc.sizes) doc.sizes = {};
            doc.sizes.thumbnail = {
              url: `${baseUrl}/c_fill,w_400,h_300/${publicId}`,
              width: 400,
              height: 300,
            };
            doc.sizes.card = {
              url: `${baseUrl}/c_fill,w_768,h_1024/${publicId}`,
              width: 768,
              height: 1024,
            };
            doc.sizes.tablet = {
              url: `${baseUrl}/c_limit,w_1024/${publicId}`,
              width: 1024,
            };
          }
        }
        return doc;
      },
    ],
  },
  upload: {
    staticDir: 'public/media',
    disableLocalStorage: true, 
    adminThumbnail: 'thumbnail',
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
    ],
    mimeTypes: ['image/*', 'application/pdf'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: false,
      admin: {
        description: 'If left empty, this will be auto-populated from the filename.',
      },
    },
    {
      name: 'category',
      type: 'select',
      required: false,
      label: 'Category / Media Section Folder',
      options: MEDIA_CATEGORIES,
      admin: {
        description: 'Categorizing media helps in organizing the library and Cloudinary folders.',
      },
    },
    {
      name: 'cloudinaryUrl',
      type: 'text',
      admin: { hidden: true },
    },
    {
      name: 'cloudinaryPublicId',
      type: 'text',
      admin: { hidden: true },
    },
  ],
};