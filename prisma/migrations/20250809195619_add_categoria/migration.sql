/*
  Warnings:

  - You are about to drop the column `categoria` on the `Produto` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."Produto_categoria_idx";

-- AlterTable
ALTER TABLE "public"."Produto" DROP COLUMN "categoria",
ADD COLUMN     "categoria_id" VARCHAR(100);

-- CreateTable
CREATE TABLE "public"."Categoria" (
    "id" TEXT NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "productsCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Categoria_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Produto" ADD CONSTRAINT "Produto_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "public"."Categoria"("id") ON DELETE SET NULL ON UPDATE CASCADE;
