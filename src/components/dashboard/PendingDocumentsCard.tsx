"use client";

import { useEffect, useState } from "react";
import { getAllDocuments } from "@/services/getAllDocuments";
import { DocumentData } from "@/types/types";
import Link from "next/link";
import { useTranslations } from "next-intl";
export const PendingDocumentsCard = () => {
  const t = useTranslations();
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllDocuments().then((res) => {
      const sortedDocuments = res.data
        .filter((document) => document && document.title)
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
        .slice(0, 3);

      setDocuments(sortedDocuments);
      setLoading(false);
    });
  }, []);

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-3">
        {t("dashboard.pendingDocuments")}
      </h2>
      {loading ? (
        <p className="text-sm text-gray-500">
          {t("dashboard.loadingDocuments")}
        </p>
      ) : documents.length === 0 ? (
        <p className="text-sm text-gray-500">
          {t("dashboard.noDocumentsFound")}
        </p>
      ) : (
        <Link href={`/dashboard/documents`}>
          <ul className="space-y-2 text-sm">
            {documents.map((document) => (
              <li key={document.id} className="p-2 border rounded">
                {document.title}
                {document.process?.client?.name &&
                  ` – ${document.process.client.name}`}
              </li>
            ))}
          </ul>
        </Link>
      )}
    </div>
  );
};
