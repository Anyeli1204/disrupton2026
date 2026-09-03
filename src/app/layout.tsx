import type { Metadata } from "next";
import { IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";
import { StoreProvider } from "@/lib/store";

const ibmPlex = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Zhenda · Valle Azul",
  description: "Zhenda conecta los identificadores de los sistemas existentes para reconstruir la trazabilidad del arándano fresco",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${ibmPlex.variable} h-full antialiased`}>
      <body className="min-h-full font-sans">
        <StoreProvider>
          <AppShell>{children}</AppShell>
        </StoreProvider>
      </body>
    </html>
  );
}
