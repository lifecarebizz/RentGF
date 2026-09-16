import { Inter } from "next/font/google";
import "./globals.css";
import { Provider } from "./providers";
import type { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "RentGF - 18+ Non-Sexual Companionship Marketplace",
    template: "%s | RentGF",
  },
  description: "RentGF connects adults with verified companions for lawful, non-sexual social activities.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </head>
      <body className={`${inter.className} min-h-screen font-sans antialiased`}>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
