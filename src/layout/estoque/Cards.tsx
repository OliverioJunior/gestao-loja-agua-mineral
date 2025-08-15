import { Package, TrendingUp, AlertTriangle } from "lucide-react";
import { ResumoCard } from "./ResumoCard";

interface IEstatisticas {
  total: number;
  ativos: number;
  inativos: number;
  estoqueOk: number;
  estoqueBaixo: number;
  estoqueCritico: number;
  valorTotalEstoque: number;
}

interface ICards {
  estatisticas: IEstatisticas;
}

export const Cards: React.FC<ICards> = ({ estatisticas }) => {
  const { total, ativos, estoqueBaixo, estoqueCritico, valorTotalEstoque } =
    estatisticas;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <ResumoCard
        titulo="Total de Produtos"
        valor={total}
        icone={<Package className="w-6 h-6 text-blue-400" />}
        cor="text-blue-400"
        subtitulo={`${ativos} ativos`}
      />

      <ResumoCard
        titulo="Valor Total"
        valor={`R$ ${(valorTotalEstoque / 100).toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
        })}`}
        subtitulo="💰 Inventário atual"
        icone={<TrendingUp className="w-6 h-6 text-green-400" />}
        cor="text-green-400"
      />

      <ResumoCard
        titulo="Estoque Baixo"
        valor={estoqueBaixo}
        subtitulo="⚠️ Produtos"
        icone={<AlertTriangle className="w-6 h-6 text-yellow-400" />}
        cor="text-yellow-400"
      />

      <ResumoCard
        titulo="Alertas Críticos"
        valor={estoqueCritico}
        subtitulo="🚨 Reposição urgente"
        icone={<AlertTriangle className="w-6 h-6 text-red-400" />}
        cor="text-red-400"
      />
    </div>
  );
};
