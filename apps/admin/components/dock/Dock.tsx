"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import type { LucideIcon } from "lucide-react";
import { useClickOutside } from "@/hooks/use-click-outside";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface DockSubItem {
	label: string;
	href: string;
	icon: LucideIcon;
	badge?: number;
}

export interface DockTabItem {
	id: string;
	label: string;
	icon: LucideIcon;
	/** Direct link — no popup menu. */
	href?: string;
	/** Aggregate badge count on the dock icon. */
	badge?: number;
	/** Sub-items rendered in an upward popup. */
	subItems?: DockSubItem[];
}

interface DockProps {
	items: DockTabItem[];
}

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */

/** Icon → icon+label morph (ExpandableTabs pattern) */
const buttonVariants = {
	initial: { gap: 0, paddingLeft: "0.5rem", paddingRight: "0.5rem" },
	animate: (isSelected: boolean) => ({
		gap: isSelected ? "0.5rem" : 0,
		paddingLeft: isSelected ? "1rem" : "0.5rem",
		paddingRight: isSelected ? "1rem" : "0.5rem",
	}),
};

const labelVariants = {
	initial: { width: 0, opacity: 0 },
	animate: { width: "auto", opacity: 1 },
	exit: { width: 0, opacity: 0 },
};

/** Gentle fade + slide up — no scale pop */
const menuVariants = {
	initial: { opacity: 0, y: 6 },
	animate: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.35,
			ease: [0.25, 0.1, 0.25, 1] as const,
			staggerChildren: 0.04,
			delayChildren: 0.08,
		},
	},
	exit: {
		opacity: 0,
		y: 4,
		transition: { duration: 0.22, ease: "easeIn" as const },
	},
};

const menuItemVariants = {
	initial: { opacity: 0, y: 4 },
	animate: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.25, ease: "easeOut" as const },
	},
	exit: { opacity: 0, transition: { duration: 0.1 } },
};

const expandSpring = {
	delay: 0.1,
	type: "spring" as const,
	bounce: 0,
	duration: 0.6,
};

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

/** How long (ms) the menu stays open after the mouse leaves the dock
 *  item or menu. Gives the user time to cross the gap between button
 *  and popup. */
const CLOSE_DELAY = 200;

/* ------------------------------------------------------------------ */
/*  Dock                                                               */
/* ------------------------------------------------------------------ */

export function Dock({ items }: DockProps) {
	const [hoverIndex, setHoverIndex] = React.useState<number | null>(null);
	const [lockedIndex, setLockedIndex] = React.useState<number | null>(null);
	const lockedIndexRef = React.useRef<number | null>(null);
	const dockRef = React.useRef<HTMLDivElement>(null);
	const closeTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(
		null,
	);
	const pathname = usePathname();

	// Keep ref in sync for timer callbacks
	React.useEffect(() => {
		lockedIndexRef.current = lockedIndex;
	}, [lockedIndex]);

	/* ---- close on outside click ---- */
	useClickOutside(dockRef, () => {
		setLockedIndex(null);
		setHoverIndex(null);
		if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
	});

	/* ---- close on Escape ---- */
	React.useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				setLockedIndex(null);
				setHoverIndex(null);
			}
		};
		document.addEventListener("keydown", onKey);
		return () => document.removeEventListener("keydown", onKey);
	}, []);

	/* ---- close on route change ---- */
	React.useEffect(() => {
		setLockedIndex(null);
		setHoverIndex(null);
	}, [pathname]);

	/* ---- helpers ---- */

	const scheduleClose = React.useCallback(() => {
		closeTimerRef.current = setTimeout(() => {
			// Don't clear hover if a menu is locked open
			if (lockedIndexRef.current !== null) return;
			setHoverIndex(null);
		}, CLOSE_DELAY);
	}, []);

	const cancelClose = React.useCallback(() => {
		if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
	}, []);

	/** Menu is visible when hovered OR locked open */
	const isMenuOpen = (index: number) =>
		hoverIndex === index || lockedIndex === index;

	const isItemActive = (item: DockTabItem): boolean => {
		if (item.href) return pathname === item.href;
		return item.subItems?.some((sub) => pathname.startsWith(sub.href)) ?? false;
	};

	/* ---- handlers ---- */

	const handleItemEnter = (index: number) => {
		// If a menu is locked, hover does nothing
		if (lockedIndex !== null) return;
		cancelClose();
		setHoverIndex(index);
	};

	const handleItemLeave = () => {
		scheduleClose();
	};

	const handleMenuEnter = () => {
		cancelClose();
	};

	const handleMenuLeave = () => {
		scheduleClose();
	};

	const handleClick = (index: number, item: DockTabItem) => {
		if (item.subItems?.length) {
			// Toggle lock
			if (lockedIndex === index) {
				setLockedIndex(null);
			} else {
				setLockedIndex(index);
				setHoverIndex(null); // locked takes over
			}
		} else {
			// Direct link — close everything
			setLockedIndex(null);
			setHoverIndex(null);
		}
	};

	/* ---- render ---- */

	return (
		<motion.div
			ref={dockRef}
			className="nav-dock"
			initial={{ y: 80, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			transition={{ delay: 0.15, type: "spring", bounce: 0.15, duration: 0.8 }}
		>
			{items.map((item, index) => {
				const Icon = item.icon;
				const menuOpen = isMenuOpen(index);
				const active = isItemActive(item);
				const hasSubs = (item.subItems?.length ?? 0) > 0;

				return (
					<div
						key={item.id}
						className={`nav-dock-item${active ? " has-active" : ""}`}
						onMouseEnter={() => handleItemEnter(index)}
						onMouseLeave={handleItemLeave}
					>
						{/* ---- Dock Button ---- */}
						{item.href && !hasSubs ? (
							<Link href={item.href} aria-label={item.label}>
								<DockButton
									icon={Icon}
									label={item.label}
									selected={false}
									active={active}
									badge={item.badge}
									onClick={() => handleClick(index, item)}
								/>
							</Link>
						) : (
							<DockButton
								icon={Icon}
								label={item.label}
								selected={menuOpen}
								active={active}
								badge={item.badge}
								onClick={() => handleClick(index, item)}
							/>
						)}

						{/* ---- Popup Menu ---- */}
						<AnimatePresence>
							{menuOpen && hasSubs && (
								<motion.div
									variants={menuVariants}
									initial="initial"
									animate="animate"
									exit="exit"
									className="nav-dock-menu"
									role="menu"
									aria-label={`${item.label} menu`}
									onMouseEnter={handleMenuEnter}
									onMouseLeave={handleMenuLeave}
								>
									{item.subItems!.map((sub) => {
										const SubIcon = sub.icon;
										const subActive = pathname.startsWith(sub.href);
										return (
											<motion.div key={sub.href} variants={menuItemVariants}>
												<Link
													href={sub.href}
													role="menuitem"
													className={`nav-dock-menu-item${subActive ? " active" : ""}`}
												>
													<SubIcon size={18} />
													<span style={{ flex: 1 }}>{sub.label}</span>
													{sub.badge != null && sub.badge > 0 && (
														<span
															className={`nav-dock-menu-badge${subActive ? " on" : " off"}`}
														>
															{sub.badge}
														</span>
													)}
												</Link>
											</motion.div>
										);
									})}
								</motion.div>
							)}
						</AnimatePresence>
					</div>
				);
			})}
		</motion.div>
	);
}

/* ------------------------------------------------------------------ */
/*  DockButton                                                         */
/* ------------------------------------------------------------------ */

interface DockButtonProps {
	icon: LucideIcon;
	label: string;
	selected: boolean;
	active: boolean;
	badge?: number;
	onClick: () => void;
}

function DockButton({
	icon: Icon,
	label,
	selected,
	active,
	badge,
	onClick,
}: DockButtonProps) {
	const isActiveOrSelected = active || selected;

	return (
		<motion.button
			variants={buttonVariants}
			initial={false}
			animate="animate"
			custom={isActiveOrSelected}
			onClick={onClick}
			transition={expandSpring}
			whileHover={{ scale: 1.03 }}
			whileTap={{ scale: 0.97 }}
			className={`nav-dock-btn${isActiveOrSelected ? " active" : ""}`}
			aria-expanded={selected}
			aria-label={label}
		>
			<Icon size={20} strokeWidth={isActiveOrSelected ? 2.2 : 1.75} />
			<AnimatePresence initial={false}>
				{selected && (
					<motion.span
						variants={labelVariants}
						initial="initial"
						animate="animate"
						exit="exit"
						transition={expandSpring}
						style={{ overflow: "hidden", whiteSpace: "nowrap" }}
					>
						{label}
					</motion.span>
				)}
			</AnimatePresence>

			{badge != null && badge > 0 && !selected && (
				<motion.span
					key={badge}
					initial={{ scale: 1.4 }}
					animate={{ scale: 1 }}
					transition={{ type: "spring", stiffness: 400, damping: 15 }}
					className="nav-dock-badge"
				>
					{badge > 99 ? "99+" : badge}
				</motion.span>
			)}
		</motion.button>
	);
}
