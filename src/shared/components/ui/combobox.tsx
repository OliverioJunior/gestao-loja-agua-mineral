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

const defaultFilterFunction = (
  option: ComboboxOption,
  search: string
): boolean => {
  return (
    option.label.toLowerCase().includes(search.toLowerCase()) ||
    option.value.toLowerCase().includes(search.toLowerCase())
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

  const handleSelect = (selectedValue: string) => {
    const newValue = selectedValue === value && clearable ? "" : selectedValue;
    onValueChange?.(newValue);

    if (autoClose) {
      setOpen(false);
    }
    setSearchValue("");
  };

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
      <PopoverContent className={cn(width, "p-0")} align="start">
        <Command>
          <CommandInput
            placeholder={searchPlaceholder}
            className="h-9"
            value={searchValue}
            onValueChange={setSearchValue}
          />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {filteredOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                  onSelect={handleSelect}
                  className={cn(
                    "cursor-pointer",
                    option.disabled && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <span className="flex-1 truncate">{option.label}</span>
                  <Check
                    className={cn(
                      "ml-2 h-4 w-4",
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
