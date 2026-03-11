"use client";

import { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LanguageSwitcher } from "@/components/ui/language-switcher";

type AuthFormCardProps = {
  title: string;
  description: string;
  footerText: string;
  footerLinkText: string;
  footerLinkHref: string;
  children: ReactNode;
};

export const AuthFormCard = ({
  title,
  description,
  footerText,
  footerLinkText,
  footerLinkHref,
  children,
}: AuthFormCardProps) => {
  return (
    <div className="relative flex items-center justify-center h-screen">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>

      <Card className="w-96 shadow-lg">
        <CardHeader>
          <CardTitle className="text-center">{title}</CardTitle>
          <CardDescription className="text-center">{description}</CardDescription>
        </CardHeader>

        <CardContent>{children}</CardContent>

        <CardFooter className="text-sm text-center flex flex-col gap-4">
          <p>
            {footerText}{" "}
            <a href={footerLinkHref} className="text-blue-700 hover:underline">
              {footerLinkText}
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};
