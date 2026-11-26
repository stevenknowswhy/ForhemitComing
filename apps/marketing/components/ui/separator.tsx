// Dependency-free separator: marketing does not carry @radix-ui/react-separator,
// and OD-11 forbids new npm dependencies. Same API as the Radix primitive.
import * as React from "react";

import { cn } from "@/lib/utils";

type SeparatorOrientation = "horizontal" | "vertical";

interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
	orientation?: SeparatorOrientation;
	decorative?: boolean;
}

const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
	(
		{ className, orientation = "horizontal", decorative = true, ...props },
		ref,
	) => (
		<div
			ref={ref}
			role={decorative ? "none" : "separator"}
			aria-orientation={decorative ? undefined : orientation}
			className={cn(
				"shrink-0 bg-border",
				orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
				className,
			)}
			{...props}
		/>
	),
);
Separator.displayName = "Separator";

export { Separator };
