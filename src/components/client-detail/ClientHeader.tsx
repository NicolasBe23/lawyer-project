import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Trash2, CheckCircle, XCircle } from "lucide-react";
import { ClientHeaderProps } from "@/types/types";

export const ClientHeader = ({
  client,
  onBack,
  onEdit,
  onDelete,
  formatDate,
}: ClientHeaderProps) => {
  return (
    <>
      <div className="flex justify-start mb-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{client.attributes.name}</h1>
          <p className="text-muted-foreground">
            Client since {formatDate(client.attributes.createdAt)}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={onEdit}>
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button variant="destructive" onClick={onDelete}>
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {client.attributes.active ? (
          <div className="flex items-center space-x-2 bg-green-100 text-green-800 px-3 py-1 rounded-full">
            <CheckCircle className="w-4 h-4" />
            <span>Active</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2 bg-red-100 text-red-800 px-3 py-1 rounded-full">
            <XCircle className="w-4 h-4" />
            <span>Inactive</span>
          </div>
        )}
      </div>
    </>
  );
};
