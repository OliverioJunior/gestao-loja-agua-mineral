import { useState } from "react";
import {
  Card,
  CardContent,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Button,
} from "@/shared/components/ui";
import { Search, Plus } from "lucide-react";
import { ClientFiltersProps } from "./types";
import { AddClientModal } from "./AddClientModal";
import { CreateClienteInput } from "@/core/cliente/cliente.entity";

export function ClientFilters({
  searchTerm,
  onSearchChange,
  filterStatus,
  onFilterStatusChange,
  onAddClient,
}: ClientFiltersProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleAddClient = async (
    clientData: Omit<CreateClienteInput, "criadoPorId" | "atualizadoPorId">
  ) => {
    onAddClient(clientData);
    setIsAddModalOpen(false);
  };

  return (
    <>
      <Card className="mb-6">
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar clientes..."
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterStatus} onValueChange={onFilterStatusChange}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Status</SelectItem>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="w-full sm:w-auto"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Cliente
            </Button>
          </div>
        </CardContent>
      </Card>

      <AddClientModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddClient}
      />
    </>
  );
}
