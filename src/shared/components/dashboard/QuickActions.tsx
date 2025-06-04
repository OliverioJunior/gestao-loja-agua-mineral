import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  Button,
} from "@/shared/components/ui";
import { Package, ShoppingCart, TrendingUp, Users } from "lucide-react";

interface QuickAction {
  title: string;
  icon: React.ReactNode;
  onClick?: () => void;
}

interface QuickActionsProps {
  onNewOrder?: () => void;
  onAddStock?: () => void;
  onNewCustomer?: () => void;
  onViewReports?: () => void;
}

export function QuickActions({
  onNewOrder,
  onAddStock,
  onNewCustomer,
  onViewReports,
}: QuickActionsProps) {
  const actions: QuickAction[] = [
    {
      title: "Novo Pedido",
      icon: <ShoppingCart className="h-6 w-6 text-[var(--primary)]" />,
      onClick: onNewOrder,
    },
    {
      title: "Add Estoque",
      icon: <Package className="h-6 w-6 text-[var(--chart-3)]" />,
      onClick: onAddStock,
    },
    {
      title: "Novo Cliente",
      icon: <Users className="h-6 w-6 text-[var(--chart-4)]" />,
      onClick: onNewCustomer,
    },
    {
      title: "Relatórios",
      icon: <TrendingUp className="h-6 w-6 text-[var(--chart-5)]" />,
      onClick: onViewReports,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-[var(--foreground)]">
          Ações Rápidas
        </CardTitle>
        <CardDescription className="text-[var(--muted-foreground)]">
          Acesso rápido às principais funcionalidades
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-20 flex-col gap-2 text-[var(--foreground)] border-[var(--border)]"
              onClick={action.onClick}
            >
              {action.icon}
              {action.title}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
