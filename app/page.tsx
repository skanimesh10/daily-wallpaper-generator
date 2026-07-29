"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Calendar, Target, ExternalLink } from "lucide-react";
import {
  addDays,
  buildGoalWallpaperPath,
  formatDate,
  parseGoalFromSearchParams,
  startOfDay,
} from "@/lib/goal";

const DEVICE_PRESETS = [
  { name: "iPhone 15 Pro", w: 1179, h: 2556 },
  { name: "iPhone 15 Pro Max", w: 1290, h: 2796 },
  { name: "iPhone SE", w: 750, h: 1334 },
  { name: "Android (1080p)", w: 1080, h: 2400 },
  { name: "Desktop 4K", w: 3840, h: 2160 },
] as const;

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
  const [deviceWidth, setDeviceWidth] = useState(1179);
  const [deviceHeight, setDeviceHeight] = useState(2556);
  const [mounted, setMounted] = useState(false);

  const [goalTitle, setGoalTitle] = useState("Learn Spanish");
  const [goalMode, setGoalMode] = useState<GoalMode>("duration");
  const [goalStart, setGoalStart] = useState("");
  const [goalEnd, setGoalEnd] = useState("");
  const [goalDays, setGoalDays] = useState(60);

  useEffect(() => {
    setMounted(true);
    const today = formatDate(startOfDay(new Date()));
    setGoalStart(today);
    setGoalEnd(formatDate(addDays(startOfDay(new Date()), 59)));
  }, []);

  const calendarUrl = `/days?width=${deviceWidth}&height=${deviceHeight}`;

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
      });
    }

    return buildGoalWallpaperPath({
      title: goalTitle,
      start: goalStart,
      days: goalDays,
      width: deviceWidth,
      height: deviceHeight,
    });
  }, [
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

          <Tabs defaultValue="calendar" className="gap-8">
            <TabsList className="mx-auto bg-neutral-900 border border-neutral-800">
              <TabsTrigger
                value="calendar"
                className="data-[state=active]:bg-teal-500/10 data-[state=active]:text-teal-400"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Year Calendar
              </TabsTrigger>
              <TabsTrigger
                value="goal"
                className="data-[state=active]:bg-teal-500/10 data-[state=active]:text-teal-400"
              >
                <Target className="w-4 h-4 mr-2" />
                Goal Wallpaper
              </TabsTrigger>
            </TabsList>

            <TabsContent value="calendar" className="space-y-8">
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-400 text-sm mb-4">
                  <Calendar className="w-4 h-4" />
                  2026 Calendar
                </div>
                <p className="text-neutral-400 max-w-md mx-auto">
                  All 365 days of 2026. Passed days are white, today is teal,
                  future days are gray.
                </p>
              </div>

              <StatsGrid
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
                  wallpaperUrl={calendarUrl}
                  mounted={mounted}
                />
              </div>

              <PreviewCard
                wallpaperUrl={calendarUrl}
                deviceWidth={deviceWidth}
                deviceHeight={deviceHeight}
                alt="2026 Calendar Wallpaper"
                footer={`Today is day ${calendarStats.daysPassed} of 2026`}
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
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-400 text-sm mb-4">
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
                      className={`border-neutral-700 ${
                        goalMode === "duration"
                          ? "bg-teal-500/10 text-teal-400 border-teal-500/50"
                          : "text-neutral-400"
                      }`}
                    >
                      Duration (e.g. 60 days)
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleGoalModeChange("range")}
                      className={`border-neutral-700 ${
                        goalMode === "range"
                          ? "bg-teal-500/10 text-teal-400 border-teal-500/50"
                          : "text-neutral-400"
                      }`}
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
                  wallpaperUrl={goalUrl}
                  mounted={mounted}
                  showPresets
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

          <div className="mt-8 text-center text-neutral-600 text-sm">
            <p>
              Wallpapers update daily based on the current date. Bookmark the
              direct URL to keep progress in sync.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

function StatsGrid({
  items,
}: {
  items: { label: string; value: string | number }[];
}) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="bg-neutral-900 rounded-xl p-4 text-center border border-neutral-800"
        >
          <div className="text-3xl font-bold text-teal-400">{item.value}</div>
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
}: {
  idPrefix: string;
  deviceWidth: number;
  deviceHeight: number;
  onWidthChange: (value: number) => void;
  onHeightChange: (value: number) => void;
  wallpaperUrl: string;
  mounted: boolean;
  showPresets?: boolean;
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

      {showPresets ? (
        <div className="mt-6 pt-6 border-t border-neutral-800">
          <Label className="text-neutral-300 text-sm mb-3 block">
            Quick Presets
          </Label>
          <div className="flex flex-wrap gap-2">
            {DEVICE_PRESETS.map((preset) => (
              <Button
                key={preset.name}
                variant="outline"
                size="sm"
                onClick={() => {
                  onWidthChange(preset.w);
                  onHeightChange(preset.h);
                }}
                className={`text-xs border-neutral-700 hover:bg-neutral-800 hover:text-teal-400 ${
                  deviceWidth === preset.w && deviceHeight === preset.h
                    ? "bg-teal-500/10 text-teal-400 border-teal-500/50"
                    : "text-neutral-400"
                }`}
              >
                {preset.name}
              </Button>
            ))}
          </div>
        </div>
      ) : null}

      {wallpaperUrl ? (
        <div className="mt-6 pt-6 border-t border-neutral-800">
          <Label className="text-neutral-300 text-sm mb-2 block">
            Direct URL
          </Label>
          <div className="flex gap-2">
            <code className="flex-1 bg-neutral-800 px-4 py-2 rounded-lg text-teal-400 text-sm overflow-x-auto">
              {mounted && typeof window !== "undefined"
                ? `${window.location.origin}${wallpaperUrl}`
                : wallpaperUrl}
            </code>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(wallpaperUrl, "_blank")}
              className="border-neutral-700 text-neutral-400 hover:text-teal-400"
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
}: {
  wallpaperUrl: string;
  deviceWidth: number;
  deviceHeight: number;
  alt: string;
  footer?: string;
  onDownload: () => void;
}) {
  return (
    <div className="bg-neutral-900 rounded-2xl p-6 md:p-8 border border-neutral-800">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Preview</h2>
        <Button
          onClick={onDownload}
          className="bg-teal-500 hover:bg-teal-600 text-neutral-950"
        >
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>
      </div>

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
        <div className="mt-6 text-center text-neutral-500 text-sm">{footer}</div>
      ) : null}
    </div>
  );
}
