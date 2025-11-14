"use client";

import { useField } from "formik";
import InputTextArea, {
  InputTextAreaProps,
} from "@/refresh-components/inputs/InputTextArea";
import {
  FieldLabel,
  FieldError,
} from "@/refresh-components/formik-fields/helpers";

interface LabeledInputTextAreaProps
  extends Omit<InputTextAreaProps, "value" | "onChange"> {
  name: string;
  label: string;
  optional?: boolean;
  description?: string;
}

export default function LabeledInputTextArea({
  name,
  label,
  optional,
  description,
  ...textareaProps
}: LabeledInputTextAreaProps) {
  const [field, meta] = useField(name);

  const hasError = meta.touched && meta.error;

  return (
    <div className="w-full flex flex-col gap-1">
      {/* Label */}
      <FieldLabel
        name={name}
        label={label}
        optional={optional}
        description={description}
      />

      {/* Textarea */}
      <InputTextArea
        {...textareaProps}
        id={name}
        name={name}
        value={field.value || ""}
        onChange={(e) => {
          field.onChange(e);
        }}
        onBlur={field.onBlur}
        isError={!!hasError}
      />

      {/* Error Message */}
      <FieldError error={hasError ? meta.error : undefined} />
    </div>
  );
}
