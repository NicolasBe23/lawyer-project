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
    <div className="bg-gray-900 border border-white/10 shadow rounded-lg p-4">
      <h2 className="text-base font-semibold text-white mb-3">
        {t("dashboard.pendingDocuments")}
      </h2>
      {loading ? (
        <p className="text-sm text-muted-foreground">{t("dashboard.loadingDocuments")}</p>
      ) : documents.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("dashboard.noDocumentsFound")}</p>
      ) : (
        <Link href="/dashboard/documents">
          <ul className="space-y-2 text-sm">
            {documents.map((document) => (
              <li
                key={document.id}
                className="p-2 rounded-md border border-white/5 bg-white/5 hover:bg-white/10 transition-colors text-gray-200"
              >
                <span className="font-medium">{document.title}</span>
                {document.process?.client?.name && (
                  <span className="text-muted-foreground">
                    {" "}— {document.process.client.name}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </Link>
      )}
    </div>
  );
};
