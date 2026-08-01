"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Check, Copy, Smartphone } from "lucide-react";
import { hexToRgba } from "@/lib/accent-color";

type IphoneSetupGuideProps = {
  wallpaperUrl: string;
  mounted: boolean;
  accentHex: string;
};

const STEPS = [
  {
    title: "Copy your Direct URL",
    body: "Use the wallpaper link from this page (Year Calendar or Goal). That URL regenerates a fresh image every day.",
  },
  {
    title: "Open Shortcuts → Automation",
    body: "On your iPhone, open the Shortcuts app, tap Automation, then + → Create Personal Automation.",
  },
  {
    title: "Choose Time of Day",
    body: "Pick a daily time (for example 6:00 AM), select Daily, then tap Next.",
  },
  {
    title: "Add Get Contents of URL",
    body: "Search for “Get Contents of URL”, paste your Direct URL into the URL field.",
  },
  {
    title: "Add Set Wallpaper",
    body: "Search for “Set Wallpaper”, set Photo to Contents of URL, and choose Lock Screen, Home Screen, or both.",
  },
  {
    title: "Run Immediately (important)",
    body: "After saving, open the automation, turn on Run Immediately, and turn off Notify When Run so it updates silently each morning.",
  },
] as const;

export function IphoneSetupGuide({
  wallpaperUrl,
  mounted,
  accentHex,
}: IphoneSetupGuideProps) {
  const [copied, setCopied] = useState(false);
  const absoluteUrl =
    mounted && typeof window !== "undefined"
      ? `${window.location.origin}${wallpaperUrl}`
      : wallpaperUrl;

  const copyUrl = async () => {
    if (!absoluteUrl) return;
    try {
      await navigator.clipboard.writeText(absoluteUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section className="mt-12 bg-neutral-900 rounded-2xl p-6 md:p-8 border border-neutral-800">
      <div className="flex items-start gap-3 mb-6">
        <div
          className="rounded-xl p-2.5 shrink-0"
          style={{
            backgroundColor: hexToRgba(accentHex, 0.12),
            color: accentHex,
          }}
        >
          <Smartphone className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            Auto-update on iPhone
          </h2>
          <p className="text-neutral-400 text-sm mt-1 max-w-2xl">
            Set a daily Shortcuts automation so your lock/home screen wallpaper
            refreshes from this site automatically — same setup as the example
            below.
          </p>
        </div>
      </div>

      <div className="mb-8">
        <Label className="text-neutral-300 text-sm mb-2 block">
          Your wallpaper URL for Shortcuts
        </Label>
        <div className="flex gap-2">
          <code
            className="flex-1 bg-neutral-800 px-4 py-2.5 rounded-lg text-sm overflow-x-auto break-all"
            style={{ color: accentHex }}
          >
            {absoluteUrl || "Configure a wallpaper above to get a URL"}
          </code>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={copyUrl}
            disabled={!absoluteUrl}
            className="border-neutral-700 shrink-0"
            style={{ color: accentHex }}
          >
            {copied ? (
              <Check className="w-4 h-4" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </Button>
        </div>
        <p className="text-neutral-500 text-xs mt-2">
          Example shape:{" "}
          <span className="text-neutral-400">
            /goal?title=Notice+Period&amp;width=1179&amp;height=2556&amp;start=2026-06-09&amp;end=2026-09-10&amp;accent=red
          </span>
        </p>
      </div>

      <ol className="space-y-4">
        {STEPS.map((step, index) => (
          <li key={step.title} className="flex gap-4">
            <span
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-neutral-950"
              style={{ backgroundColor: accentHex }}
            >
              {index + 1}
            </span>
            <div className="pt-0.5">
              <p className="font-medium text-neutral-100">{step.title}</p>
              <p className="text-neutral-400 text-sm mt-1 leading-relaxed">
                {step.body}
              </p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-8 rounded-xl border border-neutral-800 bg-neutral-950/60 p-4 md:p-5">
        <p className="text-sm font-medium text-neutral-200 mb-3">
          Automation checklist
        </p>
        <ul className="space-y-2 text-sm text-neutral-400">
          <li>
            <span className="text-neutral-200">When:</span> Time of Day → e.g.
            6:00 AM, Daily
          </li>
          <li>
            <span className="text-neutral-200">Do:</span> Get Contents of URL →
            Set Wallpaper (Lock &amp; Home)
          </li>
          <li>
            <span className="text-neutral-200">Settings:</span> Run Immediately =
            On · Notify When Run = Off
          </li>
        </ul>
      </div>

      <p className="mt-6 text-neutral-500 text-xs leading-relaxed">
        Tip: pick your device preset above so width/height match your iPhone
        (e.g. iPhone 15 Pro = 1179×2556). If wallpaper doesn&apos;t change,
        open the automation once and confirm Shortcuts has wallpaper and network
        permission.
      </p>
    </section>
  );
}
