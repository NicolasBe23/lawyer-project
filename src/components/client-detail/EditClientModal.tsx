import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ClientForm } from "./ClientForm";
import { EditClientModalProps } from "@/types/types";
import { useTranslations } from "next-intl";

export const EditClientModal = ({
  isOpen,
  onClose,
  onSave,
  client,
  isLoading = false,
}: EditClientModalProps) => {
  const t = useTranslations();
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900 border border-white/10 shadow">
        <DialogHeader>
          <DialogTitle>{t("clients.editClient")}</DialogTitle>
        </DialogHeader>

        <ClientForm
          onSubmit={onSave}
          initialData={client}
          isLoading={isLoading}
          submitText={t("clients.saveChanges")}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};
