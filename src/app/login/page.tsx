"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FcGoogle } from "react-icons/fc";
import { AuthResponse } from "@/types/types";

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post<AuthResponse>(
        `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/auth/local`,
        { identifier, password }
      );

      Cookies.set("strapi_token", res.data.jwt, { expires: 7 });

      Cookies.set("strapi_user", JSON.stringify(res.data.user), { expires: 7 });

      router.push("/dashboard");
    } catch (err: unknown) {
      setError("Invalid credentials");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/connect/google`;
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="w-96 shadow-lg">
        <CardHeader>
          <CardTitle className="text-center">Login</CardTitle>
          <CardDescription className="text-center">
            Access your account to continue
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Input
              type="text"
              placeholder="Email ou Username"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />

            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>

          <div className="mt-4 flex items-center justify-center">
            <div className="w-full border-t"></div>
            <span className="px-2 text-sm text-muted-foreground">or</span>
            <div className="w-full border-t"></div>
          </div>

          <Button
            onClick={handleGoogleLogin}
            variant="outline"
            className="w-full mt-4 flex items-center justify-center gap-2"
          >
            <FcGoogle size={20} />
            Login with Google
          </Button>
        </CardContent>

        <CardFooter className="text-sm text-center flex flex-col gap-2">
          <p>
            Don&apos;t have an account?{" "}
            <a href="/register" className="text-blue-600 hover:underline">
              Register
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
