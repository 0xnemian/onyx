"use client";

import { useField } from "formik";
import {
  FieldLabel,
  FieldError,
} from "@/refresh-components/formik-fields/helpers";
import { SwitchProps } from "@/refresh-components/inputs/Switch";
import UnlabeledSwitchField from "@/refresh-components/formik-fields/UnlabeledSwitchField";

interface LabeledInputSwitchProps extends Omit<SwitchProps, "checked"> {
  name: string;
  label: string;
  description?: string;
  optional?: boolean;
}

export default function LabeledInputSwitch({
  name,
  label,
  description,
  optional,
  ...props
}: LabeledInputSwitchProps) {
  const [, meta] = useField<boolean>(name);
  const hasError = meta.touched && meta.error;

  return (
    <div className="w-full flex flex-col gap-1">
      {/* Label and Switch Row */}
      <div className="flex flex-row items-center justify-between gap-4">
        {/* Left side: Label */}
        <FieldLabel
          name={name}
          label={label}
          description={description}
          optional={optional}
        />

        {/* Right side: Switch */}
        <UnlabeledSwitchField name={name} {...props} />
      </div>

      {/* Error Message */}
      <FieldError error={hasError ? meta.error : undefined} />
    </div>
  );
}
