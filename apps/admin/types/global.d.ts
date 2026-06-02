import type { ComponentProps, JSX } from "react";

type IconPlaceholderProps = {
	hugeicons?: string;
	lucide?: string;
	phosphor?: string;
	remixicon?: string;
	tabler?: string;
} & Omit<ComponentProps<"svg">, "ref">;

declare function IconPlaceholder(
	props: IconPlaceholderProps,
): JSX.Element | null;
