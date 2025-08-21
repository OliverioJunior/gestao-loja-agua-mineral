/*
  Warnings:

  - You are about to drop the column `data` on the `pedidos` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."pedidos_data_idx";

-- AlterTable
ALTER TABLE "public"."pedidos" DROP COLUMN "data",
ADD COLUMN     "data_entrega" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "pedidos_data_entrega_idx" ON "public"."pedidos"("data_entrega");
