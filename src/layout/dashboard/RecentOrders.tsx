import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  Button,
} from "@/shared/components/ui";
import { Clock, Eye, Badge } from "lucide-react";
import { redirect } from "next/navigation";

interface Order {
  id: string;
  customer: string;
  value: number;
  status: string;
  createdAt: string;
}

interface RecentOrdersProps {
  recentOrders: Order[];
}

export function RecentOrders({ recentOrders }: RecentOrdersProps) {
  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400";
      case "preparing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-400";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-400";
    }
  };

  const getOrderStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Concluído";
      case "preparing":
        return "Preparando";
      case "pending":
        return "Pendente";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[var(--foreground)]">
          <Clock className="h-5 w-5 text-[var(--chart-2)]" />
          Pedidos Recentes
        </CardTitle>
        <CardDescription className="text-[var(--muted-foreground)]">
          Últimos pedidos do dia
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentOrders.map((order, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-[var(--card)] rounded-lg border border-[var(--border)]"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm text-[var(--foreground)]">
                    {order.id}
                  </span>
                  <Badge className={getOrderStatusColor(order.status)}>
                    {getOrderStatusText(order.status)}
                  </Badge>
                </div>
                <p className="text-sm text-[var(--muted-foreground)]">
                  {order.customer}
                </p>
                <p className="text-xs text-[var(--muted-foreground)]">
                  {order.createdAt}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-green-600 dark:text-green-400">
                  R${" "}
                  {order.value.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </p>
                <Button variant="ghost" size="sm" className="mt-1">
                  <Eye className="h-3 w-3 text-[var(--foreground)]" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        <Button
          variant="outline"
          className="w-full mt-4"
          onClick={() => {
            redirect("/pedidos");
          }}
        >
          Ver todos os pedidos
        </Button>
      </CardContent>
    </Card>
  );
}
