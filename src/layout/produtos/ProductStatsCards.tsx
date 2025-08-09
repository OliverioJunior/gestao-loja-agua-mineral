import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui";
import {
  Package,
  CheckCircle,
  XCircle,
  Tag,
  AlertTriangle,
} from "lucide-react";
import { IProductStats } from "./types";

interface ProductStatsCardsProps {
  stats: IProductStats;
}

export function ProductStatsCards({ stats }: ProductStatsCardsProps) {
  const cards = [
    {
      title: "Total de Produtos",
      value: stats.total,
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      borderColor: "border-blue-200",
    },
    {
      title: "Produtos Ativos",
      value: stats.ativo,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
      borderColor: "border-green-200",
    },
    {
      title: "Produtos Inativos",
      value: stats.inativo,
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-100",
      borderColor: "border-red-200",
    },
    {
      title: "Em Promoção",
      value: stats.promocao,
      icon: Tag,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      borderColor: "border-purple-200",
    },
    {
      title: "Estoque Baixo",
      value: stats.estoqueBaixo,
      icon: AlertTriangle,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
      borderColor: "border-yellow-200",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card
            key={index}
            className={`bg-card/60 backdrop-blur-sm border-0 ${card.borderColor} hover:shadow-lg transition-all duration-300`}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${card.color}`}>
                {card.value}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
