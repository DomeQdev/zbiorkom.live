import useThemeStore from "@/hooks/useThemeStore";
import { ColorRole, generateDarkScheme } from "material-color-lite";
import { useMemo } from "react";

// Material Design 3 tonal roles used across the "Co wyjechało?" view. Derived from the
// user's theme colour so the whole feature stays in palette instead of hardcoded greys.
const roles = [
    ColorRole.Background,
    ColorRole.Primary,
    ColorRole.OnPrimary,
    ColorRole.PrimaryContainer,
    ColorRole.OnPrimaryContainer,
    ColorRole.SecondaryContainer,
    ColorRole.OnSecondaryContainer,
    ColorRole.Tertiary,
    ColorRole.TertiaryContainer,
    ColorRole.OnTertiaryContainer,
    ColorRole.Surface,
    ColorRole.OnSurface,
    ColorRole.SurfaceVariant,
    ColorRole.OnSurfaceVariant,
    ColorRole.Outline,
    ColorRole.OutlineVariant,
    ColorRole.InverseOnSurface,
    ColorRole.InversePrimary,
] as const;

export type ExecutionScheme = Record<(typeof roles)[number], string>;

export default (): ExecutionScheme => {
    const color = useThemeStore((state) => state.color);
    return useMemo(() => generateDarkScheme(color, roles), [color]);
};

// Delay is reported in seconds (positive = late, negative = early). Rounded to whole
// minutes for display — sub-minute deviations read as punctual, matching the API docs.
export type DelayStatus = "onTime" | "delayed" | "early";

export const DELAY_COLORS: Record<DelayStatus, string> = {
    onTime: "hsl(145, 63%, 55%)",
    delayed: "hsl(0, 85%, 70%)",
    early: "hsl(35, 95%, 60%)",
};

export const getDelayInfo = (seconds: number) => {
    const minutes = Math.round(seconds / 60);
    const status: DelayStatus = minutes === 0 ? "onTime" : minutes > 0 ? "delayed" : "early";

    return { status, minutes: Math.abs(minutes), color: DELAY_COLORS[status] };
};
