import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'manager', 'project-admin', 'project-manager');
  CREATE TYPE "public"."enum_users_project" AS ENUM('ypsl', 'ai-driven-sri-lanka', 'sl-inspire', 'lets-talk', 'insl', 'studpro', 'y2npro');
  CREATE TYPE "public"."enum_events_project" AS ENUM('ypsl', 'ai-driven-sri-lanka', 'sl-inspire', 'lets-talk', 'insl', 'studpro', 'y2npro');
  CREATE TYPE "public"."enum_events_timezone" AS ENUM('Asia/Colombo', 'UTC', 'GMT');
  CREATE TYPE "public"."enum_events_event_type" AS ENUM('physical', 'online', 'hybrid');
  CREATE TYPE "public"."enum_events_online_platform" AS ENUM('google-meet', 'zoom', 'other');
  CREATE TYPE "public"."enum_articles_project" AS ENUM('ypsl', 'ai-driven-sri-lanka', 'sl-inspire', 'lets-talk', 'insl', 'studpro', 'y2npro');
  CREATE TYPE "public"."enum_sub_committees_pillar" AS ENUM('program-management', 'finance-partnership', 'people-management', 'public-visibility');
  CREATE TYPE "public"."enum_sub_committees_position" AS ENUM('chair', 'member');
  CREATE TYPE "public"."enum_sub_committees_category" AS ENUM('program-management', 'event-management', 'finance-partnership', 'industry-engagements', 'collaboration', 'people-management', 'member-benefits', 'membership-development', 'volunteer-training', 'marketing-committee', 'editorial', 'esg');
  CREATE TYPE "public"."enum_overview_page_initiatives_tag" AS ENUM('ai', 'career', 'innovation', 'education', 'community');
  CREATE TYPE "public"."enum_overview_page_cta_buttons_style" AS ENUM('primary', 'secondary', 'outline');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"role" "enum_users_role" NOT NULL,
  	"project" "enum_users_project",
  	"last_login" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"cloudinary_public_id" varchar,
  	"cloudinary_url" varchar,
  	"cloudinary_resource_type" varchar,
  	"cloudinary_format" varchar,
  	"cloudinary_version" numeric,
  	"original_url" varchar,
  	"transformed_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_cloudinary_public_id" varchar,
  	"sizes_thumbnail_cloudinary_url" varchar,
  	"sizes_thumbnail_cloudinary_resource_type" varchar,
  	"sizes_thumbnail_cloudinary_format" varchar,
  	"sizes_thumbnail_cloudinary_version" numeric,
  	"sizes_thumbnail_original_url" varchar,
  	"sizes_thumbnail_transformed_url" varchar,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_card_cloudinary_public_id" varchar,
  	"sizes_card_cloudinary_url" varchar,
  	"sizes_card_cloudinary_resource_type" varchar,
  	"sizes_card_cloudinary_format" varchar,
  	"sizes_card_cloudinary_version" numeric,
  	"sizes_card_original_url" varchar,
  	"sizes_card_transformed_url" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_tablet_cloudinary_public_id" varchar,
  	"sizes_tablet_cloudinary_url" varchar,
  	"sizes_tablet_cloudinary_resource_type" varchar,
  	"sizes_tablet_cloudinary_format" varchar,
  	"sizes_tablet_cloudinary_version" numeric,
  	"sizes_tablet_original_url" varchar,
  	"sizes_tablet_transformed_url" varchar,
  	"sizes_tablet_url" varchar,
  	"sizes_tablet_width" numeric,
  	"sizes_tablet_height" numeric,
  	"sizes_tablet_mime_type" varchar,
  	"sizes_tablet_filesize" numeric,
  	"sizes_tablet_filename" varchar
  );
  
  CREATE TABLE "events" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"project" "enum_events_project",
  	"description" jsonb,
  	"start_date" timestamp(3) with time zone NOT NULL,
  	"end_date" timestamp(3) with time zone,
  	"start_time" timestamp(3) with time zone,
  	"end_time" timestamp(3) with time zone,
  	"timezone" "enum_events_timezone" DEFAULT 'Asia/Colombo',
  	"event_type" "enum_events_event_type" DEFAULT 'physical' NOT NULL,
  	"venue_location" varchar,
  	"online_platform" "enum_events_online_platform",
  	"image_id" integer NOT NULL,
  	"registration_url" varchar,
  	"hashtags" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "events_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"organizers_id" integer
  );
  
  CREATE TABLE "organizers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"logo_id" integer NOT NULL,
  	"website" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "executive_committees" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"first_name" varchar NOT NULL,
  	"last_name" varchar NOT NULL,
  	"position" varchar NOT NULL,
  	"committee_id" integer NOT NULL,
  	"email" varchar,
  	"linkedin" varchar,
  	"slug" varchar NOT NULL,
  	"photo_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "committees" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"year" varchar NOT NULL,
  	"theme" varchar,
  	"active" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "authors" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"role" varchar,
  	"photo_id" integer,
  	"bio" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "articles" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"project" "enum_articles_project",
  	"excerpt" varchar,
  	"content" jsonb NOT NULL,
  	"author_id" integer NOT NULL,
  	"featured_image_id" integer NOT NULL,
  	"publish_date" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "ieee_projects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"logo_id" integer NOT NULL,
  	"website_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "awards" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"award_name" varchar NOT NULL,
  	"award_image_id" integer,
  	"award_category" varchar,
  	"year" varchar,
  	"winner_name" varchar NOT NULL,
  	"ou_name" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "faqs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "sub_committees" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"first_name" varchar NOT NULL,
  	"last_name" varchar NOT NULL,
  	"full_name" varchar,
  	"pillar" "enum_sub_committees_pillar" NOT NULL,
  	"position" "enum_sub_committees_position" NOT NULL,
  	"category" "enum_sub_committees_category" NOT NULL,
  	"committee_id" integer NOT NULL,
  	"photo_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer,
  	"events_id" integer,
  	"organizers_id" integer,
  	"executive_committees_id" integer,
  	"committees_id" integer,
  	"authors_id" integer,
  	"articles_id" integer,
  	"ieee_projects_id" integer,
  	"awards_id" integer,
  	"faqs_id" integer,
  	"sub_committees_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "hero_section_banners" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL,
  	"title" varchar
  );
  
  CREATE TABLE "hero_section" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"main_heading" varchar DEFAULT 'State-of-the-Art Innovation' NOT NULL,
  	"sub_heading" varchar DEFAULT 'Connect, grow, and lead with the global community of IEEE Young Professionals in Sri Lanka.' NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "about_section" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"description" varchar NOT NULL,
  	"stats_volunteers" numeric DEFAULT 0 NOT NULL,
  	"stats_projects" numeric DEFAULT 0 NOT NULL,
  	"stats_awards" numeric DEFAULT 0 NOT NULL,
  	"stats_audience" numeric DEFAULT 0 NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "overview_page_what_we_do_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL
  );
  
  CREATE TABLE "overview_page_initiatives" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"logo_id" integer NOT NULL,
  	"name" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"tag" "enum_overview_page_initiatives_tag",
  	"link" varchar
  );
  
  CREATE TABLE "overview_page_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL,
  	"label" varchar NOT NULL,
  	"icon" varchar
  );
  
  CREATE TABLE "overview_page_cta_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL,
  	"style" "enum_overview_page_cta_buttons_style" DEFAULT 'primary'
  );
  
  CREATE TABLE "overview_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_title" varchar DEFAULT 'About IEEE Young Professionals Sri Lanka' NOT NULL,
  	"hero_subtitle" varchar DEFAULT 'Empowering early-career professionals through innovation, leadership, and impact.' NOT NULL,
  	"who_we_are_heading" varchar DEFAULT 'Who We Are',
  	"who_we_are_content" jsonb NOT NULL,
  	"who_we_are_image_id" integer,
  	"vision_title" varchar DEFAULT 'Vision',
  	"vision_icon" varchar DEFAULT '👁',
  	"vision_text" varchar DEFAULT 'Be the leading professional organization for young professionals and industries in Sri Lanka.' NOT NULL,
  	"mission_title" varchar DEFAULT 'Mission',
  	"mission_icon" varchar DEFAULT '🎯',
  	"mission_text" varchar DEFAULT 'Increasing the industry members'' involvement and enhancing recognition among industries to attract and benefit fresh graduates.' NOT NULL,
  	"what_we_do_heading" varchar DEFAULT 'What We Do',
  	"initiatives_heading" varchar DEFAULT 'Our Flagship Initiatives',
  	"stats_heading" varchar DEFAULT 'Our Impact',
  	"global_heading" varchar DEFAULT 'IEEE Young Professionals Worldwide',
  	"global_intro" varchar DEFAULT 'IEEE Young Professionals is a global community spanning over 100 countries.',
  	"global_video_url" varchar,
  	"global_map_image_id" integer,
  	"cta_heading" varchar DEFAULT 'Want to be part of IEEE YPSL?',
  	"cta_subtext" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events" ADD CONSTRAINT "events_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events_rels" ADD CONSTRAINT "events_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_rels" ADD CONSTRAINT "events_rels_organizers_fk" FOREIGN KEY ("organizers_id") REFERENCES "public"."organizers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "organizers" ADD CONSTRAINT "organizers_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "executive_committees" ADD CONSTRAINT "executive_committees_committee_id_committees_id_fk" FOREIGN KEY ("committee_id") REFERENCES "public"."committees"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "executive_committees" ADD CONSTRAINT "executive_committees_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "authors" ADD CONSTRAINT "authors_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles" ADD CONSTRAINT "articles_author_id_authors_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."authors"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles" ADD CONSTRAINT "articles_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "ieee_projects" ADD CONSTRAINT "ieee_projects_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "awards" ADD CONSTRAINT "awards_award_image_id_media_id_fk" FOREIGN KEY ("award_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "sub_committees" ADD CONSTRAINT "sub_committees_committee_id_committees_id_fk" FOREIGN KEY ("committee_id") REFERENCES "public"."committees"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "sub_committees" ADD CONSTRAINT "sub_committees_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_organizers_fk" FOREIGN KEY ("organizers_id") REFERENCES "public"."organizers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_executive_committees_fk" FOREIGN KEY ("executive_committees_id") REFERENCES "public"."executive_committees"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_committees_fk" FOREIGN KEY ("committees_id") REFERENCES "public"."committees"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_authors_fk" FOREIGN KEY ("authors_id") REFERENCES "public"."authors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_articles_fk" FOREIGN KEY ("articles_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_ieee_projects_fk" FOREIGN KEY ("ieee_projects_id") REFERENCES "public"."ieee_projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_awards_fk" FOREIGN KEY ("awards_id") REFERENCES "public"."awards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_faqs_fk" FOREIGN KEY ("faqs_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_sub_committees_fk" FOREIGN KEY ("sub_committees_id") REFERENCES "public"."sub_committees"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "hero_section_banners" ADD CONSTRAINT "hero_section_banners_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "hero_section_banners" ADD CONSTRAINT "hero_section_banners_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."hero_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "overview_page_what_we_do_items" ADD CONSTRAINT "overview_page_what_we_do_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."overview_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "overview_page_initiatives" ADD CONSTRAINT "overview_page_initiatives_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "overview_page_initiatives" ADD CONSTRAINT "overview_page_initiatives_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."overview_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "overview_page_stats" ADD CONSTRAINT "overview_page_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."overview_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "overview_page_cta_buttons" ADD CONSTRAINT "overview_page_cta_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."overview_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "overview_page" ADD CONSTRAINT "overview_page_who_we_are_image_id_media_id_fk" FOREIGN KEY ("who_we_are_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "overview_page" ADD CONSTRAINT "overview_page_global_map_image_id_media_id_fk" FOREIGN KEY ("global_map_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_tablet_sizes_tablet_filename_idx" ON "media" USING btree ("sizes_tablet_filename");
  CREATE UNIQUE INDEX "events_slug_idx" ON "events" USING btree ("slug");
  CREATE INDEX "events_image_idx" ON "events" USING btree ("image_id");
  CREATE INDEX "events_updated_at_idx" ON "events" USING btree ("updated_at");
  CREATE INDEX "events_created_at_idx" ON "events" USING btree ("created_at");
  CREATE INDEX "events_rels_order_idx" ON "events_rels" USING btree ("order");
  CREATE INDEX "events_rels_parent_idx" ON "events_rels" USING btree ("parent_id");
  CREATE INDEX "events_rels_path_idx" ON "events_rels" USING btree ("path");
  CREATE INDEX "events_rels_organizers_id_idx" ON "events_rels" USING btree ("organizers_id");
  CREATE INDEX "organizers_logo_idx" ON "organizers" USING btree ("logo_id");
  CREATE INDEX "organizers_updated_at_idx" ON "organizers" USING btree ("updated_at");
  CREATE INDEX "organizers_created_at_idx" ON "organizers" USING btree ("created_at");
  CREATE INDEX "executive_committees_committee_idx" ON "executive_committees" USING btree ("committee_id");
  CREATE UNIQUE INDEX "executive_committees_slug_idx" ON "executive_committees" USING btree ("slug");
  CREATE INDEX "executive_committees_photo_idx" ON "executive_committees" USING btree ("photo_id");
  CREATE INDEX "executive_committees_updated_at_idx" ON "executive_committees" USING btree ("updated_at");
  CREATE INDEX "executive_committees_created_at_idx" ON "executive_committees" USING btree ("created_at");
  CREATE UNIQUE INDEX "committees_year_idx" ON "committees" USING btree ("year");
  CREATE INDEX "committees_updated_at_idx" ON "committees" USING btree ("updated_at");
  CREATE INDEX "committees_created_at_idx" ON "committees" USING btree ("created_at");
  CREATE INDEX "authors_photo_idx" ON "authors" USING btree ("photo_id");
  CREATE INDEX "authors_updated_at_idx" ON "authors" USING btree ("updated_at");
  CREATE INDEX "authors_created_at_idx" ON "authors" USING btree ("created_at");
  CREATE UNIQUE INDEX "articles_slug_idx" ON "articles" USING btree ("slug");
  CREATE INDEX "articles_author_idx" ON "articles" USING btree ("author_id");
  CREATE INDEX "articles_featured_image_idx" ON "articles" USING btree ("featured_image_id");
  CREATE INDEX "articles_updated_at_idx" ON "articles" USING btree ("updated_at");
  CREATE INDEX "articles_created_at_idx" ON "articles" USING btree ("created_at");
  CREATE INDEX "ieee_projects_logo_idx" ON "ieee_projects" USING btree ("logo_id");
  CREATE INDEX "ieee_projects_updated_at_idx" ON "ieee_projects" USING btree ("updated_at");
  CREATE INDEX "ieee_projects_created_at_idx" ON "ieee_projects" USING btree ("created_at");
  CREATE INDEX "awards_award_image_idx" ON "awards" USING btree ("award_image_id");
  CREATE INDEX "awards_updated_at_idx" ON "awards" USING btree ("updated_at");
  CREATE INDEX "awards_created_at_idx" ON "awards" USING btree ("created_at");
  CREATE INDEX "faqs_updated_at_idx" ON "faqs" USING btree ("updated_at");
  CREATE INDEX "faqs_created_at_idx" ON "faqs" USING btree ("created_at");
  CREATE INDEX "sub_committees_committee_idx" ON "sub_committees" USING btree ("committee_id");
  CREATE INDEX "sub_committees_photo_idx" ON "sub_committees" USING btree ("photo_id");
  CREATE INDEX "sub_committees_updated_at_idx" ON "sub_committees" USING btree ("updated_at");
  CREATE INDEX "sub_committees_created_at_idx" ON "sub_committees" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_events_id_idx" ON "payload_locked_documents_rels" USING btree ("events_id");
  CREATE INDEX "payload_locked_documents_rels_organizers_id_idx" ON "payload_locked_documents_rels" USING btree ("organizers_id");
  CREATE INDEX "payload_locked_documents_rels_executive_committees_id_idx" ON "payload_locked_documents_rels" USING btree ("executive_committees_id");
  CREATE INDEX "payload_locked_documents_rels_committees_id_idx" ON "payload_locked_documents_rels" USING btree ("committees_id");
  CREATE INDEX "payload_locked_documents_rels_authors_id_idx" ON "payload_locked_documents_rels" USING btree ("authors_id");
  CREATE INDEX "payload_locked_documents_rels_articles_id_idx" ON "payload_locked_documents_rels" USING btree ("articles_id");
  CREATE INDEX "payload_locked_documents_rels_ieee_projects_id_idx" ON "payload_locked_documents_rels" USING btree ("ieee_projects_id");
  CREATE INDEX "payload_locked_documents_rels_awards_id_idx" ON "payload_locked_documents_rels" USING btree ("awards_id");
  CREATE INDEX "payload_locked_documents_rels_faqs_id_idx" ON "payload_locked_documents_rels" USING btree ("faqs_id");
  CREATE INDEX "payload_locked_documents_rels_sub_committees_id_idx" ON "payload_locked_documents_rels" USING btree ("sub_committees_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "hero_section_banners_order_idx" ON "hero_section_banners" USING btree ("_order");
  CREATE INDEX "hero_section_banners_parent_id_idx" ON "hero_section_banners" USING btree ("_parent_id");
  CREATE INDEX "hero_section_banners_image_idx" ON "hero_section_banners" USING btree ("image_id");
  CREATE INDEX "overview_page_what_we_do_items_order_idx" ON "overview_page_what_we_do_items" USING btree ("_order");
  CREATE INDEX "overview_page_what_we_do_items_parent_id_idx" ON "overview_page_what_we_do_items" USING btree ("_parent_id");
  CREATE INDEX "overview_page_initiatives_order_idx" ON "overview_page_initiatives" USING btree ("_order");
  CREATE INDEX "overview_page_initiatives_parent_id_idx" ON "overview_page_initiatives" USING btree ("_parent_id");
  CREATE INDEX "overview_page_initiatives_logo_idx" ON "overview_page_initiatives" USING btree ("logo_id");
  CREATE INDEX "overview_page_stats_order_idx" ON "overview_page_stats" USING btree ("_order");
  CREATE INDEX "overview_page_stats_parent_id_idx" ON "overview_page_stats" USING btree ("_parent_id");
  CREATE INDEX "overview_page_cta_buttons_order_idx" ON "overview_page_cta_buttons" USING btree ("_order");
  CREATE INDEX "overview_page_cta_buttons_parent_id_idx" ON "overview_page_cta_buttons" USING btree ("_parent_id");
  CREATE INDEX "overview_page_who_we_are_image_idx" ON "overview_page" USING btree ("who_we_are_image_id");
  CREATE INDEX "overview_page_global_map_image_idx" ON "overview_page" USING btree ("global_map_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "events" CASCADE;
  DROP TABLE "events_rels" CASCADE;
  DROP TABLE "organizers" CASCADE;
  DROP TABLE "executive_committees" CASCADE;
  DROP TABLE "committees" CASCADE;
  DROP TABLE "authors" CASCADE;
  DROP TABLE "articles" CASCADE;
  DROP TABLE "ieee_projects" CASCADE;
  DROP TABLE "awards" CASCADE;
  DROP TABLE "faqs" CASCADE;
  DROP TABLE "sub_committees" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "hero_section_banners" CASCADE;
  DROP TABLE "hero_section" CASCADE;
  DROP TABLE "about_section" CASCADE;
  DROP TABLE "overview_page_what_we_do_items" CASCADE;
  DROP TABLE "overview_page_initiatives" CASCADE;
  DROP TABLE "overview_page_stats" CASCADE;
  DROP TABLE "overview_page_cta_buttons" CASCADE;
  DROP TABLE "overview_page" CASCADE;
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_users_project";
  DROP TYPE "public"."enum_events_project";
  DROP TYPE "public"."enum_events_timezone";
  DROP TYPE "public"."enum_events_event_type";
  DROP TYPE "public"."enum_events_online_platform";
  DROP TYPE "public"."enum_articles_project";
  DROP TYPE "public"."enum_sub_committees_pillar";
  DROP TYPE "public"."enum_sub_committees_position";
  DROP TYPE "public"."enum_sub_committees_category";
  DROP TYPE "public"."enum_overview_page_initiatives_tag";
  DROP TYPE "public"."enum_overview_page_cta_buttons_style";`)
}
