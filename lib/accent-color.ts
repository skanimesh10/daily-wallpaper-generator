export const DEFAULT_ACCENT_ID = "teal";

export type AccentPreset = {
  id: string;
  name: string;
  hex: string;
};

export const ACCENT_PRESETS: AccentPreset[] = [
  { id: "teal", name: "Teal", hex: "#14b8a6" },
  { id: "blue", name: "Blue", hex: "#3b82f6" },
  { id: "purple", name: "Purple", hex: "#a855f7" },
  { id: "pink", name: "Pink", hex: "#ec4899" },
  { id: "orange", name: "Orange", hex: "#f97316" },
  { id: "green", name: "Green", hex: "#22c55e" },
  { id: "red", name: "Red", hex: "#ef4444" },
  { id: "amber", name: "Amber", hex: "#f59e0b" },
];

export const DEFAULT_ACCENT_HEX =
  ACCENT_PRESETS.find((preset) => preset.id === DEFAULT_ACCENT_ID)?.hex ??
  "#14b8a6";

export function parseAccentColor(param: string | null): string {
  if (!param) return DEFAULT_ACCENT_HEX;

  const preset = ACCENT_PRESETS.find(
    (item) => item.id === param.toLowerCase(),
  );
  if (preset) return preset.hex;

  let hex = param.trim();
  if (!hex.startsWith("#")) hex = `#${hex}`;
  if (/^#[0-9a-fA-F]{6}$/.test(hex)) return hex.toLowerCase();

  return DEFAULT_ACCENT_HEX;
}

export function accentToQueryValue(accentId: string, customHex: string): string {
  if (accentId === "custom") {
    return customHex.replace("#", "");
  }
  return accentId;
}

export function resolveAccentHex(accentId: string, customHex: string): string {
  if (accentId === "custom") {
    return parseAccentColor(customHex);
  }

  return (
    ACCENT_PRESETS.find((preset) => preset.id === accentId)?.hex ??
    DEFAULT_ACCENT_HEX
  );
}

export function hexToRgba(hex: string, alpha: number): string {
  const normalized = parseAccentColor(hex).replace("#", "");
  const r = Number.parseInt(normalized.slice(0, 2), 16);
  const g = Number.parseInt(normalized.slice(2, 4), 16);
  const b = Number.parseInt(normalized.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
