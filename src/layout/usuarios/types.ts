import { User } from "@/infrastructure/generated/prisma";

export type IUser = User;

export interface IUserRow {
  user: IUser;
  onView: (user: IUser) => void;
  onEdit: (user: IUser) => void;
  onDelete: (user: IUser) => void;
}

export interface IFiltrosUsuarios {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  setFilterRole: React.Dispatch<React.SetStateAction<string>>;
}

export interface IUserStats {
  total: number;
  admin: number;
  manager: number;
  user: number;
}
