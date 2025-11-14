"use client";

import { useField } from "formik";
import InputTypeIn, {
  InputTypeInProps,
} from "@/refresh-components/inputs/InputTypeIn";
import { FieldError } from "@/refresh-components/formik-fields/helpers";
import IconButton from "@/refresh-components/buttons/IconButton";
import SvgMinusCircle from "@/icons/minus-circle";

export interface UnlabeledInputTypeInElementProps
  extends Omit<InputTypeInProps, "value" | "onChange" | "onClear"> {
  name: string;
  onRemove?: () => void;
}

// This component should be used inside of a list in `formik`'s "Form" context.
export default function UnlabeledInputTypeInElement({
  name,
  onRemove,
  ...inputProps
}: UnlabeledInputTypeInElementProps) {
  const [field, meta] = useField(name);
  const hasError = meta.touched && meta.error;
  const isEmpty = !field.value || field.value.trim() === "";

  return (
    <div className="w-full flex flex-col gap-1">
      <div className="flex flex-row items-center gap-1">
        {/* Input */}
        <InputTypeIn
          {...inputProps}
          id={name}
          name={name}
          value={field.value || ""}
          onChange={field.onChange}
          onBlur={field.onBlur}
          erroneous={!!hasError}
          showClearButton={false}
        />
        <IconButton
          icon={SvgMinusCircle}
          tertiary
          disabled={!onRemove || isEmpty}
          onClick={onRemove}
          tooltip="Remove"
        />
      </div>

      {/* Error Message */}
      <FieldError error={hasError ? meta.error : undefined} />
    </div>
  );
}
