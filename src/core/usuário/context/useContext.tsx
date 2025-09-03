import { IUser } from "@/core/usuário/layout";
import { createContext, useState, ReactNode, useEffect } from "react";

export { useUser } from "./useUser";

// Tipo do contexto
interface IUserContext {
  users: IUser[];
  setUsers: React.Dispatch<React.SetStateAction<IUser[]>>;
}

// Criando contexto com valor inicial nulo
export const UserContext = createContext<IUserContext | null>(null);

// Provedor
interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [users, setUsers] = useState<IUser[]>([]);
  useEffect(() => {
    fetch("/api/user")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setUsers(data);
      })
      .catch((err) => {
        console.error(err);
        return [];
      });
  }, []);
  return (
    <UserContext.Provider value={{ users, setUsers }}>
      {children}
    </UserContext.Provider>
  );
};
