"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, Calendar, ExternalLink } from "lucide-react";

export default function YearCalendarWallpaper() {
  const [deviceWidth, setDeviceWidth] = useState(1179);
  const [deviceHeight, setDeviceHeight] = useState(2556);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const wallpaperUrl = `/days?width=${deviceWidth}&height=${deviceHeight}`;

  const downloadWallpaper = async () => {
    const response = await fetch(wallpaperUrl);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = `2026-calendar-${new Date().toISOString().split("T")[0]}.png`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Calculate days passed in 2026
  const now = new Date();
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

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-400 text-sm mb-4">
              <Calendar className="w-4 h-4" />
              2026 Calendar
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-balance">
              Year Calendar Wallpaper
            </h1>
            <p className="text-neutral-400 text-lg max-w-md mx-auto text-pretty">
              A beautiful wallpaper showing all 365 days of 2026. Days that have
              passed are marked in teal.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-neutral-900 rounded-xl p-4 text-center border border-neutral-800">
              <div className="text-3xl font-bold text-teal-400">
                {daysPassed}
              </div>
              <div className="text-neutral-500 text-sm">Days Passed</div>
            </div>
            <div className="bg-neutral-900 rounded-xl p-4 text-center border border-neutral-800">
              <div className="text-3xl font-bold text-neutral-400">
                {365 - daysPassed}
              </div>
              <div className="text-neutral-500 text-sm">Days Remaining</div>
            </div>
            <div className="bg-neutral-900 rounded-xl p-4 text-center border border-neutral-800">
              <div className="text-3xl font-bold text-neutral-300">
                {((daysPassed / 365) * 100).toFixed(1)}%
              </div>
              <div className="text-neutral-500 text-sm">Year Complete</div>
            </div>
          </div>

          {/* Configuration */}
          <div className="bg-neutral-900 rounded-2xl p-6 md:p-8 mb-8 border border-neutral-800">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="width" className="text-neutral-300">
                  Width (px)
                </Label>
                <Input
                  id="width"
                  type="number"
                  value={deviceWidth}
                  onChange={(e) => setDeviceWidth(Number(e.target.value))}
                  className="bg-neutral-800 border-neutral-700 text-neutral-100"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="height" className="text-neutral-300">
                  Height (px)
                </Label>
                <Input
                  id="height"
                  type="number"
                  value={deviceHeight}
                  onChange={(e) => setDeviceHeight(Number(e.target.value))}
                  className="bg-neutral-800 border-neutral-700 text-neutral-100"
                />
              </div>
            </div>

            {/* Device Presets */}
            <div className="mt-6 pt-6 border-t border-neutral-800">
              <Label className="text-neutral-300 text-sm mb-3 block">
                Quick Presets
              </Label>
              <div className="flex flex-wrap gap-2">
                {[
                  { name: "iPhone 15 Pro", w: 1179, h: 2556 },
                  { name: "iPhone 15 Pro Max", w: 1290, h: 2796 },
                  { name: "iPhone SE", w: 750, h: 1334 },
                  { name: "Android (1080p)", w: 1080, h: 2400 },
                  { name: "Desktop 4K", w: 3840, h: 2160 },
                ].map((preset) => (
                  <Button
                    key={preset.name}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setDeviceWidth(preset.w);
                      setDeviceHeight(preset.h);
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

            {/* API URL */}
            <div className="mt-6 pt-6 border-t border-neutral-800">
              <Label className="text-neutral-300 text-sm mb-2 block">
                Direct URL
              </Label>
              <div className="flex gap-2">
                <code className="flex-1 bg-neutral-800 px-4 py-2 rounded-lg text-teal-400 text-sm overflow-x-auto">
                  {mounted
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
          </div>

          {/* Preview */}
          <div className="bg-neutral-900 rounded-2xl p-6 md:p-8 border border-neutral-800">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Preview</h2>
              <Button
                onClick={downloadWallpaper}
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
                  src={wallpaperUrl || "/placeholder.svg"}
                  alt="2026 Calendar Wallpaper"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            <div className="mt-6 text-center text-neutral-500 text-sm">
              Today is day {daysPassed} of 2026
            </div>
          </div>

          {/* Info */}
          <div className="mt-8 text-center text-neutral-600 text-sm">
            <p>
              This wallpaper updates daily. Bookmark the direct URL or generate
              a new one each day.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
