/*
  Warnings:

  - The values [PREPARANDO] on the enum `StatusPedido` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."StatusPedido_new" AS ENUM ('PENDENTE', 'CONFIRMADO', 'ENTREGUE', 'CANCELADO');
ALTER TABLE "public"."pedidos" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "public"."pedidos" ALTER COLUMN "status" TYPE "public"."StatusPedido_new" USING ("status"::text::"public"."StatusPedido_new");
ALTER TYPE "public"."StatusPedido" RENAME TO "StatusPedido_old";
ALTER TYPE "public"."StatusPedido_new" RENAME TO "StatusPedido";
DROP TYPE "public"."StatusPedido_old";
ALTER TABLE "public"."pedidos" ALTER COLUMN "status" SET DEFAULT 'PENDENTE';
COMMIT;
