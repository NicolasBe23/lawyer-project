"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { User } from "@/types/types";

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = () => {
      try {
        const token = Cookies.get("strapi_token");
        const userData = Cookies.get("strapi_user");

        if (token && userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        }
      } catch {
        Cookies.remove("strapi_token");
        Cookies.remove("strapi_user");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const logout = () => {
    Cookies.remove("strapi_token");
    Cookies.remove("strapi_user");
    setUser(null);
    window.location.href = "/login";
  };

  return { user, loading, logout };
};
