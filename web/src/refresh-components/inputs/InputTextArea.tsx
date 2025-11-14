"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useBoundingBox } from "@/hooks/useBoundingBox";

const divClasses = (active?: boolean, hovered?: boolean, isError?: boolean) =>
  ({
    defaulted: [
      "border",
      isError && "!border-status-error-05",
      !isError && hovered && "border-border-02",
      !isError && active && "border-border-05",
    ],
    internal: [],
    disabled: ["bg-background-neutral-03"],
  }) as const;

const textareaClasses = (active?: boolean) =>
  ({
    defaulted: [
      "text-text-04 placeholder:!font-secondary-body placeholder:text-text-02",
    ],
    internal: [],
    disabled: ["text-text-02"],
  }) as const;

export interface InputTextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  // Input states:
  active?: boolean;
  internal?: boolean;
  disabled?: boolean;
  isError?: boolean;

  placeholder?: string;

  // Minimum number of rows
  minRows?: number;
}

function InputTextAreaInner(
  {
    active,
    internal,
    disabled,
    isError,

    placeholder,
    className,
    value,
    onChange,
    minRows = 3,
    ...props
  }: InputTextAreaProps,
  ref: React.ForwardedRef<HTMLTextAreaElement>
) {
  const { ref: boundingBoxRef, inside: hovered } = useBoundingBox();
  const [localActive, setLocalActive] = useState(active);
  const localRef = useRef<HTMLTextAreaElement>(null);

  // Use forwarded ref if provided, otherwise use local ref
  const textareaRef = ref || localRef;

  const state = internal ? "internal" : disabled ? "disabled" : "defaulted";

  useEffect(() => {
    // if disabled, set cursor to "not-allowed"
    if (disabled && hovered) {
      document.body.style.cursor = "not-allowed";
    } else if (!disabled && hovered) {
      document.body.style.cursor = "text";
    } else {
      document.body.style.cursor = "default";
    }
  }, [disabled, hovered]);

  return (
    <div
      ref={boundingBoxRef}
      className={cn(
        "flex flex-row items-start justify-between w-full h-fit p-1.5 rounded-08 bg-background-neutral-00 relative",
        divClasses(localActive, hovered, isError)[state],
        className
      )}
      onClick={() => {
        if (
          hovered &&
          textareaRef &&
          typeof textareaRef === "object" &&
          textareaRef.current
        ) {
          textareaRef.current.focus();
        }
      }}
    >
      <textarea
        ref={textareaRef}
        placeholder={placeholder}
        disabled={disabled}
        value={value}
        onChange={onChange}
        rows={minRows}
        className={cn(
          "w-full min-h-[3rem] bg-transparent p-0.5 focus:outline-none resize-y",
          textareaClasses(localActive)[state]
        )}
        {...props}
        // Override the onFocus and onBlur props to set the local active state
        onFocus={(e) => {
          setLocalActive(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setLocalActive(false);
          props.onBlur?.(e);
        }}
      />
    </div>
  );
}

const InputTextArea = React.forwardRef(InputTextAreaInner);
InputTextArea.displayName = "InputTextArea";

export default InputTextArea;
