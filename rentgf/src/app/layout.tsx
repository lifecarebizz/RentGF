import { Inter } from "next/font/google";
import "./globals.css";
import { Provider } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: {
    default: "RentGF - 18+ Non-Sexual Companionship Marketplace",
    template: "%s | RentGF",
  },
  description: "RentGF connects adults with verified companions for lawful, non-sexual social activities.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen font-sans antialiased`}>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
