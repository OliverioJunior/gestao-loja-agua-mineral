"use client";

import { memo } from "react";
import { usePathname } from "next/navigation";
import {
  RouteKey,
  HeaderDescriptionData,
  HeaderDescriptionProps,
  HeaderContentProps,
} from "./types";
import { ROUTE_CONFIG } from "./route-config";

const HeaderContent = memo<HeaderContentProps>(({ data, className }) => {
  const {
    title,
    description,
    icon: Icon,
    titleClassName,
    descriptionClassName,
  } = data;

  return (
    <div className={className}>
      <h1 className={`flex items-center gap-2 ${titleClassName}`}>
        {Icon && <Icon className="w-6 h-6 text-blue-400" />}
        {title}
      </h1>
      <p className={descriptionClassName}>{description}</p>
    </div>
  );
});

HeaderContent.displayName = "HeaderContent";

// Componente principal
export const HeaderDescription = memo<HeaderDescriptionProps>(
  ({
    className,
    fallbackTitle = "Página não encontrada",
    fallbackDescription = "O sistema não possui a rota que você está tentando acessar.",
  }) => {
    const pathname = usePathname();

    // Função helper para obter dados da rota
    const getRouteData = (path: string): HeaderDescriptionData => {
      // Verifica se é uma rota exata
      const exactRoute = path in ROUTE_CONFIG;
      if (exactRoute) {
        return ROUTE_CONFIG[path as RouteKey];
      }
      // Verifica se é uma subrota (ex: /estoque/123)
      const subRoute = path.split("/").slice(0, 2).join("/");
      const baseRoute = Object.keys(ROUTE_CONFIG).find(
        (route) => route !== "/" && subRoute.startsWith(route)
      );

      if (baseRoute && baseRoute in ROUTE_CONFIG) {
        return ROUTE_CONFIG[baseRoute as RouteKey];
      }

      // Fallback para rotas não mapeadas
      return {
        title: fallbackTitle,
        description: fallbackDescription,
        titleClassName: "text-2xl font-bold text-foreground",
        descriptionClassName: "text-muted-foreground",
      };
    };

    const routeData = getRouteData(pathname);

    return <HeaderContent data={routeData} className={className} />;
  }
);

HeaderDescription.displayName = "HeaderDescription";
