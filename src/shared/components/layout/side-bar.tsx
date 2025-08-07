"use client";
import {
  Droplets,
  TrendingUp,
  ShoppingCart,
  Package,
  Users,
  Settings,
} from "lucide-react";
import { Button } from "@/shared/components/ui";
import Link from "next/link";
import { usePathname } from "next/navigation";
interface ISideBar {
  sidebarOpen: boolean;
  closeSidebar: () => void;
}
export const SideBar: React.FC<ISideBar> = ({ sidebarOpen, closeSidebar }) => {
  const pathname = usePathname();
  return (
    <>
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[var(--sidebar)] border-r border-[var(--sidebar-border)] transition-transform duration-200 ease-in-out`}
      >
        <div className="p-6 border-b border-[var(--sidebar-border)]">
          <div className="flex items-center gap-2">
            <Droplets className="h-8 w-8 text-[var(--primary)]" />
            <div>
              <h1 className="font-bold text-xl text-[var(--sidebar-primary-foreground)]">
                AquaManager
              </h1>
              <p className="text-sm text-[var(--sidebar-foreground)]">
                Gestão Inteligente
              </p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          <Button
            variant={pathname === "/" ? "secondary" : "ghost"}
            className="w-full justify-start text-[var(--sidebar-foreground)]"
          >
            <TrendingUp className="mr-2 h-4 w-4 text-[var(--sidebar-foreground)]" />
            <Link href="/">Dashboard</Link>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-[var(--sidebar-foreground)]"
          >
            <ShoppingCart className="mr-2 h-4 w-4 text-[var(--sidebar-foreground)]" />
            Pedidos
          </Button>
          <Button
            variant={pathname === "/estoque" ? "secondary" : "ghost"}
            className="w-full justify-start text-[var(--sidebar-foreground)]"
          >
            <Package className="mr-2 h-4 w-4 text-[var(--sidebar-foreground)]" />
            <Link href="/estoque">Estoque</Link>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-[var(--sidebar-foreground)]"
          >
            <Users className="mr-2 h-4 w-4 text-[var(--sidebar-foreground)]" />
            Clientes
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-[var(--sidebar-foreground)]"
          >
            <Settings className="mr-2 h-4 w-4 text-[var(--sidebar-foreground)]" />
            <Link href="/configuracoes">Configurações</Link>
          </Button>
        </nav>
      </aside>

      {/* Overlay para mobile */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeSidebar}
        />
      )}
    </>
  );
};
