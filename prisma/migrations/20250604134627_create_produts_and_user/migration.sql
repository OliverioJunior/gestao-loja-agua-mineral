-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "produtos" (
    "id" TEXT NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "descricao" TEXT,
    "marca" VARCHAR(100),
    "categoria" VARCHAR(100),
    "precoCusto" INTEGER NOT NULL,
    "precoVenda" INTEGER NOT NULL,
    "precoRevenda" INTEGER,
    "precoPromocao" INTEGER,
    "quantidade" INTEGER NOT NULL DEFAULT 0,
    "estoqueMinimo" INTEGER DEFAULT 0,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "promocao" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "produtos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "produtos_nome_idx" ON "produtos"("nome");

-- CreateIndex
CREATE INDEX "produtos_categoria_idx" ON "produtos"("categoria");

-- CreateIndex
CREATE INDEX "produtos_marca_idx" ON "produtos"("marca");

-- CreateIndex
CREATE INDEX "produtos_ativo_idx" ON "produtos"("ativo");

-- CreateIndex
CREATE INDEX "produtos_promocao_idx" ON "produtos"("promocao");
