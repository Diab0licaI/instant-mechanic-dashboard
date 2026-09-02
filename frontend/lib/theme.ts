// Shared design tokens — Instant Mechanic admin dashboard.
// Red is the brand accent and is spent in one place per surface (hero metric,
// primary chart, active nav state). Everything else stays quiet: steel / moss / ember / ink.

export const PAPER = "#FAFAF9";
export const INK = "#1A1A1A";
export const INK_MUTED = "#71706B";
export const LINE = "#E7E4DD";
export const RED = "#E0402A";
export const RED_TINT = "#FBE4DE";
export const RED_DEEP = "#A82C1A";
export const STEEL = "#4A5568";
export const EMBER = "#E08A2E";
export const MOSS = "#3F8361";

export const monoTick = {
  fill: INK_MUTED,
  fontSize: 11,
  fontFamily: "var(--font-mono, monospace)",
};

export const BOOKING_STATUS_STYLE: Record<string, { label: string; color: string }> = {
  completed: { label: "Completed", color: MOSS },
  pending: { label: "Pending", color: EMBER },
  "in progress": { label: "In progress", color: STEEL },
  "in-progress": { label: "In progress", color: STEEL },
  cancelled: { label: "Cancelled", color: INK_MUTED },
};

export const MECHANIC_STATUS_STYLE: Record<string, { label: string; color: string }> = {
  available: { label: "Available", color: MOSS },
  "on-job": { label: "On job", color: EMBER },
  busy: { label: "On job", color: EMBER },
  offline: { label: "Offline", color: INK_MUTED },
};