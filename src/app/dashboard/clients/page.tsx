"use client";

import { useEffect, useState } from "react";
import { Client } from "@/types/types";
import Cookies from "js-cookie";

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const token = Cookies.get("strapi_token");
        if (!token) {
          console.error("Token not found");
          return;
        }

        const res = await fetch("http://localhost:1337/api/clients", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        setClients(data.data || []);
      } catch (err) {
        console.error("Error fetching clients:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  if (loading) return <p>Loading clients...</p>;

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
