-- DropForeignKey
ALTER TABLE "public"."vendas" DROP CONSTRAINT "vendas_atualizado_por_id_fkey";

-- AlterTable
ALTER TABLE "public"."vendas" ALTER COLUMN "atualizado_por_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."vendas" ADD CONSTRAINT "vendas_atualizado_por_id_fkey" FOREIGN KEY ("atualizado_por_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
