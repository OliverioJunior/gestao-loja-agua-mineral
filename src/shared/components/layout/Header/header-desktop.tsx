"use client";
import { Bell, User, LogOut } from "lucide-react";
import { Button } from "@/shared/components/ui";
import { HeaderDescription } from "./header-description";
import { memo, useCallback } from "react";
import { HeaderDesktopProps } from "./types";
import { useCurrentUser, getUserInitials, formatUserRole } from "@/shared/hooks/useCurrentUser";
import { useRouter } from "next/navigation";

const HEADER_STYLES = {
  container:
    "hidden lg:flex bg-[var(--card)] border-b border-[var(--border)] px-6 py-4 items-center justify-between",
  wrapper: "flex items-center gap-4",
  userInfo: "flex items-center gap-3",
  userDetails: "flex flex-col items-end",
  userName: "text-sm font-medium text-[var(--foreground)]",
  userRole: "text-xs text-[var(--muted-foreground)]",
  avatar:
    "h-8 w-8 bg-[var(--primary)]/20 rounded-full flex items-center justify-center",
  "avatar-text": "text-sm font-medium text-[var(--primary)]",
  notification: "h-5 w-5 text-[var(--foreground)]",
  loading: "h-4 w-4 animate-spin",
} as const;

export const HeaderDesktop = memo<HeaderDesktopProps>(
  ({ onNotificationClick }) => {
    const { user, loading, error } = useCurrentUser();
    const router = useRouter();
    
    const handleNotificationClick = useCallback(() => {
      onNotificationClick?.();
    }, [onNotificationClick]);

    const handleLogout = useCallback(async () => {
      try {
        const response = await fetch("/api/auth/signout", {
          method: "POST",
        });
        
        if (response.ok) {
          router.push("/login");
        } else {
          console.error("Erro ao fazer logout");
        }
      } catch (error) {
        console.error("Erro ao fazer logout:", error);
      }
    }, [router]);

    const renderUserAvatar = () => {
      if (loading) {
        return (
          <div className={HEADER_STYLES.avatar} aria-label="Carregando...">
            <User className={HEADER_STYLES.loading} />
          </div>
        );
      }

      if (error || !user) {
        return (
          <div className={HEADER_STYLES.avatar} aria-label="Usuário não encontrado">
            <User className="h-4 w-4 text-[var(--muted-foreground)]" />
          </div>
        );
      }

      return (
        <div className={HEADER_STYLES.avatar} aria-label={`Perfil de ${user.name}`}>
          <span className={HEADER_STYLES["avatar-text"]}>
            {getUserInitials(user.name)}
          </span>
        </div>
      );
    };

    return (
      <div className={HEADER_STYLES.container}>
        <HeaderDescription />

        <div className={HEADER_STYLES.wrapper}>
          <Button
            onClick={handleNotificationClick}
            disabled={!onNotificationClick}
            aria-label="Abrir notificações"
            variant="ghost"
            size="sm"
          >
            <Bell className={HEADER_STYLES.notification} />
          </Button>
          
          {user && (
            <Button
              onClick={handleLogout}
              aria-label="Fazer logout"
              variant="ghost"
              size="sm"
              className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          )}
          
          <div className={HEADER_STYLES.userInfo}>
            {user && !loading && (
              <div className={HEADER_STYLES.userDetails}>
                <span className={HEADER_STYLES.userName}>{user.name}</span>
                <span className={HEADER_STYLES.userRole}>
                  {formatUserRole(user.role)}
                </span>
              </div>
            )}
            {renderUserAvatar()}
          </div>
        </div>
      </div>
    );
  }
);

HeaderDesktop.displayName = "HeaderDesktop";
