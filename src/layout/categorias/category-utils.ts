export const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "ativo":
      return "bg-green-500/20 text-green-400 border-green-500/30";
    case "inativo":
      return "bg-red-500/20 text-red-400 border-red-500/30";
    default:
      return "bg-gray-500/20 text-gray-400 border-gray-500/30";
  }
};

export const getStatusText = (status: string) => {
  switch (status.toLowerCase()) {
    case "ativo":
      return "Ativo";
    case "inativo":
      return "Inativo";
    default:
      return status;
  }
};