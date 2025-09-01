import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ClientFormProps } from "@/types/types";

export const ClientForm = ({
  onSubmit,
  initialData,
  isLoading = false,
  submitText = "Save",
  onCancel,
}: ClientFormProps) => {
  const [formData, setFormData] = useState({
    name: initialData?.attributes.name || "",
    email: initialData?.attributes.email || "",
    phoneNumber: initialData?.attributes.phoneNumber || "",
    address: initialData?.attributes.address || "",
    birthDate: initialData?.attributes.birthDate || "",
    observations: initialData?.attributes.observations || "",
    active: initialData?.attributes.active ?? true,
  });

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit(formData);
    },
    [formData, onSubmit]
  );

  const handleChange = useCallback(
    (field: string, value: string | boolean) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    [setFormData]
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input
            id="phoneNumber"
            value={formData.phoneNumber}
            onChange={(e) => handleChange("phoneNumber", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="birthDate">Birth Date</Label>
          <Input
            id="birthDate"
            type="date"
            value={formData.birthDate}
            onChange={(e) => handleChange("birthDate", e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          value={formData.address}
          onChange={(e) => handleChange("address", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="observations">Observations</Label>
        <Textarea
          id="observations"
          value={formData.observations}
          onChange={(e) => handleChange("observations", e.target.value)}
          rows={4}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          className="cursor-pointer"
          id="active"
          checked={formData.active}
          onCheckedChange={(checked) => handleChange("active", checked)}
        />
        <Label htmlFor="active">Active</Label>
      </div>

      <div className="flex justify-end space-x-2 pt-6">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            className="cursor-pointer"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
        )}
        <Button
          className="cursor-pointer bg-gray-900 hover:bg-gray-800"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : submitText}
        </Button>
      </div>
    </form>
  );
};
