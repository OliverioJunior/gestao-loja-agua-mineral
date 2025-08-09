import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui";
import { UserPlus } from "lucide-react";

export function AddUserModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Novo Usuário
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-900 border-slate-700 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-slate-200 flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Adicionar Novo Usuário
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Preencha os dados do novo usuário do sistema.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <label className="text-sm font-medium text-slate-200 mb-2 block">
              Nome completo
            </label>
            <Input
              placeholder="Digite o nome completo"
              className="bg-slate-800 border-slate-700 text-slate-200"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-200 mb-2 block">
              Email
            </label>
            <Input
              type="email"
              placeholder="Digite o email"
              className="bg-slate-800 border-slate-700 text-slate-200"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-200 mb-2 block">
              Função
            </label>
            <Select>
              <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-200">
                <SelectValue placeholder="Selecione a função" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="admin" className="text-slate-200">
                  Administrador
                </SelectItem>
                <SelectItem value="manager" className="text-slate-200">
                  Gerente
                </SelectItem>
                <SelectItem value="user" className="text-slate-200">
                  Usuário
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-200 mb-2 block">
              Senha temporária
            </label>
            <Input
              type="password"
              placeholder="Digite uma senha temporária"
              className="bg-slate-800 border-slate-700 text-slate-200"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            className="border-slate-700 text-slate-300 hover:bg-slate-800"
          >
            Cancelar
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            Criar Usuário
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}