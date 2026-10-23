export interface StatusConfig {
  label: string;
  textColor: string;
  bgColor: string;
  borderColor: string;
  dotColor: string;
}

export interface PriorityConfig {
  label: string;
  textColor: string;
  bgColor: string;
  borderColor: string;
  dotColor: string;
}

/**
 * Maps status API values to display label and badge styling according to specs.
 */
export const getStatusConfig = (status?: string | null): StatusConfig => {
  if (!status) {
    return {
      label: "Unknown",
      textColor: "text-slate-600",
      bgColor: "bg-slate-100",
      borderColor: "border-slate-200",
      dotColor: "#64748B",
    };
  }

  const key = status.toLowerCase().trim().replace(/[-\s]+/g, "_");

  switch (key) {
    case "todo":
    case "to_do":
      return {
        label: "Todo",
        textColor: "text-slate-700",
        bgColor: "bg-slate-100",
        borderColor: "border-slate-200",
        dotColor: "#64748B",
      };
    case "in_progress":
      return {
        label: "In Progress",
        textColor: "text-blue-700",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
        dotColor: "#2563EB",
      };
    case "blocked":
      return {
        label: "Blocked",
        textColor: "text-red-700",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        dotColor: "#DC2626",
      };
    case "in_review":
      return {
        label: "In Review",
        textColor: "text-purple-700",
        bgColor: "bg-purple-50",
        borderColor: "border-purple-200",
        dotColor: "#9333EA",
      };
    case "ready_for_qa":
      return {
        label: "Ready for QA",
        textColor: "text-orange-700",
        bgColor: "bg-orange-50",
        borderColor: "border-orange-200",
        dotColor: "#EA580C",
      };
    case "reopened":
      return {
        label: "Reopened",
        textColor: "text-red-700",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        dotColor: "#E11D48",
      };
    case "ready_for_prod":
    case "ready_for_production":
      return {
        label: "Ready for Prod",
        textColor: "text-blue-700",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
        dotColor: "#0284C7",
      };
    case "done":
      return {
        label: "Done",
        textColor: "text-emerald-700",
        bgColor: "bg-emerald-50",
        borderColor: "border-emerald-200",
        dotColor: "#16A34A",
      };
    default: {
      const words = key
        .split("_")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1));
      return {
        label: words.join(" ") || status,
        textColor: "text-slate-700",
        bgColor: "bg-slate-100",
        borderColor: "border-slate-200",
        dotColor: "#64748B",
      };
    }
  }
};

/**
 * Maps priority API values to display label and badge styling.
 */
export const getPriorityConfig = (priority?: string | null): PriorityConfig => {
  if (!priority) {
    return {
      label: "Normal",
      textColor: "text-slate-600",
      bgColor: "bg-slate-100",
      borderColor: "border-slate-200",
      dotColor: "#64748B",
    };
  }

  const key = priority.toLowerCase().trim().replace(/[-\s]+/g, "_");

  switch (key) {
    case "high":
    case "urgent":
      return {
        label: "High",
        textColor: "text-red-700",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        dotColor: "#DC2626",
      };
    case "medium":
      return {
        label: "Medium",
        textColor: "text-amber-700",
        bgColor: "bg-amber-50",
        borderColor: "border-amber-200",
        dotColor: "#D97706",
      };
    case "low":
      return {
        label: "Low",
        textColor: "text-emerald-700",
        bgColor: "bg-emerald-50",
        borderColor: "border-emerald-200",
        dotColor: "#16A34A",
      };
    default: {
      const words = key
        .split("_")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1));
      return {
        label: words.join(" ") || priority,
        textColor: "text-slate-700",
        bgColor: "bg-slate-100",
        borderColor: "border-slate-200",
        dotColor: "#64748B",
      };
    }
  }
};

/**
 * Formats a date string into "Oct 15, 2025" using UTC timezone.
 * Handles null, undefined, empty strings, and invalid date formats gracefully.
 */
export const formatTaskDate = (dateStr?: string | null): string => {
  if (!dateStr || typeof dateStr !== "string" || !dateStr.trim()) {
    return "—";
  }

  const trimmed = dateStr.trim();

  // If format is date-only YYYY-MM-DD
  const dateOnlyMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
  if (dateOnlyMatch) {
    const year = parseInt(dateOnlyMatch[1], 10);
    const monthIndex = parseInt(dateOnlyMatch[2], 10) - 1;
    const day = parseInt(dateOnlyMatch[3], 10);

    const d = new Date(Date.UTC(year, monthIndex, day));
    if (isNaN(d.getTime())) return "—";

    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    }).format(d);
  }

  const d = new Date(trimmed);
  if (isNaN(d.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(d);
};
