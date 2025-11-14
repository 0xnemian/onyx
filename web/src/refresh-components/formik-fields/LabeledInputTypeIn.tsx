"use client";

import { useField } from "formik";
import InputTypeIn, {
  InputTypeInProps,
} from "@/refresh-components/inputs/InputTypeIn";
import {
  FieldLabel,
  FieldError,
} from "@/refresh-components/formik-fields/helpers";

export interface LabeledInputTypeInProps
  extends Omit<InputTypeInProps, "value" | "onChange" | "onClear"> {
  name: string;
  label: string;
  optional?: boolean;
  description?: string;
}

export default function LabeledInputTypeIn({
  name,
  label,
  optional,
  description,
  ...inputProps
}: LabeledInputTypeInProps) {
  const [field, meta, helpers] = useField(name);
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

      {/* Input */}
      <InputTypeIn
        {...inputProps}
        id={name}
        name={name}
        value={field.value || ""}
        onChange={field.onChange}
        onBlur={field.onBlur}
        onClear={() => {
          helpers.setValue("");
        }}
        erroneous={!!hasError}
      />

      {/* Error Message */}
      <FieldError error={hasError ? meta.error : undefined} />
    </div>
  );
}
