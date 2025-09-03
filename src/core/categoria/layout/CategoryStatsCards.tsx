import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/shared/components/ui";
import { Tag, Package } from "lucide-react";
import { ICategoryStats } from "./types";

interface CategoryStatsCardsProps {
  stats: ICategoryStats;
}

export function CategoryStatsCards({ stats }: CategoryStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <Card className="bg-card/80 backdrop-blur-sm border-0">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
            Total de Categorias
            <Tag className="h-4 w-4 text-primary" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            {stats.total}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card/80 backdrop-blur-sm border-0">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
            Com Produtos
            <Package className="h-4 w-4 text-blue-400" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-400">
            {stats.withProducts}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
