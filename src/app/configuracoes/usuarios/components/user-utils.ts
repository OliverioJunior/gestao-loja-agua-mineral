export const getRoleColor = (role: string) => {
  switch (role.toLowerCase()) {
    case "admin":
      return "bg-red-500/20 text-red-400 border-red-500/30";
    case "manager":
      return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    case "user":
      return "bg-green-500/20 text-green-400 border-green-500/30";
    default:
      return "bg-gray-500/20 text-gray-400 border-gray-500/30";
  }
};

export const getRoleText = (role: string) => {
  switch (role.toLowerCase()) {
    case "admin":
      return "Administrador";
    case "manager":
      return "Gerente";
    case "user":
      return "Usuário";
    default:
      return role;
  }
};