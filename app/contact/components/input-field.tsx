"use client";

import { InputHTMLAttributes } from "react";
import { useFormContext } from "react-hook-form";
import cx from "classnames";

import InputLabel from "./input-label";

type IInputFieldProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "className"
> & {
  label: string;
  fieldName: string;
  isRequired?: boolean;
};

export default function InputField(props: IInputFieldProps) {
  const { label, fieldName, isRequired, ...inputProps } = props;
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const isError = errors[fieldName];

  return (
    <div>
      <InputLabel fieldName={fieldName} isRequired={isRequired} label={label} />
      <input
        className={cx(
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
