"use client";

import { useState, useEffect } from "react";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Download, Bell, BellOff, Smartphone } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

export function PWAManager() {
  const [isSupported, setIsSupported] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null
  );
  const [isNotificationSupported, setIsNotificationSupported] = useState(false);

  useEffect(() => {
    // Verificar suporte PWA
    if (typeof window !== "undefined") {
      setIsSupported("serviceWorker" in navigator);
      setIsNotificationSupported(
        "serviceWorker" in navigator && "PushManager" in window
      );

      // Verificar se já está instalado
      const isStandalone = window.matchMedia(
        "(display-mode: standalone)"
      ).matches;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const isInWebAppiOS = (window.navigator as any).standalone === true;
      setIsInstalled(isStandalone || isInWebAppiOS);

      // Registrar Service Worker
      if ("serviceWorker" in navigator) {
        registerServiceWorker();
      }

      // Listener para prompt de instalação
      const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
        e.preventDefault();
        setDeferredPrompt(e);
      };

      window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

      return () => {
        window.removeEventListener(
          "beforeinstallprompt",
          handleBeforeInstallPrompt
        );
      };
    }
  }, []);

  const registerServiceWorker = async () => {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
        updateViaCache: "none",
      });

      console.log("Service Worker registrado:", registration);

      // Verificar se já tem subscription
      const existingSubscription =
        await registration.pushManager.getSubscription();
      setSubscription(existingSubscription);
    } catch (error) {
      console.error("Erro ao registrar Service Worker:", error);
    }
  };

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setDeferredPrompt(null);
      setIsInstalled(true);
    }
  };

  const subscribeToNotifications = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;

      // Solicitar permissão
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        alert("Permissão para notificações negada");
        return;
      }

      // Criar subscription (usando chave pública VAPID fictícia para demo)
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          "BEl62iUYgUivxIkv69yViEuiBIa40HI80NM9LdNnC_NNPB6Pv0nkpT7QjVpRgJI5xJSHSRec-AUcycfkHHfHCao"
        ),
      });

      setSubscription(sub);
      console.log("Subscrito para notificações:", sub);

      // Aqui você enviaria a subscription para seu servidor
      // await fetch('/api/subscribe', { method: 'POST', body: JSON.stringify(sub) })
    } catch (error) {
      console.error("Erro ao subscrever notificações:", error);
    }
  };

  const unsubscribeFromNotifications = async () => {
    if (subscription) {
      await subscription.unsubscribe();
      setSubscription(null);
      console.log("Dessubscrito das notificações");
    }
  };

  const sendTestNotification = async () => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      const registration = await navigator.serviceWorker.ready;
      registration.showNotification("AquaGestão - Teste", {
        body: "Esta é uma notificação de teste do sistema!",
        icon: "/icon-192x192.svg",
        badge: "/icon-192x192.svg",
        data: {
          dateOfArrival: Date.now(),
          primaryKey: 1,
        },
      });
    }
  };

  // Função utilitária para converter chave VAPID
  function urlBase64ToUint8Array(base64String: string) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  if (!isSupported) {
    return null;
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smartphone className="h-5 w-5" />
          PWA - AquaGestão
        </CardTitle>
        <CardDescription>
          Instale o app para uma melhor experiência
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Instalação PWA */}
        <div className="space-y-2">
          <h4 className="font-medium">Instalação do App</h4>
          {isInstalled ? (
            <p className="text-sm text-green-600 flex items-center gap-2">
              <Download className="h-4 w-4" />
              App já instalado!
            </p>
          ) : deferredPrompt ? (
            <Button onClick={handleInstallClick} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Instalar App
            </Button>
          ) : (
            <p className="text-sm text-muted-foreground">
              Use o menu do navegador para instalar
            </p>
          )}
        </div>

        {/* Notificações Push */}
        {isNotificationSupported && (
          <div className="space-y-2">
            <h4 className="font-medium">Notificações</h4>
            <div className="flex gap-2">
              {subscription ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={unsubscribeFromNotifications}
                  >
                    <BellOff className="h-4 w-4 mr-2" />
                    Desativar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={sendTestNotification}
                  >
                    Testar
                  </Button>
                </>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={subscribeToNotifications}
                >
                  <Bell className="h-4 w-4 mr-2" />
                  Ativar
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Status */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>
            ✅ Service Worker: {isSupported ? "Suportado" : "Não suportado"}
          </p>
          <p>
            ✅ Notificações:{" "}
            {isNotificationSupported ? "Suportado" : "Não suportado"}
          </p>
          <p>✅ Instalação: {isInstalled ? "Instalado" : "Não instalado"}</p>
        </div>
      </CardContent>
    </Card>
  );
}
