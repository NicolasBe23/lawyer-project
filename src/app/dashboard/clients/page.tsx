"use client";

import { Loading } from "@/components/ui/loading";
import { Client } from "@/types/types";
import { getAllClients } from "@/services/getAllClients";
import { useState, useEffect } from "react";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    getAllClients().then((res) => {
      setClients(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <Loading text="Loading clients..." size="md" />
      </div>
    );
  }

  return (
    <div className="p-2">
      <h1 className="text-2xl font-bold mb-8">My Clients</h1>
      {clients.length === 0 ? (
        <p>No clients found.</p>
      ) : (
        <div className="space-y-2 gap-6 flex flex-col">
          {clients.map((client) => (
            <div
              key={client.id}
              className="p-3 border-b flex justify-between items-center hover:bg-gray-300 hover:rounded-lg cursor-pointer transition-colors duration-200"
              onClick={() => router.push(`/dashboard/clients/${client.id}`)}
            >
              <div className="flex flex-col gap-2">
                <p className="text-sm">
                  <strong>Name:</strong> {client.attributes.name}
                </p>
                <p className="text-sm">
                  <strong>Email:</strong> {client.attributes.email || "N/A"}
                </p>
              </div>
              <Trash className="w-5 h-5 cursor-pointer text-red-500 hover:text-red-700" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
