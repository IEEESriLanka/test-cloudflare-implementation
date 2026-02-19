import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // 1. Create Media Category Enum if it doesn't exist
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_media_category" AS ENUM('ypsl', 'executive-committees', 'standing-committees', 'ai-driven-sri-lanka', 'sl-inspire', 'lets-talk', 'insl', 'studpro', 'y2npro', 'merch-payslips', 'others', 'merchants', 'ieee-projects', 'events');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `);

  // 2. Add category to Media Table if it doesn't exist
  await db.execute(sql`
    ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "category" "enum_media_category";
  `);

  // 3. Update SubCommittees category data
  // First, convert the column to text to allow any value during transition
  await db.execute(sql`
    ALTER TABLE "sub_committees" ALTER COLUMN "category" TYPE text;
  `);

  // Update data values to new keys to match the new enum
  await db.execute(sql`
    UPDATE "sub_committees" SET "category" = 'member-benefits-and-opportunities' WHERE "category" = 'member-benefits';
    UPDATE "sub_committees" SET "category" = 'volunteer-training-and-development' WHERE "category" = 'volunteer-training';
    UPDATE "sub_committees" SET "category" = 'marketing-and-communication' WHERE "category" = 'marketing-committee';
    UPDATE "sub_committees" SET "category" = 'environmental-social-governance' WHERE "category" = 'esg';
    -- Any values that don't match the new enum should be set to a default or handled. 
    -- We assume the others are already correct or don't exist yet.
  `);

  // 4. Update enum_sub_committees_category
  // Rename old type and create new one
  await db.execute(sql`
    ALTER TYPE "public"."enum_sub_committees_category" RENAME TO "enum_sub_committees_category_old";
    CREATE TYPE "public"."enum_sub_committees_category" AS ENUM(
      'program-management', 
      'event-management', 
      'finance-partnership', 
      'industry-engagements', 
      'collaboration', 
      'people-management', 
      'member-benefits-and-opportunities', 
      'volunteer-engagement', 
      'membership-development', 
      'volunteer-training-and-development', 
      'marketing-and-communication', 
      'editorial', 
      'environmental-social-governance'
    );
  `);

  // Change column type back to the new enum
  await db.execute(sql`
    ALTER TABLE "sub_committees" ALTER COLUMN "category" TYPE "public"."enum_sub_committees_category" USING "category"::"public"."enum_sub_committees_category";
  `);

  // Drop old type
  await db.execute(sql`
    DROP TYPE "public"."enum_sub_committees_category_old";
  `);
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // To revert:
  // 1. Convert sub_committees category to text
  await db.execute(sql`ALTER TABLE "sub_committees" ALTER COLUMN "category" TYPE text;`);
  
  // 2. Map values back
  await db.execute(sql`
    UPDATE "sub_committees" SET "category" = 'member-benefits' WHERE "category" = 'member-benefits-and-opportunities';
    UPDATE "sub_committees" SET "category" = 'volunteer-training' WHERE "category" = 'volunteer-training-and-development';
    UPDATE "sub_committees" SET "category" = 'marketing-committee' WHERE "category" = 'marketing-and-communication';
    UPDATE "sub_committees" SET "category" = 'esg' WHERE "category" = 'environmental-social-governance';
  `);

  // 3. Recreate old enum
  await db.execute(sql`
    ALTER TYPE "public"."enum_sub_committees_category" RENAME TO "enum_sub_committees_category_new";
    CREATE TYPE "public"."enum_sub_committees_category" AS ENUM('program-management', 'event-management', 'finance-partnership', 'industry-engagements', 'collaboration', 'people-management', 'member-benefits', 'membership-development', 'volunteer-training', 'marketing-committee', 'editorial', 'esg');
    ALTER TABLE "sub_committees" ALTER COLUMN "category" TYPE "public"."enum_sub_committees_category" USING "category"::"public"."enum_sub_committees_category";
    DROP TYPE "public"."enum_sub_committees_category_new";
  `);

  // 4. Remove columns/types added to media
  await db.execute(sql`ALTER TABLE "media" DROP COLUMN IF EXISTS "category";`);
  await db.execute(sql`DROP TYPE IF EXISTS "public"."enum_media_category";`);
}
