"use client";

import { InputHTMLAttributes } from "react";
import { useFormContext } from "react-hook-form";

import { cn } from "@/lib/utils";

import { Input } from "@/components/ui/input";

import { InputLabel } from "@/components/input-label";

type IInputFieldProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "className"
> & {
  label: string;
  fieldName: string;
  isRequired?: boolean;
};

function InputField(props: IInputFieldProps) {
  const { label, fieldName, isRequired, ...inputProps } = props;
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const isError = errors[fieldName];

  return (
    <div>
      <InputLabel fieldName={fieldName} isRequired={isRequired} label={label} />
      <Input
        className={cn(
          "mt-2 w-full rounded-md border border-gray-300 px-4 py-3 focus:outline-none",
          { "border-red-400": isError },
        )}
        id={fieldName}
        {...register(fieldName)}
        {...inputProps}
      />
    </div>
  );
}
InputField.displayName = "InputField";

export { InputField };
