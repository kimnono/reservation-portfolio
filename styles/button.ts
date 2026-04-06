export const button = {
  primary:
    "inline-flex items-center justify-center rounded-full bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground transition hover:opacity-92 disabled:cursor-not-allowed disabled:opacity-70",
  ghost:
    "inline-flex items-center justify-center rounded-full border border-border bg-white px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-70",
  primaryWide:
    "inline-flex min-w-40 items-center justify-center rounded-full bg-accent px-5 py-3 font-semibold text-accent-foreground transition hover:opacity-92 disabled:cursor-not-allowed disabled:opacity-70",
  secondaryTile:
    "rounded-[22px] border border-border bg-surface-muted px-4 py-4 text-left transition hover:border-accent hover:bg-accent/5",
} as const;
