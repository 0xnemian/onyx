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
    <div className="flex flex-col gap-1 h-full w-full">
      {/* Label and Switch Row */}
      <label
        htmlFor={name}
        className="flex flex-row items-start justify-between gap-4 cursor-pointer"
      >
        {/* Left side: Label */}
        <div className="w-[70%]">
          <FieldLabel
            name={name}
            label={label}
            description={description}
            optional={optional}
          />
        </div>

        {/* Right side: Switch */}
        <UnlabeledSwitchField name={name} id={name} {...props} />
      </label>

      {/* Error Message */}
      <FieldError error={hasError ? meta.error : undefined} />
    </div>
  );
}
