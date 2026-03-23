"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Filter } from "lucide-react";
import { useTranslations } from "next-intl";
import { ListFilterDropdownProps } from "@/types/types";

export const ListFilterDropdown = <T extends string>({
  value,
  options,
  onChange,
}: ListFilterDropdownProps<T>) => {
  const t = useTranslations();

  const currentOption = options.find((option) => option.value === value);
  const currentLabel = currentOption?.label ?? options[0]?.label ?? "";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="w-full cursor-pointer justify-between md:w-auto"
        >
          <Filter className="w-4 h-4 mr-2" />
          {t("common.filters")}: {currentLabel}
          <ChevronDown className="w-4 h-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {options.map((option) => (
          <DropdownMenuItem
            key={option.value}
            className="cursor-pointer"
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
