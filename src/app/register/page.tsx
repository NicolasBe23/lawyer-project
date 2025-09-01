"use client";

import { useState, useCallback } from "react";
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
import { AuthResponse, StrapiError } from "@/types/types";
import { Loading } from "@/components/ui/loading";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const registerPromise = axios.post<AuthResponse>(
        `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/auth/local/register`,
        { username, email, password }
      );

      const delayPromise = new Promise((resolve) => setTimeout(resolve, 2000));

      const [res] = await Promise.all([registerPromise, delayPromise]);

      Cookies.set("strapi_token", res.data.jwt, { expires: 7 });
      Cookies.set("strapi_user", JSON.stringify(res.data.user), { expires: 7 });

      router.push("/dashboard");
    } catch (err: unknown) {
      const errorMessage = (err as StrapiError).response?.data?.error?.message;

      if (errorMessage) {
        setError(errorMessage);
      } else {
        setError("Error creating account. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="w-96 shadow-lg">
        <CardHeader>
          <CardTitle className="text-center">Create Account</CardTitle>
          <CardDescription className="text-center">
            Fill in the data to register
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
            />

            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />

            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />

            <Button
              type="submit"
              className="w-full bg-gray-900 hover:bg-gray-800"
              disabled={loading}
            >
              {loading ? (
                <Loading text="Creating account..." size="md" />
              ) : (
                "Register"
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="text-sm text-center flex flex-col gap-2">
          <p>
            Already have an account?{" "}
            <a href="/login" className="text-blue-700 hover:underline">
              Login
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
