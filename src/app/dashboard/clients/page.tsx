"use client";

import { Loading } from "@/components/ui/loading";
import { Client } from "@/types/types";
import { getAllClients } from "@/services/getAllClients";
import { useState, useEffect } from "react";

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Clients</h1>
      {clients.length === 0 ? (
        <p>No clients found.</p>
      ) : (
        <ul className="space-y-2">
          {clients.map((client) => (
            <li key={client.id} className="p-3 bg-white shadow rounded">
              <p>
                <strong>Name:</strong> {client.attributes.name}
              </p>
              <p>
                <strong>Email:</strong> {client.attributes.email || "N/A"}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
