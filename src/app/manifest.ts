import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AquaGestão - Sistema de Gestão",
    short_name: "AquaGestão",
    description: "Sistema completo de gestão para loja de água mineral",
    start_url: "/",
    display: "standalone",
    background_color: "#0f172a",
    theme_color: "#4F46E5",
    orientation: "portrait-primary",
    categories: [
      "gestão",
      "água mineral",
      "pedidos",
      "estoque",
      "vendas",
      "clientes",
    ],
    lang: "pt-BR",
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
    ],
    screenshots: [
      {
        src: "/icon-512x512.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        form_factor: "wide",
        label: "AquaGestão Desktop View",
      },
      {
        src: "/icon-192x192.svg",
        sizes: "192x192",
        type: "image/svg+xml",
        form_factor: "narrow",
        label: "AquaGestão Mobile View",
      },
    ],
  };
}
