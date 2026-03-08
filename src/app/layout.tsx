import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "nprogress/nprogress.css";
import "./globals.css";
import { Toaster } from "sonner";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { NavigationProgress } from "@/components/providers/NavigationProgress";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lawyer app",
  description: "Lawyer app to manage your clients and schedules",
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={`${montserrat.className} antialiased bg-gray-900`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <NavigationProgress />
          {children}
          <Toaster />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
