"use client";

import { useField } from "formik";
import { Toggle } from "@/components/ui/toggle";
import {
  FieldLabel,
  FieldError,
} from "@/refresh-components/formik-fields/helpers";

interface LabeledInputToggleProps {
  name: string;
  label: string;
  description?: string;
  optional?: boolean;
}

export default function LabeledInputToggle({
  name,
  label,
  description,
  optional,
}: LabeledInputToggleProps) {
  const [field, meta, helpers] = useField<boolean>(name);

  const hasError = meta.touched && meta.error;

  return (
    <div className="w-full flex flex-col gap-1">
      {/* Label and Toggle Row */}
      <div className="flex flex-row items-center justify-between gap-4">
        {/* Left side: Label */}
        <FieldLabel
          name={name}
          label={label}
          description={description}
          optional={optional}
        />

        {/* Right side: Toggle */}
        <Toggle
          isEnabled={!!field.value}
          onClick={() => helpers.setValue(!field.value)}
          ariaLabel={label}
          className="w-11 h-6 rounded-full"
          enabledClassName="bg-action-link-05"
          disabledClassName="bg-background-neutral-03"
          thumbBaseClassName="top-0.5 left-0.5 w-5 h-5 rounded-full bg-white"
          enabledThumbClassName="translate-x-5"
          disabledThumbClassName="translate-x-0"
        />
      </div>

      {/* Error Message */}
      <FieldError error={hasError ? meta.error : undefined} />
    </div>
  );
}
