const MS_PER_DAY = 1000 * 60 * 60 * 24;

export type GoalInput =
  | { start: Date; end: Date }
  | { start: Date; days: number };

export type GoalProgress = {
  title: string;
  start: Date;
  end: Date;
  totalDays: number;
  daysPassed: number;
  daysLeft: number;
  percentage: number;
  subtitle: string;
};

export function parseDateParam(value: string | null): Date | null {
  if (!value) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return startOfDay(result);
}

export function daysBetweenInclusive(start: Date, end: Date): number {
  return (
    Math.floor((end.getTime() - start.getTime()) / MS_PER_DAY) + 1
  );
}

export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatDisplayDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function parseGoalFromSearchParams(
  searchParams: URLSearchParams,
  now = new Date(),
): GoalProgress | { error: string } {
  const title = (searchParams.get("title") || "My Goal").trim() || "My Goal";
  const startParam = searchParams.get("start");
  const endParam = searchParams.get("end");
  const daysParam = searchParams.get("days");

  const today = startOfDay(now);
  const start = parseDateParam(startParam) ?? today;

  if (endParam && daysParam) {
    return { error: "Provide either end date or days, not both" };
  }

  let end: Date;

  if (endParam) {
    const parsedEnd = parseDateParam(endParam);
    if (!parsedEnd) {
      return { error: "Invalid end date. Use YYYY-MM-DD" };
    }
    end = parsedEnd;
  } else if (daysParam) {
    const days = Number(daysParam);
    if (!Number.isFinite(days) || days < 1 || days > 9999) {
      return { error: "Days must be a number between 1 and 9999" };
    }
    end = addDays(start, days - 1);
  } else {
    return { error: "Provide an end date (end=YYYY-MM-DD) or duration (days=N)" };
  }

  if (startParam && !parseDateParam(startParam)) {
    return { error: "Invalid start date. Use YYYY-MM-DD" };
  }

  if (end < start) {
    return { error: "End date must be on or after start date" };
  }

  const totalDays = daysBetweenInclusive(start, end);
  let daysPassed = 0;

  if (now >= start) {
    daysPassed = Math.min(
      daysBetweenInclusive(start, startOfDay(now)),
      totalDays,
    );
  }

  const daysLeft = Math.max(totalDays - daysPassed, 0);
  const percentage =
    totalDays > 0 ? Math.round((daysPassed / totalDays) * 100) : 0;

  const subtitle = `${formatDisplayDate(start)} → ${formatDisplayDate(end)}`;

  return {
    title,
    start,
    end,
    totalDays,
    daysPassed,
    daysLeft,
    percentage,
    subtitle,
  };
}

export function buildGoalWallpaperPath(
  params: {
    title: string;
    start?: string;
    end?: string;
    days?: number;
    width: number;
    height: number;
    accent?: string;
  },
): string {
  const search = new URLSearchParams({
    title: params.title,
    width: String(params.width),
    height: String(params.height),
  });

  if (params.start) search.set("start", params.start);
  if (params.end) search.set("end", params.end);
  if (params.days) search.set("days", String(params.days));
  if (params.accent) search.set("accent", params.accent);

  return `/goal?${search.toString()}`;
}

export function buildCalendarWallpaperPath(params: {
  width: number;
  height: number;
  accent?: string;
}): string {
  const search = new URLSearchParams({
    width: String(params.width),
    height: String(params.height),
  });

  if (params.accent) search.set("accent", params.accent);

  return `/days?${search.toString()}`;
}
