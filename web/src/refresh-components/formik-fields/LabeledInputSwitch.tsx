"use client";

import { useField } from "formik";
import {
  FieldLabel,
  FieldError,
} from "@/refresh-components/formik-fields/helpers";
import { Switch } from "@/components/ui/switch";

interface LabeledInputSwitchProps {
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
}: LabeledInputSwitchProps) {
  const [field, meta, helpers] = useField<boolean>(name);

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
        <Switch
          checked={!!field.value}
          onCheckedChange={(checked) => helpers.setValue(checked)}
        />
      </div>

      {/* Error Message */}
      <FieldError error={hasError ? meta.error : undefined} />
    </div>
  );
}
