-- DropForeignKey
ALTER TABLE "public"."pedidos" DROP CONSTRAINT "pedidos_endereco_id_fkey";

-- AlterTable
ALTER TABLE "public"."pedidos" ALTER COLUMN "endereco_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."pedidos" ADD CONSTRAINT "pedidos_endereco_id_fkey" FOREIGN KEY ("endereco_id") REFERENCES "public"."Endereco"("id") ON DELETE SET NULL ON UPDATE CASCADE;
