/*
  Warnings:

  - The `weight` column on the `Activity` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `weight` column on the `SubActivity` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Activity" ALTER COLUMN "name" SET DEFAULT 'New Activity',
ALTER COLUMN "unit" SET DEFAULT 'hours',
DROP COLUMN "weight",
ADD COLUMN     "weight" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "SubActivity" ALTER COLUMN "name" SET DEFAULT 'New SubActivity',
ALTER COLUMN "unit" SET DEFAULT 'hours',
DROP COLUMN "weight",
ADD COLUMN     "weight" INTEGER NOT NULL DEFAULT 0;
