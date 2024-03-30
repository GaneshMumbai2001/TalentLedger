import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import { store, persistor } from "../store/store";
import { Providers } from "@/store/provider";
import { EthereumProvider } from "./Components/DataContext";
const inter = Inter({ subsets: ["latin"] });
import { AnonAadhaarProvider } from "@anon-aadhaar/react";

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
        <Providers>
          <EthereumProvider> {children}</EthereumProvider>
        </Providers>
      </body>
    </html>
  );
}
