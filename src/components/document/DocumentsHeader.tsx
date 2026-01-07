import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import { DocumentsHeaderProps } from "@/types/types";

export const DocumentsHeader = ({
  processId,
  onBackClick,
  onAddClick,
}: DocumentsHeaderProps) => {
  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {processId && (
            <Button variant="outline" onClick={onBackClick}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Process
            </Button>
          )}
        </div>
        <Button onClick={onAddClick}>
          <Plus className="w-4 h-4 mr-2" />
          Add Document
        </Button>
      </div>

      <div>
        <h1 className="text-2xl font-bold">Documents</h1>
        <p className="text-muted-foreground">
          {processId
            ? "Documents related to this process"
            : "All documents registered"}
        </p>
      </div>
    </>
  );
};

