/**
 * Constantes de mensagens centralizadas
 * 
 * Este módulo contém todas as mensagens utilizadas no sistema,
 * garantindo consistência e facilitando internacionalização futura.
 */

/**
 * Mensagens de erro padrão do sistema
 */
export const ERROR_MESSAGES = {
  // Erros gerais
  INTERNAL_SERVER_ERROR: "Erro interno do servidor",
  UNAUTHORIZED: "Usuário não autenticado",
  FORBIDDEN: "Acesso negado",
  NOT_FOUND: "Recurso não encontrado",
  BAD_REQUEST: "Dados inválidos",
  CONFLICT: "Conflito de dados",
  
  // Erros de validação
  REQUIRED_FIELD: "Campo obrigatório",
  INVALID_EMAIL: "Email inválido",
  INVALID_PHONE: "Telefone inválido",
  INVALID_CPF: "CPF inválido",
  INVALID_CNPJ: "CNPJ inválido",
  INVALID_CEP: "CEP inválido",
  INVALID_PASSWORD: "Senha inválida",
  INVALID_DATE: "Data inválida",
  INVALID_CURRENCY: "Valor monetário inválido",
  
  // Erros específicos de entidades
  USER_NOT_FOUND: "Usuário não encontrado",
  USER_ALREADY_EXISTS: "Usuário já existe",
  CLIENT_NOT_FOUND: "Cliente não encontrado",
  CLIENT_ALREADY_EXISTS: "Cliente já existe",
  PRODUCT_NOT_FOUND: "Produto não encontrado",
  PRODUCT_ALREADY_EXISTS: "Produto já existe",
  ORDER_NOT_FOUND: "Pedido não encontrado",
  CATEGORY_NOT_FOUND: "Categoria não encontrada",
  EXPENSE_NOT_FOUND: "Despesa não encontrada",
  
  // Erros de operação
  CREATE_ERROR: "Erro ao criar",
  UPDATE_ERROR: "Erro ao atualizar",
  DELETE_ERROR: "Erro ao excluir",
  FETCH_ERROR: "Erro ao carregar dados",
  SAVE_ERROR: "Erro ao salvar",
  
  // Erros de estoque
  INSUFFICIENT_STOCK: "Estoque insuficiente",
  INVALID_STOCK_QUANTITY: "Quantidade de estoque inválida",
  
  // Erros de autenticação
  INVALID_CREDENTIALS: "Credenciais inválidas",
  SESSION_EXPIRED: "Sessão expirada",
  TOKEN_INVALID: "Token inválido",
} as const;

/**
 * Mensagens de sucesso padrão do sistema
 */
export const SUCCESS_MESSAGES = {
  // Operações gerais
  CREATED: "Criado com sucesso",
  UPDATED: "Atualizado com sucesso",
  DELETED: "Excluído com sucesso",
  SAVED: "Salvo com sucesso",
  
  // Operações específicas
  USER_CREATED: "Usuário criado com sucesso",
  USER_UPDATED: "Usuário atualizado com sucesso",
  USER_DELETED: "Usuário excluído com sucesso",
  
  CLIENT_CREATED: "Cliente criado com sucesso",
  CLIENT_UPDATED: "Cliente atualizado com sucesso",
  CLIENT_DELETED: "Cliente excluído com sucesso",
  
  PRODUCT_CREATED: "Produto criado com sucesso",
  PRODUCT_UPDATED: "Produto atualizado com sucesso",
  PRODUCT_DELETED: "Produto excluído com sucesso",
  
  ORDER_CREATED: "Pedido criado com sucesso",
  ORDER_UPDATED: "Pedido atualizado com sucesso",
  ORDER_DELETED: "Pedido excluído com sucesso",
  ORDER_STATUS_UPDATED: "Status do pedido atualizado com sucesso",
  
  CATEGORY_CREATED: "Categoria criada com sucesso",
  CATEGORY_UPDATED: "Categoria atualizada com sucesso",
  CATEGORY_DELETED: "Categoria excluída com sucesso",
  
  EXPENSE_CREATED: "Despesa criada com sucesso",
  EXPENSE_UPDATED: "Despesa atualizada com sucesso",
  EXPENSE_DELETED: "Despesa excluída com sucesso",
  
  // Operações de estoque
  STOCK_UPDATED: "Estoque atualizado com sucesso",
  
  // Autenticação
  LOGIN_SUCCESS: "Login realizado com sucesso",
  LOGOUT_SUCCESS: "Logout realizado com sucesso",
  PASSWORD_CHANGED: "Senha alterada com sucesso",
} as const;

/**
 * Mensagens informativas do sistema
 */
export const INFO_MESSAGES = {
  // Estados de carregamento
  LOADING: "Carregando...",
  LOADING_USERS: "Carregando usuários...",
  LOADING_CLIENTS: "Carregando clientes...",
  LOADING_PRODUCTS: "Carregando produtos...",
  LOADING_ORDERS: "Carregando pedidos...",
  LOADING_CATEGORIES: "Carregando categorias...",
  LOADING_EXPENSES: "Carregando despesas...",
  
  // Estados de processamento
  SAVING: "Salvando...",
  CREATING: "Criando...",
  UPDATING: "Atualizando...",
  DELETING: "Excluindo...",
  PROCESSING: "Processando...",
  
  // Estados vazios
  NO_DATA: "Nenhum dado encontrado",
  NO_USERS: "Nenhum usuário encontrado",
  NO_CLIENTS: "Nenhum cliente encontrado",
  NO_PRODUCTS: "Nenhum produto encontrado",
  NO_ORDERS: "Nenhum pedido encontrado",
  NO_CATEGORIES: "Nenhuma categoria encontrada",
  NO_EXPENSES: "Nenhuma despesa encontrada",
  
  // Instruções
  ADD_FIRST_USER: "Adicione o primeiro usuário para começar",
  ADD_FIRST_CLIENT: "Adicione o primeiro cliente para começar",
  ADD_FIRST_PRODUCT: "Adicione o primeiro produto para começar",
  ADD_FIRST_ORDER: "Crie o primeiro pedido para começar",
  ADD_FIRST_CATEGORY: "Adicione a primeira categoria para começar",
  ADD_FIRST_EXPENSE: "Adicione a primeira despesa para começar",
} as const;

/**
 * Mensagens de confirmação para ações destrutivas
 */
export const CONFIRMATION_MESSAGES = {
  // Exclusões
  DELETE_USER: "Tem certeza que deseja excluir este usuário?",
  DELETE_CLIENT: "Tem certeza que deseja excluir este cliente?",
  DELETE_PRODUCT: "Tem certeza que deseja excluir este produto?",
  DELETE_ORDER: "Tem certeza que deseja excluir este pedido?",
  DELETE_CATEGORY: "Tem certeza que deseja excluir esta categoria?",
  DELETE_EXPENSE: "Tem certeza que deseja excluir esta despesa?",
  
  // Ações irreversíveis
  IRREVERSIBLE_ACTION: "Esta ação não pode ser desfeita",
  PERMANENT_DELETE: "Este item será permanentemente removido do sistema",
  
  // Cancelamentos
  CANCEL_ORDER: "Tem certeza que deseja cancelar este pedido?",
  DISCARD_CHANGES: "Tem certeza que deseja descartar as alterações?",
} as const;

/**
 * Labels e textos da interface
 */
export const UI_LABELS = {
  // Ações
  CREATE: "Criar",
  EDIT: "Editar",
  DELETE: "Excluir",
  SAVE: "Salvar",
  CANCEL: "Cancelar",
  CONFIRM: "Confirmar",
  CLOSE: "Fechar",
  VIEW: "Visualizar",
  SEARCH: "Buscar",
  FILTER: "Filtrar",
  CLEAR: "Limpar",
  REFRESH: "Atualizar",
  EXPORT: "Exportar",
  IMPORT: "Importar",
  
  // Navegação
  BACK: "Voltar",
  NEXT: "Próximo",
  PREVIOUS: "Anterior",
  HOME: "Início",
  
  // Estados
  ACTIVE: "Ativo",
  INACTIVE: "Inativo",
  ENABLED: "Habilitado",
  DISABLED: "Desabilitado",
  
  // Campos comuns
  NAME: "Nome",
  EMAIL: "Email",
  PHONE: "Telefone",
  ADDRESS: "Endereço",
  DATE: "Data",
  VALUE: "Valor",
  QUANTITY: "Quantidade",
  DESCRIPTION: "Descrição",
  CATEGORY: "Categoria",
  STATUS: "Status",
  TOTAL: "Total",
  
  // Placeholders
  SEARCH_PLACEHOLDER: "Digite para buscar...",
  SELECT_OPTION: "Selecione uma opção",
  NO_OPTIONS: "Nenhuma opção disponível",
} as const;

/**
 * Títulos de páginas e seções
 */
export const PAGE_TITLES = {
  DASHBOARD: "Dashboard",
  USERS: "Usuários",
  CLIENTS: "Clientes",
  PRODUCTS: "Produtos",
  ORDERS: "Pedidos",
  CATEGORIES: "Categorias",
  EXPENSES: "Despesas",
  STOCK: "Estoque",
  REPORTS: "Relatórios",
  SETTINGS: "Configurações",
  PROFILE: "Perfil",
  LOGIN: "Login",
} as const;

/**
 * Função utilitária para obter mensagem com parâmetros
 * 
 * @param template - Template da mensagem com placeholders {0}, {1}, etc.
 * @param params - Parâmetros para substituir nos placeholders
 * @returns Mensagem formatada
 * 
 * @example
 * formatMessage("Erro ao {0} {1}", "criar", "usuário") // "Erro ao criar usuário"
 */
export const formatMessage = (template: string, ...params: string[]): string => {
  return template.replace(/{(\d+)}/g, (match, index) => {
    return params[parseInt(index)] || match;
  });
};

/**
 * Função para obter mensagem de erro específica de uma entidade
 * 
 * @param entity - Nome da entidade
 * @param operation - Operação realizada
 * @returns Mensagem de erro formatada
 * 
 * @example
 * getEntityErrorMessage("usuário", "criar") // "Erro ao criar usuário"
 */
export const getEntityErrorMessage = (entity: string, operation: string): string => {
  return `Erro ao ${operation} ${entity}`;
};

/**
 * Função para obter mensagem de sucesso específica de uma entidade
 * 
 * @param entity - Nome da entidade
 * @param operation - Operação realizada
 * @returns Mensagem de sucesso formatada
 * 
 * @example
 * getEntitySuccessMessage("usuário", "criar") // "Usuário criado com sucesso"
 */
export const getEntitySuccessMessage = (entity: string, operation: string): string => {
  const operationMap: Record<string, string> = {
    criar: "criado",
    atualizar: "atualizado",
    excluir: "excluído",
    salvar: "salvo",
  };
  
  const pastOperation = operationMap[operation] || operation;
  return `${entity.charAt(0).toUpperCase() + entity.slice(1)} ${pastOperation} com sucesso`;
};