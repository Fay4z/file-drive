import { Inter } from "next/font/google";
import "./globals.css";
import ConvexClientProvider from "@/app/ConvexClientProvider";
import { Header } from "./header";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "File Drive",
  description: "File Storage made easy",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ConvexClientProvider>
          <Toaster />
          <Header />
          {children}
        </ConvexClientProvider>
      </body>
    </html>
  );
}
