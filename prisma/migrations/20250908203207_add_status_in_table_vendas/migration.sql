-- CreateEnum
CREATE TYPE "public"."StatusVenda" AS ENUM ('QUITADO', 'EM_ABERTO');

-- AlterTable
ALTER TABLE "public"."vendas" ADD COLUMN     "status" "public"."StatusVenda" NOT NULL DEFAULT 'QUITADO';
