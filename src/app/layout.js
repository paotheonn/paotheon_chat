import "./globals.css";

export const metadata = {
  title: "Pãotheon — Assistente IA",
  description:
    "Chat com o Pãotheon, assistente de IA powered by DeepSeek R1 Distill Llama 70B",
  icons: { icon: "/favicon.svg" },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
