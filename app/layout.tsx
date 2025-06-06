import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Provider } from "../components/ui/provider";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Avendi",
  description: "Avendi is a modern booking system.",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // <html lang="en" suppressHydrationWarning>
    //   <body className={`${geistSans.className} antialiased`}>
    //     <ThemeProvider
    //       attribute="class"
    //       defaultTheme="system"
    //       enableSystem
    //       disableTransitionOnChange
    //     >
    //       {children}
    //     </ThemeProvider>
    //   </body>
    // </html>
    <html suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased`}>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
