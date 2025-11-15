"use client";

import { useState } from "react";
import Text from "@/refresh-components/texts/Text";
import IconButton from "@/refresh-components/buttons/IconButton";
import SvgFold from "@/icons/fold";
import SvgExpand from "@/icons/expand";
import { cn, noProp } from "@/lib/utils";
import { useBoundingBox } from "@/hooks/useBoundingBox";

interface CollapsibleSectionProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  defaultExpanded?: boolean;
}

export default function CollapsibleSection({
  title,
  description,
  children,
  defaultExpanded = true,
}: CollapsibleSectionProps) {
  const { ref, inside } = useBoundingBox();
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="w-full flex flex-col group/CollapsibleSection">
      {/* Header */}
      <div
        className="flex flex-row items-center justify-between gap-4 cursor-pointer select-none"
        onClick={() => setIsExpanded(!isExpanded)}
        ref={ref}
      >
        {/* Left side: Title and Description */}
        <div className="flex flex-col gap-0.5">
          <Text mainUiAction text04>
            {title}
          </Text>
          {description && (
            <Text secondaryBody text03>
              {description}
            </Text>
          )}
        </div>

        {/* Right side: Toggle button */}
        <IconButton
          icon={isExpanded ? SvgFold : SvgExpand}
          internal
          onClick={noProp(() => setIsExpanded(!isExpanded))}
          tooltip={isExpanded ? "Collapse" : "Expand"}
          transient={inside}
        />
      </div>

      {/* Children with animation */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          isExpanded
            ? "max-h-screen opacity-100 pt-4 translate-y-0"
            : "max-h-0 opacity-0 pt-0 -translate-y-2"
        )}
      >
        {children}
      </div>
    </div>
  );
}
