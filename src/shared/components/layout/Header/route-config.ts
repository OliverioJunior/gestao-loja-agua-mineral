import { LayoutDashboard, Package, Settings, Users } from "lucide-react";
import { RouteKey, HeaderDescriptionData } from "./types";

export const ROUTE_CONFIG: Record<RouteKey, HeaderDescriptionData> = {
  "/": {
    title: "Dashboard",
    description: "Visão geral do seu negócio",
    icon: LayoutDashboard,
    titleClassName: "text-2xl font-bold text-foreground",
    descriptionClassName: "text-muted-foreground",
  },
  "/estoque": {
    title: "Estoque",
    description: "Gerencie seus produtos e controle de estoque",
    icon: Package,
    titleClassName: "text-2xl font-semibold text-white",
    descriptionClassName: "text-slate-400 mt-1",
  },
  "/vendas": {
    title: "Vendas",
    description: "Acompanhe suas vendas e faturamento",
    titleClassName: "text-2xl font-bold text-foreground",
    descriptionClassName: "text-muted-foreground",
  },
  "/relatorios": {
    title: "Relatórios",
    description: "Análises e relatórios detalhados",
    titleClassName: "text-2xl font-bold text-foreground",
    descriptionClassName: "text-muted-foreground",
  },
  "/configuracoes": {
    title: "Configurações",
    description: "Personalize e configure todos os aspectos do seu sistema",
    icon: Settings,
    titleClassName: "text-2xl font-bold text-foreground",
    descriptionClassName: "text-muted-foreground",
  },
  "/clientes": {
    title: "Clientes",
    description: "Gerencie seus clientes e acompanhe suas informações",
    icon: Users,
    titleClassName: "text-2xl font-bold text-foreground",
    descriptionClassName: "text-muted-foreground",
  },
  "/pedidos": {
    title: "Pedidos",
    description: "Acompanhe seus pedidos e clientes",
    icon: Package,
    titleClassName: "text-2xl font-bold text-foreground",
    descriptionClassName: "text-muted-foreground",
  },
};
