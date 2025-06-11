import { Package, TrendingUp, AlertTriangle } from "lucide-react";
import { ResumoCard } from "./ResumoCard";
import { IProduto } from "./ProdutoRow";
interface ICards {
  produtos: IProduto[];
}
export const Cards: React.FC<ICards> = ({ produtos }) => {
  console.log({ produtos });
  const totalProdutos = produtos.length;
  const produtosBaixo = produtos.filter((p) => p.status === "baixo").length;
  const produtosCriticos = produtos.filter(
    (p) => p.status === "critico"
  ).length;
  const valorTotal = produtos.reduce((acc, p) => acc + p.estoque * p.preco, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <ResumoCard
        titulo="Total de Produtos"
        valor={totalProdutos}
        icone={<Package className="w-6 h-6 text-blue-400" />}
        cor="text-blue-400"
        subtitulo={""}
      />

      <ResumoCard
        titulo="Valor Total"
        valor={`R$ ${valorTotal.toFixed(2)}`}
        subtitulo="↗ Inventário atual"
        icone={<TrendingUp className="w-6 h-6 text-green-400" />}
        cor="text-green-400"
      />

      <ResumoCard
        titulo="Estoque Baixo"
        valor={produtosBaixo}
        subtitulo="⚠ Produtos"
        icone={<AlertTriangle className="w-6 h-6 text-yellow-400" />}
        cor="text-yellow-400"
      />

      <ResumoCard
        titulo="Alertas Críticos"
        valor={produtosCriticos}
        subtitulo="🚨 Reposição urgente"
        icone={<AlertTriangle className="w-6 h-6 text-red-400" />}
        cor="text-red-400"
      />
    </div>
  );
};
