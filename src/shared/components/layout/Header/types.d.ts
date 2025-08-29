export type RouteKey =
  | "/"
  | "/estoque"
  | "/vendas"
  | "/relatorios"
  | "/configuracoes"
  | "/clientes"
  | "/pedidos"
  | "/despesas";

export interface HeaderDescriptionData {
  title: string;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
  titleClassName?: string;
  descriptionClassName?: string;
}

export interface HeaderDescriptionProps {
  className?: string;
  fallbackTitle?: string;
  fallbackDescription?: string;
}

export interface HeaderContentProps {
  data: HeaderDescriptionData;
  className?: string;
}

export interface HeaderMobileProps {
  onMenuClick: () => void;
  onNotificationClick?: () => void;
  appName?: string;
  className?: string;
  "data-testid"?: string;
}

export interface HeaderDesktopProps {
  onNotificationClick?: () => void;
}
