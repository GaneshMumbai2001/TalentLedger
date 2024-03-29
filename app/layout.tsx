import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import { store, persistor } from "../store/store";
import { Providers } from "@/store/provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TaletLedger",
  description: "Decentralized Gig Hiring platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="../assets/Logo.ico" />
      </head>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
