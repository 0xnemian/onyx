import SvgXOctagon from "@/icons/x-octagon";
import Text from "@/refresh-components/texts/Text";

interface FieldLabelProps {
  name: string;
  label: string;
  optional?: boolean;
  description?: string;
}

export function FieldLabel({
  name,
  label,
  optional,
  description,
}: FieldLabelProps) {
  return (
    <label htmlFor={name} className="flex flex-col gap-0.5">
      <div className="flex flex-row gap-1.5">
        <Text mainUiAction text04>
          {label}
        </Text>
        {optional && (
          <Text text03 mainUiMuted as="span">
            {" (Optional)"}
          </Text>
        )}
      </div>
      {description && (
        <Text secondaryBody text03>
          {description}
        </Text>
      )}
    </label>
  );
}

interface FieldErrorProps {
  error?: string;
}

export function FieldError({ error }: FieldErrorProps) {
  if (!error) return null;

  return (
    <div className="flex flex-row items-center gap-1 px-1">
      <SvgXOctagon className="w-[0.75rem] h-[0.75rem] stroke-status-error-05" />
      <Text secondaryBody className="text-status-error-05" role="alert">
        {error}
      </Text>
    </div>
  );
}
