import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Sakhir Hichap",
    short_name: "Sakhir Hichap",
    description: "Track your tractor income and expenses",
    start_url: "/",
    display: "standalone",
    background_color: "#F6F4EE",
    theme_color: "#2F4A3B",
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
      {
        src: "/icon-maskable-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
