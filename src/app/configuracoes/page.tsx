"use client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/shared/components/ui";
import { Users, Package, ShoppingCart, Building, ChevronRight } from "lucide-react";
import Link from "next/link";

interface ConfigItem {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  href: string;
}

export default function Configuracaos() {
  const configs: ConfigItem[] = [
    {
      title: "Usuários e Permissões",
      description: "Gerenciar contas de usuário e níveis de acesso",
      icon: <Users className="h-5 w-5" />,
      color: "bg-primary/10 text-primary border-primary/20",
      href: "/configuracoes/usuarios",
    },
    {
      title: "Categorias de Produto",
      description: "Organizar e classificar produtos do catálogo",
      icon: <Package className="h-5 w-5" />,
      color: "bg-chart-2/10 text-chart-2 border-chart-2/20",
      href: "/configuracoes/categorias",
    },
    {
      title: "Gestão de Produtos",
      description: "Cadastrar produtos e controlar estoque",
      icon: <ShoppingCart className="h-5 w-5" />,
      color: "bg-chart-4/10 text-chart-4 border-chart-4/20",
      href: "/configuracoes/produtos",
    },
    {
      title: "Gestão de Fornecedores",
      description: "Cadastrar e gerenciar fornecedores e parceiros",
      icon: <Building className="h-5 w-5" />,
      color: "bg-chart-3/10 text-chart-3 border-chart-3/20",
      href: "/configuracoes/fornecedores",
    },
  ];

  return (
    <main className="min-h-[calc(100dvh-93px)] p-6">
      <div className="my-18 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {configs.map((config, index) => (
            <Card
              key={index}
              className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-0 bg-card/80 backdrop-blur-sm"
            >
              <CardContent className="p-6">
                <Link id={config.href} href={config.href}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl border ${config.color}`}>
                        {config.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {config.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {config.description}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-card/60 backdrop-blur-sm border-0">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl font-bold text-chart-2">
                100%
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-muted-foreground">Sistema Saudável</p>
            </CardContent>
          </Card>

          <Card className="bg-card/60 backdrop-blur-sm border-0">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl font-bold text-primary">
                24/7
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-muted-foreground">
                Monitoramento Ativo
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/60 backdrop-blur-sm border-0">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl font-bold text-chart-4">
                v0.1
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-muted-foreground">Versão Atual</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
