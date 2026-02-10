import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Trash2, CheckCircle, XCircle } from "lucide-react";
import { ClientHeaderProps } from "@/types/types";
import { useTranslations } from "next-intl";
export const ClientHeader = ({
  client,
  onBack,
  onEdit,
  onDelete,
  formatDate,
}: ClientHeaderProps) => {
  const t = useTranslations();
  return (
    <>
      <div className="flex justify-start mb-8">
        <Button variant="outline" className="cursor-pointer" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t("common.back")}
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{client.attributes.name}</h1>
          <p className="text-muted-foreground">
            {t("clients.clientSince")} {formatDate(client.attributes.createdAt)}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" className="cursor-pointer" onClick={onEdit}>
            <Edit className="w-4 h-4 mr-2" />
            {t("common.edit")}
          </Button>
          <Button
            variant="destructive"
            className="cursor-pointer"
            onClick={onDelete}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            {t("common.delete")}
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {client.attributes.active ? (
          <div className="flex items-center space-x-2 bg-green-100 text-green-800 px-3 py-1 rounded-full">
            <CheckCircle className="w-4 h-4" />
            <span>{t("clients.active")}</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2 bg-red-100 text-red-800 px-3 py-1 rounded-full">
            <XCircle className="w-4 h-4" />
            <span>{t("clients.inactive")}</span>
          </div>
        )}
      </div>
    </>
  );
};
