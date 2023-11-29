"use client";

import { TextareaHTMLAttributes } from "react";
import { useFormContext } from "react-hook-form";
import cx from "classnames";

import InputLabel from "./input-label";

type ITextareaFieldProps = Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  "className"
> & {
  label: string;
  fieldName: string;
  isRequired?: boolean;
};

export default function TextareaField(props: ITextareaFieldProps) {
  const { label, fieldName, isRequired, ...textareaProps } = props;
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext();

  const value = watch(fieldName);
  const isError = errors[fieldName];

  return (
    <div className="relative">
      <InputLabel fieldName={fieldName} isRequired={isRequired} label={label} />
      <textarea
        className={cx(
          "mt-2 h-80 w-full rounded-md border border-gray-300 px-4 py-3 focus:outline-none",
          { "border-red-400": isError },
        )}
        id={fieldName}
        {...register(fieldName)}
        {...textareaProps}
      />
      {textareaProps.maxLength ? (
        //
        //
        <span className="absolute bottom-4 right-4 text-sm text-gray-400">
          {value?.length ?? 0}/{textareaProps.maxLength}
        </span>
      ) : null}
    </div>
  );
}
