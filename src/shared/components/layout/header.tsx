import { Droplets, Bell, Menu } from "lucide-react";
import { HTMLAttributes } from "react";
import { Button } from "@/shared/components/ui";

interface IHeader extends HTMLAttributes<HTMLHeadElement> {
  onClick?: () => void;
}
export const Header: React.FC<IHeader> = ({ onClick, ...props }) => {
  return (
    <header {...props}>
      {/* Header Mobile */}
      <div className="lg:hidden bg-[var(--card)] border-b border-[var(--border)] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Droplets className="h-6 w-6 text-[var(--primary)]" />
          <span className="font-semibold text-[var(--foreground)]">
            AquaManager
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Bell className="h-5 w-5 text-[var(--foreground)]" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onClick}>
            <Menu className="h-5 w-5 text-[var(--foreground)]" />
          </Button>
        </div>
      </div>

      {/* Header Desktop */}
      <div className="hidden lg:flex bg-[var(--card)] border-b border-[var(--border)] px-6 py-4 items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[var(--foreground)]">
            Dashboard
          </h2>
          <p className="text-[var(--muted-foreground)]">
            Visão geral do seu negócio
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm">
            <Bell className="h-5 w-5 text-[var(--foreground)]" />
          </Button>
          <div className="h-8 w-8 bg-[var(--primary)]/20 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-[var(--primary)]">
              JS
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
