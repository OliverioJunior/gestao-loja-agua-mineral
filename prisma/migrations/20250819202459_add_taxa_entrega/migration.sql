-- AlterTable
ALTER TABLE "public"."pedidos" ADD COLUMN     "formaPagamento" TEXT NOT NULL DEFAULT 'dinheiro',
ADD COLUMN     "taxa_entrega" INTEGER;
