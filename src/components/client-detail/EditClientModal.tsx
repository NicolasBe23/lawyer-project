import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ClientForm } from "./ClientForm";
import { EditClientModalProps } from "@/types/types";

export const EditClientModal = ({
  isOpen,
  onClose,
  onSave,
  client,
  isLoading = false,
}: EditClientModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Client</DialogTitle>
        </DialogHeader>

        <ClientForm
          onSubmit={onSave}
          initialData={client}
          isLoading={isLoading}
          submitText="Save Changes"
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};
