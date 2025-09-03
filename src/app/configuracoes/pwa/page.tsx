"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { PWAManager } from "@/shared/components/layout/PWAManager";
import { Smartphone, Send, Settings, Wifi, WifiOff } from "lucide-react";
import { toast } from "sonner";

export default function PWAConfigPage() {
  const [isOnline, setIsOnline] = useState(true);
  const [notificationData, setNotificationData] = useState({
    title: "AquaGestão - Notificação",
    body: "Esta é uma mensagem de teste do sistema!",
    url: "/pedidos",
  });

  // Simular status online/offline
  const toggleOnlineStatus = () => {
    setIsOnline(!isOnline);
    if (!isOnline) {
      toast.success("Conectado à internet");
    } else {
      toast.warning("Modo offline ativado");
    }
  };

  // Enviar notificação de teste
  const sendTestNotification = async () => {
    try {
      const response = await fetch("/api/pwa/notify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(notificationData),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(`Notificação enviada para ${result.sent} dispositivos`);
      } else {
        toast.error(result.error || "Erro ao enviar notificação");
      }
    } catch (error) {
      console.error("Erro:", error);
      toast.error("Erro ao enviar notificação");
    }
  };

  // Limpar cache do Service Worker
  const clearCache = async () => {
    if ("serviceWorker" in navigator && "caches" in window) {
      try {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
        toast.success("Cache limpo com sucesso");
      } catch (error) {
        console.error("Erro ao limpar cache:", error);
        toast.error("Erro ao limpar cache");
      }
    }
  };

  // Atualizar Service Worker
  const updateServiceWorker = async () => {
    if ("serviceWorker" in navigator) {
      try {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          await registration.update();
          toast.success("Service Worker atualizado");
        }
      } catch (error) {
        console.error("Erro ao atualizar SW:", error);
        toast.error("Erro ao atualizar Service Worker");
      }
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Smartphone className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold">Configurações PWA</h1>
          <p className="text-muted-foreground">
            Gerencie as funcionalidades do Progressive Web App
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PWA Manager */}
        <div className="lg:col-span-1">
          <PWAManager />
        </div>

        {/* Status da Conexão */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {isOnline ? (
                <Wifi className="h-5 w-5 text-green-600" />
              ) : (
                <WifiOff className="h-5 w-5 text-red-600" />
              )}
              Status da Conexão
            </CardTitle>
            <CardDescription>
              Simule o comportamento offline do app
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">
                Status: {isOnline ? "Online" : "Offline"}
              </span>
              <Button variant="outline" size="sm" onClick={toggleOnlineStatus}>
                {isOnline ? "Simular Offline" : "Voltar Online"}
              </Button>
            </div>

            <div className="text-xs text-muted-foreground space-y-1">
              <p>• No modo offline, o app usa dados em cache</p>
              <p>• Funcionalidades básicas continuam disponíveis</p>
              <p>• Sincronização automática quando voltar online</p>
            </div>
          </CardContent>
        </Card>

        {/* Teste de Notificações */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Teste de Notificações Push
            </CardTitle>
            <CardDescription>
              Envie notificações de teste para dispositivos conectados
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={notificationData.title}
                  onChange={(e) =>
                    setNotificationData({
                      ...notificationData,
                      title: e.target.value,
                    })
                  }
                  placeholder="Título da notificação"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="url">URL de Destino</Label>
                <Input
                  id="url"
                  value={notificationData.url}
                  onChange={(e) =>
                    setNotificationData({
                      ...notificationData,
                      url: e.target.value,
                    })
                  }
                  placeholder="/pedidos"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="body">Mensagem</Label>
              <Textarea
                id="body"
                value={notificationData.body}
                onChange={(e) =>
                  setNotificationData({
                    ...notificationData,
                    body: e.target.value,
                  })
                }
                placeholder="Conteúdo da notificação"
                rows={3}
              />
            </div>

            <Button onClick={sendTestNotification} className="w-full">
              <Send className="h-4 w-4 mr-2" />
              Enviar Notificação de Teste
            </Button>
          </CardContent>
        </Card>

        {/* Gerenciamento de Cache */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Gerenciamento
            </CardTitle>
            <CardDescription>Ferramentas de manutenção do PWA</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" onClick={clearCache} className="w-full">
              Limpar Cache
            </Button>

            <Button
              variant="outline"
              onClick={updateServiceWorker}
              className="w-full"
            >
              Atualizar Service Worker
            </Button>

            <div className="text-xs text-muted-foreground mt-4">
              <p>
                <strong>Limpar Cache:</strong> Remove dados armazenados
                localmente
              </p>
              <p>
                <strong>Atualizar SW:</strong> Força atualização do Service
                Worker
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Informações do PWA */}
        <Card>
          <CardHeader>
            <CardTitle>Informações do PWA</CardTitle>
            <CardDescription>Detalhes técnicos da aplicação</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="grid grid-cols-2 gap-2">
              <span className="font-medium">Nome:</span>
              <span>AquaGestão</span>

              <span className="font-medium">Versão:</span>
              <span>1.0.0</span>

              <span className="font-medium">Tema:</span>
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                #0ea5e9
              </span>

              <span className="font-medium">Modo:</span>
              <span>Standalone</span>

              <span className="font-medium">Orientação:</span>
              <span>Portrait</span>

              <span className="font-medium">Idioma:</span>
              <span>pt-BR</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
