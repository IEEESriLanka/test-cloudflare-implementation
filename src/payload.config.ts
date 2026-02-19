import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
// import { nodemailerAdapter } from '@payloadcms/email-nodemailer'

// Collections
import { Users } from './app/(payload)/collections/Users'
import { Media } from './app/(payload)/collections/Media'
import { Events } from './app/(payload)/collections/Events'
import { Organizers } from './app/(payload)/collections/Organizers'
import { ExecutiveCommittees } from './app/(payload)/collections/ExecutiveCommittees'
import { Committees } from './app/(payload)/collections/Committees'
import { Merchants } from './app/(payload)/collections/Merchants'
import { Authors } from './app/(payload)/collections/Authors'
import { Articles } from './app/(payload)/collections/Articles'
import { IEEEProjects } from './app/(payload)/collections/Projects'
import { Awards } from './app/(payload)/collections/Awards'
import { FAQs } from './app/(payload)/collections/FAQs'
import { SubCommittees } from './app/(payload)/collections/SubCommittees'
import { MerchCategories } from './app/(payload)/collections/MerchCategories'

// Globals
import { HeroSection } from './app/(payload)/globals/HeroSection'
import { AboutSection } from './app/(payload)/globals/AboutSection'
import { OverviewPage } from './app/(payload)/globals/OverviewPage'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: '- IEEE YPSL CMS',
      icons: [
        {
          rel: 'icon',
          type: 'image/png',
          url: '/favicon.png',
        },
      ],
    },
    components: {
      graphics: {
        Logo: '@/components/PayloadLogo#PayloadLogo',
        Icon: '@/components/PayloadIcon#PayloadIcon',
      },
      views: {
        Dashboard: {
          Component: '@/components/AdminDashboard#AdminDashboard',
        },
      },
      beforeLogin: ['@/components/AdminLogin#AdminLoginHeader'],
      afterLogin: ['@/components/AdminLogin#AdminLoginFooter'],
      providers: [
        '@/components/HeaderUserProvider#HeaderUserProvider',
        '@/components/PasswordToggleProvider#PasswordToggleProvider',
      ],
      logout: {
        Button: '@/components/CustomLogout#CustomLogout',
      },
    },
  },
  // Security & Hardening
  cors: [process.env.NEXT_PUBLIC_SERVER_URL || ''].filter(Boolean),
  csrf: [process.env.NEXT_PUBLIC_SERVER_URL || ''].filter(Boolean),
  collections: [
    // Group 1
    IEEEProjects,
    Awards,
    FAQs,
    // Group 2
    ExecutiveCommittees,
    Committees,
    SubCommittees,
    // Group 3
    Events,
    Organizers,
    // Group 4
    Authors,
    Articles,
    // Group 5
    Merchants,
    MerchCategories,
    // Group 6
    Users,
    // Group 7
    Media,
  ],
  globals: [
    // Group 1
    HeroSection,
    AboutSection,
    // Group 2
    OverviewPage,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  // email: nodemailerAdapter({
  //   defaultFromAddress: process.env.EMAIL_FROM_ADDRESS || 'ieeeypsl@gmail.com',
  //   defaultFromName: process.env.EMAIL_FROM_NAME || 'IEEE Young Professionals Sri Lanka',
  //   transportOptions: {
  //     host: process.env.SMTP_HOST,
  //     port: Number(process.env.SMTP_PORT) || 587,
  //     auth: {
  //       user: process.env.SMTP_USER,
  //       pass: process.env.SMTP_PASS,
  //     },
  //   },
  // }),
  sharp,
})
