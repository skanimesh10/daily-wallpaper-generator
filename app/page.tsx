"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Calendar, Target, ExternalLink } from "lucide-react";
import {
  addDays,
  buildCalendarWallpaperPath,
  buildGoalWallpaperPath,
  formatDate,
  parseGoalFromSearchParams,
  startOfDay,
} from "@/lib/goal";
import {
  ACCENT_PRESETS,
  DEFAULT_ACCENT_ID,
  accentToQueryValue,
  hexToRgba,
  resolveAccentHex,
} from "@/lib/accent-color";
import { IphoneSetupGuide } from "@/components/iphone-setup-guide";
import {
  DEVICE_PRESETS,
  DEFAULT_DEVICE_PRESET,
  WALLPAPER_UNSUPPORTED_MESSAGE,
  isSupportedMobileWallpaperSize,
} from "@/lib/device-presets";

type GoalMode = "range" | "duration";

function getYearCalendarStats(now = new Date()) {
  const startOf2026 = new Date(2026, 0, 1);
  const endOf2026 = new Date(2026, 11, 31);
  let daysPassed = 0;

  if (now >= startOf2026 && now <= endOf2026) {
    daysPassed =
      Math.floor(
        (now.getTime() - startOf2026.getTime()) / (1000 * 60 * 60 * 24),
      ) + 1;
  } else if (now > endOf2026) {
    daysPassed = 365;
  }

  return {
    daysPassed,
    daysRemaining: 365 - daysPassed,
    percentage: ((daysPassed / 365) * 100).toFixed(1),
  };
}

export default function WallpaperGenerator() {
  const [deviceWidth, setDeviceWidth] = useState(DEFAULT_DEVICE_PRESET.w);
  const [deviceHeight, setDeviceHeight] = useState(DEFAULT_DEVICE_PRESET.h);
  const [mounted, setMounted] = useState(false);

  const [goalTitle, setGoalTitle] = useState("Learn Spanish");
  const [goalMode, setGoalMode] = useState<GoalMode>("duration");
  const [goalStart, setGoalStart] = useState("");
  const [goalEnd, setGoalEnd] = useState("");
  const [goalDays, setGoalDays] = useState(60);
  const [accentId, setAccentId] = useState(DEFAULT_ACCENT_ID);
  const [customAccent, setCustomAccent] = useState("#14b8a6");
  const [activeTab, setActiveTab] = useState("calendar");

  const accentHex = resolveAccentHex(accentId, customAccent);
  const accentQuery = accentToQueryValue(accentId, customAccent);

  useEffect(() => {
    setMounted(true);
    const today = formatDate(startOfDay(new Date()));
    setGoalStart(today);
    setGoalEnd(formatDate(addDays(startOfDay(new Date()), 59)));
  }, []);

  const calendarUrl = buildCalendarWallpaperPath({
    width: deviceWidth,
    height: deviceHeight,
    accent: accentQuery,
  });

  const goalUrl = useMemo(() => {
    if (!goalStart) return "";

    if (goalMode === "range") {
      if (!goalEnd) return "";
      return buildGoalWallpaperPath({
        title: goalTitle,
        start: goalStart,
        end: goalEnd,
        width: deviceWidth,
        height: deviceHeight,
        accent: accentQuery,
      });
    }

    return buildGoalWallpaperPath({
      title: goalTitle,
      start: goalStart,
      days: goalDays,
      width: deviceWidth,
      height: deviceHeight,
      accent: accentQuery,
    });
  }, [
    accentQuery,
    deviceWidth,
    deviceHeight,
    goalDays,
    goalEnd,
    goalMode,
    goalStart,
    goalTitle,
  ]);

  const goalStats = useMemo(() => {
    if (!goalUrl) return null;

    const params = new URLSearchParams(goalUrl.split("?")[1]);
    const result = parseGoalFromSearchParams(params);
    return "error" in result ? null : result;
  }, [goalUrl]);

  const calendarStats = getYearCalendarStats();
  const sizeSupported = isSupportedMobileWallpaperSize(
    deviceWidth,
    deviceHeight,
  );
  const activeWallpaperUrl =
    activeTab === "goal" ? goalUrl : calendarUrl;

  const downloadWallpaper = async (url: string, filename: string) => {
    const response = await fetch(url);
    if (!response.ok) return;
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = filename;
    link.href = objectUrl;
    link.click();
    URL.revokeObjectURL(objectUrl);
  };

  const handleGoalModeChange = (mode: GoalMode) => {
    setGoalMode(mode);
    if (!goalStart) return;

    const start = startOfDay(new Date(goalStart + "T00:00:00"));
    if (mode === "duration") {
      setGoalEnd(formatDate(addDays(start, goalDays - 1)));
    } else if (goalEnd) {
      const end = startOfDay(new Date(goalEnd + "T00:00:00"));
      const diff =
        Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) +
        1;
      if (diff > 0) setGoalDays(diff);
    }
  };

  const handleGoalDaysChange = (days: number) => {
    setGoalDays(days);
    if (goalStart) {
      const start = startOfDay(new Date(goalStart + "T00:00:00"));
      setGoalEnd(formatDate(addDays(start, days - 1)));
    }
  };

  const handleGoalStartChange = (value: string) => {
    setGoalStart(value);
    if (!value) return;

    const start = startOfDay(new Date(value + "T00:00:00"));
    if (goalMode === "duration") {
      setGoalEnd(formatDate(addDays(start, goalDays - 1)));
    }
  };

  const handleGoalEndChange = (value: string) => {
    setGoalEnd(value);
    if (!value || !goalStart) return;

    const start = startOfDay(new Date(goalStart + "T00:00:00"));
    const end = startOfDay(new Date(value + "T00:00:00"));
    const diff =
      Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    if (diff > 0) setGoalDays(diff);
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-balance">
              Wallpaper Generator
            </h1>
            <p className="text-neutral-400 text-lg max-w-lg mx-auto text-pretty">
              Generate year calendars or custom goal countdown wallpapers with a
              dot for each day.
            </p>
          </div>

          <AccentColorPicker
            accentId={accentId}
            customAccent={customAccent}
            accentHex={accentHex}
            onAccentIdChange={setAccentId}
            onCustomAccentChange={setCustomAccent}
          />

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="gap-8"
          >
            <TabsList className="mx-auto bg-neutral-900 border border-neutral-800">
              <TabsTrigger
                value="calendar"
                style={
                  activeTab === "calendar"
                    ? {
                        backgroundColor: hexToRgba(accentHex, 0.1),
                        color: accentHex,
                      }
                    : undefined
                }
              >
                <Calendar className="w-4 h-4 mr-2" />
                Year Calendar
              </TabsTrigger>
              <TabsTrigger
                value="goal"
                style={
                  activeTab === "goal"
                    ? {
                        backgroundColor: hexToRgba(accentHex, 0.1),
                        color: accentHex,
                      }
                    : undefined
                }
              >
                <Target className="w-4 h-4 mr-2" />
                Goal Wallpaper
              </TabsTrigger>
            </TabsList>

            <TabsContent value="calendar" className="space-y-8">
              <div className="text-center">
                <div
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm mb-4"
                  style={{
                    backgroundColor: hexToRgba(accentHex, 0.1),
                    color: accentHex,
                  }}
                >
                  <Calendar className="w-4 h-4" />
                  2026 Calendar
                </div>
                <p className="text-neutral-400 max-w-md mx-auto">
                  All 365 days of 2026. Passed days are white, today uses your
                  accent color, future days are gray.
                </p>
              </div>

              <StatsGrid
                accentHex={accentHex}
                items={[
                  { label: "Days Passed", value: calendarStats.daysPassed },
                  {
                    label: "Days Remaining",
                    value: calendarStats.daysRemaining,
                  },
                  {
                    label: "Year Complete",
                    value: `${calendarStats.percentage}%`,
                  },
                ]}
              />

              <div className="bg-neutral-900 rounded-2xl p-6 md:p-8 border border-neutral-800">
                <DimensionConfig
                  idPrefix="calendar"
                  deviceWidth={deviceWidth}
                  deviceHeight={deviceHeight}
                  onWidthChange={setDeviceWidth}
                  onHeightChange={setDeviceHeight}
                  wallpaperUrl={sizeSupported ? calendarUrl : ""}
                  mounted={mounted}
                  accentHex={accentHex}
                  sizeSupported={sizeSupported}
                />
              </div>

              <PreviewCard
                wallpaperUrl={calendarUrl}
                deviceWidth={deviceWidth}
                deviceHeight={deviceHeight}
                alt="2026 Calendar Wallpaper"
                footer={`Today is day ${calendarStats.daysPassed} of 2026`}
                accentHex={accentHex}
                sizeSupported={sizeSupported}
                onDownload={() =>
                  downloadWallpaper(
                    calendarUrl,
                    `2026-calendar-${formatDate(new Date())}.png`,
                  )
                }
              />
            </TabsContent>

            <TabsContent value="goal" className="space-y-8">
              <div className="text-center">
                <div
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm mb-4"
                  style={{
                    backgroundColor: hexToRgba(accentHex, 0.1),
                    color: accentHex,
                  }}
                >
                  <Target className="w-4 h-4" />
                  Goal Countdown
                </div>
                <p className="text-neutral-400 max-w-md mx-auto">
                  Set a start and end date, or pick a duration like 60 days. Each
                  dot is one day toward your goal.
                </p>
              </div>

              {goalStats ? (
                <StatsGrid
                  accentHex={accentHex}
                  items={[
                    { label: "Days Passed", value: goalStats.daysPassed },
                    { label: "Days Remaining", value: goalStats.daysLeft },
                    {
                      label: "Progress",
                      value: `${goalStats.percentage}%`,
                    },
                  ]}
                />
              ) : null}

              <div className="bg-neutral-900 rounded-2xl p-6 md:p-8 border border-neutral-800 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="goal-title" className="text-neutral-300">
                    Goal name
                  </Label>
                  <Input
                    id="goal-title"
                    value={goalTitle}
                    onChange={(e) => setGoalTitle(e.target.value)}
                    placeholder="e.g. Run every day"
                    className="bg-neutral-800 border-neutral-700 text-neutral-100"
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-neutral-300">Goal type</Label>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleGoalModeChange("duration")}
                      className="border-neutral-700"
                      style={
                        goalMode === "duration"
                          ? {
                              backgroundColor: hexToRgba(accentHex, 0.1),
                              color: accentHex,
                              borderColor: hexToRgba(accentHex, 0.5),
                            }
                          : { color: "#a3a3a3" }
                      }
                    >
                      Duration (e.g. 60 days)
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleGoalModeChange("range")}
                      className="border-neutral-700"
                      style={
                        goalMode === "range"
                          ? {
                              backgroundColor: hexToRgba(accentHex, 0.1),
                              color: accentHex,
                              borderColor: hexToRgba(accentHex, 0.5),
                            }
                          : { color: "#a3a3a3" }
                      }
                    >
                      Start & end dates
                    </Button>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="goal-start" className="text-neutral-300">
                      Start date
                    </Label>
                    <Input
                      id="goal-start"
                      type="date"
                      value={goalStart}
                      onChange={(e) => handleGoalStartChange(e.target.value)}
                      className="bg-neutral-800 border-neutral-700 text-neutral-100"
                    />
                  </div>

                  {goalMode === "duration" ? (
                    <div className="space-y-2">
                      <Label htmlFor="goal-days" className="text-neutral-300">
                        Duration (days)
                      </Label>
                      <Input
                        id="goal-days"
                        type="number"
                        min={1}
                        max={9999}
                        value={goalDays}
                        onChange={(e) =>
                          handleGoalDaysChange(Number(e.target.value))
                        }
                        className="bg-neutral-800 border-neutral-700 text-neutral-100"
                      />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label htmlFor="goal-end" className="text-neutral-300">
                        End date
                      </Label>
                      <Input
                        id="goal-end"
                        type="date"
                        value={goalEnd}
                        onChange={(e) => handleGoalEndChange(e.target.value)}
                        className="bg-neutral-800 border-neutral-700 text-neutral-100"
                      />
                    </div>
                  )}
                </div>

                {goalMode === "duration" && goalEnd ? (
                  <p className="text-sm text-neutral-500">
                    Ends on {goalEnd}
                  </p>
                ) : null}

                <DimensionConfig
                  idPrefix="goal"
                  deviceWidth={deviceWidth}
                  deviceHeight={deviceHeight}
                  onWidthChange={setDeviceWidth}
                  onHeightChange={setDeviceHeight}
                  wallpaperUrl={sizeSupported ? goalUrl : ""}
                  mounted={mounted}
                  showPresets
                  accentHex={accentHex}
                  sizeSupported={sizeSupported}
                />
              </div>

              {goalUrl ? (
                <PreviewCard
                  wallpaperUrl={goalUrl}
                  deviceWidth={deviceWidth}
                  deviceHeight={deviceHeight}
                  alt="Goal Wallpaper"
                  footer={
                    goalStats
                      ? `Day ${goalStats.daysPassed} of ${goalStats.totalDays} · ${goalStats.subtitle}`
                      : undefined
                  }
                  accentHex={accentHex}
                  sizeSupported={sizeSupported}
                  onDownload={() =>
                    downloadWallpaper(
                      goalUrl,
                      `goal-${formatDate(new Date())}.png`,
                    )
                  }
                />
              ) : null}
            </TabsContent>
          </Tabs>

          <IphoneSetupGuide
            wallpaperUrl={sizeSupported ? activeWallpaperUrl : ""}
            mounted={mounted}
            accentHex={accentHex}
          />

          <div className="mt-8 text-center text-neutral-600 text-sm">
            <p>
              Wallpapers update daily based on the current date. Use the iPhone
              guide above or bookmark the direct URL to keep progress in sync.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

function AccentColorPicker({
  accentId,
  customAccent,
  accentHex,
  onAccentIdChange,
  onCustomAccentChange,
}: {
  accentId: string;
  customAccent: string;
  accentHex: string;
  onAccentIdChange: (value: string) => void;
  onCustomAccentChange: (value: string) => void;
}) {
  return (
    <div className="bg-neutral-900 rounded-2xl p-6 md:p-8 mb-8 border border-neutral-800">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <Label className="text-neutral-300 text-sm">Accent color</Label>
          <p className="text-neutral-500 text-sm mt-1">
            Applies to both year calendar and goal wallpapers.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span
            className="text-sm font-medium"
            style={{ color: accentHex }}
          >
            {accentId === "custom"
              ? customAccent.toUpperCase()
              : ACCENT_PRESETS.find((preset) => preset.id === accentId)?.name}
          </span>
          <div
            className="w-8 h-8 rounded-full border border-neutral-700"
            style={{ backgroundColor: accentHex }}
          />
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        {ACCENT_PRESETS.map((preset) => {
          const isSelected = accentId === preset.id;
          return (
            <button
              key={preset.id}
              type="button"
              aria-label={preset.name}
              title={preset.name}
              onClick={() => onAccentIdChange(preset.id)}
              className="w-10 h-10 rounded-full border-2 transition-transform hover:scale-105"
              style={{
                backgroundColor: preset.hex,
                borderColor: isSelected ? "#ffffff" : "transparent",
                boxShadow: isSelected
                  ? `0 0 0 2px ${hexToRgba(preset.hex, 0.35)}`
                  : undefined,
              }}
            />
          );
        })}
        <button
          type="button"
          aria-label="Custom color"
          title="Custom color"
          onClick={() => onAccentIdChange("custom")}
          className="w-10 h-10 rounded-full border-2 border-dashed border-neutral-600 flex items-center justify-center text-xs text-neutral-400"
          style={
            accentId === "custom"
              ? {
                  backgroundColor: accentHex,
                  borderColor: "#ffffff",
                  color: "#171717",
                }
              : undefined
          }
        >
          +
        </button>
      </div>

      {accentId === "custom" ? (
        <div className="mt-5 flex items-center gap-3">
          <Input
            type="color"
            value={customAccent}
            onChange={(e) => onCustomAccentChange(e.target.value)}
            className="w-14 h-10 p-1 bg-neutral-800 border-neutral-700 cursor-pointer"
          />
          <Input
            value={customAccent}
            onChange={(e) => onCustomAccentChange(e.target.value)}
            placeholder="#14b8a6"
            className="max-w-[140px] bg-neutral-800 border-neutral-700 text-neutral-100"
          />
        </div>
      ) : null}
    </div>
  );
}

function StatsGrid({
  items,
  accentHex,
}: {
  items: { label: string; value: string | number }[];
  accentHex: string;
}) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="bg-neutral-900 rounded-xl p-4 text-center border border-neutral-800"
        >
          <div className="text-3xl font-bold" style={{ color: accentHex }}>
            {item.value}
          </div>
          <div className="text-neutral-500 text-sm">{item.label}</div>
        </div>
      ))}
    </div>
  );
}

function DimensionConfig({
  idPrefix,
  deviceWidth,
  deviceHeight,
  onWidthChange,
  onHeightChange,
  wallpaperUrl,
  mounted,
  showPresets = true,
  accentHex,
  sizeSupported,
}: {
  idPrefix: string;
  deviceWidth: number;
  deviceHeight: number;
  onWidthChange: (value: number) => void;
  onHeightChange: (value: number) => void;
  wallpaperUrl: string;
  mounted: boolean;
  showPresets?: boolean;
  accentHex: string;
  sizeSupported: boolean;
}) {
  return (
    <div className={showPresets ? "" : "pt-0"}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={`${idPrefix}-width`} className="text-neutral-300">
            Width (px)
          </Label>
          <Input
            id={`${idPrefix}-width`}
            type="number"
            value={deviceWidth}
            onChange={(e) => onWidthChange(Number(e.target.value))}
            className="bg-neutral-800 border-neutral-700 text-neutral-100"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${idPrefix}-height`} className="text-neutral-300">
            Height (px)
          </Label>
          <Input
            id={`${idPrefix}-height`}
            type="number"
            value={deviceHeight}
            onChange={(e) => onHeightChange(Number(e.target.value))}
            className="bg-neutral-800 border-neutral-700 text-neutral-100"
          />
        </div>
      </div>

      {!sizeSupported ? (
        <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {WALLPAPER_UNSUPPORTED_MESSAGE}
        </div>
      ) : null}

      {showPresets ? (
        <div className="mt-6 pt-6 border-t border-neutral-800">
          <Label className="text-neutral-300 text-sm mb-3 block">
            Quick Presets (phones only)
          </Label>
          <p className="text-neutral-500 text-xs mb-3">
            iPhone 13 through iPhone 17. Desktop sizes are not supported.
          </p>
          <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-1">
            {DEVICE_PRESETS.map((preset) => {
              const isSelected =
                deviceWidth === preset.w && deviceHeight === preset.h;
              return (
                <Button
                  key={preset.name}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onWidthChange(preset.w);
                    onHeightChange(preset.h);
                  }}
                  className="text-xs border-neutral-700 hover:bg-neutral-800"
                  style={
                    isSelected
                      ? {
                          backgroundColor: hexToRgba(accentHex, 0.1),
                          color: accentHex,
                          borderColor: hexToRgba(accentHex, 0.5),
                        }
                      : { color: "#a3a3a3" }
                  }
                >
                  {preset.name}
                </Button>
              );
            })}
          </div>
        </div>
      ) : null}

      {wallpaperUrl && sizeSupported ? (
        <div className="mt-6 pt-6 border-t border-neutral-800">
          <Label className="text-neutral-300 text-sm mb-2 block">
            Direct URL
          </Label>
          <div className="flex gap-2">
            <code
              className="flex-1 bg-neutral-800 px-4 py-2 rounded-lg text-sm overflow-x-auto"
              style={{ color: accentHex }}
            >
              {mounted && typeof window !== "undefined"
                ? `${window.location.origin}${wallpaperUrl}`
                : wallpaperUrl}
            </code>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(wallpaperUrl, "_blank")}
              className="border-neutral-700 text-neutral-400"
              style={{ color: accentHex }}
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function PreviewCard({
  wallpaperUrl,
  deviceWidth,
  deviceHeight,
  alt,
  footer,
  onDownload,
  accentHex,
  sizeSupported,
}: {
  wallpaperUrl: string;
  deviceWidth: number;
  deviceHeight: number;
  alt: string;
  footer?: string;
  onDownload: () => void;
  accentHex: string;
  sizeSupported: boolean;
}) {
  return (
    <div className="bg-neutral-900 rounded-2xl p-6 md:p-8 border border-neutral-800">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Preview</h2>
        <Button
          onClick={onDownload}
          disabled={!sizeSupported}
          className="text-neutral-950 disabled:opacity-40"
          style={{ backgroundColor: accentHex }}
        >
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>
      </div>

      {sizeSupported ? (
        <>
          <div className="flex justify-center">
            <div
              className="relative rounded-lg overflow-hidden shadow-2xl border border-neutral-800"
              style={{
                maxWidth: "100%",
                maxHeight: "70vh",
                aspectRatio: `${deviceWidth}/${deviceHeight}`,
              }}
            >
              <img
                src={wallpaperUrl}
                alt={alt}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          {footer ? (
            <div className="mt-6 text-center text-neutral-500 text-sm">
              {footer}
            </div>
          ) : null}
        </>
      ) : (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-10 text-center">
          <p className="text-red-300 font-medium">
            This wallpaper can&apos;t be generated
          </p>
          <p className="text-red-300/80 text-sm mt-2 max-w-md mx-auto">
            {WALLPAPER_UNSUPPORTED_MESSAGE}
          </p>
        </div>
      )}
    </div>
  );
}
