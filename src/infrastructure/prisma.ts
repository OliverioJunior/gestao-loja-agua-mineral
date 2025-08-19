import { PrismaClient } from "@/infrastructure/generated/prisma";

export type PrismaTransaction = Omit<
  PrismaClient,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
>;
export const prisma = new PrismaClient();
