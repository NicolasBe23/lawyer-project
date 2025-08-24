"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";

interface User {
  id: number;
  username: string;
  email: string;
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get("strapi_token");
    if (!token) {
      setLoading(false);
      return;
    }

    const userFromCookie = Cookies.get("strapi_user");
    if (userFromCookie) {
      try {
        setUser(JSON.parse(userFromCookie));
        setLoading(false);
        return;
      } catch (error) {
        console.error("Error parsing user from cookie:", error);
      }
    }

    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:1337/api/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Erro ao buscar usuário");
        const data = await res.json();

        setUser(data);
        Cookies.set("strapi_user", JSON.stringify(data), { expires: 7 });
      } catch (error) {
        console.error(error);
        Cookies.remove("strapi_token");
        Cookies.remove("strapi_user");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, loading };
}
