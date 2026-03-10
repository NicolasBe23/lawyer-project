import { Input } from "@/components/ui/input";

type MaskType = "phone";

interface InputMaskProps
  extends Omit<React.ComponentProps<"input">, "onChange" | "value"> {
  maskType: MaskType;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const applyPhoneMask = (rawValue: string) => {
  const digits = rawValue.replace(/\D/g, "").slice(0, 11);

  if (digits.length <= 2) {
    return digits;
  }

  if (digits.length <= 6) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }

  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
};

const applyMask = (maskType: MaskType, value: string) => {
  if (maskType === "phone") {
    return applyPhoneMask(value);
  }

  return value;
};

export function InputMask({
  maskType,
  value,
  onChange,
  ...props
}: InputMaskProps) {
  return (
    <Input
      {...props}
      value={applyMask(maskType, value)}
      onChange={(event) => {
        const maskedValue = applyMask(maskType, event.target.value);
        onChange({
          ...event,
          target: {
            ...event.target,
            value: maskedValue,
          },
          currentTarget: {
            ...event.currentTarget,
            value: maskedValue,
          },
        } as React.ChangeEvent<HTMLInputElement>);
      }}
    />
  );
}
