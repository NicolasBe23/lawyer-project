import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DocumentEmptyStateProps } from "@/types/types";

export const DocumentEmptyState = ({
  processId,
  onAddClick,
}: DocumentEmptyStateProps) => {
  return (
    <Card>
      <CardContent className="py-8">
        <p className="text-muted-foreground text-center">
          {processId
            ? "No documents found for this process"
            : "No documents found"}
        </p>
        <div className="flex justify-center mt-4">
          <Button onClick={onAddClick}>
            <Plus className="w-4 h-4 mr-2" />
            Add First Document
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

