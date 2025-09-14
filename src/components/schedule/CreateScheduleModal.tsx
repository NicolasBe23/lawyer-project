"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CreateScheduleModalProps, Client, Process } from "@/types/types";
import { getAllClients } from "@/services/getAllClients";
import { toast } from "sonner";
import { getAllProcesses } from "@/services/getAllProcesses";

export const CreateScheduleModal = ({
  isOpen,
  onClose,
  onSave,
  selectedDate,
  isLoading = false,
}: CreateScheduleModalProps) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dateTime: "",
    location: "",
    client: "",
    process: "",
  });
  const [clients, setClients] = useState<Client[]>([]);
  const [loadingClients, setLoadingClients] = useState(false);
  const [processes, setProcesses] = useState<Process[]>([]);
  const [loadingProcesses, setLoadingProcesses] = useState(false);
  useEffect(() => {
    if (selectedDate) {
      setFormData((prev) => ({
        ...prev,
        dateTime: `${selectedDate}T09:00`,
      }));
    }
  }, [selectedDate]);

  useEffect(() => {
    if (isOpen) {
      loadClients();
      loadProcesses();
    }
  }, [isOpen]);

  const loadProcesses = async () => {
    setLoadingProcesses(true);
    try {
      const { data } = await getAllProcesses();
      setProcesses(data);
    } catch {
      toast.error("Error loading processes");
    } finally {
      setLoadingProcesses(false);
    }
  };

  const loadClients = async () => {
    setLoadingClients(true);
    try {
      const { data } = await getAllClients();
      setClients(data);
    } catch {
      toast.error("Error loading clients");
    } finally {
      setLoadingClients(false);
    }
  };

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      const scheduleData = {
        title: formData.title,
        description: formData.description || undefined,
        dateTime: formData.dateTime,
        location: formData.location || undefined,
        client: formData.client ? parseInt(formData.client) : undefined,
        process: formData.process ? parseInt(formData.process) : undefined,
      };

      onSave(scheduleData);
    },
    [onSave, formData]
  );

  const handleClose = useCallback(() => {
    setFormData({
      title: "",
      description: "",
      dateTime: selectedDate ? `${selectedDate}T09:00` : "",
      location: "",
      client: "",
      process: "",
    });
    onClose();
  }, [onClose, selectedDate]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create Schedule</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="Ex: Meeting with client"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateTime">Date and Time *</Label>
            <Input
              id="dateTime"
              type="datetime-local"
              value={formData.dateTime}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, dateTime: e.target.value }))
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="client">Client</Label>
            <select
              id="client"
              value={formData.client}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, client: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loadingClients}
            >
              <option value="">Select client (optional)</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.attributes.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, location: e.target.value }))
              }
              placeholder="Ex: Office, Court, etc."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Additional details about the schedule, etc."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="process">Process</Label>
            <select
              id="process"
              value={formData.process}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, process: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loadingProcesses}
            >
              <option value="">Select process (optional)</option>
              {processes.map((process) => (
                <option key={process.id} value={process.id}>
                  {process.title}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !formData.title || !formData.dateTime}
            >
              {isLoading ? "Creating..." : "Create Schedule"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
