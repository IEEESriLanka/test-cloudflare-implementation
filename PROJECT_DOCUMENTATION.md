# IEEE YP Sri Lanka Website Project Documentation

## Project Overview
This is the official website and Content Management System (CMS) for **IEEE Young Professionals Sri Lanka (YPSL)**. The project is designed to showcase YPSL's initiatives, manage its community, publish articles, and display committee information. It features a modern frontend built with Next.js and a powerful backend powered by Payload CMS.

---

## Tech Stack
The project follows a modern web architecture:

- **Frontend**: [Next.js 15](https://nextjs.org/) (App Router)
- **CMS / Backend**: [Payload CMS 3.0](https://payloadcms.com/)
- **Programming Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) (Hosted on [Neon](https://neon.tech/))
- **Email**: [Nodemailer](https://nodemailer.com/) (using Gmail SMTP)
- **Media Storage**: [Cloudinary](https://cloudinary.com/) (for images and files)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & Vanilla CSS
- **Animations**: [Swiper](https://swiperjs.com/) (for carousels) and Custom CSS transitions.
- **Form Handling**: React Hook Form & Zod for validation.

---

## Key Features

### 1. Unified CMS & Frontend
Both the admin panel and the public website run on the same Next.js instance, making deployment and data sharing seamless.

### 2. Multi-Project Support
The CMS allows managing multiple IEEE projects (e.g., INSL, SL Inspire, AI Driven Sri Lanka) from a single dashboard. Users can be assigned specific roles to manage individual projects.

### 3. Collection Management
- **Articles & Authors**: A robust blogging system.
- **Events & Organizers**: Track upcoming/past events with dynamic filtering.
- **Committees**: Management for Executive Committees and Standing Committees.
- **Media Library**: A global media library integrated with Cloudinary for automatic image optimization.
- **Projects & Awards**: Showcasing YPSL's flagship projects and recognized achievements.
- **Merchandise**: Management for products and categories.

### 4. Global Content Management
- **Hero Sections**: Dynamic carousels and headings for the homepage.
- **About Sections**: Management for the "About Us" content and statistics.
- **Overview Page**: Full control over the dedicated YPSL overview page.

### 5. Advanced Access Control
Detailed role-based access control (RBAC):
- **Admins**: Full control over the entire system.
- **Managers**: Content management with limited user control.
- **Project Admins/Managers**: Restricted to managing only their assigned projects.

---

## Project Structure

```text
├── src/
│   ├── app/
│   │   ├── (frontend)/       # Frontend pages and layout
│   │   ├── (payload)/        # Payload CMS configuration and admin UI
│   │   └── api/              # Custom API endpoints
│   ├── components/           # Reusable UI components
│   ├── lib/                  # Utility functions and libraries
│   ├── migrations/           # Database migration files (Drizzle/Payload)
│   ├── constants/            # Shared constants (e.g., timezones)
│   ├── payload.config.ts     # Main Payload CMS configuration
│   └── payload-types.ts      # Auto-generated TypeScript types for the CMS
├── public/                   # Static assets
├── tests/                    # Integration and E2E tests
├── Dockerfile                # Docker configuration
└── docker-compose.yml        # Local development environment setup
```

---

## Database & Infrastructure

### Database (PostgreSQL)
The project uses PostgreSQL as the primary database. In the Payload CMS 3.0 ecosystem, schema changes are managed via migrations.
- **Schema Driver**: `@payloadcms/db-postgres`
- **Migrations**: Located in `src/migrations`.

### Media Storage (Cloudinary)
All media uploads are automatically sent to Cloudinary. This ensures fast delivery and automatic resizing (thumbnails, cards, etc.).
- **Adapter**: `payload-storage-cloudinary`

### Emailing System
Nodemailer is used for system emails such as:
- Admin welcome emails with auto-generated credentials.
- Password reset notifications.

---

## Setup & Running Locally

### Prerequisites
- Node.js (v18.20.2 or >=20.9.0)
- pnpm (preferred) or npm
- Access to a PostgreSQL instance

### 1. Installation
```bash
pnpm install
```

### 2. Environment Variables
Create a `.env` file in the root based on `.env.example`:
```bash
DATABASE_URI=your_postgresql_uri
PAYLOAD_SECRET=your_random_secret
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
SMTP_HOST=...
SMTP_PASS=...
```

### 3. Development Mode
```bash
npm run dev
```
The site will be available at `http://localhost:3000` and the admin panel at `http://localhost:3000/admin`.

### 4. Database Migrations
To sync the database schema:
```bash
npx payload migrate
```

---

## Handover Notes for Developers

1. **Type Safety**: Always use the auto-generated types from `src/payload-types.ts` when working with CMS data in the frontend.
2. **Access Control**: Role-based logic is centrally defined in `src/app/(payload)/access/checkRole.ts`. Update this carefully if new roles are needed.
3. **Draft Mode**: Articles and Events support Draft/Published states and Previewing. Ensure frontend components check for `_status === 'published'`.
4. **Cloudinary Performance**: Use the `doc.sizes` object provided by the Media collection to display optimized image versions instead of the full-size original URL.
5. **Deployment**: The project is optimized for deployment on Vercel or a custom server using Docker. Ensure `NEXT_PUBLIC_SERVER_URL` is set correctly in production.

---
*Generated: 2026-02-18 by IEEE YPSL Tech Team*
