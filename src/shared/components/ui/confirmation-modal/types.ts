import { LucideIcon } from "lucide-react";

/**
 * Variantes visuais disponíveis para o ConfirmationModal
 */
export type ConfirmationModalVariant =
  | "danger" // Para exclusões e ações destrutivas
  | "warning" // Para ações que requerem atenção
  | "info" // Para informações gerais
  | "success" // Para confirmações positivas
  | "default"; // Variante neutra

/**
 * Tamanhos disponíveis para o modal
 */
export type ConfirmationModalSize = "sm" | "md" | "lg" | "xl";

/**
 * Tipos de ação que o modal pode executar
 */
export type ConfirmationActionType =
  | "delete" // Exclusão de item
  | "update" // Atualização de dados
  | "create" // Criação de novo item
  | "archive" // Arquivamento
  | "restore" // Restauração
  | "approve" // Aprovação
  | "reject" // Rejeição
  | "custom"; // Ação customizada

/**
 * Configuração dos botões do modal
 */
export interface ConfirmationButtonConfig {
  /** Texto do botão */
  text: string;
  /** Variante visual do botão */
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  /** Se o botão deve estar desabilitado */
  disabled?: boolean;
  /** Se deve mostrar loading no botão */
  loading?: boolean;
  /** Ícone do botão */
  icon?: LucideIcon;
  /** Classes CSS adicionais */
  className?: string;
}

/**
 * Informações do item sendo confirmado
 */
export interface ConfirmationItemInfo {
  /** ID do item */
  id?: string;
  /** Nome/título do item */
  name?: string;
  /** Tipo do item (ex: "produto", "cliente", "fornecedor") */
  type?: string;
  /** Informações adicionais do item */
  details?: Record<string, string>;
  /** Conteúdo customizado para exibir informações do item */
  customContent?: React.ReactNode;
}

/**
 * Configuração de animações do modal
 */
export interface ConfirmationAnimationConfig {
  /** Duração da animação de entrada/saída */
  duration?: number;
  /** Tipo de animação */
  type?: "fade" | "slide" | "scale" | "none";
  /** Se deve animar o backdrop */
  animateBackdrop?: boolean;
}

/**
 * Configuração de acessibilidade
 */
export interface ConfirmationAccessibilityConfig {
  /** Texto para screen readers */
  ariaLabel?: string;
  /** Descrição para screen readers */
  ariaDescription?: string;
  /** Se deve focar automaticamente no botão de confirmação */
  autoFocusConfirm?: boolean;
  /** Se deve focar automaticamente no botão de cancelar */
  autoFocusCancel?: boolean;
}

/**
 * Propriedades principais do ConfirmationModal
 */
export interface ConfirmationModalProps {
  /** Se o modal está aberto */
  isOpen: boolean;

  /** Função chamada ao fechar o modal */
  onClose: () => void;

  /** Função chamada ao confirmar a ação */
  onConfirm: () => void | Promise<void>;

  /** Título do modal */
  title: string;

  /** Descrição/mensagem do modal */
  description: string;

  /** Variante visual do modal */
  variant?: ConfirmationModalVariant;

  /** Tamanho do modal */
  size?: ConfirmationModalSize;

  /** Tipo de ação sendo confirmada */
  actionType?: ConfirmationActionType;

  /** Ícone principal do modal */
  icon?: LucideIcon;

  /** Configuração do botão de confirmação */
  confirmButton?: ConfirmationButtonConfig;

  /** Configuração do botão de cancelamento */
  cancelButton?: ConfirmationButtonConfig;

  /** Informações do item sendo confirmado */
  itemInfo?: ConfirmationItemInfo;

  /** Estado de loading do modal */
  loading?: boolean;

  /** Se deve mostrar o botão de cancelar */
  showCancelButton?: boolean;

  /** Se deve fechar o modal ao clicar no backdrop */
  closeOnBackdropClick?: boolean;

  /** Se deve fechar o modal ao pressionar Escape */
  closeOnEscape?: boolean;

  /** Conteúdo adicional no corpo do modal */
  children?: React.ReactNode;

  /** Conteúdo adicional no footer do modal */
  footer?: React.ReactNode;

  /** Classes CSS adicionais para o modal */
  className?: string;

  /** Classes CSS adicionais para o conteúdo */
  contentClassName?: string;

  /** Configuração de animações */
  animation?: ConfirmationAnimationConfig;

  /** Configuração de acessibilidade */
  accessibility?: ConfirmationAccessibilityConfig;

  /** Função chamada antes de confirmar (para validações) */
  onBeforeConfirm?: () => boolean | Promise<boolean>;

  /** Função chamada após confirmar com sucesso */
  onAfterConfirm?: () => void;

  /** Função chamada em caso de erro na confirmação */
  onError?: (error: Error) => void;

  /** Se deve prevenir o fechamento durante loading */
  preventCloseOnLoading?: boolean;

  /** Propriedades de teste */
  "data-testid"?: string;
}

/**
 * Propriedades para diferentes tipos de confirmação
 */
export interface DeleteConfirmationProps
  extends Omit<ConfirmationModalProps, "variant" | "actionType"> {
  variant?: "danger";
  actionType?: "delete";
}

export interface UpdateConfirmationProps
  extends Omit<ConfirmationModalProps, "variant" | "actionType"> {
  variant?: "warning" | "info";
  actionType?: "update";
}

export interface CreateConfirmationProps
  extends Omit<ConfirmationModalProps, "variant" | "actionType"> {
  variant?: "success" | "info";
  actionType?: "create";
}

/**
 * Configuração de tema para as variantes
 */
export interface ConfirmationModalTheme {
  /** Cor do ícone */
  iconColor: string;
  /** Cor de fundo do ícone */
  iconBackground: string;
  /** Cor do título */
  titleColor: string;
  /** Cor da descrição */
  descriptionColor: string;
  /** Cor da borda (se aplicável) */
  borderColor?: string;
  /** Cor de fundo do modal */
  backgroundColor?: string;
}

/**
 * Mapeamento de temas por variante
 */
export type ConfirmationModalThemeMap = Record<
  ConfirmationModalVariant,
  ConfirmationModalTheme
>;

/**
 * Propriedades para o hook useConfirmationModal
 */
export interface UseConfirmationModalProps {
  /** Configuração padrão do modal */
  defaultConfig?: Partial<ConfirmationModalProps>;
  /** Se deve manter o estado após fechar */
  persistState?: boolean;
}

/**
 * Retorno do hook useConfirmationModal
 */
export interface UseConfirmationModalReturn {
  /** Se o modal está aberto */
  isOpen: boolean;
  /** Função para abrir o modal */
  openModal: (config: Partial<ConfirmationModalProps>) => void;
  /** Função para fechar o modal */
  closeModal: () => void;
  /** Função para confirmar */
  confirm: () => Promise<void>;
  /** Estado de loading */
  loading: boolean;
  /** Configuração atual do modal */
  config: ConfirmationModalProps | null;
}

/**
 * Propriedades para o ConfirmationModalProvider
 */
export interface ConfirmationModalProviderProps {
  children: React.ReactNode;
  /** Configuração padrão para todos os modais */
  defaultConfig?: Partial<ConfirmationModalProps>;
}

/**
 * Context do ConfirmationModal
 */
export interface ConfirmationModalContextValue {
  /** Função para mostrar modal de confirmação */
  confirm: (config: Partial<ConfirmationModalProps>) => Promise<boolean>;
  /** Função para mostrar modal de exclusão */
  confirmDelete: (config: Partial<DeleteConfirmationProps>) => Promise<boolean>;
  /** Função para mostrar modal de atualização */
  confirmUpdate: (config: Partial<UpdateConfirmationProps>) => Promise<boolean>;
  /** Função para mostrar modal de criação */
  confirmCreate: (config: Partial<CreateConfirmationProps>) => Promise<boolean>;
}
