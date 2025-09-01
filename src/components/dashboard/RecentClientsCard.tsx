"use client";

import { useEffect, useState } from "react";
import { Client } from "@/types/types";
import { getAllClients } from "@/services/getAllClients";
import Link from "next/link";

export const RecentClientsCard = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllClients().then((res) => {
      const sortedClients = res.data
        .filter((client) => client && client.attributes)
        .sort(
          (a, b) =>
            new Date(b.attributes.createdAt).getTime() -
            new Date(a.attributes.createdAt).getTime()
        )
        .slice(0, 3);
      setClients(sortedClients);
      setLoading(false);
    });
  }, []);

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-3">Last Clients</h2>
      {loading ? (
        <p className="text-sm text-gray-500">Loading clients...</p>
      ) : clients.length === 0 ? (
        <p className="text-sm text-gray-500">No client found.</p>
      ) : (
        <Link href={`/dashboard/clients`}>
          <ul className="space-y-2 text-sm">
            {clients.map((client) => (
              <li key={client.id} className="p-2 border rounded">
                {client.attributes.name} –{" "}
                {client.attributes.email || "No email"}
              </li>
            ))}
          </ul>
        </Link>
      )}
    </div>
  );
};
