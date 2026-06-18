import type { ReactNode } from "react";
import "./globals.css";
import { Providers } from "@/components/providers";

export const metadata = { title: "Vistoria Admin", description: "Gestão e auditoria de vistorias" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
