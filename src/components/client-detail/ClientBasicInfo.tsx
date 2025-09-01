import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, Phone, MapPin, Calendar, FileText } from "lucide-react";
import { ClientBasicInfoProps } from "@/types/types";

export const ClientBasicInfo = ({
  client,
  formatDate,
}: ClientBasicInfoProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <User className="w-5 h-5" />
          <span>Basic Information</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Email:</p>
              <p className="font-medium">{client.attributes.email}</p>
            </div>
          </div>

          {client.attributes.phoneNumber && (
            <div className="flex items-center space-x-3">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Phone:</p>
                <p className="font-medium">{client.attributes.phoneNumber}</p>
              </div>
            </div>
          )}

          {client.attributes.birthDate && (
            <div className="flex items-center space-x-3">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Birth Date:</p>
                <p className="font-medium">
                  {formatDate(client.attributes.birthDate)}
                </p>
              </div>
            </div>
          )}
        </div>

        {client.attributes.address && (
          <div className="flex items-start space-x-3">
            <MapPin className="w-4 h-4 text-muted-foreground mt-1" />
            <div>
              <p className="text-sm text-muted-foreground">Address:</p>
              <p className="font-medium">{client.attributes.address}</p>
            </div>
          </div>
        )}

        {client.attributes.observations && (
          <div className="flex items-start space-x-3">
            <FileText className="w-4 h-4 text-muted-foreground mt-1" />
            <div>
              <p className="text-sm text-muted-foreground">Observations:</p>
              <p className="font-medium whitespace-pre-wrap">
                {client.attributes.observations}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
