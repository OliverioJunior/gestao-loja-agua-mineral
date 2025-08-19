-- DropForeignKey
ALTER TABLE "public"."itens" DROP CONSTRAINT "itens_atualizado_por_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."itens" DROP CONSTRAINT "itens_pedido_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."pedidos" DROP CONSTRAINT "pedidos_atualizado_por_id_fkey";

-- AlterTable
ALTER TABLE "public"."itens" ALTER COLUMN "pedido_id" DROP NOT NULL,
ALTER COLUMN "atualizado_por_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."pedidos" ALTER COLUMN "atualizado_por_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."pedidos" ADD CONSTRAINT "pedidos_atualizado_por_id_fkey" FOREIGN KEY ("atualizado_por_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."itens" ADD CONSTRAINT "itens_pedido_id_fkey" FOREIGN KEY ("pedido_id") REFERENCES "public"."pedidos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."itens" ADD CONSTRAINT "itens_atualizado_por_id_fkey" FOREIGN KEY ("atualizado_por_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
