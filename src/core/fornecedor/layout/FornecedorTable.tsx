import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow
} from "@/shared/components/ui/table";
import { Card, CardContent } from "@/shared/components/ui/card";
import { LoadingTable } from "@/shared/components/layout/LoadingSpinner";
import { FornecedorTableProps } from "./types";
import { FornecedorRow } from "./FornecedorRow";

export function FornecedorTable({
  fornecedores,
  loading = false,
  onView,
  onEdit,
  onDelete,
  onActivate,
  onDeactivate
}: FornecedorTableProps) {
  if (loading) {
    return (
      <LoadingTable 
        rows={5} 
        headers={[
          "Nome / Razão Social",
          "Documento", 
          "Contato",
          "Status",
          "Compras",
          "Data Cadastro",
          "Ações"
        ]} 
      />
    );
  }

  if (fornecedores.length === 0) {
    return (
      <Card>
        <CardContent className="p-12">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 text-muted-foreground mb-4">
              <svg
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">
              Nenhum fornecedor encontrado
            </h3>
            <p className="text-muted-foreground mb-4">
              Não há fornecedores cadastrados ou que correspondam aos filtros aplicados.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">
                  Nome / Razão Social
                </TableHead>
                <TableHead className="w-[150px]">
                  Documento
                </TableHead>
                <TableHead className="w-[200px]">
                  Contato
                </TableHead>
                <TableHead className="w-[100px]">
                  Status
                </TableHead>
                <TableHead className="w-[100px] text-center">
                  Compras
                </TableHead>
                <TableHead className="w-[120px]">
                  Data Cadastro
                </TableHead>
                <TableHead className="w-[150px] text-center">
                  Ações
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fornecedores.map((fornecedor) => (
                <FornecedorRow
                  key={fornecedor.id}
                  fornecedor={fornecedor}
                  onView={onView}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onActivate={onActivate}
                  onDeactivate={onDeactivate}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}