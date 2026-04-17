"use client";

import { Button } from "@/components/ui/button";
import { Loading } from "@/components/ui/loading";

type AuthSubmitButtonProps = {
  loading: boolean;
  loadingText: string;
  submitText: string;
};

export const AuthSubmitButton = ({
  loading,
  loadingText,
  submitText,
}: AuthSubmitButtonProps) => {
  return (
    <Button
      type="submit"
      className="w-full bg-blue-600 hover:bg-blue-500 text-white cursor-pointer"
      disabled={loading}
    >
      {loading ? <Loading text={loadingText} size="md" /> : submitText}
    </Button>
  );
};
