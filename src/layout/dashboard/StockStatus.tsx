import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  Progress,
} from "@/shared/components/ui";
import { Package, Badge } from "lucide-react";

interface StockItem {
  product: string;
  stock: number;
  minimum: number;
  status: string;
}

interface StockStatusProps {
  stockData: StockItem[];
}

export function StockStatus({ stockData }: StockStatusProps) {
  const getStockColor = (status: string) => {
    switch (status) {
      case "critical":
        return "text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400";
      case "low":
        return "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400";
      default:
        return "text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[var(--foreground)]">
          <Package className="h-5 w-5 text-[var(--primary)]" />
          Status do Estoque
        </CardTitle>
        <CardDescription className="text-[var(--muted-foreground)]">
          Controle dos produtos em estoque
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {stockData.map((item, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium text-sm text-[var(--foreground)]">
                {item.product}
              </span>
              <Badge className={getStockColor(item.status)}>
                {item.stock} unidades
              </Badge>
            </div>
            <Progress
              value={(item.stock / (item.minimum * 3)) * 100}
              className="h-2 bg-[var(--border)]"
            />
            <div className="flex justify-between text-xs text-[var(--muted-foreground)]">
              <span>Mínimo: {item.minimum}</span>
              <span
                className={`${
                  item.stock <= item.minimum
                    ? "text-red-600 dark:text-red-400 font-medium"
                    : ""
                }`}
              >
                {item.stock <= item.minimum ? "Repor estoque!" : "OK"}
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
