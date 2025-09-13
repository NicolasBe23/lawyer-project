import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";
import { ProcessDocumentsProps } from "@/types/types";

export const ProcessDocuments = ({
  documents,
  formatDate,
}: ProcessDocumentsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="w-5 h-5" />
          <span>Process Documents</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {documents && documents.length > 0 ? (
          <div className="space-y-3">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50"
              >
                <div>
                  <p className="font-medium">{doc.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {doc.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Created: {formatDate(doc.createdAt)}
                  </p>
                </div>
                {doc.file && (
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">
            No documents attached
          </p>
        )}
      </CardContent>
    </Card>
  );
};
