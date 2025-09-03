import { Eye, Edit, Trash2, Power, PowerOff, Building, Mail, Phone } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { TableCell, TableRow } from "@/shared/components/ui/table";
import { FornecedorRowProps } from "./types";
import { FornecedorUtils } from "./fornecedor-utils";

export function FornecedorRow({
  fornecedor,
  onView,
  onEdit,
  onDelete,
  onActivate,
  onDeactivate
}: FornecedorRowProps) {
  const document = FornecedorUtils.getPrimaryDocument(fornecedor);
  const contact = FornecedorUtils.getContactInfo(fornecedor);
  const compras = FornecedorUtils.getComprasStatistics(fornecedor);
  const statusColors = FornecedorUtils.getStatusColor(fornecedor.status);
  const isActive = FornecedorUtils.isActive(fornecedor);

  const handleToggleStatus = () => {
    if (isActive && onDeactivate) {
      onDeactivate(fornecedor.id);
    } else if (!isActive && onActivate) {
      onActivate(fornecedor.id);
    }
  };

  return (
    <TableRow className="hover:bg-muted/50">
      {/* Nome e Razão Social */}
      <TableCell className="font-medium">
        <div className="flex flex-col">
          <div className="flex items-center space-x-2">
            <Building className="h-4 w-4 text-muted-foreground" />
            <span className="font-semibold">{fornecedor.nome}</span>
          </div>
          {fornecedor.razaoSocial && fornecedor.razaoSocial !== fornecedor.nome && (
            <span className="text-sm text-muted-foreground ml-6">
              {fornecedor.razaoSocial}
            </span>
          )}
        </div>
      </TableCell>

      {/* Documento */}
      <TableCell>
        <div className="flex flex-col">
          <span className="font-mono text-sm">
            {document.formatted}
          </span>
          {document.type && (
            <span className="text-xs text-muted-foreground">
              {document.type}
            </span>
          )}
        </div>
      </TableCell>

      {/* Contato */}
      <TableCell>
        <div className="flex flex-col space-y-1">
          {contact.email && (
            <div className="flex items-center space-x-1 text-sm">
              <Mail className="h-3 w-3 text-muted-foreground" />
              <span className="truncate max-w-[150px]" title={contact.email}>
                {contact.email}
              </span>
            </div>
          )}
          {contact.telefone && (
            <div className="flex items-center space-x-1 text-sm">
              <Phone className="h-3 w-3 text-muted-foreground" />
              <span>{contact.telefone}</span>
            </div>
          )}
          {!contact.hasContact && (
            <span className="text-sm text-muted-foreground">-</span>
          )}
        </div>
      </TableCell>

      {/* Status */}
      <TableCell>
        <Badge 
          variant="outline" 
          className={`${statusColors.bg} ${statusColors.text} ${statusColors.border}`}
        >
          {FornecedorUtils.getStatusText(fornecedor.status)}
        </Badge>
      </TableCell>

      {/* Compras */}
      <TableCell className="text-center">
        <div className="flex flex-col">
          <span className="font-semibold">
            {compras.totalCompras.toLocaleString('pt-BR')}
          </span>
          <span className="text-xs text-muted-foreground">
            {compras.totalItens} itens
          </span>
        </div>
      </TableCell>

      {/* Data de Cadastro */}
      <TableCell className="text-sm text-muted-foreground">
        {FornecedorUtils.formatDateOnly(fornecedor.createdAt)}
      </TableCell>

      {/* Ações */}
      <TableCell>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onView(fornecedor)}
            className="h-8 w-8 p-0"
            title="Visualizar detalhes"
          >
            <Eye className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(fornecedor)}
            className="h-8 w-8 p-0"
            title="Editar fornecedor"
          >
            <Edit className="h-4 w-4" />
          </Button>
          
          {(onActivate || onDeactivate) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleStatus}
              className={`h-8 w-8 p-0 ${
                isActive 
                  ? 'text-red-600 hover:text-red-700' 
                  : 'text-green-600 hover:text-green-700'
              }`}
              title={isActive ? 'Desativar fornecedor' : 'Ativar fornecedor'}
            >
              {isActive ? (
                <PowerOff className="h-4 w-4" />
              ) : (
                <Power className="h-4 w-4" />
              )}
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(fornecedor)}
            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
            title="Excluir fornecedor"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}