"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
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

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post<AuthResponse>(
        `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/auth/local/register`,
        { username, email, password }
      );
      localStorage.setItem("strapi_token", res.data.jwt);
      router.push("/dashboard");
    } catch (err: unknown) {
      setError("Error registering. Please try again.");
    }
  };

  const handleGoogleRegister = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/connect/google`;
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
            />

            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              Register
            </Button>
          </form>

          <div className="mt-4 flex items-center justify-center">
            <div className="w-full border-t"></div>
            <span className="px-2 text-sm text-muted-foreground">or</span>
            <div className="w-full border-t"></div>
          </div>

          <Button
            onClick={handleGoogleRegister}
            variant="outline"
            className="w-full mt-4 flex items-center justify-center gap-2"
          >
            <FcGoogle size={20} />
            Register with Google
          </Button>
        </CardContent>

        <CardFooter className="text-sm text-center flex flex-col gap-2">
          <p>
            Already have an account?{" "}
            <a href="/login" className="text-blue-600 hover:underline">
              Login
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
