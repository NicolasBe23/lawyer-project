import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";
import { ProcessClientInfoProps } from "@/types/types";
import { useTranslations } from "next-intl";

export const ProcessClientInfo = ({ client }: ProcessClientInfoProps) => {
  const t = useTranslations();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <User className="w-5 h-5" />
          <span>{t("processes.clientInformation")}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {client ? (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">{t("clients.name")}:</p>
              <p className="font-medium">{client.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t("clients.email")}:</p>
              <p className="font-medium">{client.email || t("common.na")}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                {t("clients.phoneNumber")}:
              </p>
              <p className="font-medium">{client.phoneNumber || t("common.na")}</p>
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground">{t("processes.noClientLinked")}</p>
        )}
      </CardContent>
    </Card>
  );
};
