import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/shared/components/ui/dialog";
import { Badge } from "@/shared/components/ui/badge";
import { Separator } from "@/shared/components/ui/separator";
import { 
  Building, 
  FileText, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  ShoppingCart,
  Package
} from "lucide-react";
import { FornecedorDetailsModalProps } from "./types";
import { FornecedorUtils } from "./fornecedor-utils";

export function FornecedorDetailsModal({
  isOpen,
  onClose,
  fornecedor
}: FornecedorDetailsModalProps) {
  if (!fornecedor) return null;

  const document = FornecedorUtils.getPrimaryDocument(fornecedor);
  const contact = FornecedorUtils.getContactInfo(fornecedor);
  const compras = FornecedorUtils.getComprasStatistics(fornecedor);
  const statusColors = FornecedorUtils.getStatusColor(fornecedor.status);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Building className="h-5 w-5" />
            <span>Detalhes do Fornecedor</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações Básicas */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">{fornecedor.nome}</h3>
              <Badge 
                variant="outline" 
                className={`${statusColors.bg} ${statusColors.text} ${statusColors.border}`}
              >
                {FornecedorUtils.getStatusText(fornecedor.status)}
              </Badge>
            </div>
            
            {fornecedor.razaoSocial && fornecedor.razaoSocial !== fornecedor.nome && (
              <p className="text-muted-foreground">
                <strong>Razão Social:</strong> {fornecedor.razaoSocial}
              </p>
            )}
          </div>

          <Separator />

          {/* Documentação */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold">Documentação</h3>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Documento Principal</p>
                  <p className="font-mono font-medium">
                    {document.formatted}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {document.type}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Informações de Contato */}
          {contact.hasContact && (
            <>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-semibold">Contato</h3>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {contact.email && (
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <p className="font-medium">{contact.email}</p>
                        </div>
                      </div>
                    )}
                    {contact.telefone && (
                      <div>
                        <p className="text-sm text-muted-foreground">Telefone</p>
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <p className="font-medium">{contact.telefone}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Endereço */}
          {fornecedor.endereco && (
            <>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-semibold">Endereço</h3>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="whitespace-pre-wrap">{fornecedor.endereco}</p>
                </div>
              </div>
            </>
          )}

          {/* Observações */}
          {fornecedor.observacoes && (
            <>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-semibold">Observações</h3>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="whitespace-pre-wrap">{fornecedor.observacoes}</p>
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Estatísticas de Compras */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold">Histórico de Compras</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-2">
                  <ShoppingCart className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-blue-700">Total de Compras</p>
                    <p className="text-2xl font-bold text-blue-800">
                      {compras.totalCompras.toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-center space-x-2">
                  <Package className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm text-green-700">Total de Itens</p>
                    <p className="text-2xl font-bold text-green-800">
                      {compras.totalItens.toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Compras Recentes */}
          {fornecedor.compras && fornecedor.compras.length > 0 && (
            <>
              <Separator />
              <div className="space-y-3">
                <h3 className="font-semibold">Compras Recentes</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {fornecedor.compras.slice(0, 5).map((compra) => (
                    <div key={compra.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div>
                        <p className="font-medium">
                          {compra.numeroNota ? `NF: ${compra.numeroNota}` : 'Sem nota fiscal'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {FornecedorUtils.formatDateOnly(compra.createdAt)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {compra.itens?.length || 0} itens
                        </p>
                        <Badge variant="outline" className="text-xs">
                          {compra.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
                {fornecedor.compras.length > 5 && (
                  <p className="text-sm text-muted-foreground text-center">
                    E mais {fornecedor.compras.length - 5} compras...
                  </p>
                )}
              </div>
            </>
          )}

          <Separator />

          {/* Informações do Sistema */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold">Informações do Sistema</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Cadastrado em:</p>
                <p className="font-medium">
                  {FornecedorUtils.formatDate(fornecedor.createdAt)}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Última atualização:</p>
                <p className="font-medium">
                  {FornecedorUtils.formatDate(fornecedor.updatedAt)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}