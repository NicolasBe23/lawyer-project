import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";
import { ProcessClientInfoProps } from "@/types/types";

export const ProcessClientInfo = ({ client }: ProcessClientInfoProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <User className="w-5 h-5" />
          <span>Client Information</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {client ? (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Name:</p>
              <p className="font-medium">{client.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email:</p>
              <p className="font-medium">{client.email || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Phone:</p>
              <p className="font-medium">{client.phoneNumber || "N/A"}</p>
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground">No client linked</p>
        )}
      </CardContent>
    </Card>
  );
};
