"use client";

import { useField } from "formik";
import InputTypeIn, {
  InputTypeInProps,
} from "@/refresh-components/inputs/InputTypeIn";
import Text from "@/refresh-components/texts/Text";

interface LabeledInputTypeInProps
  extends Omit<InputTypeInProps, "value" | "onChange" | "onClear"> {
  name: string;
  label: string;
  optional?: boolean;
}

export default function LabeledInputTypeIn({
  name,
  label,
  optional,
  ...inputProps
}: LabeledInputTypeInProps) {
  const [field, meta, helpers] = useField(name);

  const hasError = meta.touched && meta.error;

  return (
    <div className="w-full flex flex-col gap-1">
      {/* Label */}
      <label htmlFor={name} className="flex flex-row gap-1.5">
        <Text mainUiAction text04>
          {label}
        </Text>
        {optional && (
          <Text text03 mainUiMuted as="span">
            {" (Optional)"}
          </Text>
        )}
      </label>

      {/* Input */}
      <InputTypeIn
        {...inputProps}
        id={name}
        value={field.value || ""}
        onChange={(e) => {
          helpers.setValue(e.target.value);
        }}
        onClear={() => {
          helpers.setValue("");
        }}
        isError={!!hasError}
      />

      {/* Error Message */}
      {hasError && (
        <Text
          secondaryBody
          as="div"
          className="text-status-error-05"
          role="alert"
        >
          {meta.error}
        </Text>
      )}
    </div>
  );
}
