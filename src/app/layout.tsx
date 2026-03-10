import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "nprogress/nprogress.css";
import "react-phone-number-input/style.css";
import "./globals.css";
import { Toaster } from "sonner";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { NavigationProgress } from "@/components/providers/NavigationProgress";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Law Management",
  description: "Lawyer app to manage your clients and schedules",
  icons: {
    icon: "/icon.png?v=2",
    shortcut: "/icon.png?v=2",
    apple: "/icon.png?v=2",
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
