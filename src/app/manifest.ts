import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AquaGestão - Sistema de Gestão",
    short_name: "AquaGestão",
    description: "Sistema completo de gestão para loja de água mineral",
    start_url: "/login",
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
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    screenshots: [
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        form_factor: "wide",
        label: "AquaGestão Desktop View",
      },
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        form_factor: "narrow",
        label: "AquaGestão Mobile View",
      },
    ],
  };
}
