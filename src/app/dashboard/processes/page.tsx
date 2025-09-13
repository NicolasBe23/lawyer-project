"use client";

import { Loading } from "@/components/ui/loading";
import { Process } from "@/types/types";
import { getAllProcesses } from "@/services/getAllProcesses";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Eye, Briefcase } from "lucide-react";
import { ProcessStatusBadge } from "@/components/process/ProcessStatusBadge";

export default function ProcessesPage() {
  const [processes, setProcesses] = useState<Process[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    getAllProcesses().then((res) => {
      setProcesses(res.data);
      setLoading(false);
    });
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  if (loading) {
    return (
      <div className="p-6">
        <Loading text="Loading processes..." size="md" />
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center p-2 border-b-2 border-gray-300 pb-4 w-full mb-6">
        <h1 className="text-2xl cursor-default">My Processes</h1>
        <Button
          className="cursor-pointer bg-gray-900 hover:bg-gray-800"
          onClick={() => router.push("/dashboard/processes/add")}
        >
          <Plus className="w-4 h-4 mr-2" />
          New Process
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Briefcase className="w-5 h-5" />
            <span>All Processes ({processes.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {processes.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No processes found.
            </p>
          ) : (
            <div className="space-y-4">
              {processes.map((process) => (
                <div
                  key={process.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
                  onClick={() =>
                    router.push(`/dashboard/processes/${process.id}`)
                  }
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-lg">{process.title}</h4>
                      <ProcessStatusBadge status={process.processStatus} />
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>Process: {process.processNumber}</p>
                      <p>Client: {process.client?.name || "N/A"}</p>
                      <p>Start: {formatDate(process.startDate)}</p>
                      {process.completionDate && (
                        <p>Completed: {formatDate(process.completionDate)}</p>
                      )}
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="ml-4">
                    <Eye className="w-4 h-4 mr-2" />
                    View details
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
