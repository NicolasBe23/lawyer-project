"use client";

import { useEffect, useState } from "react";
import { getAllDocuments } from "@/services/getAllDocuments";
import { DocumentData } from "@/types/types";

export const PendingDocumentsCard = () => {
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllDocuments().then((res) => {
      const sortedDocuments = res.data
        .filter((document) => document && document.title)
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 3);

      setDocuments(sortedDocuments);
      setLoading(false);
    });
  }, []);

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-3">Pending Documents</h2>
      {loading ? (
        <p className="text-sm text-gray-500">Loading documents...</p>
      ) : documents.length === 0 ? (
        <p className="text-sm text-gray-500">No documents found.</p>
      ) : (
        <ul className="space-y-2 text-sm">
          {documents.map((document) => (
            <li key={document.id} className="p-2 border rounded">
              {document.title}
              {document.process?.client?.name &&
                ` – ${document.process.client.name}`}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
