import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Gestão Loja Água Mineral",
    short_name: "AquaGestão",
    description: "Sistema completo de gestão para loja de água mineral - pedidos, estoque, clientes e vendas",
    start_url: "/",
    display: "standalone",
    background_color: "#f0f9ff",
    theme_color: "#0ea5e9",
    icons: [
      {
        src: "/icon-192x192.svg",
        sizes: "192x192",
        type: "image/svg+xml",
      },
      {
        src: "/icon-512x512.svg",
        sizes: "512x512",
        type: "image/svg+xml",
      },
      {
        src: "/icon-192x192.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable"
      }
    ],
    categories: ["business", "productivity", "utilities"],
    lang: "pt-BR",
    orientation: "portrait",
    scope: "/",
    id: "aqua-gestao-pwa",
  };
}
