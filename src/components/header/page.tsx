"use client";

import { useUser } from "@/lib/useUser";

export default function Header() {
  const { user } = useUser();

  return (
    <div className="flex justify-between items-center p-2 mb-4 border-b-2 border-gray-300 pb-4 w-full">
      <div className="flex flex-col">
        <p className="text-2xl">Organize and manage all your legal documents</p>
      </div>
      <div className="flex flex-col">
        <p>Hello, {user?.username}</p>
      </div>
    </div>
  );
}
