import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "../src/contexts/AuthContext";

export const metadata: Metadata = {
  title: "Flor de Sal - Gestão de Artesanato",
  description: "App para artesãs gerenciarem produção e vendas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
