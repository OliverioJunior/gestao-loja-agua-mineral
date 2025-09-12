"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/shared/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";

export interface ComboboxOption {
  id: string;
  value: string;
  label: string;
  disabled?: boolean;
}

export interface ComboboxProps {
  /** Lista de opções disponíveis */
  options: ComboboxOption[];
  /** Valor selecionado atual */
  value?: string;
  /** Callback chamado quando o valor muda */
  onValueChange?: (value: string) => void;
  /** Placeholder exibido quando nenhum valor está selecionado */
  placeholder?: string;
  /** Placeholder do campo de busca */
  searchPlaceholder?: string;
  /** Mensagem exibida quando nenhuma opção é encontrada */
  emptyMessage?: string;
  /** Largura do componente */
  width?: string;
  /** Altura máxima do dropdown */
  maxHeight?: string;
  /** Se o componente está desabilitado */
  disabled?: boolean;
  /** Classes CSS adicionais */
  className?: string;
  /** Se permite limpar a seleção */
  clearable?: boolean;
  /** Função de filtro customizada */
  filterFunction?: (option: ComboboxOption, search: string) => boolean;
  /** Se deve fechar automaticamente após seleção */
  autoClose?: boolean;
}

// Função para normalizar texto removendo acentos e caracteres especiais
const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/gi, "")
    .trim();
};

const defaultFilterFunction = (
  option: ComboboxOption,
  search: string
): boolean => {
  const normalizedSearch = normalizeText(search);
  const normalizedLabel = normalizeText(option.label);
  const normalizedValue = normalizeText(option.value);
  return (
    normalizedLabel.includes(normalizedSearch) ||
    normalizedValue.includes(normalizedSearch)
  );
};

export function Combobox({
  options,
  value,
  onValueChange,
  placeholder = "Selecione uma opção...",
  searchPlaceholder = "Buscar...",
  emptyMessage = "Nenhuma opção encontrada.",
  width = "w-[200px]",
  maxHeight = "max-h-[300px]",
  disabled = false,
  className,
  clearable = false,
  filterFunction = defaultFilterFunction,
  autoClose = true,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");

  const selectedOption = options.find((option) => option.value === value);

  const filteredOptions = React.useMemo(() => {
    if (!searchValue) return options;
    return options.filter((option) => filterFunction(option, searchValue));
  }, [options, searchValue, filterFunction]);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setSearchValue("");
    }
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            width,
            "justify-between",
            disabled && "opacity-50 cursor-not-allowed",
            className
          )}
          disabled={disabled}
        >
          <span className="truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn(width, "p-0", maxHeight)}
        align="start"
        sideOffset={4}
      >
        <Command>
          <CommandInput
            placeholder={searchPlaceholder}
            className="h-9 border-none focus:ring-0"
            value={searchValue}
            onValueChange={setSearchValue}
          />
          <CommandList
            className={cn(
              "overflow-y-auto overflow-x-hidden",
              "touch-pan-y",
              "max-h-[250px]"
            )}
          >
            <CommandEmpty className="py-6 text-center text-sm">
              {emptyMessage}
            </CommandEmpty>
            <CommandGroup>
              {filteredOptions.map((option) => (
                <CommandItem
                  key={option.id}
                  value={option.value}
                  disabled={option.disabled}
                  onSelect={() => {
                    const newValue =
                      option.value === value && clearable
                        ? ""
                        : JSON.stringify({
                            id: option.id,
                            value: option.value,
                            label: option.label,
                          });
                    onValueChange?.(newValue);

                    if (autoClose) {
                      setOpen(false);
                    }
                    setSearchValue("");
                  }}
                  className={cn(
                    "cursor-pointer touch-manipulation",
                    "px-2 py-3 text-sm",
                    "hover:bg-accent hover:text-accent-foreground",
                    "focus:bg-accent focus:text-accent-foreground",
                    "data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground",

                    option.disabled &&
                      "opacity-50 cursor-not-allowed pointer-events-none"
                  )}
                >
                  <span className="flex-1 truncate">{option.label}</span>
                  <Check
                    className={cn(
                      "ml-2 h-4 w-4 shrink-0",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

// Hook personalizado para facilitar o uso
export function useCombobox(initialValue?: string) {
  const [value, setValue] = React.useState(initialValue || "");

  const reset = React.useCallback(() => {
    setValue("");
  }, []);

  return {
    value,
    setValue,
    reset,
  };
}
