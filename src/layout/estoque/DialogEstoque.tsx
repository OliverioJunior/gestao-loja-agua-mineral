import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@/shared/components/ui";
import { Plus, Package, TrendingUp } from "lucide-react";
import { IProduto } from "./ProdutoRow";

interface DialogEstoqueProps {
  produtos?: IProduto[];
  onAddStock?: (produtoId: number, quantidade: number, observacao?: string) => void;
}

export const DialogEstoque = ({ produtos = [], onAddStock }: DialogEstoqueProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    produtoId: "",
    quantidade: "",
    observacao: "",
  });

  // Produtos mockados para demonstração
  const produtosMock: IProduto[] = [
    {
      id: 1,
      nome: "Água Mineral Crystal 500ml",
      categoria: "Bebidas",
      estoque: 45,
      minimo: 20,
      preco: 2.50,
      status: "ok",
      ultimaMovimentacao: "2024-01-15"
    },
    {
      id: 2,
      nome: "Água Mineral Bonafont 1L",
      categoria: "Bebidas",
      estoque: 12,
      minimo: 15,
      preco: 3.80,
      status: "baixo",
      ultimaMovimentacao: "2024-01-14"
    },
    {
      id: 3,
      nome: "Água Mineral São Lourenço 500ml",
      categoria: "Bebidas",
      estoque: 5,
      minimo: 25,
      preco: 2.20,
      status: "critico",
      ultimaMovimentacao: "2024-01-13"
    },
    {
      id: 4,
      nome: "Água Mineral Schin 1.5L",
      categoria: "Bebidas",
      estoque: 30,
      minimo: 10,
      preco: 4.50,
      status: "ok",
      ultimaMovimentacao: "2024-01-16"
    }
  ];

  const produtosDisponiveis = produtos.length > 0 ? produtos : produtosMock;
  const produtoSelecionado = produtosDisponiveis.find(p => p.id.toString() === formData.produtoId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.produtoId || !formData.quantidade) {
      return;
    }

    const quantidade = parseInt(formData.quantidade);
    if (quantidade <= 0) {
      return;
    }

    if (onAddStock) {
      onAddStock(parseInt(formData.produtoId), quantidade, formData.observacao || undefined);
    }

    handleClose();
  };

  const handleClose = () => {
    setFormData({
      produtoId: "",
      quantidade: "",
      observacao: "",
    });
    setIsOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ok":
        return "text-green-400";
      case "baixo":
        return "text-yellow-400";
      case "critico":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "ok":
        return "Em estoque";
      case "baixo":
        return "Estoque baixo";
      case "critico":
        return "Estoque crítico";
      default:
        return "Indefinido";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Adicionar Estoque
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl bg-card/95 backdrop-blur-sm border-border/50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
            <TrendingUp className="h-5 w-5 text-blue-500" />
            Adicionar Estoque
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Seleção do Produto */}
          <div className="space-y-2">
            <Label htmlFor="produto">Produto *</Label>
            <Select
              value={formData.produtoId}
              onValueChange={(value) => setFormData({ ...formData, produtoId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um produto" />
              </SelectTrigger>
              <SelectContent>
                {produtosDisponiveis.map((produto) => (
                  <SelectItem key={produto.id} value={produto.id.toString()}>
                    <div className="flex items-center justify-between w-full">
                      <span>{produto.nome}</span>
                      <div className="flex items-center gap-2 ml-4">
                        <span className="text-xs text-muted-foreground">
                          Estoque: {produto.estoque}
                        </span>
                        <span className={`text-xs ${getStatusColor(produto.status)}`}>
                          {getStatusText(produto.status)}
                        </span>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Informações do Produto Selecionado */}
          {produtoSelecionado && (
            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-primary" />
                <span className="font-medium">Informações do Produto</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Categoria:</span>
                  <p className="font-medium">{produtoSelecionado.categoria}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Estoque Atual:</span>
                  <p className="font-medium">{produtoSelecionado.estoque} unidades</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Estoque Mínimo:</span>
                  <p className="font-medium">{produtoSelecionado.minimo} unidades</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Status:</span>
                  <p className={`font-medium ${getStatusColor(produtoSelecionado.status)}`}>
                    {getStatusText(produtoSelecionado.status)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Quantidade a Adicionar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantidade">Quantidade a Adicionar *</Label>
              <Input
                id="quantidade"
                type="number"
                min="1"
                value={formData.quantidade}
                onChange={(e) => setFormData({ ...formData, quantidade: e.target.value })}
                placeholder="Ex: 50"
                required
              />
            </div>
            
            {/* Novo Estoque Calculado */}
            {produtoSelecionado && formData.quantidade && (
              <div className="space-y-2">
                <Label>Novo Estoque Total</Label>
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                  <p className="text-lg font-semibold text-green-600">
                    {produtoSelecionado.estoque + parseInt(formData.quantidade || "0")} unidades
                  </p>
                  <p className="text-xs text-muted-foreground">
                    +{formData.quantidade} unidades adicionadas
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Observações */}
          <div className="space-y-2">
            <Label htmlFor="observacao">Observações (Opcional)</Label>
            <Textarea
              id="observacao"
              value={formData.observacao}
              onChange={(e) => setFormData({ ...formData, observacao: e.target.value })}
              placeholder="Ex: Reposição de estoque, compra emergencial, etc."
              rows={3}
            />
          </div>

          {/* Ações */}
          <DialogFooter className="flex justify-end gap-3 pt-4 border-t border-border/50">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
              disabled={!formData.produtoId || !formData.quantidade}
            >
              <Plus className="h-4 w-4" />
              Adicionar Estoque
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
