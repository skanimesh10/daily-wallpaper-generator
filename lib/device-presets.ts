export type DevicePreset = {
  name: string;
  w: number;
  h: number;
};

/** Portrait phone wallpapers only — iPhone 13 through latest. */
export const IPHONE_PRESETS: DevicePreset[] = [
  { name: "iPhone 17 Pro Max", w: 1320, h: 2868 },
  { name: "iPhone 17 Pro", w: 1206, h: 2622 },
  { name: "iPhone 17", w: 1206, h: 2622 },
  { name: "iPhone 16 Pro Max", w: 1320, h: 2868 },
  { name: "iPhone 16 Pro", w: 1206, h: 2622 },
  { name: "iPhone 16 Plus", w: 1290, h: 2796 },
  { name: "iPhone 16", w: 1179, h: 2556 },
  { name: "iPhone 15 Pro Max", w: 1290, h: 2796 },
  { name: "iPhone 15 Pro", w: 1179, h: 2556 },
  { name: "iPhone 15 Plus", w: 1290, h: 2796 },
  { name: "iPhone 15", w: 1179, h: 2556 },
  { name: "iPhone 14 Pro Max", w: 1290, h: 2796 },
  { name: "iPhone 14 Pro", w: 1179, h: 2556 },
  { name: "iPhone 14 Plus", w: 1284, h: 2778 },
  { name: "iPhone 14", w: 1170, h: 2532 },
  { name: "iPhone 13 Pro Max", w: 1284, h: 2778 },
  { name: "iPhone 13 Pro", w: 1170, h: 2532 },
  { name: "iPhone 13", w: 1170, h: 2532 },
  { name: "iPhone 13 mini", w: 1080, h: 2340 },
];

export const ANDROID_PRESETS: DevicePreset[] = [
  { name: "Android (1080p)", w: 1080, h: 2400 },
];

export const DEVICE_PRESETS: DevicePreset[] = [
  ...IPHONE_PRESETS,
  ...ANDROID_PRESETS,
];

export const DEFAULT_DEVICE_PRESET =
  IPHONE_PRESETS.find((p) => p.name === "iPhone 15 Pro") ?? IPHONE_PRESETS[0];

export const WALLPAPER_UNSUPPORTED_MESSAGE =
  "This wallpaper can't be generated for desktop or non-phone sizes. Choose an iPhone preset (or another portrait phone resolution).";

const MIN_WIDTH = 640;
const MAX_WIDTH = 1600;
const MIN_HEIGHT = 1136;
const MAX_HEIGHT = 3200;
const MIN_ASPECT = 1.5;
const MAX_ASPECT = 2.6;

export function isSupportedMobileWallpaperSize(
  width: number,
  height: number,
): boolean {
  if (
    !Number.isFinite(width) ||
    !Number.isFinite(height) ||
    width < 1 ||
    height < 1
  ) {
    return false;
  }

  // Portrait phones only — reject landscape/desktop (e.g. 3840×2160).
  if (width >= height) return false;
  if (width < MIN_WIDTH || width > MAX_WIDTH) return false;
  if (height < MIN_HEIGHT || height > MAX_HEIGHT) return false;

  const aspect = height / width;
  return aspect >= MIN_ASPECT && aspect <= MAX_ASPECT;
}

export function validateMobileWallpaperSize(
  width: number,
  height: number,
): { ok: true } | { ok: false; error: string } {
  if (isSupportedMobileWallpaperSize(width, height)) {
    return { ok: true };
  }
  return { ok: false, error: WALLPAPER_UNSUPPORTED_MESSAGE };
}
