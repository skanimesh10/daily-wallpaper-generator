import { ImageResponse } from "next/og";
import { parseAccentColor } from "@/lib/accent-color";
import { validateMobileWallpaperSize } from "@/lib/device-presets";
import { parseGoalFromSearchParams } from "@/lib/goal";
import { WallpaperGrid } from "@/lib/wallpaper-grid";

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const width = Number(searchParams.get("width")) || 1179;
  const height = Number(searchParams.get("height")) || 2556;
  const accentColor = parseAccentColor(searchParams.get("accent"));

  const sizeCheck = validateMobileWallpaperSize(width, height);
  if (!sizeCheck.ok) {
    return new Response(sizeCheck.error, { status: 400 });
  }

  const goal = parseGoalFromSearchParams(searchParams);

  if ("error" in goal) {
    return new Response(goal.error, { status: 400 });
  }

  return new ImageResponse(
    <WallpaperGrid
      width={width}
      height={height}
      totalDays={goal.totalDays}
      daysPassed={goal.daysPassed}
      headerText={goal.title}
      subtitleText={goal.subtitle}
      daysLeft={goal.daysLeft}
      percentage={goal.percentage}
      accentColor={accentColor}
    />,
    { width, height },
  );
}
