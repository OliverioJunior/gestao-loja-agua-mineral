import { Package } from "lucide-react";

interface IHeaderDescription {
  path: string;
}

export const HeaderDescription: React.FC<IHeaderDescription> = ({ path }) => {
  switch (path) {
    case "/":
      return (
        <>
          <h2 className="text-2xl font-bold text-[var(--foreground)]">
            Dashboard
          </h2>
          <p className="text-[var(--muted-foreground)]">
            Visão geral do seu negócio
          </p>
        </>
      );
    case "/estoque":
      return (
        <>
          <h1 className="text-2xl font-semibold text-white flex items-center gap-2">
            <Package className="w-6 h-6 text-blue-400" />
            Estoque
          </h1>
          <p className="text-slate-400 mt-1">
            Gerencie seus produtos e controle de estoque
          </p>
        </>
      );
  }
};
