"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Plus, Building } from "lucide-react";
import {
  AddFornecedorModalProps,
  FornecedorFormData,
  DocumentType,
} from "./types";
import { FornecedorUtils } from "./fornecedor-utils";
import { Status } from "@/infrastructure/generated/prisma";

export function AddFornecedorModal({
  isOpen,
  onClose,
  onSubmit,
}: AddFornecedorModalProps) {
  const [formData, setFormData] = useState<FornecedorFormData>({
    nome: "",
    razaoSocial: "",
    cnpj: "",
    cpf: "",
    email: "",
    telefone: "",
    endereco: "",
    observacoes: "",
    status: "ATIVO",
  });

  const [documentType, setDocumentType] = useState<DocumentType>("cnpj");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nome.trim()) {
      newErrors.nome = "Nome é obrigatório";
    }

    if (documentType === "cnpj") {
      if (!formData.cnpj?.trim()) {
        newErrors.cnpj = "CNPJ é obrigatório";
      } else {
        const cleanCnpj = FornecedorUtils.cleanDocument(formData.cnpj);
        if (cleanCnpj.length !== 14) {
          newErrors.cnpj = "CNPJ deve ter 14 dígitos";
        }
      }
    } else {
      if (!formData.cpf?.trim()) {
        newErrors.cpf = "CPF é obrigatório";
      } else {
        const cleanCpf = FornecedorUtils.cleanDocument(formData.cpf);
        if (cleanCpf.length !== 11) {
          newErrors.cpf = "CPF deve ter 11 dígitos";
        }
      }
    }

    if (formData.email && !FornecedorUtils.isValidEmail(formData.email)) {
      newErrors.email = "Email inválido";
    }

    if (
      formData.telefone &&
      !FornecedorUtils.isValidTelefone(formData.telefone)
    ) {
      newErrors.telefone = "Telefone inválido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      await onSubmit({
        nome: formData.nome.trim(),
        razaoSocial: formData.razaoSocial?.trim() || null,
        cnpj:
          documentType === "cnpj"
            ? FornecedorUtils.cleanDocument(formData.cnpj!)
            : null,
        cpf:
          documentType === "cpf"
            ? FornecedorUtils.cleanDocument(formData.cpf!)
            : null,
        email: formData.email?.trim() || null,
        telefone: formData.telefone
          ? FornecedorUtils.cleanTelefone(formData.telefone)
          : null,
        endereco: formData.endereco?.trim() || null,
        observacoes: formData.observacoes?.trim() || null,
        status: formData.status as Status,
        criadoPorId: "current-user-id", // TODO: Obter do contexto de usuário
      });

      // Reset form
      setFormData({
        nome: "",
        razaoSocial: "",
        cnpj: "",
        cpf: "",
        email: "",
        telefone: "",
        endereco: "",
        observacoes: "",
        status: "ATIVO",
      });
      setDocumentType("cnpj");
      setErrors({});
    } catch (error) {
      console.error("Erro ao criar fornecedor:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      nome: "",
      razaoSocial: "",
      cnpj: "",
      cpf: "",
      email: "",
      telefone: "",
      endereco: "",
      observacoes: "",
      status: "ATIVO",
    });
    setDocumentType("cnpj");
    setErrors({});
    onClose();
  };

  const handleDocumentChange = (value: string, type: DocumentType) => {
    if (type === "cnpj") {
      setFormData((prev) => ({ ...prev, cnpj: value, cpf: "" }));
    } else {
      setFormData((prev) => ({ ...prev, cpf: value, cnpj: "" }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Adicionar Fornecedor</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <Building className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-medium">Informações Básicas</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome *</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, nome: e.target.value }))
                  }
                  placeholder="Nome do fornecedor"
                />
                {errors.nome && (
                  <p className="text-sm text-destructive">{errors.nome}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="razaoSocial">Razão Social</Label>
                <Input
                  id="razaoSocial"
                  value={formData.razaoSocial}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      razaoSocial: e.target.value,
                    }))
                  }
                  placeholder="Razão social (opcional)"
                />
              </div>
            </div>
          </div>

          {/* Documentação */}
          <div className="space-y-4">
            <h3 className="font-medium">Documentação</h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Tipo de Documento *</Label>
                <Select
                  value={documentType}
                  onValueChange={(value: DocumentType) =>
                    setDocumentType(value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cnpj">CNPJ (Pessoa Jurídica)</SelectItem>
                    <SelectItem value="cpf">CPF (Pessoa Física)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {documentType === "cnpj" ? (
                <div className="space-y-2">
                  <Label htmlFor="cnpj">CNPJ *</Label>
                  <Input
                    id="cnpj"
                    value={formData.cnpj}
                    onChange={(e) =>
                      handleDocumentChange(e.target.value, "cnpj")
                    }
                    placeholder="00.000.000/0000-00"
                    maxLength={18}
                  />
                  {errors.cnpj && (
                    <p className="text-sm text-destructive">{errors.cnpj}</p>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF *</Label>
                  <Input
                    id="cpf"
                    value={formData.cpf}
                    onChange={(e) =>
                      handleDocumentChange(e.target.value, "cpf")
                    }
                    placeholder="000.000.000-00"
                    maxLength={14}
                  />
                  {errors.cpf && (
                    <p className="text-sm text-destructive">{errors.cpf}</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Contato */}
          <div className="space-y-4">
            <h3 className="font-medium">Contato</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  placeholder="email@exemplo.com"
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  value={formData.telefone}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      telefone: e.target.value,
                    }))
                  }
                  placeholder="(00) 00000-0000"
                />
                {errors.telefone && (
                  <p className="text-sm text-destructive">{errors.telefone}</p>
                )}
              </div>
            </div>
          </div>

          {/* Endereço */}
          <div className="space-y-4">
            <h3 className="font-medium">Endereço</h3>

            <div className="space-y-2">
              <Label htmlFor="endereco">Endereço Completo</Label>
              <Textarea
                id="endereco"
                value={formData.endereco}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, endereco: e.target.value }))
                }
                placeholder="Rua, número, bairro, cidade, estado, CEP"
                rows={3}
              />
            </div>
          </div>

          {/* Status e Observações */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ATIVO">Ativo</SelectItem>
                    <SelectItem value="INATIVO">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                value={formData.observacoes}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    observacoes: e.target.value,
                  }))
                }
                placeholder="Observações adicionais sobre o fornecedor"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Criando..." : "Criar Fornecedor"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
