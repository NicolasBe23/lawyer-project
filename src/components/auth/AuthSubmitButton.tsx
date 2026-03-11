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
      className="w-full bg-gray-900 hover:bg-gray-800 cursor-pointer"
      disabled={loading}
    >
      {loading ? <Loading text={loadingText} size="md" /> : submitText}
    </Button>
  );
};
